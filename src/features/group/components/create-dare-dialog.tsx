import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useCreateDare } from "@/hooks/use-group-service";
import { XP_CAPS, XP_DEFAULTS } from "../constants";

interface CreateDareDialogProps {
  groupId: string;
}

export default function CreateDareDialog({ groupId }: CreateDareDialogProps) {
  const createDareMutation = useCreateDare(groupId);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [xp, setXp] = useState(10);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!title.trim() || !desc.trim()) return;
    setError(null);
    try {
      await createDareMutation.mutateAsync({ title: title.trim(), description: desc.trim(), difficulty, xpReward: xp });
      setOpen(false);
      setTitle(""); setDesc(""); setDifficulty("EASY"); setXp(10);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); setError(null); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2 cursor-pointer">
          <Plus className="size-4" /> Create Dare
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new dare</DialogTitle>
          <DialogDescription>Challenge your group members with a new dare.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 pt-2">
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="dare-title">Title</Label>
            <Input id="dare-title" placeholder="Ice bucket challenge" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dare-desc">Description</Label>
            <Textarea id="dare-desc" placeholder="Describe the dare in detail…" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={(v) => { setDifficulty(v); setXp(XP_DEFAULTS[v] ?? 10); }}>
                <SelectTrigger className="cursor-pointer"><SelectValue /></SelectTrigger>
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
                max={XP_CAPS[difficulty] ?? 25}
                value={xp}
                onChange={(e) => {
                  const val = Number(e.target.value) || 1;
                  const cap = XP_CAPS[difficulty] ?? 25;
                  setXp(Math.min(Math.max(val, 1), cap));
                }}
              />
            </div>
          </div>
          <Button
            className="w-full gap-2 cursor-pointer"
            disabled={createDareMutation.isPending || !title.trim() || !desc.trim()}
            onClick={handleCreate}
          >
            {createDareMutation.isPending ? (
              <><Loader2 className="size-4 animate-spin" /> Creating…</>
            ) : (
              <><Plus className="size-4" /> Create Dare</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
