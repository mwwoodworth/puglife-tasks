import {
  Task, WeightEntry, WeightGoalData, WeightMilestone, StreakData, AppTab,
  StepGoal, DailyResetState, WaterEntry, WaterDayData, MoodEntry,
  RewardsState, MoodLevel,
} from "./types";
import { createDefaultRewardsState } from "./rewards-engine";

// ── Keys ──
const TASKS_KEY = "puglife-tasks";
const STREAK_KEY = "puglife-streak";
const STREAK_DATA_KEY = "puglife-streak-data";
const LAST_ACTIVE_KEY = "puglife-last-active";
const WEIGHT_ENTRIES_KEY = "puglife-weight-entries";
const WEIGHT_GOAL_KEY = "puglife-weight-goal";
const WEIGHT_MILESTONES_KEY = "puglife-weight-milestones";
const SOUND_MUTED_KEY = "puglife-sound-muted";
const ACTIVE_TAB_KEY = "puglife-active-tab";
const STEP_GOAL_KEY = "puglife-step-goal";
const DAILY_RESET_KEY = "puglife-daily-reset-v2";
const WATER_DATA_KEY = "puglife-water-data";
const WATER_HISTORY_KEY = "puglife-water-history";
const MOOD_KEY = "puglife-mood";
const MOOD_HISTORY_KEY = "puglife-mood-history";
const REWARDS_KEY = "puglife-rewards";
const FAVORITES_KEY = "puglife-favorites";
const STATS_KEY = "puglife-stats";

// ── Helpers ──
function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Tasks ──
export function loadTasks(): Task[] { return safeGet(TASKS_KEY, []); }
export function saveTasks(tasks: Task[]) { safeSet(TASKS_KEY, tasks); }

// ── Streak ──
export function getStreak(): StreakData {
  const data = safeGet<StreakData | null>(STREAK_DATA_KEY, null);
  if (data) return data;
  const current = safeGet(STREAK_KEY, 0);
  const lastDate = typeof window !== "undefined" ? localStorage.getItem(LAST_ACTIVE_KEY) || "" : "";
  return { current, lastDate, longest: current, milestonesCelebrated: [] };
}

export function updateStreak(): StreakData {
  if (typeof window === "undefined") return { current: 0, lastDate: "", longest: 0, milestonesCelebrated: [] };
  const today = new Date().toISOString().split("T")[0];
  const data = getStreak();
  if (data.lastDate === today) return data;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const newCurrent = data.lastDate === yesterday ? data.current + 1 : 1;
  const updated: StreakData = {
    current: newCurrent,
    lastDate: today,
    longest: Math.max(data.longest, newCurrent),
    milestonesCelebrated: data.milestonesCelebrated,
  };
  safeSet(STREAK_DATA_KEY, updated);
  return updated;
}

export function saveStreak(data: StreakData) { safeSet(STREAK_DATA_KEY, data); }

// ── Weight ──
export function loadWeightEntries(): WeightEntry[] { return safeGet(WEIGHT_ENTRIES_KEY, []); }
export function saveWeightEntries(entries: WeightEntry[]) { safeSet(WEIGHT_ENTRIES_KEY, entries); }
export function loadWeightGoal(): WeightGoalData | null { return safeGet(WEIGHT_GOAL_KEY, null); }
export function saveWeightGoal(goal: WeightGoalData) { safeSet(WEIGHT_GOAL_KEY, goal); }
export function loadWeightMilestones(): WeightMilestone[] { return safeGet(WEIGHT_MILESTONES_KEY, []); }
export function saveWeightMilestones(milestones: WeightMilestone[]) { safeSet(WEIGHT_MILESTONES_KEY, milestones); }

// ── Sound ──
export function loadSoundMuted(): boolean { return safeGet(SOUND_MUTED_KEY, false); }
export function saveSoundMuted(muted: boolean) { safeSet(SOUND_MUTED_KEY, muted); }

// ── Active Tab ──
export function loadActiveTab(): AppTab { return safeGet(ACTIVE_TAB_KEY, "dashboard" as AppTab); }
export function saveActiveTab(tab: AppTab) { safeSet(ACTIVE_TAB_KEY, tab); }

// ── Step Goals (legacy) ──
export function loadStepGoal(): StepGoal {
  const today = new Date().toISOString().split("T")[0];
  const data = safeGet<StepGoal | null>(STEP_GOAL_KEY, null);
  if (data) {
    if (data.date !== today) {
      const history = [...data.history, { date: data.date, steps: data.currentSteps }].slice(-30);
      return { ...data, currentSteps: 0, date: today, history };
    }
    return data;
  }
  return { dailyTarget: 10000, currentSteps: 0, date: today, history: [] };
}
export function saveStepGoal(data: StepGoal) { safeSet(STEP_GOAL_KEY, data); }

// ── Daily Reset (v2 — preloaded from Danielle's plan) ──
export function loadDailyResetState(): DailyResetState {
  const today = new Date().toISOString().split("T")[0];
  const data = safeGet<DailyResetState | null>(DAILY_RESET_KEY, null);
  if (data && data.date === today) return data;
  // Auto-reset at midnight
  return { date: today, completedTasks: [], badDayMode: false, badDayCompletedTasks: [] };
}

export function saveDailyResetState(state: DailyResetState) {
  safeSet(DAILY_RESET_KEY, state);
}

// ── Water Tracking ──
export function loadWaterData(): WaterDayData {
  const today = new Date().toISOString().split("T")[0];
  const data = safeGet<WaterDayData | null>(WATER_DATA_KEY, null);
  if (data && data.date === today) return data;
  // Archive yesterday if exists
  if (data) {
    const history = safeGet<WaterDayData[]>(WATER_HISTORY_KEY, []);
    history.push(data);
    safeSet(WATER_HISTORY_KEY, history.slice(-30));
  }
  return { date: today, entries: [], goalOz: 64 }; // 64oz = 8 glasses
}

export function saveWaterData(data: WaterDayData) {
  safeSet(WATER_DATA_KEY, data);
}

export function loadWaterHistory(): WaterDayData[] {
  return safeGet(WATER_HISTORY_KEY, []);
}

// ── Mood Tracking ──
export function loadTodayMood(): MoodEntry | null {
  const today = new Date().toISOString().split("T")[0];
  const data = safeGet<MoodEntry | null>(MOOD_KEY, null);
  return data && data.date === today ? data : null;
}

export function saveTodayMood(mood: MoodLevel) {
  const today = new Date().toISOString().split("T")[0];
  const entry: MoodEntry = { date: today, mood, timestamp: new Date().toISOString() };
  safeSet(MOOD_KEY, entry);
  // Also add to history
  const history = safeGet<MoodEntry[]>(MOOD_HISTORY_KEY, []);
  const existingIdx = history.findIndex((e) => e.date === today);
  if (existingIdx >= 0) {
    history[existingIdx] = entry;
  } else {
    history.push(entry);
  }
  safeSet(MOOD_HISTORY_KEY, history.slice(-90)); // Keep 90 days
}

export function loadMoodHistory(): MoodEntry[] {
  return safeGet(MOOD_HISTORY_KEY, []);
}

// ── Rewards ──
export function loadRewards(): RewardsState {
  return safeGet(REWARDS_KEY, createDefaultRewardsState());
}

export function saveRewards(state: RewardsState) {
  safeSet(REWARDS_KEY, state);
}

// ── Encouragement Favorites ──
export function loadFavorites(): string[] {
  return safeGet(FAVORITES_KEY, []);
}

export function saveFavorites(favorites: string[]) {
  safeSet(FAVORITES_KEY, favorites);
}

// ── Cumulative Stats (for achievement tracking) ──
export interface CumulativeStats {
  fullDaysCompleted: number;
  resetSectionsCompleted: number;
  badDaysSurvived: number;
  earlyMorningResets: number;
  lateEveningResets: number;
  waterGoalDays: number;
  moodLogDays: number;
}

export function loadStats(): CumulativeStats {
  return safeGet(STATS_KEY, {
    fullDaysCompleted: 0,
    resetSectionsCompleted: 0,
    badDaysSurvived: 0,
    earlyMorningResets: 0,
    lateEveningResets: 0,
    waterGoalDays: 0,
    moodLogDays: 0,
  });
}

export function saveStats(stats: CumulativeStats) {
  safeSet(STATS_KEY, stats);
}
