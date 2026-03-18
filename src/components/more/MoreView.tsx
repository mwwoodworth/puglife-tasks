"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import EncouragementWall from "../motivation/EncouragementWall";
import DailyAffirmation from "../motivation/DailyAffirmation";
import StreakDisplay from "../motivation/StreakDisplay";
import { StreakData } from "@/lib/types";

interface MoreViewProps {
  streak: StreakData;
  favorites: string[];
  onToggleFavorite: (message: string) => void;
  muted: boolean;
  onToggleMute: () => void;
}

export default function MoreView({ streak, favorites, onToggleFavorite, muted, onToggleMute }: MoreViewProps) {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="space-y-3 animate-slide-up">
      {/* Sound Settings */}
      <div className="rounded-2xl bg-purple-900/30 border border-purple-500/20 p-4">
        <h3 className="text-sm font-bold text-purple-200 mb-3 flex items-center gap-2">
          <span>🔊</span> Settings
        </h3>
        <button
          onClick={onToggleMute}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl bg-purple-900/30 border border-purple-500/15"
        >
          <span className="text-xs font-bold text-purple-300">Sound Effects</span>
          <motion.span
            className="text-lg"
            whileTap={{ scale: 1.2 }}
          >
            {muted ? "🔇" : "🔊"}
          </motion.span>
        </button>
      </div>

      {/* Streak */}
      <StreakDisplay streak={streak} />

      {/* Affirmation */}
      <DailyAffirmation />

      {/* Encouragement Wall */}
      <EncouragementWall favorites={favorites} onToggleFavorite={onToggleFavorite} />

      {/* About */}
      <div className="rounded-2xl bg-purple-900/20 border border-purple-500/10 p-4">
        <button
          onClick={() => setShowAbout(!showAbout)}
          className="flex items-center justify-between w-full"
        >
          <h3 className="text-sm font-bold text-purple-200 flex items-center gap-2">
            <span>💜</span> About Lollie Life
          </h3>
          <span className="text-purple-400 text-xs">{showAbout ? "▲" : "▼"}</span>
        </button>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 space-y-2 overflow-hidden"
          >
            <p className="text-xs text-purple-300 leading-relaxed">
              Made with all the love for Danielle — from Lollie (and Matt) with snuggles.
            </p>
            <p className="text-xs text-purple-300 leading-relaxed">
              Your personal pug-powered life companion. Daily resets from your plan,
              water tracking, mood logging, rewards, and endless encouragement from Lollie.
            </p>
            <p className="text-[10px] text-purple-500 mt-2">
              v5.1 &middot; Lollie Life
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
