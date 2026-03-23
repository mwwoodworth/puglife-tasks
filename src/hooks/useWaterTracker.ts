"use client";

import { useState, useCallback } from "react";
import { DrinkType, WaterDayData, WaterEntry } from "@/lib/types";
import { loadWaterData, saveWaterData, loadWaterHistory } from "@/lib/storage";

const DRINK_OZ: Record<DrinkType, number> = {
  water: 8,
  coffee: 8,
  shake: 12,
  "chocolate-milk": 8,
};

const DRINK_LABELS: Record<DrinkType, { label: string; icon: string }> = {
  water: { label: "Water", icon: "Droplet" },
  coffee: { label: "Coffee", icon: "Coffee" },
  shake: { label: "Shake", icon: "CupSoda" },
  "chocolate-milk": { label: "Choco Milk", icon: "Candy" },
};

export function useWaterTracker() {
  const [data, setData] = useState<WaterDayData | null>(() => {
    return typeof window !== "undefined" ? loadWaterData() : null;
  });

  const addDrink = useCallback((type: DrinkType) => {
    setData((prev) => {
      if (!prev) return prev;
      const entry: WaterEntry = {
        id: `w-${Date.now()}`,
        type,
        oz: DRINK_OZ[type],
        timestamp: new Date().toISOString(),
      };
      const next = { ...prev, entries: [...prev.entries, entry] };
      saveWaterData(next);
      return next;
    });
  }, []);

  const removeLast = useCallback(() => {
    setData((prev) => {
      if (!prev || prev.entries.length === 0) return prev;
      const next = { ...prev, entries: prev.entries.slice(0, -1) };
      saveWaterData(next);
      return next;
    });
  }, []);

  const setGoal = useCallback((goalOz: number) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = { ...prev, goalOz };
      saveWaterData(next);
      return next;
    });
  }, []);

  const totalOz = data?.entries.reduce((sum, e) => sum + e.oz, 0) || 0;
  const goalOz = data?.goalOz || 64;
  const percent = Math.min(100, Math.round((totalOz / goalOz) * 100));
  const goalReached = totalOz >= goalOz;
  const count = data?.entries.length || 0;

  return {
    data,
    isLoaded: data !== null,
    addDrink,
    removeLast,
    setGoal,
    totalOz,
    goalOz,
    percent,
    goalReached,
    count,
    entries: data?.entries || [],
    drinkLabels: DRINK_LABELS,
    drinkOz: DRINK_OZ,
    history: loadWaterHistory(),
  };
}
