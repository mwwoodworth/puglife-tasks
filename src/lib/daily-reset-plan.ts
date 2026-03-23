import { ResetSectionDef, ResetTaskDef, ResetSectionId } from "./types";

// ── Danielle's Daily Reset Plan ──
// Source: Danielle's Daily Reset Plan PDF
// These are preloaded — she never has to create them

export const RESET_SECTIONS: ResetSectionDef[] = [
  {
    id: "morning",
    title: "Morning Reset",
    icon: "Coffee",
    timeRange: "5-10 min",
    startHour: 6,
    tasks: [
      { id: "m1", label: "Drink something (chocolate milk / shake / coffee)", icon: "Coffee" },
      { id: "m2", label: "Start laundry OR unload dishwasher", icon: "Shirt" },
      { id: "m3", label: "Quick counter wipe OR pick up main area", icon: "Sparkles" },
    ],
  },
  {
    id: "midday",
    title: "Midday Reset",
    icon: "Sun",
    timeRange: "20-30 min",
    startHour: 11,
    tasks: [
      { id: "md1", label: "10-minute tidy (set a timer!)", icon: "Timer" },
      { id: "md2", label: "Switch / start laundry", icon: "Shirt" },
      { id: "md3", label: "Eat something (shake or easy lunch)", icon: "Utensils" },
    ],
  },
  {
    id: "pre-dinner",
    title: "Pre-Dinner Reset",
    icon: "Sunset",
    timeRange: "10-15 min",
    startHour: 15,
    tasks: [
      { id: "pd1", label: "Clear kitchen space", icon: "CookingPot" },
      { id: "pd2", label: "Quick living room pickup", icon: "Sofa" },
      { id: "pd3", label: "Decide dinner (follow weekly plan)", icon: "ClipboardCheck" },
    ],
  },
  {
    id: "dinner",
    title: "Dinner Flow",
    icon: "CookingPot",
    timeRange: "",
    startHour: 17,
    tasks: [
      { id: "d1", label: "Cook simple meal (not perfect!)", icon: "CookingPot" },
      { id: "d2", label: "Deconstruct for Aspen if needed", icon: "Baby" },
      { id: "d3", label: "Rinse / load dishes", icon: "Utensils" },
    ],
  },
  {
    id: "evening",
    title: "Evening Reset",
    icon: "Moon",
    timeRange: "10-15 min",
    startHour: 19,
    tasks: [
      { id: "e1", label: "Load / run dishwasher", icon: "Droplets" },
      { id: "e2", label: "Wipe counters", icon: "Sparkles" },
      { id: "e3", label: "Quick pickup (toys, clutter, blankets)", icon: "Sofa" },
    ],
  },
  {
    id: "daily-win",
    title: "Daily Win Check",
    icon: "Heart",
    timeRange: "",
    startHour: 20,
    tasks: [
      { id: "w1", label: "I fed myself", icon: "Heart" },
      { id: "w2", label: "I kept the house from getting worse", icon: "Heart" },
      { id: "w3", label: "I did enough", icon: "Heart" },
    ],
  },
];

// ── Bad Day Survival Plan ──
// Rule: Something > Nothing
export const BAD_DAY_TASKS: ResetTaskDef[] = [
  { id: "bd1", label: "Drink something (milk / shake / coffee)", icon: "Coffee" },
  { id: "bd2", label: "Eat: shake OR snack plate OR frozen meal", icon: "Pizza" },
  { id: "bd3", label: "Do a 5-minute reset (any one thing)", icon: "Timer" },
  { id: "bd4", label: "Easy dinner (pizza, nuggets, snack plate)", icon: "Drumstick" },
  { id: "bd5", label: "Evening: load dishwasher OR clear one surface", icon: "Droplets" },
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
export function getTodayFocus(): { area: string; icon: string } {
  const day = new Date().getDay();
  const focuses: Record<number, { area: string; icon: string }> = {
    0: { area: "Rest / Reset", icon: "Sofa" },
    1: { area: "Kitchen", icon: "CookingPot" },
    2: { area: "Living Room", icon: "Sofa" },
    3: { area: "Bathrooms", icon: "ShowerHead" },
    4: { area: "Bedrooms", icon: "Bed" },
    5: { area: "Catch-up", icon: "Sparkles" },
    6: { area: "Rest / Reset", icon: "Sofa" },
  };
  return focuses[day];
}
