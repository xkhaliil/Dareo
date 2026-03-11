import { useState, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import Navbar from "@/components/navbar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dice5,
  Trophy,
  Zap,
  Calendar,
  Mail,
  User,
  Pencil,
  X,
  Upload,
  Loader2,
  Check,
} from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { useUpdateProfile } from "@/hooks/use-user-service";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("avatarUploader");
  const updateProfileMutation = useUpdateProfile();

  if (!user) return null;

  const rankColors: Record<string, string> = {
    ROOKIE: "bg-zinc-500/10 text-zinc-400",
    BRONZE: "bg-amber-500/10 text-amber-500",
    SILVER: "bg-slate-400/10 text-slate-400",
    GOLD: "bg-yellow-500/10 text-yellow-500",
    PLATINUM: "bg-cyan-500/10 text-cyan-400",
    DIAMOND: "bg-blue-500/10 text-blue-400",
    LEGEND: "bg-purple-500/10 text-purple-400",
  };

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

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function handleSave() {
    if (!user) return;
    setError(null);

    try {
      let avatarUrl: string | undefined;

      if (avatarFile) {
        const uploadResult = await startUpload([avatarFile]);
        if (uploadResult?.[0]?.ufsUrl) {
          avatarUrl = uploadResult[0].ufsUrl;
        }
      }

      const body: Record<string, string> = {};
      if (username !== user.username) body.username = username;
      if (email !== user.email) body.email = email;
      if (avatarUrl) body.avatarUrl = avatarUrl;

      // Only call API if something changed
      if (Object.keys(body).length === 0) {
        setEditing(false);
        return;
      }

      await updateProfileMutation.mutateAsync(body);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error — is the server running?");
    }
  }

  const displayAvatar = avatarPreview || user.avatarUrl;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-purple-500/10 blur-[120px] animate-pulse-glow" />
        <div
          className="absolute bottom-[-30%] right-[-10%] w-100 h-100 rounded-full bg-indigo-500/8 blur-[100px] animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <Navbar />

      <main className="relative z-10 flex-1 px-6 py-10">
        <div className="max-w-2xl mx-auto">
          {/* Profile header */}
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm mb-6 animate-fade-in">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center gap-4">
                {editing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="group relative size-24 rounded-full border-2 border-dashed border-border/60 hover:border-primary/50 bg-muted/30 flex items-center justify-center overflow-hidden transition-colors cursor-pointer"
                    >
                      {displayAvatar ? (
                        <img
                          src={displayAvatar}
                          alt="Avatar"
                          className="size-full object-cover"
                        />
                      ) : (
                        <Upload className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="size-5 text-white" />
                      </div>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <span className="text-xs text-muted-foreground">
                      Click to change avatar
                    </span>
                  </>
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
                    <h1 className="text-2xl font-bold tracking-tight mb-1">
                      {user.username}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                )}

                <Badge
                  className={`px-3 py-1 text-xs font-semibold ${rankColors[user.rank] ?? rankColors.ROOKIE}`}
                >
                  {user.rank}
                </Badge>

                {!editing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 cursor-pointer"
                    onClick={startEditing}
                  >
                    <Pencil className="size-3.5" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6 animate-fade-in-delay-1">
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Zap className="size-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.xp}</p>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="size-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Trophy className="size-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Level {user.level}</p>
                  <p className="text-xs text-muted-foreground">{user.rank}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account details */}
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm animate-fade-in-delay-2">
            <CardHeader>
              <CardTitle className="text-lg">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {editing ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-username">Username</Label>
                    <Input
                      id="edit-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <Separator />
                  <div className="grid gap-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Separator />
                  <div className="flex gap-3 pt-2">
                    <Button
                      className="flex-1 gap-2 cursor-pointer"
                      disabled={updateProfileMutation.isPending}
                      onClick={handleSave}
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" /> Saving…
                        </>
                      ) : (
                        <>
                          <Check className="size-4" /> Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 cursor-pointer"
                      disabled={updateProfileMutation.isPending}
                      onClick={cancelEditing}
                    >
                      <X className="size-4" /> Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <User className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Username</p>
                      <p className="text-sm font-medium">{user.username}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Mail className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Calendar className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Member since
                      </p>
                      <p className="text-sm font-medium">2026</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Dice5 className="size-3.5" />
            <span>© 2026 Dareo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
