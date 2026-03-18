import {
  Task, WeightEntry, WeightGoalData, WeightMilestone, StreakData, AppTab,
  StepGoal, DailyResetState, WaterEntry, WaterDayData, MoodEntry,
  RewardsState, MoodLevel, ChatMessage, DressUpState, DressUpSlot,
  AlcoholDayData, AlcoholEntry, NotificationPrefs,
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
const CHAT_HISTORY_KEY = "puglife-chat-history";
const DRESSUP_STATE_KEY = "puglife-dressup-state";
const ALCOHOL_DATA_KEY = "puglife-alcohol-data";
const ALCOHOL_HISTORY_KEY = "puglife-alcohol-history";
const NOTIFICATION_PREFS_KEY = "puglife-notification-prefs";

// ── Helpers ──
function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    const parsed = JSON.parse(data);
    // Basic type validation
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    if (fallback !== null && typeof fallback === "object" && !Array.isArray(fallback) && typeof parsed !== "object") return fallback;
    return parsed;
  } catch {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
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

// ── Chat History ──
export function loadChatHistory(): ChatMessage[] {
  return safeGet(CHAT_HISTORY_KEY, []);
}

export function saveChatHistory(messages: ChatMessage[]) {
  // Keep last 50 messages to prevent storage bloat
  safeSet(CHAT_HISTORY_KEY, messages.slice(-50));
}

// ── Dress-Up State ──
const DEFAULT_DRESSUP_STATE: DressUpState = {
  unlockedItems: [],
  equipped: { hat: null, glasses: null, outfit: null, accessory: null, background: null },
  savedLooks: [],
};

export function loadDressUpState(): DressUpState {
  return safeGet(DRESSUP_STATE_KEY, DEFAULT_DRESSUP_STATE);
}

export function saveDressUpState(state: DressUpState) {
  safeSet(DRESSUP_STATE_KEY, state);
}

// ── Alcohol Tracking ──
export function loadAlcoholData(): AlcoholDayData {
  const today = new Date().toISOString().split("T")[0];
  const data = safeGet<AlcoholDayData | null>(ALCOHOL_DATA_KEY, null);
  if (data && data.date === today) return data;
  // Archive yesterday if exists
  if (data) {
    const history = safeGet<AlcoholDayData[]>(ALCOHOL_HISTORY_KEY, []);
    history.push(data);
    safeSet(ALCOHOL_HISTORY_KEY, history.slice(-30));
  }
  return { date: today, entries: [] };
}

export function saveAlcoholData(data: AlcoholDayData) {
  safeSet(ALCOHOL_DATA_KEY, data);
}

export function loadAlcoholHistory(): AlcoholDayData[] {
  return safeGet(ALCOHOL_HISTORY_KEY, []);
}

// ── Notification Prefs ──
export function loadNotificationPrefs(): NotificationPrefs {
  return safeGet(NOTIFICATION_PREFS_KEY, { enabled: false, reminders: false, celebrations: false });
}

export function saveNotificationPrefs(prefs: NotificationPrefs) {
  safeSet(NOTIFICATION_PREFS_KEY, prefs);
}

// ── Data Migration (v4 → v5) ──
const MIGRATION_KEY = "puglife-v5-migrated";

// ── Data Export/Import ──
const EXPORT_VERSION = 1;
const ALL_STORAGE_KEYS = [
  TASKS_KEY, STREAK_DATA_KEY, WEIGHT_ENTRIES_KEY, WEIGHT_GOAL_KEY,
  WEIGHT_MILESTONES_KEY, SOUND_MUTED_KEY, ACTIVE_TAB_KEY, STEP_GOAL_KEY,
  DAILY_RESET_KEY, WATER_DATA_KEY, WATER_HISTORY_KEY, MOOD_KEY,
  MOOD_HISTORY_KEY, REWARDS_KEY, FAVORITES_KEY, STATS_KEY,
  CHAT_HISTORY_KEY, DRESSUP_STATE_KEY, ALCOHOL_DATA_KEY,
  ALCOHOL_HISTORY_KEY, NOTIFICATION_PREFS_KEY,
];

export interface ExportData {
  version: number;
  exportedAt: string;
  data: Record<string, unknown>;
}

export function exportAllData(): ExportData {
  const data: Record<string, unknown> = {};
  for (const key of ALL_STORAGE_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      try { data[key] = JSON.parse(raw); } catch { data[key] = raw; }
    }
  }
  return { version: EXPORT_VERSION, exportedAt: new Date().toISOString(), data };
}

export function importAllData(exported: ExportData): { success: boolean; error?: string } {
  if (!exported?.version || !exported?.data) {
    return { success: false, error: "Invalid backup file format" };
  }
  try {
    for (const [key, value] of Object.entries(exported.data)) {
      if (ALL_STORAGE_KEYS.includes(key)) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: `Import failed: ${e}` };
  }
}

export function getStorageUsage(): { usedBytes: number; percentFull: number } {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      total += key.length + (localStorage.getItem(key)?.length || 0);
    }
  }
  const limitBytes = 5 * 1024 * 1024;
  return { usedBytes: total * 2, percentFull: Math.round((total * 2 / limitBytes) * 100) };
}

// ── Data Migration (v4 → v5) ──
export function migrateV4ToV5() {
  if (typeof window === "undefined") return;
  if (safeGet(MIGRATION_KEY, false)) return;

  // Migrate old outfit system to new dress-up slots
  const rewards = loadRewards();
  const dressUp = loadDressUpState();

  const outfitMap: Record<string, { newId: string; slot: DressUpSlot }> = {
    crown: { newId: "hat-crown", slot: "hat" },
    sunglasses: { newId: "glasses-sun", slot: "glasses" },
    "party-hat": { newId: "hat-party", slot: "hat" },
    cape: { newId: "outfit-cape", slot: "outfit" },
    "bow-tie": { newId: "acc-bowtie", slot: "accessory" },
    "flower-crown": { newId: "hat-flower-crown", slot: "hat" },
    pajamas: { newId: "outfit-pajamas", slot: "outfit" },
  };

  for (const oldId of rewards.unlockedOutfits) {
    const mapping = outfitMap[oldId];
    if (mapping && !dressUp.unlockedItems.includes(mapping.newId)) {
      dressUp.unlockedItems.push(mapping.newId);
    }
  }

  if (rewards.equippedOutfit) {
    const mapping = outfitMap[rewards.equippedOutfit];
    if (mapping) {
      dressUp.equipped[mapping.slot] = mapping.newId;
    }
  }

  // Migrate active tab "more" → "lollie"
  const tab = loadActiveTab();
  if (tab === ("more" as AppTab)) {
    saveActiveTab("lollie");
  }

  saveDressUpState(dressUp);
  safeSet(MIGRATION_KEY, true);
}
