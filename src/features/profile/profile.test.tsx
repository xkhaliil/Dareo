import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore, type AuthUser } from "@/shared/stores/auth-store";

import AccountDetails from "./components/account-details";
import ProfileHeader from "./components/profile-header";
import ProfileStats from "./components/profile-stats";
import { useProfileEdit } from "./hooks/use-profile-edit";
import { useProfileSave } from "./hooks/use-profile-save";
import ProfilePage from "./profile-page";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("@/shared/lib/uploadthing", () => ({
  useUploadThing: () => ({ startUpload: vi.fn(), isUploading: false }),
}));
vi.mock("@/lib/uploadthing", () => ({
  useUploadThing: () => ({ startUpload: vi.fn(), isUploading: false }),
}));

const testUser: AuthUser = {
  id: "u1",
  username: "alice",
  email: "alice@example.com",
  avatarUrl: null,
  xp: 250,
  level: 25,
  rank: "GOLD",
};

vi.mock("@/shared/context/auth-context", () => ({
  useAuth: () => ({
    user: testUser,
    isAuthenticated: true,
    token: "tok",
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
  }),
}));

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

function hookWrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

// ─── ProfileStats — comprehensive component test ──────────────────────────────

describe("ProfileStats", () => {
  it("displays the user XP", () => {
    render(<ProfileStats user={testUser} />, { wrapper });
    expect(screen.getByText("250")).toBeInTheDocument();
  });

  it("shows Total XP label", () => {
    render(<ProfileStats user={testUser} />, { wrapper });
    expect(screen.getByText("Total XP")).toBeInTheDocument();
  });

  it("displays the user level", () => {
    render(<ProfileStats user={testUser} />, { wrapper });
    expect(screen.getByText("Level 25")).toBeInTheDocument();
  });

  it("displays the user rank", () => {
    render(<ProfileStats user={testUser} />, { wrapper });
    expect(screen.getByText("GOLD")).toBeInTheDocument();
  });

  it("renders zero XP correctly", () => {
    render(<ProfileStats user={{ ...testUser, xp: 0 }} />, { wrapper });
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

// ─── AccountDetails — comprehensive component test with user interactions ─────

describe("AccountDetails", () => {
  const baseProps = {
    user: testUser,
    editing: false,
    username: "alice",
    onUsernameChange: vi.fn(),
    email: "alice@example.com",
    onEmailChange: vi.fn(),
    error: null,
    isSaving: false,
    onSave: vi.fn(),
    onCancel: vi.fn(),
  };

  it("shows username in read mode", () => {
    render(<AccountDetails {...baseProps} />, { wrapper });
    expect(screen.getAllByText("alice").length).toBeGreaterThan(0);
  });

  it("shows email in read mode", () => {
    render(<AccountDetails {...baseProps} />, { wrapper });
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });

  it("shows editable inputs in edit mode", () => {
    render(<AccountDetails {...baseProps} editing />, { wrapper });
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows Save Changes button in edit mode", () => {
    render(<AccountDetails {...baseProps} editing />, { wrapper });
    expect(
      screen.getByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
  });

  it("calls onSave when Save Changes is clicked — user interaction", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<AccountDetails {...baseProps} editing onSave={onSave} />, {
      wrapper,
    });
    await user.click(screen.getByRole("button", { name: /save changes/i }));
    expect(onSave).toHaveBeenCalledOnce();
  });

  it("calls onCancel when Cancel is clicked — user interaction", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<AccountDetails {...baseProps} editing onCancel={onCancel} />, {
      wrapper,
    });
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("calls onUsernameChange when typing in username input — user interaction", async () => {
    const user = userEvent.setup();
    const onUsernameChange = vi.fn();
    render(
      <AccountDetails
        {...baseProps}
        editing
        onUsernameChange={onUsernameChange}
      />,
      { wrapper },
    );
    await user.clear(screen.getByLabelText("Username"));
    await user.type(screen.getByLabelText("Username"), "bob");
    expect(onUsernameChange).toHaveBeenCalled();
  });

  it("displays error message when error is set", () => {
    render(<AccountDetails {...baseProps} error="Something went wrong" />, {
      wrapper,
    });
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("disables Save button while saving", () => {
    render(<AccountDetails {...baseProps} editing isSaving />, { wrapper });
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });
});

// ─── useProfileEdit — comprehensive non-component hook test ───────────────────

describe("useProfileEdit", () => {
  function makeWrapper() {
    const qc = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    );
  }

  beforeEach(() => {
    useAuthStore.setState({
      user: testUser,
      token: "tok",
      isAuthenticated: true,
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => testUser,
    } as Response);
  });

  it("starts with editing false", () => {
    const { result } = renderHook(() => useProfileEdit(testUser), {
      wrapper: makeWrapper(),
    });
    expect(result.current.editing).toBe(false);
  });

  it("startEditing sets editing to true and populates fields", () => {
    const { result } = renderHook(() => useProfileEdit(testUser), {
      wrapper: makeWrapper(),
    });
    act(() => result.current.startEditing());
    expect(result.current.editing).toBe(true);
    expect(result.current.username).toBe("alice");
    expect(result.current.email).toBe("alice@example.com");
  });

  it("cancelEditing resets editing to false", () => {
    const { result } = renderHook(() => useProfileEdit(testUser), {
      wrapper: makeWrapper(),
    });
    act(() => result.current.startEditing());
    act(() => result.current.cancelEditing());
    expect(result.current.editing).toBe(false);
  });

  it("onUsernameChange updates username state", () => {
    const { result } = renderHook(() => useProfileEdit(testUser), {
      wrapper: makeWrapper(),
    });
    act(() => result.current.startEditing());
    act(() => result.current.onUsernameChange("bob"));
    expect(result.current.username).toBe("bob");
  });

  it("handleAvatarChange updates avatarPreview", () => {
    const { result } = renderHook(() => useProfileEdit(testUser), {
      wrapper: makeWrapper(),
    });
    const file = new File([""], "avatar.png", { type: "image/png" });
    act(() => result.current.handleAvatarChange(file, "blob:preview"));
    expect(result.current.avatarPreview).toBe("blob:preview");
  });

  it("error starts as null", () => {
    const { result } = renderHook(() => useProfileEdit(testUser), {
      wrapper: makeWrapper(),
    });
    expect(result.current.error).toBeNull();
  });
});

// ─── ProfilePage — smoke test ─────────────────────────────────────────────────

describe("ProfilePage", () => {
  it("renders without crashing", () => {
    render(<ProfilePage />, { wrapper });
    expect(screen.getAllByText("alice").length).toBeGreaterThan(0);
  });

  it("renders XP and level", () => {
    render(<ProfilePage />, { wrapper });
    expect(screen.getByText("250")).toBeInTheDocument();
    expect(screen.getByText("Level 25")).toBeInTheDocument();
  });
});

// ─── ProfileHeader — comprehensive component test ─────────────────────────────

describe("ProfileHeader", () => {
  const baseProps = {
    user: testUser,
    editing: false,
    avatarPreview: null,
    onAvatarChange: vi.fn(),
    onStartEditing: vi.fn(),
  };

  it("displays username", () => {
    render(<ProfileHeader {...baseProps} />, { wrapper });
    expect(screen.getAllByText("alice").length).toBeGreaterThan(0);
  });

  it("displays email", () => {
    render(<ProfileHeader {...baseProps} />, { wrapper });
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });

  it("displays user rank badge", () => {
    render(<ProfileHeader {...baseProps} />, { wrapper });
    expect(screen.getByText("GOLD")).toBeInTheDocument();
  });

  it("shows Edit Profile button when not editing", () => {
    render(<ProfileHeader {...baseProps} />, { wrapper });
    expect(
      screen.getByRole("button", { name: /edit profile/i }),
    ).toBeInTheDocument();
  });

  it("calls onStartEditing when Edit Profile is clicked — user interaction", async () => {
    const user = userEvent.setup();
    const onStartEditing = vi.fn();
    render(<ProfileHeader {...baseProps} onStartEditing={onStartEditing} />, {
      wrapper,
    });
    await user.click(screen.getByRole("button", { name: /edit profile/i }));
    expect(onStartEditing).toHaveBeenCalledOnce();
  });

  it("shows avatar initials fallback when no avatar", () => {
    render(<ProfileHeader {...baseProps} />, { wrapper });
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("hides Edit Profile button when editing", () => {
    render(<ProfileHeader {...baseProps} editing />, { wrapper });
    expect(
      screen.queryByRole("button", { name: /edit profile/i }),
    ).not.toBeInTheDocument();
  });
});

// ─── useProfileSave — comprehensive non-component hook test ───────────────────

describe("useProfileSave", () => {
  it("starts with no error", () => {
    const { result } = renderHook(
      () =>
        useProfileSave({
          user: testUser,
          username: "alice",
          email: "alice@example.com",
          avatarFile: null,
          onSuccess: vi.fn(),
        }),
      { wrapper: hookWrapper },
    );
    expect(result.current.error).toBeNull();
  });

  it("isSaving starts as false", () => {
    const { result } = renderHook(
      () =>
        useProfileSave({
          user: testUser,
          username: "alice",
          email: "alice@example.com",
          avatarFile: null,
          onSuccess: vi.fn(),
        }),
      { wrapper: hookWrapper },
    );
    expect(result.current.isSaving).toBe(false);
  });

  it("calls onSuccess when no fields changed", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(
      () =>
        useProfileSave({
          user: testUser,
          username: testUser.username,
          email: testUser.email,
          avatarFile: null,
          onSuccess,
        }),
      { wrapper: hookWrapper },
    );
    await act(async () => {
      await result.current.save();
    });
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it("calls API and onSuccess when username changes", async () => {
    const onSuccess = vi.fn();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...testUser, username: "bob" }),
    } as Response);
    const { result } = renderHook(
      () =>
        useProfileSave({
          user: testUser,
          username: "bob",
          email: testUser.email,
          avatarFile: null,
          onSuccess,
        }),
      { wrapper: hookWrapper },
    );
    await act(async () => {
      await result.current.save();
    });
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it("sets error on API failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 422,
      json: async () => ({ error: "Username taken" }),
    } as Response);
    const { result } = renderHook(
      () =>
        useProfileSave({
          user: testUser,
          username: "taken",
          email: testUser.email,
          avatarFile: null,
          onSuccess: vi.fn(),
        }),
      { wrapper: hookWrapper },
    );
    await act(async () => {
      await result.current.save();
    });
    expect(result.current.error).toBe("Username taken");
  });

  it("setError allows manually clearing the error", () => {
    const { result } = renderHook(
      () =>
        useProfileSave({
          user: testUser,
          username: "alice",
          email: testUser.email,
          avatarFile: null,
          onSuccess: vi.fn(),
        }),
      { wrapper: hookWrapper },
    );
    act(() => result.current.setError("Some error"));
    expect(result.current.error).toBe("Some error");
    act(() => result.current.setError(null));
    expect(result.current.error).toBeNull();
  });
});
