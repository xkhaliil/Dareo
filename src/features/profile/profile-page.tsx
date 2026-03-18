import { useAuth } from "@/shared/context/auth-context";
import Navbar from "@/shared/components/navbar";
import PageBackground from "@/shared/components/page-background";
import PageFooter from "@/shared/components/page-footer";

import AccountDetails from "./components/account-details";
import ProfileHeader from "./components/profile-header";
import ProfileStats from "./components/profile-stats";
import { useProfileEdit } from "./hooks/use-profile-edit";

export default function ProfilePage() {
  const { user } = useAuth();

  const edit = useProfileEdit(user!);

  if (!user) return null;

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <PageBackground />
      <Navbar />
      <main className="relative z-10 flex-1 px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <ProfileHeader
            user={user}
            editing={edit.editing}
            avatarPreview={edit.avatarPreview}
            onAvatarChange={edit.handleAvatarChange}
            onStartEditing={edit.startEditing}
          />
          <ProfileStats user={user} />
          <AccountDetails
            user={user}
            editing={edit.editing}
            username={edit.username}
            onUsernameChange={edit.onUsernameChange}
            email={edit.email}
            onEmailChange={edit.onEmailChange}
            error={edit.error}
            isSaving={edit.isSaving}
            onSave={edit.save}
            onCancel={edit.cancelEditing}
          />
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
