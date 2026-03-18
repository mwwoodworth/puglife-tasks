"use client";

import { motion } from "framer-motion";
import { getDailyAffirmation } from "@/lib/daily-content";

export default function DailyAffirmation() {
  const affirmation = getDailyAffirmation();

  const categoryEmojis: Record<string, string> = {
    encouragement: "🌟",
    persistence: "💪",
    "self-love": "💜",
    strength: "🔥",
    humor: "😄",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 text-center relative overflow-hidden"
    >
      {/* Decorative sparkles */}
      <motion.span className="absolute top-3 left-4 text-sm" animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity }}>✨</motion.span>
      <motion.span className="absolute top-4 right-5 text-sm" animate={{ rotate: [360, 0] }} transition={{ duration: 5, repeat: Infinity }}>💫</motion.span>
      <motion.span className="absolute bottom-3 left-8 text-xs" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 3, repeat: Infinity }}>⭐</motion.span>

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-2xl">{categoryEmojis[affirmation.category] || "💜"}</span>
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest">Pug of the Day</h3>
          <span className="text-2xl">🐶</span>
        </div>
        <motion.p
          className="text-base font-bold text-purple-800 leading-relaxed mb-3 max-w-xs mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          &ldquo;{affirmation.quote}&rdquo;
        </motion.p>
        <p className="text-[11px] text-purple-400 font-semibold">— {affirmation.author}</p>
      </div>
    </motion.div>
  );
}
