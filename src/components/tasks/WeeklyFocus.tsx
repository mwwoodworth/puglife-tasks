"use client";

import { getTodayFocus } from "@/lib/daily-reset-plan";

export default function WeeklyFocus() {
  const focus = getTodayFocus();
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-900/30 border border-purple-500/15">
      <span className="text-base">{focus.emoji}</span>
      <div>
        <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">{dayName} Focus</span>
        <p className="text-xs font-bold text-purple-200">{focus.area}</p>
      </div>
      <span className="text-[10px] text-purple-500 ml-auto">+ 1 load laundry</span>
    </div>
  );
}
