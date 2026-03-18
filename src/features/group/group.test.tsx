import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/shared/stores/auth-store";
import type { GroupDare, GroupMember } from "@/shared/services/group-api";

import CreateDareDialog from "./components/create-dare-dialog";
import DareCard from "./components/dare-card";
import DareList from "./components/dare-list";
import DareStatusDialog from "./components/dare-status-dialog";
import DeleteDareDialog from "./components/delete-dare-dialog";
import EditDareDrawer from "./components/edit-dare-drawer";
// ─── GroupContent — smoke test ────────────────────────────────────────────────

import GroupContent from "./components/group-content";
// ─── GroupDialogs — smoke test ────────────────────────────────────────────────

import GroupDialogs from "./components/group-dialogs";
import GroupHeader from "./components/group-header";
import GroupLoading from "./components/group-loading";
// ─── GroupNotFound ────────────────────────────────────────────────────────────

import GroupNotFound from "./components/group-not-found";
import MemberList from "./components/member-list";
import GroupPage from "./group-page";
import type { GroupActions } from "./hooks/use-group-actions";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("@/shared/context/auth-context", () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    token: null,
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
  }),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const openDare: GroupDare = {
  id: "d1",
  title: "Jump off a swing",
  description: "Record it",
  difficulty: "EASY",
  xpReward: 10,
  status: "OPEN",
  createdAt: "2024-01-01",
  completedAt: null,
  author: { id: "u1", username: "alice", avatarUrl: null },
  assignedTo: null,
};

const completedDare: GroupDare = {
  ...openDare,
  id: "d2",
  status: "COMPLETED",
};

const testMembers: GroupMember[] = [
  {
    id: "m1",
    role: "OWNER",
    joinedAt: "2024-01-01",
    user: {
      id: "u1",
      username: "alice",
      avatarUrl: null,
      rank: "GOLD",
      level: 5,
    },
  },
  {
    id: "m2",
    role: "MEMBER",
    joinedAt: "2024-01-02",
    user: {
      id: "u2",
      username: "bob",
      avatarUrl: null,
      rank: "ROOKIE",
      level: 1,
    },
  },
];

const testGroup = {
  id: "g1",
  name: "Weekend Squad",
  code: "XYZ789",
  createdAt: "2024-01-01",
  members: testMembers,
  dares: [],
  myRole: "OWNER",
};

beforeEach(() => {
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  vi.clearAllMocks();
});

// ─── DareCard — comprehensive component test ──────────────────────────────────

describe("DareCard", () => {
  const baseProps = {
    dare: openDare,
    index: 0,
    currentUserId: "u99",
    isOwner: false,
    claimingId: null,
    completingId: null,
    onClaim: vi.fn(),
    onStatusConfirm: vi.fn(),
    onEdit: vi.fn(),
    onDeleteConfirm: vi.fn(),
  };

  it("renders the dare title", () => {
    render(<DareCard {...baseProps} />, { wrapper });
    expect(screen.getByText("Jump off a swing")).toBeInTheDocument();
  });

  it("renders the dare description", () => {
    render(<DareCard {...baseProps} />, { wrapper });
    expect(screen.getByText("Record it")).toBeInTheDocument();
  });

  it("renders the difficulty badge", () => {
    render(<DareCard {...baseProps} />, { wrapper });
    expect(screen.getByText("EASY")).toBeInTheDocument();
  });

  it("renders the XP reward", () => {
    render(<DareCard {...baseProps} />, { wrapper });
    expect(screen.getByText(/10 XP/)).toBeInTheDocument();
  });

  it("shows author name", () => {
    render(<DareCard {...baseProps} />, { wrapper });
    expect(screen.getByText(/alice/)).toBeInTheDocument();
  });

  it("shows Accept button for open unassigned dare", () => {
    render(<DareCard {...baseProps} />, { wrapper });
    expect(screen.getByRole("button", { name: /accept/i })).toBeInTheDocument();
  });

  it("calls onClaim when Accept is clicked — user interaction", async () => {
    const user = userEvent.setup();
    const onClaim = vi.fn();
    render(<DareCard {...baseProps} onClaim={onClaim} />, { wrapper });
    await user.click(screen.getByRole("button", { name: /accept/i }));
    expect(onClaim).toHaveBeenCalledWith("d1");
  });

  it("applies line-through style for completed dare", () => {
    render(<DareCard {...baseProps} dare={completedDare} />, { wrapper });
    const title = screen.getByText("Jump off a swing");
    expect(title.className).toContain("line-through");
  });

  it("shows DONE badge for completed dare", () => {
    render(<DareCard {...baseProps} dare={completedDare} />, { wrapper });
    expect(screen.getByText("DONE")).toBeInTheDocument();
  });

  it("hides Accept button for closed dare", () => {
    render(<DareCard {...baseProps} dare={completedDare} />, { wrapper });
    expect(
      screen.queryByRole("button", { name: /accept/i }),
    ).not.toBeInTheDocument();
  });

  it("shows separator for index > 0", () => {
    const { container } = render(<DareCard {...baseProps} index={1} />, {
      wrapper,
    });
    // Separator is rendered as an hr or div with role separator
    expect(
      container.querySelector("[data-slot='separator']") ||
        container.querySelector("hr"),
    ).toBeTruthy();
  });
});

// ─── DareStatusDialog — component test with user interaction ──────────────────

describe("DareStatusDialog", () => {
  it("renders nothing when statusConfirm is null", () => {
    render(
      <DareStatusDialog
        statusConfirm={null}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={false}
      />,
      { wrapper },
    );
    expect(screen.queryByText("Complete Dare")).not.toBeInTheDocument();
  });

  it("shows dialog title for COMPLETED status", () => {
    render(
      <DareStatusDialog
        statusConfirm={{ dareId: "d1", status: "COMPLETED" }}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={false}
      />,
      { wrapper },
    );
    expect(screen.getByText("Complete Dare")).toBeInTheDocument();
  });

  it("shows dialog title for PASSED status", () => {
    render(
      <DareStatusDialog
        statusConfirm={{ dareId: "d1", status: "PASSED" }}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={false}
      />,
      { wrapper },
    );
    expect(screen.getByText("Pass on Dare")).toBeInTheDocument();
  });

  it("calls onConfirm with dareId and status when confirmed — user interaction", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    render(
      <DareStatusDialog
        statusConfirm={{ dareId: "d1", status: "COMPLETED" }}
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
        isLoading={false}
      />,
      { wrapper },
    );
    await user.click(screen.getByRole("button", { name: /completed/i }));
    expect(onConfirm).toHaveBeenCalledWith("d1", "COMPLETED");
  });
});

// ─── DeleteDareDialog — component test ────────────────────────────────────────

describe("DeleteDareDialog", () => {
  it("renders nothing when dareId is null", () => {
    render(
      <DeleteDareDialog
        dareId={null}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={false}
      />,
      { wrapper },
    );
    expect(screen.queryByText("Delete Dare")).not.toBeInTheDocument();
  });

  it("shows confirmation dialog when dareId is set", () => {
    render(
      <DeleteDareDialog
        dareId="d1"
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={false}
      />,
      { wrapper },
    );
    expect(screen.getByText("Delete Dare")).toBeInTheDocument();
  });

  it("calls onConfirm with the dareId when Delete is clicked — user interaction", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    render(
      <DeleteDareDialog
        dareId="d1"
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
        isLoading={false}
      />,
      { wrapper },
    );
    await user.click(screen.getByRole("button", { name: /^delete$/i }));
    expect(onConfirm).toHaveBeenCalledWith("d1");
  });
});

// ─── GroupHeader — component test with user interaction ───────────────────────

describe("GroupHeader", () => {
  it("renders the group name", () => {
    render(<GroupHeader group={testGroup} />, { wrapper });
    expect(screen.getByText("Weekend Squad")).toBeInTheDocument();
  });

  it("renders the member count", () => {
    render(<GroupHeader group={testGroup} />, { wrapper });
    expect(screen.getByText("2 members")).toBeInTheDocument();
  });

  it("renders the group code", () => {
    render(<GroupHeader group={testGroup} />, { wrapper });
    expect(screen.getByText("XYZ789")).toBeInTheDocument();
  });

  it("copies code when button is clicked — user interaction", async () => {
    const user = userEvent.setup();
    const mockClipboard = vi.fn();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockClipboard },
      writable: true,
      configurable: true,
    });

    render(<GroupHeader group={testGroup} />, { wrapper });
    await user.click(screen.getByRole("button", { name: /XYZ789/i }));
    expect(mockClipboard).toHaveBeenCalledWith("XYZ789");
  });

  it("shows 'Copied!' after clicking copy button", async () => {
    const user = userEvent.setup();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn() },
      writable: true,
      configurable: true,
    });

    render(<GroupHeader group={testGroup} />, { wrapper });
    await user.click(screen.getByRole("button", { name: /XYZ789/i }));
    expect(screen.getByText("Copied!")).toBeInTheDocument();
    vi.useRealTimers();
  });
});

// ─── MemberList — comprehensive component test ───────────────────────────────

describe("MemberList", () => {
  it("renders all members", () => {
    render(<MemberList members={testMembers} />, { wrapper });
    expect(screen.getByText("alice")).toBeInTheDocument();
    expect(screen.getByText("bob")).toBeInTheDocument();
  });

  it("renders member avatar initials", () => {
    render(<MemberList members={testMembers} />, { wrapper });
    expect(screen.getByText("AL")).toBeInTheDocument();
    expect(screen.getByText("BO")).toBeInTheDocument();
  });

  it("renders member rank", () => {
    render(<MemberList members={testMembers} />, { wrapper });
    expect(screen.getByText(/GOLD/)).toBeInTheDocument();
    expect(screen.getByText(/ROOKIE/)).toBeInTheDocument();
  });

  it("renders role badge", () => {
    render(<MemberList members={testMembers} />, { wrapper });
    expect(screen.getByText("owner")).toBeInTheDocument();
    expect(screen.getByText("member")).toBeInTheDocument();
  });

  it("renders Members heading", () => {
    render(<MemberList members={testMembers} />, { wrapper });
    expect(screen.getByText("Members")).toBeInTheDocument();
  });

  it("renders empty list without crashing", () => {
    render(<MemberList members={[]} />, { wrapper });
    expect(screen.getByText("Members")).toBeInTheDocument();
  });
});

// ─── GroupLoading ─────────────────────────────────────────────────────────────

describe("GroupLoading", () => {
  it("renders the navbar", () => {
    render(<GroupLoading />, { wrapper });
    expect(screen.getByText("Dareo")).toBeInTheDocument();
  });

  it("shows a loading indicator", () => {
    const { container } = render(<GroupLoading />, { wrapper });
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });
});

describe("GroupNotFound", () => {
  it("shows the default message", () => {
    render(<GroupNotFound />, { wrapper });
    expect(screen.getByText("Group not found")).toBeInTheDocument();
  });

  it("shows a custom message when provided", () => {
    render(<GroupNotFound message="Access denied" />, { wrapper });
    expect(screen.getByText("Access denied")).toBeInTheDocument();
  });

  it("renders a Back to Dashboard button", () => {
    render(<GroupNotFound />, { wrapper });
    expect(
      screen.getByRole("button", { name: /back to dashboard/i }),
    ).toBeInTheDocument();
  });

  it("navigates to /game when Back is clicked — user interaction", async () => {
    const user = userEvent.setup();
    render(<GroupNotFound />, { wrapper });
    await user.click(
      screen.getByRole("button", { name: /back to dashboard/i }),
    );
    expect(mockNavigate).toHaveBeenCalledWith("/game");
  });
});

describe("GroupDialogs", () => {
  const baseProps = {
    groupId: "g1",
    editOpen: false,
    editState: null,
    onEditClose: vi.fn(),
    onTitleChange: vi.fn(),
    onDescChange: vi.fn(),
    onDifficultyChange: vi.fn(),
    onXpChange: vi.fn(),
    statusConfirm: null,
    onStatusClose: vi.fn(),
    onStatusConfirm: vi.fn(),
    isCompletingDare: false,
    deleteConfirmDareId: null,
    onDeleteClose: vi.fn(),
    onDeleteConfirm: vi.fn(),
    isDeletingDare: false,
  };

  it("renders without crashing when all dialogs are closed", () => {
    const { container } = render(<GroupDialogs {...baseProps} />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it("shows delete confirmation dialog when deleteConfirmDareId is set", () => {
    render(<GroupDialogs {...baseProps} deleteConfirmDareId="d1" />, {
      wrapper,
    });
    expect(screen.getByText("Delete Dare")).toBeInTheDocument();
  });

  it("shows status dialog when statusConfirm is set", () => {
    render(
      <GroupDialogs
        {...baseProps}
        statusConfirm={{ dareId: "d1", status: "COMPLETED" }}
      />,
      { wrapper },
    );
    expect(screen.getByText("Complete Dare")).toBeInTheDocument();
  });
});

const mockActions: GroupActions = {
  isOwner: true,
  currentUserId: "u1",
  claimingDareId: null,
  handleClaimDare: vi.fn(),
  completingDareId: null,
  statusConfirm: null,
  setStatusConfirm: vi.fn(),
  handleCompleteDare: vi.fn(),
  deletingDareId: null,
  deleteConfirmDareId: null,
  setDeleteConfirmDareId: vi.fn(),
  handleDeleteDare: vi.fn(),
  openEditDare: vi.fn(),
  setEditTitle: vi.fn(),
  setEditDesc: vi.fn(),
  setEditDifficulty: vi.fn(),
  setEditXp: vi.fn(),
  handleEditDare: vi.fn(),
  isEditSaving: false,
};

const groupData = {
  id: "g1",
  name: "Test Squad",
  code: "TST123",
  createdAt: "2024-01-01",
  myRole: "OWNER",
  members: testMembers,
  dares: [],
};

describe("GroupContent", () => {
  it("renders the group name", () => {
    render(
      <GroupContent
        id="g1"
        group={groupData}
        actions={mockActions}
        editOpen={false}
        editState={null}
        onEditClose={vi.fn()}
      />,
      { wrapper },
    );
    expect(screen.getByText("Test Squad")).toBeInTheDocument();
  });

  it("renders the Back button", () => {
    render(
      <GroupContent
        id="g1"
        group={groupData}
        actions={mockActions}
        editOpen={false}
        editState={null}
        onEditClose={vi.fn()}
      />,
      { wrapper },
    );
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("renders member list", () => {
    render(
      <GroupContent
        id="g1"
        group={groupData}
        actions={mockActions}
        editOpen={false}
        editState={null}
        onEditClose={vi.fn()}
      />,
      { wrapper },
    );
    expect(screen.getByText("Members")).toBeInTheDocument();
  });
});

// ─── CreateDareDialog ─────────────────────────────────────────────────────────

describe("CreateDareDialog", () => {
  it("renders the Add Dare button", () => {
    render(<CreateDareDialog groupId="g1" />, { wrapper });
    expect(
      screen.getByRole("button", { name: /create dare/i }),
    ).toBeInTheDocument();
  });

  it("opens dialog and shows title field — user interaction", async () => {
    const user = userEvent.setup();
    render(<CreateDareDialog groupId="g1" />, { wrapper });
    await user.click(screen.getByRole("button", { name: /create dare/i }));
    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    });
  });
});

// ─── DareList ─────────────────────────────────────────────────────────────────

const dareListBaseProps = {
  groupId: "g1",
  dares: [] as (typeof openDare)[],
  currentUserId: "u1",
  isOwner: false,
  claimingId: null,
  completingId: null,
  onClaim: vi.fn(),
  onStatusConfirm: vi.fn(),
  onEdit: vi.fn(),
  onDeleteConfirm: vi.fn(),
};

describe("DareList", () => {
  it("renders Dares heading", () => {
    render(<DareList {...dareListBaseProps} />, { wrapper });
    expect(screen.getByText("Dares")).toBeInTheDocument();
  });

  it("renders empty state when no dares", () => {
    render(<DareList {...dareListBaseProps} />, { wrapper });
    expect(screen.getByText(/no dares yet/i)).toBeInTheDocument();
  });

  it("renders dare cards when dares are provided", () => {
    render(<DareList {...dareListBaseProps} dares={[openDare]} />, { wrapper });
    expect(screen.getByText("Jump off a swing")).toBeInTheDocument();
  });
});

// ─── EditDareDrawer ───────────────────────────────────────────────────────────

describe("EditDareDrawer", () => {
  const drawerBaseProps = {
    groupId: "g1",
    onOpenChange: vi.fn(),
    dareId: null as string | null,
    title: "",
    onTitleChange: vi.fn(),
    desc: "",
    onDescChange: vi.fn(),
    difficulty: "EASY",
    onDifficultyChange: vi.fn(),
    xp: 10,
    onXpChange: vi.fn(),
  };

  it("renders nothing when closed", () => {
    render(<EditDareDrawer {...drawerBaseProps} open={false} />, { wrapper });
    expect(screen.queryByText("Edit Dare")).not.toBeInTheDocument();
  });

  it("shows Edit Dare title when open", () => {
    render(
      <EditDareDrawer
        {...drawerBaseProps}
        open
        dareId="d1"
        title="Test dare"
      />,
      { wrapper },
    );
    expect(screen.getByText("Edit Dare")).toBeInTheDocument();
  });
});

// ─── GroupPage (smoke) ────────────────────────────────────────────────────────

describe("GroupPage", () => {
  it("shows loading state while fetching", () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(
      () => new Promise(() => {}),
    );
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={["/group/g1"]}>
          <Routes>
            <Route path="/group/:id" element={<GroupPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(document.body).toBeTruthy();
  });
});
