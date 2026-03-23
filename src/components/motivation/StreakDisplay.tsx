"use client";

import { motion } from "framer-motion";
import { StreakData } from "@/lib/types";
import { STREAK_MILESTONES } from "@/lib/daily-content";

interface StreakDisplayProps {
  streak: StreakData;
}

export default function StreakDisplay({ streak }: StreakDisplayProps) {
  const nextMilestone = STREAK_MILESTONES.find((m) => m.days > streak.current);
  const achieved = STREAK_MILESTONES.filter((m) => m.days <= streak.current);

  return (
    <div className="glass-card rounded-2xl p-4">
      <h3 className="text-sm font-bold text-purple-200 mb-3 flex items-center gap-2">
        <span>🔥</span> Your Streak
      </h3>

      <div className="flex items-center gap-4 mb-4">
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <div className="text-center">
              <div className="text-2xl font-black text-white">{streak.current}</div>
              <div className="text-[8px] font-bold text-white/80 uppercase">days</div>
            </div>
          </div>
          {streak.current >= 3 && (
            <motion.span className="absolute -top-1 -right-1 text-xl" animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 1, repeat: Infinity }}>
              🔥
            </motion.span>
          )}
        </motion.div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-purple-400 font-medium">Current streak</span>
            <span className="font-bold text-purple-200">{streak.current} day{streak.current !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-purple-400 font-medium">Longest ever</span>
            <span className="font-bold text-purple-200">{streak.longest} day{streak.longest !== 1 ? "s" : ""}</span>
          </div>
          {nextMilestone && (
            <div className="flex justify-between text-xs">
              <span className="text-purple-400 font-medium">Next milestone</span>
              <span className="font-bold text-fuchsia-400">{nextMilestone.days} days</span>
            </div>
          )}
        </div>
      </div>

      {STREAK_MILESTONES.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {STREAK_MILESTONES.map((m) => {
            const isAchieved = streak.current >= m.days;
            return (
              <motion.div
                key={m.days}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                  isAchieved
                    ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-md shadow-purple-500/20"
                    : "bg-purple-900/40 text-purple-500 border border-purple-600/30"
                }`}
                animate={isAchieved ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isAchieved ? "Star" : "🔒"} {m.days}d
              </motion.div>
            );
          })}
        </div>
      )}

      {achieved.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {achieved.slice(-3).reverse().map((m) => (
            <div key={m.days} className="text-xs text-purple-300 font-medium bg-purple-800/30 rounded-lg px-3 py-2 border border-purple-600/20">
              ⭐ {m.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
