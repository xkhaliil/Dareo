import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Dice5,
  Copy,
  Check,
  Loader2,
  ArrowLeft,
  Crown,
  Shield,
  Plus,
  Hand,
  Trash2,
  Pencil,
  CheckCircle2,
  XCircle,
  SkipForward,
  MoreVertical,
} from "lucide-react";

import { computeLevel, computeRank } from "@/lib/xp";

interface GroupMember {
  id: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string | null;
    rank: string;
    level: number;
  };
}

interface GroupDare {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;
  status: string;
  createdAt: string;
  completedAt: string | null;
  author: { id: string; username: string; avatarUrl: string | null };
  assignedTo: { id: string; username: string; avatarUrl: string | null } | null;
}

interface GroupData {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  members: GroupMember[];
  dares: GroupDare[];
  myRole: string;
}

const difficultyColors: Record<string, string> = {
  EASY: "bg-green-500/10 text-green-400",
  MEDIUM: "bg-yellow-500/10 text-yellow-400",
  HARD: "bg-orange-500/10 text-orange-400",
  EXTREME: "bg-red-500/10 text-red-400",
};

const rankColors: Record<string, string> = {
  ROOKIE: "text-zinc-400",
  BRONZE: "text-amber-500",
  SILVER: "text-slate-400",
  GOLD: "text-yellow-500",
  PLATINUM: "text-cyan-400",
  DIAMOND: "text-blue-400",
  LEGEND: "text-purple-400",
};

const roleIcons: Record<string, typeof Crown> = {
  OWNER: Crown,
  ADMIN: Shield,
};

const XP_CAPS: Record<string, number> = {
  EASY: 25,
  MEDIUM: 50,
  HARD: 100,
  EXTREME: 200,
};

const XP_DEFAULTS: Record<string, number> = {
  EASY: 10,
  MEDIUM: 25,
  HARD: 50,
  EXTREME: 100,
};

export default function GroupPage() {
  const { id } = useParams<{ id: string }>();
  const { token, user: currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Create dare state
  const [dareOpen, setDareOpen] = useState(false);
  const [dareTitle, setDareTitle] = useState("");
  const [dareDesc, setDareDesc] = useState("");
  const [dareDifficulty, setDareDifficulty] = useState("EASY");
  const [dareXp, setDareXp] = useState(10);
  const [creatingDare, setCreatingDare] = useState(false);
  const [dareError, setDareError] = useState<string | null>(null);
  const [claimingDareId, setClaimingDareId] = useState<string | null>(null);
  const [completingDareId, setCompletingDareId] = useState<string | null>(null);
  const [deletingDareId, setDeletingDareId] = useState<string | null>(null);
  const [deleteConfirmDareId, setDeleteConfirmDareId] = useState<string | null>(null);
  const [statusConfirm, setStatusConfirm] = useState<{ dareId: string; status: "COMPLETED" | "PASSED" | "FAILED" } | null>(null);

  // Edit dare state
  const [editOpen, setEditOpen] = useState(false);
  const [editDareId, setEditDareId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDifficulty, setEditDifficulty] = useState("EASY");
  const [editXp, setEditXp] = useState(10);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroup();
  }, [id]);

  async function fetchGroup() {
    try {
      const res = await fetch(`/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load group");
        return;
      }

      setGroup(data);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  function copyCode() {
    if (!group) return;
    navigator.clipboard.writeText(group.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleCreateDare() {
    if (!dareTitle.trim() || !dareDesc.trim()) return;
    setCreatingDare(true);
    setDareError(null);

    try {
      const res = await fetch(`/api/groups/${id}/dares`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: dareTitle.trim(),
          description: dareDesc.trim(),
          difficulty: dareDifficulty,
          xpReward: dareXp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDareError(data.error || "Something went wrong");
        setCreatingDare(false);
        return;
      }

      // Add new dare to list
      setGroup((prev) =>
        prev ? { ...prev, dares: [data, ...prev.dares] } : prev
      );
      setDareOpen(false);
      setDareTitle("");
      setDareDesc("");
      setDareDifficulty("EASY");
      setDareXp(10);
    } catch {
      setDareError("Network error");
    } finally {
      setCreatingDare(false);
    }
  }

  async function handleClaimDare(dareId: string) {
    setClaimingDareId(dareId);
    try {
      const res = await fetch(`/api/groups/${id}/dares/${dareId}/claim`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setGroup((prev) =>
          prev
            ? {
                ...prev,
                dares: prev.dares.map((d) => (d.id === dareId ? data : d)),
              }
            : prev
        );
        // +5 XP for claiming
        if (currentUser) {
          const newXp = currentUser.xp + 5;
          updateUser({ ...currentUser, xp: newXp, level: computeLevel(newXp), rank: computeRank(newXp) });
        }
      }
    } catch {
      // silently fail
    } finally {
      setClaimingDareId(null);
    }
  }

  async function handleCompleteDare(dareId: string, status: "COMPLETED" | "PASSED" | "FAILED") {
    setCompletingDareId(dareId);
    try {
      const res = await fetch(`/api/groups/${id}/dares/${dareId}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        setGroup((prev) =>
          prev ? { ...prev, dares: prev.dares.map((d) => (d.id === dareId ? data : d)) } : prev
        );
        // If COMPLETED, update XP for the assignee in auth context if it's the current user
        if (currentUser) {
          const dare = group?.dares.find((d) => d.id === dareId);
          if (dare && dare.assignedTo?.id === currentUser.id) {
            let newXp: number;
            if (status === "COMPLETED") {
              newXp = currentUser.xp + dare.xpReward;
            } else {
              // PASSED or FAILED: deduct 200% of dare XP
              newXp = Math.max(0, currentUser.xp - dare.xpReward * 2);
            }
            updateUser({ ...currentUser, xp: newXp, level: computeLevel(newXp), rank: computeRank(newXp) });
          }
        }
      }
    } catch {
      // silently fail
    } finally {
      setCompletingDareId(null);
    }
  }

  async function handleDeleteDare(dareId: string) {
    setDeletingDareId(dareId);
    try {
      const res = await fetch(`/api/groups/${id}/dares/${dareId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setGroup((prev) =>
          prev ? { ...prev, dares: prev.dares.filter((d) => d.id !== dareId) } : prev
        );
      }
    } catch {
      // silently fail
    } finally {
      setDeletingDareId(null);
    }
  }

  function openEditDare(dare: GroupDare) {
    setEditDareId(dare.id);
    setEditTitle(dare.title);
    setEditDesc(dare.description);
    setEditDifficulty(dare.difficulty);
    setEditXp(dare.xpReward);
    setEditError(null);
    setEditOpen(true);
  }

  async function handleEditDare() {
    if (!editDareId || !editTitle.trim() || !editDesc.trim()) return;
    setEditSaving(true);
    setEditError(null);

    try {
      const res = await fetch(`/api/groups/${id}/dares/${editDareId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDesc.trim(),
          difficulty: editDifficulty,
          xpReward: editXp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEditError(data.error || "Something went wrong");
        setEditSaving(false);
        return;
      }

      setGroup((prev) =>
        prev ? { ...prev, dares: prev.dares.map((d) => (d.id === editDareId ? data : d)) } : prev
      );
      setEditOpen(false);
    } catch {
      setEditError("Network error");
    } finally {
      setEditSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm max-w-md w-full mx-6">
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <Users className="size-10 text-muted-foreground/40" />
              <p className="text-muted-foreground">{error || "Group not found"}</p>
              <Button
                variant="outline"
                className="gap-2 cursor-pointer"
                onClick={() => navigate("/game")}
              >
                <ArrowLeft className="size-4" /> Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
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
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 mb-6 cursor-pointer text-muted-foreground"
            onClick={() => navigate("/game")}
          >
            <ArrowLeft className="size-4" /> Back
          </Button>

          {/* Group header */}
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm mb-6 animate-fade-in">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Users className="size-8 text-primary" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight mb-1">
                    {group.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {group.members.length} member{group.members.length !== 1 && "s"}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 cursor-pointer font-mono tracking-widest"
                  onClick={copyCode}
                >
                  {copied ? (
                    <><Check className="size-3.5" /> Copied!</>
                  ) : (
                    <><Copy className="size-3.5" /> {group.code}</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Members */}
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm mb-6 animate-fade-in-delay-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="size-5" /> Members
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {group.members.map((member, i) => {
                const RoleIcon = roleIcons[member.role];
                return (
                  <div key={member.id}>
                    {i > 0 && <Separator className="mb-3" />}
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        {member.user.avatarUrl && (
                          <AvatarImage
                            src={member.user.avatarUrl}
                            alt={member.user.username}
                          />
                        )}
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                          {member.user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">
                            {member.user.username}
                          </p>
                          {RoleIcon && (
                            <RoleIcon className="size-3.5 text-yellow-500 shrink-0" />
                          )}
                        </div>
                        <p className={`text-xs ${rankColors[member.user.rank] ?? "text-muted-foreground"}`}>
                          {member.user.rank} · Level {member.user.level}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {member.role.toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Dares */}
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm animate-fade-in-delay-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Dice5 className="size-5" /> Dares
              </CardTitle>
              <Dialog open={dareOpen} onOpenChange={(o) => { setDareOpen(o); setDareError(null); }}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 cursor-pointer">
                    <Plus className="size-4" /> Create Dare
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a new dare</DialogTitle>
                    <DialogDescription>
                      Challenge your group members with a new dare.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 pt-2">
                    {dareError && (
                      <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                        {dareError}
                      </div>
                    )}
                    <div className="grid gap-2">
                      <Label htmlFor="dare-title">Title</Label>
                      <Input
                        id="dare-title"
                        placeholder="Ice bucket challenge"
                        value={dareTitle}
                        onChange={(e) => setDareTitle(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dare-desc">Description</Label>
                      <Textarea
                        id="dare-desc"
                        placeholder="Describe the dare in detail…"
                        value={dareDesc}
                        onChange={(e) => setDareDesc(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Difficulty</Label>
                        <Select
                          value={dareDifficulty}
                          onValueChange={(v) => {
                            setDareDifficulty(v);
                            setDareXp(XP_DEFAULTS[v] ?? 10);
                          }}
                        >
                          <SelectTrigger className="cursor-pointer">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EASY">Easy (max 25 XP)</SelectItem>
                            <SelectItem value="MEDIUM">Medium (max 50 XP)</SelectItem>
                            <SelectItem value="HARD">Hard (max 100 XP)</SelectItem>
                            <SelectItem value="EXTREME">Extreme (max 200 XP)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dare-xp">XP Reward</Label>
                        <Input
                          id="dare-xp"
                          type="number"
                          min={1}
                          max={XP_CAPS[dareDifficulty] ?? 25}
                          value={dareXp}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 1;
                            const cap = XP_CAPS[dareDifficulty] ?? 25;
                            setDareXp(Math.min(Math.max(val, 1), cap));
                          }}
                        />
                      </div>
                    </div>
                    <Button
                      className="w-full gap-2 cursor-pointer"
                      disabled={creatingDare || !dareTitle.trim() || !dareDesc.trim()}
                      onClick={handleCreateDare}
                    >
                      {creatingDare ? (
                        <><Loader2 className="size-4 animate-spin" /> Creating…</>
                      ) : (
                        <><Plus className="size-4" /> Create Dare</>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {group.dares.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <Dice5 className="size-10 text-muted-foreground/40" />
                  <p className="text-muted-foreground">
                    No dares yet. Be the first to create one!
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {group.dares.map((dare, i) => {
                    const isCompleted = dare.status === "COMPLETED";
                    const isPassed = dare.status === "PASSED";
                    const isFailed = dare.status === "FAILED";
                    const isClosed = isCompleted || isPassed || isFailed;
                    const isAuthor = currentUser?.id === dare.author.id;
                    const isAssignee = currentUser?.id === dare.assignedTo?.id;
                    const isOwner = group.members.some(
                      (m) => m.user.id === currentUser?.id && m.role === "OWNER"
                    );

                    return (
                      <div key={dare.id}>
                        {i > 0 && <Separator className="mb-3" />}
                        <div className={`flex items-start gap-3 ${isClosed ? "opacity-60" : ""}`}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={`font-medium ${isClosed ? "line-through" : ""}`}>
                                {dare.title}
                              </p>
                              <Badge
                                className={`text-[10px] px-1.5 ${difficultyColors[dare.difficulty] ?? ""}`}
                              >
                                {dare.difficulty}
                              </Badge>
                              {isCompleted && (
                                <Badge className="text-[10px] px-1.5 bg-green-500/20 text-green-400 border-green-500/30">
                                  <CheckCircle2 className="size-3 mr-0.5" />
                                  DONE
                                </Badge>
                              )}
                              {isPassed && (
                                <Badge className="text-[10px] px-1.5 bg-orange-500/20 text-orange-400 border-orange-500/30">
                                  <XCircle className="size-3 mr-0.5" />
                                  PASSED
                                </Badge>
                              )}
                              {isFailed && (
                                <Badge className="text-[10px] px-1.5 bg-red-500/20 text-red-400 border-red-500/30">
                                  <XCircle className="size-3 mr-0.5" />
                                  FAILED
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {dare.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              by {dare.author.username}
                              {dare.assignedTo && (
                                <> · assigned to <span className="text-foreground font-medium">{dare.assignedTo.username}</span></>
                              )}
                              {" "}· {dare.xpReward} XP
                            </p>
                          </div>

                          {!isClosed && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* Accept - unassigned dares */}
                              {!dare.assignedTo && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1.5 cursor-pointer"
                                  disabled={claimingDareId === dare.id}
                                  onClick={() => handleClaimDare(dare.id)}
                                >
                                  {claimingDareId === dare.id ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                  ) : (
                                    <Hand className="size-3.5" />
                                  )}
                                  Accept
                                </Button>
                              )}

                              {/* Actions menu - author/owner for edit/delete, assignee for status */}
                              {(isAuthor || isOwner || isAssignee) && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="size-8 cursor-pointer"
                                    >
                                      <MoreVertical className="size-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-40">
                                    {isAssignee && (
                                      <>
                                        <DropdownMenuItem
                                          className="gap-2 cursor-pointer text-green-400 focus:text-green-400"
                                          onClick={() => setStatusConfirm({ dareId: dare.id, status: "COMPLETED" })}
                                        >
                                          <CheckCircle2 className="size-4" />
                                          Complete
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="gap-2 cursor-pointer text-orange-400 focus:text-orange-400"
                                          onClick={() => setStatusConfirm({ dareId: dare.id, status: "PASSED" })}
                                        >
                                          <SkipForward className="size-4" />
                                          Pass
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="gap-2 cursor-pointer text-red-400 focus:text-red-400"
                                          onClick={() => setStatusConfirm({ dareId: dare.id, status: "FAILED" })}
                                        >
                                          <XCircle className="size-4" />
                                          Fail
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                      </>
                                    )}
                                    {isAuthor && (
                                      <>
                                        <DropdownMenuItem
                                          className="gap-2 cursor-pointer"
                                          onClick={() => openEditDare(dare)}
                                        >
                                          <Pencil className="size-4" />
                                          Edit
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                    {(isAuthor || isOwner) && (
                                      <DropdownMenuItem
                                        className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                                        onClick={() => setDeleteConfirmDareId(dare.id)}
                                      >
                                        <Trash2 className="size-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Edit Dare Drawer */}
      <Drawer open={editOpen} onOpenChange={setEditOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle>Edit Dare</DrawerTitle>
            </DrawerHeader>
            <div className="grid gap-4 px-4 pb-2">
              {editError && (
                <p className="text-sm text-destructive">{editError}</p>
              )}
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-desc">Description</Label>
                <Textarea
                  id="edit-desc"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Difficulty</Label>
                <Select value={editDifficulty} onValueChange={(v) => {
                  setEditDifficulty(v);
                  const cap = XP_CAPS[v] ?? 25;
                  if (editXp > cap) setEditXp(cap);
                }}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EASY" className="cursor-pointer">Easy</SelectItem>
                    <SelectItem value="MEDIUM" className="cursor-pointer">Medium</SelectItem>
                    <SelectItem value="HARD" className="cursor-pointer">Hard</SelectItem>
                    <SelectItem value="EXTREME" className="cursor-pointer">Extreme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-xp">XP Reward (max {XP_CAPS[editDifficulty] ?? 25})</Label>
                <Input
                  id="edit-xp"
                  type="number"
                  min={1}
                  max={XP_CAPS[editDifficulty] ?? 25}
                  value={editXp}
                  onChange={(e) => {
                    const cap = XP_CAPS[editDifficulty] ?? 25;
                    setEditXp(Math.min(Number(e.target.value), cap));
                  }}
                />
              </div>
            </div>
            <DrawerFooter>
              <Button
                className="w-full cursor-pointer"
                disabled={editSaving || !editTitle.trim() || !editDesc.trim()}
                onClick={handleEditDare}
              >
                {editSaving ? (
                  <Loader2 className="size-4 animate-spin mr-2" />
                ) : null}
                Save Changes
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full cursor-pointer">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog
        open={!!statusConfirm}
        onOpenChange={(open) => { if (!open) setStatusConfirm(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {statusConfirm?.status === "COMPLETED"
                ? "Complete Dare"
                : statusConfirm?.status === "FAILED"
                  ? "Fail Dare"
                  : "Pass on Dare"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {statusConfirm?.status === "COMPLETED"
                ? "This will mark the dare as completed and award you XP. This cannot be undone."
                : statusConfirm?.status === "FAILED"
                  ? "This will mark the dare as failed. No XP will be awarded. This cannot be undone."
                  : "This will mark the dare as passed. No XP will be awarded. This cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={`cursor-pointer ${
                statusConfirm?.status === "COMPLETED"
                  ? "bg-green-600 text-white hover:bg-green-600/90"
                  : statusConfirm?.status === "FAILED"
                    ? "bg-red-600 text-white hover:bg-red-600/90"
                    : "bg-orange-600 text-white hover:bg-orange-600/90"
              }`}
              disabled={!!completingDareId}
              onClick={async () => {
                if (statusConfirm) {
                  await handleCompleteDare(statusConfirm.dareId, statusConfirm.status);
                  setStatusConfirm(null);
                }
              }}
            >
              {completingDareId ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : null}
              {statusConfirm?.status === "COMPLETED" ? "Complete" : statusConfirm?.status === "FAILED" ? "Fail" : "Pass"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteConfirmDareId}
        onOpenChange={(open) => { if (!open) setDeleteConfirmDareId(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dare</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this dare? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
              disabled={!!deletingDareId}
              onClick={async () => {
                if (deleteConfirmDareId) {
                  await handleDeleteDare(deleteConfirmDareId);
                  setDeleteConfirmDareId(null);
                }
              }}
            >
              {deletingDareId ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
