import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { apiFetch } from "@/shared/lib/api";
import { signIn, signUp } from "@/shared/services/auth-api";
import {
  claimDare,
  completeDare,
  createDare,
  createGroup,
  deleteDare,
  editDare,
  fetchGroup,
  fetchGroups,
  joinGroup,
} from "@/shared/services/group-api";
import { updateProfile } from "@/shared/services/user-api";

// Mock apiFetch at the module level so services never call real fetch
// This sidesteps the VITE_API_URL environment variable issue entirely.
vi.mock("@/shared/lib/api", () => ({
  API_URL: "http://localhost:3001",
  apiFetch: vi.fn(),
  authHeaders: (token: string | null) => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mockApiFetchOk(body: unknown) {
  vi.mocked(apiFetch).mockResolvedValueOnce(body as never);
}

beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.restoreAllMocks());

const TOKEN = "test-token";

// ─── auth-api ─────────────────────────────────────────────────────────────────

describe("signIn", () => {
  it("calls POST /api/auth/sign-in with email and password", async () => {
    mockApiFetchOk({ token: "t", user: {} });
    await signIn("a@b.com", "pass");
    expect(vi.mocked(apiFetch)).toHaveBeenCalledWith(
      "/api/auth/sign-in",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("returns the token and user on success", async () => {
    const payload = { token: "abc", user: { id: "1", username: "Alice" } };
    mockApiFetchOk(payload);
    const result = await signIn("a@b.com", "pass");
    expect(result).toEqual(payload);
  });

  it("throws on invalid credentials", async () => {
    vi.mocked(apiFetch).mockRejectedValueOnce(
      Object.assign(new Error("Invalid credentials"), { status: 401 }),
    );
    await expect(signIn("a@b.com", "wrong")).rejects.toThrow(
      "Invalid credentials",
    );
  });
});

describe("signUp", () => {
  it("calls POST /api/auth/sign-up", async () => {
    mockApiFetchOk({ token: "t", user: {} });
    await signUp({ username: "Alice", email: "a@b.com", password: "pw" });
    expect(vi.mocked(apiFetch)).toHaveBeenCalledWith(
      "/api/auth/sign-up",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("returns token and user on success", async () => {
    const payload = { token: "abc", user: { id: "1" } };
    mockApiFetchOk(payload);
    const result = await signUp({
      username: "Alice",
      email: "a@b.com",
      password: "pw",
    });
    expect(result).toEqual(payload);
  });

  it("throws when username is taken", async () => {
    vi.mocked(apiFetch).mockRejectedValueOnce(
      Object.assign(new Error("Username taken"), { status: 409 }),
    );
    await expect(
      signUp({ username: "Alice", email: "a@b.com", password: "pw" }),
    ).rejects.toThrow("Username taken");
  });
});

// ─── user-api ─────────────────────────────────────────────────────────────────

describe("updateProfile", () => {
  it("calls PATCH /api/user/profile", async () => {
    mockApiFetchOk({ id: "1", username: "Alice" });
    await updateProfile({ username: "Alice" }, TOKEN);
    expect(vi.mocked(apiFetch)).toHaveBeenCalledWith(
      "/api/user/profile",
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  it("sends Authorization header", async () => {
    mockApiFetchOk({ id: "1", username: "Alice" });
    await updateProfile({ username: "Alice" }, TOKEN);
    expect(vi.mocked(apiFetch)).toHaveBeenCalledWith(
      "/api/user/profile",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${TOKEN}`,
        }),
      }),
    );
  });

  it("returns the updated user", async () => {
    const updated = { id: "1", username: "Alice" };
    mockApiFetchOk(updated);
    const result = await updateProfile({ username: "Alice" }, TOKEN);
    expect(result).toEqual(updated);
  });
});

// ─── group-api ────────────────────────────────────────────────────────────────

describe("fetchGroups", () => {
  it("calls GET /api/groups", async () => {
    mockApiFetchOk([]);
    await fetchGroups(TOKEN);
    expect(vi.mocked(apiFetch)).toHaveBeenCalledWith(
      "/api/groups",
      expect.anything(),
    );
  });

  it("returns an array of groups", async () => {
    const groups = [{ id: "g1", name: "Squad" }];
    mockApiFetchOk(groups);
    const result = await fetchGroups(TOKEN);
    expect(result).toEqual(groups);
  });
});

describe("fetchGroup", () => {
  it("calls GET /api/groups/:id", async () => {
    mockApiFetchOk({ id: "g1" });
    await fetchGroup("g1", TOKEN);
    expect(vi.mocked(apiFetch)).toHaveBeenCalledWith(
      "/api/groups/g1",
      expect.anything(),
    );
  });
});

describe("createGroup", () => {
  it("calls POST /api/groups", async () => {
    mockApiFetchOk({ id: "g1", name: "Squad" });
    await createGroup("Squad", TOKEN);
    expect(vi.mocked(apiFetch)).toHaveBeenCalledWith(
      "/api/groups",
      expect.objectContaining({ method: "POST" }),
    );
  });
});

describe("joinGroup", () => {
  it("calls POST /api/groups/join with the code", async () => {
    mockApiFetchOk({ id: "g1" });
    await joinGroup("ABC123", TOKEN);
    expect(vi.mocked(apiFetch)).toHaveBeenCalledWith(
      "/api/groups/join",
      expect.objectContaining({ method: "POST" }),
    );
  });
});

describe("createDare", () => {
  it("calls POST /api/groups/:id/dares", async () => {
    mockApiFetchOk({ id: "d1" });
    await createDare(
      "g1",
      { title: "T", description: "D", difficulty: "EASY", xpReward: 10 },
      TOKEN,
    );
    expect(vi.mocked(apiFetch)).toHaveBeenCalledWith(
      "/api/groups/g1/dares",
      expect.objectContaining({ method: "POST" }),
    );
  });
});

describe("claimDare", () => {
  it("calls PATCH /api/groups/:id/dares/:dareId/claim", async () => {
    mockApiFetchOk({ id: "d1" });
    await claimDare("g1", "d1", TOKEN);
    expect(vi.mocked(apiFetch)).toHaveBeenCalledWith(
      "/api/groups/g1/dares/d1/claim",
      expect.objectContaining({ method: "PATCH" }),
    );
  });
});

describe("completeDare", () => {
  it("calls PATCH /api/groups/:id/dares/:dareId/complete", async () => {
    mockApiFetchOk({ id: "d1" });
    await completeDare("g1", "d1", "COMPLETED", TOKEN);
    expect(vi.mocked(apiFetch)).toHaveBeenCalledWith(
      "/api/groups/g1/dares/d1/complete",
      expect.anything(),
    );
  });

  it("supports PASSED status", async () => {
    mockApiFetchOk({ id: "d1" });
    await completeDare("g1", "d1", "PASSED", TOKEN);
    expect(vi.mocked(apiFetch)).toHaveBeenCalledWith(
      "/api/groups/g1/dares/d1/complete",
      expect.objectContaining({
        body: expect.stringContaining("PASSED"),
      }),
    );
  });
});

describe("deleteDare", () => {
  it("calls DELETE /api/groups/:id/dares/:dareId", async () => {
    mockApiFetchOk(null);
    await deleteDare("g1", "d1", TOKEN);
    expect(vi.mocked(apiFetch)).toHaveBeenCalledWith(
      "/api/groups/g1/dares/d1",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});

describe("editDare", () => {
  it("calls PATCH /api/groups/:id/dares/:dareId", async () => {
    mockApiFetchOk({ id: "d1" });
    await editDare(
      "g1",
      "d1",
      { title: "T", description: "D", difficulty: "EASY", xpReward: 10 },
      TOKEN,
    );
    expect(vi.mocked(apiFetch)).toHaveBeenCalledWith(
      "/api/groups/g1/dares/d1",
      expect.objectContaining({ method: "PATCH" }),
    );
  });
});
