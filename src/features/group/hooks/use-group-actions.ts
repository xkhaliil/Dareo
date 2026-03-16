import { useState } from "react";

import { useAuth } from "@/context/auth-context";
import type { GroupDare, GroupData } from "@/services/group-api";
import { computeLevel, computeRank } from "@/shared/lib/xp";

import {
  useClaimDare,
  useCompleteDare,
  useDeleteDare,
} from "@/hooks/use-group-service";

type DareStatus = "COMPLETED" | "PASSED" | "FAILED";

interface StatusConfirm {
  dareId: string;
  status: DareStatus;
}

export function useGroupActions(groupId: string, group: GroupData | undefined) {
  const { user: currentUser, updateUser } = useAuth();

  const claimDareMutation = useClaimDare(groupId);
  const completeDareMutation = useCompleteDare(groupId);
  const deleteDareMutation = useDeleteDare(groupId);

  // Loading state per dare
  const [claimingDareId, setClaimingDareId] = useState<string | null>(null);
  const [completingDareId, setCompletingDareId] = useState<string | null>(null);
  const [deletingDareId, setDeletingDareId] = useState<string | null>(null);

  // Confirmation dialogs
  const [statusConfirm, setStatusConfirm] = useState<StatusConfirm | null>(
    null,
  );
  const [deleteConfirmDareId, setDeleteConfirmDareId] = useState<string | null>(
    null,
  );

  // Edit drawer
  const [editOpen, setEditOpen] = useState(false);
  const [editDareId, setEditDareId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDifficulty, setEditDifficulty] = useState("EASY");
  const [editXp, setEditXp] = useState(10);

  const isOwner =
    group?.members.some(
      (m) => m.user.id === currentUser?.id && m.role === "OWNER",
    ) ?? false;

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

  function openEditDare(dare: GroupDare) {
    setEditDareId(dare.id);
    setEditTitle(dare.title);
    setEditDesc(dare.description);
    setEditDifficulty(dare.difficulty);
    setEditXp(dare.xpReward);
    setEditOpen(true);
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
    editOpen,
    setEditOpen,
    editDareId,
    editTitle,
    setEditTitle,
    editDesc,
    setEditDesc,
    editDifficulty,
    setEditDifficulty,
    editXp,
    setEditXp,
    openEditDare,
  };
}
