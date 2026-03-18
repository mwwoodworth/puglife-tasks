"use client";

import { useState, useCallback, useEffect } from "react";
import { MoodLevel, MoodEntry, MOOD_CONFIG } from "@/lib/types";
import { loadTodayMood, saveTodayMood, loadMoodHistory } from "@/lib/storage";

export function useMoodTracker() {
  const [todayMood, setTodayMood] = useState<MoodEntry | null>(() => {
    if (typeof window === 'undefined') return null;
    return loadTodayMood();
  });
  const [history, setHistory] = useState<MoodEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    return loadMoodHistory();
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true);
  }, []);

  const logMood = useCallback((mood: MoodLevel) => {
    saveTodayMood(mood);
    const today = new Date().toISOString().split("T")[0];
    const entry: MoodEntry = { date: today, mood, timestamp: new Date().toISOString() };
    setTodayMood(entry);
    setHistory(loadMoodHistory());
  }, []);

  const hasLoggedToday = todayMood !== null;

  // Get mood for a specific date
  const getMoodForDate = useCallback(
    (date: string): MoodEntry | undefined => {
      return history.find((e) => e.date === date);
    },
    [history]
  );

  // Last 30 days grid data
  const last30Days = useCallback(() => {
    const days: { date: string; mood: MoodLevel | null }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const entry = history.find((e) => e.date === dateStr);
      days.push({ date: dateStr, mood: entry?.mood || null });
    }
    return days;
  }, [history]);

  // Average mood this week
  const weekAverage = useCallback(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEntries = history.filter((e) => new Date(e.date) >= weekStart);
    if (weekEntries.length === 0) return null;
    const sum = weekEntries.reduce((acc, e) => acc + e.mood, 0);
    return Math.round((sum / weekEntries.length) * 10) / 10;
  }, [history]);

  // Consecutive mood log days (for achievements)
  const consecutiveMoodDays = useCallback(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      if (history.find((e) => e.date === dateStr)) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [history]);

  return {
    todayMood,
    history,
    isLoaded,
    logMood,
    hasLoggedToday,
    getMoodForDate,
    last30Days,
    weekAverage,
    consecutiveMoodDays,
    moodConfig: MOOD_CONFIG,
  };
}
