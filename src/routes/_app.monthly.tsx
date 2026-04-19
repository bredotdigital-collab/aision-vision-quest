import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { Textarea } from "@/components/ui/textarea";
import { useLocalState } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { getMonth } from "@/lib/months";

export const Route = createFileRoute("/_app/monthly")({
  head: () => ({
    meta: [
      { title: "Monthly Planner · AISION" },
      { name: "description", content: "Monthly theme, focus, goals and reflection." },
    ],
  }),
  component: Monthly,
});

function monthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function Monthly() {
  const key = monthKey();
  const month = getMonth();
  const monthName = new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const [goals, setGoals] = useLocalState<string[]>(`aision:monthly:${key}:goals`, [
    "",
    "",
    "",
    "",
  ]);
  const [reflection, setReflection] = useLocalState(`aision:monthly:${key}:reflection`, "");
  const [promptA, setPromptA] = useLocalState(`aision:monthly:${key}:promptA`, "");
  const [promptB, setPromptB] = useLocalState(`aision:monthly:${key}:promptB`, "");

  return (
    <>
      <PageHeader
        eyebrow={`${month.name} · ${month.theme}`}
        title={monthName}
        description="Your guided month at a glance."
      />

      {/* Theme + focus header */}
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
            defaultValue=""
            placeholder="Add your own word for the month…"
            className="mt-2 border-0 bg-transparent text-lg shadow-none focus-visible:ring-1"
          />
        </div>
      </section>

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
