export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export type ThemePreference = Theme | "system";

export const themeConfig = {
  themes: THEMES,
  defaultPreference: "system" as ThemePreference,
  fallbackTheme: "light" as Theme,
  storageKey: "freshcart:theme",
  attribute: "data-theme",
  darkQuery: "(prefers-color-scheme: dark)",
} as const;

export const isTheme = (value: unknown): value is Theme =>
  THEMES.includes(value as Theme);
export const isPreference = (value: unknown): value is ThemePreference =>
  value === "system" || isTheme(value);
