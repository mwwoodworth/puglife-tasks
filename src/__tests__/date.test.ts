import { describe, it, expect } from "vitest";
import {
  getLocalDateString,
  parseLocalDateString,
  shiftLocalDate,
  getRelativeLocalDateString,
} from "@/lib/date";

describe("date utilities", () => {
  describe("getLocalDateString", () => {
    it("formats a known date as YYYY-MM-DD", () => {
      const date = new Date(2026, 0, 5); // Jan 5, 2026
      expect(getLocalDateString(date)).toBe("2026-01-05");
    });

    it("zero-pads single-digit month and day", () => {
      const date = new Date(2025, 2, 9); // Mar 9, 2025
      expect(getLocalDateString(date)).toBe("2025-03-09");
    });

    it("handles double-digit month and day", () => {
      const date = new Date(2025, 11, 25); // Dec 25, 2025
      expect(getLocalDateString(date)).toBe("2025-12-25");
    });
  });

  describe("parseLocalDateString", () => {
    it("parses a YYYY-MM-DD string back to a Date", () => {
      const result = parseLocalDateString("2026-03-15");
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(2); // March = 2
      expect(result.getDate()).toBe(15);
    });

    it("round-trips with getLocalDateString", () => {
      const original = "2025-07-04";
      const parsed = parseLocalDateString(original);
      expect(getLocalDateString(parsed)).toBe(original);
    });
  });

  describe("shiftLocalDate", () => {
    it("shifts a date forward by N days", () => {
      const base = new Date(2026, 0, 1); // Jan 1
      const shifted = shiftLocalDate(base, 5);
      expect(shifted.getDate()).toBe(6);
    });

    it("shifts a date backward with negative days", () => {
      const base = new Date(2026, 0, 10); // Jan 10
      const shifted = shiftLocalDate(base, -3);
      expect(shifted.getDate()).toBe(7);
    });

    it("does not mutate the original date", () => {
      const base = new Date(2026, 0, 1);
      const originalTime = base.getTime();
      shiftLocalDate(base, 10);
      expect(base.getTime()).toBe(originalTime);
    });
  });

  describe("getRelativeLocalDateString", () => {
    it("returns tomorrow's date string when days=1", () => {
      const base = new Date(2026, 0, 1);
      expect(getRelativeLocalDateString(1, base)).toBe("2026-01-02");
    });

    it("returns yesterday's date string when days=-1", () => {
      const base = new Date(2026, 0, 15);
      expect(getRelativeLocalDateString(-1, base)).toBe("2026-01-14");
    });
  });
});
