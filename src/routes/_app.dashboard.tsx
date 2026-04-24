import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { PlannerCard } from "@/components/aision/PlannerCard";
import { InstallAppCard } from "@/components/aision/InstallAppCard";
import { ArrowUpRight, CalendarDays, CalendarCheck, Sun, TrendingUp } from "lucide-react";
import { getDailyAffirmation, getMonth } from "@/lib/months";
import { useAffirmationStyle } from "@/lib/affirmation";
import { useTheme } from "@/lib/theme";
import { useLocalState } from "@/lib/storage";

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
  const [name] = useLocalState("aision:settings:name", "");
  const { theme } = useTheme();
  const { style } = useAffirmationStyle(theme);
  const affirmation = getDailyAffirmation(style, today);
  const month = getMonth(today);

  return (
    <>
      <PageHeader
        eyebrow={name ? `Welcome back, ${name}` : "Welcome back"}
        title={`${month.name} · ${month.theme}`}
        description={dateLabel}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {QUICK.map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className="group flex flex-col justify-between rounded-2xl border bg-card/85 p-5 shadow-elegant transition-all hover:-translate-y-0.5 hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-primary">
                <q.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <div className="mt-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                {q.eyebrow}
              </p>
              <p className="mt-1 font-display text-xl">{q.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <PlannerCard tone="hero" className="lg:col-span-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Affirmation of the day · {style === "action" ? "Action" : "Reflective"}
          </p>
          <p className="mt-3 font-display text-2xl leading-snug text-balance sm:text-[26px]">
            “{affirmation}”
          </p>
        </PlannerCard>
        <PlannerCard eyebrow="Year theme" title="Quiet mastery." description="Define your 2026 theme on the Year Overview page." />
      </section>

      <section className="mt-6">
        <InstallAppCard />
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
