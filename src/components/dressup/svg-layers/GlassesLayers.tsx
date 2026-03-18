"use client";

import { motion } from "framer-motion";

const equipAnim = { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: "spring" as const, stiffness: 350, damping: 20 } };

export function GlassesLayer({ id }: { id: string }) {
  switch (id) {
    case "glasses-sun":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 3px 2px rgba(0,0,0,0.3))">
          <defs>
            <linearGradient id="lens-dark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="30%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          {/* Bridge */}
          <path d="M135,152 Q150,146 165,152" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          {/* Left lens */}
          <ellipse cx="118" cy="154" rx="20" ry="16" fill="url(#lens-dark)" stroke="#020617" strokeWidth="2" />
          <ellipse cx="118" cy="154" rx="20" ry="16" fill="url(#glare)" />
          {/* Right lens */}
          <ellipse cx="182" cy="154" rx="20" ry="16" fill="url(#lens-dark)" stroke="#020617" strokeWidth="2" />
          <ellipse cx="182" cy="154" rx="20" ry="16" fill="url(#glare)" />
          {/* Arms */}
          <line x1="98" y1="152" x2="84" y2="148" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <line x1="202" y1="152" x2="216" y2="148" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        </motion.g>
      );
    case "glasses-heart":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 3px 2px rgba(236,72,153,0.3))">
          <defs>
            <linearGradient id="lens-pink" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F472B6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#BE185D" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path d="M135,152 Q150,146 165,152" fill="none" stroke="#BE185D" strokeWidth="3" strokeLinecap="round" />
          {/* Left heart lens */}
          <path d="M118,146 Q106,133 106,149 Q106,159 118,166 Q130,159 130,149 Q130,133 118,146" fill="url(#lens-pink)" stroke="#9D174D" strokeWidth="2" />
          <path d="M110,146 Q115,140 120,146" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          {/* Right heart lens */}
          <path d="M182,146 Q170,133 170,149 Q170,159 182,166 Q194,159 194,149 Q194,133 182,146" fill="url(#lens-pink)" stroke="#9D174D" strokeWidth="2" />
          <path d="M174,146 Q179,140 184,146" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          {/* Arms */}
          <line x1="106" y1="149" x2="88" y2="146" stroke="#9D174D" strokeWidth="3" strokeLinecap="round" />
          <line x1="194" y1="149" x2="212" y2="146" stroke="#9D174D" strokeWidth="3" strokeLinecap="round" />
        </motion.g>
      );
    case "glasses-star":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 3px 2px rgba(234,179,8,0.3))">
          <defs>
            <linearGradient id="lens-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#CA8A04" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path d="M135,152 Q150,146 165,152" fill="none" stroke="#A16207" strokeWidth="3" strokeLinecap="round" />
          {/* Left star */}
          <polygon points="118,138 122,148 133,148 124,154 128,165 118,158 108,165 112,154 103,148 114,148" fill="url(#lens-gold)" stroke="#A16207" strokeWidth="2" strokeLinejoin="round" />
          {/* Right star */}
          <polygon points="182,138 186,148 197,148 188,154 192,165 182,158 172,165 176,154 167,148 178,148" fill="url(#lens-gold)" stroke="#A16207" strokeWidth="2" strokeLinejoin="round" />
          {/* Arms */}
          <line x1="103" y1="148" x2="88" y2="146" stroke="#A16207" strokeWidth="3" strokeLinecap="round" />
          <line x1="197" y1="148" x2="212" y2="146" stroke="#A16207" strokeWidth="3" strokeLinecap="round" />
        </motion.g>
      );
    case "glasses-reading":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 2px 1px rgba(0,0,0,0.15))">
          <path d="M135,152 Q150,148 165,152" fill="none" stroke="#44403C" strokeWidth="2.5" />
          <rect x="103" y="143" width="32" height="22" rx="4" fill="rgba(255,255,255,0.1)" stroke="#44403C" strokeWidth="2.5" />
          <rect x="165" y="143" width="32" height="22" rx="4" fill="rgba(255,255,255,0.1)" stroke="#44403C" strokeWidth="2.5" />
          <line x1="103" y1="152" x2="86" y2="148" stroke="#44403C" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="197" y1="152" x2="214" y2="148" stroke="#44403C" strokeWidth="2.5" strokeLinecap="round" />
          {/* Lens glare */}
          <path d="M108,146 L120,160 M113,146 L125,160" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          <path d="M170,146 L182,160 M175,146 L187,160" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        </motion.g>
      );
    case "glasses-aviator":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 3px 2px rgba(0,0,0,0.25))">
          <defs>
            <linearGradient id="lens-aviator" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#78350F" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#451A03" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="frame-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
          {/* Top bar & Bridge */}
          <path d="M110,145 Q150,142 190,145" fill="none" stroke="url(#frame-gold)" strokeWidth="2" />
          <path d="M135,152 Q150,148 165,152" fill="none" stroke="url(#frame-gold)" strokeWidth="2" />
          
          {/* Teardrop lenses */}
          <path d="M102,145 Q118,135 135,145 Q135,164 118,170 Q102,164 102,145" fill="url(#lens-aviator)" stroke="url(#frame-gold)" strokeWidth="2" />
          <path d="M165,145 Q182,135 198,145 Q198,164 182,170 Q165,164 165,145" fill="url(#lens-aviator)" stroke="url(#frame-gold)" strokeWidth="2" />
          
          {/* Arms */}
          <line x1="102" y1="148" x2="84" y2="144" stroke="url(#frame-gold)" strokeWidth="2" strokeLinecap="round" />
          <line x1="198" y1="148" x2="216" y2="144" stroke="url(#frame-gold)" strokeWidth="2" strokeLinecap="round" />
          
          {/* Gradient shine */}
          <path d="M108,145 Q118,142 125,148" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          <path d="M171,145 Q181,142 188,148" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        </motion.g>
      );
    case "glasses-nerd":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 3px 2px rgba(0,0,0,0.2))">
          <path d="M135,154 Q150,148 165,154" fill="none" stroke="#0F172A" strokeWidth="3" />
          {/* Thick round frames */}
          <circle cx="118" cy="154" r="18" fill="rgba(255,255,255,0.05)" stroke="#0F172A" strokeWidth="4" />
          <circle cx="182" cy="154" r="18" fill="rgba(255,255,255,0.05)" stroke="#0F172A" strokeWidth="4" />
          
          <line x1="100" y1="152" x2="84" y2="148" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <line x1="200" y1="152" x2="216" y2="148" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          
          {/* Tape on bridge */}
          <rect x="144" y="148" width="12" height="6" rx="1" fill="#FDE047" opacity="0.9" stroke="#CA8A04" strokeWidth="0.5" />
          
          {/* Swirl glare */}
          <path d="M108,144 A 8,8 0 0,1 122,144" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d="M172,144 A 8,8 0 0,1 186,144" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </motion.g>
      );
    default:
      return null;
  }
}