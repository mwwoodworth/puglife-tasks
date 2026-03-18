"use client";

import { motion } from "framer-motion";
import { BAD_DAY_TASKS, BAD_DAY_MESSAGE, BAD_DAY_RULE } from "@/lib/daily-reset-plan";
import ResetTask from "./ResetTask";

interface BadDayModeProps {
  completedTasks: string[];
  onToggleTask: (taskId: string) => void;
  onDeactivate: () => void;
}

export default function BadDayMode({ completedTasks, onToggleTask, onDeactivate }: BadDayModeProps) {
  const done = BAD_DAY_TASKS.filter((t) => completedTasks.includes(t.id)).length;
  const total = BAD_DAY_TASKS.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Header card */}
      <div className="rounded-2xl bg-purple-900/40 border border-fuchsia-500/30 p-4 text-center">
        <span className="text-3xl block mb-2">💜</span>
        <h2 className="text-lg font-black text-purple-200 mb-1">Bad Day Survival Mode</h2>
        <p className="text-xs text-fuchsia-300 font-bold mb-2">Rule: {BAD_DAY_RULE}</p>
        <p className="text-xs text-purple-300">{BAD_DAY_MESSAGE}</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 px-2">
        <div className="flex-1 h-2 rounded-full bg-purple-900/50 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs font-bold text-purple-300">{done}/{total}</span>
      </div>

      {/* Simplified tasks */}
      <div className="space-y-1.5">
        {BAD_DAY_TASKS.map((task) => (
          <ResetTask
            key={task.id}
            task={task}
            completed={completedTasks.includes(task.id)}
            onToggle={() => onToggleTask(task.id)}
          />
        ))}
      </div>

      {/* Switch back button */}
      <button
        onClick={onDeactivate}
        className="w-full text-[10px] text-purple-500 font-medium py-2 text-center"
      >
        Switch back to full daily plan
      </button>
    </motion.div>
  );
}
