import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Target, LineChart, Layers } from "lucide-react";
import { Logo } from "@/components/aision/Logo";
import { ThemeSwitcher } from "@/components/aision/ThemeSwitcher";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AISION · 2026 Digital Planner" },
      {
        name: "description",
        content:
          "A premium 2026 digital planner by AISION Creative Systems. Plan your year, month, week and day with intention.",
      },
      { property: "og:title", content: "AISION · 2026 Digital Planner" },
      {
        property: "og:description",
        content: "Your personal operating system for focus, growth and consistency.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button asChild size="sm" className="rounded-full">
            <Link to="/dashboard">
              Open planner <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-hero opacity-70" />
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10 lg:pb-28 lg:pt-24">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border bg-surface-elevated px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> 2026 Edition
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] text-balance sm:text-6xl lg:text-7xl">
              A planner that thinks like an{" "}
              <span className="italic text-primary">operating system.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              AISION is a premium 2026 digital planner built for focus, growth and consistency.
              Year, month, week and day — designed as one calm, intentional system.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/dashboard">
                  Enter your planner <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/daily">Try the daily page</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border bg-card p-6 shadow-elegant transition-transform hover:-translate-y-0.5"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-medium">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-xs text-muted-foreground lg:px-10">
          <span>© 2026 AISION</span>
          <span>
            Powered by <span className="font-medium text-foreground">AISION Creative Systems</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  {
    icon: Layers,
    title: "Year → Day flow",
    body: "Zoom from your 2026 vision down to today, all in one structured space.",
  },
  {
    icon: Target,
    title: "Priorities first",
    body: "Top 3 priorities, time blocks and habits that move the needle.",
  },
  {
    icon: LineChart,
    title: "Tracking that lasts",
    body: "Goals, habits, mood, weight and wellness — visualised over time.",
  },
  {
    icon: Sparkles,
    title: "Four refined themes",
    body: "Soft Neutral, Botanical, Dark Minimal, Classic Pro — your aesthetic, your call.",
  },
];
