"use client";

import { motion, AnimatePresence, type TargetAndTransition } from "framer-motion";
import { PugMood } from "@/lib/types";
import { useEffect, useState } from "react";
import Image from "next/image";

interface AnimatedPugProps {
  mood: PugMood;
  size?: number;
  onClick?: () => void;
  outfit?: string | null;
}

const PUG_IMAGES: Record<PugMood, string> = {
  idle: "/pugs/pug-idle.webp",
  sleeping: "/pugs/pug-sleeping.webp",
  happy: "/pugs/pug-happy.webp",
  excited: "/pugs/pug-excited.webp",
  celebrating: "/pugs/pug-celebrating.webp",
  sad: "/pugs/pug-sad.webp",
  love: "/pugs/pug-love.webp",
  eating: "/pugs/pug-eating.webp",
  "working-out": "/pugs/pug-workout.webp",
};

const PUG_FALLBACKS: Record<PugMood, string> = {
  idle: "/pugs/pug-idle.png",
  sleeping: "/pugs/pug-sleeping.png",
  happy: "/pugs/pug-happy.png",
  excited: "/pugs/pug-excited.png",
  celebrating: "/pugs/pug-celebrating.png",
  sad: "/pugs/pug-sad.png",
  love: "/pugs/pug-love.png",
  eating: "/pugs/pug-eating.png",
  "working-out": "/pugs/pug-workout.png",
};

const OUTFIT_EMOJIS: Record<string, string> = {
  crown: "👑",
  sunglasses: "🕶️",
  "party-hat": "🎉",
  cape: "🦸",
  "bow-tie": "🎀",
  "flower-crown": "🌸",
  pajamas: "😴",
};

const bodyVariants: Record<PugMood, TargetAndTransition> = {
  sleeping: { y: [0, -3, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const } },
  idle: { y: [0, -5, 0], scale: [1, 1.02, 1], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const } },
  happy: { y: [0, -8, 0], transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const } },
  excited: { y: [0, -14, 0], scale: [1, 1.06, 1], rotate: [0, -2, 2, 0], transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" as const } },
  celebrating: { y: [0, -16, 0], rotate: [0, -4, 4, 0], scale: [1, 1.08, 1], transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" as const } },
  sad: { y: [0, -2, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const } },
  eating: { y: [0, 3, 0, 3, 0], transition: { duration: 0.4, repeat: Infinity, ease: "easeInOut" as const } },
  "working-out": { y: [0, -10, 0], scale: [1, 1.07, 1], transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" as const } },
  love: { y: [0, -6, 0], scale: [1, 1.04, 1], transition: { duration: 1, repeat: Infinity, ease: "easeInOut" as const } },
};

export default function AnimatedPug({ mood, size = 120, onClick, outfit }: AnimatedPugProps) {
  const [particles, setParticles] = useState<{ id: number; emoji: string; x: number; delay: number }[]>([]);

  useEffect(() => {
    const emojis: Record<string, string[]> = {
      celebrating: ["🎉", "🎊", "⭐", "✨", "💜"],
      love: ["💜", "💕", "💖", "💗", "✨"],
      excited: ["✨", "⭐", "💫", "💜", "🌟"],
      happy: ["✨", "💜", "🌟"],
    };
    const set = emojis[mood];
    if (set) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setParticles(set.map((emoji, i) => ({ id: Date.now() + i, emoji, x: (i - 2) * 22, delay: i * 0.1 })));
      const t = setTimeout(() => setParticles([]), 2500);
      return () => clearTimeout(t);
    }
  }, [mood]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size + 20 }}>
      {/* Floating particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute text-base pointer-events-none z-20"
            initial={{ opacity: 0, y: 0, x: p.x }}
            animate={{ opacity: [0, 1, 0], y: -55, x: p.x + ((p.id % 10) / 10 - 0.5) * 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, delay: p.delay }}
            style={{ top: "5%" }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Pug glow — soft purple circle behind */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.9,
          height: size * 0.9,
          background: mood === "love" ? "radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)"
            : mood === "celebrating" ? "radial-gradient(circle, rgba(250,204,21,0.25) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Animated Pug Image — circular with feathered edge */}
      <motion.div
        animate={bodyVariants[mood]}
        onClick={onClick}
        className="cursor-pointer select-none relative z-10"
        whileTap={{ scale: 1.15 }}
        style={{ width: size, height: size }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mood}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full rounded-full overflow-hidden"
            style={{
              maskImage: "radial-gradient(circle, black 55%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(circle, black 55%, transparent 75%)",
            }}
          >
            <picture>
              <source srcSet={PUG_IMAGES[mood]} type="image/webp" />
              <Image
                src={PUG_FALLBACKS[mood]}
                alt={`Lollie the pug - ${mood}`}
                width={512}
                height={512}
                className="w-full h-full object-cover drop-shadow-xl"
                priority
                unoptimized
              />
            </picture>
          </motion.div>
        </AnimatePresence>

        {/* Outfit overlay */}
        {outfit && OUTFIT_EMOJIS[outfit] && (
          <motion.span
            className="absolute -top-2 -right-1 text-xl z-30 drop-shadow-lg"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {OUTFIT_EMOJIS[outfit]}
          </motion.span>
        )}
      </motion.div>

      {/* Sleeping zzz overlay */}
      {mood === "sleeping" && (
        <div className="absolute top-0 right-0 z-20 pointer-events-none">
          <motion.span
            className="absolute text-lg font-bold text-purple-400"
            style={{ right: -5, top: 10 }}
            animate={{ opacity: [0, 1, 0], y: [0, -20], x: [0, 8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >z</motion.span>
          <motion.span
            className="absolute text-xl font-bold text-purple-500"
            style={{ right: -12, top: -5 }}
            animate={{ opacity: [0, 1, 0], y: [0, -25], x: [0, 10] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >Z</motion.span>
          <motion.span
            className="absolute text-2xl font-bold text-purple-600"
            style={{ right: -18, top: -20 }}
            animate={{ opacity: [0, 1, 0], y: [0, -30], x: [0, 12] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >Z</motion.span>
        </div>
      )}
    </div>
  );
}
