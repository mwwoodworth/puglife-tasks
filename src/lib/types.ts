export type Priority = "paw" | "bone" | "treat" | "zoomies";

export type Category =
  | "personal"
  | "work"
  | "shopping"
  | "home"
  | "health"
  | "fun"
  | "pugcare";

export type AppTab = "dashboard" | "tasks" | "track" | "rewards" | "lollie";

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
  | "confetti-pop"
  | "chat-send"
  | "chat-receive"
  | "item-equip"
  | "item-preview"
  | "shop-purchase";

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
  isRecurring?: boolean;
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
  icon: string;
}

export interface ResetSectionDef {
  id: ResetSectionId;
  title: string;
  icon: string;
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

export const MOOD_CONFIG: Record<MoodLevel, { label: string; icon: string; color: string }> = {
  5: { label: "Amazing", icon: "Star", color: "#a855f7" },
  4: { label: "Good", icon: "Smile", color: "#c084fc" },
  3: { label: "Okay", icon: "Meh", color: "#d8b4fe" },
  2: { label: "Rough", icon: "Frown", color: "#f0abfc" },
  1: { label: "Bad Day", icon: "Frown", color: "#f472b6" },
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
  icon: string;
  condition: string; // human-readable
}

export interface LollieOutfitDef {
  id: string;
  name: string;
  icon: string;
  treatsRequired: number;
}

export interface LevelDef {
  level: number;
  name: string;
  icon: string;
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
  icon: string;
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

export const WEEKLY_FOCUS: Record<DayOfWeek, { area: string; icon: string }> = {
  0: { area: "Rest / Reset", icon: "Sofa" },
  1: { area: "Kitchen", icon: "CookingPot" },
  2: { area: "Living Room", icon: "Sofa" },
  3: { area: "Bathrooms", icon: "ShowerHead" },
  4: { area: "Bedrooms", icon: "Bed" },
  5: { area: "Catch-up", icon: "Sparkles" },
  6: { area: "Rest / Reset", icon: "Sofa" },
};

// ── Configs ──
export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; icon: string; color: string; className: string }
> = {
  paw: { label: "Chill Pug", icon: "PawPrint", color: "#8b5cf6", className: "priority-paw" },
  bone: { label: "Good Boy", icon: "Bone", color: "#7c3aed", className: "priority-bone" },
  treat: { label: "Treat Time", icon: "Drumstick", color: "#9333ea", className: "priority-treat" },
  zoomies: { label: "ZOOMIES!", icon: "Wind", color: "#c026d3", className: "priority-zoomies" },
};

export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; icon: string; gradient: string }
> = {
  personal: { label: "Personal", icon: "Heart", gradient: "from-pink-400 to-fuchsia-500" },
  work: { label: "Work", icon: "Briefcase", gradient: "from-violet-500 to-purple-600" },
  shopping: { label: "Shopping", icon: "ShoppingBag", gradient: "from-fuchsia-400 to-pink-500" },
  home: { label: "Home", icon: "House", gradient: "from-purple-400 to-violet-500" },
  health: { label: "Health", icon: "HeartPulse", gradient: "from-indigo-400 to-purple-500" },
  fun: { label: "Fun", icon: "PartyPopper", gradient: "from-purple-500 to-fuchsia-500" },
  pugcare: { label: "Lollie Care", icon: "PawPrint", gradient: "from-amber-400 to-purple-400" },
};

export const TAB_CONFIG: Record<AppTab, { label: string; icon: string; iconName: string }> = {
  dashboard: { label: "Home", icon: "House", iconName: "home" },
  tasks: { label: "Tasks", icon: "ListTodo", iconName: "tasks" },
  track: { label: "Track", icon: "Heart", iconName: "track" },
  rewards: { label: "Rewards", icon: "Star", iconName: "rewards" },
  lollie: { label: "Lollie", icon: "PawPrint", iconName: "lollie" },
};

// ── AI Chat ──
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ── Dress-Up System ──
export type DressUpSlot = "hat" | "glasses" | "outfit" | "accessory" | "background";
export type ItemRarity = "common" | "uncommon" | "rare" | "epic";

export interface DressUpItem {
  id: string;
  name: string;
  slot: DressUpSlot;
  rarity: ItemRarity;
  treatsCost: number;
  svgLayerId: string;
  previewEmoji: string;
  isSpecial?: boolean;
}

export interface DressUpState {
  unlockedItems: string[];
  equipped: Record<DressUpSlot, string | null>;
  savedLooks: SavedLook[];
  lastViewedAt?: string;
}

export interface SavedLook {
  id: string;
  name: string;
  equipped: Record<DressUpSlot, string | null>;
  createdAt: string;
}

// ── Alcohol Tracking ──
export type AlcoholDrinkType = "beer" | "wine" | "cocktail" | "shot";

export interface AlcoholEntry {
  id: string;
  type: AlcoholDrinkType;
  standardDrinks: number;
  timestamp: string;
}

export interface AlcoholDayData {
  date: string;
  entries: AlcoholEntry[];
}

// ── Integrations ──
export interface NotificationPrefs {
  enabled: boolean;
  reminders: boolean;
  celebrations: boolean;
}

// ── Lollie View Sub-tabs ──
export type LollieSubTab = "chat" | "dressup";
