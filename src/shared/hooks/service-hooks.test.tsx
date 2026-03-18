import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/shared/stores/auth-store";
import { useSignIn, useSignUp } from "@/shared/hooks/use-auth-service";
import {
  useCreateGroup,
  useGroup,
  useGroups,
} from "@/shared/hooks/use-group-service";
import { useUpdateProfile } from "@/shared/hooks/use-user-service";

// ─── Wrapper ─────────────────────────────────────────────────────────────────

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const testUser = {
  id: "u1",
  username: "alice",
  email: "a@b.com",
  avatarUrl: null,
  xp: 0,
  level: 1,
  rank: "ROOKIE",
};

beforeEach(() => {
  vi.spyOn(globalThis, "fetch");
  localStorage.clear();
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
});

afterEach(() => vi.restoreAllMocks());

// ─── useSignIn ────────────────────────────────────────────────────────────────

describe("useSignIn", () => {
  it("calls signIn and updates the auth store on success", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "tok", user: testUser }),
    } as Response);

    const { result } = renderHook(() => useSignIn(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        email: "a@b.com",
        password: "Password1",
      });
    });

    const state = useAuthStore.getState();
    expect(state.token).toBe("tok");
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.username).toBe("alice");
  });

  it("throws on invalid credentials", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "Bad credentials" }),
    } as Response);

    const { result } = renderHook(() => useSignIn(), {
      wrapper: makeWrapper(),
    });

    await expect(
      act(async () => {
        await result.current.mutateAsync({ email: "x@x.com", password: "y" });
      }),
    ).rejects.toThrow("Bad credentials");
  });
});

// ─── useSignUp ────────────────────────────────────────────────────────────────

describe("useSignUp", () => {
  it("calls signUp and stores the returned token", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "new-tok", user: testUser }),
    } as Response);

    const { result } = renderHook(() => useSignUp(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({
        username: "alice",
        email: "a@b.com",
        password: "Password1",
      });
    });

    expect(useAuthStore.getState().token).toBe("new-tok");
  });
});

// ─── useGroups ────────────────────────────────────────────────────────────────

describe("useGroups", () => {
  it("returns data from the groups endpoint", async () => {
    useAuthStore.setState({
      user: testUser,
      token: "tok",
      isAuthenticated: true,
    });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: "g1", name: "Squad" }],
    } as Response);

    const { result } = renderHook(() => useGroups(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0].id).toBe("g1");
  });

  it("isLoading is true initially", () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    const { result } = renderHook(() => useGroups(), {
      wrapper: makeWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });
});

// ─── useGroup ─────────────────────────────────────────────────────────────────

describe("useGroup", () => {
  it("fetches a single group by id", async () => {
    useAuthStore.setState({ token: "tok", isAuthenticated: true, user: null });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "g1", name: "Squad", members: [], dares: [] }),
    } as Response);

    const { result } = renderHook(() => useGroup("g1"), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe("g1");
  });
});

// ─── useCreateGroup ───────────────────────────────────────────────────────────

describe("useCreateGroup", () => {
  it("creates a group and returns the new group data", async () => {
    useAuthStore.setState({ token: "tok", isAuthenticated: true, user: null });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "g2", name: "New Squad" }),
    } as Response);

    // Second call for cache invalidation refetch
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    const { result } = renderHook(() => useCreateGroup(), {
      wrapper: makeWrapper(),
    });

    let group: { id: string; name: string } | undefined;
    await act(async () => {
      group = (await result.current.mutateAsync("New Squad")) as {
        id: string;
        name: string;
      };
    });

    expect(group?.id).toBe("g2");
  });
});

// ─── useUpdateProfile ────────────────────────────────────────────────────────

describe("useUpdateProfile", () => {
  it("updates the profile and syncs the auth store", async () => {
    useAuthStore.setState({
      user: testUser,
      token: "tok",
      isAuthenticated: true,
    });

    const updated = { ...testUser, username: "alice2" };
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => updated,
    } as Response);

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ username: "alice2" });
    });

    expect(useAuthStore.getState().user?.username).toBe("alice2");
  });
});
