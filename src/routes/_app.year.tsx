import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { formatDateKey, hasDailyEntries } from "@/lib/storage";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/year")({
  head: () => ({
    meta: [
      { title: "2026 Year Overview · AISION" },
      { name: "description", content: "Your 2026 at a glance." },
    ],
  }),
  component: Year,
});

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

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

      <div className="mb-8 rounded-2xl border bg-hero p-6 shadow-elegant">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Year theme
        </p>
        <p className="mt-2 font-display text-2xl">Quiet mastery.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MONTHS.map((m, idx) => {
          const active = isCurrentYear && today.getMonth() === idx;
          return (
            <div
              key={m}
              className={`rounded-2xl border bg-card p-5 shadow-elegant ${
                active ? "ring-2 ring-primary" : ""
              }`}
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Month {String(idx + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 font-display text-xl">{m}</h3>
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
        <div key={i} className="text-center text-muted-foreground">
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
            className={`relative flex h-6 items-center justify-center rounded transition-colors ${
              isToday(c)
                ? "bg-primary text-primary-foreground"
                : "text-foreground/80 hover:bg-muted"
            }`}
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
