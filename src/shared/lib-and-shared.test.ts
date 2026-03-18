import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { API_URL, ApiError, authHeaders } from "@/shared/lib/api";
import { signInSchema } from "@/shared/lib/auth";
// ─── shared/lib smoke tests ──────────────────────────────────────────────────
// Verify the shared/lib utilities are importable and functional.

import { cn } from "@/shared/lib/utils";
import { computeLevel, computeRank } from "@/shared/lib/xp";

// ─── shared/hooks/use-mobile.ts ───────────────────────────────────────────────

import { useIsMobile } from "./hooks/use-mobile";

describe("shared/lib/utils", () => {
  it("cn is a function", () => expect(typeof cn).toBe("function"));
  it("cn merges two classes", () => expect(cn("a", "b")).toBe("a b"));
});

describe("shared/lib/xp", () => {
  it("computeLevel is a function", () =>
    expect(typeof computeLevel).toBe("function"));
  it("computeRank is a function", () =>
    expect(typeof computeRank).toBe("function"));
  it("computeLevel(20) === 2", () => expect(computeLevel(20)).toBe(2));
  it("computeRank(50) === BRONZE", () =>
    expect(computeRank(50)).toBe("BRONZE"));
});

describe("shared/lib/auth", () => {
  it("signInSchema is defined", () => expect(signInSchema).toBeDefined());
  it("signInSchema rejects empty password", () => {
    const r = signInSchema.safeParse({ email: "a@b.com", password: "" });
    expect(r.success).toBe(false);
  });
});

describe("shared/lib/api", () => {
  it("API_URL is a non-empty string", () => {
    expect(typeof API_URL).toBe("string");
    expect(API_URL.length).toBeGreaterThan(0);
  });
  it("ApiError is constructable", () => {
    const e = new ApiError(404, "Not Found");
    expect(e.status).toBe(404);
    expect(e.message).toBe("Not Found");
  });
  it("authHeaders includes Content-Type", () => {
    const h = authHeaders(null) as Record<string, string>;
    expect(h["Content-Type"]).toBe("application/json");
  });
});

describe("shared/hooks/use-mobile", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it("exports useIsMobile", () => {
    expect(typeof useIsMobile).toBe("function");
  });

  it("returns false on wide viewport", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("returns true on narrow viewport", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
});

// ─── shared/types/index.ts ────────────────────────────────────────────────────
// This file only re-exports types — verify the module is importable.

describe("shared/types/index", () => {
  it("module loads without error", async () => {
    // Dynamic import to test the barrel at runtime
    const mod = await import("./types/index");
    // It re-exports types only — no runtime values, but module should load
    expect(mod).toBeDefined();
  });
});
