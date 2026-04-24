import { useEffect, useState } from "react";

export function useLocalState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  // Re-hydrate whenever the key changes (e.g. switching dates)
  useEffect(() => {
    setHydrated(false);
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
      setValue(raw != null ? (JSON.parse(raw) as T) : initial);
    } catch {
      setValue(initial);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value, hydrated]);

  return [value, setValue];
}

/** Format a Date as YYYY-MM-DD (local time). */
export function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/** Parse a YYYY-MM-DD key into a local Date (noon to avoid TZ edge cases). */
export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0, 0);
}

const DAILY_FIELDS = [
  "priorities",
  "schedule",
  "tasks",
  "notes",
  "achieved",
  "mood",
  "water",
  "trackers",
] as const;

/** Returns true if any daily entry exists for this date key. */
export function hasDailyEntries(dateKey: string): boolean {
  if (typeof window === "undefined") return false;
  for (const field of DAILY_FIELDS) {
    const raw = localStorage.getItem(`aision:daily:${dateKey}:${field}`);
    if (raw == null) continue;
    try {
      const v = JSON.parse(raw);
      if (v == null) continue;
      if (typeof v === "string" && v.trim() === "") continue;
      if (typeof v === "number" && v < 0) continue;
      if (typeof v === "number" && v === 0 && field === "water") continue;
      if (Array.isArray(v)) {
        const meaningful = v.some((it) => {
          if (typeof it === "string") return it.trim() !== "";
          if (it && typeof it === "object") return Object.values(it).some(Boolean);
          return Boolean(it);
        });
        if (!meaningful) continue;
      }
      if (v && typeof v === "object" && !Array.isArray(v)) {
        const meaningful = Object.values(v).some((vv) =>
          typeof vv === "string" ? vv.trim() !== "" : Boolean(vv),
        );
        if (!meaningful) continue;
      }
      return true;
    } catch {
      return true;
    }
  }
  return false;
}

/** Read the saved mood (0..4) for a date, or null if not set. */
export function getSavedMood(dateKey: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`aision:daily:${dateKey}:mood`);
    if (raw == null) return null;
    const v = JSON.parse(raw);
    return typeof v === "number" && v >= 0 ? v : null;
  } catch {
    return null;
  }
}
