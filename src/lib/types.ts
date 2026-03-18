export type Priority = "paw" | "bone" | "treat" | "zoomies";

export type Category =
  | "personal"
  | "work"
  | "shopping"
  | "home"
  | "health"
  | "fun"
  | "pugcare";

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

export interface PugMood {
  emoji: string;
  message: string;
  animation: string;
}

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; emoji: string; color: string; className: string }
> = {
  paw: {
    label: "Chill Pug",
    emoji: "🐾",
    color: "#95d5b2",
    className: "priority-paw",
  },
  bone: {
    label: "Good Boy",
    emoji: "🦴",
    color: "#90e0ef",
    className: "priority-bone",
  },
  treat: {
    label: "Treat Time",
    emoji: "🍖",
    color: "#ffd60a",
    className: "priority-treat",
  },
  zoomies: {
    label: "ZOOMIES!",
    emoji: "💨",
    color: "#ff6b6b",
    className: "priority-zoomies",
  },
};

export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; emoji: string; gradient: string }
> = {
  personal: {
    label: "Personal",
    emoji: "💖",
    gradient: "from-pink-300 to-rose-300",
  },
  work: {
    label: "Work",
    emoji: "💼",
    gradient: "from-blue-300 to-indigo-300",
  },
  shopping: {
    label: "Shopping",
    emoji: "🛍️",
    gradient: "from-purple-300 to-violet-300",
  },
  home: {
    label: "Home",
    emoji: "🏠",
    gradient: "from-amber-200 to-orange-300",
  },
  health: {
    label: "Health",
    emoji: "🧘‍♀️",
    gradient: "from-green-300 to-emerald-300",
  },
  fun: {
    label: "Fun",
    emoji: "🎉",
    gradient: "from-yellow-200 to-amber-300",
  },
  pugcare: {
    label: "Pug Care",
    emoji: "🐶",
    gradient: "from-amber-200 to-yellow-200",
  },
};
