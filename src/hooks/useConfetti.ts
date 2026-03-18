"use client";

import { useCallback } from "react";

// Lazy import of canvas-confetti to avoid SSR issues
let confettiFn: ((opts?: Record<string, unknown>) => Promise<null> | null) | null = null;

async function getConfetti() {
  if (!confettiFn) {
    const mod = await import("canvas-confetti");
    confettiFn = mod.default as unknown as (opts?: Record<string, unknown>) => Promise<null> | null;
  }
  return confettiFn;
}

export function useConfetti() {
  const smallBurst = useCallback(async (origin?: { x: number; y: number }) => {
    const confetti = await getConfetti();
    confetti({
      particleCount: 25,
      spread: 50,
      origin: origin || { x: 0.5, y: 0.6 },
      colors: ["#a855f7", "#c084fc", "#e879f9", "#f0abfc", "#fbbf24"],
      scalar: 0.8,
    });
  }, []);

  const mediumBurst = useCallback(async () => {
    const confetti = await getConfetti();
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#a855f7", "#c084fc", "#e879f9", "#f0abfc", "#fbbf24", "#f472b6"],
    });
  }, []);

  const bigCelebration = useCallback(async () => {
    const confetti = await getConfetti();
    // Fire from both sides
    const defaults = {
      spread: 100,
      ticks: 80,
      gravity: 0.8,
      decay: 0.94,
      startVelocity: 30,
      colors: ["#a855f7", "#c084fc", "#e879f9", "#f0abfc", "#fbbf24", "#f472b6", "#818cf8"],
    };
    confetti({ ...defaults, particleCount: 50, origin: { x: 0.2, y: 0.5 } });
    confetti({ ...defaults, particleCount: 50, origin: { x: 0.8, y: 0.5 } });
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 40, origin: { x: 0.5, y: 0.3 } });
    }, 200);
  }, []);

  const waterConfetti = useCallback(async () => {
    const confetti = await getConfetti();
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#60a5fa", "#3b82f6", "#818cf8", "#a855f7", "#c084fc"],
      scalar: 0.9,
    });
  }, []);

  const levelUp = useCallback(async () => {
    const confetti = await getConfetti();
    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ["#a855f7", "#fbbf24", "#f472b6", "#818cf8", "#e879f9"];

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const achievementUnlock = useCallback(async () => {
    const confetti = await getConfetti();
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      colors: ["#fbbf24", "#f59e0b", "#a855f7", "#e879f9"],
      scalar: 1.2,
    });
  }, []);

  const dressUpConfetti = useCallback(async () => {
    const confetti = await getConfetti();
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#f472b6", "#fb923c", "#facc15", "#34d399", "#60a5fa", "#a855f7", "#e879f9"],
      scalar: 1.0,
    });
  }, []);

  const chatConfetti = useCallback(async () => {
    const confetti = await getConfetti();
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#f9a8d4", "#f0abfc", "#c4b5fd", "#fda4af"],
      scalar: 0.7,
    });
  }, []);

  const purchaseConfetti = useCallback(async () => {
    const confetti = await getConfetti();
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { x: 0.5, y: 0.45 },
      colors: ["#fbbf24", "#f59e0b", "#d97706", "#a855f7", "#e879f9"],
      scalar: 1.1,
    });
  }, []);

  return {
    smallBurst, mediumBurst, bigCelebration, waterConfetti, levelUp,
    achievementUnlock, dressUpConfetti, chatConfetti, purchaseConfetti,
  };
}
