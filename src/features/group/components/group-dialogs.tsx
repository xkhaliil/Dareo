import {
  type EditDareState,
  type StatusConfirm,
} from "../context/group-context";
import DareStatusDialog from "./dare-status-dialog";
import DeleteDareDialog from "./delete-dare-dialog";
import EditDareDrawer from "./edit-dare-drawer";

interface GroupDialogsProps {
  groupId: string;
  // Edit drawer
  editOpen: boolean;
  editState: EditDareState | null;
  onEditClose: () => void;
  onTitleChange: (v: string) => void;
  onDescChange: (v: string) => void;
  onDifficultyChange: (v: string) => void;
  onXpChange: (v: number) => void;
  // Status dialog
  statusConfirm: StatusConfirm | null;
  onStatusClose: () => void;
  onStatusConfirm: (
    dareId: string,
    status: "COMPLETED" | "PASSED" | "FAILED",
  ) => Promise<void>;
  isCompletingDare: boolean;
  // Delete dialog
  deleteConfirmDareId: string | null;
  onDeleteClose: () => void;
  onDeleteConfirm: (dareId: string) => Promise<void>;
  isDeletingDare: boolean;
}

export default function GroupDialogs({
  groupId,
  editOpen,
  editState,
  onEditClose,
  onTitleChange,
  onDescChange,
  onDifficultyChange,
  onXpChange,
  statusConfirm,
  onStatusClose,
  onStatusConfirm,
  isCompletingDare,
  deleteConfirmDareId,
  onDeleteClose,
  onDeleteConfirm,
  isDeletingDare,
}: GroupDialogsProps) {
  return (
    <>
      <EditDareDrawer
        groupId={groupId}
        open={editOpen}
        onOpenChange={(open) => !open && onEditClose()}
        dareId={editState?.dareId ?? null}
        title={editState?.title ?? ""}
        onTitleChange={onTitleChange}
        desc={editState?.description ?? ""}
        onDescChange={onDescChange}
        difficulty={editState?.difficulty ?? "EASY"}
        onDifficultyChange={onDifficultyChange}
        xp={editState?.xpReward ?? 10}
        onXpChange={onXpChange}
      />
      <DareStatusDialog
        statusConfirm={statusConfirm}
        onOpenChange={(open) => {
          if (!open) onStatusClose();
        }}
        onConfirm={onStatusConfirm}
        isLoading={isCompletingDare}
      />
      <DeleteDareDialog
        dareId={deleteConfirmDareId}
        onOpenChange={(open) => {
          if (!open) onDeleteClose();
        }}
        onConfirm={onDeleteConfirm}
        isLoading={isDeletingDare}
      />
    </>
  );
}
