import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { PlannerCard } from "@/components/aision/PlannerCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatDateKey, getSavedMood, useLocalState } from "@/lib/storage";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/tracking")({
  head: () => ({
    meta: [
      { title: "Tracking · AISION" },
      { name: "description", content: "Goals, habits, mood, weight and wellness tracking." },
    ],
  }),
  component: Tracking,
});

type Goal = { name: string; current: number; target: number };
type Weight = { date: string; value: number };

function Tracking() {
  const [goals, setGoals] = useLocalState<Goal[]>("aision:tracking:goals", [
    { name: "Read 24 books", current: 0, target: 24 },
    { name: "Save €10,000", current: 0, target: 10000 },
    { name: "Run 500 km", current: 0, target: 500 },
  ]);
  const [habits, setHabits] = useLocalState<{ name: string; streak: number }[]>(
    "aision:tracking:habits",
    [
      { name: "Morning meditation", streak: 0 },
      { name: "Daily reading", streak: 0 },
      { name: "Movement", streak: 0 },
    ],
  );
  const [moodHistory, setMoodHistory] = useState<{ date: string; label: string; value: number | null }[]>([]);
  useEffect(() => {
    const today = new Date();
    const arr: { date: string; label: string; value: number | null }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const key = formatDateKey(d);
      arr.push({
        date: key,
        label: d.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1),
        value: getSavedMood(key),
      });
    }
    setMoodHistory(arr);
  }, []);
  const moodAvg = (() => {
    const vals = moodHistory.map((m) => m.value).filter((v): v is number => v != null);
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  })();
  const moodLoggedDays = moodHistory.filter((m) => m.value != null).length;
  const [weights, setWeights] = useLocalState<Weight[]>("aision:tracking:weights", []);
  const [draftWeight, setDraftWeight] = useLocalState("aision:tracking:weightDraft", "");
  const [wellness, setWellness] = useLocalState("aision:tracking:wellness", "");

  const addWeight = () => {
    const v = parseFloat(draftWeight);
    if (Number.isNaN(v)) return;
    const date = new Date().toISOString().slice(0, 10);
    setWeights((prev) => [...prev, { date, value: v }].slice(-30));
    setDraftWeight("");
  };

  return (
    <>
      <PageHeader eyebrow="Progress" title="Tracking" description="Your year, made visible." />

      <PlannerCard title="Goal tracker" eyebrow="Long-term progress">
        <ul className="space-y-5">
          {goals.map((g, i) => {
            const pct = Math.min(100, Math.round((g.current / Math.max(1, g.target)) * 100));
            return (
              <li key={i}>
                <div className="mb-2 flex items-end justify-between gap-3">
                  <Input
                    value={g.name}
                    onChange={(e) =>
                      setGoals((prev) => {
                        const n = [...prev];
                        n[i] = { ...n[i], name: e.target.value };
                        return n;
                      })
                    }
                    className="border-0 bg-transparent px-0 text-base font-medium shadow-none focus-visible:ring-1"
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={g.current}
                      onChange={(e) =>
                        setGoals((prev) => {
                          const n = [...prev];
                          n[i] = { ...n[i], current: Number(e.target.value) };
                          return n;
                        })
                      }
                      className="w-24 tabular-nums"
                    />
                    <span className="text-sm text-muted-foreground">/</span>
                    <Input
                      type="number"
                      value={g.target}
                      onChange={(e) =>
                        setGoals((prev) => {
                          const n = [...prev];
                          n[i] = { ...n[i], target: Number(e.target.value) };
                          return n;
                        })
                      }
                      className="w-24 tabular-nums"
                    />
                  </div>
                </div>
                <Progress value={pct} />
                <p className="mt-1 text-right text-xs tabular-nums text-muted-foreground">{pct}%</p>
              </li>
            );
          })}
        </ul>
      </PlannerCard>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <PlannerCard title="Habit streaks" eyebrow="Consistency">
          <ul className="space-y-2.5">
            {habits.map((h, i) => (
              <li key={i} className="flex items-center gap-3">
                <Input
                  value={h.name}
                  onChange={(e) =>
                    setHabits((prev) => {
                      const n = [...prev];
                      n[i] = { ...n[i], name: e.target.value };
                      return n;
                    })
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={h.streak}
                  onChange={(e) =>
                    setHabits((prev) => {
                      const n = [...prev];
                      n[i] = { ...n[i], streak: Number(e.target.value) };
                      return n;
                    })
                  }
                  className="w-20 tabular-nums"
                />
                <span className="text-xs text-muted-foreground">days</span>
              </li>
            ))}
          </ul>
        </PlannerCard>

        <PlannerCard title="Mood trend" eyebrow="Last 14 days · from your daily entries">
          <div className="flex h-32 items-end gap-1.5">
            {moodHistory.map((m) => {
              const v = m.value;
              const isToday = m.date === formatDateKey(new Date());
              return (
                <div
                  key={m.date}
                  className="group/bar flex flex-1 flex-col items-center gap-1"
                  title={v != null ? `${m.date} · mood ${v + 1}/5` : `${m.date} · no entry`}
                >
                  <div className="relative flex h-24 w-full items-end">
                    {v != null ? (
                      <div
                        className={`w-full rounded-sm transition-all ${
                          isToday ? "bg-primary" : "bg-primary/70 group-hover/bar:bg-primary"
                        }`}
                        style={{ height: `${20 + (v / 4) * 80}%` }}
                      />
                    ) : (
                      <div className="h-1 w-full rounded-sm border border-dashed border-muted-foreground/30" />
                    )}
                  </div>
                  <span className="text-[9px] uppercase text-muted-foreground/60">{m.label}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{moodLoggedDays}/14 days logged</span>
            <span>
              {moodAvg != null ? `Avg ${moodAvg.toFixed(1)}/4` : "Log a mood on your daily page"}
            </span>
          </p>
        </PlannerCard>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <PlannerCard title="Weight tracker" eyebrow="Last 30 entries">
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.1"
              value={draftWeight}
              onChange={(e) => setDraftWeight(e.target.value)}
              placeholder="Today’s weight"
              onKeyDown={(e) => e.key === "Enter" && addWeight()}
            />
            <Button onClick={addWeight} className="px-5">
              Log
            </Button>
          </div>
          <ul className="mt-4 max-h-48 space-y-1 overflow-auto text-sm">
            {weights.length === 0 && (
              <li className="rounded-lg border border-dashed py-6 text-center text-muted-foreground">
                No entries yet.
              </li>
            )}
            {[...weights].reverse().map((w, i) => (
              <li key={i} className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground">{w.date}</span>
                <span className="font-medium tabular-nums">{w.value}</span>
              </li>
            ))}
          </ul>
        </PlannerCard>

        <PlannerCard title="Wellness progress" eyebrow="Notes">
          <Textarea
            rows={8}
            value={wellness}
            onChange={(e) => setWellness(e.target.value)}
            placeholder="Sleep, energy, stress, body — what are you noticing?"
            className="resize-none border-0 bg-surface/50 p-4 text-sm shadow-none focus-visible:ring-1"
          />
        </PlannerCard>
      </div>
    </>
  );
}
