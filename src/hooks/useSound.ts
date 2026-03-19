"use client";

import { useState, useCallback } from "react";
import { SoundEffect } from "@/lib/types";
import { soundEngine } from "@/lib/sound-engine";
import { loadSoundMuted, saveSoundMuted } from "@/lib/storage";

export function useSound() {
  const [muted, setMuted] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = loadSoundMuted();
      soundEngine.setMuted(saved, false);
      return saved;
    }
    return true;
  });

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      soundEngine.setMuted(next);
      saveSoundMuted(next);
      if (!next) soundEngine.play("sparkle"); // play a little sound when unmuting
      return next;
    });
  }, []);

  const play = useCallback((effect: SoundEffect) => {
    soundEngine.play(effect);
  }, []);

  return { muted, toggleMute, play };
}
