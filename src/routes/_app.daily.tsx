import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { PlannerCard } from "@/components/aision/PlannerCard";
import { useLocalState } from "@/lib/storage";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Droplet, Footprints, Heart, Sparkles, Plus, X, Quote } from "lucide-react";
import { getDailyAffirmation, getMonth } from "@/lib/months";
import { useAffirmationStyle } from "@/lib/affirmation";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/_app/daily")({
  head: () => ({
    meta: [
      { title: "Daily Planner · AISION" },
      { name: "description", content: "Plan your day with intention — AISION 2026." },
    ],
  }),
  component: Daily,
});

const HOURS = Array.from({ length: 17 }, (_, i) => 6 + i); // 6..22
const HABITS = [
  { id: "selfcare", label: "Self-care", icon: Sparkles },
  { id: "movement", label: "Movement", icon: Footprints },
  { id: "mood", label: "Mindful moment", icon: Heart },
];
const MOODS = ["😔", "😐", "🙂", "😊", "✨"];
const MOOD_LABELS = ["Low", "Off", "Steady", "Good", "Radiant"];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function Daily() {
  const key = todayKey();
  const [priorities, setPriorities] = useLocalState<string[]>(`aision:daily:${key}:priorities`, [
    "",
    "",
    "",
  ]);
  const [schedule, setSchedule] = useLocalState<Record<string, string>>(
    `aision:daily:${key}:schedule`,
    {},
  );
  const [tasks, setTasks] = useLocalState<{ text: string; done: boolean }[]>(
    `aision:daily:${key}:tasks`,
    [],
  );
  const [taskDraft, setTaskDraft] = useLocalState<string>(`aision:daily:${key}:taskDraft`, "");
  const [notes, setNotes] = useLocalState<string>(`aision:daily:${key}:notes`, "");
  const [achieved, setAchieved] = useLocalState<string>(`aision:daily:${key}:achieved`, "");
  const [mood, setMood] = useLocalState<number>(`aision:daily:${key}:mood`, -1);
  const [water, setWater] = useLocalState<number>(`aision:daily:${key}:water`, 0);
  const [trackers, setTrackers] = useLocalState<Record<string, boolean>>(
    `aision:daily:${key}:trackers`,
    {},
  );

  const today = new Date();
  const weekday = today.toLocaleDateString(undefined, { weekday: "long" });
  const dateLabel = today.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const { theme } = useTheme();
  const { style } = useAffirmationStyle(theme);
  const affirmation = getDailyAffirmation(style, today);
  const month = getMonth(today);
  const completedTasks = tasks.filter((t) => t.done).length;

  const addTask = () => {
    const t = taskDraft.trim();
    if (!t) return;
    setTasks((prev) => [...prev, { text: t, done: false }]);
    setTaskDraft("");
  };

  return (
    <>
      <PageHeader
        eyebrow={`${month.name} · ${month.theme}`}
        title={weekday}
        description={dateLabel}
      />

      {/* Affirmation — single hero element */}
      <section className="mb-8 overflow-hidden rounded-2xl border bg-hero p-8 shadow-elegant sm:p-10">
        <div className="flex items-start gap-4">
          <Quote className="h-5 w-5 shrink-0 text-primary/60" strokeWidth={1.5} />
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Today's affirmation · {style === "action" ? "Action" : "Reflective"}
            </p>
            <p className="mt-3 font-display text-2xl leading-snug text-balance sm:text-3xl">
              {affirmation}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT — focus column */}
        <div className="space-y-6 lg:col-span-8">
          <PlannerCard title="Top 3 priorities" eyebrow="Move the needle">
            <div className="space-y-3">
              {priorities.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-xl border border-transparent bg-surface/50 px-4 py-2 transition-colors focus-within:border-border focus-within:bg-surface"
                >
                  <span className="font-display text-sm tabular-nums text-muted-foreground">
                    0{i + 1}
                  </span>
                  <Input
                    value={p}
                    placeholder={`Priority ${i + 1}`}
                    onChange={(e) =>
                      setPriorities((prev) => {
                        const next = [...prev];
                        next[i] = e.target.value;
                        return next;
                      })
                    }
                    className="border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                  />
                </div>
              ))}
            </div>
          </PlannerCard>

          <PlannerCard
            title="Time-blocked schedule"
            eyebrow="6 AM → 10 PM"
            action={
              <span className="text-xs text-muted-foreground tabular-nums">
                {Object.values(schedule).filter(Boolean).length} blocks
              </span>
            }
          >
            <div className="-mx-2 divide-y divide-border/60">
              {HOURS.map((h) => {
                const label = `${((h + 11) % 12) + 1} ${h < 12 ? "AM" : "PM"}`;
                const filled = Boolean(schedule[String(h)]);
                return (
                  <div
                    key={h}
                    className="group/row flex items-center gap-4 px-2 py-1.5 transition-colors hover:bg-muted/40"
                  >
                    <span
                      className={`w-14 shrink-0 text-[11px] font-medium uppercase tracking-wider tabular-nums ${
                        filled ? "text-foreground" : "text-muted-foreground/70"
                      }`}
                    >
                      {label}
                    </span>
                    <Input
                      value={schedule[String(h)] ?? ""}
                      onChange={(e) =>
                        setSchedule((prev) => ({ ...prev, [String(h)]: e.target.value }))
                      }
                      placeholder="—"
                      className="h-9 border-0 bg-transparent px-0 text-sm shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0"
                    />
                  </div>
                );
              })}
            </div>
          </PlannerCard>

          <PlannerCard
            title="Tasks"
            eyebrow="Catch-all"
            action={
              tasks.length > 0 && (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {completedTasks}/{tasks.length}
                </span>
              )
            }
          >
            <div className="flex gap-2">
              <Input
                value={taskDraft}
                onChange={(e) => setTaskDraft(e.target.value)}
                placeholder="Add a task…"
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                className="h-10"
              />
              <Button onClick={addTask} size="icon" aria-label="Add task" className="h-10 w-10">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="mt-4 space-y-1.5">
              {tasks.length === 0 && (
                <li className="rounded-lg border border-dashed py-6 text-center text-sm text-muted-foreground">
                  Nothing yet — keep it light.
                </li>
              )}
              {tasks.map((t, i) => (
                <li
                  key={i}
                  className="group/task flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted/50"
                >
                  <Checkbox
                    checked={t.done}
                    onCheckedChange={(v) =>
                      setTasks((prev) => {
                        const next = [...prev];
                        next[i] = { ...next[i], done: Boolean(v) };
                        return next;
                      })
                    }
                  />
                  <span
                    className={`flex-1 text-sm transition-colors ${
                      t.done ? "text-muted-foreground line-through" : ""
                    }`}
                  >
                    {t.text}
                  </span>
                  <button
                    onClick={() => setTasks((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-muted-foreground/40 opacity-0 transition-opacity hover:text-foreground group-hover/task:opacity-100"
                    aria-label="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </PlannerCard>

          <PlannerCard title="Notes" eyebrow="Free space">
            <Textarea
              rows={6}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Thoughts, ideas, observations…"
              className="resize-none border-0 bg-surface/50 p-4 text-sm shadow-none focus-visible:ring-1"
            />
          </PlannerCard>
        </div>

        {/* RIGHT — wellness column */}
        <div className="space-y-6 lg:col-span-4">
          <PlannerCard title="Mood" eyebrow="How am I?">
            <div className="flex items-center justify-between gap-1">
              {MOODS.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setMood(i)}
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-xl transition-all ${
                    mood === i
                      ? "scale-110 bg-brand-soft ring-2 ring-primary/40"
                      : "opacity-50 hover:opacity-100"
                  }`}
                  aria-label={MOOD_LABELS[i]}
                >
                  {m}
                </button>
              ))}
            </div>
            {mood >= 0 && (
              <p className="mt-3 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {MOOD_LABELS[mood]}
              </p>
            )}
          </PlannerCard>

          <PlannerCard
            title="Water"
            eyebrow="Hydration"
            action={
              <span className="font-display text-sm tabular-nums text-muted-foreground">
                {water}/8
              </span>
            }
          >
            <div className="flex items-center justify-between gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setWater(i + 1 === water ? i : i + 1)}
                  aria-label={`${i + 1} glasses`}
                  className="p-1"
                >
                  <Droplet
                    className={`h-5 w-5 transition-all ${
                      i < water
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30 hover:text-muted-foreground"
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
          </PlannerCard>

          <PlannerCard title="Wellness" eyebrow="Daily check-ins">
            <ul className="space-y-2">
              {HABITS.map((h) => {
                const Icon = h.icon;
                const active = trackers[h.id];
                return (
                  <li key={h.id}>
                    <button
                      onClick={() => setTrackers((p) => ({ ...p, [h.id]: !p[h.id] }))}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all ${
                        active
                          ? "border-primary/40 bg-brand-soft"
                          : "border-border/60 hover:border-border hover:bg-muted/40"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          active ? "text-primary" : "text-muted-foreground"
                        }`}
                        strokeWidth={1.5}
                      />
                      <span className="flex-1 text-left font-medium">{h.label}</span>
                      <Checkbox checked={!!active} className="pointer-events-none" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </PlannerCard>

          <PlannerCard title="Today I achieved" eyebrow="Wins">
            <Textarea
              rows={5}
              value={achieved}
              onChange={(e) => setAchieved(e.target.value)}
              placeholder="What went well today?"
              className="resize-none border-0 bg-surface/50 p-4 text-sm shadow-none focus-visible:ring-1"
            />
          </PlannerCard>
        </div>
      </div>
    </>
  );
}
