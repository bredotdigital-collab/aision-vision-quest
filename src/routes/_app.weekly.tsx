import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocalState } from "@/lib/storage";
import { MonthThemeBanner } from "@/components/aision/MonthThemeBanner";
import { getMonth } from "@/lib/months";

export const Route = createFileRoute("/_app/weekly")({
  head: () => ({
    meta: [
      { title: "Weekly Planner · AISION" },
      { name: "description", content: "Weekly priorities, goals, habits and reflection." },
    ],
  }),
  component: Weekly,
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function weekKey() {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((+d - +onejan) / 86400000 + onejan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

function Weekly() {
  const key = weekKey();
  const [priorities, setPriorities] = useLocalState<string[]>(
    `aision:weekly:${key}:priorities`,
    ["", "", ""],
  );
  const [goals, setGoals] = useLocalState<string[]>(`aision:weekly:${key}:goals`, ["", "", ""]);
  const [habits, setHabits] = useLocalState<{ name: string; days: boolean[] }[]>(
    `aision:weekly:${key}:habits`,
    Array.from({ length: 7 }, () => ({ name: "", days: Array(7).fill(false) })),
  );
  const [reflection, setReflection] = useLocalState(`aision:weekly:${key}:reflection`, "");
  const [reset, setReset] = useLocalState(`aision:weekly:${key}:reset`, "");

  return (
    <>
      <PageHeader eyebrow="This week" title="Weekly planner" description={key} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Weekly priorities">
          {priorities.map((p, i) => (
            <Input
              key={i}
              value={p}
              placeholder={`Priority ${i + 1}`}
              className="mb-2"
              onChange={(e) =>
                setPriorities((prev) => {
                  const n = [...prev];
                  n[i] = e.target.value;
                  return n;
                })
              }
            />
          ))}
        </Card>

        <Card title="Weekly goals">
          {goals.map((g, i) => (
            <Input
              key={i}
              value={g}
              placeholder={`Goal ${i + 1}`}
              className="mb-2"
              onChange={(e) =>
                setGoals((prev) => {
                  const n = [...prev];
                  n[i] = e.target.value;
                  return n;
                })
              }
            />
          ))}
        </Card>
      </div>

      <Card title="Habit tracker" eyebrow="Up to 7 habits" className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-4 font-normal">Habit</th>
                {DAYS.map((d) => (
                  <th key={d} className="px-2 py-2 text-center font-normal">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((h, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 pr-4">
                    <Input
                      value={h.name}
                      placeholder={`Habit ${i + 1}`}
                      onChange={(e) =>
                        setHabits((prev) => {
                          const n = [...prev];
                          n[i] = { ...n[i], name: e.target.value };
                          return n;
                        })
                      }
                      className="border-0 bg-transparent shadow-none focus-visible:ring-1"
                    />
                  </td>
                  {DAYS.map((_, di) => (
                    <td key={di} className="px-2 py-2 text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={h.days[di]}
                          onCheckedChange={(v) =>
                            setHabits((prev) => {
                              const n = [...prev];
                              const days = [...n[i].days];
                              days[di] = Boolean(v);
                              n[i] = { ...n[i], days };
                              return n;
                            })
                          }
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Weekly reflection">
          <Textarea
            rows={6}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="What worked? What didn’t? What did I learn?"
          />
        </Card>
        <Card title="Weekly reset">
          <Textarea
            rows={6}
            value={reset}
            onChange={(e) => setReset(e.target.value)}
            placeholder="What am I letting go of? What am I bringing into next week?"
          />
        </Card>
      </div>
    </>
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
