"use client";

import { motion } from "framer-motion";

interface ProgressBoneProps {
  completed: number;
  total: number;
}

export default function ProgressBone({ completed, total }: ProgressBoneProps) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Progress</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-pug-dark/70">{completed}/{total}</span>
          <motion.span key={pct} initial={{ scale: 0.5 }} animate={{ scale: 1 }}
            className="text-xs font-extrabold text-transparent bg-gradient-to-r from-purple-500 to-fuchsia-500 bg-clip-text"
          >{pct}%</motion.span>
        </div>
      </div>
      <div className="relative h-5 bg-purple-100/60 rounded-full overflow-hidden border border-purple-200/30">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
        </motion.div>
        {pct > 0 && (
          <motion.span
            className="absolute top-1/2 -translate-y-1/2 text-xs z-10"
            animate={{ left: `${Math.max(pct - 5, 2)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >🐾</motion.span>
        )}
      </div>
      {total > 0 && (
        <div className="flex justify-between mt-1 px-0.5">
          {[0, 25, 50, 75, 100].map((m) => (
            <span key={m} className={`text-xs ${pct >= m ? "opacity-100" : "opacity-20"}`}>
              {m === 100 ? "🏆" : m >= 75 ? "🍖" : m >= 50 ? "🦴" : m >= 25 ? "🐾" : "🐕"}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
