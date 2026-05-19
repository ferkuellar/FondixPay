const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
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
