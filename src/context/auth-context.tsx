import type { ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";

export type { AuthUser } from "@/stores/auth-store";

export function useAuth() {
  return useAuthStore();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
