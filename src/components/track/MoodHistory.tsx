"use client";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

import { motion } from "framer-motion";
import { MoodLevel, MOOD_CONFIG } from "@/lib/types";

interface MoodHistoryProps {
  last30Days: { date: string; mood: MoodLevel | null }[];
  weekAverage: number | null;
  todayMood: MoodLevel | null;
  onLogMood: (mood: MoodLevel) => void;
}

const MOOD_OPTIONS: MoodLevel[] = [5, 4, 3, 2, 1];

export default function MoodHistory({ last30Days, weekAverage, todayMood, onLogMood }: MoodHistoryProps) {
  return (
    <div className="rounded-2xl bg-purple-900/30 border border-purple-500/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-purple-200 flex items-center gap-2">
          <span>🎭</span> Mood Tracker
        </h3>
        {weekAverage !== null && (
          <span className="text-xs text-purple-400 font-bold">
            Week avg: {weekAverage.toFixed(1)}/5
          </span>
        )}
      </div>

      {/* Today's Mood Selector */}
      <div className="mb-4">
        <p className="text-[10px] text-purple-400 font-bold mb-2 uppercase tracking-wider">
          {todayMood ? "Today's Mood" : "How are you feeling?"}
        </p>
        <div className="flex justify-center gap-2">
          {MOOD_OPTIONS.map((mood) => {
            const config = MOOD_CONFIG[mood];
            const isSelected = todayMood === mood;
            return (
              <motion.button
                key={mood}
                onClick={() => onLogMood(mood)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
                  isSelected
                    ? "bg-purple-500/20 border border-purple-400/30"
                    : "border border-transparent"
                }`}
                whileTap={{ scale: 1.1 }}
              >
                <DynamicIcon name={config.icon} className={`text-xl ${isSelected ? "" : "opacity-60"}`} />
                <span className="text-[8px] text-purple-400 font-medium">{config.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 30-Day Grid */}
      <div>
        <p className="text-[10px] text-purple-400 font-bold mb-2 uppercase tracking-wider">Last 30 Days</p>
        <div className="grid grid-cols-10 gap-1">
          {last30Days.map((day) => {
            const config = day.mood ? MOOD_CONFIG[day.mood] : null;
            return (
              <motion.div
                key={day.date}
                className="w-full aspect-square rounded-sm"
                style={{
                  backgroundColor: config ? config.color : "rgba(139,92,246,0.1)",
                  opacity: config ? 0.8 : 0.3,
                }}
                title={`${day.date}: ${config?.label || "No log"}`}
                whileHover={{ scale: 1.2 }}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-2 justify-center">
          {MOOD_OPTIONS.reverse().map((mood) => {
            const config = MOOD_CONFIG[mood];
            return (
              <div key={mood} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: config.color }} />
                <span className="text-[8px] text-purple-500">{config.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
