import Constants from 'expo-constants';
import { Platform } from 'react-native';

function resolveDevHost(): string | undefined {
  const debuggerHost = Constants.expoGoConfig?.debuggerHost;
  if (debuggerHost) {
    return debuggerHost.split(':')[0];
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return hostUri.split(':')[0];
  }

  return undefined;
}

function isLoopbackUrl(url: string) {
  return url.includes('127.0.0.1') || url.includes('localhost');
}

function resolveApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  const devHost = resolveDevHost();

  // En dispositivo/emulador, 127.0.0.1 apunta al propio teléfono, no al PC.
  if (envUrl && Platform.OS !== 'web' && isLoopbackUrl(envUrl) && devHost) {
    return `http://${devHost}:8000`;
  }

  if (envUrl) {
    return envUrl;
  }

  if (devHost && devHost !== 'localhost' && devHost !== '127.0.0.1') {
    return `http://${devHost}:8000`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }

  return 'http://127.0.0.1:8000';
}

export const API_BASE_URL = resolveApiBaseUrl();

const DEFAULT_API_TIMEOUT_MS = 15_000;

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, timeoutMs = DEFAULT_API_TIMEOUT_MS): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('La solicitud tardó demasiado. Verifica tu conexión e intenta de nuevo.');
      }
      throw new Error(
        `No pudimos conectar al servidor (${API_BASE_URL}). Verifica que el backend esté en marcha y que el teléfono/emulador esté en la misma red.`,
      );
    }

    if (response.status === 401) {
      onUnauthorized?.();
      throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.');
    }

    if (!response.ok) {
      const errorBody = await response.json().catch(() => undefined);
      const message = typeof errorBody?.detail === 'string' ? errorBody.detail : 'No pudimos completar esto. Intenta otra vez.';
      throw new Error(message);
    }

    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timeoutId);
  }
}
