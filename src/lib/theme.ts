import { useEffect, useState, useCallback } from "react";

export type ThemeId = "soft-neutral" | "botanical" | "dark-minimal" | "classic-pro";

export const THEMES: { id: ThemeId; label: string; description: string }[] = [
  { id: "soft-neutral", label: "Soft Neutral", description: "Beige · Blush · Cream" },
  { id: "botanical", label: "Botanical Fresh", description: "Sage · Soft Green · Cream" },
  { id: "dark-minimal", label: "Dark Minimal", description: "Black · Charcoal · Silver" },
  { id: "classic-pro", label: "Classic Pro", description: "Navy · Brown · Muted Gold" },
];

const STORAGE_KEY = "aision-theme";

export function applyTheme(theme: ThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>("soft-neutral");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
      if (stored) {
        setThemeState(stored);
        document.documentElement.setAttribute("data-theme", stored);
      } else {
        document.documentElement.setAttribute("data-theme", "soft-neutral");
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);
    applyTheme(next);
  }, []);

  return { theme, setTheme };
}
