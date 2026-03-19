"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WeightGoalData } from "@/lib/types";
import { getLocalDateString } from "@/lib/date";

interface WeightGoalProps {
  goal: WeightGoalData | null;
  progress: { currentWeight: number; totalLost: number; percentToGoal: number; averagePerWeek: number; trend: string } | null;
  onSetGoal: (goal: WeightGoalData) => void;
}

export default function WeightGoal({ goal, progress, onSetGoal }: WeightGoalProps) {
  const [editing, setEditing] = useState(!goal);
  const [startW, setStartW] = useState(goal?.startWeight?.toString() || "");
  const [goalW, setGoalW] = useState(goal?.goalWeight?.toString() || "");
  const [height, setHeight] = useState(goal?.heightInches?.toString() || "");

  const handleSave = () => {
    const sw = parseFloat(startW);
    const gw = parseFloat(goalW);
    if (!sw || !gw || sw <= gw) return;
    onSetGoal({
      startWeight: sw,
      goalWeight: gw,
      startDate: goal?.startDate || getLocalDateString(),
      heightInches: height ? parseInt(height) : undefined,
    });
    setEditing(false);
  };

  if (editing || !goal) {
    return (
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-purple-200 flex items-center gap-2">
          <span>🎯</span> Set Your Goal
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold text-purple-400 mb-1 block uppercase tracking-wider">Start Weight</label>
            <input type="number" step="0.1" value={startW} onChange={(e) => setStartW(e.target.value)}
              placeholder="180" inputMode="decimal"
              className="w-full bg-purple-900/40 rounded-xl px-3 py-2.5 text-sm font-semibold border border-purple-500/30" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-purple-400 mb-1 block uppercase tracking-wider">Goal Weight</label>
            <input type="number" step="0.1" value={goalW} onChange={(e) => setGoalW(e.target.value)}
              placeholder="150" inputMode="decimal"
              className="w-full bg-purple-900/40 rounded-xl px-3 py-2.5 text-sm font-semibold border border-purple-500/30" />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-purple-400 mb-1 block uppercase tracking-wider">Height (inches, for BMI — optional)</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)}
            placeholder='e.g. 65 for 5&apos;5"' inputMode="numeric"
            className="w-full bg-purple-900/40 rounded-xl px-3 py-2.5 text-sm border border-purple-500/30" />
        </div>
        <button onClick={handleSave}
          disabled={!startW || !goalW || parseFloat(startW) <= parseFloat(goalW)}
          className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-bold py-3 rounded-xl text-sm active:scale-[0.98] transition-all disabled:opacity-40 shadow-lg"
        >Set Goal 🎯</button>
      </div>
    );
  }

  const pct = progress?.percentToGoal || 0;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-purple-200 flex items-center gap-2"><span>🎯</span> Goal Progress</h3>
        <button onClick={() => setEditing(true)} className="text-[10px] text-purple-400 font-bold">Edit</button>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="45" fill="none" stroke="url(#ringGrad)" strokeWidth="8"
              strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-purple-200">{pct}%</span>
            <span className="text-[9px] text-purple-400 font-bold">there!</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-purple-400 font-medium">Lost</span>
            <span className="font-bold text-purple-200">{progress?.totalLost.toFixed(1)} lbs</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-purple-400 font-medium">Current</span>
            <span className="font-bold text-purple-200">{progress?.currentWeight.toFixed(1)} lbs</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-purple-400 font-medium">Goal</span>
            <span className="font-bold text-fuchsia-400">{goal.goalWeight} lbs</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-purple-400 font-medium">Avg/Week</span>
            <span className="font-bold text-purple-200">{progress?.averagePerWeek.toFixed(1)} lbs</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-purple-400 font-medium">Trend</span>
            <span className={`font-bold ${progress?.trend === "losing" ? "text-emerald-400" : progress?.trend === "gaining" ? "text-red-400" : "text-purple-300"}`}>
              {progress?.trend === "losing" ? "Losing" : progress?.trend === "gaining" ? "Gaining" : "Steady"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
