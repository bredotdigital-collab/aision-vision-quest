import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { PlannerCard } from "@/components/aision/PlannerCard";
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

  const month = getMonth();
  return (
    <>
      <PageHeader
        eyebrow={`${month.name} · ${month.theme}`}
        title="Weekly planner"
        description={`Week ${key.split("-W")[1]} · ${new Date().getFullYear()}`}
      />
      <MonthThemeBanner />

      <div className="grid gap-5 lg:grid-cols-2">
        <PlannerCard title="Weekly priorities" eyebrow="Move the needle">
          <div className="space-y-2.5">
            {priorities.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl border border-transparent bg-surface/50 px-4 py-2 transition-colors focus-within:border-border focus-within:bg-surface"
              >
                <span className="font-display text-sm tabular-nums text-muted-foreground">
                  0{i + 1}
                </span>
                <Input
                  value={p}
                  placeholder={`Priority ${i + 1}`}
                  onChange={(e) =>
                    setPriorities((prev) => {
                      const n = [...prev];
                      n[i] = e.target.value;
                      return n;
                    })
                  }
                  className="border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                />
              </div>
            ))}
          </div>
        </PlannerCard>

        <PlannerCard title="Weekly goals" eyebrow="What to ship">
          <div className="space-y-2.5">
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
        </PlannerCard>
      </div>

      <PlannerCard title="Habit tracker" eyebrow="Up to 7 habits" className="mt-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Habit</th>
                {DAYS.map((d) => (
                  <th key={d} className="px-2 py-2 text-center font-medium">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((h, i) => (
                <tr key={i} className="border-t border-border/50">
                  <td className="py-1.5 pr-4">
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
                      className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-1"
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
      </PlannerCard>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <PlannerCard title="Weekly reflection" eyebrow="Look back">
          <Textarea
            rows={6}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="What worked? What didn’t? What did I learn?"
            className="resize-none border-0 bg-surface/50 p-4 text-sm shadow-none focus-visible:ring-1"
          />
        </PlannerCard>
        <PlannerCard title="Weekly reset" eyebrow="Move forward">
          <Textarea
            rows={6}
            value={reset}
            onChange={(e) => setReset(e.target.value)}
            placeholder="What am I letting go of? What am I bringing into next week?"
            className="resize-none border-0 bg-surface/50 p-4 text-sm shadow-none focus-visible:ring-1"
          />
        </PlannerCard>
      </div>
    </>
  );
}
