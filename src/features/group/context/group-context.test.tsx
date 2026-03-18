import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { GroupDare } from "@/shared/services/group-api";

import { GroupProvider, useGroupContext } from "./group-context";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sampleDare: GroupDare = {
  id: "dare-1",
  title: "Do a backflip",
  description: "Film it!",
  difficulty: "HARD",
  xpReward: 50,
  status: "OPEN",
  createdAt: "2024-01-01",
  completedAt: null,
  author: { id: "u1", username: "alice", avatarUrl: null },
  assignedTo: null,
};

function GroupConsumer() {
  const ctx = useGroupContext();
  return (
    <div>
      <span data-testid="editOpen">{ctx.editOpen ? "open" : "closed"}</span>
      <span data-testid="editTitle">{ctx.editState?.title ?? "none"}</span>
      <span data-testid="deleteId">{ctx.deleteConfirmDareId ?? "none"}</span>
      <span data-testid="statusConfirm">
        {ctx.statusConfirm ? ctx.statusConfirm.status : "none"}
      </span>
      <button onClick={() => ctx.openEditDare(sampleDare)}>Open Edit</button>
      <button onClick={() => ctx.closeEditDare()}>Close Edit</button>
      <button onClick={() => ctx.setEditTitle("New title")}>Set Title</button>
      <button onClick={() => ctx.setEditDesc("New desc")}>Set Desc</button>
      <button onClick={() => ctx.setEditDifficulty("EASY")}>Set Diff</button>
      <button onClick={() => ctx.setEditXp(99)}>Set XP</button>
      <button
        onClick={() =>
          ctx.setStatusConfirm({ dareId: "d1", status: "COMPLETED" })
        }
      >
        Set Status
      </button>
      <button onClick={() => ctx.setStatusConfirm(null)}>Clear Status</button>
      <button onClick={() => ctx.setDeleteConfirmDareId("d2")}>
        Set Delete
      </button>
      <button onClick={() => ctx.setDeleteConfirmDareId(null)}>
        Clear Delete
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <GroupProvider>
      <GroupConsumer />
    </GroupProvider>,
  );
}

// ─── GroupProvider — initial state ────────────────────────────────────────────

describe("GroupProvider — initial state", () => {
  it("renders children", () => {
    render(
      <GroupProvider>
        <span>child</span>
      </GroupProvider>,
    );
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("editOpen starts as false", () => {
    renderWithProvider();
    expect(screen.getByTestId("editOpen").textContent).toBe("closed");
  });

  it("editState starts as null", () => {
    renderWithProvider();
    expect(screen.getByTestId("editTitle").textContent).toBe("none");
  });

  it("deleteConfirmDareId starts as null", () => {
    renderWithProvider();
    expect(screen.getByTestId("deleteId").textContent).toBe("none");
  });

  it("statusConfirm starts as null", () => {
    renderWithProvider();
    expect(screen.getByTestId("statusConfirm").textContent).toBe("none");
  });
});

// ─── openEditDare / closeEditDare ─────────────────────────────────────────────

describe("openEditDare and closeEditDare", () => {
  it("opens the edit drawer and populates editState", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Open Edit"));
    expect(screen.getByTestId("editOpen").textContent).toBe("open");
    expect(screen.getByTestId("editTitle").textContent).toBe("Do a backflip");
  });

  it("closeEditDare resets editOpen and editState", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Open Edit"));
    await user.click(screen.getByText("Close Edit"));
    expect(screen.getByTestId("editOpen").textContent).toBe("closed");
    expect(screen.getByTestId("editTitle").textContent).toBe("none");
  });
});

// ─── Edit field setters ───────────────────────────────────────────────────────

describe("edit field setters", () => {
  it("setEditTitle updates title immutably", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Open Edit"));
    await user.click(screen.getByText("Set Title"));
    expect(screen.getByTestId("editTitle").textContent).toBe("New title");
  });

  it("setEditTitle does nothing when editState is null", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    // don't open edit — editState is null
    await user.click(screen.getByText("Set Title"));
    expect(screen.getByTestId("editTitle").textContent).toBe("none");
  });
});

// ─── statusConfirm ────────────────────────────────────────────────────────────

describe("statusConfirm", () => {
  it("sets a status confirmation", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Set Status"));
    expect(screen.getByTestId("statusConfirm").textContent).toBe("COMPLETED");
  });

  it("clears status confirmation", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Set Status"));
    await user.click(screen.getByText("Clear Status"));
    expect(screen.getByTestId("statusConfirm").textContent).toBe("none");
  });
});

// ─── deleteConfirmDareId ─────────────────────────────────────────────────────

describe("deleteConfirmDareId", () => {
  it("sets the dare id for deletion confirmation", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Set Delete"));
    expect(screen.getByTestId("deleteId").textContent).toBe("d2");
  });

  it("clears the delete confirmation dare id", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Set Delete"));
    await user.click(screen.getByText("Clear Delete"));
    expect(screen.getByTestId("deleteId").textContent).toBe("none");
  });
});

// ─── useGroupContext outside provider ────────────────────────────────────────

describe("useGroupContext outside provider", () => {
  it("throws when used without GroupProvider", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    function BadConsumer() {
      useGroupContext();
      return null;
    }

    expect(() => render(<BadConsumer />)).toThrow(
      /useGroupContext must be used within a GroupProvider/,
    );

    consoleError.mockRestore();
  });
});
