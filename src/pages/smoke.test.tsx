import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/context/auth-context", () => ({
  useAuth: () => ({
    user: {
      id: "1",
      username: "TestUser",
      email: "test@example.com",
      avatarUrl: null,
      xp: 0,
      level: 1,
      rank: "ROOKIE",
    },
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

import SignUpPage from "./sign-up";
import ProfilePage from "./profile";
import GamePage from "./game";

describe("SignUpPage", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Create your account")).toBeInTheDocument();
  });
});

describe("ProfilePage", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
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
    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Dareo")).toBeInTheDocument();
  });
});
