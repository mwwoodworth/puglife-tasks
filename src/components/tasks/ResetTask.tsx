"use client";

import { motion } from "framer-motion";
import { ResetTaskDef } from "@/lib/types";

interface ResetTaskProps {
  task: ResetTaskDef;
  completed: boolean;
  onToggle: () => void;
}

export default function ResetTask({ task, completed, onToggle }: ResetTaskProps) {
  return (
    <motion.button
      onClick={() => {
        onToggle();
        // Haptic feedback
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(completed ? 20 : 40);
        }
      }}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left ${
        completed
          ? "bg-purple-500/10 opacity-60"
          : "bg-purple-900/30 active:bg-purple-800/40"
      }`}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Checkbox */}
      <motion.div
        className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
          completed
            ? "bg-gradient-to-br from-purple-500 to-fuchsia-500 border-purple-400"
            : "border-purple-500/40 bg-purple-900/40"
        }`}
        animate={completed ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {completed && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-white text-xs font-bold"
          >
            ✓
          </motion.span>
        )}
      </motion.div>

      {/* Emoji + Label */}
      <span className="text-base flex-shrink-0">{task.emoji}</span>
      <span
        className={`text-sm font-medium flex-1 ${
          completed ? "text-purple-400 line-through" : "text-purple-200"
        }`}
      >
        {task.label}
      </span>
    </motion.button>
  );
}
