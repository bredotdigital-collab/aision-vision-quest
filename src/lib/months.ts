export type MonthContent = {
  index: number; // 0..11
  name: string;
  theme: string; // short theme name
  focus: string; // one short focus statement
  tips: [string, string];
  prompts: [string, string];
  reflective: string[]; // affirmations
  action: string[]; // affirmations
};

export const MONTHS: MonthContent[] = [
  {
    index: 0,
    name: "January",
    theme: "Reset & Clarity",
    focus: "Clear the noise so your real priorities can breathe.",
    tips: [
      "Write down everything on your mind, then circle the three things that actually matter.",
      "Choose one daily ritual to anchor your morning for the whole month.",
    ],
    prompts: [
      "What am I leaving behind from last year?",
      "What does a clear, calm life look like for me in 2026?",
    ],
    reflective: [
    "Sample reflective affirmation 1",
    "Sample reflective affirmation 2",
    "Sample reflective affirmation 3",
    "Sample reflective affirmation 4",
    "Sample reflective affirmation 5",
  ],
    action: [
    "Sample action affirmation 1",
    "Sample action affirmation 2",
    "Sample action affirmation 3",
    "Sample action affirmation 4",
    "Sample action affirmation 5",
  ],
  },
  {
    index: 1,
    name: "February",
    theme: "Consistency",
    focus: "Show up the same way on the days you don’t feel like it.",
    tips: [
      "Shrink your habits until they feel almost too easy — then never miss twice.",
      "Track one keystone habit every day; let it carry the rest.",
    ],
    prompts: [
      "Which habit, repeated daily, would change my life this year?",
      "Where am I quietly inconsistent — and why?",
    ],
    reflective: [
    "Sample reflective affirmation 1",
    "Sample reflective affirmation 2",
    "Sample reflective affirmation 3",
    "Sample reflective affirmation 4",
    "Sample reflective affirmation 5",
  ],
    action: [
    "Sample action affirmation 1",
    "Sample action affirmation 2",
    "Sample action affirmation 3",
    "Sample action affirmation 4",
    "Sample action affirmation 5",
  ],
  },
  {
    index: 2,
    name: "March",
    theme: "Momentum",
    focus: "Build a quiet streak of small wins that pull you forward.",
    tips: [
      "Stack a hard task right after an existing daily habit to ride the momentum.",
      "End each day by choosing tomorrow’s first action — start before motivation arrives.",
    ],
    prompts: [
      "Where is momentum already building in my life?",
      "What’s the smallest next step that would create lift today?",
    ],
    reflective: [
    "Sample reflective affirmation 1",
    "Sample reflective affirmation 2",
    "Sample reflective affirmation 3",
    "Sample reflective affirmation 4",
    "Sample reflective affirmation 5",
  ],
    action: [
    "Sample action affirmation 1",
    "Sample action affirmation 2",
    "Sample action affirmation 3",
    "Sample action affirmation 4",
    "Sample action affirmation 5",
  ],
  },
  {
    index: 3,
    name: "April",
    theme: "Growth",
    focus: "Lean into the edges where you stretch a little further.",
    tips: [
      "Pick one skill and dedicate 25 focused minutes a day to deliberate practice.",
      "Ask for one piece of honest feedback this month — and act on it.",
    ],
    prompts: [
      "Where am I being called to stretch right now?",
      "What would the next-level version of me do today?",
    ],
    reflective: [
    "Sample reflective affirmation 1",
    "Sample reflective affirmation 2",
    "Sample reflective affirmation 3",
    "Sample reflective affirmation 4",
    "Sample reflective affirmation 5",
  ],
    action: [
    "Sample action affirmation 1",
    "Sample action affirmation 2",
    "Sample action affirmation 3",
    "Sample action affirmation 4",
    "Sample action affirmation 5",
  ],
  },
  {
    index: 4,
    name: "May",
    theme: "Balance",
    focus: "Hold ambition and rest in the same hand.",
    tips: [
      "Schedule rest like you schedule meetings — non-negotiable, on the calendar.",
      "End your workday with a clear shutdown ritual to protect your evenings.",
    ],
    prompts: [
      "Where am I out of balance right now?",
      "What would feel restorative this week?",
    ],
    reflective: [
    "Sample reflective affirmation 1",
    "Sample reflective affirmation 2",
    "Sample reflective affirmation 3",
    "Sample reflective affirmation 4",
    "Sample reflective affirmation 5",
  ],
    action: [
    "Sample action affirmation 1",
    "Sample action affirmation 2",
    "Sample action affirmation 3",
    "Sample action affirmation 4",
    "Sample action affirmation 5",
  ],
  },
  {
    index: 5,
    name: "June",
    theme: "Discipline",
    focus: "Choose what matters over what feels good in the moment.",
    tips: [
      "Decide tonight what tomorrow’s first 90 minutes will look like.",
      "Remove one source of friction or distraction from your environment this week.",
    ],
    prompts: [
      "Where would more discipline give me more freedom?",
      "What am I tolerating that I shouldn’t be?",
    ],
    reflective: [
    "Sample reflective affirmation 1",
    "Sample reflective affirmation 2",
    "Sample reflective affirmation 3",
    "Sample reflective affirmation 4",
    "Sample reflective affirmation 5",
  ],
    action: [
    "Sample action affirmation 1",
    "Sample action affirmation 2",
    "Sample action affirmation 3",
    "Sample action affirmation 4",
    "Sample action affirmation 5",
  ],
  },
  {
    index: 6,
    name: "July",
    theme: "Confidence",
    focus: "Trust the version of you that has done the work.",
    tips: [
      "Keep a running ‘evidence file’ of wins, kind words, and proof of progress.",
      "Speak about yourself the way you’d speak about someone you love.",
    ],
    prompts: [
      "Where would I act differently if I fully trusted myself?",
      "What proof of progress am I overlooking?",
    ],
    reflective: [
    "Sample reflective affirmation 1",
    "Sample reflective affirmation 2",
    "Sample reflective affirmation 3",
    "Sample reflective affirmation 4",
    "Sample reflective affirmation 5",
  ],
    action: [
    "Sample action affirmation 1",
    "Sample action affirmation 2",
    "Sample action affirmation 3",
    "Sample action affirmation 4",
    "Sample action affirmation 5",
  ],
  },
  {
    index: 7,
    name: "August",
    theme: "Ownership",
    focus: "Take full responsibility for your time, focus and outcomes.",
    tips: [
      "Replace ‘I have to’ with ‘I choose to’ for every commitment this week.",
      "Audit your week: which 20% of activities created 80% of the results?",
    ],
    prompts: [
      "What am I waiting on someone else for that I could own?",
      "Where am I giving my power away?",
    ],
    reflective: [
    "Sample reflective affirmation 1",
    "Sample reflective affirmation 2",
    "Sample reflective affirmation 3",
    "Sample reflective affirmation 4",
    "Sample reflective affirmation 5",
  ],
    action: [
    "Sample action affirmation 1",
    "Sample action affirmation 2",
    "Sample action affirmation 3",
    "Sample action affirmation 4",
    "Sample action affirmation 5",
  ],
  },
  {
    index: 8,
    name: "September",
    theme: "Focus",
    focus: "Do less, but do it with your whole attention.",
    tips: [
      "Single-task in 50-minute blocks; rest in 10. Phone in another room.",
      "Each morning, choose one task that, if done, makes the day a success.",
    ],
    prompts: [
      "What deserves my undivided attention right now?",
      "What am I doing that I should stop?",
    ],
    reflective: [
    "Sample reflective affirmation 1",
    "Sample reflective affirmation 2",
    "Sample reflective affirmation 3",
    "Sample reflective affirmation 4",
    "Sample reflective affirmation 5",
  ],
    action: [
    "Sample action affirmation 1",
    "Sample action affirmation 2",
    "Sample action affirmation 3",
    "Sample action affirmation 4",
    "Sample action affirmation 5",
  ],
  },
  {
    index: 9,
    name: "October",
    theme: "Resilience",
    focus: "Bend, don’t break — and keep moving forward.",
    tips: [
      "When something goes sideways, ask: what’s the next smallest right step?",
      "Build a recovery routine you can rely on on hard days.",
    ],
    prompts: [
      "What has resilience taught me this year?",
      "Where can I be gentler with myself while still moving forward?",
    ],
    reflective: [
    "Sample reflective affirmation 1",
    "Sample reflective affirmation 2",
    "Sample reflective affirmation 3",
    "Sample reflective affirmation 4",
    "Sample reflective affirmation 5",
  ],
    action: [
    "Sample action affirmation 1",
    "Sample action affirmation 2",
    "Sample action affirmation 3",
    "Sample action affirmation 4",
    "Sample action affirmation 5",
  ],
  },
  {
    index: 10,
    name: "November",
    theme: "Gratitude",
    focus: "Notice, on purpose, what is already going right.",
    tips: [
      "Each evening, write three specific things you’re grateful for from the day.",
      "Send one short message of appreciation to someone every week.",
    ],
    prompts: [
      "What am I taking for granted that I would deeply miss?",
      "Who has shaped my year — and have I told them?",
    ],
    reflective: [
    "Sample reflective affirmation 1",
    "Sample reflective affirmation 2",
    "Sample reflective affirmation 3",
    "Sample reflective affirmation 4",
    "Sample reflective affirmation 5",
  ],
    action: [
    "Sample action affirmation 1",
    "Sample action affirmation 2",
    "Sample action affirmation 3",
    "Sample action affirmation 4",
    "Sample action affirmation 5",
  ],
  },
  {
    index: 11,
    name: "December",
    theme: "Reflection",
    focus: "Look back with honesty, forward with intention.",
    tips: [
      "Block 60 quiet minutes to review the year — wins, lessons, and what to repeat.",
      "Choose one word to carry into next year, and write what it means to you.",
    ],
    prompts: [
      "What am I most proud of from this year?",
      "What do I want more of — and less of — in the next?",
    ],
    reflective: [
    "Sample reflective affirmation 1",
    "Sample reflective affirmation 2",
    "Sample reflective affirmation 3",
    "Sample reflective affirmation 4",
    "Sample reflective affirmation 5",
  ],
    action: [
    "Sample action affirmation 1",
    "Sample action affirmation 2",
    "Sample action affirmation 3",
    "Sample action affirmation 4",
    "Sample action affirmation 5",
  ],
  },
];

export function getMonth(date = new Date()): MonthContent {
  return MONTHS[date.getMonth()];
}

export function getDailyAffirmation(
  style: "reflective" | "action",
  date = new Date(),
): string {
  const month = getMonth(date);
  const pool = style === "action" ? month.action : month.reflective;
  // rotate within month: deterministic per day-of-month
  const idx = (date.getDate() - 1) % pool.length;
  return pool[idx];
}
