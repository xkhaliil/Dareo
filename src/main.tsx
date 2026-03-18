/* eslint-disable react-refresh/only-export-components */
import { StrictMode, Suspense } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./index.css";

import { Loader2 } from "lucide-react";

import { AuthProvider, useAuth } from "@/shared/context/auth-context";
import { ThemeProvider } from "@/shared/context/theme-context";

import App from "./App.tsx";
import SignInPage from "./features/auth/sign-in-page.tsx";
import SignUpPage from "./features/auth/sign-up-page.tsx";
import GamePage from "./features/game/game-page.tsx";
import GroupPage from "./features/group/group-page.tsx";
import ProfilePage from "./features/profile/profile-page.tsx";
import { ErrorBoundary } from "./shared/components/error-boundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="text-muted-foreground size-8 animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;
  return children;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<App />} />
                  <Route path="/sign-in" element={<SignInPage />} />
                  <Route path="/sign-up" element={<SignUpPage />} />
                  <Route
                    path="/game"
                    element={
                      <ProtectedRoute>
                        <GamePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/group/:id"
                    element={
                      <ProtectedRoute>
                        <GroupPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
