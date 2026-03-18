"use client";

import { motion } from "framer-motion";

interface DailyWinCheckProps {
  completedTasks: string[];
  onToggle: (id: string) => void;
}

const WIN_TASKS = [
  { id: "w1", label: "I fed myself", emoji: "💜" },
  { id: "w2", label: "I kept the house from getting worse", emoji: "💜" },
  { id: "w3", label: "I did enough", emoji: "💜" },
];

export default function DailyWinCheck({ completedTasks, onToggle }: DailyWinCheckProps) {
  const allDone = WIN_TASKS.every((t) => completedTasks.includes(t.id));

  return (
    <div className="rounded-2xl bg-purple-900/30 border border-purple-500/20 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🏆</span>
        <h3 className="text-sm font-bold text-purple-200">Daily Win Check</h3>
        {allDone && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-xs"
          >
            ✨
          </motion.span>
        )}
      </div>
      <div className="space-y-2">
        {WIN_TASKS.map((task) => {
          const done = completedTasks.includes(task.id);
          return (
            <motion.button
              key={task.id}
              onClick={() => onToggle(task.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                done ? "bg-purple-500/15" : "bg-purple-900/30 active:bg-purple-800/40"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  done
                    ? "bg-gradient-to-br from-purple-500 to-fuchsia-500 border-purple-400"
                    : "border-purple-500/40"
                }`}
                animate={done ? { scale: [1, 1.2, 1] } : {}}
              >
                {done && <span className="text-white text-[10px]">♥</span>}
              </motion.div>
              <span className={`text-sm font-medium ${done ? "text-purple-300" : "text-purple-200"}`}>
                {task.label}
              </span>
            </motion.button>
          );
        })}
      </div>
      {allDone && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-purple-400 font-medium text-center mt-3 italic"
        >
          You did enough today. Lollie is proud of you.
        </motion.p>
      )}
    </div>
  );
}
