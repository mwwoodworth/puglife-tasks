"use client";

import { motion } from "framer-motion";
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
  activeCategory,
  activePriority,
  showCompleted,
  sortBy,
  onCategoryChange,
  onPriorityChange,
  onShowCompletedChange,
  onSortChange,
  taskCounts,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => onCategoryChange("all")}
          className={`category-pill inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeCategory === "all"
              ? "bg-gradient-to-r from-pug-dark to-pug-brown text-white shadow-md"
              : "bg-white/50 text-pug-dark/60 hover:bg-white/70"
          }`}
        >
          🐶 All {taskCounts.all > 0 && `(${taskCounts.all})`}
        </button>
        {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG.personal][]).map(
          ([key, config]) => (
            <button
              key={key}
              onClick={() => onCategoryChange(key)}
              className={`category-pill inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === key
                  ? `bg-gradient-to-r ${config.gradient} text-white shadow-md`
                  : "bg-white/50 text-pug-dark/60 hover:bg-white/70"
              }`}
            >
              {config.emoji}{" "}
              {(taskCounts[key] || 0) > 0 && `(${taskCounts[key]})`}
            </button>
          )
        )}
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Priority filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-pug-dark/40 uppercase tracking-wider">
            Priority:
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => onPriorityChange("all")}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                activePriority === "all"
                  ? "bg-pug-dark text-white"
                  : "bg-white/40 text-pug-dark/50 hover:bg-white/60"
              }`}
            >
              All
            </button>
            {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG.paw][]).map(
              ([key, config]) => (
                <button
                  key={key}
                  onClick={() => onPriorityChange(key)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    activePriority === key
                      ? `${config.className} text-white`
                      : "bg-white/40 text-pug-dark/50 hover:bg-white/60"
                  }`}
                >
                  {config.emoji}
                </button>
              )
            )}
          </div>
        </div>

        <div className="h-4 w-px bg-pug-tan/30" />

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-pug-dark/40 uppercase tracking-wider">
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
            className="bg-white/50 rounded-lg px-2 py-1 text-[11px] font-semibold text-pug-dark/70 border border-pug-tan/20 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority</option>
            <option value="due">Due Date</option>
          </select>
        </div>

        <div className="h-4 w-px bg-pug-tan/30" />

        {/* Show completed toggle */}
        <motion.button
          onClick={() => onShowCompletedChange(!showCompleted)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
            showCompleted
              ? "bg-pug-green/80 text-white"
              : "bg-white/40 text-pug-dark/50"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          {showCompleted ? "✅ Showing Done" : "👻 Hiding Done"}
        </motion.button>
      </div>
    </div>
  );
}
