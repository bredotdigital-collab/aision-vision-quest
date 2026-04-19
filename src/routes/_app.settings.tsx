import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { THEMES, useTheme } from "@/lib/theme";
import { Check, RotateCcw } from "lucide-react";
import { useLocalState } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { useAffirmationStyle, defaultStyleForTheme } from "@/lib/affirmation";
import { getDailyAffirmation } from "@/lib/months";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings · AISION" },
      { name: "description", content: "Customize your AISION planner." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useLocalState("aision:settings:name", "");
  const { style, setStyle, resetToThemeDefault, isOverridden } = useAffirmationStyle(theme);
  const previewAffirmation = getDailyAffirmation(style);
  const themeDefault = defaultStyleForTheme(theme);

  return (
    <>
      <PageHeader eyebrow="Settings" title="Make it yours" />

      <section className="rounded-2xl border bg-card p-6 shadow-elegant">
        <h2 className="font-display text-lg font-medium">Your name</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Used for personalised greetings throughout the planner.
        </p>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Alex"
          className="mt-4 max-w-sm"
        />
      </section>

      <section className="mt-6 rounded-2xl border bg-card p-6 shadow-elegant">
        <h2 className="font-display text-lg font-medium">Theme</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose the aesthetic that helps you feel most yourself.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {THEMES.map((t) => {
            const active = t.id === theme;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`group relative flex items-start gap-4 rounded-2xl border p-4 text-left transition-colors ${
                  active ? "border-primary bg-brand-soft" : "hover:bg-muted"
                }`}
              >
                <div className="flex shrink-0 -space-x-2" data-theme={t.id}>
                  <span
                    className="h-10 w-10 rounded-full border-2 border-background"
                    style={{ background: "var(--background)" }}
                  />
                  <span
                    className="h-10 w-10 rounded-full border-2 border-background"
                    style={{ background: "var(--brand)" }}
                  />
                  <span
                    className="h-10 w-10 rounded-full border-2 border-background"
                    style={{ background: "var(--primary)" }}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-display text-base font-medium">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </div>
                {active && <Check className="h-5 w-5 text-primary" />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border bg-card p-6 shadow-elegant">
        <h2 className="font-display text-lg font-medium">About</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          AISION 2026 Digital Planner — Powered by{" "}
          <span className="font-medium text-foreground">AISION Creative Systems</span>.
        </p>
      </section>
    </>
  );
}
