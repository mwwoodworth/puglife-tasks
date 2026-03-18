"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category, Priority, CATEGORY_CONFIG, PRIORITY_CONFIG } from "@/lib/types";

interface FilterBarProps {
  activeCategory: Category | "all";
  activePriority: Priority | "all";
  showCompleted: boolean;
  sortBy: "newest" | "oldest" | "priority" | "due";
  onCategoryChange: (cat: Category | "all") => void;
  onPriorityChange: (pri: Priority | "all") => void;
  onShowCompletedChange: (show: boolean) => void;
  onSortChange: (sort: "newest" | "oldest" | "priority" | "due") => void;
  taskCounts: Record<string, number>;
}

export default function FilterBar({
  activeCategory, activePriority, showCompleted, sortBy,
  onCategoryChange, onPriorityChange, onShowCompletedChange, onSortChange, taskCounts,
}: FilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
        <button
          onClick={() => onCategoryChange("all")}
          className={`category-pill shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeCategory === "all" ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md" : "bg-purple-800/30 text-purple-300"
          }`}
        >🐶 All{taskCounts.all > 0 ? ` (${taskCounts.all})` : ""}</button>
        {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG.personal][]).map(([key, config]) => (
          <button key={key} onClick={() => onCategoryChange(key)}
            className={`category-pill shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === key ? `bg-gradient-to-r ${config.gradient} text-white shadow-md` : "bg-purple-800/30 text-purple-300"
            }`}
          >{config.emoji}{(taskCounts[key] || 0) > 0 ? ` ${taskCounts[key]}` : ""}</button>
        ))}
      </div>

      <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
        {expanded ? "Less" : "More filters"}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 overflow-hidden"
          >
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Priority:</span>
              <button onClick={() => onPriorityChange("all")}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${activePriority === "all" ? "bg-purple-600 text-white" : "bg-purple-800/30 text-purple-300"}`}
              >All</button>
              {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG.paw][]).map(([key, config]) => (
                <button key={key} onClick={() => onPriorityChange(key)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${activePriority === key ? `${config.className} text-white` : "bg-purple-800/30 text-purple-300"}`}
                >{config.emoji}</button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select value={sortBy} onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
                className="bg-purple-900/40 rounded-lg px-2 py-1.5 text-[11px] font-bold text-purple-200 border border-purple-500/30"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">Priority</option>
                <option value="due">Due Date</option>
              </select>

              <button onClick={() => onShowCompletedChange(!showCompleted)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                  showCompleted ? "bg-purple-500/50 text-white" : "bg-purple-800/30 text-purple-400"
                }`}
              >{showCompleted ? "Done Shown" : "Done Hidden"}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
