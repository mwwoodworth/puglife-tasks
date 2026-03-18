"use client";

import { motion } from "framer-motion";
import { SoundEffect, MoodLevel, AppTab } from "@/lib/types";
import { getCurrentResetSection, getTodayFocus } from "@/lib/daily-reset-plan";
import { getTimeGreetingPrefix } from "@/lib/lollie-personality";
import { getDailyAffirmation } from "@/lib/daily-content";
import ResetTask from "../tasks/ResetTask";

interface DashboardViewProps {
  completedTasks: string[];
  badDayMode: boolean;
  onToggleTask: (taskId: string) => void;
  onActivateBadDay: () => void;
  dayProgress: { total: number; done: number; percent: number };
  waterPercent: number;
  waterCount: number;
  streak: number;
  todayMood: MoodLevel | null;
  onLogMood: (mood: MoodLevel) => void;
  treats: number;
  onSwitchTab: (tab: AppTab) => void;
  playSound: (effect: SoundEffect) => void;
}

const MOOD_OPTIONS: { mood: MoodLevel; emoji: string; label: string }[] = [
  { mood: 5, emoji: "🤩", label: "Amazing" },
  { mood: 4, emoji: "😊", label: "Good" },
  { mood: 3, emoji: "😐", label: "Okay" },
  { mood: 2, emoji: "😔", label: "Rough" },
  { mood: 1, emoji: "😢", label: "Bad" },
];

export default function DashboardView({
  completedTasks, badDayMode, onToggleTask, onActivateBadDay,
  dayProgress, waterPercent, waterCount, streak, todayMood,
  onLogMood, treats, onSwitchTab, playSound,
}: DashboardViewProps) {
  const currentSection = getCurrentResetSection();
  const focus = getTodayFocus();
  const greeting = getTimeGreetingPrefix();
  const affirmation = getDailyAffirmation();
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" });

  // Progress ring
  const ringSize = 90;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (dayProgress.percent / 100) * circumference;

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Greeting + Affirmation */}
      <div className="rounded-2xl bg-purple-900/30 border border-purple-500/20 p-5 text-center relative overflow-hidden">
        <motion.div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 30%, rgba(168,85,247,0.3) 0%, transparent 60%)" }}
        />
        <div className="relative z-10">
          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] mb-1">{dayName} &middot; {dateStr}</p>
          <h2 className="text-xl font-black gradient-text-sparkle mb-2">{greeting}, Danielle</h2>
          <p className="text-xs text-purple-200 font-medium leading-relaxed">&ldquo;{affirmation.quote}&rdquo;</p>
        </div>
      </div>

      {/* Quick Stats + Progress Ring */}
      <div className="flex items-center justify-center gap-4">
        <div className="relative flex-shrink-0">
          <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
            <circle cx={ringSize / 2} cy={ringSize / 2} r={radius} fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="6" />
            <motion.circle
              cx={ringSize / 2} cy={ringSize / 2} r={radius} fill="none"
              stroke="url(#dashRingGrad)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={circumference}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
              transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
            />
            <defs>
              <linearGradient id="dashRingGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-purple-200">{dayProgress.percent}%</span>
            <span className="text-[8px] text-purple-400 font-bold">today</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => onSwitchTab("track")} className="flex items-center gap-1.5 bg-purple-900/30 rounded-xl px-3 py-2 border border-purple-500/15">
            <span className="text-sm">💧</span>
            <div className="text-left">
              <p className="text-xs font-bold text-purple-200">{waterCount}</p>
              <p className="text-[8px] text-purple-400">drinks</p>
            </div>
          </button>
          <div className="flex items-center gap-1.5 bg-purple-900/30 rounded-xl px-3 py-2 border border-purple-500/15">
            <span className="text-sm">🔥</span>
            <div>
              <p className="text-xs font-bold text-purple-200">{streak}</p>
              <p className="text-[8px] text-purple-400">streak</p>
            </div>
          </div>
          <button onClick={() => onSwitchTab("rewards")} className="flex items-center gap-1.5 bg-purple-900/30 rounded-xl px-3 py-2 border border-purple-500/15">
            <span className="text-sm">🍖</span>
            <div className="text-left">
              <p className="text-xs font-bold text-purple-200">{treats}</p>
              <p className="text-[8px] text-purple-400">treats</p>
            </div>
          </button>
          <div className="flex items-center gap-1.5 bg-purple-900/30 rounded-xl px-3 py-2 border border-purple-500/15">
            <span className="text-sm">{dayProgress.done === dayProgress.total && dayProgress.total > 0 ? "🌟" : "✅"}</span>
            <div>
              <p className="text-xs font-bold text-purple-200">{dayProgress.done}/{dayProgress.total}</p>
              <p className="text-[8px] text-purple-400">tasks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Check */}
      {!todayMood && (
        <div className="rounded-2xl bg-purple-900/30 border border-purple-500/20 p-3">
          <p className="text-xs font-bold text-purple-300 text-center mb-2">How are you feeling?</p>
          <div className="flex justify-center gap-3">
            {MOOD_OPTIONS.map((opt) => (
              <motion.button
                key={opt.mood}
                onClick={() => {
                  onLogMood(opt.mood);
                  playSound("sparkle");
                }}
                className="flex flex-col items-center gap-0.5"
                whileTap={{ scale: 1.2 }}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-[8px] text-purple-400 font-medium">{opt.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Today's Focus */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-900/20 border border-purple-500/10">
        <span>{focus.emoji}</span>
        <span className="text-xs font-bold text-purple-300">{dayName} Focus: {focus.area}</span>
      </div>

      {/* Current Reset Section */}
      {currentSection && !badDayMode && (
        <div className="rounded-2xl bg-purple-900/40 border border-purple-500/25 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{currentSection.emoji}</span>
            <div>
              <h3 className="text-sm font-bold text-purple-200">{currentSection.title}</h3>
              {currentSection.timeRange && (
                <span className="text-[10px] text-purple-400">{currentSection.timeRange}</span>
              )}
            </div>
            <motion.span
              className="ml-auto text-[10px] text-fuchsia-400 font-bold bg-fuchsia-500/20 px-2 py-0.5 rounded-full"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              NOW
            </motion.span>
          </div>
          <div className="space-y-1.5">
            {currentSection.tasks.map((task) => (
              <ResetTask
                key={task.id}
                task={task}
                completed={completedTasks.includes(task.id)}
                onToggle={() => {
                  onToggleTask(task.id);
                  playSound("task-complete");
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bad Day Mode — Prominent Activation */}
      {!badDayMode && (
        <motion.button
          onClick={onActivateBadDay}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-fuchsia-900/40 to-purple-900/40 border border-fuchsia-500/25 text-center"
          whileTap={{ scale: 0.97 }}
          whileHover={{ borderColor: "rgba(236,72,153,0.4)" }}
        >
          <p className="text-sm font-bold text-fuchsia-300">Rough day? Lollie&apos;s here. 💜</p>
          <p className="text-[10px] text-purple-400 mt-0.5">Switch to survival mode — something &gt; nothing</p>
        </motion.button>
      )}

      {/* Bad Day Banner — Active */}
      {badDayMode && (
        <div className="rounded-2xl bg-gradient-to-r from-fuchsia-900/50 to-purple-900/50 border border-fuchsia-500/30 p-3 text-center">
          <p className="text-xs font-bold text-fuchsia-300">Bad Day Mode 💜 Something &gt; Nothing</p>
          <p className="text-[10px] text-purple-300 mt-1">You showed up. That&apos;s enough.</p>
        </div>
      )}

      {/* View all tasks */}
      <button
        onClick={() => onSwitchTab("tasks")}
        className="w-full py-2 text-xs font-bold text-purple-400 text-center"
      >
        View full daily plan →
      </button>
    </div>
  );
}
