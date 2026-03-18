"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task, SoundEffect, StepGoal } from "@/lib/types";
import { loadStepGoal, saveStepGoal, loadBadDayActive, saveBadDayActive } from "@/lib/storage";
import { getDailyAffirmation } from "@/lib/daily-content";
import GlassCard from "@/components/ui/GlassCard";

interface DashboardViewProps {
  tasks: Task[];
  onMoodChange: (mood: string, message: string) => void;
  playSound: (effect: SoundEffect) => void;
  onDailyReset: () => void;
}

const BAD_DAY_MESSAGES = [
  "Hey Danielle, it's okay to have a tough day. Lollie loves you unconditionally.",
  "Even queens have bad days. Take a breath, snuggle up, and know tomorrow is fresh.",
  "Lollie says: forget the to-do list. Today is about YOU. Rest, breathe, be gentle.",
  "Bad days don't last forever, but your strength does. Lollie is sending warm snuggles.",
  "It's okay to not be okay. Lollie's right here beside you, always.",
  "Sometimes the bravest thing you can do is rest. Lollie approves of naps.",
];

const GREETING_BY_HOUR = () => {
  const h = new Date().getHours();
  if (h < 5) return "Late night, beautiful";
  if (h < 12) return "Good morning, gorgeous";
  if (h < 17) return "Good afternoon, queen";
  if (h < 21) return "Good evening, beautiful";
  return "Sleepy time, love";
};

export default function DashboardView({ tasks, onMoodChange, playSound, onDailyReset }: DashboardViewProps) {
  const [stepGoal, setStepGoal] = useState<StepGoal>(loadStepGoal());
  const [badDayActive, setBadDayActive] = useState(false);
  const [showBadDayModal, setShowBadDayModal] = useState(false);
  const [badDayMessage, setBadDayMessage] = useState("");
  const [editingSteps, setEditingSteps] = useState(false);
  const [stepInput, setStepInput] = useState("");
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState("");

  useEffect(() => {
    setBadDayActive(loadBadDayActive());
  }, []);

  const todaysTasks = tasks.filter((t) => {
    if (t.completed) return false;
    if (!t.dueDate) return true;
    const due = new Date(t.dueDate);
    const today = new Date();
    return due.toDateString() === today.toDateString() || due < today;
  });
  const completedToday = tasks.filter((t) => {
    if (!t.completedAt) return false;
    return new Date(t.completedAt).toDateString() === new Date().toDateString();
  });

  const affirmation = getDailyAffirmation();
  const stepPct = stepGoal.dailyTarget > 0 ? Math.min(100, Math.round((stepGoal.currentSteps / stepGoal.dailyTarget) * 100)) : 0;

  const handleBadDay = useCallback(() => {
    const msg = BAD_DAY_MESSAGES[Math.floor(Math.random() * BAD_DAY_MESSAGES.length)];
    setBadDayMessage(msg);
    setShowBadDayModal(true);
    setBadDayActive(true);
    saveBadDayActive(true);
    onMoodChange("love", "Sending you ALL the love, Danielle.");
    playSound("sparkle");
  }, [onMoodChange, playSound]);

  const handleDailyReset = useCallback(() => {
    onDailyReset();
    playSound("celebration");
    onMoodChange("excited", "Fresh day, fresh start! Let's gooo!");
  }, [onDailyReset, playSound, onMoodChange]);

  const handleStepUpdate = useCallback(() => {
    const steps = parseInt(stepInput);
    if (!isNaN(steps) && steps >= 0) {
      const updated = { ...stepGoal, currentSteps: steps };
      setStepGoal(updated);
      saveStepGoal(updated);
      if (steps >= stepGoal.dailyTarget) {
        playSound("celebration");
        onMoodChange("celebrating", "STEP GOAL CRUSHED! Lollie is SO proud!");
      } else {
        playSound("sparkle");
      }
    }
    setEditingSteps(false);
    setStepInput("");
  }, [stepInput, stepGoal, playSound, onMoodChange]);

  const handleTargetUpdate = useCallback(() => {
    const target = parseInt(targetInput);
    if (!isNaN(target) && target > 0) {
      const updated = { ...stepGoal, dailyTarget: target };
      setStepGoal(updated);
      saveStepGoal(updated);
    }
    setEditingTarget(false);
    setTargetInput("");
  }, [targetInput, stepGoal]);

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <div className="space-y-3 animate-slide-up">
      {/* Greeting */}
      <GlassCard className="p-5 text-center relative overflow-hidden">
        <motion.div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 30%, rgba(168,85,247,0.3) 0%, transparent 60%)" }}
        />
        <div className="relative z-10">
          <motion.p className="text-xs font-bold text-purple-300 uppercase tracking-[0.2em] mb-1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >{dayName} &middot; {dateStr}</motion.p>
          <motion.h2 className="text-xl font-black gradient-text-sparkle mb-1"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >{GREETING_BY_HOUR()}, Danielle</motion.h2>
          <motion.p className="text-xs text-purple-200 font-medium"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >&ldquo;{affirmation.quote}&rdquo;</motion.p>
        </div>
      </GlassCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <GlassCard className="p-3 text-center">
          <div className="text-2xl font-black text-purple-200">{todaysTasks.length}</div>
          <div className="text-[10px] font-bold text-purple-400 uppercase">To Do</div>
        </GlassCard>
        <GlassCard className="p-3 text-center">
          <div className="text-2xl font-black text-purple-200">{completedToday.length}</div>
          <div className="text-[10px] font-bold text-purple-400 uppercase">Done Today</div>
        </GlassCard>
        <GlassCard className="p-3 text-center">
          <div className="text-2xl font-black text-purple-200">{stepPct}%</div>
          <div className="text-[10px] font-bold text-purple-400 uppercase">Steps</div>
        </GlassCard>
      </div>

      {/* Step Goals */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-purple-200 flex items-center gap-2">
            <span>👟</span> Step Goal
          </h3>
          <button
            onClick={() => { setEditingTarget(true); setTargetInput(String(stepGoal.dailyTarget)); }}
            className="text-[10px] text-purple-400 font-bold"
          >
            {stepGoal.dailyTarget.toLocaleString()} target
          </button>
        </div>

        {editingTarget && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="mb-3 flex gap-2">
            <input
              type="number"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="Daily target..."
              className="flex-1 bg-purple-900/40 rounded-xl px-3 py-2 text-sm border border-purple-500/30"
              autoFocus
            />
            <button onClick={handleTargetUpdate} className="px-3 py-2 bg-purple-600 rounded-xl text-xs font-bold text-white">Set</button>
          </motion.div>
        )}

        {/* Step progress ring */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none" stroke="url(#stepGrad)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - stepPct / 100) }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="stepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg">👟</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xl font-black text-purple-100">{stepGoal.currentSteps.toLocaleString()}</div>
            <div className="text-xs text-purple-400 font-medium">of {stepGoal.dailyTarget.toLocaleString()} steps</div>
            {!editingSteps ? (
              <button
                onClick={() => { setEditingSteps(true); setStepInput(String(stepGoal.currentSteps)); }}
                className="mt-2 text-xs bg-purple-600/50 hover:bg-purple-600/70 text-purple-200 font-bold px-3 py-1.5 rounded-full transition-all"
              >Update Steps</button>
            ) : (
              <div className="mt-2 flex gap-2">
                <input
                  type="number"
                  value={stepInput}
                  onChange={(e) => setStepInput(e.target.value)}
                  className="w-24 bg-purple-900/40 rounded-lg px-2 py-1 text-sm border border-purple-500/30"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") handleStepUpdate(); }}
                />
                <button onClick={handleStepUpdate} className="px-2 py-1 bg-purple-600 rounded-lg text-xs font-bold text-white">OK</button>
              </div>
            )}
          </div>
        </div>

        {/* Step history mini bar chart */}
        {stepGoal.history.length > 0 && (
          <div className="mt-3 flex items-end gap-1 h-10">
            {stepGoal.history.slice(-7).map((h, i) => {
              const pct = Math.min(100, Math.round((h.steps / stepGoal.dailyTarget) * 100));
              return (
                <motion.div
                  key={h.date}
                  className="flex-1 rounded-t-sm"
                  style={{
                    background: pct >= 100 ? "linear-gradient(to top, #8b5cf6, #ec4899)" : "rgba(139,92,246,0.3)",
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(4, pct)}%` }}
                  transition={{ delay: i * 0.05 }}
                />
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {/* Bad Day Button */}
        <motion.button
          onClick={handleBadDay}
          className={`p-4 rounded-2xl text-center transition-all ${
            badDayActive
              ? "bg-gradient-to-br from-pink-500/30 to-purple-600/30 border border-pink-400/30"
              : "bg-purple-800/30 border border-purple-500/20 hover:bg-purple-700/30"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl block mb-1">{badDayActive ? "💜" : "🫂"}</span>
          <span className="text-xs font-bold text-purple-200 block">
            {badDayActive ? "Lollie Loves You" : "Bad Day?"}
          </span>
          <span className="text-[10px] text-purple-400 block mt-0.5">
            {badDayActive ? "Comfort mode on" : "Tap for comfort"}
          </span>
        </motion.button>

        {/* Daily Reset */}
        <motion.button
          onClick={handleDailyReset}
          className="p-4 rounded-2xl text-center bg-purple-800/30 border border-purple-500/20 hover:bg-purple-700/30 transition-all"
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl block mb-1">🔄</span>
          <span className="text-xs font-bold text-purple-200 block">Daily Reset</span>
          <span className="text-[10px] text-purple-400 block mt-0.5">Fresh start</span>
        </motion.button>
      </div>

      {/* Today's Top Tasks Preview */}
      {todaysTasks.length > 0 && (
        <GlassCard className="p-4">
          <h3 className="text-sm font-bold text-purple-200 mb-2 flex items-center gap-2">
            <span>📋</span> Up Next
          </h3>
          <div className="space-y-2">
            {todaysTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                <span className="text-purple-200 font-medium truncate">{task.title}</span>
              </div>
            ))}
            {todaysTasks.length > 3 && (
              <p className="text-[10px] text-purple-400 font-bold">+{todaysTasks.length - 3} more</p>
            )}
          </div>
        </GlassCard>
      )}

      {/* Bad Day Comfort Modal */}
      <AnimatePresence>
        {showBadDayModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/60 backdrop-blur-sm p-4"
            onClick={() => setShowBadDayModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              className="glass-card rounded-3xl p-8 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.span
                className="text-6xl block mb-4"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >💜</motion.span>
              <h2 className="text-lg font-black gradient-text-sparkle mb-3">Lollie Says...</h2>
              <p className="text-sm text-purple-200 font-medium mb-5 leading-relaxed">
                {badDayMessage}
              </p>
              <button
                onClick={() => setShowBadDayModal(false)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full text-sm shadow-lg active:scale-95 transition-all"
              >Thanks, Lollie 🐾</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
