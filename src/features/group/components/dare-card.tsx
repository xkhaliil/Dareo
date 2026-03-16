import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Hand,
  Loader2,
  MoreVertical,
  CheckCircle2,
  XCircle,
  SkipForward,
  Pencil,
  Trash2,
} from "lucide-react";
import { DIFFICULTY_COLORS } from "../constants";
import type { GroupDare } from "@/services/group-api";

interface DareCardProps {
  dare: GroupDare;
  index: number;
  currentUserId: string | undefined;
  isOwner: boolean;
  claimingId: string | null;
  completingId: string | null;
  onClaim: (dareId: string) => void;
  onStatusConfirm: (dareId: string, status: "COMPLETED" | "PASSED" | "FAILED") => void;
  onEdit: (dare: GroupDare) => void;
  onDeleteConfirm: (dareId: string) => void;
}

export default function DareCard({
  dare,
  index,
  currentUserId,
  isOwner,
  claimingId,
  completingId,
  onClaim,
  onStatusConfirm,
  onEdit,
  onDeleteConfirm,
}: DareCardProps) {
  const isCompleted = dare.status === "COMPLETED";
  const isPassed = dare.status === "PASSED";
  const isFailed = dare.status === "FAILED";
  const isClosed = isCompleted || isPassed || isFailed;
  const isAuthor = currentUserId === dare.author.id;
  const isAssignee = currentUserId === dare.assignedTo?.id;

  return (
    <div>
      {index > 0 && <Separator className="mb-3" />}
      <div className={`flex items-start gap-3 ${isClosed ? "opacity-60" : ""}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className={`font-medium ${isClosed ? "line-through" : ""}`}>{dare.title}</p>
            <Badge className={`text-[10px] px-1.5 ${DIFFICULTY_COLORS[dare.difficulty] ?? ""}`}>
              {dare.difficulty}
            </Badge>
            {isCompleted && (
              <Badge className="text-[10px] px-1.5 bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle2 className="size-3 mr-0.5" /> DONE
              </Badge>
            )}
            {isPassed && (
              <Badge className="text-[10px] px-1.5 bg-orange-500/20 text-orange-400 border-orange-500/30">
                <XCircle className="size-3 mr-0.5" /> PASSED
              </Badge>
            )}
            {isFailed && (
              <Badge className="text-[10px] px-1.5 bg-red-500/20 text-red-400 border-red-500/30">
                <XCircle className="size-3 mr-0.5" /> FAILED
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{dare.description}</p>
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
            {!dare.assignedTo && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 cursor-pointer"
                disabled={claimingId === dare.id}
                onClick={() => onClaim(dare.id)}
              >
                {claimingId === dare.id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Hand className="size-3.5" />
                )}
                Accept
              </Button>
            )}

            {(isAuthor || isOwner || isAssignee) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="size-8 cursor-pointer">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {(isAuthor || isAssignee) && (
                    <>
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer text-green-400 focus:text-green-400"
                        onClick={() => onStatusConfirm(dare.id, "COMPLETED")}
                      >
                        <CheckCircle2 className="size-4" /> Complete
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer text-orange-400 focus:text-orange-400"
                        onClick={() => onStatusConfirm(dare.id, "PASSED")}
                      >
                        <SkipForward className="size-4" /> Pass
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 cursor-pointer text-red-400 focus:text-red-400"
                        onClick={() => onStatusConfirm(dare.id, "FAILED")}
                      >
                        <XCircle className="size-4" /> Fail
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {isAuthor && (
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer"
                      onClick={() => onEdit(dare)}
                    >
                      <Pencil className="size-4" /> Edit
                    </DropdownMenuItem>
                  )}
                  {(isAuthor || isOwner) && (
                    <DropdownMenuItem
                      className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                      onClick={() => onDeleteConfirm(dare.id)}
                    >
                      <Trash2 className="size-4" /> Delete
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
}
