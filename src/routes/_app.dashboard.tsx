import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { ArrowUpRight, CalendarDays, CalendarCheck, Sun, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · AISION" },
      { name: "description", content: "Your AISION 2026 planner dashboard." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const today = new Date();
  const dateLabel = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <PageHeader
        eyebrow="Welcome back"
        title="Your 2026 dashboard"
        description={dateLabel}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {QUICK.map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className="group flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-elegant transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-primary">
                <q.icon className="h-5 w-5" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {q.eyebrow}
              </p>
              <p className="mt-1 font-display text-xl">{q.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-elegant lg:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Affirmation of the day
          </p>
          <p className="mt-3 font-display text-2xl leading-snug text-balance">
            “I do calm, focused work — and I trust the system I’ve built.”
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-elegant">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Year theme
          </p>
          <p className="mt-3 font-display text-xl">Quiet mastery.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Define your 2026 theme on the Year Overview page.
          </p>
        </div>
      </section>
    </>
  );
}

const QUICK = [
  { to: "/daily", label: "Daily Planner", eyebrow: "Today", icon: Sun },
  { to: "/weekly", label: "Weekly Planner", eyebrow: "This week", icon: CalendarCheck },
  { to: "/monthly", label: "Monthly Planner", eyebrow: "This month", icon: CalendarDays },
  { to: "/tracking", label: "Progress", eyebrow: "Tracking", icon: TrendingUp },
] as const;
