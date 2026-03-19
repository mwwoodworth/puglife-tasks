"use client";

import { useState, useCallback } from "react";
import { DailyResetState, ResetSectionId } from "@/lib/types";
import { loadDailyResetState, saveDailyResetState, loadStats, saveStats } from "@/lib/storage";
import {
  RESET_SECTIONS, BAD_DAY_TASKS,
  getCurrentResetSection, getVisibleSections, getAllSections,
  getTotalDayProgress, getBadDayProgress, getSectionProgress,
} from "@/lib/daily-reset-plan";

export function useDailyReset() {
  const [state, setState] = useState<DailyResetState | null>(() => {
    return typeof window !== "undefined" ? loadDailyResetState() : null;
  });

  const toggleTask = useCallback((taskId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const field = prev.badDayMode ? "badDayCompletedTasks" : "completedTasks";
      const list = prev[field];
      const next = list.includes(taskId)
        ? { ...prev, [field]: list.filter((id) => id !== taskId) }
        : { ...prev, [field]: [...list, taskId] };
      saveDailyResetState(next);
      return next;
    });
  }, []);

  const activateBadDay = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, badDayMode: true };
      saveDailyResetState(next);
      // Track stat
      const stats = loadStats();
      stats.badDaysSurvived += 1;
      saveStats(stats);
      return next;
    });
  }, []);

  const deactivateBadDay = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, badDayMode: false };
      saveDailyResetState(next);
      return next;
    });
  }, []);

  const isTaskDone = useCallback((taskId: string): boolean => {
    if (!state) return false;
    return state.badDayMode
      ? state.badDayCompletedTasks.includes(taskId)
      : state.completedTasks.includes(taskId);
  }, [state]);

  const isSectionComplete = useCallback((sectionId: ResetSectionId): boolean => {
    if (!state) return false;
    const section = RESET_SECTIONS.find((s) => s.id === sectionId);
    if (!section) return false;
    return section.tasks.every((t) => state.completedTasks.includes(t.id));
  }, [state]);

  const completedTasks = state?.badDayMode ? (state?.badDayCompletedTasks || []) : (state?.completedTasks || []);
  const dayProgress = state?.badDayMode
    ? getBadDayProgress(state?.badDayCompletedTasks || [])
    : getTotalDayProgress(state?.completedTasks || []);

  return {
    state,
    isLoaded: state !== null,
    toggleTask,
    isTaskDone,
    isSectionComplete,
    activateBadDay,
    deactivateBadDay,
    badDayMode: state?.badDayMode || false,
    completedTasks,
    dayProgress,
    currentSection: getCurrentResetSection(),
    visibleSections: getVisibleSections(),
    allSections: getAllSections(),
    badDayTasks: BAD_DAY_TASKS,
    getSectionProgress: (id: ResetSectionId) => getSectionProgress(id, state?.completedTasks || []),
  };
}
