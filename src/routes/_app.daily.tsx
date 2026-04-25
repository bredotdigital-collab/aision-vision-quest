import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { PlannerCard } from "@/components/aision/PlannerCard";
import { formatDateKey, parseDateKey, useLocalState } from "@/lib/storage";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Droplet,
  Footprints,
  Heart,
  Sparkles,
  Plus,
  Quote,
  X,
  CalendarDays,
  Zap,
} from "lucide-react";
import { getDailyAffirmation, getMonth } from "@/lib/months";
import { useAffirmationStyle } from "@/lib/affirmation";
import { useTheme } from "@/lib/theme";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DailySearch = { d?: string };

export const Route = createFileRoute("/_app/daily")({
  validateSearch: (s: Record<string, unknown>): DailySearch => ({
    d: typeof s.d === "string" ? s.d : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Daily Planner · AISION" },
      { name: "description", content: "Plan your day with intention — AISION 2026." },
    ],
  }),
  component: Daily,
});

const HOURS = Array.from({ length: 17 }, (_, i) => 6 + i);

const WELLNESS_ITEMS = [
  {
    id: "selfcare",
    label: "Self-care",
    icon: Sparkles,
    prompt: "What will I do for myself today?",
    placeholder: "Example: rest, boundaries, reading, quiet time...",
  },
  {
    id: "movement",
    label: "Movement",
    icon: Footprints,
    prompt: "How will I move today?",
    placeholder: "Example: walk, stretch, gym, yoga, light movement...",
  },
  {
    id: "mindful",
    label: "Mindful moment",
    icon: Heart,
    prompt: "What helped me feel grounded today?",
    placeholder: "Example: breathing, prayer, journaling, stepping outside...",
  },
];

const MOODS = ["😔", "😐", "🙂", "😊", "✨"];
const MOOD_LABELS = ["Low", "Off", "Steady", "Good", "Radiant"];
const MOOD_TIMES = ["morning", "midday", "evening"] as const;
const ENERGY_LEVELS = ["Drained", "Low", "Balanced", "High"];

type MoodTime = (typeof MOOD_TIMES)[number];

function shiftDate(key: string, days: number): string {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + days);
  return formatDateKey(d);
}

function Daily() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const todayKey = formatDateKey(new Date());
  const dateKey = search.d ?? todayKey;
  const date = parseDateKey(dateKey);

  const [guidedMode, setGuidedMode] = useLocalState<boolean>("aision:settings:guidedMode", true);

  const [priorities, setPriorities] = useLocalState<string[]>(
    `aision:daily:${dateKey}:priorities`,
    ["", "", ""],
  );

  const [schedule, setSchedule] = useLocalState<Record<string, string>>(
    `aision:daily:${dateKey}:schedule`,
    {},
  );

  const [tasks, setTasks] = useLocalState<{ text: string; done: boolean }[]>(
    `aision:daily:${dateKey}:tasks`,
    [],
  );

  const [taskDraft, setTaskDraft] = useLocalState<string>(
    `aision:daily:${dateKey}:taskDraft`,
    "",
  );

  const [notes, setNotes] = useLocalState<string>(`aision:daily:${dateKey}:notes`, "");
  const [achieved, setAchieved] = useLocalState<string>(`aision:daily:${dateKey}:achieved`, "");

  const [moods, setMoods] = useLocalState<Record<MoodTime, number>>(
    `aision:daily:${dateKey}:moods`,
    {
      morning: -1,
      midday: -1,
      evening: -1,
    },
  );

  const [moodNote, setMoodNote] = useLocalState<string>(
    `aision:daily:${dateKey}:moodNote`,
    "",
  );

  const [energy, setEnergy] = useLocalState<string>(
    `aision:daily:${dateKey}:energy`,
    "",
  );

  const [energyNote, setEnergyNote] = useLocalState<string>(
    `aision:daily:${dateKey}:energyNote`,
    "",
  );

  const [water, setWater] = useLocalState<number>(`aision:daily:${dateKey}:water`, 0);
  const [waterGoal, setWaterGoal] = useLocalState<number>(
    `aision:daily:${dateKey}:waterGoal`,
    8,
  );
  const [waterNote, setWaterNote] = useLocalState<string>(
    `aision:daily:${dateKey}:waterNote`,
    "",
  );

  const [trackers, setTrackers] = useLocalState<Record<string, boolean>>(
    `aision:daily:${dateKey}:trackers`,
    {},
  );

  const [wellnessNotes, setWellnessNotes] = useLocalState<Record<string, string>>(
    `aision:daily:${dateKey}:wellnessNotes`,
    {},
  );

  const [honoredPriorities, setHonoredPriorities] = useLocalState<string>(
    `aision:daily:${dateKey}:honoredPriorities`,
    "",
  );

  const [accountabilityNote, setAccountabilityNote] = useLocalState<string>(
    `aision:daily:${dateKey}:accountabilityNote`,
    "",
  );

  const weekday = date.toLocaleDateString(undefined, { weekday: "long" });
  const dateLabel = date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const isToday = dateKey === todayKey;
  const { theme } = useTheme();
  const { style } = useAffirmationStyle(theme);
  const affirmation = getDailyAffirmation(style, date);
  const month = getMonth(date);
  const completedTasks = tasks.filter((t) => t.done).length;

  const goToDate = (key: string) =>
    navigate({ to: "/daily", search: key === todayKey ? {} : { d: key } });

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
        description={`${dateLabel}${isToday ? " · Today" : ""}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={guidedMode ? "default" : "outline"}
              size="sm"
              onClick={() => setGuidedMode((v) => !v)}
              className="h-9 rounded-xl text-xs"
            >
              {guidedMode ? "Guided Mode" : "Minimal Mode"}
            </Button>

            <div className="flex items-center gap-1 rounded-xl border bg-card/60 p-1 shadow-elegant">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => goToDate(shiftDate(dateKey, -1))}
                aria-label="Previous day"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-2 px-3 font-medium">
                    <CalendarDays className="h-4 w-4" />
                    {date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && goToDate(formatDateKey(d))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => goToDate(shiftDate(dateKey, 1))}
                aria-label="Next day"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {!isToday && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-muted-foreground"
                  onClick={() => goToDate(todayKey)}
                >
                  Today
                </Button>
              )}
            </div>
          </div>
        }
      />

      <section className="mb-8 overflow-hidden rounded-2xl border bg-hero p-8 shadow-elegant sm:p-10">
        <div className="flex items-start gap-4">
          <Quote className="h-5 w-5 shrink-0 text-primary/60" strokeWidth={1.5} />
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              {isToday ? "Today's affirmation" : "Affirmation"} ·{" "}
              {style === "action" ? "Action" : "Reflective"}
            </p>
            <p className="mt-3 font-display text-2xl leading-snug text-balance sm:text-3xl">
              {affirmation}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <PlannerCard title="Top 3 priorities" eyebrow="Move the needle">
            {guidedMode && (
              <p className="mb-4 rounded-xl bg-surface/60 p-3 text-sm text-muted-foreground">
                If only three things get done today, what must they be? Priorities are the
                must-do items that move your day forward.
              </p>
            )}

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
            eyebrow="Supporting actions"
            action={
              tasks.length > 0 && (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {completedTasks}/{tasks.length}
                </span>
              )
            }
          >
            {guidedMode && (
              <p className="mb-4 rounded-xl bg-surface/60 p-3 text-sm text-muted-foreground">
                What smaller actions support today’s priorities? Keep tasks practical and
                specific.
              </p>
            )}

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

          <PlannerCard title="End-of-day accountability" eyebrow="Reflect without judgment">
            <p className="mb-3 text-sm text-muted-foreground">
              Did I honor my priorities today?
            </p>

            <div className="mb-4 flex gap-2">
              {["Yes", "No"].map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={honoredPriorities === option ? "default" : "outline"}
                  onClick={() => setHonoredPriorities(option)}
                  className="rounded-xl"
                >
                  {option}
                </Button>
              ))}
            </div>

            <Textarea
              rows={4}
              value={accountabilityNote}
              onChange={(e) => setAccountabilityNote(e.target.value)}
              placeholder={
                honoredPriorities === "No"
                  ? "What got in the way? What can I adjust tomorrow?"
                  : "What helped me follow through today?"
              }
              className="resize-none border-0 bg-surface/50 p-4 text-sm shadow-none focus-visible:ring-1"
            />
          </PlannerCard>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <PlannerCard title="Mood" eyebrow="How am I?">
            <div className="space-y-4">
              {MOOD_TIMES.map((time) => (
                <div key={time} className="rounded-xl bg-surface/40 p-3">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {time}
                  </p>
                  <div className="flex items-center justify-between gap-1">
                    {MOODS.map((m, i) => {
                      const active = moods[time] === i;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() =>
                            setMoods((prev) => ({
                              ...prev,
                              [time]: active ? -1 : i,
                            }))
                          }
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full text-xl transition-all",
                            active
                              ? "scale-110 bg-brand-soft shadow-elegant ring-2 ring-primary/50"
                              : "opacity-50 hover:scale-105 hover:opacity-100",
                          )}
                          aria-pressed={active}
                          aria-label={`${time} ${MOOD_LABELS[i]}`}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-center text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {moods[time] >= 0 ? MOOD_LABELS[moods[time]] : "Tap to log"}
                  </p>
                </div>
              ))}
            </div>

            <Textarea
              rows={3}
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="What influenced my mood today?"
              className="mt-4 resize-none border-0 bg-surface/50 p-3 text-sm shadow-none focus-visible:ring-1"
            />
          </PlannerCard>

          <PlannerCard title="Energy" eyebrow="Capacity check">
            <div className="grid grid-cols-2 gap-2">
              {ENERGY_LEVELS.map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant={energy === level ? "default" : "outline"}
                  onClick={() => setEnergy(energy === level ? "" : level)}
                  className="rounded-xl"
                >
                  <Zap className="mr-2 h-3.5 w-3.5" />
                  {level}
                </Button>
              ))}
            </div>

            <Textarea
              rows={3}
              value={energyNote}
              onChange={(e) => setEnergyNote(e.target.value)}
              placeholder="What affected my energy today?"
              className="mt-4 resize-none border-0 bg-surface/50 p-3 text-sm shadow-none focus-visible:ring-1"
            />
          </PlannerCard>

          <PlannerCard
            title="Hydration"
            eyebrow="Water goal"
            action={
              <span className="font-display text-sm tabular-nums text-muted-foreground">
                {water}/{waterGoal || 8}
              </span>
            }
          >
            {guidedMode && (
              <p className="mb-3 text-sm text-muted-foreground">
                Small hydration wins matter. Try one glass before coffee or one glass before
                each meal.
              </p>
            )}

            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Goal</span>
              <Input
                type="number"
                min={1}
                max={16}
                value={waterGoal}
                onChange={(e) => setWaterGoal(Number(e.target.value) || 8)}
                className="h-9 w-20"
              />
              <span className="text-xs text-muted-foreground">glasses</span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {Array.from({ length: waterGoal || 8 }).map((_, i) => (
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

            <Textarea
              rows={3}
              value={waterNote}
              onChange={(e) => setWaterNote(e.target.value)}
              placeholder="How can better hydration improve my day?"
              className="mt-4 resize-none border-0 bg-surface/50 p-3 text-sm shadow-none focus-visible:ring-1"
            />
          </PlannerCard>

          <PlannerCard title="Wellness" eyebrow="Daily check-ins">
            <ul className="space-y-3">
              {WELLNESS_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = trackers[item.id];

                return (
                  <li key={item.id} className="rounded-xl border border-border/60 p-3">
                    <button
                      onClick={() => setTrackers((p) => ({ ...p, [item.id]: !p[item.id] }))}
                      className={`mb-3 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all ${
                        active ? "bg-brand-soft" : "hover:bg-muted/40"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          active ? "text-primary" : "text-muted-foreground"
                        }`}
                        strokeWidth={1.5}
                      />
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                      <Checkbox checked={!!active} className="pointer-events-none" />
                    </button>

                    {guidedMode && (
                      <p className="mb-2 text-xs text-muted-foreground">{item.prompt}</p>
                    )}

                    <Textarea
                      rows={2}
                      value={wellnessNotes[item.id] ?? ""}
                      onChange={(e) =>
                        setWellnessNotes((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                      placeholder={item.placeholder}
                      className="resize-none border-0 bg-surface/50 p-3 text-xs shadow-none focus-visible:ring-1"
                    />
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

          <div className="rounded-xl border bg-card/60 p-4 text-center text-xs text-muted-foreground">
            Looking for another day?{" "}
            <Link
              to="/monthly"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              Open monthly view
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}