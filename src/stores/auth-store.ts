import { create } from "zustand";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  xp: number;
  level: number;
  rank: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  })(),
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),

  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null, isAuthenticated: false });
  },

  updateUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
}));
