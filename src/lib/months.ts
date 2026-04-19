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
      "I give myself permission to begin again, gently.",
      "Clarity comes when I stop rushing.",
      "I trust the quiet space I’m creating.",
      "I am allowed to want a softer, simpler life.",
      "What is mine will find me in stillness.",
    ],
    action: [
      "I clear the noise and choose what matters.",
      "Today I take one decisive step toward clarity.",
      "I design my day on purpose.",
      "I cut what no longer serves me.",
      "I act on my priorities before anything else.",
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
      "Small steady steps are reshaping my life.",
      "I am becoming the person who shows up.",
      "Consistency is my form of self-love.",
      "I trust the slow, beautiful unfolding.",
      "Every small repetition is enough.",
    ],
    action: [
      "I show up today, no excuses.",
      "I do the work whether I feel like it or not.",
      "I am building proof through repetition.",
      "I keep the promise I made to myself.",
      "Discipline today, freedom tomorrow.",
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
      "Energy is gathering in me, gently.",
      "I trust the pull of my own progress.",
      "I am moving, even when it’s quiet.",
      "Momentum is mine to keep.",
      "Each small win is shaping my path.",
    ],
    action: [
      "I take the first step and the rest will follow.",
      "I build momentum with one decisive action.",
      "I stack wins and keep moving.",
      "Today I out-execute yesterday.",
      "I create motion. Motion creates results.",
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
      "I am allowed to grow at my own pace.",
      "I welcome the discomfort of becoming.",
      "Every season of growth is shaping me.",
      "I expand into who I am becoming.",
      "I bloom in my own time.",
    ],
    action: [
      "I lean into the edge of my comfort zone.",
      "I choose growth over ease.",
      "I take action on what scares me a little.",
      "I learn fast and apply faster.",
      "Today I become 1% better.",
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
      "I am allowed to rest and still be enough.",
      "Balance is something I return to, again and again.",
      "I honour my body’s wisdom.",
      "Stillness is part of my strength.",
      "I create space for ease.",
    ],
    action: [
      "I protect my energy on purpose.",
      "I work hard and recover harder.",
      "I choose what gets my best hours.",
      "I set the boundary the day requires.",
      "I balance effort with intentional rest.",
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
      "Discipline is how I keep promises to myself.",
      "I choose long-term peace over short-term ease.",
      "My word to myself matters most.",
      "Quiet discipline is reshaping my life.",
      "I am the kind of person who follows through.",
    ],
    action: [
      "I do what I said I would do.",
      "I choose the harder right over the easier wrong.",
      "I show up before I feel ready.",
      "Discipline beats motivation today.",
      "I execute on the plan.",
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
      "I trust the version of me I am becoming.",
      "I am allowed to take up space.",
      "My presence is enough.",
      "I belong in every room I walk into.",
      "Quiet confidence is mine.",
    ],
    action: [
      "I bet on myself today.",
      "I speak up with calm conviction.",
      "I take the meeting, the call, the chance.",
      "I move like someone who knows their worth.",
      "I lead with confidence.",
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
      "My life is mine to shape.",
      "I gently take back my power.",
      "I am the author of this chapter.",
      "Ownership feels grounding, not heavy.",
      "I trust myself to lead my own life.",
    ],
    action: [
      "I own my outcomes, fully.",
      "I stop waiting and start deciding.",
      "I take responsibility for my time.",
      "I lead myself first.",
      "If it’s to be, it’s up to me.",
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
      "I do one thing at a time, with care.",
      "My attention is sacred.",
      "I am present where I am.",
      "Focus is a kindness I give myself.",
      "Quiet attention is my superpower.",
    ],
    action: [
      "I commit fully to one thing at a time.",
      "I protect my deep work hours.",
      "I close the tabs and start.",
      "I finish before I start something new.",
      "Today, focus wins.",
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
      "I have survived every hard day so far.",
      "I bend, I do not break.",
      "My softness is not weakness.",
      "I am allowed to begin again, today.",
      "I trust my ability to weather this.",
    ],
    action: [
      "I keep going when it gets hard.",
      "I take the next small step, no matter what.",
      "I respond instead of react.",
      "I rebuild, faster every time.",
      "I am stronger than today’s obstacle.",
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
      "There is so much already good in my life.",
      "I notice the small, beautiful things.",
      "Gratitude softens me.",
      "I am held by more than I realise.",
      "Today is full of quiet gifts.",
    ],
    action: [
      "I name what is going right and build on it.",
      "I tell people what they mean to me.",
      "I lead with appreciation today.",
      "I act from abundance, not scarcity.",
      "I turn gratitude into generosity.",
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
      "I honour how far I’ve come.",
      "I am allowed to feel proud.",
      "Every chapter has shaped me.",
      "I close the year with grace.",
      "I trust what comes next.",
    ],
    action: [
      "I review honestly and plan boldly.",
      "I extract the lessons and move.",
      "I close loops before the year ends.",
      "I design the next chapter on purpose.",
      "I finish strong.",
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
