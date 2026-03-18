"use client";

import { motion } from "framer-motion";
import { DrinkType, SoundEffect } from "@/lib/types";

interface WaterTrackerProps {
  totalOz: number;
  goalOz: number;
  percent: number;
  count: number;
  goalReached: boolean;
  onAddDrink: (type: DrinkType) => void;
  onRemoveLast: () => void;
  playSound: (effect: SoundEffect) => void;
}

const DRINKS: { type: DrinkType; emoji: string; label: string }[] = [
  { type: "water", emoji: "💧", label: "Water" },
  { type: "coffee", emoji: "☕", label: "Coffee" },
  { type: "shake", emoji: "🥤", label: "Shake" },
  { type: "chocolate-milk", emoji: "🍫", label: "Choco" },
];

export default function WaterTracker({
  totalOz, goalOz, percent, count, goalReached,
  onAddDrink, onRemoveLast, playSound,
}: WaterTrackerProps) {
  // Bowl fill animation
  const fillHeight = Math.min(100, percent);

  return (
    <div className="rounded-2xl bg-purple-900/30 border border-purple-500/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-purple-200 flex items-center gap-2">
          <span>💧</span> Water Tracker
        </h3>
        <span className="text-xs text-purple-400 font-bold">{totalOz}oz / {goalOz}oz</span>
      </div>

      {/* Water Bowl Visual */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          {/* Bowl outline */}
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <defs>
              <clipPath id="bowlClip">
                <path d="M10,25 Q10,65 40,65 Q70,65 70,25 Z" />
              </clipPath>
            </defs>
            {/* Bowl shape */}
            <path d="M10,25 Q10,65 40,65 Q70,65 70,25" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="2" />
            {/* Water fill */}
            <motion.rect
              x="10" width="60" height="40"
              clipPath="url(#bowlClip)"
              fill="url(#waterGrad)"
              initial={{ y: 65 }}
              animate={{ y: 65 - (fillHeight / 100) * 40 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            {/* Wave */}
            <motion.path
              d={`M10,${65 - (fillHeight / 100) * 40} Q25,${62 - (fillHeight / 100) * 40} 40,${65 - (fillHeight / 100) * 40} Q55,${68 - (fillHeight / 100) * 40} 70,${65 - (fillHeight / 100) * 40}`}
              fill="none" stroke="rgba(96,165,250,0.4)" strokeWidth="1.5"
              animate={{ d: [
                `M10,${65 - (fillHeight / 100) * 40} Q25,${62 - (fillHeight / 100) * 40} 40,${65 - (fillHeight / 100) * 40} Q55,${68 - (fillHeight / 100) * 40} 70,${65 - (fillHeight / 100) * 40}`,
                `M10,${65 - (fillHeight / 100) * 40} Q25,${68 - (fillHeight / 100) * 40} 40,${65 - (fillHeight / 100) * 40} Q55,${62 - (fillHeight / 100) * 40} 70,${65 - (fillHeight / 100) * 40}`,
              ] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(96,165,250,0.6)" />
                <stop offset="100%" stopColor="rgba(139,92,246,0.6)" />
              </linearGradient>
            </defs>
          </svg>
          {goalReached && (
            <motion.span
              className="absolute -top-1 -right-1 text-lg"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              🎉
            </motion.span>
          )}
        </div>

        <div className="flex-1">
          <p className="text-2xl font-black text-purple-200">{percent}%</p>
          <p className="text-xs text-purple-400 font-medium">{count} drinks today</p>
          {goalReached && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-bold text-emerald-400 mt-1"
            >
              Goal reached! 🎉
            </motion.p>
          )}
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {DRINKS.map((drink) => (
          <motion.button
            key={drink.type}
            onClick={() => {
              onAddDrink(drink.type);
              playSound("water-gulp");
            }}
            className="flex flex-col items-center gap-1 bg-purple-900/40 rounded-xl py-2.5 border border-purple-500/20 active:bg-purple-800/40 transition-all"
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">{drink.emoji}</span>
            <span className="text-[9px] font-bold text-purple-300">{drink.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Undo */}
      {count > 0 && (
        <button
          onClick={onRemoveLast}
          className="w-full mt-2 text-[10px] text-purple-500 font-medium text-center py-1"
        >
          Undo last drink
        </button>
      )}
    </div>
  );
}
