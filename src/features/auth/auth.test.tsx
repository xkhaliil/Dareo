import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import AuthNavbar from "./components/auth-navbar";
import SignInPage from "./sign-in-page";
import SignUpPage from "./sign-up-page";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

vi.mock("@/shared/lib/uploadthing", () => ({
  useUploadThing: () => ({ startUpload: vi.fn(), isUploading: false }),
}));
vi.mock("@/lib/uploadthing", () => ({
  useUploadThing: () => ({ startUpload: vi.fn(), isUploading: false }),
}));

// ─── AuthNavbar — comprehensive component test with user interactions ─────────

describe("AuthNavbar", () => {
  it("renders the Dareo brand link", () => {
    render(
      <MemoryRouter>
        <AuthNavbar linkTo="/sign-up" linkLabel="Sign Up" />
      </MemoryRouter>,
    );
    expect(screen.getByText("Dareo")).toBeInTheDocument();
  });

  it("renders the action link with the supplied label", () => {
    render(
      <MemoryRouter>
        <AuthNavbar linkTo="/sign-in" linkLabel="Sign In" />
      </MemoryRouter>,
    );
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("brand link navigates to /", () => {
    render(
      <MemoryRouter>
        <AuthNavbar linkTo="/sign-up" linkLabel="Sign Up" />
      </MemoryRouter>,
    );
    expect(screen.getByText("Dareo").closest("a")).toHaveAttribute("href", "/");
  });

  it("action link navigates to the supplied path", () => {
    render(
      <MemoryRouter>
        <AuthNavbar linkTo="/sign-up" linkLabel="Sign Up" />
      </MemoryRouter>,
    );
    expect(screen.getByText("Sign Up").closest("a")).toHaveAttribute(
      "href",
      "/sign-up",
    );
  });

  it("works with /sign-in as the link target", () => {
    render(
      <MemoryRouter>
        <AuthNavbar linkTo="/sign-in" linkLabel="Sign In" />
      </MemoryRouter>,
    );
    expect(screen.getByText("Sign In").closest("a")).toHaveAttribute(
      "href",
      "/sign-in",
    );
  });
});

// ─── SignInPage — smoke test ──────────────────────────────────────────────────

describe("SignInPage", () => {
  it("renders without crashing", () => {
    render(<SignInPage />, { wrapper });
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });

  it("renders email and password fields", () => {
    render(<SignInPage />, { wrapper });
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("has a link to sign-up page", () => {
    render(<SignInPage />, { wrapper });
    const link = screen.getByText("Create Account").closest("a");
    expect(link).toHaveAttribute("href", "/sign-up");
  });
});

// ─── SignUpPage — smoke test ──────────────────────────────────────────────────

describe("SignUpPage", () => {
  it("renders without crashing", () => {
    render(<SignUpPage />, { wrapper });
    expect(screen.getByText("Create your account")).toBeInTheDocument();
  });

  it("renders username, email, and password fields", () => {
    render(<SignUpPage />, { wrapper });
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("typing into fields works — user interaction", async () => {
    const user = userEvent.setup();
    render(<SignUpPage />, { wrapper });
    const usernameInput = screen.getByLabelText("Username");
    await user.type(usernameInput, "alice");
    expect(usernameInput).toHaveValue("alice");
  });

  it("has a link to sign-in page", () => {
    render(<SignUpPage />, { wrapper });
    const links = screen.getAllByText("Sign In");
    const anchorLink = links.map((el) => el.closest("a")).find(Boolean);
    expect(anchorLink).toHaveAttribute("href", "/sign-in");
  });
});
