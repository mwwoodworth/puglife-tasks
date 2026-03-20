import { describe, it, expect } from "vitest";
import {
  calculateBMI,
  getBMICategory,
  calculateWeightProgress,
} from "@/lib/weight-utils";

describe("weight utilities", () => {
  describe("calculateBMI", () => {
    it("returns 0 when height is 0", () => {
      expect(calculateBMI(150, 0)).toBe(0);
    });

    it("returns 0 when height is negative", () => {
      expect(calculateBMI(150, -5)).toBe(0);
    });

    it("calculates BMI correctly for known values", () => {
      // 150 lbs, 5'6" (66 inches) => BMI ~24.2
      const bmi = calculateBMI(150, 66);
      expect(bmi).toBeCloseTo(24.21, 1);
    });

    it("calculates BMI correctly for another set of values", () => {
      // 200 lbs, 5'10" (70 inches) => BMI ~28.69
      const bmi = calculateBMI(200, 70);
      expect(bmi).toBeCloseTo(28.69, 1);
    });
  });

  describe("getBMICategory", () => {
    it("returns Underweight for BMI < 18.5", () => {
      expect(getBMICategory(17.0).label).toBe("Underweight");
    });

    it("returns Normal for BMI 18.5 to 24.9", () => {
      expect(getBMICategory(22.0).label).toBe("Normal");
    });

    it("returns Overweight for BMI 25 to 29.9", () => {
      expect(getBMICategory(27.0).label).toBe("Overweight");
    });

    it("returns Obese for BMI >= 30", () => {
      expect(getBMICategory(32.0).label).toBe("Obese");
    });

    it("returns Normal at the boundary of 18.5", () => {
      expect(getBMICategory(18.5).label).toBe("Normal");
    });
  });

  describe("calculateWeightProgress", () => {
    const goal = {
      startWeight: 200,
      goalWeight: 150,
      startDate: "2026-01-01",
    };

    it("returns start weight when no entries exist", () => {
      const result = calculateWeightProgress([], goal);
      expect(result.currentWeight).toBe(200);
      expect(result.totalLost).toBe(0);
      expect(result.percentToGoal).toBe(0);
    });

    it("calculates progress correctly with entries", () => {
      const entries = [
        { id: "1", date: "2026-01-01", weight: 200, createdAt: "2026-01-01" },
        { id: "2", date: "2026-01-15", weight: 190, createdAt: "2026-01-15" },
        { id: "3", date: "2026-02-01", weight: 180, createdAt: "2026-02-01" },
      ];
      const result = calculateWeightProgress(entries, goal);
      expect(result.currentWeight).toBe(180);
      expect(result.totalLost).toBe(20);
      expect(result.percentToGoal).toBe(40); // 20 of 50 lbs = 40%
    });

    it("detects losing trend when weight is decreasing", () => {
      const entries = [
        { id: "1", date: "2026-01-01", weight: 200, createdAt: "2026-01-01" },
        { id: "2", date: "2026-01-02", weight: 199, createdAt: "2026-01-02" },
        { id: "3", date: "2026-01-03", weight: 198, createdAt: "2026-01-03" },
        { id: "4", date: "2026-01-04", weight: 197, createdAt: "2026-01-04" },
        { id: "5", date: "2026-01-05", weight: 196, createdAt: "2026-01-05" },
      ];
      const result = calculateWeightProgress(entries, goal);
      expect(result.trend).toBe("losing");
    });

    it("detects gaining trend when weight is increasing", () => {
      const entries = [
        { id: "1", date: "2026-01-01", weight: 180, createdAt: "2026-01-01" },
        { id: "2", date: "2026-01-02", weight: 181, createdAt: "2026-01-02" },
        { id: "3", date: "2026-01-03", weight: 182, createdAt: "2026-01-03" },
        { id: "4", date: "2026-01-04", weight: 183, createdAt: "2026-01-04" },
        { id: "5", date: "2026-01-05", weight: 184, createdAt: "2026-01-05" },
      ];
      const result = calculateWeightProgress(entries, goal);
      expect(result.trend).toBe("gaining");
    });

    it("caps percent at 100 when goal is exceeded", () => {
      const entries = [
        { id: "1", date: "2026-01-01", weight: 200, createdAt: "2026-01-01" },
        { id: "2", date: "2026-06-01", weight: 140, createdAt: "2026-06-01" },
      ];
      const result = calculateWeightProgress(entries, goal);
      expect(result.percentToGoal).toBe(100);
    });
  });
});
