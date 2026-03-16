import type { AuthUser } from "@/stores/auth-store";

import { apiFetch, authHeaders } from "@/lib/api";

export function updateProfile(
  data: Record<string, string>,
  token: string | null,
) {
  return apiFetch<AuthUser>("/api/user/profile", {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}
