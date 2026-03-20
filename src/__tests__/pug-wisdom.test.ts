import { describe, it, expect } from "vitest";
import {
  getRandomMessage,
  getPugMoodEmoji,
  PUG_IDLE_MESSAGES,
  PUG_COMPLETE_MESSAGES,
} from "@/lib/pug-wisdom";

describe("pug wisdom", () => {
  describe("getRandomMessage", () => {
    it("returns a string from the given array", () => {
      const messages = ["hello", "world", "pug"];
      const result = getRandomMessage(messages);
      expect(messages).toContain(result);
    });

    it("returns the only element from a single-element array", () => {
      expect(getRandomMessage(["only one"])).toBe("only one");
    });

    it("works with PUG_IDLE_MESSAGES", () => {
      const result = getRandomMessage(PUG_IDLE_MESSAGES);
      expect(PUG_IDLE_MESSAGES).toContain(result);
    });

    it("works with PUG_COMPLETE_MESSAGES", () => {
      const result = getRandomMessage(PUG_COMPLETE_MESSAGES);
      expect(PUG_COMPLETE_MESSAGES).toContain(result);
    });
  });

  describe("getPugMoodEmoji", () => {
    it("returns 'sleeping' when total tasks is 0", () => {
      expect(getPugMoodEmoji(0, 0)).toBe("sleeping");
    });

    it("returns 'celebrating' when all tasks completed", () => {
      expect(getPugMoodEmoji(10, 10)).toBe("celebrating");
    });

    it("returns 'excited' at 75% completion", () => {
      expect(getPugMoodEmoji(8, 6)).toBe("excited");
    });

    it("returns 'happy' at 50% completion", () => {
      expect(getPugMoodEmoji(10, 5)).toBe("happy");
    });

    it("returns 'idle' at low completion", () => {
      expect(getPugMoodEmoji(10, 1)).toBe("idle");
    });
  });
});
