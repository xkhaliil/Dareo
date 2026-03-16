import { updateProfile } from "@/services/user-api";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";

export function useUpdateProfile() {
  const token = useAuthStore((s) => s.token);
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (data: Record<string, string>) => updateProfile(data, token),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
    },
  });
}
