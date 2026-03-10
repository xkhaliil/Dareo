import { describe, it, expect } from "vitest";
import { computeLevel, computeRank } from "./xp";

describe("computeLevel", () => {
  it("returns level 1 for 0 XP", () => {
    expect(computeLevel(0)).toBe(1);
  });

  it("returns level 1 for XP below 10", () => {
    expect(computeLevel(5)).toBe(1);
    expect(computeLevel(9)).toBe(1);
  });

  it("returns level 1 for exactly 10 XP", () => {
    expect(computeLevel(10)).toBe(1);
  });

  it("returns level 2 for 20 XP", () => {
    expect(computeLevel(20)).toBe(2);
  });

  it("returns correct level for various XP values", () => {
    expect(computeLevel(30)).toBe(3);
    expect(computeLevel(55)).toBe(5);
    expect(computeLevel(99)).toBe(9);
    expect(computeLevel(100)).toBe(10);
  });

  it("handles large XP values", () => {
    expect(computeLevel(1000)).toBe(100);
  });

  it("returns level 1 for negative XP", () => {
    expect(computeLevel(-10)).toBe(1);
  });
});

describe("computeRank", () => {
  it("returns ROOKIE for 0 XP", () => {
    expect(computeRank(0)).toBe("ROOKIE");
  });

  it("returns ROOKIE for XP below 50", () => {
    expect(computeRank(49)).toBe("ROOKIE");
  });

  it("returns BRONZE at exactly 50 XP", () => {
    expect(computeRank(50)).toBe("BRONZE");
  });

  it("returns BRONZE for XP between 50 and 149", () => {
    expect(computeRank(100)).toBe("BRONZE");
    expect(computeRank(149)).toBe("BRONZE");
  });

  it("returns SILVER at exactly 150 XP", () => {
    expect(computeRank(150)).toBe("SILVER");
  });

  it("returns SILVER for XP between 150 and 249", () => {
    expect(computeRank(200)).toBe("SILVER");
    expect(computeRank(249)).toBe("SILVER");
  });

  it("returns GOLD at exactly 250 XP", () => {
    expect(computeRank(250)).toBe("GOLD");
  });

  it("returns GOLD for XP between 250 and 349", () => {
    expect(computeRank(349)).toBe("GOLD");
  });

  it("returns PLATINUM at exactly 350 XP", () => {
    expect(computeRank(350)).toBe("PLATINUM");
  });

  it("returns PLATINUM for XP between 350 and 499", () => {
    expect(computeRank(499)).toBe("PLATINUM");
  });

  it("returns DIAMOND at exactly 500 XP", () => {
    expect(computeRank(500)).toBe("DIAMOND");
  });

  it("returns DIAMOND for XP between 500 and 699", () => {
    expect(computeRank(699)).toBe("DIAMOND");
  });

  it("returns LEGEND at exactly 700 XP", () => {
    expect(computeRank(700)).toBe("LEGEND");
  });

  it("returns LEGEND for XP above 700", () => {
    expect(computeRank(1000)).toBe("LEGEND");
  });

  it("returns ROOKIE for negative XP", () => {
    expect(computeRank(-5)).toBe("ROOKIE");
  });

  it("tests all rank boundaries", () => {
    const boundaries = [
      { xp: 0, rank: "ROOKIE" },
      { xp: 49, rank: "ROOKIE" },
      { xp: 50, rank: "BRONZE" },
      { xp: 149, rank: "BRONZE" },
      { xp: 150, rank: "SILVER" },
      { xp: 249, rank: "SILVER" },
      { xp: 250, rank: "GOLD" },
      { xp: 349, rank: "GOLD" },
      { xp: 350, rank: "PLATINUM" },
      { xp: 499, rank: "PLATINUM" },
      { xp: 500, rank: "DIAMOND" },
      { xp: 699, rank: "DIAMOND" },
      { xp: 700, rank: "LEGEND" },
    ];

    for (const { xp, rank } of boundaries) {
      expect(computeRank(xp)).toBe(rank);
    }
  });
});
