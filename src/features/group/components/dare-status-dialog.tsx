import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

type DareStatus = "COMPLETED" | "PASSED" | "FAILED";

interface StatusConfirm {
  dareId: string;
  status: DareStatus;
}

interface DareStatusDialogProps {
  statusConfirm: StatusConfirm | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (dareId: string, status: DareStatus) => Promise<void>;
  isLoading: boolean;
}

const STATUS_LABELS: Record<DareStatus, string> = {
  COMPLETED: "Complete Dare",
  PASSED: "Pass on Dare",
  FAILED: "Fail Dare",
};

const STATUS_DESCRIPTIONS: Record<DareStatus, string> = {
  COMPLETED:
    "This will mark the dare as completed and award you XP. This cannot be undone.",
  PASSED:
    "This will mark the dare as passed. No XP will be awarded. This cannot be undone.",
  FAILED:
    "This will mark the dare as failed. No XP will be awarded. This cannot be undone.",
};

const STATUS_BUTTON_CLASSES: Record<DareStatus, string> = {
  COMPLETED: "bg-green-600 text-white hover:bg-green-600/90",
  PASSED: "bg-orange-600 text-white hover:bg-orange-600/90",
  FAILED: "bg-red-600 text-white hover:bg-red-600/90",
};

export default function DareStatusDialog({
  statusConfirm,
  onOpenChange,
  onConfirm,
  isLoading,
}: DareStatusDialogProps) {
  return (
    <AlertDialog
      open={!!statusConfirm}
      onOpenChange={(open) => {
        if (!open) onOpenChange(false);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {statusConfirm ? STATUS_LABELS[statusConfirm.status] : ""}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {statusConfirm ? STATUS_DESCRIPTIONS[statusConfirm.status] : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={`cursor-pointer ${statusConfirm ? STATUS_BUTTON_CLASSES[statusConfirm.status] : ""}`}
            disabled={isLoading}
            onClick={async () => {
              if (statusConfirm) {
                await onConfirm(statusConfirm.dareId, statusConfirm.status);
              }
            }}
          >
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            {statusConfirm
              ? statusConfirm.status.charAt(0) +
                statusConfirm.status.slice(1).toLowerCase()
              : ""}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
