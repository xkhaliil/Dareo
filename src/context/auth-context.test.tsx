import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthProvider, useAuth } from "./auth-context";

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
  it("throws when used outside AuthProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow();
    spy.mockRestore();
  });
});
