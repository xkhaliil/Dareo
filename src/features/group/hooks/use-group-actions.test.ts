import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/shared/stores/auth-store";
import type { GroupData } from "@/shared/services/group-api";

import { GroupProvider } from "../context/group-context";
import { useGroupActions } from "./use-group-actions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const testUser = {
  id: "u1",
  username: "alice",
  email: "a@b.com",
  avatarUrl: null,
  xp: 100,
  level: 10,
  rank: "BRONZE",
};

vi.mock("@/shared/context/auth-context", () => ({
  useAuth: () => ({
    user: testUser,
    isAuthenticated: true,
    token: "tok",
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
  }),
}));

const testGroup: GroupData = {
  id: "g1",
  name: "Squad",
  code: "ABC",
  createdAt: "2024-01-01",
  myRole: "OWNER",
  members: [
    {
      id: "m1",
      role: "OWNER",
      joinedAt: "2024-01-01",
      user: {
        id: "u1",
        username: "alice",
        avatarUrl: null,
        rank: "BRONZE",
        level: 10,
      },
    },
  ],
  dares: [
    {
      id: "d1",
      title: "Backflip",
      description: "Do it",
      difficulty: "HARD",
      xpReward: 50,
      status: "OPEN",
      createdAt: "2024-01-01",
      completedAt: null,
      author: { id: "u1", username: "alice", avatarUrl: null },
      assignedTo: { id: "u1", username: "alice", avatarUrl: null },
    },
  ],
};

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => {
    return React.createElement(
      QueryClientProvider,
      { client: qc },
      React.createElement(GroupProvider, null, children),
    );
  };
}

// ─── useGroupActions — comprehensive non-component test ───────────────────────

describe("useGroupActions", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: testUser,
      token: "tok",
      isAuthenticated: true,
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ id: "d1", status: "OPEN" }),
    } as Response);
  });

  it("isOwner is true when current user is OWNER", () => {
    const { result } = renderHook(() => useGroupActions("g1", testGroup), {
      wrapper: makeWrapper(),
    });
    expect(result.current.isOwner).toBe(true);
  });

  it("isOwner is false when group is undefined", () => {
    const { result } = renderHook(() => useGroupActions("g1", undefined), {
      wrapper: makeWrapper(),
    });
    expect(result.current.isOwner).toBe(false);
  });

  it("currentUserId matches the logged-in user", () => {
    const { result } = renderHook(() => useGroupActions("g1", testGroup), {
      wrapper: makeWrapper(),
    });
    expect(result.current.currentUserId).toBe("u1");
  });

  it("claimingDareId starts as null", () => {
    const { result } = renderHook(() => useGroupActions("g1", testGroup), {
      wrapper: makeWrapper(),
    });
    expect(result.current.claimingDareId).toBeNull();
  });

  it("deleteConfirmDareId starts as null", () => {
    const { result } = renderHook(() => useGroupActions("g1", testGroup), {
      wrapper: makeWrapper(),
    });
    expect(result.current.deleteConfirmDareId).toBeNull();
  });

  it("setDeleteConfirmDareId sets the dare id", () => {
    const { result } = renderHook(() => useGroupActions("g1", testGroup), {
      wrapper: makeWrapper(),
    });
    act(() => result.current.setDeleteConfirmDareId("d99"));
    expect(result.current.deleteConfirmDareId).toBe("d99");
  });

  it("setStatusConfirm sets a status confirmation", () => {
    const { result } = renderHook(() => useGroupActions("g1", testGroup), {
      wrapper: makeWrapper(),
    });
    act(() =>
      result.current.setStatusConfirm({ dareId: "d1", status: "COMPLETED" }),
    );
    expect(result.current.statusConfirm?.dareId).toBe("d1");
    expect(result.current.statusConfirm?.status).toBe("COMPLETED");
  });

  it("handleClaimDare calls fetch and clears claimingDareId", async () => {
    const { result } = renderHook(() => useGroupActions("g1", testGroup), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await result.current.handleClaimDare("d1");
    });

    expect(result.current.claimingDareId).toBeNull();
    expect(fetch).toHaveBeenCalled();
  });

  it("handleDeleteDare calls fetch and clears deletingDareId", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => null,
    } as Response);

    const { result } = renderHook(() => useGroupActions("g1", testGroup), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await result.current.handleDeleteDare("d1");
    });

    expect(result.current.deletingDareId).toBeNull();
  });
});
