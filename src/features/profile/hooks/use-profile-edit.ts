import { useState } from "react";

import type { AuthUser } from "@/shared/stores/auth-store";

import { useProfileSave } from "./use-profile-save";

/**
 * useProfileEdit — owns all editing state for the profile page.
 *
 * Separates business/state logic from the ProfilePage rendering component.
 * The page receives only what it needs to render; no raw setState calls leak
 * into JSX.
 */
export function useProfileEdit(user: AuthUser) {
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const { save, error, setError, isSaving } = useProfileSave({
    user,
    username,
    email,
    avatarFile,
    onSuccess: () => setEditing(false),
  });

  function startEditing() {
    setUsername(user.username);
    setEmail(user.email);
    setAvatarPreview(null);
    setAvatarFile(null);
    setError(null);
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setError(null);
  }

  function handleAvatarChange(file: File, previewUrl: string) {
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
  }

  return {
    // State
    editing,
    username,
    email,
    avatarPreview,
    error,
    isSaving,

    // Actions
    startEditing,
    cancelEditing,
    handleAvatarChange,
    onUsernameChange: setUsername,
    onEmailChange: setEmail,
    save,
  };
}
