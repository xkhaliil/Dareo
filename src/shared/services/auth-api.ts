import { apiFetch } from "@/shared/lib/api";
import type { AuthUser } from "@/shared/stores/auth-store";

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export function signIn(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export function signUp(data: {
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/sign-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
