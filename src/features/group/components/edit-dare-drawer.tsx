import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useEditDare } from "@/hooks/use-group-service";
import { XP_CAPS } from "../constants";

interface EditDareDrawerProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dareId: string | null;
  title: string;
  onTitleChange: (v: string) => void;
  desc: string;
  onDescChange: (v: string) => void;
  difficulty: string;
  onDifficultyChange: (v: string) => void;
  xp: number;
  onXpChange: (v: number) => void;
}

export default function EditDareDrawer({
  groupId,
  open,
  onOpenChange,
  dareId,
  title,
  onTitleChange,
  desc,
  onDescChange,
  difficulty,
  onDifficultyChange,
  xp,
  onXpChange,
}: EditDareDrawerProps) {
  const editDareMutation = useEditDare(groupId);

  async function handleSave() {
    if (!dareId || !title.trim() || !desc.trim()) return;
    try {
      await editDareMutation.mutateAsync({ dareId, title: title.trim(), description: desc.trim(), difficulty, xpReward: xp });
      onOpenChange(false);
    } catch {
      // error displayed inline via mutation state
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Edit Dare</DrawerTitle>
          </DrawerHeader>
          <div className="grid gap-4 px-4 pb-2">
            {editDareMutation.isError && (
              <p className="text-sm text-destructive">
                {editDareMutation.error instanceof Error ? editDareMutation.error.message : "Network error"}
              </p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input id="edit-title" value={title} onChange={(e) => onTitleChange(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea id="edit-desc" value={desc} onChange={(e) => onDescChange(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={(v) => {
                onDifficultyChange(v);
                const cap = XP_CAPS[v] ?? 25;
                if (xp > cap) onXpChange(cap);
              }}>
                <SelectTrigger className="cursor-pointer"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY" className="cursor-pointer">Easy</SelectItem>
                  <SelectItem value="MEDIUM" className="cursor-pointer">Medium</SelectItem>
                  <SelectItem value="HARD" className="cursor-pointer">Hard</SelectItem>
                  <SelectItem value="EXTREME" className="cursor-pointer">Extreme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-xp">XP Reward (max {XP_CAPS[difficulty] ?? 25})</Label>
              <Input
                id="edit-xp"
                type="number"
                min={1}
                max={XP_CAPS[difficulty] ?? 25}
                value={xp}
                onChange={(e) => {
                  const cap = XP_CAPS[difficulty] ?? 25;
                  onXpChange(Math.min(Number(e.target.value), cap));
                }}
              />
            </div>
          </div>
          <DrawerFooter>
            <Button
              className="w-full cursor-pointer"
              disabled={editDareMutation.isPending || !title.trim() || !desc.trim()}
              onClick={handleSave}
            >
              {editDareMutation.isPending && <Loader2 className="size-4 animate-spin mr-2" />}
              Save Changes
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full cursor-pointer">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
