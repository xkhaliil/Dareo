import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/context/auth-context", () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    logout: vi.fn(),
    token: null,
    login: vi.fn(),
    updateUser: vi.fn(),
  }),
}));

import App from "./App";

describe("App", () => {
  it("renders the landing page without crashing", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Dareo")).toBeInTheDocument();
  });
});
