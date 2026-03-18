import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useIsMobile } from "./use-mobile";

describe("useIsMobile", () => {
  let listeners: Array<() => void>;

  beforeEach(() => {
    listeners = [];
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: (_: string, cb: () => void) => listeners.push(cb),
      removeEventListener: vi.fn(),
    }));
  });

  it("returns false for desktop viewport", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("returns true for mobile viewport", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
});
