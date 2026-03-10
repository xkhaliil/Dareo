import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import Navbar from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Trophy,
  Zap,
  Plus,
  Dice5,
  LogIn,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

interface GroupPreview {
  id: string;
  name: string;
  code: string;
  members: { user: { id: string; username: string; avatarUrl: string | null } }[];
  myRole: string;
}

export default function GamePage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [groups, setGroups] = useState<GroupPreview[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  // Create group state
  const [createOpen, setCreateOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Join group state
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Copied code state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    try {
      const res = await fetch("/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoadingGroups(false);
    }
  }

  async function handleCreate() {
    if (!groupName.trim()) return;
    setCreating(true);
    setCreateError(null);

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: groupName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCreateError(data.error || "Something went wrong");
        setCreating(false);
        return;
      }

      setCreateOpen(false);
      setGroupName("");
      navigate(`/group/${data.id}`);
    } catch {
      setCreateError("Network error");
      setCreating(false);
    }
  }

  async function handleJoin() {
    if (!joinCode.trim()) return;
    setJoining(true);
    setJoinError(null);

    try {
      const res = await fetch("/api/groups/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: joinCode.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setJoinError(data.error || "Something went wrong");
        setJoining(false);
        return;
      }

      setJoinOpen(false);
      setJoinCode("");
      navigate(`/group/${data.id}`);
    } catch {
      setJoinError("Network error");
      setJoining(false);
    }
  }

  function copyCode(code: string, groupId: string) {
    navigator.clipboard.writeText(code);
    setCopiedId(groupId);
    setTimeout(() => setCopiedId(null), 2000);
  }

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
        <div className="max-w-5xl mx-auto">
          {/* Welcome */}
          <div className="mb-10 animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Welcome back,{" "}
              <span className="text-primary">{user?.username}</span> 🎲
            </h1>
            <p className="text-muted-foreground">
              Ready to take on some dares today?
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 animate-fade-in-delay-1">
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Zap className="size-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{user?.xp ?? 0}</p>
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
                  <p className="text-2xl font-bold">Level {user?.level ?? 1}</p>
                  <p className="text-xs text-muted-foreground">{user?.rank ?? "ROOKIE"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="size-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <Users className="size-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{groups.length}</p>
                  <p className="text-xs text-muted-foreground">Groups</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6 animate-fade-in-delay-2">
            {/* Create Group Dialog */}
            <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); setCreateError(null); setGroupName(""); }}>
              <DialogTrigger asChild>
                <Button className="gap-2 cursor-pointer">
                  <Plus className="size-4" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new group</DialogTitle>
                  <DialogDescription>
                    Give your group a name. You'll get a unique code to share with friends.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 pt-2">
                  {createError && (
                    <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                      {createError}
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="group-name">Group name</Label>
                    <Input
                      id="group-name"
                      placeholder="The Brave Squad"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />
                  </div>
                  <Button
                    className="w-full gap-2 cursor-pointer"
                    disabled={creating || !groupName.trim()}
                    onClick={handleCreate}
                  >
                    {creating ? (
                      <><Loader2 className="size-4 animate-spin" /> Creating…</>
                    ) : (
                      <><Plus className="size-4" /> Create Group</>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Join Group Dialog */}
            <Dialog open={joinOpen} onOpenChange={(o) => { setJoinOpen(o); setJoinError(null); setJoinCode(""); }}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 cursor-pointer">
                  <LogIn className="size-4" />
                  Join Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join a group</DialogTitle>
                  <DialogDescription>
                    Enter the invite code shared by the group owner.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 pt-2">
                  {joinError && (
                    <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                      {joinError}
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="group-code">Invite code</Label>
                    <Input
                      id="group-code"
                      placeholder="A1B2C3D4"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                      className="uppercase tracking-widest text-center font-mono"
                    />
                  </div>
                  <Button
                    className="w-full gap-2 cursor-pointer"
                    disabled={joining || !joinCode.trim()}
                    onClick={handleJoin}
                  >
                    {joining ? (
                      <><Loader2 className="size-4 animate-spin" /> Joining…</>
                    ) : (
                      <><LogIn className="size-4" /> Join Group</>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Groups list */}
          <div className="grid gap-4 animate-fade-in-delay-2">
            <h2 className="text-lg font-semibold">Your Groups</h2>

            {loadingGroups ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="size-5 animate-spin mr-2" /> Loading…
              </div>
            ) : groups.length === 0 ? (
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                  <Users className="size-10 text-muted-foreground/40" />
                  <p className="text-muted-foreground">
                    No groups yet. Create one or join with a code!
                  </p>
                </CardContent>
              </Card>
            ) : (
              groups.map((group) => (
                <Card
                  key={group.id}
                  className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/group/${group.id}`)}
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="size-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{group.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {group.members.length} member{group.members.length !== 1 && "s"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Member avatars */}
                      <div className="flex -space-x-2">
                        {group.members.slice(0, 4).map((m) => (
                          <Avatar key={m.user.id} className="size-7 border-2 border-background">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                              {m.user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {group.members.length > 4 && (
                          <div className="size-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                            +{group.members.length - 4}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1 text-xs text-muted-foreground cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyCode(group.code, group.id);
                        }}
                      >
                        {copiedId === group.id ? (
                          <><Check className="size-3" /> Copied</>
                        ) : (
                          <><Copy className="size-3" /> {group.code}</>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
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
