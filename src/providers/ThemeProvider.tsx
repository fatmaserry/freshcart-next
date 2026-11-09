"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Theme, ThemePreference } from "@/lib/theme/config";
import { themeManager } from "@/lib/theme/ThemeManager";

interface ThemeContextValue {
  preference: ThemePreference | null;
  theme: Theme | null;
  setPreference: (preference: ThemePreference) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference | null>(
    null,
  );
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreferenceState(themeManager.getPreference());
    return themeManager.onExternalChange(setPreferenceState);
  }, []);

  useEffect(() => {
    if (!preference) return;
    const paint = () => {
      const resolved = themeManager.resolve(preference);
      themeManager.apply(resolved);
      setTheme(resolved);
    };
    paint();
    return preference === "system"
      ? themeManager.onSystemChange(paint)
      : undefined;
  }, [preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    themeManager.savePreference(next);
    setPreferenceState(next);
  }, []);

  const toggle = useCallback(
    () => setPreference(theme === "dark" ? "light" : "dark"),
    [theme, setPreference],
  );

  const value = useMemo(
    () => ({ preference, theme, setPreference, toggle }),
    [preference, theme, setPreference, toggle],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
