import { Loader2 } from "lucide-react";

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

interface DeleteDareDialogProps {
  dareId: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (dareId: string) => Promise<void>;
  isLoading: boolean;
}

export default function DeleteDareDialog({
  dareId,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteDareDialogProps) {
  return (
    <AlertDialog
      open={!!dareId}
      onOpenChange={(open) => {
        if (!open) onOpenChange(false);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Dare</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this dare? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90 cursor-pointer text-white"
            disabled={isLoading}
            onClick={async () => {
              if (dareId) await onConfirm(dareId);
            }}
          >
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
