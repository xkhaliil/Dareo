import { apiFetch } from "@/lib/api";
import type { AuthUser } from "@/stores/auth-store";

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export function signIn(email: string, password: string) {
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
}) {
  return apiFetch<AuthResponse>("/api/auth/sign-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
