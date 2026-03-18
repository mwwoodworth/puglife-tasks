"use client";

import { useState, useEffect, useCallback } from "react";
import { WeightEntry, WeightGoalData, WeightMilestone } from "@/lib/types";
import {
  loadWeightEntries, saveWeightEntries,
  loadWeightGoal, saveWeightGoal,
  loadWeightMilestones, saveWeightMilestones,
} from "@/lib/storage";
import { detectNewMilestones, calculateWeightProgress } from "@/lib/weight-utils";

export function useWeightTracker() {
  const [entries, setEntries] = useState<WeightEntry[]>(() => typeof window !== "undefined" ? loadWeightEntries() : []);
  const [goal, setGoal] = useState<WeightGoalData | null>(() => typeof window !== "undefined" ? loadWeightGoal() : null);
  const [milestones, setMilestones] = useState<WeightMilestone[]>(() => typeof window !== "undefined" ? loadWeightMilestones() : []);
  const [newMilestone, setNewMilestone] = useState<WeightMilestone | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) saveWeightEntries(entries);
  }, [entries, isLoaded]);

  useEffect(() => {
    if (isLoaded && goal) saveWeightGoal(goal);
  }, [goal, isLoaded]);

  useEffect(() => {
    if (isLoaded) saveWeightMilestones(milestones);
  }, [milestones, isLoaded]);

  const addEntry = useCallback((date: string, weight: number, note?: string) => {
    const entry: WeightEntry = {
      id: crypto.randomUUID(),
      date,
      weight,
      note,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => {
      const updated = [...prev, entry];
      // Check milestones
      if (goal) {
        const detected = detectNewMilestones(updated, goal, milestones);
        if (detected.length > 0) {
          setMilestones((prev) => [...prev, ...detected]);
          setNewMilestone(detected[0]);
        }
      }
      return updated;
    });
  }, [goal, milestones]);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const setWeightGoal = useCallback((data: WeightGoalData) => {
    setGoal(data);
  }, []);

  const dismissMilestone = useCallback(() => {
    setNewMilestone(null);
  }, []);

  const progress = goal && entries.length > 0
    ? calculateWeightProgress(entries, goal)
    : null;

  return {
    entries, goal, milestones, newMilestone, progress, isLoaded,
    addEntry, deleteEntry, setWeightGoal, dismissMilestone,
  };
}
