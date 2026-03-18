import {
  CheckCircle2,
  Hand,
  Loader2,
  MoreVertical,
  Pencil,
  SkipForward,
  Trash2,
  XCircle,
} from "lucide-react";

import type { GroupDare } from "@/shared/services/group-api";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Separator } from "@/shared/components/ui/separator";

import { DIFFICULTY_COLORS } from "../constants";

interface DareCardProps {
  dare: GroupDare;
  index: number;
  currentUserId: string | undefined;
  isOwner: boolean;
  claimingId: string | null;
  completingId: string | null;
  onClaim: (dareId: string) => void;
  onStatusConfirm: (
    dareId: string,
    status: "COMPLETED" | "PASSED" | "FAILED",
  ) => void;
  onEdit: (dare: GroupDare) => void;
  onDeleteConfirm: (dareId: string) => void;
}

export default function DareCard({
  dare,
  index,
  currentUserId,
  isOwner,
  claimingId,
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
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <p className={`font-medium ${isClosed ? "line-through" : ""}`}>
              {dare.title}
            </p>
            <Badge
              className={`px-1.5 text-[10px] ${DIFFICULTY_COLORS[dare.difficulty] ?? ""}`}
            >
              {dare.difficulty}
            </Badge>
            {isCompleted && (
              <Badge className="border-green-500/30 bg-green-500/20 px-1.5 text-[10px] text-green-400">
                <CheckCircle2 className="mr-0.5 size-3" /> DONE
              </Badge>
            )}
            {isPassed && (
              <Badge className="border-orange-500/30 bg-orange-500/20 px-1.5 text-[10px] text-orange-400">
                <XCircle className="mr-0.5 size-3" /> PASSED
              </Badge>
            )}
            {isFailed && (
              <Badge className="border-red-500/30 bg-red-500/20 px-1.5 text-[10px] text-red-400">
                <XCircle className="mr-0.5 size-3" /> FAILED
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {dare.description}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            by {dare.author.username}
            {dare.assignedTo && (
              <>
                {" "}
                · assigned to{" "}
                <span className="text-foreground font-medium">
                  {dare.assignedTo.username}
                </span>
              </>
            )}{" "}
            · {dare.xpReward} XP
          </p>
        </div>

        {!isClosed && (
          <div className="flex shrink-0 items-center gap-1.5">
            {!dare.assignedTo && (
              <Button
                size="sm"
                variant="outline"
                className="cursor-pointer gap-1.5"
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
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 cursor-pointer"
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {(isAuthor || isAssignee) && (
                    <>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 text-green-400 focus:text-green-400"
                        onClick={() => onStatusConfirm(dare.id, "COMPLETED")}
                      >
                        <CheckCircle2 className="size-4" /> Complete
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 text-orange-400 focus:text-orange-400"
                        onClick={() => onStatusConfirm(dare.id, "PASSED")}
                      >
                        <SkipForward className="size-4" /> Pass
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 text-red-400 focus:text-red-400"
                        onClick={() => onStatusConfirm(dare.id, "FAILED")}
                      >
                        <XCircle className="size-4" /> Fail
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {isAuthor && (
                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => onEdit(dare)}
                    >
                      <Pencil className="size-4" /> Edit
                    </DropdownMenuItem>
                  )}
                  {(isAuthor || isOwner) && (
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer gap-2"
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
