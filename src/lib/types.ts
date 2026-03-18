export type Priority = "paw" | "bone" | "treat" | "zoomies";

export type Category =
  | "personal"
  | "work"
  | "shopping"
  | "home"
  | "health"
  | "fun"
  | "pugcare";

export type AppTab = "dashboard" | "tasks" | "weight" | "motivation";

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
  | "celebration"
  | "milestone"
  | "tab-switch"
  | "weight-log"
  | "sparkle";

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

export interface StreakData {
  current: number;
  lastDate: string;
  longest: number;
  milestonesCelebrated: number[];
}

export interface DailyMotivation {
  quote: string;
  author: string;
  category: "encouragement" | "persistence" | "self-love" | "strength" | "humor";
}

export interface StepGoal {
  dailyTarget: number;
  currentSteps: number;
  date: string;
  history: { date: string; steps: number }[];
}

export interface DailyResetData {
  lastResetDate: string;
  badDayCount: number;
  comfortModeActive: boolean;
}

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

export const TAB_CONFIG: Record<AppTab, { label: string; emoji: string }> = {
  dashboard: { label: "Home", emoji: "🏠" },
  tasks: { label: "Tasks", emoji: "✅" },
  weight: { label: "Weight", emoji: "⚖️" },
  motivation: { label: "Vibes", emoji: "💜" },
};
