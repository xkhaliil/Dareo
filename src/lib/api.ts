export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new ApiError(res.status, data.error || "Something went wrong");
  return data as T;
}

export function authHeaders(token: string | null): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}