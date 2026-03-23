"use client";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

import { motion } from "framer-motion";
import { RewardsState } from "@/lib/types";
import { LEVELS, ACHIEVEMENTS, OUTFITS, getLevelProgress } from "@/lib/rewards-engine";

interface RewardsViewProps {
  state: RewardsState;
  onEquipOutfit: (id: string | null) => void;
  onUnlockOutfit: (id: string) => void;
}

export default function RewardsView({ state, onEquipOutfit, onUnlockOutfit }: RewardsViewProps) {
  const lp = getLevelProgress(state.totalTreatsEarned);

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Level + Treats Header */}
      <div className="rounded-2xl bg-purple-900/40 border border-purple-500/25 p-5 text-center">
        <motion.span className="text-4xl block mb-2" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          {lp.currentLevel.icon}
        </motion.span>
        <h2 className="text-xl font-black text-purple-200">Level {lp.currentLevel.level}: {lp.currentLevel.name}</h2>
        <p className="text-xs text-purple-400 font-bold mt-1">🍖 {state.treats} treats available</p>

        {/* XP Bar */}
        {lp.nextLevel && (
          <div className="mt-3">
            <div className="h-3 rounded-full bg-purple-900/50 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${lp.progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-purple-400">{lp.progressPercent}%</span>
              <span className="text-[9px] text-purple-400">{lp.treatsToNext} treats to {lp.nextLevel.name}</span>
            </div>
          </div>
        )}
        {!lp.nextLevel && (
          <p className="text-xs text-fuchsia-400 font-bold mt-2">MAX LEVEL! You are the Ultimate Pug Mom! 🏆</p>
        )}
      </div>

      {/* All Levels */}
      <div className="rounded-2xl bg-purple-900/30 border border-purple-500/20 p-4">
        <h3 className="text-sm font-bold text-purple-200 mb-3 flex items-center gap-2"><span>📊</span> Levels</h3>
        <div className="space-y-1.5">
          {LEVELS.map((level) => {
            const reached = state.level >= level.level;
            return (
              <div key={level.level} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${reached ? "bg-purple-500/10" : ""}`}>
                <DynamicIcon name={level.icon} className={`text-base ${reached ? "" : "opacity-30"}`} />
                <span className={`text-xs font-bold flex-1 ${reached ? "text-purple-200" : "text-purple-500"}`}>
                  Lv{level.level} {level.name}
                </span>
                <span className="text-[10px] text-purple-400">{level.treatsRequired} treats</span>
                {reached && <span className="text-[10px] text-emerald-400">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-2xl bg-purple-900/30 border border-purple-500/20 p-4">
        <h3 className="text-sm font-bold text-purple-200 mb-3 flex items-center gap-2"><span>🏅</span> Achievements</h3>
        <div className="grid grid-cols-3 gap-2">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = state.achievements.includes(achievement.id);
            return (
              <motion.div
                key={achievement.id}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center ${
                  unlocked
                    ? "bg-purple-500/15 border-purple-400/30"
                    : "bg-purple-900/20 border-purple-500/10 opacity-50"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <DynamicIcon name={achievement.icon} className={`text-2xl ${unlocked ? "" : "grayscale"}`} />
                <span className="text-[9px] font-bold text-purple-200 leading-tight">{achievement.name}</span>
                {!unlocked && (
                  <span className="text-[8px] text-purple-500">🔒</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Outfits */}
      <div className="rounded-2xl bg-purple-900/30 border border-purple-500/20 p-4">
        <h3 className="text-sm font-bold text-purple-200 mb-3 flex items-center gap-2"><span>👗</span> Lollie&apos;s Outfits</h3>
        <div className="grid grid-cols-4 gap-2">
          {/* None option */}
          <motion.button
            onClick={() => onEquipOutfit(null)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl border ${
              !state.equippedOutfit
                ? "bg-purple-500/15 border-purple-400/30"
                : "bg-purple-900/20 border-purple-500/10"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">🐾</span>
            <span className="text-[8px] font-bold text-purple-300">None</span>
          </motion.button>

          {OUTFITS.map((outfit) => {
            const unlocked = state.unlockedOutfits.includes(outfit.id);
            const equipped = state.equippedOutfit === outfit.id;
            const canAfford = state.treats >= outfit.treatsRequired;

            return (
              <motion.button
                key={outfit.id}
                onClick={() => {
                  if (unlocked) {
                    onEquipOutfit(equipped ? null : outfit.id);
                  } else if (canAfford) {
                    onUnlockOutfit(outfit.id);
                  }
                }}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border ${
                  equipped
                    ? "bg-purple-500/20 border-fuchsia-400/40"
                    : unlocked
                    ? "bg-purple-900/20 border-purple-500/20"
                    : "bg-purple-900/10 border-purple-500/10 opacity-60"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <DynamicIcon name={outfit.icon} className="text-xl" />
                <span className="text-[8px] font-bold text-purple-300">{outfit.name}</span>
                {!unlocked && (
                  <span className="text-[7px] text-purple-500">🍖{outfit.treatsRequired}</span>
                )}
                {equipped && (
                  <span className="text-[7px] text-fuchsia-400 font-bold">EQUIPPED</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Total Stats */}
      <div className="rounded-2xl bg-purple-900/20 border border-purple-500/10 p-3 text-center">
        <p className="text-xs text-purple-400">
          Total earned: <span className="font-bold text-purple-200">🍖 {state.totalTreatsEarned}</span>
          {" "} &middot; {" "}
          Achievements: <span className="font-bold text-purple-200">{state.achievements.length}/{ACHIEVEMENTS.length}</span>
        </p>
      </div>
    </div>
  );
}
