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

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      `No pudimos conectar al servidor (${API_BASE_URL}). Verifica que el backend esté en marcha y que el teléfono/emulador esté en la misma red.`,
    );
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => undefined);
    const message = typeof errorBody?.detail === 'string' ? errorBody.detail : 'No pudimos completar esto. Intenta otra vez.';
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
