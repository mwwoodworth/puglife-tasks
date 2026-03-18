import { Task, WeightEntry, WeightGoalData, WeightMilestone, StreakData, AppTab } from "./types";

const TASKS_KEY = "puglife-tasks";
const STREAK_KEY = "puglife-streak";
const STREAK_DATA_KEY = "puglife-streak-data";
const LAST_ACTIVE_KEY = "puglife-last-active";
const WEIGHT_ENTRIES_KEY = "puglife-weight-entries";
const WEIGHT_GOAL_KEY = "puglife-weight-goal";
const WEIGHT_MILESTONES_KEY = "puglife-weight-milestones";
const SOUND_MUTED_KEY = "puglife-sound-muted";
const ACTIVE_TAB_KEY = "puglife-active-tab";

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

// Tasks
export function loadTasks(): Task[] { return safeGet(TASKS_KEY, []); }
export function saveTasks(tasks: Task[]) { safeSet(TASKS_KEY, tasks); }

// Streak
export function getStreak(): StreakData {
  const data = safeGet<StreakData | null>(STREAK_DATA_KEY, null);
  if (data) return data;
  // Migrate from old format
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

// Weight entries
export function loadWeightEntries(): WeightEntry[] { return safeGet(WEIGHT_ENTRIES_KEY, []); }
export function saveWeightEntries(entries: WeightEntry[]) { safeSet(WEIGHT_ENTRIES_KEY, entries); }

// Weight goal
export function loadWeightGoal(): WeightGoalData | null { return safeGet(WEIGHT_GOAL_KEY, null); }
export function saveWeightGoal(goal: WeightGoalData) { safeSet(WEIGHT_GOAL_KEY, goal); }

// Weight milestones
export function loadWeightMilestones(): WeightMilestone[] { return safeGet(WEIGHT_MILESTONES_KEY, []); }
export function saveWeightMilestones(milestones: WeightMilestone[]) { safeSet(WEIGHT_MILESTONES_KEY, milestones); }

// Sound mute
export function loadSoundMuted(): boolean { return safeGet(SOUND_MUTED_KEY, false); }
export function saveSoundMuted(muted: boolean) { safeSet(SOUND_MUTED_KEY, muted); }

// Active tab
export function loadActiveTab(): AppTab { return safeGet(ACTIVE_TAB_KEY, "tasks" as AppTab); }
export function saveActiveTab(tab: AppTab) { safeSet(ACTIVE_TAB_KEY, tab); }
