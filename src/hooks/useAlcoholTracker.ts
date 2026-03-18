"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AlcoholDayData, AlcoholDrinkType, AlcoholEntry } from "@/lib/types";
import { loadAlcoholData, saveAlcoholData, loadAlcoholHistory } from "@/lib/storage";

const STANDARD_DRINKS: Record<AlcoholDrinkType, number> = {
  beer: 1,
  wine: 1,
  cocktail: 1.5,
  shot: 1,
};

export function useAlcoholTracker() {
  const [data, setData] = useState<AlcoholDayData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setData(loadAlcoholData());
    setIsLoaded(true);
  }, []);

  const save = useCallback((next: AlcoholDayData) => {
    setData(next);
    saveAlcoholData(next);
  }, []);

  const addDrink = useCallback((type: AlcoholDrinkType) => {
    if (!data) return;
    const entry: AlcoholEntry = {
      id: Date.now().toString(36),
      type,
      standardDrinks: STANDARD_DRINKS[type],
      timestamp: new Date().toISOString(),
    };
    save({ ...data, entries: [...data.entries, entry] });
  }, [data, save]);

  const removeLast = useCallback(() => {
    if (!data || data.entries.length === 0) return;
    save({ ...data, entries: data.entries.slice(0, -1) });
  }, [data, save]);

  const todayCount = useMemo(() => {
    if (!data) return 0;
    return data.entries.reduce((sum, e) => sum + e.standardDrinks, 0);
  }, [data]);

  const last7Days = useMemo(() => {
    const history = loadAlcoholHistory();
    const days: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayData = i === 0
        ? data
        : history.find((h) => h.date === dateStr);
      days.push({
        date: dateStr,
        count: dayData ? dayData.entries.reduce((s, e) => s + e.standardDrinks, 0) : 0,
      });
    }
    return days;
  }, [data]);

  return {
    data,
    isLoaded,
    addDrink,
    removeLast,
    todayCount,
    last7Days,
    entries: data?.entries || [],
  };
}
