export type Priority = "paw" | "bone" | "treat" | "zoomies";

export type Category =
  | "personal"
  | "work"
  | "shopping"
  | "home"
  | "health"
  | "fun"
  | "pugcare";

export type AppTab = "tasks" | "weight" | "motivation";

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

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; emoji: string; color: string; className: string }
> = {
  paw: { label: "Chill Pug", emoji: "🐾", color: "#b8a9e8", className: "priority-paw" },
  bone: { label: "Good Boy", emoji: "🦴", color: "#a78bfa", className: "priority-bone" },
  treat: { label: "Treat Time", emoji: "🍖", color: "#c084fc", className: "priority-treat" },
  zoomies: { label: "ZOOMIES!", emoji: "💨", color: "#e879f9", className: "priority-zoomies" },
};

export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; emoji: string; gradient: string }
> = {
  personal: { label: "Personal", emoji: "💖", gradient: "from-pink-300 to-fuchsia-300" },
  work: { label: "Work", emoji: "💼", gradient: "from-violet-300 to-purple-400" },
  shopping: { label: "Shopping", emoji: "🛍️", gradient: "from-fuchsia-300 to-pink-300" },
  home: { label: "Home", emoji: "🏠", gradient: "from-purple-200 to-violet-300" },
  health: { label: "Health", emoji: "🧘‍♀️", gradient: "from-indigo-300 to-purple-300" },
  fun: { label: "Fun", emoji: "🎉", gradient: "from-purple-300 to-fuchsia-400" },
  pugcare: { label: "Pug Care", emoji: "🐶", gradient: "from-amber-200 to-purple-200" },
};

export const TAB_CONFIG: Record<AppTab, { label: string; emoji: string }> = {
  tasks: { label: "Tasks", emoji: "✅" },
  weight: { label: "Weight", emoji: "⚖️" },
  motivation: { label: "Vibes", emoji: "💜" },
};
