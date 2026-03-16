import { Crown, Shield } from "lucide-react";

export const DIFFICULTY_COLORS: Record<string, string> = {
  EASY: "bg-green-500/10 text-green-400",
  MEDIUM: "bg-yellow-500/10 text-yellow-400",
  HARD: "bg-orange-500/10 text-orange-400",
  EXTREME: "bg-red-500/10 text-red-400",
};

export const RANK_COLORS: Record<string, string> = {
  ROOKIE: "text-zinc-400",
  BRONZE: "text-amber-500",
  SILVER: "text-slate-400",
  GOLD: "text-yellow-500",
  PLATINUM: "text-cyan-400",
  DIAMOND: "text-blue-400",
  LEGEND: "text-purple-400",
};

export const ROLE_ICONS: Record<string, typeof Crown> = {
  OWNER: Crown,
  ADMIN: Shield,
};

export const XP_CAPS: Record<string, number> = {
  EASY: 25,
  MEDIUM: 50,
  HARD: 100,
  EXTREME: 200,
};

export const XP_DEFAULTS: Record<string, number> = {
  EASY: 10,
  MEDIUM: 25,
  HARD: 50,
  EXTREME: 100,
};
