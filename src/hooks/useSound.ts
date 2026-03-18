"use client";

import { useState, useCallback, useEffect } from "react";
import { SoundEffect } from "@/lib/types";
import { soundEngine } from "@/lib/sound-engine";
import { loadSoundMuted, saveSoundMuted } from "@/lib/storage";

export function useSound() {
  const [muted, setMuted] = useState(true); // default muted until loaded

  useEffect(() => {
    const saved = loadSoundMuted();
    setMuted(saved);
    soundEngine.setMuted(saved);
  }, []);

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
