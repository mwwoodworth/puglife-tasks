import { MoodLevel } from "./types";

// ── Lollie's Personality Engine ──
// Context-aware messages with priority queue and deduplication

type MessageContext = {
  timeOfDay: "morning" | "midday" | "afternoon" | "evening" | "late-night";
  mood?: MoodLevel;
  badDayMode: boolean;
  streakDays: number;
  tasksCompletedToday: number;
  totalTasksToday: number;
  waterCount: number;
  waterGoal: number;
  level: number;
};

// Shown IDs for dedup (resets daily)
const shownToday = new Set<string>();
let lastResetDate = "";

function resetIfNewDay() {
  const today = new Date().toISOString().split("T")[0];
  if (today !== lastResetDate) {
    shownToday.clear();
    lastResetDate = today;
  }
}

function pickUnshown(messages: { id: string; text: string }[]): string {
  resetIfNewDay();
  const available = messages.filter((m) => !shownToday.has(m.id));
  const pick = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : messages[Math.floor(Math.random() * messages.length)];
  shownToday.add(pick.id);
  return pick.text;
}

// ── Time-Based Greetings ──
const MORNING_GREETINGS = [
  { id: "mg1", text: "Good morning sunshine! Ready for our morning reset?" },
  { id: "mg2", text: "Rise and shine, Danielle! Lollie's already wagging!" },
  { id: "mg3", text: "A new day, a fresh start! Let's do this together!" },
  { id: "mg4", text: "Morning! Your coffee and morning reset await!" },
  { id: "mg5", text: "Lollie slept great and is ready to help you today!" },
  { id: "mg6", text: "Good morning beautiful! Small steps, big love." },
  { id: "mg7", text: "The sun is up and so is Lollie! Let's start easy." },
  { id: "mg8", text: "Hey Danielle! Your morning reset is only 5 minutes!" },
];

const MIDDAY_GREETINGS = [
  { id: "md1", text: "Halfway through the day! Time for a little tidy?" },
  { id: "md2", text: "Midday check-in! Have you eaten something?" },
  { id: "md3", text: "Lollie says: Quick tidy time! Set that timer!" },
  { id: "md4", text: "You're doing great today! Ready for a midday reset?" },
  { id: "md5", text: "Lollie's midday report: You're amazing. That is all." },
  { id: "md6", text: "Time for a 10-minute tidy! Lollie will supervise." },
];

const AFTERNOON_GREETINGS = [
  { id: "af1", text: "Almost dinner time! Let's get the kitchen ready!" },
  { id: "af2", text: "Pre-dinner reset time! You've got this, Danielle!" },
  { id: "af3", text: "Afternoon energy! Quick living room pickup?" },
  { id: "af4", text: "Lollie says: What's for dinner tonight?" },
  { id: "af5", text: "The afternoon stretch! Almost there!" },
];

const EVENING_GREETINGS = [
  { id: "ev1", text: "You did it today! Time to wind down." },
  { id: "ev2", text: "Evening reset = tomorrow's gift to yourself." },
  { id: "ev3", text: "Almost done for the day! Just a quick cleanup." },
  { id: "ev4", text: "Lollie says: One more reset and then it's couch time!" },
  { id: "ev5", text: "You showed up today. Lollie is so proud." },
  { id: "ev6", text: "Final reset! Then you can relax guilt-free." },
];

const LATE_NIGHT_GREETINGS = [
  { id: "ln1", text: "Still up? Lollie says it's snuggle time!" },
  { id: "ln2", text: "The day is done. You did enough. Rest now." },
  { id: "ln3", text: "Lollie is already snoring. Join her!" },
  { id: "ln4", text: "Goodnight, Danielle. Tomorrow is a fresh start." },
];

// ── Bad Day Messages (Extra Gentle) ──
const BAD_DAY_MESSAGES = [
  { id: "bd1", text: "You showed up. That's enough." },
  { id: "bd2", text: "Something > Nothing. Lollie is proud of you." },
  { id: "bd3", text: "Bad days happen. You're not behind." },
  { id: "bd4", text: "Just do one tiny thing. That's all." },
  { id: "bd5", text: "Lollie is right here with you. No judgment." },
  { id: "bd6", text: "You are doing your best, and that counts." },
  { id: "bd7", text: "It's okay to not be okay. Lollie loves you anyway." },
  { id: "bd8", text: "Rough day? Survival mode is still winning." },
  { id: "bd9", text: "Be gentle with yourself today. That's Lollie's order." },
  { id: "bd10", text: "Even on bad days, you matter. Always." },
  { id: "bd11", text: "Pizza for dinner is a valid life choice." },
  { id: "bd12", text: "You are not behind. You are right where you need to be." },
];

// ── Task Completion Messages ──
const TASK_COMPLETE_MESSAGES = [
  { id: "tc1", text: "Nice one! Lollie wags her tail!" },
  { id: "tc2", text: "Check! You're on a roll!" },
  { id: "tc3", text: "Done! That feels good, right?" },
  { id: "tc4", text: "Lollie approves! Keep going!" },
  { id: "tc5", text: "Another one down! You're crushing it!" },
  { id: "tc6", text: "Checked off! Lollie does a little dance!" },
];

const SECTION_COMPLETE_MESSAGES = [
  { id: "sc1", text: "Whole section done! Lollie is SO proud!" },
  { id: "sc2", text: "Section complete! Treat earned!" },
  { id: "sc3", text: "Amazing! That section is DONE!" },
  { id: "sc4", text: "You cleared that whole section! Queen energy!" },
];

const ALL_DONE_MESSAGES = [
  { id: "ad1", text: "EVERY. SINGLE. RESET. DONE! You're a legend!" },
  { id: "ad2", text: "Full day complete! Lollie is doing maximum zoomies!" },
  { id: "ad3", text: "100%! You absolutely crushed today!" },
  { id: "ad4", text: "All done! Now rest. You earned it!" },
];

// ── Streak Messages ──
const STREAK_MESSAGES: Record<number, string> = {
  3: "3 days! Lollie is impressed, Danielle!",
  7: "ONE WHOLE WEEK! Lollie says you're a legend!",
  14: "Two weeks strong! Lollie is doing zoomies!",
  30: "30 DAYS! Lollie crowns you queen!",
  60: "60 days! Lollie is crying happy tears!",
  100: "100 DAYS! ULTRA LOLLIE MODE ACTIVATED!",
  365: "A WHOLE YEAR! Lollie and Danielle are legends!",
};

// ── Water Messages ──
const WATER_MESSAGES = [
  { id: "w1", text: "Hydration queen! Lollie approves!" },
  { id: "w2", text: "Drink up! Your body thanks you!" },
  { id: "w3", text: "Lollie approves of that chocolate milk!" },
  { id: "w4", text: "Another one! Stay hydrated, beautiful!" },
  { id: "w5", text: "Sip sip! Lollie is drinking water too!" },
];

const WATER_GOAL_MESSAGES = [
  { id: "wg1", text: "WATER GOAL HIT! Lollie is so proud!" },
  { id: "wg2", text: "Hydration complete! You are glowing!" },
  { id: "wg3", text: "Water goal smashed! Your body loves you!" },
];

// ── Mood Response Messages ──
const MOOD_RESPONSES: Record<MoodLevel, { id: string; text: string }[]> = {
  5: [
    { id: "m5a", text: "AMAZING day energy! Lollie is vibrating with joy!" },
    { id: "m5b", text: "You're glowing today! Lollie can feel it!" },
  ],
  4: [
    { id: "m4a", text: "Good vibes! Lollie is happy you're happy!" },
    { id: "m4b", text: "A good day! Let's make it even better!" },
  ],
  3: [
    { id: "m3a", text: "An okay day is still a day. You've got this." },
    { id: "m3b", text: "Some days are just okay. And that's perfectly fine." },
  ],
  2: [
    { id: "m2a", text: "Rough day? Lollie is here for extra snuggles." },
    { id: "m2b", text: "It's okay to have rough days. Be extra gentle with yourself." },
  ],
  1: [
    { id: "m1a", text: "Bad days happen. Would you like to switch to the survival plan?" },
    { id: "m1b", text: "Lollie is right here. No pressure. No judgment." },
  ],
};

// ── Public API ──

export function getTimeOfDay(): MessageContext["timeOfDay"] {
  const h = new Date().getHours();
  if (h >= 6 && h < 11) return "morning";
  if (h >= 11 && h < 15) return "midday";
  if (h >= 15 && h < 19) return "afternoon";
  if (h >= 19 && h < 22) return "evening";
  return "late-night";
}

export function getGreeting(ctx: MessageContext): string {
  if (ctx.badDayMode) return pickUnshown(BAD_DAY_MESSAGES);

  const map = {
    morning: MORNING_GREETINGS,
    midday: MIDDAY_GREETINGS,
    afternoon: AFTERNOON_GREETINGS,
    evening: EVENING_GREETINGS,
    "late-night": LATE_NIGHT_GREETINGS,
  };
  return pickUnshown(map[ctx.timeOfDay]);
}

export function getTaskCompleteMessage(): string {
  return pickUnshown(TASK_COMPLETE_MESSAGES);
}

export function getSectionCompleteMessage(): string {
  return pickUnshown(SECTION_COMPLETE_MESSAGES);
}

export function getAllDoneMessage(): string {
  return pickUnshown(ALL_DONE_MESSAGES);
}

export function getBadDayMessage(): string {
  return pickUnshown(BAD_DAY_MESSAGES);
}

export function getWaterMessage(): string {
  return pickUnshown(WATER_MESSAGES);
}

export function getWaterGoalMessage(): string {
  return pickUnshown(WATER_GOAL_MESSAGES);
}

export function getMoodResponse(mood: MoodLevel): string {
  return pickUnshown(MOOD_RESPONSES[mood]);
}

export function getStreakMessage(days: number): string | null {
  return STREAK_MESSAGES[days] || null;
}

export function getDanielleName(): string {
  return "Danielle";
}

export function getTimeGreetingPrefix(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
