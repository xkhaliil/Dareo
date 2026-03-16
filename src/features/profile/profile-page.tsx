import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import Navbar from "@/shared/components/navbar";
import PageBackground from "@/shared/components/page-background";
import PageFooter from "@/shared/components/page-footer";
import ProfileHeader from "./components/profile-header";
import ProfileStats from "./components/profile-stats";
import AccountDetails from "./components/account-details";
import { useProfileSave } from "./hooks/use-profile-save";

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const { save, error, setError, isSaving } = useProfileSave({
    user: user!,
    username,
    email,
    avatarFile,
    onSuccess: () => setEditing(false),
  });

  if (!user) return null;

  function startEditing() {
    setUsername(user!.username);
    setEmail(user!.email);
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageBackground />
      <Navbar />
      <main className="relative z-10 flex-1 px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <ProfileHeader
            user={user}
            editing={editing}
            avatarPreview={avatarPreview}
            onAvatarChange={handleAvatarChange}
            onStartEditing={startEditing}
          />
          <ProfileStats user={user} />
          <AccountDetails
            user={user}
            editing={editing}
            username={username}
            onUsernameChange={setUsername}
            email={email}
            onEmailChange={setEmail}
            error={error}
            isSaving={isSaving}
            onSave={save}
            onCancel={cancelEditing}
          />
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
