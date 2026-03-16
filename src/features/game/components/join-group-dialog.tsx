import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Loader2, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useJoinGroup } from "@/hooks/use-group-service";

export default function JoinGroupDialog() {
  const navigate = useNavigate();
  const joinGroupMutation = useJoinGroup();
  const [open, setOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleJoin() {
    if (!joinCode.trim()) return;
    setError(null);
    try {
      const data = await joinGroupMutation.mutateAsync(joinCode.trim());
      setOpen(false);
      setJoinCode("");
      navigate(`/group/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        setError(null);
        setJoinCode("");
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer gap-2">
          <LogIn className="size-4" /> Join Group
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
          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border px-4 py-3 text-sm">
              {error}
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
              className="text-center font-mono tracking-widest uppercase"
            />
          </div>
          <Button
            className="w-full cursor-pointer gap-2"
            disabled={joinGroupMutation.isPending || !joinCode.trim()}
            onClick={handleJoin}
          >
            {joinGroupMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Joining…
              </>
            ) : (
              <>
                <LogIn className="size-4" /> Join Group
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
