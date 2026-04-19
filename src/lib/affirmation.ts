import { useEffect, useState, useCallback } from "react";

export type AffirmationStyle = "reflective" | "action";

const STYLE_KEY = "aision-affirmation-style";

// Themes that default to reflective (female) vs action (male)
const REFLECTIVE_DEFAULT_THEMES = new Set(["soft-neutral", "botanical"]);

export function defaultStyleForTheme(theme: string): AffirmationStyle {
  return REFLECTIVE_DEFAULT_THEMES.has(theme) ? "reflective" : "action";
}

export function useAffirmationStyle(activeTheme: string) {
  const [style, setStyleState] = useState<AffirmationStyle>(defaultStyleForTheme(activeTheme));
  const [userOverride, setUserOverride] = useState(false);

  // Hydrate stored override
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STYLE_KEY);
      if (stored === "reflective" || stored === "action") {
        setStyleState(stored);
        setUserOverride(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // When the theme changes and the user hasn't overridden, follow the theme default
  useEffect(() => {
    if (!userOverride) {
      setStyleState(defaultStyleForTheme(activeTheme));
    }
  }, [activeTheme, userOverride]);

  const setStyle = useCallback((next: AffirmationStyle) => {
    setStyleState(next);
    setUserOverride(true);
    try {
      localStorage.setItem(STYLE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const resetToThemeDefault = useCallback(() => {
    setUserOverride(false);
    try {
      localStorage.removeItem(STYLE_KEY);
    } catch {
      /* ignore */
    }
    setStyleState(defaultStyleForTheme(activeTheme));
  }, [activeTheme]);

  return { style, setStyle, resetToThemeDefault, isOverridden: userOverride };
}
