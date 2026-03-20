import { describe, it, expect } from "vitest";
import {
  getLevelForTreats,
  getNextLevel,
  getLevelProgress,
  getAvailableOutfits,
  checkNewAchievements,
  createDefaultRewardsState,
  LEVELS,
  OUTFITS,
} from "@/lib/rewards-engine";

describe("rewards engine", () => {
  describe("getLevelForTreats", () => {
    it("returns Puppy (level 1) for 0 treats", () => {
      const level = getLevelForTreats(0);
      expect(level.level).toBe(1);
      expect(level.name).toBe("Puppy");
    });

    it("returns Good Girl (level 2) at exactly 50 treats", () => {
      const level = getLevelForTreats(50);
      expect(level.level).toBe(2);
      expect(level.name).toBe("Good Girl");
    });

    it("stays at level 2 for 149 treats (not yet 150)", () => {
      const level = getLevelForTreats(149);
      expect(level.level).toBe(2);
    });

    it("returns max level at high treat counts", () => {
      const level = getLevelForTreats(10000);
      expect(level.level).toBe(10);
      expect(level.name).toBe("Ultimate Pug Mom");
    });
  });

  describe("getNextLevel", () => {
    it("returns level 2 when current level is 1", () => {
      const next = getNextLevel(1);
      expect(next).not.toBeNull();
      expect(next!.level).toBe(2);
    });

    it("returns null when at max level", () => {
      const maxLevel = LEVELS[LEVELS.length - 1].level;
      expect(getNextLevel(maxLevel)).toBeNull();
    });
  });

  describe("getLevelProgress", () => {
    it("returns 0% progress at start of a level", () => {
      const progress = getLevelProgress(50); // exactly level 2 start
      expect(progress.currentLevel.level).toBe(2);
      expect(progress.progressPercent).toBe(0);
      expect(progress.treatsToNext).toBe(100); // 150 - 50
    });

    it("returns 50% progress at midpoint of a level range", () => {
      // Level 2: 50-149 (range 100), midpoint = 100
      const progress = getLevelProgress(100);
      expect(progress.currentLevel.level).toBe(2);
      expect(progress.progressPercent).toBe(50);
    });

    it("returns 100% and 0 treatsToNext at max level", () => {
      const progress = getLevelProgress(5000);
      expect(progress.progressPercent).toBe(100);
      expect(progress.treatsToNext).toBe(0);
      expect(progress.nextLevel).toBeNull();
    });
  });

  describe("getAvailableOutfits", () => {
    it("returns no outfits at 0 treats", () => {
      expect(getAvailableOutfits(0)).toHaveLength(0);
    });

    it("returns outfits costing <= treat count", () => {
      const available = getAvailableOutfits(100);
      expect(available.length).toBeGreaterThan(0);
      for (const outfit of available) {
        expect(outfit.treatsRequired).toBeLessThanOrEqual(100);
      }
    });

    it("returns all outfits at very high treat count", () => {
      const available = getAvailableOutfits(10000);
      expect(available).toHaveLength(OUTFITS.length);
    });
  });

  describe("checkNewAchievements", () => {
    const defaultContext = {
      streakDays: 0,
      waterGoalDays: 0,
      moodLogDays: 0,
      fullDaysCompleted: 0,
      resetSectionsCompleted: 0,
      badDaysSurvived: 0,
      earlyMorningResets: 0,
      lateEveningResets: 0,
    };

    it("returns no achievements when nothing is accomplished", () => {
      const state = createDefaultRewardsState();
      const result = checkNewAchievements(state, defaultContext);
      expect(result).toHaveLength(0);
    });

    it("awards first-reset when a section is completed", () => {
      const state = createDefaultRewardsState();
      const result = checkNewAchievements(state, {
        ...defaultContext,
        resetSectionsCompleted: 1,
      });
      expect(result).toContain("first-reset");
    });

    it("does not re-award an already earned achievement", () => {
      const state = {
        ...createDefaultRewardsState(),
        achievements: ["first-reset"],
      };
      const result = checkNewAchievements(state, {
        ...defaultContext,
        resetSectionsCompleted: 5,
      });
      expect(result).not.toContain("first-reset");
    });

    it("awards multiple achievements at once", () => {
      const state = createDefaultRewardsState();
      const result = checkNewAchievements(state, {
        ...defaultContext,
        streakDays: 7,
        resetSectionsCompleted: 1,
        waterGoalDays: 1,
      });
      expect(result).toContain("first-reset");
      expect(result).toContain("streak-3");
      expect(result).toContain("streak-7");
      expect(result).toContain("hydration-hero");
    });
  });

  describe("createDefaultRewardsState", () => {
    it("returns a fresh state with zero values", () => {
      const state = createDefaultRewardsState();
      expect(state.treats).toBe(0);
      expect(state.totalTreatsEarned).toBe(0);
      expect(state.level).toBe(1);
      expect(state.achievements).toEqual([]);
      expect(state.equippedOutfit).toBeNull();
      expect(state.unlockedOutfits).toEqual([]);
    });
  });
});
