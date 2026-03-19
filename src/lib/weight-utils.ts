import { WeightEntry, WeightGoalData, WeightMilestone } from "./types";
import { getLocalDateString, parseLocalDateString } from "./date";

export function calculateBMI(weightLbs: number, heightInches: number): number {
  if (heightInches <= 0) return 0;
  return (weightLbs / (heightInches * heightInches)) * 703;
}

export function getBMICategory(bmi: number): { label: string; emoji: string } {
  if (bmi < 18.5) return { label: "Underweight", emoji: "🍃" };
  if (bmi < 25) return { label: "Normal", emoji: "💚" };
  if (bmi < 30) return { label: "Overweight", emoji: "💛" };
  return { label: "Obese", emoji: "🧡" };
}

export function detectNewMilestones(
  entries: WeightEntry[],
  goal: WeightGoalData | null,
  existing: WeightMilestone[]
): WeightMilestone[] {
  if (entries.length < 2 || !goal) return [];
  const sorted = [...entries].sort((a, b) => parseLocalDateString(a.date).getTime() - parseLocalDateString(b.date).getTime());
  const current = sorted[sorted.length - 1].weight;
  const start = goal.startWeight;
  const lost = start - current;
  const total = start - goal.goalWeight;
  const today = getLocalDateString();
  const existingTypes = new Set(existing.map((m) => `${m.type}-${m.weight}`));
  const newMilestones: WeightMilestone[] = [];

  // Every 5 lbs
  const fiveLbMarks = Math.floor(lost / 5);
  for (let i = 1; i <= fiveLbMarks; i++) {
    const w = start - i * 5;
    const key = i % 2 === 0 ? `ten-lbs-${w}` : `five-lbs-${w}`;
    if (!existingTypes.has(key)) {
      newMilestones.push({
        type: i % 2 === 0 ? "ten-lbs" : "five-lbs",
        weight: w, date: today, celebrated: false,
      });
    }
  }

  // Halfway
  if (total > 0 && lost >= total / 2 && !existingTypes.has(`halfway-${Math.round(start - total / 2)}`)) {
    newMilestones.push({ type: "halfway", weight: Math.round(start - total / 2), date: today, celebrated: false });
  }

  // Goal reached
  if (total > 0 && current <= goal.goalWeight && !existingTypes.has(`goal-reached-${goal.goalWeight}`)) {
    newMilestones.push({ type: "goal-reached", weight: goal.goalWeight, date: today, celebrated: false });
  }

  // New all-time low
  const allWeights = sorted.slice(0, -1).map((e) => e.weight);
  const prevMin = allWeights.length > 0 ? Math.min(...allWeights) : Infinity;
  if (current < prevMin && current < start && !existingTypes.has(`new-low-${current}`)) {
    newMilestones.push({ type: "new-low", weight: current, date: today, celebrated: false });
  }

  return newMilestones;
}

export function calculateWeightProgress(entries: WeightEntry[], goal: WeightGoalData) {
  const sorted = [...entries].sort((a, b) => parseLocalDateString(a.date).getTime() - parseLocalDateString(b.date).getTime());
  const current = sorted.length > 0 ? sorted[sorted.length - 1].weight : goal.startWeight;
  const totalToLose = goal.startWeight - goal.goalWeight;
  const lost = goal.startWeight - current;
  const percent = totalToLose > 0 ? Math.min(100, Math.round((lost / totalToLose) * 100)) : 0;

  // Weekly average
  const recent = sorted.slice(-14);
  let avgPerWeek = 0;
  if (recent.length >= 2) {
    const days = (parseLocalDateString(recent[recent.length - 1].date).getTime() - parseLocalDateString(recent[0].date).getTime()) / 86400000;
    if (days > 0) avgPerWeek = ((recent[0].weight - recent[recent.length - 1].weight) / days) * 7;
  }

  // Trend
  const lastFew = sorted.slice(-5);
  let trend: "losing" | "maintaining" | "gaining" = "maintaining";
  if (lastFew.length >= 2) {
    const diff = lastFew[lastFew.length - 1].weight - lastFew[0].weight;
    if (diff < -0.5) trend = "losing";
    else if (diff > 0.5) trend = "gaining";
  }

  return {
    currentWeight: current,
    totalLost: Math.max(0, lost),
    percentToGoal: Math.max(0, percent),
    averagePerWeek: Math.max(0, avgPerWeek),
    trend,
  };
}

export interface ChartPoint {
  x: number;
  y: number;
  date: string;
  weight: number;
}

export function prepareChartData(entries: WeightEntry[], goal: WeightGoalData | null) {
  const sorted = [...entries].sort((a, b) => parseLocalDateString(a.date).getTime() - parseLocalDateString(b.date).getTime());
  if (sorted.length === 0) return { points: [], minW: 0, maxW: 0, goalW: goal?.goalWeight ?? null };

  const weights = sorted.map((e) => e.weight);
  const minW = Math.floor(Math.min(...weights, goal?.goalWeight ?? Infinity) - 3);
  const maxW = Math.ceil(Math.max(...weights, goal?.startWeight ?? 0) + 3);
  const range = maxW - minW || 1;

  const points: ChartPoint[] = sorted.map((e, i) => ({
    x: sorted.length === 1 ? 50 : (i / (sorted.length - 1)) * 100,
    y: 100 - ((e.weight - minW) / range) * 100,
    date: e.date,
    weight: e.weight,
  }));

  return { points, minW, maxW, goalW: goal?.goalWeight ?? null };
}
