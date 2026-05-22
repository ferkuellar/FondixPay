const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export type AuthMeResponse = {
  id: number;
  phone?: string;
  name?: string | null;
  role?: string;
};

export async function getAuthMe(token: string): Promise<AuthMeResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error("No se pudo validar el token con /auth/me.");
  }
  return (await response.json()) as AuthMeResponse;
}
