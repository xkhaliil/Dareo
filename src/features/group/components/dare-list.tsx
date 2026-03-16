import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dice5 } from "lucide-react";
import DareCard from "./dare-card";
import CreateDareDialog from "./create-dare-dialog";
import type { GroupDare } from "@/services/group-api";

interface DareListProps {
  groupId: string;
  dares: GroupDare[];
  currentUserId: string | undefined;
  isOwner: boolean;
  claimingId: string | null;
  completingId: string | null;
  onClaim: (dareId: string) => void;
  onStatusConfirm: (dareId: string, status: "COMPLETED" | "PASSED" | "FAILED") => void;
  onEdit: (dare: GroupDare) => void;
  onDeleteConfirm: (dareId: string) => void;
}

export default function DareList({
  groupId,
  dares,
  currentUserId,
  isOwner,
  claimingId,
  completingId,
  onClaim,
  onStatusConfirm,
  onEdit,
  onDeleteConfirm,
}: DareListProps) {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm animate-fade-in-delay-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Dice5 className="size-5" /> Dares
        </CardTitle>
        <CreateDareDialog groupId={groupId} />
      </CardHeader>
      <CardContent>
        {dares.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Dice5 className="size-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">No dares yet. Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {dares.map((dare, i) => (
              <DareCard
                key={dare.id}
                dare={dare}
                index={i}
                currentUserId={currentUserId}
                isOwner={isOwner}
                claimingId={claimingId}
                completingId={completingId}
                onClaim={onClaim}
                onStatusConfirm={onStatusConfirm}
                onEdit={onEdit}
                onDeleteConfirm={onDeleteConfirm}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
