"use client";

import { motion } from "framer-motion";

interface SoundToggleProps {
  muted: boolean;
  onToggle: () => void;
}

export default function SoundToggle({ muted, onToggle }: SoundToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/60 backdrop-blur-md border border-purple-200/40 flex items-center justify-center shadow-md"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
    >
      <span className="text-lg">{muted ? "🔇" : "🔊"}</span>
    </motion.button>
  );
}
