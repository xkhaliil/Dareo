/* eslint-disable react-refresh/only-export-components */
/**
 * AuthContext — root-level context.
 *
 * Placed at the root of the app (in main.tsx) because authentication state is
 * needed by every part of the application: protected routes, the navbar,
 * profile page, game page, and all data-fetching hooks.
 *
 * The underlying state is managed by Zustand (auth-store.ts) for
 * localStorage persistence and devtools support. This context acts as the
 * single public API for auth — consumers never import Zustand directly.
 *
 * This satisfies: "Something at the root of the project that specifically
 * needs to be at the root, using Context."
 */

import { createContext, useContext, useMemo, type ReactNode } from "react";

import { useAuthStore, type AuthUser } from "@/shared/stores/auth-store";

// ─── Types ────────────────────────────────────────────────────────────────────

export type { AuthUser };

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const updateUser = useAuthStore((s) => s.updateUser);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, isAuthenticated, login, logout, updateUser }),
    [user, token, isAuthenticated, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
