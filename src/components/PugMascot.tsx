"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface PugMascotProps {
  mood: "sleeping" | "idle" | "happy" | "excited" | "celebrating" | "love";
  message: string;
  streak?: number;
}

export default function PugMascot({ mood, message, streak = 0 }: PugMascotProps) {
  const [showBubble, setShowBubble] = useState(true);
  const [hearts, setHearts] = useState<number[]>([]);

  useEffect(() => {
    if (mood === "celebrating" || mood === "love") {
      setHearts(Array.from({ length: 6 }, (_, i) => i));
      const timer = setTimeout(() => setHearts([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [mood, message]);

  useEffect(() => {
    setShowBubble(true);
    const timer = setTimeout(() => setShowBubble(true), 100);
    return () => clearTimeout(timer);
  }, [message]);

  const pugSize = mood === "celebrating" ? "text-7xl" : "text-6xl";

  const pugAnimation = {
    sleeping: {
      animate: { y: [0, -3, 0], rotate: [0, -2, 0, 2, 0] },
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
    },
    idle: {
      animate: { y: [0, -6, 0] },
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
    },
    happy: {
      animate: { y: [0, -10, 0], rotate: [0, -3, 0, 3, 0] },
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const },
    },
    excited: {
      animate: { y: [0, -15, 0], scale: [1, 1.1, 1], rotate: [0, -5, 0, 5, 0] },
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" as const },
    },
    celebrating: {
      animate: { y: [0, -20, 0], scale: [1, 1.15, 1], rotate: [0, -8, 0, 8, 0] },
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" as const },
    },
    love: {
      animate: { y: [0, -8, 0], scale: [1, 1.08, 1] },
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const },
    },
  };

  const getPugFace = () => {
    switch (mood) {
      case "sleeping": return "😴";
      case "idle": return "🐶";
      case "happy": return "🐕";
      case "excited": return "🤩";
      case "celebrating": return "🥳";
      case "love": return "🥰";
      default: return "🐶";
    }
  };

  const anim = pugAnimation[mood];

  return (
    <div className="flex flex-col items-center gap-3 relative">
      {/* Floating hearts */}
      <AnimatePresence>
        {hearts.map((i) => (
          <motion.div
            key={`heart-${i}-${mood}`}
            className="absolute text-2xl pointer-events-none"
            initial={{ opacity: 0, y: 0, x: (i - 2.5) * 25 }}
            animate={{
              opacity: [0, 1, 0],
              y: -80 - Math.random() * 40,
              x: (i - 2.5) * 30 + (Math.random() - 0.5) * 20,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, delay: i * 0.15 }}
          >
            {["💖", "✨", "💕", "⭐", "💗", "🌟"][i]}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Streak badge */}
      {streak > 0 && (
        <motion.div
          className="absolute -top-2 -right-4 bg-gradient-to-r from-pug-gold to-amber-400 text-pug-dark text-xs font-bold px-2.5 py-1 rounded-full shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          🔥 {streak} day{streak > 1 ? "s" : ""}
        </motion.div>
      )}

      {/* The Pug */}
      <motion.div
        className={`${pugSize} select-none cursor-pointer`}
        animate={anim.animate}
        transition={anim.transition}
        whileTap={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
        role="img"
        aria-label={`Pug mascot feeling ${mood}`}
      >
        {getPugFace()}
      </motion.div>

      {/* Tail wagging indicator */}
      {(mood === "excited" || mood === "celebrating") && (
        <motion.span
          className="text-2xl absolute -bottom-1 -right-6"
          animate={{ rotate: [-20, 20, -20] }}
          transition={{ duration: 0.25, repeat: Infinity }}
        >
          💨
        </motion.span>
      )}

      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        {showBubble && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-2xl px-4 py-2.5 max-w-[280px] text-center relative"
          >
            {/* Speech bubble pointer */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/70 rotate-45 border-l border-t border-white/80" />
            <p className="text-sm font-medium text-pug-dark relative z-10">
              {message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
