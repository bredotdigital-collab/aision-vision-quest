import { useEffect, useState, useCallback } from "react";
import { useLocalState } from "./storage";

export type ReminderId =
  | "daily-planning"
  | "weekly-reset"
  | "monthly-reflection"
  | "habit-checkin"
  | "goal-review";

export type Frequency = "daily" | "weekly" | "monthly";

export type Reminder = {
  id: ReminderId;
  label: string;
  description: string;
  enabled: boolean;
  time: string; // HH:MM 24h
  frequency: Frequency;
  /** 0=Sun..6=Sat — only used when frequency = weekly */
  weekday?: number;
  /** 1..28 — only used when frequency = monthly */
  monthday?: number;
};

export const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: "daily-planning",
    label: "Daily planning",
    description: "Set your top 3 priorities and schedule.",
    enabled: false,
    time: "08:00",
    frequency: "daily",
  },
  {
    id: "weekly-reset",
    label: "Weekly reset",
    description: "Review the week and plan the next.",
    enabled: false,
    time: "18:00",
    frequency: "weekly",
    weekday: 0,
  },
  {
    id: "monthly-reflection",
    label: "Monthly reflection",
    description: "Look back, capture wins, set the tone.",
    enabled: false,
    time: "19:00",
    frequency: "monthly",
    monthday: 1,
  },
  {
    id: "habit-checkin",
    label: "Habit check-in",
    description: "A gentle nudge for your daily habits.",
    enabled: false,
    time: "20:00",
    frequency: "daily",
  },
  {
    id: "goal-review",
    label: "Goal review",
    description: "Stay aligned with your bigger picture.",
    enabled: false,
    time: "17:00",
    frequency: "weekly",
    weekday: 5,
  },
];

const STORAGE_KEY = "aision:reminders:v1";
const FIRED_KEY = "aision:reminders:lastFired";

export function useReminders() {
  const [reminders, setReminders] = useLocalState<Reminder[]>(STORAGE_KEY, DEFAULT_REMINDERS);

  // Merge defaults if new ids were added in code
  useEffect(() => {
    const ids = new Set(reminders.map((r) => r.id));
    const missing = DEFAULT_REMINDERS.filter((r) => !ids.has(r.id));
    if (missing.length) setReminders([...reminders, ...missing]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = useCallback(
    (id: ReminderId, patch: Partial<Reminder>) => {
      setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    },
    [setReminders],
  );

  return { reminders, update, setReminders };
}

/* ---------------- Notification permission ---------------- */

export function useNotificationPermission() {
  const supported = typeof window !== "undefined" && "Notification" in window;
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    supported ? Notification.permission : "unsupported",
  );

  const request = useCallback(async () => {
    if (!supported) return "unsupported" as const;
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch {
      return permission;
    }
  }, [supported, permission]);

  return { supported, permission, request };
}

/* ---------------- In-app alert event bus ---------------- */

export type ReminderAlert = { id: ReminderId; label: string; description: string; at: number };

type Listener = (a: ReminderAlert) => void;
const listeners = new Set<Listener>();

export function onReminderAlert(fn: Listener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function fire(alert: ReminderAlert) {
  listeners.forEach((l) => l(alert));
  // Browser notification (best-effort)
  try {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification(`AISION · ${alert.label}`, {
        body: alert.description,
        icon: "/icons/icon-192.png",
        tag: alert.id,
      });
    }
  } catch {
    /* ignore */
  }
}

/* ---------------- Scheduler ---------------- */

function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function isDue(r: Reminder, now: Date): boolean {
  if (!r.enabled) return false;
  const [hh, mm] = r.time.split(":").map(Number);
  if (now.getHours() < hh || (now.getHours() === hh && now.getMinutes() < mm)) return false;

  if (r.frequency === "weekly" && r.weekday != null && now.getDay() !== r.weekday) return false;
  if (r.frequency === "monthly" && r.monthday != null && now.getDate() !== r.monthday) return false;

  return true;
}

function loadFired(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(FIRED_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveFired(map: Record<string, string>) {
  try {
    localStorage.setItem(FIRED_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

/**
 * Mount once (e.g. inside AppLayout). Polls every 30s and fires due reminders.
 */
export function useReminderScheduler() {
  const { reminders } = useReminders();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tick = () => {
      const now = new Date();
      const key = todayKey(now);
      const fired = loadFired();
      let changed = false;

      for (const r of reminders) {
        if (!isDue(r, now)) continue;
        if (fired[r.id] === key) continue;
        fire({ id: r.id, label: r.label, description: r.description, at: now.getTime() });
        fired[r.id] = key;
        changed = true;
      }
      if (changed) saveFired(fired);
    };

    tick();
    const t = window.setInterval(tick, 30_000);
    return () => window.clearInterval(t);
  }, [reminders]);
}
