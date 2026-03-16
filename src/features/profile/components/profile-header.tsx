import AvatarUpload from "@/features/auth/components/avatar-upload";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import type { AuthUser } from "@/stores/auth-store";
import { Pencil } from "lucide-react";

const RANK_COLORS: Record<string, string> = {
  ROOKIE: "bg-zinc-500/10 text-zinc-400",
  BRONZE: "bg-amber-500/10 text-amber-500",
  SILVER: "bg-slate-400/10 text-slate-400",
  GOLD: "bg-yellow-500/10 text-yellow-500",
  PLATINUM: "bg-cyan-500/10 text-cyan-400",
  DIAMOND: "bg-blue-500/10 text-blue-400",
  LEGEND: "bg-purple-500/10 text-purple-400",
};

interface ProfileHeaderProps {
  user: AuthUser;
  editing: boolean;
  avatarPreview: string | null;
  onAvatarChange: (file: File, previewUrl: string) => void;
  onStartEditing: () => void;
}

export default function ProfileHeader({
  user,
  editing,
  avatarPreview,
  onAvatarChange,
  onStartEditing,
}: ProfileHeaderProps) {
  return (
    <Card className="bg-card/50 border-border/50 animate-fade-in mb-6 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          {editing ? (
            <AvatarUpload
              preview={avatarPreview || user.avatarUrl}
              onChange={onAvatarChange}
              label="Click to change avatar"
              size="md"
            />
          ) : (
            <Avatar className="size-24">
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.username} />
              )}
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}

          {!editing && (
            <div>
              <h1 className="mb-1 text-2xl font-bold tracking-tight">
                {user.username}
              </h1>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          )}

          <Badge
            className={`px-3 py-1 text-xs font-semibold ${RANK_COLORS[user.rank] ?? RANK_COLORS.ROOKIE}`}
          >
            {user.rank}
          </Badge>

          {!editing && (
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer gap-2"
              onClick={onStartEditing}
            >
              <Pencil className="size-3.5" /> Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
