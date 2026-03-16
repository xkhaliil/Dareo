import SignUpPage from "@/features/auth/sign-up-page";
import GamePage from "@/features/game/game-page";
import ProfilePage from "@/features/profile/profile-page";
import type { AuthUser } from "@/stores/auth-store";
import { useAuthStore } from "@/stores/auth-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const testUser = {
  id: "1",
  username: "TestUser",
  email: "test@example.com",
  avatarUrl: null,
  xp: 0,
  level: 1,
  rank: "ROOKIE",
};

vi.mock("@/context/auth-context", () => ({
  useAuth: () => ({
    user: testUser,
    isAuthenticated: true,
    token: "fake-token",
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
  }),
}));

vi.mock("@/lib/uploadthing", () => ({
  useUploadThing: () => ({
    startUpload: vi.fn(),
    isUploading: false,
  }),
}));
vi.mock("@/shared/lib/uploadthing", () => ({
  useUploadThing: () => ({
    startUpload: vi.fn(),
    isUploading: false,
  }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

beforeEach(() => {
  useAuthStore.setState({
    user: testUser as AuthUser,
    token: "fake-token",
    isAuthenticated: true,
  });
});

describe("SignUpPage", () => {
  it("renders without crashing", () => {
    render(<SignUpPage />, { wrapper: createWrapper() });
    expect(screen.getByText("Create your account")).toBeInTheDocument();
  });
});

describe("ProfilePage", () => {
  it("renders without crashing", () => {
    render(<ProfilePage />, { wrapper: createWrapper() });
    expect(screen.getAllByText("TestUser").length).toBeGreaterThan(0);
  });
});

describe("GamePage", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);
  });

  it("renders without crashing", () => {
    render(<GamePage />, { wrapper: createWrapper() });
    expect(screen.getByText("Dareo")).toBeInTheDocument();
  });
});
