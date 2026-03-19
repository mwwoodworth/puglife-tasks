import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { soundEngine } from "@/lib/sound-engine";
import type { SoundEffect } from "@/lib/types";

interface SoundState {
  muted: boolean;
  volume: number; // 0-1 master volume
  _hydrated: boolean;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  play: (effect: SoundEffect) => void;
}

export const useSoundStore = create<SoundState>()(
  persist(
    (set, get) => ({
      muted: true,
      volume: 1,
      _hydrated: false,
      toggleMute: () => {
        const next = !get().muted;
        soundEngine.setMuted(next);
        if (!next) soundEngine.play("sparkle");
        set({ muted: next });
      },
      setVolume: (v: number) => {
        soundEngine.setVolume(v);
        set({ volume: v });
      },
      play: (effect: SoundEffect) => {
        soundEngine.play(effect);
      },
    }),
    {
      name: "lollie-sound",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ muted: state.muted, volume: state.volume }),
    }
  )
);

// Sync engine on first hydration
if (typeof window !== "undefined") {
  const unsub = useSoundStore.subscribe((state) => {
    if (!state._hydrated) {
      soundEngine.setMuted(state.muted, false);
      soundEngine.setVolume(state.volume);
      useSoundStore.setState({ _hydrated: true });
      unsub();
    }
  });
}
