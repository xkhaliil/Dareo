import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeProvider, useTheme } from "./theme-context";

// ─── Helper consumer ─────────────────────────────────────────────────────────

function ThemeConsumer() {
  const { theme, toggleTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
      <button onClick={() => setTheme("light")}>Set Light</button>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <ThemeProvider>
      <ThemeConsumer />
    </ThemeProvider>,
  );
}

// ─── ThemeProvider ────────────────────────────────────────────────────────────

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark", "light");
  });

  it("renders children", () => {
    render(
      <ThemeProvider>
        <span>child</span>
      </ThemeProvider>,
    );
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("defaults to dark theme when nothing is stored", () => {
    renderWithProvider();
    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });

  it("applies the theme class to <html>", () => {
    renderWithProvider();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("persists the theme to localStorage", () => {
    renderWithProvider();
    expect(localStorage.getItem("dareo-theme")).toBe("dark");
  });

  it("restores a previously stored theme (light)", () => {
    localStorage.setItem("dareo-theme", "light");
    renderWithProvider();
    expect(screen.getByTestId("theme").textContent).toBe("light");
  });
});

// ─── useTheme — toggleTheme ───────────────────────────────────────────────────

describe("useTheme — toggleTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark", "light");
  });

  it("switches from dark to light on first toggle", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  it("switches back from light to dark on second toggle", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Toggle"));
    await user.click(screen.getByText("Toggle"));
    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });

  it("updates the html class on toggle", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Toggle"));
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});

// ─── useTheme — setTheme ──────────────────────────────────────────────────────

describe("useTheme — setTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark", "light");
  });

  it("sets theme to light", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Set Light"));
    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  it("sets theme to dark", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Set Light"));
    await user.click(screen.getByText("Set Dark"));
    expect(screen.getByTestId("theme").textContent).toBe("dark");
  });

  it("persists set theme to localStorage", async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByText("Set Light"));
    expect(localStorage.getItem("dareo-theme")).toBe("light");
  });
});

// ─── useTheme outside provider ────────────────────────────────────────────────

describe("useTheme outside provider", () => {
  it("throws if used without ThemeProvider", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    function BadConsumer() {
      useTheme();
      return null;
    }

    expect(() => render(<BadConsumer />)).toThrow(
      /useTheme must be used inside <ThemeProvider>/,
    );

    consoleError.mockRestore();
  });
});
