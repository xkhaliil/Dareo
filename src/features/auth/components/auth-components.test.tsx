import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/shared/stores/auth-store";

import AvatarUpload from "./avatar-upload";
import SignInForm from "./sign-in-form";
import SignUpForm from "./sign-up-form";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("@/shared/lib/uploadthing", () => ({
  useUploadThing: () => ({ startUpload: vi.fn(), isUploading: false }),
}));
vi.mock("@/lib/uploadthing", () => ({
  useUploadThing: () => ({ startUpload: vi.fn(), isUploading: false }),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

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

beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
});

// ─── SignInForm — comprehensive component + user interactions ─────────────────

describe("SignInForm", () => {
  it("renders email and password fields", () => {
    render(<SignInForm />, { wrapper });
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("renders the Sign In submit button", () => {
    render(<SignInForm />, { wrapper });
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("has a link to the sign-up page", () => {
    render(<SignInForm />, { wrapper });
    expect(screen.getByText("Create Account").closest("a")).toHaveAttribute(
      "href",
      "/sign-up",
    );
  });

  it("accepts typed input — user interaction", async () => {
    const user = userEvent.setup();
    render(<SignInForm />, { wrapper });
    await user.type(screen.getByLabelText("Email"), "test@test.com");
    expect(screen.getByLabelText("Email")).toHaveValue("test@test.com");
  });

  it("toggles password visibility — user interaction", async () => {
    const user = userEvent.setup();
    render(<SignInForm />, { wrapper });
    const pwd = screen.getByLabelText("Password");
    expect(pwd).toHaveAttribute("type", "password");
    const toggleBtn = pwd
      .closest(".relative")
      ?.querySelector("button[type='button']");
    if (toggleBtn) {
      await user.click(toggleBtn as Element);
      expect(pwd).toHaveAttribute("type", "text");
    }
  });

  it("shows validation error for invalid email — user interaction", async () => {
    const user = userEvent.setup();
    render(<SignInForm />, { wrapper });
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it("shows server error on failed login — user interaction", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "Bad credentials" }),
    } as Response);
    render(<SignInForm />, { wrapper });
    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "Password1");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText("Bad credentials")).toBeInTheDocument();
    });
  });

  it("navigates to /game on successful login — user interaction", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "tok",
        user: {
          id: "1",
          username: "alice",
          email: "a@b.com",
          xp: 0,
          level: 1,
          rank: "ROOKIE",
          avatarUrl: null,
        },
      }),
    } as Response);
    render(<SignInForm />, { wrapper });
    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Password"), "Password1");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/game");
    });
  });
});

// ─── SignUpForm — component + user interactions ───────────────────────────────

describe("SignUpForm", () => {
  it("renders all form fields", () => {
    render(<SignUpForm />, { wrapper });
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("has a submit button", () => {
    render(<SignUpForm />, { wrapper });
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  it("has a link to sign-in page", () => {
    render(<SignUpForm />, { wrapper });
    expect(screen.getByText("Sign In").closest("a")).toHaveAttribute(
      "href",
      "/sign-in",
    );
  });

  it("accepts typed username — user interaction", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />, { wrapper });
    await user.type(screen.getByLabelText("Username"), "alice");
    expect(screen.getByLabelText("Username")).toHaveValue("alice");
  });

  it("shows validation error for short username — user interaction", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />, { wrapper });
    await user.type(screen.getByLabelText("Username"), "ab");
    await user.click(screen.getByRole("button", { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
    });
  });
});

// ─── AvatarUpload — component + user interaction ─────────────────────────────

describe("AvatarUpload", () => {
  it("renders the upload label", () => {
    render(<AvatarUpload preview={null} onChange={vi.fn()} />);
    expect(screen.getByText("Upload avatar (optional)")).toBeInTheDocument();
  });

  it("renders custom label when provided", () => {
    render(
      <AvatarUpload preview={null} onChange={vi.fn()} label="Pick photo" />,
    );
    expect(screen.getByText("Pick photo")).toBeInTheDocument();
  });

  it("renders preview image when preview URL is provided", () => {
    render(<AvatarUpload preview="blob:test-url" onChange={vi.fn()} />);
    const img = screen.getByAltText("Avatar preview");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "blob:test-url");
  });

  it("renders without preview image when preview is null", () => {
    render(<AvatarUpload preview={null} onChange={vi.fn()} />);
    expect(screen.queryByAltText("Avatar preview")).not.toBeInTheDocument();
  });

  it("calls onChange with file and preview URL on file select — user interaction", async () => {
    const onChange = vi.fn();
    render(<AvatarUpload preview={null} onChange={onChange} />);

    const file = new File(["pixels"], "avatar.png", { type: "image/png" });
    const input = document.querySelector(
      "input[type='file']",
    ) as HTMLInputElement;

    Object.defineProperty(input, "files", { value: [file] });

    // Mock FileReader as a proper constructor function
    const MockFileReader = vi.fn(function (this: {
      onloadend: (() => void) | null;
      result: string;
      readAsDataURL: (f: File) => void;
    }) {
      this.onloadend = null;
      this.result = "data:image/png;base64,abc";
      this.readAsDataURL = vi.fn(() => {
        this.onloadend?.();
      });
    });
    vi.stubGlobal("FileReader", MockFileReader);

    input.dispatchEvent(new Event("change", { bubbles: true }));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(file, "data:image/png;base64,abc");
    });

    vi.unstubAllGlobals();
  });
});
