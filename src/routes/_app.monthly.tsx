import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { Textarea } from "@/components/ui/textarea";
import { formatDateKey, hasDailyEntries, useLocalState } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { getMonth } from "@/lib/months";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/monthly")({
  head: () => ({
    meta: [
      { title: "Monthly Planner · AISION" },
      { name: "description", content: "Monthly theme, focus, goals and reflection." },
    ],
  }),
  component: Monthly,
});

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Monthly() {
  const today = new Date();
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const navigate = useNavigate();

  const monthIdx = cursor.getMonth();
  const year = cursor.getFullYear();
  const month = getMonth(cursor);
  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const storageKey = `${year}-${String(monthIdx + 1).padStart(2, "0")}`;

  const [goals, setGoals] = useLocalState<string[]>(
    `aision:monthly:${storageKey}:goals`,
    ["", "", "", ""],
  );
  const [reflection, setReflection] = useLocalState(
    `aision:monthly:${storageKey}:reflection`,
    "",
  );
  const [promptA, setPromptA] = useLocalState(`aision:monthly:${storageKey}:promptA`, "");
  const [promptB, setPromptB] = useLocalState(`aision:monthly:${storageKey}:promptB`, "");
  const [intention, setIntention] = useLocalState(
    `aision:monthly:${storageKey}:intention`,
    "",
  );

  // Build calendar grid (Mon-first)
  const cells = useMemo(() => {
    const first = new Date(year, monthIdx, 1);
    const startDay = (first.getDay() + 6) % 7; // Mon = 0
    const daysIn = new Date(year, monthIdx + 1, 0).getDate();
    const arr: (number | null)[] = [
      ...Array(startDay).fill(null),
      ...Array.from({ length: daysIn }, (_, i) => i + 1),
    ];
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [year, monthIdx]);

  // Track which days have saved entries (re-check whenever month changes)
  const [entriesMap, setEntriesMap] = useState<Record<number, boolean>>({});
  useEffect(() => {
    const m: Record<number, boolean> = {};
    for (const c of cells) {
      if (c == null) continue;
      const key = `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(c).padStart(2, "0")}`;
      if (hasDailyEntries(key)) m[c] = true;
    }
    setEntriesMap(m);
  }, [cells, year, monthIdx]);

  const isToday = (d: number) =>
    today.getFullYear() === year && today.getMonth() === monthIdx && today.getDate() === d;

  const openDay = (d: number) => {
    const key = formatDateKey(new Date(year, monthIdx, d));
    const todayKey = formatDateKey(today);
    navigate({ to: "/daily", search: key === todayKey ? {} : { d: key } });
  };

  const shiftMonth = (delta: number) =>
    setCursor(new Date(year, monthIdx + delta, 1));

  return (
    <>
      <PageHeader
        eyebrow={`${month.name} · ${month.theme}`}
        title={monthLabel}
        description="Click any day to open its planner."
        actions={
          <div className="flex items-center gap-1 rounded-xl border bg-card/60 p-1 shadow-elegant">
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => shiftMonth(-1)} aria-label="Previous month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
            >
              This month
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => shiftMonth(1)} aria-label="Next month">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-hero p-6 shadow-elegant lg:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Theme of the month
          </p>
          <h2 className="mt-1 font-display text-3xl font-semibold">{month.theme}</h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Focus · </span>
            {month.focus}
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-elegant">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Personal intention
          </p>
          <Input
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="Add your own word for the month…"
            className="mt-2 border-0 bg-transparent text-lg shadow-none focus-visible:ring-1"
          />
        </div>
      </section>

      {/* Interactive calendar grid */}
      <Card title="Calendar" eyebrow="Tap a day to plan it" className="mb-6">
        <div className="mb-2 grid grid-cols-7 gap-2 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {WEEKDAYS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {cells.map((c, i) => {
            if (c == null) return <div key={i} className="aspect-square" />;
            const todayCell = isToday(c);
            const hasEntries = entriesMap[c];
            return (
              <button
                key={i}
                type="button"
                onClick={() => openDay(c)}
                className={cn(
                  "group relative aspect-square rounded-xl border text-left transition-all",
                  "p-2 sm:p-3 hover:-translate-y-0.5 hover:shadow-elegant",
                  todayCell
                    ? "border-primary/60 bg-brand-soft"
                    : hasEntries
                    ? "border-border/80 bg-card hover:border-primary/40"
                    : "border-border/40 bg-card/40 hover:border-border",
                )}
                aria-label={`Open planner for ${cursor.toLocaleDateString(undefined, { month: "long" })} ${c}`}
              >
                <span
                  className={cn(
                    "font-display text-sm tabular-nums sm:text-base",
                    todayCell ? "text-foreground" : "text-foreground/80",
                  )}
                >
                  {c}
                </span>
                {hasEntries && (
                  <span
                    className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary shadow-sm"
                    aria-label="Has entries"
                  />
                )}
                {todayCell && (
                  <span className="absolute bottom-1.5 left-1.5 text-[8px] font-medium uppercase tracking-widest text-primary">
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Has entries
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm border border-primary/60 bg-brand-soft" /> Today
          </span>
        </p>
      </Card>

      <Card title="Monthly goals">
        <div className="grid gap-3 sm:grid-cols-2">
          {goals.map((g, i) => (
            <Input
              key={i}
              value={g}
              placeholder={`Goal ${i + 1}`}
              onChange={(e) =>
                setGoals((prev) => {
                  const n = [...prev];
                  n[i] = e.target.value;
                  return n;
                })
              }
            />
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Tip n={1} text={month.tips[0]} />
        <Tip n={2} text={month.tips[1]} />
      </div>

      <Card title="Reflection prompts" eyebrow="Two questions for this month" className="mt-6">
        <div className="space-y-5">
          <div>
            <p className="font-display text-base">{month.prompts[0]}</p>
            <Textarea
              rows={4}
              value={promptA}
              onChange={(e) => setPromptA(e.target.value)}
              placeholder="Write freely…"
              className="mt-2"
            />
          </div>
          <div>
            <p className="font-display text-base">{month.prompts[1]}</p>
            <Textarea
              rows={4}
              value={promptB}
              onChange={(e) => setPromptB(e.target.value)}
              placeholder="Write freely…"
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      <Card title="Monthly reflection" eyebrow="End-of-month review" className="mt-6">
        <Textarea
          rows={8}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="What stood out? What would I repeat? What would I change?"
        />
      </Card>
    </>
  );
}

function Tip({ n, text }: { n: number; text: string }) {
  return (
    <div className="rounded-2xl border bg-brand-soft p-5">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        Practical tip {n}
      </p>
      <p className="mt-2 font-display text-base leading-snug text-balance">{text}</p>
    </div>
  );
}

function Card({
  title,
  eyebrow,
  className = "",
  children,
}: {
  title: string;
  eyebrow?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-2xl border bg-card p-6 shadow-elegant ${className}`}>
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
