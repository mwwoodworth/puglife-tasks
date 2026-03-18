"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WeightEntry, WeightGoalData } from "@/lib/types";
import { calculateBMI, getBMICategory } from "@/lib/weight-utils";

interface WeightStatsProps {
  entries: WeightEntry[];
  goal: WeightGoalData | null;
  onDeleteEntry: (id: string) => void;
}

export default function WeightStats({ entries, goal, onDeleteEntry }: WeightStatsProps) {
  const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latest = sorted[0];

  const bmi = latest && goal?.heightInches ? calculateBMI(latest.weight, goal.heightInches) : null;
  const bmiCat = bmi ? getBMICategory(bmi) : null;

  return (
    <div className="space-y-3">
      {/* BMI card */}
      {bmi && bmiCat && (
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-sm font-bold text-purple-600 mb-2 flex items-center gap-2"><span>🧮</span> BMI</h3>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-black text-purple-700">{bmi.toFixed(1)}</div>
            <div>
              <span className="text-sm font-bold">{bmiCat.emoji} {bmiCat.label}</span>
              <p className="text-[10px] text-purple-400">Based on your latest weight & height</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent entries */}
      {sorted.length > 0 && (
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-sm font-bold text-purple-600 mb-3 flex items-center gap-2"><span>📋</span> Recent Entries</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <AnimatePresence>
              {sorted.slice(0, 15).map((entry, i) => {
                const prev = sorted[i + 1];
                const diff = prev ? entry.weight - prev.weight : 0;
                return (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center justify-between py-2 border-b border-purple-100/40 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-purple-400 font-medium w-16">
                        {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <span className="text-sm font-bold text-purple-700">{entry.weight} lbs</span>
                      {diff !== 0 && (
                        <span className={`text-[10px] font-bold ${diff < 0 ? "text-green-500" : "text-red-400"}`}>
                          {diff > 0 ? "+" : ""}{diff.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.note && <span className="text-[10px] text-purple-300 max-w-[80px] truncate">{entry.note}</span>}
                      <button onClick={() => onDeleteEntry(entry.id)} className="text-xs text-purple-300 active:text-red-400 p-1">✕</button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
