import { useState } from "react";

import { computeLevel, computeRank } from "@/shared/lib/xp";
import { useAuth } from "@/shared/context/auth-context";
import type { GroupData } from "@/shared/services/group-api";
import {
  useClaimDare,
  useCompleteDare,
  useDeleteDare,
  useEditDare,
} from "@/shared/hooks/use-group-service";

import { useGroupContext } from "../context/group-context";

type DareStatus = "COMPLETED" | "PASSED" | "FAILED";

/**
 * useGroupActions — business logic hook for the group page.
 *
 * Rendering/UI state (which dialog is open, edit field values) is owned by
 * GroupContext. This hook owns only mutation logic, loading trackers, and
 * XP side-effects — keeping business logic and rendering concerns separate.
 */
export function useGroupActions(groupId: string, group: GroupData | undefined) {
  const { user: currentUser, updateUser } = useAuth();

  // ── GroupContext: UI state lives there, we pull actions from it ───────────
  const {
    openEditDare,
    closeEditDare,
    editState,
    setEditTitle,
    setEditDesc,
    setEditDifficulty,
    setEditXp,
    statusConfirm,
    setStatusConfirm,
    deleteConfirmDareId,
    setDeleteConfirmDareId,
  } = useGroupContext();

  // ── Mutations ────────────────────────────────────────────────────────────
  const claimDareMutation = useClaimDare(groupId);
  const completeDareMutation = useCompleteDare(groupId);
  const deleteDareMutation = useDeleteDare(groupId);
  const editDareMutation = useEditDare(groupId);

  // ── Per-dare loading trackers ─────────────────────────────────────────────
  const [claimingDareId, setClaimingDareId] = useState<string | null>(null);
  const [completingDareId, setCompletingDareId] = useState<string | null>(null);
  const [deletingDareId, setDeletingDareId] = useState<string | null>(null);

  const isOwner =
    group?.members.some(
      (m) => m.user.id === currentUser?.id && m.role === "OWNER",
    ) ?? false;

  // ── Handlers ─────────────────────────────────────────────────────────────

  async function handleClaimDare(dareId: string) {
    setClaimingDareId(dareId);
    try {
      await claimDareMutation.mutateAsync(dareId);
      if (currentUser) {
        const newXp = currentUser.xp + 5;
        updateUser({
          ...currentUser,
          xp: newXp,
          level: computeLevel(newXp),
          rank: computeRank(newXp),
        });
      }
    } finally {
      setClaimingDareId(null);
    }
  }

  async function handleCompleteDare(dareId: string, status: DareStatus) {
    setCompletingDareId(dareId);
    try {
      await completeDareMutation.mutateAsync({ dareId, status });
      if (currentUser) {
        const dare = group?.dares.find((d) => d.id === dareId);
        if (dare && dare.assignedTo?.id === currentUser.id) {
          const newXp =
            status === "COMPLETED"
              ? currentUser.xp + dare.xpReward
              : Math.max(0, currentUser.xp - dare.xpReward * 2);
          updateUser({
            ...currentUser,
            xp: newXp,
            level: computeLevel(newXp),
            rank: computeRank(newXp),
          });
        }
      }
    } finally {
      setCompletingDareId(null);
      setStatusConfirm(null);
    }
  }

  async function handleDeleteDare(dareId: string) {
    setDeletingDareId(dareId);
    try {
      await deleteDareMutation.mutateAsync(dareId);
    } finally {
      setDeletingDareId(null);
      setDeleteConfirmDareId(null);
    }
  }

  async function handleEditDare() {
    if (!editState) return;
    await editDareMutation.mutateAsync({
      dareId: editState.dareId,
      title: editState.title,
      description: editState.description,
      difficulty: editState.difficulty,
      xpReward: editState.xpReward,
    });
    closeEditDare();
  }

  return {
    // Derived
    isOwner,
    currentUserId: currentUser?.id,

    // Claim
    claimingDareId,
    handleClaimDare,

    // Complete / pass / fail
    completingDareId,
    statusConfirm,
    setStatusConfirm,
    handleCompleteDare,

    // Delete
    deletingDareId,
    deleteConfirmDareId,
    setDeleteConfirmDareId,
    handleDeleteDare,

    // Edit
    openEditDare,
    setEditTitle,
    setEditDesc,
    setEditDifficulty,
    setEditXp,
    handleEditDare,
    isEditSaving: editDareMutation.isPending,
  };
}

// Re-export for convenience
export { useGroupContext } from "../context/group-context";

// Type of the object returned by useGroupActions — used by GroupContent modlet
export type GroupActions = ReturnType<typeof useGroupActions>;
