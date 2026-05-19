import { Platform } from 'react-native';

const LOCAL_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? LOCAL_API_URL;

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => undefined);
    const message = typeof errorBody?.detail === 'string' ? errorBody.detail : 'No pudimos completar esto. Intenta otra vez.';
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
