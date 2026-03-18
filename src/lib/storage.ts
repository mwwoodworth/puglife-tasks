import { Task } from "./types";

const STORAGE_KEY = "puglife-tasks";
const STREAK_KEY = "puglife-streak";
const LAST_ACTIVE_KEY = "puglife-last-active";

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function getStreak(): { current: number; lastDate: string } {
  if (typeof window === "undefined") return { current: 0, lastDate: "" };
  try {
    const streak = localStorage.getItem(STREAK_KEY);
    const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
    return {
      current: streak ? parseInt(streak, 10) : 0,
      lastDate: lastActive || "",
    };
  } catch {
    return { current: 0, lastDate: "" };
  }
}

export function updateStreak(): number {
  if (typeof window === "undefined") return 0;
  const today = new Date().toISOString().split("T")[0];
  const { current, lastDate } = getStreak();

  if (lastDate === today) return current;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const newStreak = lastDate === yesterday ? current + 1 : 1;

  localStorage.setItem(STREAK_KEY, String(newStreak));
  localStorage.setItem(LAST_ACTIVE_KEY, today);
  return newStreak;
}
