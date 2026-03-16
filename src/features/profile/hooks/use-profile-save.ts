import { useState } from "react";
import { useUploadThing } from "@/shared/lib/uploadthing";
import { useUpdateProfile } from "@/hooks/use-user-service";
import type { AuthUser } from "@/stores/auth-store";

interface UseProfileSaveOptions {
  user: AuthUser;
  username: string;
  email: string;
  avatarFile: File | null;
  onSuccess: () => void;
}

export function useProfileSave({ user, username, email, avatarFile, onSuccess }: UseProfileSaveOptions) {
  const [error, setError] = useState<string | null>(null);
  const { startUpload } = useUploadThing("avatarUploader");
  const updateProfileMutation = useUpdateProfile();

  async function save() {
    setError(null);
    try {
      let avatarUrl: string | undefined;

      if (avatarFile) {
        const uploadResult = await startUpload([avatarFile]);
        if (uploadResult?.[0]?.ufsUrl) avatarUrl = uploadResult[0].ufsUrl;
      }

      const body: Record<string, string> = {};
      if (username !== user.username) body.username = username;
      if (email !== user.email) body.email = email;
      if (avatarUrl) body.avatarUrl = avatarUrl;

      if (Object.keys(body).length === 0) {
        onSuccess();
        return;
      }

      await updateProfileMutation.mutateAsync(body);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error — is the server running?");
    }
  }

  return {
    save,
    error,
    setError,
    isSaving: updateProfileMutation.isPending,
  };
}
