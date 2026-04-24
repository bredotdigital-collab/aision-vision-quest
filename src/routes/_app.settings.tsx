import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { PlannerCard } from "@/components/aision/PlannerCard";
import { THEMES, useTheme } from "@/lib/theme";
import { Check, RotateCcw } from "lucide-react";
import { useLocalState } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { useAffirmationStyle, defaultStyleForTheme } from "@/lib/affirmation";
import { getDailyAffirmation } from "@/lib/months";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      <PageHeader
        eyebrow="Settings"
        title="Make it yours"
        description="Personalise the planner to match how you think and work."
      />

      <PlannerCard
        title="Your name"
        eyebrow="Identity"
        description="Used for personalised greetings throughout the planner."
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Alex"
          className="max-w-sm"
        />
      </PlannerCard>

      <PlannerCard
        title="Theme"
        eyebrow="Aesthetic"
        description="Choose the aesthetic that helps you feel most yourself."
        className="mt-5"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {THEMES.map((t) => {
            const active = t.id === theme;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "group relative flex items-start gap-4 rounded-2xl border p-4 text-left transition-colors",
                  active ? "border-primary bg-brand-soft" : "hover:bg-muted/60",
                )}
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
      </PlannerCard>

      <PlannerCard
        eyebrow="Voice"
        title="Affirmation style"
        description="Choose the tone of your daily affirmations. Soft themes default to Reflective; bold themes default to Action."
        action={
          isOverridden && (
            <Button variant="ghost" size="sm" onClick={resetToThemeDefault} className="gap-2 text-xs">
              <RotateCcw className="h-3.5 w-3.5" /> Reset to {themeDefault}
            </Button>
          )
        }
        className="mt-5"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <StyleCard
            id="reflective"
            label="Reflective"
            description="Gentle, inward, calming."
            example="“I trust the quiet space I’m creating.”"
            active={style === "reflective"}
            isDefault={themeDefault === "reflective"}
            onClick={() => setStyle("reflective")}
          />
          <StyleCard
            id="action"
            label="Action"
            description="Direct, decisive, energising."
            example="“I do the work whether I feel like it or not.”"
            active={style === "action"}
            isDefault={themeDefault === "action"}
            onClick={() => setStyle("action")}
          />
        </div>

        <div className="mt-5 rounded-xl border bg-brand-soft/70 p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Today’s affirmation preview
          </p>
          <p className="mt-1 font-display text-base leading-snug text-balance">
            “{previewAffirmation}”
          </p>
        </div>
      </PlannerCard>

      <PlannerCard title="About" eyebrow="AISION" className="mt-5">
        <p className="text-sm text-muted-foreground">
          AISION 2026 Digital Planner — Powered by{" "}
          <span className="font-medium text-foreground">AISION Creative Systems</span>.
        </p>
      </PlannerCard>
    </>
  );
}

function StyleCard({
  label,
  description,
  example,
  active,
  isDefault,
  onClick,
}: {
  id: string;
  label: string;
  description: string;
  example: string;
  active: boolean;
  isDefault: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col gap-2 rounded-2xl border p-4 text-left transition-colors",
        active ? "border-primary bg-brand-soft" : "hover:bg-muted/60",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="font-display text-base font-medium">{label}</p>
        <div className="flex items-center gap-2">
          {isDefault && (
            <span className="rounded-full border bg-surface-elevated px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              Default
            </span>
          )}
          {active && <Check className="h-4 w-4 text-primary" />}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
      <p className="mt-1 text-sm italic text-foreground/80">{example}</p>
    </button>
  );
}
