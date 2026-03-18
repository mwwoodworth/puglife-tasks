"use client";

import { motion } from "framer-motion";
import { getEncouragementWall } from "@/lib/daily-content";

export default function EncouragementWall() {
  const messages = getEncouragementWall();

  return (
    <div className="glass-card rounded-2xl p-4">
      <h3 className="text-sm font-bold text-purple-200 mb-3 flex items-center gap-2">
        <span>💜</span> Lollie&apos;s Encouragement Wall
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {messages.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-gradient-to-br from-purple-800/40 to-fuchsia-800/30 rounded-xl p-3 text-center border border-purple-500/15"
          >
            <span className="text-xl block mb-1">{item.emoji}</span>
            <p className="text-[11px] font-bold text-purple-200">{item.message}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
