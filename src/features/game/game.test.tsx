import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/shared/stores/auth-store";

import CreateGroupDialog from "./components/create-group-dialog";
// ─── GameWelcome ──────────────────────────────────────────────────────────────

import GameWelcome from "./components/game-welcome";
import GroupCard from "./components/group-card";
import GroupListEmpty from "./components/group-list-empty";
// ─── GroupListLoading ─────────────────────────────────────────────────────────

import GroupListLoading from "./components/group-list-loading";
import JoinGroupDialog from "./components/join-group-dialog";
import StatsRow from "./components/stats-row";
import GamePage from "./game-page";

// ─── Mocks & helpers ──────────────────────────────────────────────────────────

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

const testUser = {
  id: "u1",
  username: "alice",
  email: "a@b.com",
  avatarUrl: null,
  xp: 150,
  level: 15,
  rank: "SILVER",
};

const testGroup = {
  id: "g1",
  name: "Weekend Crew",
  code: "ABC123",
  myRole: "OWNER",
  members: [
    { user: { id: "u1", username: "alice", avatarUrl: null } },
    { user: { id: "u2", username: "bob", avatarUrl: null } },
  ],
};

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

// ─── StatsRow — comprehensive component test ──────────────────────────────────

describe("StatsRow", () => {
  it("displays the user XP", () => {
    render(<StatsRow user={testUser} groupCount={3} />, { wrapper });
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("displays the user level", () => {
    render(<StatsRow user={testUser} groupCount={3} />, { wrapper });
    expect(screen.getByText("Level 15")).toBeInTheDocument();
  });

  it("displays the user rank", () => {
    render(<StatsRow user={testUser} groupCount={3} />, { wrapper });
    expect(screen.getByText("SILVER")).toBeInTheDocument();
  });

  it("displays the group count", () => {
    render(<StatsRow user={testUser} groupCount={3} />, { wrapper });
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("displays zero groups correctly", () => {
    render(<StatsRow user={testUser} groupCount={0} />, { wrapper });
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders all three stat cards", () => {
    render(<StatsRow user={testUser} groupCount={5} />, { wrapper });
    expect(screen.getByText("Total XP")).toBeInTheDocument();
    expect(screen.getByText("Groups")).toBeInTheDocument();
  });
});

// ─── GroupCard — component test with user interactions ───────────────────────

describe("GroupCard", () => {
  it("displays the group name", () => {
    render(<GroupCard group={testGroup} />, { wrapper });
    expect(screen.getByText("Weekend Crew")).toBeInTheDocument();
  });

  it("displays the member count", () => {
    render(<GroupCard group={testGroup} />, { wrapper });
    expect(screen.getByText("2 members")).toBeInTheDocument();
  });

  it("displays singular 'member' for one member", () => {
    const oneGroup = { ...testGroup, members: [testGroup.members[0]] };
    render(<GroupCard group={oneGroup} />, { wrapper });
    expect(screen.getByText("1 member")).toBeInTheDocument();
  });

  it("displays the group code", () => {
    render(<GroupCard group={testGroup} />, { wrapper });
    expect(screen.getByText("ABC123")).toBeInTheDocument();
  });

  it("shows avatar initials for members", () => {
    render(<GroupCard group={testGroup} />, { wrapper });
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("shows +N overflow badge when more than 4 members", () => {
    const bigGroup = {
      ...testGroup,
      members: Array.from({ length: 6 }, (_, i) => ({
        user: { id: `u${i}`, username: `user${i}`, avatarUrl: null },
      })),
    };
    render(<GroupCard group={bigGroup} />, { wrapper });
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("copies code when copy button is clicked — user interaction", async () => {
    const user = userEvent.setup();
    const mockClipboard = vi.fn();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockClipboard },
      writable: true,
      configurable: true,
    });

    render(<GroupCard group={testGroup} />, { wrapper });
    await user.click(screen.getByText("ABC123").closest("button")!);
    expect(mockClipboard).toHaveBeenCalledWith("ABC123");
  });

  it("shows 'Copied' after clicking copy — user interaction", async () => {
    const user = userEvent.setup();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn() },
      writable: true,
      configurable: true,
    });

    render(<GroupCard group={testGroup} />, { wrapper });
    await user.click(screen.getByText("ABC123").closest("button")!);
    expect(screen.getByText("Copied")).toBeInTheDocument();
    vi.useRealTimers();
  });
});

// ─── GamePage — smoke test ────────────────────────────────────────────────────

describe("GamePage", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: testUser,
      token: "tok",
      isAuthenticated: true,
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);
  });

  it("renders without crashing", () => {
    render(<GamePage />, { wrapper });
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
  });

  it("shows create and join group buttons", () => {
    render(<GamePage />, { wrapper });
    expect(
      screen.getByRole("button", { name: /create group/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /join group/i }),
    ).toBeInTheDocument();
  });
});

describe("GroupListLoading", () => {
  it("renders a loading indicator", () => {
    const { container } = render(<GroupListLoading />, { wrapper });
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shows loading text", () => {
    render(<GroupListLoading />, { wrapper });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});

describe("GroupListEmpty", () => {
  it("renders the empty state message", () => {
    render(<GroupListEmpty />, { wrapper });
    expect(screen.getByText(/no groups yet/i)).toBeInTheDocument();
  });

  it("prompts user to create or join", () => {
    render(<GroupListEmpty />, { wrapper });
    expect(screen.getByText(/create one or join/i)).toBeInTheDocument();
  });
});

describe("GameWelcome", () => {
  it("renders the username", () => {
    render(<GameWelcome username="alice" />, { wrapper });
    expect(screen.getByText(/alice/)).toBeInTheDocument();
  });

  it("renders the welcome heading", () => {
    render(<GameWelcome username="bob" />, { wrapper });
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  it("renders the subtitle text", () => {
    render(<GameWelcome username="alice" />, { wrapper });
    expect(screen.getByText(/ready to take on/i)).toBeInTheDocument();
  });
});

// ─── CreateGroupDialog ────────────────────────────────────────────────────────

describe("CreateGroupDialog", () => {
  it("renders the Create Group button", () => {
    render(<CreateGroupDialog />, { wrapper });
    expect(
      screen.getByRole("button", { name: /create group/i }),
    ).toBeInTheDocument();
  });

  it("opens dialog on button click — user interaction", async () => {
    const user = userEvent.setup();
    render(<CreateGroupDialog />, { wrapper });
    await user.click(screen.getByRole("button", { name: /create group/i }));
    await waitFor(() => {
      expect(screen.getByText("Create a new group")).toBeInTheDocument();
    });
  });

  it("shows group name input in the dialog", async () => {
    const user = userEvent.setup();
    render(<CreateGroupDialog />, { wrapper });
    await user.click(screen.getByRole("button", { name: /create group/i }));
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/brave squad/i)).toBeInTheDocument();
    });
  });
});

// ─── JoinGroupDialog ──────────────────────────────────────────────────────────

describe("JoinGroupDialog", () => {
  it("renders the Join Group button", () => {
    render(<JoinGroupDialog />, { wrapper });
    expect(
      screen.getByRole("button", { name: /join group/i }),
    ).toBeInTheDocument();
  });

  it("opens dialog on button click — user interaction", async () => {
    const user = userEvent.setup();
    render(<JoinGroupDialog />, { wrapper });
    await user.click(screen.getByRole("button", { name: /join group/i }));
    await waitFor(() => {
      expect(screen.getByText("Join a group")).toBeInTheDocument();
    });
  });
});
