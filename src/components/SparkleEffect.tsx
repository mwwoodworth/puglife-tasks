"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
  delay: number;
}

const SPARKLE_EMOJIS = ["✨", "💖", "⭐", "🌟", "💫", "🐾", "💕", "🦴"];

export default function SparkleEffect() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const createSparkle = useCallback((): Sparkle => {
    return {
      id: Date.now() + Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 12 + Math.random() * 16,
      emoji: SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)],
      delay: Math.random() * 2,
    };
  }, []);

  useEffect(() => {
    // Create initial sparkles
    setSparkles(Array.from({ length: 12 }, () => createSparkle()));

    const interval = setInterval(() => {
      setSparkles((prev) => {
        const newSparkles = prev.slice(-14);
        return [...newSparkles, createSparkle()];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [createSparkle]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              fontSize: `${sparkle.size}px`,
            }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration: 4,
              delay: sparkle.delay,
              ease: "easeInOut",
            }}
          >
            {sparkle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
