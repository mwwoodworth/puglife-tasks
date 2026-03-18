export type Priority = "paw" | "bone" | "treat" | "zoomies";

export type Category =
  | "personal"
  | "work"
  | "shopping"
  | "home"
  | "health"
  | "fun"
  | "pugcare";

export type AppTab = "dashboard" | "tasks" | "track" | "rewards" | "more";

export type PugMood =
  | "sleeping"
  | "idle"
  | "happy"
  | "excited"
  | "celebrating"
  | "sad"
  | "eating"
  | "working-out"
  | "love";

export type SoundEffect =
  | "task-complete"
  | "task-add"
  | "task-delete"
  | "button-hover"
  | "pug-toot"
  | "pug-woof"
  | "pug-snort"
  | "pug-whimper"
  | "pug-bark"
  | "pug-snore"
  | "pug-yip"
  | "pug-chomp"
  | "celebration"
  | "milestone"
  | "tab-switch"
  | "weight-log"
  | "sparkle"
  | "water-gulp"
  | "level-up"
  | "achievement"
  | "confetti-pop";

// ── Tasks ──
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: string;
  completedAt?: string;
  notes?: string;
  dueDate?: string;
}

// ── Weight ──
export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  note?: string;
  createdAt: string;
}

export interface WeightGoalData {
  startWeight: number;
  goalWeight: number;
  startDate: string;
  heightInches?: number;
}

export interface WeightMilestone {
  type: "five-lbs" | "ten-lbs" | "halfway" | "goal-reached" | "new-low";
  weight: number;
  date: string;
  celebrated: boolean;
}

// ── Daily Reset System ──
export type ResetSectionId = "morning" | "midday" | "pre-dinner" | "dinner" | "evening" | "daily-win";

export interface ResetTaskDef {
  id: string;
  label: string;
  emoji: string;
}

export interface ResetSectionDef {
  id: ResetSectionId;
  title: string;
  emoji: string;
  timeRange: string;
  startHour: number;
  tasks: ResetTaskDef[];
}

export interface DailyResetState {
  date: string;
  completedTasks: string[]; // task IDs
  badDayMode: boolean;
  badDayCompletedTasks: string[];
}

// ── Water Tracking ──
export type DrinkType = "water" | "coffee" | "shake" | "chocolate-milk";

export interface WaterEntry {
  id: string;
  type: DrinkType;
  oz: number;
  timestamp: string;
}

export interface WaterDayData {
  date: string;
  entries: WaterEntry[];
  goalOz: number;
}

// ── Mood Tracking ──
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  date: string;
  mood: MoodLevel;
  timestamp: string;
}

export const MOOD_CONFIG: Record<MoodLevel, { label: string; emoji: string; color: string }> = {
  5: { label: "Amazing", emoji: "🤩", color: "#a855f7" },
  4: { label: "Good", emoji: "😊", color: "#c084fc" },
  3: { label: "Okay", emoji: "😐", color: "#d8b4fe" },
  2: { label: "Rough", emoji: "😔", color: "#f0abfc" },
  1: { label: "Bad Day", emoji: "😢", color: "#f472b6" },
};

// ── Rewards / Gamification ──
export interface RewardsState {
  treats: number;
  totalTreatsEarned: number;
  level: number;
  achievements: string[]; // achievement IDs that are unlocked
  equippedOutfit: string | null;
  unlockedOutfits: string[];
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: string; // human-readable
}

export interface LollieOutfitDef {
  id: string;
  name: string;
  emoji: string;
  treatsRequired: number;
}

export interface LevelDef {
  level: number;
  name: string;
  emoji: string;
  treatsRequired: number;
}

// ── Streaks ──
export interface StreakData {
  current: number;
  lastDate: string;
  longest: number;
  milestonesCelebrated: number[];
}

// ── Motivation ──
export interface DailyMotivation {
  quote: string;
  author: string;
  category: "encouragement" | "persistence" | "self-love" | "strength" | "humor";
}

// ── Encouragement Wall ──
export interface EncouragementCard {
  message: string;
  emoji: string;
  backMessage?: string;
}

// ── Step Goal (legacy, kept for compat) ──
export interface StepGoal {
  dailyTarget: number;
  currentSteps: number;
  date: string;
  history: { date: string; steps: number }[];
}

// ── Weekly Focus ──
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const WEEKLY_FOCUS: Record<DayOfWeek, { area: string; emoji: string }> = {
  0: { area: "Rest / Reset", emoji: "🛋️" },
  1: { area: "Kitchen", emoji: "🍳" },
  2: { area: "Living Room", emoji: "🛋️" },
  3: { area: "Bathrooms", emoji: "🚿" },
  4: { area: "Bedrooms", emoji: "🛏️" },
  5: { area: "Catch-up", emoji: "✨" },
  6: { area: "Rest / Reset", emoji: "🛋️" },
};

// ── Configs ──
export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; emoji: string; color: string; className: string }
> = {
  paw: { label: "Chill Pug", emoji: "🐾", color: "#8b5cf6", className: "priority-paw" },
  bone: { label: "Good Boy", emoji: "🦴", color: "#7c3aed", className: "priority-bone" },
  treat: { label: "Treat Time", emoji: "🍖", color: "#9333ea", className: "priority-treat" },
  zoomies: { label: "ZOOMIES!", emoji: "💨", color: "#c026d3", className: "priority-zoomies" },
};

export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; emoji: string; gradient: string }
> = {
  personal: { label: "Personal", emoji: "💖", gradient: "from-pink-400 to-fuchsia-500" },
  work: { label: "Work", emoji: "💼", gradient: "from-violet-500 to-purple-600" },
  shopping: { label: "Shopping", emoji: "🛍️", gradient: "from-fuchsia-400 to-pink-500" },
  home: { label: "Home", emoji: "🏠", gradient: "from-purple-400 to-violet-500" },
  health: { label: "Health", emoji: "🧘‍♀️", gradient: "from-indigo-400 to-purple-500" },
  fun: { label: "Fun", emoji: "🎉", gradient: "from-purple-500 to-fuchsia-500" },
  pugcare: { label: "Lollie Care", emoji: "🐶", gradient: "from-amber-400 to-purple-400" },
};

export const TAB_CONFIG: Record<AppTab, { label: string; emoji: string; icon: string }> = {
  dashboard: { label: "Home", emoji: "🏠", icon: "home" },
  tasks: { label: "Tasks", emoji: "✅", icon: "tasks" },
  track: { label: "Track", emoji: "📊", icon: "track" },
  rewards: { label: "Rewards", emoji: "⭐", icon: "rewards" },
  more: { label: "More", emoji: "💜", icon: "more" },
};
