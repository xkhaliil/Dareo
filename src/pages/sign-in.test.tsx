import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SignInPage from "./sign-in";

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("@/context/auth-context", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <SignInPage />
    </MemoryRouter>
  );
}

describe("SignInPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("renders the sign-in form", () => {
    renderPage();
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("allows typing into email and password fields", async () => {
    const user = userEvent.setup();
    renderPage();

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "myPassword1");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("myPassword1");
  });

  it("toggles password visibility when clicking eye icon", async () => {
    const user = userEvent.setup();
    renderPage();

    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    // Find the toggle button (the button inside the password field)
    const toggleButtons = screen.getAllByRole("button", { hidden: true });
    const eyeButton = toggleButtons.find(
      (btn) => btn.closest(".relative") && btn.querySelector("svg")
    );

    if (eyeButton) {
      await user.click(eyeButton);
      expect(passwordInput).toHaveAttribute("type", "text");

      await user.click(eyeButton);
      expect(passwordInput).toHaveAttribute("type", "password");
    }
  });

  it("shows validation error for empty email", async () => {
    const user = userEvent.setup();
    renderPage();

    // Leave email empty, type password
    await user.type(screen.getByLabelText("Password"), "x");

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for empty password", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("Email"), "test@example.com");

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("submits the form and navigates on success", async () => {
    const user = userEvent.setup();

    const mockResponse = {
      ok: true,
      json: async () => ({
        token: "fake-token",
        user: { id: "1", username: "test", email: "test@example.com", xp: 0, level: 1, rank: "ROOKIE", avatarUrl: null },
      }),
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(mockResponse as Response);

    renderPage();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "Password1");

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("fake-token", expect.objectContaining({ username: "test" }));
      expect(mockNavigate).toHaveBeenCalledWith("/game");
    });
  });

  it("shows server error on failed login", async () => {
    const user = userEvent.setup();

    const mockResponse = {
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(mockResponse as Response);

    renderPage();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "Password1");

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("shows network error when fetch fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("network down"));

    renderPage();

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "Password1");

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });
  });

  it("has a link to the sign up page", () => {
    renderPage();
    const link = screen.getByText("Sign Up").closest("a");
    expect(link).toHaveAttribute("href", "/sign-up");
  });
});
