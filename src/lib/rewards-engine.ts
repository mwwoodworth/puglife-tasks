import { AchievementDef, LevelDef, LollieOutfitDef, RewardsState } from "./types";

// ── Levels ──
export const LEVELS: LevelDef[] = [
  { level: 1, name: "Puppy", icon: "PawPrint", treatsRequired: 0 },
  { level: 2, name: "Good Girl", icon: "Star", treatsRequired: 50 },
  { level: 3, name: "Snuggle Bug", icon: "Star", treatsRequired: 150 },
  { level: 4, name: "Treat Monster", icon: "Drumstick", treatsRequired: 300 },
  { level: 5, name: "Zoomie Queen", icon: "Wind", treatsRequired: 500 },
  { level: 6, name: "Couch Potato Pro", icon: "Sofa", treatsRequired: 800 },
  { level: 7, name: "Nap Champion", icon: "Star", treatsRequired: 1200 },
  { level: 8, name: "Royal Pugness", icon: "Star", treatsRequired: 1800 },
  { level: 9, name: "Lollie's BFF", icon: "Heart", treatsRequired: 2500 },
  { level: 10, name: "Ultimate Pug Mom", icon: "Trophy", treatsRequired: 4000 },
];

// ── Treat Values ──
export const TREAT_VALUES = {
  resetTask: 1,
  resetSectionComplete: 3,
  morningResetComplete: 5,
  dailyWinCheck: 5,
  fullDayComplete: 20,
  waterDrink: 1,
  waterGoalHit: 5,
  moodLog: 2,
  weightLog: 3,
  streakDay: 2,
  badDaySurvived: 10,
  customTaskComplete: 1,
  encouragementFavorite: 1,
};

// ── Achievements ──
export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first-reset", name: "First Reset", description: "Complete your first reset section", icon: "Star", condition: "Complete 1 reset section" },
  { id: "full-day", name: "Full Day", description: "Complete every reset in a single day", icon: "Star", condition: "Complete all daily sections" },
  { id: "streak-3", name: "3-Day Streak", description: "Use the app 3 days in a row", icon: "Star", condition: "3-day streak" },
  { id: "streak-7", name: "Week Warrior", description: "7-day streak!", icon: "Star", condition: "7-day streak" },
  { id: "streak-14", name: "Two Week Queen", description: "14 days strong!", icon: "Star", condition: "14-day streak" },
  { id: "streak-30", name: "Monthly Master", description: "30-day streak. Incredible!", icon: "Trophy", condition: "30-day streak" },
  { id: "hydration-hero", name: "Hydration Hero", description: "Hit your water goal", icon: "Droplet", condition: "Hit water goal once" },
  { id: "hydration-week", name: "Water Week", description: "Hit water goal 7 days", icon: "Star", condition: "7 days of water goals" },
  { id: "bad-day-survivor", name: "Bad Day Survivor", description: "Completed the survival plan", icon: "Star", condition: "Finish bad day plan" },
  { id: "early-bird", name: "Early Bird", description: "Complete morning reset before 8am", icon: "Star", condition: "Morning reset by 8am" },
  { id: "night-owl", name: "Night Owl Reset", description: "Complete evening reset after 9pm", icon: "Star", condition: "Evening reset after 9pm" },
  { id: "mood-tracker", name: "Mood Maven", description: "Log your mood 7 days in a row", icon: "Star", condition: "7 mood logs" },
  { id: "treat-100", name: "Treat Hoarder", description: "Earn 100 treats total", icon: "Drumstick", condition: "100 total treats" },
  { id: "treat-500", name: "Treat Tycoon", description: "Earn 500 treats total", icon: "Gem", condition: "500 total treats" },
  { id: "level-5", name: "Halfway There", description: "Reach level 5", icon: "Star", condition: "Reach Zoomie Queen" },
];

// ── Outfits ──
export const OUTFITS: LollieOutfitDef[] = [
  { id: "crown", name: "Crown", icon: "Star", treatsRequired: 100 },
  { id: "sunglasses", name: "Sunglasses", icon: "Star", treatsRequired: 75 },
  { id: "party-hat", name: "Party Hat", icon: "PartyPopper", treatsRequired: 50 },
  { id: "cape", name: "Superhero Cape", icon: "Star", treatsRequired: 200 },
  { id: "bow-tie", name: "Bow Tie", icon: "Star", treatsRequired: 60 },
  { id: "flower-crown", name: "Flower Crown", icon: "Star", treatsRequired: 150 },
  { id: "pajamas", name: "Cozy Pajamas", icon: "Star", treatsRequired: 120 },
];

// ── Engine Functions ──

export function getLevelForTreats(totalTreats: number): LevelDef {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (totalTreats >= level.treatsRequired) {
      current = level;
    } else {
      break;
    }
  }
  return current;
}

export function getNextLevel(currentLevel: number): LevelDef | null {
  const idx = LEVELS.findIndex((l) => l.level === currentLevel);
  return idx >= 0 && idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function getLevelProgress(totalTreats: number): {
  currentLevel: LevelDef;
  nextLevel: LevelDef | null;
  progressPercent: number;
  treatsToNext: number;
} {
  const currentLevel = getLevelForTreats(totalTreats);
  const nextLevel = getNextLevel(currentLevel.level);
  if (!nextLevel) {
    return { currentLevel, nextLevel: null, progressPercent: 100, treatsToNext: 0 };
  }
  const rangeStart = currentLevel.treatsRequired;
  const rangeEnd = nextLevel.treatsRequired;
  const progress = totalTreats - rangeStart;
  const range = rangeEnd - rangeStart;
  return {
    currentLevel,
    nextLevel,
    progressPercent: Math.min(100, Math.round((progress / range) * 100)),
    treatsToNext: rangeEnd - totalTreats,
  };
}

export function getAvailableOutfits(totalTreats: number): LollieOutfitDef[] {
  return OUTFITS.filter((o) => totalTreats >= o.treatsRequired);
}

export function checkNewAchievements(
  state: RewardsState,
  context: {
    streakDays: number;
    waterGoalDays: number;
    moodLogDays: number;
    fullDaysCompleted: number;
    resetSectionsCompleted: number;
    badDaysSurvived: number;
    earlyMorningResets: number;
    lateEveningResets: number;
  }
): string[] {
  const newAchievements: string[] = [];
  const has = (id: string) => state.achievements.includes(id);

  if (!has("first-reset") && context.resetSectionsCompleted >= 1) newAchievements.push("first-reset");
  if (!has("full-day") && context.fullDaysCompleted >= 1) newAchievements.push("full-day");
  if (!has("streak-3") && context.streakDays >= 3) newAchievements.push("streak-3");
  if (!has("streak-7") && context.streakDays >= 7) newAchievements.push("streak-7");
  if (!has("streak-14") && context.streakDays >= 14) newAchievements.push("streak-14");
  if (!has("streak-30") && context.streakDays >= 30) newAchievements.push("streak-30");
  if (!has("hydration-hero") && context.waterGoalDays >= 1) newAchievements.push("hydration-hero");
  if (!has("hydration-week") && context.waterGoalDays >= 7) newAchievements.push("hydration-week");
  if (!has("bad-day-survivor") && context.badDaysSurvived >= 1) newAchievements.push("bad-day-survivor");
  if (!has("early-bird") && context.earlyMorningResets >= 1) newAchievements.push("early-bird");
  if (!has("night-owl") && context.lateEveningResets >= 1) newAchievements.push("night-owl");
  if (!has("mood-tracker") && context.moodLogDays >= 7) newAchievements.push("mood-tracker");
  if (!has("treat-100") && state.totalTreatsEarned >= 100) newAchievements.push("treat-100");
  if (!has("treat-500") && state.totalTreatsEarned >= 500) newAchievements.push("treat-500");
  if (!has("level-5") && state.level >= 5) newAchievements.push("level-5");

  return newAchievements;
}

export function createDefaultRewardsState(): RewardsState {
  return {
    treats: 0,
    totalTreatsEarned: 0,
    level: 1,
    achievements: [],
    equippedOutfit: null,
    unlockedOutfits: [],
  };
}
