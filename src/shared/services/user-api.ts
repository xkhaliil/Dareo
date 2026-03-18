import { apiFetch, authHeaders } from "@/shared/lib/api";
import type { AuthUser } from "@/shared/stores/auth-store";

export function updateProfile(
  data: Record<string, string>,
  token: string | null,
): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/user/profile", {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}
