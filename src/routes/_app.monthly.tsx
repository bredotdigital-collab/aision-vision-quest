import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocalState } from "@/lib/storage";

export const Route = createFileRoute("/_app/monthly")({
  head: () => ({
    meta: [
      { title: "Monthly Planner · AISION" },
      { name: "description", content: "Monthly theme, focus, goals and reflection." },
    ],
  }),
  component: Monthly,
});

const TIPS = [
  "Plan tomorrow tonight — momentum starts the night before.",
  "Single-task in 50-minute focus blocks; rest in 10.",
  "If a task takes under two minutes, do it now.",
  "Your environment is your operating system. Tidy it weekly.",
  "Done > perfect. Ship a draft, then refine.",
];

function monthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function Monthly() {
  const key = monthKey();
  const monthName = new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const [theme, setTheme] = useLocalState(`aision:monthly:${key}:theme`, "");
  const [focus, setFocus] = useLocalState(`aision:monthly:${key}:focus`, "");
  const [goals, setGoals] = useLocalState<string[]>(`aision:monthly:${key}:goals`, ["", "", "", ""]);
  const [reflection, setReflection] = useLocalState(`aision:monthly:${key}:reflection`, "");

  const seed = new Date().getMonth();
  const tip1 = TIPS[seed % TIPS.length];
  const tip2 = TIPS[(seed + 2) % TIPS.length];

  return (
    <>
      <PageHeader eyebrow="This month" title={monthName} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Monthly theme" eyebrow="One word or phrase">
          <Input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g. Quiet mastery"
            className="text-lg"
          />
        </Card>
        <Card title="Monthly focus" eyebrow="The one thing">
          <Input
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            placeholder="What deserves your full attention?"
            className="text-lg"
          />
        </Card>
      </div>

      <Card title="Monthly goals" className="mt-6">
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

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="Monthly reflection" className="lg:col-span-2">
          <Textarea
            rows={8}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="What stood out? What would I repeat? What would I change?"
          />
        </Card>
        <div className="space-y-4">
          <Tip n={1} text={tip1} />
          <Tip n={2} text={tip2} />
        </div>
      </div>
    </>
  );
}

function Tip({ n, text }: { n: number; text: string }) {
  return (
    <div className="rounded-2xl border bg-brand-soft p-5">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        Mindset tip {n}
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
