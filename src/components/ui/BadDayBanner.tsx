"use client";

import { motion } from "framer-motion";

interface BadDayBannerProps {
  active: boolean;
}

export default function BadDayBanner({ active }: BadDayBannerProps) {
  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl bg-gradient-to-r from-fuchsia-900/40 to-purple-900/40 border border-fuchsia-500/20 mb-2"
    >
      <span className="text-[10px] font-bold text-fuchsia-300">Bad Day Mode 💜</span>
      <span className="text-[9px] text-purple-400">Something &gt; Nothing</span>
    </motion.div>
  );
}
