"use client";

import { useState, useCallback } from "react";
import { RewardsState } from "@/lib/types";
import { loadRewards, saveRewards } from "@/lib/storage";
import {
  getLevelForTreats, getLevelProgress, getAvailableOutfits,
  LEVELS, ACHIEVEMENTS, OUTFITS, TREAT_VALUES,
} from "@/lib/rewards-engine";

export function useRewards() {
  const [state, setState] = useState<RewardsState | null>(() => {
    if (typeof window === 'undefined') return null;
    return loadRewards();
  });

  const earnTreats = useCallback(
    (amount: number): { leveledUp: boolean; newLevel: number } => {
      let leveledUp = false;
      let newLevel = 0;
      setState((prev) => {
        if (!prev) return prev;
        const newTotal = prev.totalTreatsEarned + amount;
        const newTreats = prev.treats + amount;
        const levelDef = getLevelForTreats(newTotal);
        leveledUp = levelDef.level > prev.level;
        newLevel = levelDef.level;
        const next: RewardsState = {
          ...prev,
          treats: newTreats,
          totalTreatsEarned: newTotal,
          level: levelDef.level,
        };
        saveRewards(next);
        return next;
      });
      return { leveledUp, newLevel };
    },
    []
  );

  const unlockAchievement = useCallback((achievementId: string) => {
    setState((prev) => {
      if (!prev || prev.achievements.includes(achievementId)) return prev;
      const next = { ...prev, achievements: [...prev.achievements, achievementId] };
      saveRewards(next);
      return next;
    });
  }, []);

  const equipOutfit = useCallback((outfitId: string | null) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, equippedOutfit: outfitId };
      saveRewards(next);
      return next;
    });
  }, []);

  const unlockOutfit = useCallback((outfitId: string) => {
    setState((prev) => {
      if (!prev || prev.unlockedOutfits.includes(outfitId)) return prev;
      const outfit = OUTFITS.find((o) => o.id === outfitId);
      if (!outfit || prev.treats < outfit.treatsRequired) return prev;
      const next: RewardsState = {
        ...prev,
        treats: prev.treats - outfit.treatsRequired,
        unlockedOutfits: [...prev.unlockedOutfits, outfitId],
      };
      saveRewards(next);
      return next;
    });
  }, []);

  const spendTreats = useCallback((amount: number): boolean => {
    let success = false;
    setState((prev) => {
      if (!prev || prev.treats < amount) return prev;
      success = true;
      const next = { ...prev, treats: prev.treats - amount };
      saveRewards(next);
      return next;
    });
    return success;
  }, []);

  const levelProgress = state ? getLevelProgress(state.totalTreatsEarned) : null;
  const availableOutfits = state ? getAvailableOutfits(state.totalTreatsEarned) : [];

  return {
    state,
    isLoaded: state !== null,
    treats: state?.treats || 0,
    totalTreats: state?.totalTreatsEarned || 0,
    level: state?.level || 1,
    achievements: state?.achievements || [],
    equippedOutfit: state?.equippedOutfit || null,
    unlockedOutfits: state?.unlockedOutfits || [],
    earnTreats,
    spendTreats,
    unlockAchievement,
    equipOutfit,
    unlockOutfit,
    levelProgress,
    availableOutfits,
    allLevels: LEVELS,
    allAchievements: ACHIEVEMENTS,
    allOutfits: OUTFITS,
    treatValues: TREAT_VALUES,
  };
}
