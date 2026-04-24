import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/aision/PageHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [moods, setMoods] = useLocalState<number[]>(
    "aision:tracking:mood",
    Array.from({ length: 14 }, () => 2 + Math.round(Math.random() * 2)),
  );
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

      <Card title="Goal tracker">
        <ul className="space-y-4">
          {goals.map((g, i) => {
            const pct = Math.min(100, Math.round((g.current / Math.max(1, g.target)) * 100));
            return (
              <li key={i}>
                <div className="mb-1 flex items-end justify-between gap-3">
                  <Input
                    value={g.name}
                    onChange={(e) =>
                      setGoals((prev) => {
                        const n = [...prev];
                        n[i] = { ...n[i], name: e.target.value };
                        return n;
                      })
                    }
                    className="border-0 bg-transparent text-base font-medium shadow-none focus-visible:ring-1"
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
                      className="w-24"
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
                      className="w-24"
                    />
                  </div>
                </div>
                <Progress value={pct} />
                <p className="mt-1 text-right text-xs text-muted-foreground">{pct}%</p>
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Habit streaks">
          <ul className="space-y-3">
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
                  className="w-20"
                />
                <span className="text-xs text-muted-foreground">days</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Mood trend" eyebrow="Last 14 days">
          <div className="flex h-32 items-end gap-1.5">
            {moods.map((m, i) => (
              <button
                key={i}
                onClick={() =>
                  setMoods((prev) => {
                    const n = [...prev];
                    n[i] = ((n[i] ?? 0) + 1) % 5;
                    return n;
                  })
                }
                className="flex-1 rounded-sm bg-primary/80 transition-all hover:bg-primary"
                style={{ height: `${20 + ((m ?? 0) / 4) * 80}%` }}
                aria-label={`Day ${i + 1} mood`}
              />
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Weight tracker">
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.1"
              value={draftWeight}
              onChange={(e) => setDraftWeight(e.target.value)}
              placeholder="Today’s weight"
              onKeyDown={(e) => e.key === "Enter" && addWeight()}
            />
            <button
              onClick={addWeight}
              className="rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              Log
            </button>
          </div>
          <ul className="mt-4 max-h-48 space-y-1 overflow-auto text-sm">
            {weights.length === 0 && (
              <li className="text-muted-foreground">No entries yet.</li>
            )}
            {[...weights].reverse().map((w, i) => (
              <li key={i} className="flex justify-between border-b py-1">
                <span className="text-muted-foreground">{w.date}</span>
                <span className="font-medium">{w.value}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Wellness progress">
          <Textarea
            rows={8}
            value={wellness}
            onChange={(e) => setWellness(e.target.value)}
            placeholder="Sleep, energy, stress, body — what are you noticing?"
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
