"use client";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  icon: string;
  delay: number;
}

const SPARKLE_EMOJIS = ["Sparkles", "Heart", "Star", "🌟", "💫", "PawPrint", "💕", "Gem", "🦋", "🔮", "Moon", "Heart"];

const createSparkle = (): Sparkle => ({
  id: Date.now() + Math.random(),
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 10 + Math.random() * 16,
  icon: SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)],
  delay: Math.random() * 2,
});

export default function SparkleEffect() {
  const [sparkles, setSparkles] = useState<Sparkle[]>(() => {
    return typeof window !== "undefined" ? Array.from({ length: 20 }, () => createSparkle()) : [];
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles((prev) => [...prev.slice(-22), createSparkle()]);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute"
            style={{ left: `${s.x}%`, top: `${s.y}%`, fontSize: `${s.size}px` }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{ opacity: [0, 0.4, 0], scale: [0, 1, 0], rotate: [0, 180] }}
            transition={{ duration: 4.5, delay: s.delay, ease: "easeInOut" }}
          >
            <DynamicIcon name={s.icon} className="w-5 h-5" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
