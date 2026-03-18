import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import App from "./App";

vi.mock("@/shared/context/auth-context", () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    logout: vi.fn(),
    token: null,
    login: vi.fn(),
    updateUser: vi.fn(),
  }),
}));

describe("App", () => {
  it("renders the landing page without crashing", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText("Dareo")).toBeInTheDocument();
  });
});
