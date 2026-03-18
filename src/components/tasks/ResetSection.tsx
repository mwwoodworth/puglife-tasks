"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResetSectionDef, ResetSectionId } from "@/lib/types";
import ResetTask from "./ResetTask";

interface ResetSectionProps {
  section: ResetSectionDef;
  completedTasks: string[];
  onToggleTask: (taskId: string) => void;
  isCurrentSection: boolean;
  sectionProgress: { total: number; done: number; percent: number };
}

export default function ResetSection({
  section, completedTasks, onToggleTask, isCurrentSection, sectionProgress,
}: ResetSectionProps) {
  const [expanded, setExpanded] = useState(isCurrentSection);
  const allDone = sectionProgress.done === sectionProgress.total;

  return (
    <motion.div
      layout
      className={`rounded-2xl overflow-hidden transition-all ${
        isCurrentSection
          ? "bg-purple-900/40 border border-purple-500/30 shadow-lg shadow-purple-500/10"
          : allDone
          ? "bg-purple-900/20 border border-emerald-500/20"
          : "bg-purple-900/20 border border-purple-500/15"
      }`}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{section.emoji}</span>
          <div>
            <h3 className={`text-sm font-bold ${allDone ? "text-emerald-400" : "text-purple-200"}`}>
              {section.title}
            </h3>
            {section.timeRange && (
              <span className="text-[10px] text-purple-400 font-medium">{section.timeRange}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Progress pills */}
          <div className="flex gap-0.5">
            {section.tasks.map((t) => (
              <div
                key={t.id}
                className={`w-2 h-2 rounded-full transition-all ${
                  completedTasks.includes(t.id)
                    ? "bg-gradient-to-r from-purple-400 to-fuchsia-400"
                    : "bg-purple-700/50"
                }`}
              />
            ))}
          </div>
          {allDone && <span className="text-xs">✅</span>}
          <motion.span
            className="text-purple-400 text-xs"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.span>
        </div>
      </button>

      {/* Expandable task list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-1.5">
              {section.tasks.map((task) => (
                <ResetTask
                  key={task.id}
                  task={task}
                  completed={completedTasks.includes(task.id)}
                  onToggle={() => onToggleTask(task.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
