"use client";

import { motion, AnimatePresence } from "framer-motion";

interface TreatsCounterProps {
  count: number;
  level: number;
  levelName: string;
}

export default function TreatsCounter({ count, level, levelName }: TreatsCounterProps) {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="flex items-center gap-1.5 bg-purple-900/50 backdrop-blur-sm rounded-full px-3 py-1 border border-purple-500/20"
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          className="text-sm"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
        >
          🍖
        </motion.span>
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            className="text-xs font-black text-purple-200 tabular-nums"
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </motion.div>
      <div className="flex items-center gap-1 bg-purple-900/50 backdrop-blur-sm rounded-full px-2.5 py-1 border border-purple-500/20">
        <span className="text-[10px] font-bold text-purple-400">Lv{level}</span>
        <span className="text-[10px] font-bold text-purple-300">{levelName}</span>
      </div>
    </div>
  );
}
