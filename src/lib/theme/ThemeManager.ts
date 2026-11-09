import {
  isPreference,
  themeConfig,
  type Theme,
  type ThemePreference,
} from "./config";

export class ThemeManager {
  constructor(private readonly config = themeConfig) {}

  getPreference(): ThemePreference {
    try {
      const saved = localStorage.getItem(this.config.storageKey);
      return isPreference(saved) ? saved : this.config.defaultPreference;
    } catch {
      return this.config.defaultPreference;
    }
  }

  savePreference(preference: ThemePreference) {
    try {
      localStorage.setItem(this.config.storageKey, preference);
    } catch {
      // The choice just won't persist.
    }
  }

  getSystemTheme(): Theme {
    return window.matchMedia(this.config.darkQuery).matches ? "dark" : "light";
  }

  resolve(preference: ThemePreference): Theme {
    return preference === "system" ? this.getSystemTheme() : preference;
  }

  apply(theme: Theme) {
    document.documentElement.setAttribute(this.config.attribute, theme);
  }

  onSystemChange(listener: () => void) {
    const media = window.matchMedia(this.config.darkQuery);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }

  onExternalChange(listener: (preference: ThemePreference) => void) {
    const handler = (e: StorageEvent) => {
      if (e.key === this.config.storageKey && isPreference(e.newValue))
        listener(e.newValue);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }
}

export const themeManager = new ThemeManager();
