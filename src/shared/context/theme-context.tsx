/* eslint-disable react-refresh/only-export-components */

/**
 * ThemeContext — root-level context that must live at the app root.
 *
 * Controls the colour scheme (dark / light) and persists the user's
 * preference to localStorage. Lives at the very top of the provider
 * hierarchy in main.tsx so that *every* page — including the landing
 * page before sign-in — can read and toggle the theme.
 *
 * This is deliberately a React Context (not Zustand) because it drives
 * a DOM side-effect (`document.documentElement.classList`) and needs to
 * run synchronously before the first paint to avoid flash-of-wrong-theme.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = "dareo-theme";
const DEFAULT_THEME: Theme = "dark";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // localStorage unavailable (SSR / private browsing)
  }
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);

  // Apply class to <html> and persist whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);

  const toggleTheme = useCallback(
    () => setThemeState((prev) => (prev === "dark" ? "light" : "dark")),
    [],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}
