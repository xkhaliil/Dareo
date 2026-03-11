import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useAuth, AuthProvider } from "./auth-context";
import { useAuthStore } from "@/stores/auth-store";

function TestConsumer() {
  const { isAuthenticated, user } = useAuth();
  return (
    <div>
      <span data-testid="auth">{isAuthenticated ? "yes" : "no"}</span>
      <span data-testid="user">{user?.username ?? "none"}</span>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  it("renders children and provides default unauthenticated state", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId("auth").textContent).toBe("no");
    expect(screen.getByTestId("user").textContent).toBe("none");
  });
});

describe("useAuth", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  it("works without a provider (Zustand is global)", () => {
    render(<TestConsumer />);
    expect(screen.getByTestId("auth").textContent).toBe("no");
  });

  it("login updates state and localStorage", () => {
    const LoginButton = () => {
      const { login } = useAuth();
      return (
        <button onClick={() => login("tok123", { id: "1", username: "Alice", email: "a@b.com", avatarUrl: null, xp: 0, level: 1, rank: "ROOKIE" })}>
          Log In
        </button>
      );
    };
    render(
      <>
        <LoginButton />
        <TestConsumer />
      </>
    );
    act(() => screen.getByText("Log In").click());
    expect(screen.getByTestId("auth").textContent).toBe("yes");
    expect(screen.getByTestId("user").textContent).toBe("Alice");
    expect(localStorage.getItem("token")).toBe("tok123");
  });
});
