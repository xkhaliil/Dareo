import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { useAuthStore, type AuthUser } from "@/shared/stores/auth-store";
import { updateProfile } from "@/shared/services/user-api";

export function useUpdateProfile(): UseMutationResult<
  AuthUser,
  Error,
  Record<string, string>
> {
  const token = useAuthStore((s) => s.token);
  const updateUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: (data: Record<string, string>) => updateProfile(data, token),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
    },
  });
}
