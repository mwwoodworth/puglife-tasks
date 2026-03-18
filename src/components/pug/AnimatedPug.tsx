"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PugMood } from "@/lib/types";
import { useEffect, useState } from "react";

interface AnimatedPugProps {
  mood: PugMood;
  size?: number;
  onClick?: () => void;
}

export default function AnimatedPug({ mood, size = 120, onClick }: AnimatedPugProps) {
  const [hearts, setHearts] = useState<number[]>([]);

  useEffect(() => {
    if (mood === "celebrating" || mood === "love") {
      setHearts(Array.from({ length: 5 }, (_, i) => i));
      const t = setTimeout(() => setHearts([]), 2000);
      return () => clearTimeout(t);
    }
  }, [mood]);

  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const bodyR = s * 0.32;

  const bodyVariants = {
    sleeping: { y: [0, -2, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const } },
    idle: { y: [0, -4, 0], scale: [1, 1.01, 1], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const } },
    happy: { y: [0, -6, 0], transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const } },
    excited: { y: [0, -12, 0], scale: [1, 1.05, 1], transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" as const } },
    celebrating: { y: [0, -15, 0], rotate: [0, -3, 3, 0], transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" as const } },
    sad: { y: [0, -2, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const } },
    eating: { y: [0, 2, 0, 2, 0], transition: { duration: 0.4, repeat: Infinity, ease: "easeInOut" as const } },
    "working-out": { y: [0, -8, 0], scale: [1, 1.06, 1], transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" as const } },
    love: { y: [0, -5, 0], scale: [1, 1.03, 1], transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const } },
  };

  const isAsleep = mood === "sleeping";
  const isSad = mood === "sad";
  const isHappy = mood === "happy" || mood === "excited" || mood === "celebrating" || mood === "love";
  const isExcited = mood === "excited" || mood === "celebrating";
  const showTongue = mood === "happy" || mood === "eating" || mood === "excited";
  const showPartyHat = mood === "celebrating";
  const showDumbbell = mood === "working-out";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: s, height: s + 20 }}>
      {/* Floating hearts */}
      <AnimatePresence>
        {hearts.map((i) => (
          <motion.span
            key={`h-${i}-${mood}`}
            className="absolute text-lg pointer-events-none z-20"
            initial={{ opacity: 0, y: 0, x: (i - 2) * 20 }}
            animate={{ opacity: [0, 1, 0], y: -50, x: (i - 2) * 25 + (Math.random() - 0.5) * 15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, delay: i * 0.12 }}
            style={{ top: "10%" }}
          >
            {["💜", "✨", "💖", "⭐", "💕"][i]}
          </motion.span>
        ))}
      </AnimatePresence>

      <motion.svg
        viewBox={`0 0 ${s} ${s + 10}`}
        width={s}
        height={s + 10}
        animate={bodyVariants[mood]}
        onClick={onClick}
        className="cursor-pointer select-none drop-shadow-lg"
        whileTap={{ scale: 1.15 }}
      >
        {/* Shadow */}
        <ellipse cx={cx} cy={s - 4} rx={bodyR * 0.7} ry={4} fill="rgba(88, 28, 135, 0.08)" />

        {/* Tail */}
        {isExcited && (
          <motion.path
            d={`M${cx + bodyR * 0.7},${cy + bodyR * 0.3} Q${cx + bodyR * 1.2},${cy - bodyR * 0.3} ${cx + bodyR * 0.9},${cy - bodyR * 0.5}`}
            stroke="#D4A574"
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
            animate={{ d: [
              `M${cx + bodyR * 0.7},${cy + bodyR * 0.3} Q${cx + bodyR * 1.2},${cy - bodyR * 0.3} ${cx + bodyR * 0.9},${cy - bodyR * 0.5}`,
              `M${cx + bodyR * 0.7},${cy + bodyR * 0.3} Q${cx + bodyR * 1.3},${cy} ${cx + bodyR * 1.1},${cy - bodyR * 0.2}`,
              `M${cx + bodyR * 0.7},${cy + bodyR * 0.3} Q${cx + bodyR * 1.2},${cy - bodyR * 0.3} ${cx + bodyR * 0.9},${cy - bodyR * 0.5}`,
            ] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        )}

        {/* Back legs */}
        <ellipse cx={cx - bodyR * 0.45} cy={cy + bodyR * 0.85} rx={bodyR * 0.22} ry={bodyR * 0.3} fill="#D4A574" />
        <ellipse cx={cx + bodyR * 0.45} cy={cy + bodyR * 0.85} rx={bodyR * 0.22} ry={bodyR * 0.3} fill="#D4A574" />

        {/* Body */}
        <ellipse cx={cx} cy={cy + bodyR * 0.1} rx={bodyR} ry={bodyR * 0.85} fill="#E8C99B" />
        {/* Belly */}
        <ellipse cx={cx} cy={cy + bodyR * 0.25} rx={bodyR * 0.6} ry={bodyR * 0.55} fill="#F5E6D0" />

        {/* Front paws */}
        <ellipse cx={cx - bodyR * 0.4} cy={cy + bodyR * 0.75} rx={bodyR * 0.18} ry={bodyR * 0.12} fill="#D4A574" />
        <ellipse cx={cx + bodyR * 0.4} cy={cy + bodyR * 0.75} rx={bodyR * 0.18} ry={bodyR * 0.12} fill="#D4A574" />

        {/* Head */}
        <circle cx={cx} cy={cy - bodyR * 0.35} r={bodyR * 0.72} fill="#E8C99B" />

        {/* Ears */}
        <motion.ellipse
          cx={cx - bodyR * 0.55}
          cy={cy - bodyR * 0.7}
          rx={bodyR * 0.28}
          ry={bodyR * 0.35}
          fill="#8B6914"
          transform={`rotate(-15, ${cx - bodyR * 0.55}, ${cy - bodyR * 0.7})`}
          animate={isSad ? { ry: bodyR * 0.25, cy: cy - bodyR * 0.55 } : {}}
        />
        <motion.ellipse
          cx={cx + bodyR * 0.55}
          cy={cy - bodyR * 0.7}
          rx={bodyR * 0.28}
          ry={bodyR * 0.35}
          fill="#8B6914"
          transform={`rotate(15, ${cx + bodyR * 0.55}, ${cy - bodyR * 0.7})`}
          animate={isSad ? { ry: bodyR * 0.25, cy: cy - bodyR * 0.55 } : {}}
        />

        {/* Face mask (dark area) */}
        <ellipse cx={cx} cy={cy - bodyR * 0.15} rx={bodyR * 0.45} ry={bodyR * 0.38} fill="#3D2C0E" opacity={0.8} />

        {/* Eyes */}
        {mood === "love" ? (
          <>
            <text x={cx - bodyR * 0.2} y={cy - bodyR * 0.3} fontSize={bodyR * 0.32} textAnchor="middle">💜</text>
            <text x={cx + bodyR * 0.2} y={cy - bodyR * 0.3} fontSize={bodyR * 0.32} textAnchor="middle">💜</text>
          </>
        ) : isAsleep ? (
          <>
            <line x1={cx - bodyR * 0.3} y1={cy - bodyR * 0.35} x2={cx - bodyR * 0.1} y2={cy - bodyR * 0.35} stroke="white" strokeWidth={2.5} strokeLinecap="round" />
            <line x1={cx + bodyR * 0.1} y1={cy - bodyR * 0.35} x2={cx + bodyR * 0.3} y2={cy - bodyR * 0.35} stroke="white" strokeWidth={2.5} strokeLinecap="round" />
          </>
        ) : (
          <>
            <motion.g animate={!isSad ? { scaleY: [1, 1, 0.1, 1, 1] } : {}} transition={{ duration: 4, repeat: Infinity, times: [0, 0.92, 0.95, 0.98, 1] }}>
              <circle cx={cx - bodyR * 0.2} cy={cy - bodyR * 0.35} r={isHappy ? bodyR * 0.11 : bodyR * 0.09} fill="white" />
              <circle cx={cx + bodyR * 0.2} cy={cy - bodyR * 0.35} r={isHappy ? bodyR * 0.11 : bodyR * 0.09} fill="white" />
              <circle cx={cx - bodyR * 0.2} cy={cy - bodyR * 0.35} r={bodyR * 0.055} fill="#2D1B4E" />
              <circle cx={cx + bodyR * 0.2} cy={cy - bodyR * 0.35} r={bodyR * 0.055} fill="#2D1B4E" />
              {/* Sparkle in eyes */}
              <circle cx={cx - bodyR * 0.18} cy={cy - bodyR * 0.37} r={bodyR * 0.02} fill="white" />
              <circle cx={cx + bodyR * 0.22} cy={cy - bodyR * 0.37} r={bodyR * 0.02} fill="white" />
            </motion.g>
            {isSad && (
              <>
                <circle cx={cx - bodyR * 0.15} cy={cy - bodyR * 0.2} r={bodyR * 0.035} fill="#90cdf4" opacity={0.7} />
                <circle cx={cx + bodyR * 0.25} cy={cy - bodyR * 0.22} r={bodyR * 0.03} fill="#90cdf4" opacity={0.7} />
              </>
            )}
          </>
        )}

        {/* Nose */}
        <ellipse cx={cx} cy={cy - bodyR * 0.13} rx={bodyR * 0.1} ry={bodyR * 0.07} fill="#1a1a1a" />

        {/* Mouth */}
        {isHappy ? (
          <path
            d={`M${cx - bodyR * 0.12},${cy - bodyR * 0.04} Q${cx},${cy + bodyR * 0.08} ${cx + bodyR * 0.12},${cy - bodyR * 0.04}`}
            stroke="#1a1a1a"
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
          />
        ) : isSad ? (
          <path
            d={`M${cx - bodyR * 0.1},${cy - bodyR * 0.01} Q${cx},${cy - bodyR * 0.08} ${cx + bodyR * 0.1},${cy - bodyR * 0.01}`}
            stroke="#1a1a1a"
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
          />
        ) : !isAsleep ? (
          <path
            d={`M${cx - bodyR * 0.08},${cy - bodyR * 0.04} L${cx},${cy} L${cx + bodyR * 0.08},${cy - bodyR * 0.04}`}
            stroke="#1a1a1a"
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
          />
        ) : null}

        {/* Tongue */}
        {showTongue && (
          <motion.ellipse
            cx={cx + bodyR * 0.04}
            cy={cy + bodyR * 0.03}
            rx={bodyR * 0.06}
            ry={bodyR * 0.09}
            fill="#F472B6"
            animate={{ ry: [bodyR * 0.09, bodyR * 0.11, bodyR * 0.09] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}

        {/* Cheek blush */}
        {isHappy && (
          <>
            <circle cx={cx - bodyR * 0.35} cy={cy - bodyR * 0.18} r={bodyR * 0.08} fill="#F9A8D4" opacity={0.5} />
            <circle cx={cx + bodyR * 0.35} cy={cy - bodyR * 0.18} r={bodyR * 0.08} fill="#F9A8D4" opacity={0.5} />
          </>
        )}

        {/* Zzz for sleeping */}
        {isAsleep && (
          <>
            <motion.text
              x={cx + bodyR * 0.5} y={cy - bodyR * 0.6}
              fontSize={bodyR * 0.22} fill="#a78bfa" fontWeight="bold"
              animate={{ opacity: [0, 1, 0], y: [cy - bodyR * 0.6, cy - bodyR * 0.9] }}
              transition={{ duration: 2, repeat: Infinity }}
            >z</motion.text>
            <motion.text
              x={cx + bodyR * 0.65} y={cy - bodyR * 0.85}
              fontSize={bodyR * 0.28} fill="#c084fc" fontWeight="bold"
              animate={{ opacity: [0, 1, 0], y: [cy - bodyR * 0.85, cy - bodyR * 1.15] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >Z</motion.text>
            <motion.text
              x={cx + bodyR * 0.8} y={cy - bodyR * 1.1}
              fontSize={bodyR * 0.35} fill="#9333ea" fontWeight="bold"
              animate={{ opacity: [0, 1, 0], y: [cy - bodyR * 1.1, cy - bodyR * 1.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >Z</motion.text>
          </>
        )}

        {/* Party hat */}
        {showPartyHat && (
          <>
            <polygon
              points={`${cx - bodyR * 0.18},${cy - bodyR * 0.85} ${cx},${cy - bodyR * 1.35} ${cx + bodyR * 0.18},${cy - bodyR * 0.85}`}
              fill="url(#partyGrad)"
              stroke="#fbbf24"
              strokeWidth={1.5}
            />
            <circle cx={cx} cy={cy - bodyR * 1.35} r={bodyR * 0.06} fill="#fbbf24" />
            <defs>
              <linearGradient id="partyGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
          </>
        )}

        {/* Dumbbells for working out */}
        {showDumbbell && (
          <motion.g animate={{ rotate: [0, -15, 0, 15, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>
            <rect x={cx - bodyR * 1.05} y={cy + bodyR * 0.35} width={bodyR * 0.12} height={bodyR * 0.25} rx={2} fill="#9333ea" />
            <rect x={cx - bodyR * 1.05 + bodyR * 0.12} y={cy + bodyR * 0.42} width={bodyR * 0.5} height={bodyR * 0.1} rx={2} fill="#7e22ce" />
            <rect x={cx - bodyR * 1.05 + bodyR * 0.62} y={cy + bodyR * 0.35} width={bodyR * 0.12} height={bodyR * 0.25} rx={2} fill="#9333ea" />
          </motion.g>
        )}
      </motion.svg>
    </div>
  );
}
