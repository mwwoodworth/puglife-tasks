"use client";

import { motion } from "framer-motion";

const equipAnim = { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: "spring" as const, stiffness: 350, damping: 20 } };

export function GlassesLayer({ id }: { id: string }) {
  switch (id) {
    case "glasses-sun":
      return (
        <motion.g {...equipAnim}>
          {/* Bridge */}
          <path d="M135,150 Q150,145 165,150" fill="none" stroke="#1e293b" strokeWidth="2" />
          {/* Left lens */}
          <ellipse cx="120" cy="152" rx="18" ry="14" fill="#1e293b" opacity="0.85" stroke="#0f172a" strokeWidth="1.5" />
          {/* Right lens */}
          <ellipse cx="180" cy="152" rx="18" ry="14" fill="#1e293b" opacity="0.85" stroke="#0f172a" strokeWidth="1.5" />
          {/* Arms */}
          <line x1="102" y1="150" x2="88" y2="145" stroke="#1e293b" strokeWidth="2" />
          <line x1="198" y1="150" x2="212" y2="145" stroke="#1e293b" strokeWidth="2" />
          {/* Shine */}
          <ellipse cx="112" cy="148" rx="5" ry="3" fill="white" opacity="0.15" />
          <ellipse cx="172" cy="148" rx="5" ry="3" fill="white" opacity="0.15" />
        </motion.g>
      );
    case "glasses-heart":
      return (
        <motion.g {...equipAnim}>
          <path d="M135,150 Q150,146 165,150" fill="none" stroke="#ec4899" strokeWidth="2" />
          {/* Left heart lens */}
          <path d="M120,145 Q108,132 108,148 Q108,158 120,165 Q132,158 132,148 Q132,132 120,145" fill="#f472b6" opacity="0.75" stroke="#ec4899" strokeWidth="1.5" />
          {/* Right heart lens */}
          <path d="M180,145 Q168,132 168,148 Q168,158 180,165 Q192,158 192,148 Q192,132 180,145" fill="#f472b6" opacity="0.75" stroke="#ec4899" strokeWidth="1.5" />
          <line x1="108" y1="148" x2="90" y2="143" stroke="#ec4899" strokeWidth="2" />
          <line x1="192" y1="148" x2="210" y2="143" stroke="#ec4899" strokeWidth="2" />
        </motion.g>
      );
    case "glasses-star":
      return (
        <motion.g {...equipAnim}>
          <path d="M135,150 Q150,146 165,150" fill="none" stroke="#eab308" strokeWidth="2" />
          {/* Left star — simplified 5-point */}
          <polygon points="120,138 124,148 135,148 126,154 130,165 120,158 110,165 114,154 105,148 116,148" fill="#fbbf24" opacity="0.8" stroke="#eab308" strokeWidth="1" />
          {/* Right star */}
          <polygon points="180,138 184,148 195,148 186,154 190,165 180,158 170,165 174,154 165,148 176,148" fill="#fbbf24" opacity="0.8" stroke="#eab308" strokeWidth="1" />
          <line x1="105" y1="148" x2="90" y2="143" stroke="#eab308" strokeWidth="2" />
          <line x1="195" y1="148" x2="210" y2="143" stroke="#eab308" strokeWidth="2" />
        </motion.g>
      );
    case "glasses-reading":
      return (
        <motion.g {...equipAnim}>
          <path d="M135,152 Q150,148 165,152" fill="none" stroke="#78716c" strokeWidth="1.5" />
          <rect x="105" y="143" width="30" height="20" rx="3" fill="none" stroke="#78716c" strokeWidth="1.5" />
          <rect x="165" y="143" width="30" height="20" rx="3" fill="none" stroke="#78716c" strokeWidth="1.5" />
          <line x1="105" y1="150" x2="90" y2="147" stroke="#78716c" strokeWidth="1.5" />
          <line x1="195" y1="150" x2="210" y2="147" stroke="#78716c" strokeWidth="1.5" />
          {/* Lens glare */}
          <line x1="110" y1="148" x2="115" y2="145" stroke="white" strokeWidth="0.5" opacity="0.3" />
          <line x1="170" y1="148" x2="175" y2="145" stroke="white" strokeWidth="0.5" opacity="0.3" />
        </motion.g>
      );
    case "glasses-aviator":
      return (
        <motion.g {...equipAnim}>
          <path d="M135,150 Q150,146 165,150" fill="none" stroke="#d4af37" strokeWidth="2" />
          {/* Teardrop shape lenses */}
          <path d="M105,145 Q120,135 135,145 Q135,162 120,168 Q105,162 105,145" fill="#4a3728" opacity="0.7" stroke="#d4af37" strokeWidth="1.5" />
          <path d="M165,145 Q180,135 195,145 Q195,162 180,168 Q165,162 165,145" fill="#4a3728" opacity="0.7" stroke="#d4af37" strokeWidth="1.5" />
          <line x1="105" y1="148" x2="88" y2="142" stroke="#d4af37" strokeWidth="1.5" />
          <line x1="195" y1="148" x2="212" y2="142" stroke="#d4af37" strokeWidth="1.5" />
          {/* Gradient shine */}
          <ellipse cx="115" cy="148" rx="6" ry="4" fill="white" opacity="0.1" />
          <ellipse cx="175" cy="148" rx="6" ry="4" fill="white" opacity="0.1" />
        </motion.g>
      );
    case "glasses-nerd":
      return (
        <motion.g {...equipAnim}>
          <path d="M135,152 Q150,148 165,152" fill="none" stroke="#1e293b" strokeWidth="2.5" />
          {/* Thick round frames */}
          <circle cx="120" cy="152" r="17" fill="none" stroke="#1e293b" strokeWidth="3" />
          <circle cx="180" cy="152" r="17" fill="none" stroke="#1e293b" strokeWidth="3" />
          <line x1="103" y1="150" x2="88" y2="145" stroke="#1e293b" strokeWidth="2.5" />
          <line x1="197" y1="150" x2="212" y2="145" stroke="#1e293b" strokeWidth="2.5" />
          {/* Lens shine */}
          <ellipse cx="113" cy="148" rx="4" ry="6" fill="white" opacity="0.08" />
          <ellipse cx="173" cy="148" rx="4" ry="6" fill="white" opacity="0.08" />
          {/* Tape on bridge */}
          <rect x="146" y="146" width="8" height="5" rx="1" fill="#fde68a" opacity="0.6" />
        </motion.g>
      );
    default:
      return null;
  }
}
