export const API_URL =
  import.meta.env?.VITE_API_URL &&
  String(import.meta.env.VITE_API_URL).trim() !== "undefined" &&
  String(import.meta.env.VITE_API_URL).trim() !== ""
    ? String(import.meta.env.VITE_API_URL).trim()
    : "http://localhost:3001";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, options);
  const data = await res.json();
  if (!res.ok)
    throw new ApiError(res.status, data.error || "Something went wrong");
  return data as T;
}

export function authHeaders(token: string | null): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
