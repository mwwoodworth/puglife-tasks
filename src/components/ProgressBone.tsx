"use client";

import { motion } from "framer-motion";

interface ProgressBoneProps {
  completed: number;
  total: number;
}

export default function ProgressBone({ completed, total }: ProgressBoneProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-pug-dark/60 uppercase tracking-wider">
          Progress
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-pug-dark/80">
            {completed}/{total} tasks
          </span>
          <motion.span
            key={percentage}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-xs font-extrabold text-transparent bg-gradient-to-r from-pug-pink to-pug-purple bg-clip-text"
          >
            {percentage}%
          </motion.span>
        </div>
      </div>

      {/* Bone-shaped progress bar */}
      <div className="relative h-6 bg-white/40 rounded-full overflow-hidden border border-pug-tan/20">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-pug-pink via-pug-purple to-pug-blue rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </motion.div>

        {/* Paw print marker */}
        {percentage > 0 && (
          <motion.span
            className="absolute top-1/2 -translate-y-1/2 text-sm z-10"
            animate={{ left: `${Math.max(percentage - 4, 1)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            🐾
          </motion.span>
        )}

        {/* Bone decorations on the bar */}
        <div className="absolute inset-y-0 left-2 flex items-center text-[10px] opacity-30">
          🦴
        </div>
        <div className="absolute inset-y-0 right-2 flex items-center text-[10px] opacity-30">
          🦴
        </div>
      </div>

      {/* Milestone treats */}
      {total > 0 && (
        <div className="flex justify-between mt-1.5 px-1">
          {[0, 25, 50, 75, 100].map((milestone) => (
            <motion.span
              key={milestone}
              className={`text-sm ${
                percentage >= milestone ? "opacity-100" : "opacity-20"
              }`}
              animate={
                percentage >= milestone
                  ? { scale: [1, 1.2, 1] }
                  : {}
              }
              transition={{ duration: 0.3 }}
            >
              {milestone === 100 ? "🏆" : milestone >= 75 ? "🍖" : milestone >= 50 ? "🦴" : milestone >= 25 ? "🐾" : "🐕"}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}
