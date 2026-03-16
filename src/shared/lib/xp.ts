export function computeLevel(xp: number): number {
  return Math.max(1, Math.floor(xp / 10));
}

export function computeRank(xp: number): string {
  if (xp >= 700) return "LEGEND";
  if (xp >= 500) return "DIAMOND";
  if (xp >= 350) return "PLATINUM";
  if (xp >= 250) return "GOLD";
  if (xp >= 150) return "SILVER";
  if (xp >= 50) return "BRONZE";
  return "ROOKIE";
}
