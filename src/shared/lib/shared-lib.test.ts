import { describe, expect, it } from "vitest";

import { API_URL, ApiError, apiFetch, authHeaders } from "./api";
import { signInSchema, signUpSchema } from "./auth";
import { cn } from "./utils";
// ─── shared/lib barrel re-exports ────────────────────────────────────────────
// These files re-export from their canonical locations.
// Tests confirm the exports are accessible through the barrel paths.

import { computeLevel, computeRank } from "./xp";

describe("shared/lib/xp re-exports", () => {
  it("exports computeLevel", () => {
    expect(typeof computeLevel).toBe("function");
  });
  it("exports computeRank", () => {
    expect(typeof computeRank).toBe("function");
  });
  it("computeLevel(0) returns 1", () => {
    expect(computeLevel(0)).toBe(1);
  });
  it("computeRank(0) returns ROOKIE", () => {
    expect(computeRank(0)).toBe("ROOKIE");
  });
});

describe("shared/lib/utils re-exports", () => {
  it("exports cn", () => {
    expect(typeof cn).toBe("function");
  });
  it("cn merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });
});

describe("shared/lib/auth re-exports", () => {
  it("exports signInSchema", () => {
    expect(signInSchema).toBeDefined();
  });
  it("exports signUpSchema", () => {
    expect(signUpSchema).toBeDefined();
  });
  it("signInSchema validates correct input", () => {
    const result = signInSchema.safeParse({
      email: "a@b.com",
      password: "pw",
    });
    expect(result.success).toBe(true);
  });
});

describe("shared/lib/api re-exports", () => {
  it("exports API_URL", () => {
    expect(typeof API_URL).toBe("string");
  });
  it("exports ApiError", () => {
    expect(typeof ApiError).toBe("function");
  });
  it("exports apiFetch", () => {
    expect(typeof apiFetch).toBe("function");
  });
  it("exports authHeaders", () => {
    expect(typeof authHeaders).toBe("function");
  });
  it("authHeaders with token includes Authorization", () => {
    const h = authHeaders("tok") as Record<string, string>;
    expect(h["Authorization"]).toBe("Bearer tok");
  });
});
