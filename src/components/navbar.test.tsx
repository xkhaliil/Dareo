import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./navbar";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockLogout = vi.fn();
const mockUseAuth = vi.fn();

vi.mock("@/context/auth-context", () => ({
  useAuth: () => mockUseAuth(),
}));

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
}

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when not authenticated", () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: mockLogout,
      });
    });

    it("renders the Dareo brand link", () => {
      renderNavbar();
      expect(screen.getByText("Dareo")).toBeInTheDocument();
    });

    it("shows Sign In and Sign Up buttons", () => {
      renderNavbar();
      expect(screen.getByText("Sign In")).toBeInTheDocument();
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });

    it("does not show user avatar or XP badge", () => {
      renderNavbar();
      expect(screen.queryByText(/Lv\./)).not.toBeInTheDocument();
      expect(screen.queryByText(/XP/)).not.toBeInTheDocument();
    });

    it("Sign In links to /sign-in", () => {
      renderNavbar();
      const link = screen.getByText("Sign In").closest("a");
      expect(link).toHaveAttribute("href", "/sign-in");
    });

    it("Sign Up links to /sign-up", () => {
      renderNavbar();
      const link = screen.getByText("Sign Up").closest("a");
      expect(link).toHaveAttribute("href", "/sign-up");
    });

    it("Dareo link goes to /", () => {
      renderNavbar();
      const link = screen.getByText("Dareo").closest("a");
      expect(link).toHaveAttribute("href", "/");
    });
  });

  describe("when authenticated", () => {
    const user = {
      id: "1",
      username: "TestUser",
      email: "test@example.com",
      avatarUrl: null,
      xp: 42,
      level: 4,
      rank: "ROOKIE",
    };

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user,
        isAuthenticated: true,
        logout: mockLogout,
      });
    });

    it("shows the XP badge with level and XP", () => {
      renderNavbar();
      expect(screen.getByText("Lv.4 · 42 XP")).toBeInTheDocument();
    });

    it("shows the user avatar fallback with initials", () => {
      renderNavbar();
      expect(screen.getByText("TE")).toBeInTheDocument();
    });

    it("does not show Sign In / Sign Up buttons", () => {
      renderNavbar();
      expect(screen.queryByText("Sign In")).not.toBeInTheDocument();
      expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
    });

    it("Dareo link goes to /game when authenticated", () => {
      renderNavbar();
      const link = screen.getByText("Dareo").closest("a");
      expect(link).toHaveAttribute("href", "/game");
    });
  });
});
