import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { PlannerCard } from "@/components/aision/PlannerCard";
import { formatDateKey, hasDailyEntries } from "@/lib/storage";
import { MONTHS as MONTH_DATA } from "@/lib/months";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/year")({
  head: () => ({
    meta: [
      { title: "2026 Year Overview · AISION" },
      { name: "description", content: "Your 2026 at a glance." },
    ],
  }),
  component: Year,
});

function Year() {
  const today = new Date();
  const isCurrentYear = today.getFullYear() === 2026;

  return (
    <>
      <PageHeader
        eyebrow="2026"
        title="Year overview"
        description="A calm bird’s-eye view of your year."
      />

      <PlannerCard tone="hero" className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Year theme
        </p>
        <p className="mt-2 font-display text-3xl leading-tight">Quiet mastery.</p>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Twelve themes, one direction — a steady year of focused craft.
        </p>
      </PlannerCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MONTH_DATA.map((m, idx) => {
          const active = isCurrentYear && today.getMonth() === idx;
          return (
            <div
              key={m.name}
              className={cn(
                "rounded-2xl border bg-card/85 p-5 shadow-elegant transition-colors",
                active && "border-primary/60 ring-1 ring-primary/30",
              )}
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {String(idx + 1).padStart(2, "0")} · {m.theme}
              </p>
              <h3 className="mt-1 font-display text-xl">{m.name}</h3>
              <MiniMonth year={2026} month={idx} />
            </div>
          );
        })}
      </div>
    </>
  );
}

function MiniMonth({ year, month }: { year: number; month: number }) {
  const navigate = useNavigate();
  const first = new Date(year, month, 1);
  const startDay = (first.getDay() + 6) % 7;
  const daysIn = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysIn }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const today = new Date();
  const todayKey = formatDateKey(today);
  const isToday = (d: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

  const [entries, setEntries] = useState<Record<number, boolean>>({});
  useEffect(() => {
    const m: Record<number, boolean> = {};
    for (const c of cells) {
      if (c == null) continue;
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(c).padStart(2, "0")}`;
      if (hasDailyEntries(key)) m[c] = true;
    }
    setEntries(m);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const open = (d: number) => {
    const key = formatDateKey(new Date(year, month, d));
    navigate({ to: "/daily", search: key === todayKey ? {} : { d: key } });
  };

  return (
    <div className="mt-3 grid grid-cols-7 gap-1 text-[10px]">
      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
        <div key={i} className="text-center font-medium text-muted-foreground/70">
          {d}
        </div>
      ))}
      {cells.map((c, i) =>
        c == null ? (
          <div key={i} className="h-6" />
        ) : (
          <button
            key={i}
            type="button"
            onClick={() => open(c)}
            className={cn(
              "relative flex h-6 items-center justify-center rounded tabular-nums transition-colors",
              isToday(c)
                ? "bg-primary text-primary-foreground"
                : "text-foreground/80 hover:bg-muted",
            )}
          >
            {c}
            {entries[c] && !isToday(c) && (
              <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-primary" />
            )}
          </button>
        ),
      )}
    </div>
  );
}
