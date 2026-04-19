import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { useLocalState } from "@/lib/storage";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Droplet, Footprints, Heart, Sparkles, Plus, X } from "lucide-react";

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
  { id: "mood", label: "Mood today", icon: Heart },
  { id: "selfcare", label: "Self-care", icon: Sparkles },
  { id: "movement", label: "Movement", icon: Footprints },
];
const MOODS = ["😔", "😐", "🙂", "😊", "✨"];
const AFFIRMATIONS = [
  "I do calm, focused work — and I trust the system I’ve built.",
  "Today, small consistent steps create the future I want.",
  "I move with intention, not urgency.",
  "Discipline is a form of self-respect.",
  "I am the architect of my day.",
];

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
  const dateLabel = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const affirmation = AFFIRMATIONS[today.getDate() % AFFIRMATIONS.length];

  const addTask = () => {
    const t = taskDraft.trim();
    if (!t) return;
    setTasks((prev) => [...prev, { text: t, done: false }]);
    setTaskDraft("");
  };

  return (
    <>
      <PageHeader eyebrow="Today" title={dateLabel} />

      {/* Affirmation */}
      <section className="mb-6 rounded-2xl border bg-hero p-6 shadow-elegant">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Daily affirmation
        </p>
        <p className="mt-2 font-display text-2xl leading-snug text-balance">{affirmation}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT — priorities + schedule */}
        <div className="space-y-6 lg:col-span-2">
          <Card title="Top 3 priorities" eyebrow="Move the needle">
            <div className="space-y-3">
              {priorities.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="font-display text-lg text-muted-foreground">0{i + 1}</span>
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
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Time-blocked schedule" eyebrow="6 AM → 10 PM">
            <div className="divide-y">
              {HOURS.map((h) => {
                const label = `${((h + 11) % 12) + 1} ${h < 12 ? "AM" : "PM"}`;
                return (
                  <div key={h} className="flex items-center gap-4 py-2">
                    <span className="w-16 shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
                      {label}
                    </span>
                    <Input
                      value={schedule[String(h)] ?? ""}
                      onChange={(e) =>
                        setSchedule((prev) => ({ ...prev, [String(h)]: e.target.value }))
                      }
                      placeholder="—"
                      className="border-0 bg-transparent shadow-none focus-visible:ring-1"
                    />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title="Additional tasks" eyebrow="Catch-all">
            <div className="flex gap-2">
              <Input
                value={taskDraft}
                onChange={(e) => setTaskDraft(e.target.value)}
                placeholder="Add a task…"
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
              <Button onClick={addTask} size="icon" aria-label="Add task">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="mt-4 space-y-2">
              {tasks.length === 0 && (
                <li className="text-sm text-muted-foreground">Nothing yet — keep it light.</li>
              )}
              {tasks.map((t, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-lg border bg-surface px-3 py-2"
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
                  <span className={`flex-1 text-sm ${t.done ? "line-through text-muted-foreground" : ""}`}>
                    {t.text}
                  </span>
                  <button
                    onClick={() => setTasks((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Notes" eyebrow="Free space">
            <Textarea
              rows={6}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Thoughts, ideas, observations…"
            />
          </Card>
        </div>

        {/* RIGHT — trackers */}
        <div className="space-y-6">
          <Card title="Mood" eyebrow="How am I?">
            <div className="flex items-center justify-between">
              {MOODS.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setMood(i)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border text-2xl transition-colors ${
                    mood === i ? "border-primary bg-brand-soft" : "hover:bg-muted"
                  }`}
                  aria-label={`Mood ${i + 1}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Water" eyebrow="Hydration">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setWater(i + 1 === water ? i : i + 1)}
                    aria-label={`${i + 1} glasses`}
                    className="group"
                  >
                    <Droplet
                      className={`h-6 w-6 transition-colors ${
                        i < water ? "fill-primary text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="font-display text-lg">{water}/8</span>
            </div>
          </Card>

          <Card title="Wellness" eyebrow="Daily check-ins">
            <ul className="space-y-2">
              {HABITS.map((h) => {
                const Icon = h.icon;
                const active = trackers[h.id];
                return (
                  <li key={h.id}>
                    <button
                      onClick={() => setTrackers((p) => ({ ...p, [h.id]: !p[h.id] }))}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${
                        active ? "border-primary bg-brand-soft" : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{h.label}</span>
                      <Checkbox checked={!!active} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card title="Today I achieved" eyebrow="Wins">
            <Textarea
              rows={5}
              value={achieved}
              onChange={(e) => setAchieved(e.target.value)}
              placeholder="What went well today?"
            />
          </Card>
        </div>
      </div>
    </>
  );
}

function Card({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-elegant">
      <header className="mb-4">
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-lg font-medium">{title}</h2>
      </header>
      {children}
    </section>
  );
}
