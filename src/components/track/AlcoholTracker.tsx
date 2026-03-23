"use client";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

import { motion } from "framer-motion";
import { AlcoholDrinkType } from "@/lib/types";

interface AlcoholTrackerProps {
  todayCount: number;
  last7Days: { date: string; count: number }[];
  onAddDrink: (type: AlcoholDrinkType) => void;
  onRemoveLast: () => void;
}

const drinkButtons: { type: AlcoholDrinkType; icon: string; label: string; std: string }[] = [
  { type: "beer", icon: "Beer", label: "Beer", std: "1" },
  { type: "wine", icon: "WineGlass", label: "Wine", std: "1" },
  { type: "cocktail", icon: "GlassWater", label: "Cocktail", std: "1.5" },
  { type: "shot", icon: "Martini", label: "Shot", std: "1" },
];

export default function AlcoholTracker({ todayCount, last7Days, onAddDrink, onRemoveLast }: AlcoholTrackerProps) {
  const maxCount = Math.max(4, ...last7Days.map((d) => d.count));
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="rounded-2xl bg-purple-900/30 border border-purple-500/20 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-purple-200 flex items-center gap-2">
          <span>🍷</span> Drinks Today
        </h3>
        <span className="text-lg font-black text-amber-400">{todayCount}</span>
      </div>

      <p className="text-[10px] text-purple-500">No judgment here! Lollie tracks with love 💜</p>

      {/* Drink buttons */}
      <div className="grid grid-cols-4 gap-2">
        {drinkButtons.map((btn) => (
          <motion.button
            key={btn.type}
            onClick={() => onAddDrink(btn.type)}
            className="flex flex-col items-center gap-0.5 p-2 rounded-xl bg-purple-900/30 border border-purple-500/15 transition-all"
            whileTap={{ scale: 0.9 }}
          >
            <DynamicIcon name={btn.icon} className="text-xl" />
            <span className="text-[9px] font-bold text-purple-300">{btn.label}</span>
            <span className="text-[8px] text-purple-500">{btn.std} std</span>
          </motion.button>
        ))}
      </div>

      {/* Undo */}
      {todayCount > 0 && (
        <button
          onClick={onRemoveLast}
          className="text-[10px] text-purple-500 font-bold w-full text-center"
        >
          Undo last drink
        </button>
      )}

      {/* 7-day chart */}
      <div className="space-y-1">
        <h4 className="text-[10px] font-bold text-purple-400">Last 7 Days</h4>
        <div className="flex items-end gap-1.5 h-[60px]">
          {last7Days.map((day, i) => {
            const pct = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
            const dayOfWeek = new Date(day.date + "T12:00:00").getDay();
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-0.5">
                <motion.div
                  className="w-full rounded-t-md bg-gradient-to-t from-amber-600 to-amber-400"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(pct, 2)}%` }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                />
                <span className="text-[8px] text-purple-500 font-bold">{dayLabels[dayOfWeek]}</span>
                {day.count > 0 && (
                  <span className="text-[7px] text-amber-400">{day.count}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
