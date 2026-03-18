import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ErrorBoundary } from "./error-boundary";
import PageBackground from "./page-background";
import PageFooter from "./page-footer";

// ─── ErrorBoundary — comprehensive component test ─────────────────────────────

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error("Test explosion");
  return <p>All good</p>;
}

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <p>Safe content</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText("Safe content")).toBeInTheDocument();
  });

  it("catches a render error and shows the fallback UI", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    consoleError.mockRestore();
  });

  it("displays the error message in the fallback", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Test explosion")).toBeInTheDocument();
    consoleError.mockRestore();
  });

  it("renders a custom fallback when provided", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<p>Custom fallback</p>}>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Custom fallback")).toBeInTheDocument();
    consoleError.mockRestore();
  });

  it("shows a Try Again button in the default fallback", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bomb shouldThrow />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole("button", { name: /try again/i }),
    ).toBeInTheDocument();
    consoleError.mockRestore();
  });

  it("resets the error state when Try Again is clicked — user interaction", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const user = userEvent.setup();

    // We need a controllable component to test reset
    let shouldThrow = true;
    function Controllable() {
      if (shouldThrow) throw new Error("controlled error");
      return <p>Recovered</p>;
    }

    const { rerender } = render(
      <ErrorBoundary>
        <Controllable />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Stop throwing, then click Try Again to reset boundary
    shouldThrow = false;
    await user.click(screen.getByRole("button", { name: /try again/i }));

    rerender(
      <ErrorBoundary>
        <Controllable />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Recovered")).toBeInTheDocument();
    consoleError.mockRestore();
  });
});

// ─── PageFooter — smoke test ─────────────────────────────────────────────────

describe("PageFooter", () => {
  it("renders without crashing", () => {
    render(<PageFooter />);
    expect(screen.getByText(/Dareo/)).toBeInTheDocument();
  });

  it("shows the copyright year", () => {
    render(<PageFooter />);
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });
});

// ─── PageBackground — smoke test ─────────────────────────────────────────────

describe("PageBackground", () => {
  it("renders without crashing", () => {
    const { container } = render(<PageBackground />);
    expect(container.firstChild).not.toBeNull();
  });
});
