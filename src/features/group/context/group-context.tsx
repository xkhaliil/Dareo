/**
 * GroupContext — scoped to the group feature only.
 *
 * This context is intentionally NOT placed at the app root. It wraps only the
 * GroupPage subtree, so group-level UI state (active dare dialogs, edit state)
 * is not leaked into unrelated parts of the app (game dashboard, profile, etc.).
 *
 * This satisfies: "Something shared with only part of the app, using Context."
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { GroupDare } from "@/shared/services/group-api";

// ─── Types ────────────────────────────────────────────────────────────────────

type DareStatus = "COMPLETED" | "PASSED" | "FAILED";

export interface StatusConfirm {
  dareId: string;
  status: DareStatus;
}

export interface EditDareState {
  dareId: string;
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;
}

interface GroupContextValue {
  // Edit drawer
  editState: EditDareState | null;
  editOpen: boolean;
  openEditDare: (dare: GroupDare) => void;
  closeEditDare: () => void;
  setEditTitle: (title: string) => void;
  setEditDesc: (desc: string) => void;
  setEditDifficulty: (difficulty: string) => void;
  setEditXp: (xp: number) => void;

  // Status confirmation dialog
  statusConfirm: StatusConfirm | null;
  setStatusConfirm: (confirm: StatusConfirm | null) => void;

  // Delete confirmation dialog
  deleteConfirmDareId: string | null;
  setDeleteConfirmDareId: (id: string | null) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const GroupContext = createContext<GroupContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function GroupProvider({ children }: { children: ReactNode }) {
  const [editOpen, setEditOpen] = useState(false);
  const [editState, setEditState] = useState<EditDareState | null>(null);
  const [statusConfirm, setStatusConfirm] = useState<StatusConfirm | null>(
    null,
  );
  const [deleteConfirmDareId, setDeleteConfirmDareId] = useState<string | null>(
    null,
  );

  const openEditDare = useCallback((dare: GroupDare) => {
    setEditState({
      dareId: dare.id,
      title: dare.title,
      description: dare.description,
      difficulty: dare.difficulty,
      xpReward: dare.xpReward,
    });
    setEditOpen(true);
  }, []);

  const closeEditDare = useCallback(() => {
    setEditOpen(false);
    setEditState(null);
  }, []);

  const setEditTitle = useCallback((title: string) => {
    setEditState((prev) => (prev ? { ...prev, title } : null));
  }, []);

  const setEditDesc = useCallback((description: string) => {
    setEditState((prev) => (prev ? { ...prev, description } : null));
  }, []);

  const setEditDifficulty = useCallback((difficulty: string) => {
    setEditState((prev) => (prev ? { ...prev, difficulty } : null));
  }, []);

  const setEditXp = useCallback((xpReward: number) => {
    setEditState((prev) => (prev ? { ...prev, xpReward } : null));
  }, []);

  const value = useMemo<GroupContextValue>(
    () => ({
      editState,
      editOpen,
      openEditDare,
      closeEditDare,
      setEditTitle,
      setEditDesc,
      setEditDifficulty,
      setEditXp,
      statusConfirm,
      setStatusConfirm,
      deleteConfirmDareId,
      setDeleteConfirmDareId,
    }),
    [
      editState,
      editOpen,
      openEditDare,
      closeEditDare,
      setEditTitle,
      setEditDesc,
      setEditDifficulty,
      setEditXp,
      statusConfirm,
      deleteConfirmDareId,
    ],
  );

  return (
    <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export function useGroupContext(): GroupContextValue {
  const ctx = useContext(GroupContext);
  if (!ctx) {
    throw new Error("useGroupContext must be used within a GroupProvider");
  }
  return ctx;
}
