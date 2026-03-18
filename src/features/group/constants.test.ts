import { describe, expect, it } from "vitest";

import {
  DIFFICULTY_COLORS,
  RANK_COLORS,
  ROLE_ICONS,
  XP_CAPS,
  XP_DEFAULTS,
} from "./constants";

// ─── DIFFICULTY_COLORS ────────────────────────────────────────────────────────

describe("DIFFICULTY_COLORS", () => {
  it("has entries for all four difficulty levels", () => {
    expect(DIFFICULTY_COLORS).toHaveProperty("EASY");
    expect(DIFFICULTY_COLORS).toHaveProperty("MEDIUM");
    expect(DIFFICULTY_COLORS).toHaveProperty("HARD");
    expect(DIFFICULTY_COLORS).toHaveProperty("EXTREME");
  });

  it("each value is a non-empty string", () => {
    for (const value of Object.values(DIFFICULTY_COLORS)) {
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    }
  });

  it("EASY uses green colour", () => {
    expect(DIFFICULTY_COLORS.EASY).toContain("green");
  });

  it("EXTREME uses red colour", () => {
    expect(DIFFICULTY_COLORS.EXTREME).toContain("red");
  });
});

// ─── RANK_COLORS ──────────────────────────────────────────────────────────────

describe("RANK_COLORS", () => {
  it("covers all seven ranks", () => {
    const ranks = [
      "ROOKIE",
      "BRONZE",
      "SILVER",
      "GOLD",
      "PLATINUM",
      "DIAMOND",
      "LEGEND",
    ];
    for (const rank of ranks) {
      expect(RANK_COLORS).toHaveProperty(rank);
    }
  });

  it("each value is a non-empty Tailwind class string", () => {
    for (const value of Object.values(RANK_COLORS)) {
      expect(typeof value).toBe("string");
      expect(value).toMatch(/^text-/);
    }
  });
});

// ─── ROLE_ICONS ───────────────────────────────────────────────────────────────

describe("ROLE_ICONS", () => {
  it("has an icon for OWNER", () => {
    expect(ROLE_ICONS).toHaveProperty("OWNER");
    expect(ROLE_ICONS.OWNER).toBeTruthy();
  });

  it("has an icon for ADMIN", () => {
    expect(ROLE_ICONS).toHaveProperty("ADMIN");
    expect(ROLE_ICONS.ADMIN).toBeTruthy();
  });
});

// ─── XP_CAPS ──────────────────────────────────────────────────────────────────

describe("XP_CAPS", () => {
  it("has caps for all difficulties", () => {
    expect(XP_CAPS).toHaveProperty("EASY");
    expect(XP_CAPS).toHaveProperty("MEDIUM");
    expect(XP_CAPS).toHaveProperty("HARD");
    expect(XP_CAPS).toHaveProperty("EXTREME");
  });

  it("caps increase with difficulty", () => {
    expect(XP_CAPS.EASY).toBeLessThan(XP_CAPS.MEDIUM);
    expect(XP_CAPS.MEDIUM).toBeLessThan(XP_CAPS.HARD);
    expect(XP_CAPS.HARD).toBeLessThan(XP_CAPS.EXTREME);
  });

  it("EASY cap is 25", () => expect(XP_CAPS.EASY).toBe(25));
  it("MEDIUM cap is 50", () => expect(XP_CAPS.MEDIUM).toBe(50));
  it("HARD cap is 100", () => expect(XP_CAPS.HARD).toBe(100));
  it("EXTREME cap is 200", () => expect(XP_CAPS.EXTREME).toBe(200));
});

// ─── XP_DEFAULTS ──────────────────────────────────────────────────────────────

describe("XP_DEFAULTS", () => {
  it("has defaults for all difficulties", () => {
    expect(XP_DEFAULTS).toHaveProperty("EASY");
    expect(XP_DEFAULTS).toHaveProperty("MEDIUM");
    expect(XP_DEFAULTS).toHaveProperty("HARD");
    expect(XP_DEFAULTS).toHaveProperty("EXTREME");
  });

  it("defaults are less than or equal to caps", () => {
    for (const key of Object.keys(XP_DEFAULTS)) {
      expect(XP_DEFAULTS[key]).toBeLessThanOrEqual(XP_CAPS[key]);
    }
  });

  it("defaults increase with difficulty", () => {
    expect(XP_DEFAULTS.EASY).toBeLessThan(XP_DEFAULTS.MEDIUM);
    expect(XP_DEFAULTS.MEDIUM).toBeLessThan(XP_DEFAULTS.HARD);
    expect(XP_DEFAULTS.HARD).toBeLessThan(XP_DEFAULTS.EXTREME);
  });

  it("EASY default is 10", () => expect(XP_DEFAULTS.EASY).toBe(10));
  it("MEDIUM default is 25", () => expect(XP_DEFAULTS.MEDIUM).toBe(25));
  it("HARD default is 50", () => expect(XP_DEFAULTS.HARD).toBe(50));
  it("EXTREME default is 100", () => expect(XP_DEFAULTS.EXTREME).toBe(100));
});
