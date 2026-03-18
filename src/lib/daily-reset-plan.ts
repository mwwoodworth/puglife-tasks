import { ResetSectionDef, ResetTaskDef, ResetSectionId } from "./types";

// ── Danielle's Daily Reset Plan ──
// Source: Danielle's Daily Reset Plan PDF
// These are preloaded — she never has to create them

export const RESET_SECTIONS: ResetSectionDef[] = [
  {
    id: "morning",
    title: "Morning Reset",
    emoji: "🌅",
    timeRange: "5-10 min",
    startHour: 6,
    tasks: [
      { id: "m1", label: "Drink something (chocolate milk / shake / coffee)", emoji: "☕" },
      { id: "m2", label: "Start laundry OR unload dishwasher", emoji: "🧺" },
      { id: "m3", label: "Quick counter wipe OR pick up main area", emoji: "✨" },
    ],
  },
  {
    id: "midday",
    title: "Midday Reset",
    emoji: "☀️",
    timeRange: "20-30 min",
    startHour: 11,
    tasks: [
      { id: "md1", label: "10-minute tidy (set a timer!)", emoji: "⏱️" },
      { id: "md2", label: "Switch / start laundry", emoji: "🧺" },
      { id: "md3", label: "Eat something (shake or easy lunch)", emoji: "🍽️" },
    ],
  },
  {
    id: "pre-dinner",
    title: "Pre-Dinner Reset",
    emoji: "🌇",
    timeRange: "10-15 min",
    startHour: 15,
    tasks: [
      { id: "pd1", label: "Clear kitchen space", emoji: "🍳" },
      { id: "pd2", label: "Quick living room pickup", emoji: "🛋️" },
      { id: "pd3", label: "Decide dinner (follow weekly plan)", emoji: "📋" },
    ],
  },
  {
    id: "dinner",
    title: "Dinner Flow",
    emoji: "🍝",
    timeRange: "",
    startHour: 17,
    tasks: [
      { id: "d1", label: "Cook simple meal (not perfect!)", emoji: "👩‍🍳" },
      { id: "d2", label: "Deconstruct for Aspen if needed", emoji: "👶" },
      { id: "d3", label: "Rinse / load dishes", emoji: "🍽️" },
    ],
  },
  {
    id: "evening",
    title: "Evening Reset",
    emoji: "🌙",
    timeRange: "10-15 min",
    startHour: 19,
    tasks: [
      { id: "e1", label: "Load / run dishwasher", emoji: "🫧" },
      { id: "e2", label: "Wipe counters", emoji: "✨" },
      { id: "e3", label: "Quick pickup (toys, clutter, blankets)", emoji: "🧸" },
    ],
  },
  {
    id: "daily-win",
    title: "Daily Win Check",
    emoji: "🏆",
    timeRange: "",
    startHour: 20,
    tasks: [
      { id: "w1", label: "I fed myself", emoji: "💜" },
      { id: "w2", label: "I kept the house from getting worse", emoji: "💜" },
      { id: "w3", label: "I did enough", emoji: "💜" },
    ],
  },
];

// ── Bad Day Survival Plan ──
// Rule: Something > Nothing
export const BAD_DAY_TASKS: ResetTaskDef[] = [
  { id: "bd1", label: "Drink something (milk / shake / coffee)", emoji: "☕" },
  { id: "bd2", label: "Eat: shake OR snack plate OR frozen meal", emoji: "🍕" },
  { id: "bd3", label: "Do a 5-minute reset (any one thing)", emoji: "⏱️" },
  { id: "bd4", label: "Easy dinner (pizza, nuggets, snack plate)", emoji: "🍗" },
  { id: "bd5", label: "Evening: load dishwasher OR clear one surface", emoji: "🫧" },
];

export const BAD_DAY_MESSAGE = "You are not behind. You are doing your best — and that counts.";
export const BAD_DAY_RULE = "Something > Nothing";

// ── Time Logic ──

export function getCurrentResetSection(): ResetSectionDef | null {
  const hour = new Date().getHours();
  // Find the most recent section that has started
  const started = RESET_SECTIONS.filter((s) => hour >= s.startHour);
  return started.length > 0 ? started[started.length - 1] : null;
}

export function getVisibleSections(): ResetSectionDef[] {
  const hour = new Date().getHours();
  // Show all sections that have started (past + current)
  // Before 6am, show nothing (or previous evening)
  if (hour < 6) return [];
  return RESET_SECTIONS.filter((s) => hour >= s.startHour);
}

export function getAllSections(): ResetSectionDef[] {
  return RESET_SECTIONS;
}

export function getSectionProgress(
  sectionId: ResetSectionId,
  completedTasks: string[]
): { total: number; done: number; percent: number } {
  const section = RESET_SECTIONS.find((s) => s.id === sectionId);
  if (!section) return { total: 0, done: 0, percent: 0 };
  const total = section.tasks.length;
  const done = section.tasks.filter((t) => completedTasks.includes(t.id)).length;
  return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

export function getTotalDayProgress(completedTasks: string[]): {
  total: number;
  done: number;
  percent: number;
} {
  const allTasks = RESET_SECTIONS.flatMap((s) => s.tasks);
  const total = allTasks.length;
  const done = allTasks.filter((t) => completedTasks.includes(t.id)).length;
  return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

export function getBadDayProgress(completedTasks: string[]): {
  total: number;
  done: number;
  percent: number;
} {
  const total = BAD_DAY_TASKS.length;
  const done = BAD_DAY_TASKS.filter((t) => completedTasks.includes(t.id)).length;
  return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

// ── Weekly Focus ──
export function getTodayFocus(): { area: string; emoji: string } {
  const day = new Date().getDay();
  const focuses: Record<number, { area: string; emoji: string }> = {
    0: { area: "Rest / Reset", emoji: "🛋️" },
    1: { area: "Kitchen", emoji: "🍳" },
    2: { area: "Living Room", emoji: "🛋️" },
    3: { area: "Bathrooms", emoji: "🚿" },
    4: { area: "Bedrooms", emoji: "🛏️" },
    5: { area: "Catch-up", emoji: "✨" },
    6: { area: "Rest / Reset", emoji: "🛋️" },
  };
  return focuses[day];
}
