import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { useCreateGroup } from "@/hooks/use-group-service";

export default function CreateGroupDialog() {
  const navigate = useNavigate();
  const createGroupMutation = useCreateGroup();
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!groupName.trim()) return;
    setError(null);
    try {
      const data = await createGroupMutation.mutateAsync(groupName.trim());
      setOpen(false);
      setGroupName("");
      navigate(`/group/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); setError(null); setGroupName(""); }}>
      <DialogTrigger asChild>
        <Button className="gap-2 cursor-pointer">
          <Plus className="size-4" /> Create Group
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
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
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
            disabled={createGroupMutation.isPending || !groupName.trim()}
            onClick={handleCreate}
          >
            {createGroupMutation.isPending ? (
              <><Loader2 className="size-4 animate-spin" /> Creating…</>
            ) : (
              <><Plus className="size-4" /> Create Group</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
