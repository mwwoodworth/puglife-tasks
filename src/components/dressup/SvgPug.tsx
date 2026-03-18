"use client";

import { motion, AnimatePresence, TargetAndTransition } from "framer-motion";
import { PugMood, DressUpSlot } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

// SVG layer components
import { HatLayer } from "./svg-layers/HatLayers";
import { GlassesLayer } from "./svg-layers/GlassesLayers";
import { OutfitLayer } from "./svg-layers/OutfitLayers";
import { AccessoryLayer } from "./svg-layers/AccessoryLayers";
import { BackgroundLayer } from "./svg-layers/BackgroundLayers";

interface SvgPugProps {
  mood: PugMood;
  equipped: Record<DressUpSlot, string | null>;
  size?: number;
  onClick?: () => void;
  isTalking?: boolean;
  interactive?: boolean;
  showParticles?: boolean;
}

// ── Flat color palette (clean cartoon style) ──
const C = {
  body: "#F5E6D0",        // Cream/ivory fur
  bodyDark: "#E8D1B0",    // Slightly darker fur for shading
  mask: "#3A3A3A",        // Dark charcoal muzzle
  outline: "#1A1A1A",     // Bold black outlines
  nose: "#1A1A1A",        // Black nose
  eyeWhite: "#FFFFFF",    // Pure white eyes
  iris: "#2A1A10",        // Dark brown iris
  tongue: "#F08B9C",      // Pink tongue
  cheek: "#FFB0B0",       // Blush pink
  wrinkle: "#D4B896",     // Tan wrinkle lines
  earInner: "#6B4455",    // Dark pink inner ear
  pawPad: "#8B7355",      // Brown paw pads
  jawLine: "#D4B896",     // Neck fold color
} as const;

export default function SvgPug({
  mood,
  equipped,
  size = 120,
  onClick,
  isTalking = false,
  interactive = true,
  showParticles = false,
}: SvgPugProps) {
  const [blinking, setBlinking] = useState(false);
  const [tapReaction, setTapReaction] = useState<string | null>(null);

  // Auto-blink
  useEffect(() => {
    if (mood === "sleeping") return;
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 120);
    };
    const interval = setInterval(blink, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [mood]);

  const handleClick = useCallback(() => {
    if (!interactive) return;
    onClick?.();
    const reactions = ["bounce", "wiggle", "spin"];
    setTapReaction(reactions[Math.floor(Math.random() * reactions.length)]);
    setTimeout(() => setTapReaction(null), 600);
  }, [interactive, onClick]);

  const s = size / 120;
  const easeIO = "easeInOut" as const;

  // ── Body animations (Disney: head leads, body follows) ──
  const bodyAnimation: Record<PugMood, TargetAndTransition> = {
    sleeping: {
      scaleY: [1, 1.03, 1],
      transition: { duration: 3.5, repeat: Infinity, ease: easeIO },
    },
    idle: {
      y: [0, -3 * s, 0],
      transition: { duration: 3, repeat: Infinity, ease: easeIO },
    },
    happy: {
      y: [0, -7 * s, 0],
      scaleY: [1, 0.97, 1.02, 1],
      transition: { duration: 0.7, repeat: Infinity, ease: easeIO },
    },
    excited: {
      y: [0, -12 * s, 0],
      scaleX: [1, 0.95, 1.04, 1],
      scaleY: [1, 1.05, 0.96, 1],
      transition: { duration: 0.4, repeat: Infinity },
    },
    celebrating: {
      y: [0, -15 * s, 0],
      scaleX: [1, 0.92, 1.08, 1],
      scaleY: [1, 1.08, 0.92, 1],
      rotate: [0, -3, 3, 0],
      transition: { duration: 0.5, repeat: Infinity },
    },
    sad: {
      y: [0, 1, 0],
      scale: 0.96,
      transition: { duration: 4, repeat: Infinity, ease: easeIO },
    },
    eating: {
      y: [0, -2, 0],
      scaleY: [1, 0.98, 1.01, 1],
      transition: { duration: 0.35, repeat: Infinity },
    },
    love: {
      scale: [1, 1.04, 1],
      x: [0, 2, -2, 0],
      transition: { duration: 1.5, repeat: Infinity, ease: easeIO },
    },
    "working-out": {
      y: [0, -4, 0],
      scaleY: [1, 0.96, 1.02, 1],
      transition: { duration: 0.45, repeat: Infinity },
    },
  };

  // ── Ear animations (overlapping action — delayed after head) ──
  const earAnimation: Record<PugMood, TargetAndTransition> = {
    sleeping: { rotate: -8, transition: { duration: 1 } },
    idle: { rotate: [0, -2, 2, 0], transition: { duration: 4, repeat: Infinity, ease: easeIO } },
    happy: { rotate: [0, 8, -8, 0], transition: { duration: 0.6, repeat: Infinity, delay: 0.08 } },
    excited: { rotate: [0, 15, -15, 0], transition: { duration: 0.3, repeat: Infinity, delay: 0.05 } },
    celebrating: { rotate: [0, 20, -20, 0], transition: { duration: 0.35, repeat: Infinity, delay: 0.06 } },
    sad: { rotate: -12, transition: { duration: 0.8, ease: easeIO } },
    eating: { rotate: [0, 4, -4, 0], transition: { duration: 0.4, repeat: Infinity, delay: 0.05 } },
    love: { rotate: [0, 5, -5, 0], transition: { duration: 1.2, repeat: Infinity, delay: 0.1 } },
    "working-out": { rotate: [0, 6, -6, 0], transition: { duration: 0.4, repeat: Infinity } },
  };

  // ── Tail animations ──
  const tailAnimation: Record<PugMood, TargetAndTransition> = {
    sleeping: { rotate: 0 },
    idle: { rotate: [0, 8, -8, 0], transition: { duration: 2.5, repeat: Infinity, ease: easeIO } },
    happy: { rotate: [0, 20, -20, 0], transition: { duration: 0.35, repeat: Infinity } },
    excited: { rotate: [0, 30, -30, 0], transition: { duration: 0.18, repeat: Infinity } },
    celebrating: { rotate: [0, 35, -35, 0], transition: { duration: 0.25, repeat: Infinity } },
    sad: { rotate: -5, transition: { duration: 0.8 } },
    eating: { rotate: [0, 10, -10, 0], transition: { duration: 0.45, repeat: Infinity } },
    love: { rotate: [0, 15, -15, 0], transition: { duration: 0.5, repeat: Infinity } },
    "working-out": { rotate: [0, 12, -12, 0], transition: { duration: 0.35, repeat: Infinity } },
  };

  const isHeartEyes = mood === "love";
  const isClosed = mood === "sleeping" || blinking;
  const isSad = mood === "sad";
  const isTalkingMouth = isTalking || mood === "eating";

  // Tap reaction animations
  const tapAnim = tapReaction === "bounce"
    ? { scale: [1, 1.12, 0.95, 1.05, 1] }
    : tapReaction === "wiggle"
    ? { rotate: [0, -5, 5, -3, 3, 0] }
    : tapReaction === "spin"
    ? { rotate: [0, 360] }
    : undefined;

  return (
    <motion.div
      onClick={handleClick}
      className="relative cursor-pointer select-none"
      style={{ width: size, height: size * 1.15 }}
      whileTap={interactive ? { scale: 0.94 } : undefined}
      animate={tapAnim}
      transition={tapReaction ? { duration: 0.5, ease: easeIO } : undefined}
    >
      {/* Soft glow background */}
      <div
        className="absolute inset-0 rounded-full animate-glow-pulse opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
          transform: "scale(1.3)",
        }}
      />

      <svg
        viewBox="0 0 300 345"
        width={size}
        height={size * 1.15}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Shadow under pug */}
          <radialGradient id="shadow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          {/* Epic glow filter for special dress-up items */}
          <filter id="epic-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* === Layer 1: Background === */}
        {equipped.background && <BackgroundLayer id={equipped.background} />}

        {/* === Layer 2: Floor shadow === */}
        <motion.ellipse
          cx="150" cy="322" rx="65" ry="10"
          fill="url(#shadow-grad)"
          animate={bodyAnimation[mood]}
        />

        {/* === Layer 3: Curly tail === */}
        <motion.g
          style={{ originX: "195px", originY: "248px" }}
          animate={tailAnimation[mood]}
        >
          <path
            d="M195,248 Q220,225 228,238 Q235,252 225,258 Q218,245 215,252 Q212,260 208,255"
            fill={C.body}
            stroke={C.outline}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="226" cy="242" r="9" fill={C.body} stroke={C.outline} strokeWidth="2" />
        </motion.g>

        {/* === Layer 4: Outfit behind body (wings, cape) === */}
        {equipped.accessory && <AccessoryLayer id={equipped.accessory} position="behind" />}
        {equipped.outfit && <OutfitLayer id={equipped.outfit} position="behind" />}

        {/* === Layer 5: BODY === */}
        <motion.g animate={bodyAnimation[mood]}>
          {/* Main body */}
          <ellipse cx="150" cy="262" rx="68" ry="62" fill={C.body} stroke={C.outline} strokeWidth="2.5" />
          {/* Belly — lighter center */}
          <ellipse cx="150" cy="272" rx="40" ry="36" fill={C.bodyDark} opacity="0.25" />

          {/* Front legs */}
          <ellipse cx="112" cy="310" rx="20" ry="14" fill={C.body} stroke={C.outline} strokeWidth="2" />
          <ellipse cx="188" cy="310" rx="20" ry="14" fill={C.body} stroke={C.outline} strokeWidth="2" />
          {/* Paw pads — simple dots */}
          <circle cx="105" cy="314" r="3.5" fill={C.pawPad} opacity="0.6" />
          <circle cx="112" cy="316" r="3" fill={C.pawPad} opacity="0.5" />
          <circle cx="119" cy="314" r="3.5" fill={C.pawPad} opacity="0.6" />
          <circle cx="181" cy="314" r="3.5" fill={C.pawPad} opacity="0.6" />
          <circle cx="188" cy="316" r="3" fill={C.pawPad} opacity="0.5" />
          <circle cx="195" cy="314" r="3.5" fill={C.pawPad} opacity="0.6" />

          {/* === Outfit on body === */}
          {equipped.outfit && <OutfitLayer id={equipped.outfit} position="front" />}

          {/* === HEAD === */}
          <g>
            {/* Neck */}
            <ellipse cx="150" cy="210" rx="38" ry="18" fill={C.body} stroke={C.outline} strokeWidth="2" />

            {/* Main head circle */}
            <circle cx="150" cy="150" r="88" fill={C.body} stroke={C.outline} strokeWidth="2.5" />

            {/* === BLACK MASK === */}
            <ellipse cx="150" cy="172" rx="52" ry="42" fill={C.mask} stroke={C.outline} strokeWidth="2" />
            {/* Mask bridge between eyes */}
            <path d="M122,142 Q150,128 178,142 L174,158 Q150,153 126,158 Z" fill={C.mask} />

            {/* === WRINKLES — clean curved lines === */}
            <path d="M115,116 Q150,110 185,116" fill="none" stroke={C.wrinkle} strokeWidth="2" strokeLinecap="round" />
            <path d="M120,126 Q150,120 180,126" fill="none" stroke={C.wrinkle} strokeWidth="1.8" strokeLinecap="round" />
            <path d="M125,135 Q150,130 175,135" fill="none" stroke={C.wrinkle} strokeWidth="1.5" strokeLinecap="round" />

            {/* === EARS — dark floppy === */}
            <motion.g animate={earAnimation[mood]}>
              {/* Left ear */}
              <motion.g style={{ originX: "85px", originY: "120px" }}>
                <path
                  d="M80,105 Q65,85 70,110 Q72,130 85,140 Q95,135 98,120 Q100,105 90,98 Z"
                  fill={C.outline}
                  stroke={C.outline}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <ellipse cx="82" cy="118" rx="6" ry="10" fill={C.earInner} opacity="0.2" />
              </motion.g>
              {/* Right ear */}
              <motion.g style={{ originX: "215px", originY: "120px" }}>
                <path
                  d="M220,105 Q235,85 230,110 Q228,130 215,140 Q205,135 202,120 Q200,105 210,98 Z"
                  fill={C.outline}
                  stroke={C.outline}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <ellipse cx="218" cy="118" rx="6" ry="10" fill={C.earInner} opacity="0.2" />
              </motion.g>
            </motion.g>

            {/* === EYES === */}
            <g>
              {isHeartEyes ? (
                <>
                  {/* Heart eyes */}
                  <motion.g
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <path d="M115,148 C115,140 106,138 106,145 C106,152 115,160 115,160 C115,160 124,152 124,145 C124,138 115,140 115,148 Z" fill="#ec4899" stroke={C.outline} strokeWidth="1.5" />
                    <circle cx="111" cy="144" r="2" fill="white" opacity="0.6" />
                  </motion.g>
                  <motion.g
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }}
                  >
                    <path d="M185,148 C185,140 176,138 176,145 C176,152 185,160 185,160 C185,160 194,152 194,145 C194,138 185,140 185,148 Z" fill="#ec4899" stroke={C.outline} strokeWidth="1.5" />
                    <circle cx="181" cy="144" r="2" fill="white" opacity="0.6" />
                  </motion.g>
                </>
              ) : (
                <>
                  {/* Left eye — big, round, clean */}
                  <g>
                    <circle cx="125" cy="150" r="18" fill={C.eyeWhite} stroke={C.outline} strokeWidth="2.5" />
                    {isClosed ? (
                      <path d="M111,150 Q125,158 139,150" fill="none" stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" />
                    ) : (
                      <>
                        <circle cx="127" cy="149" r="11" fill={C.iris} />
                        <circle cx="128" cy="148" r="6" fill="#0D0805" />
                        {/* Single highlight dot */}
                        <circle cx="121" cy="144" r="4.5" fill="white" />
                      </>
                    )}
                  </g>

                  {/* Right eye */}
                  <g>
                    <circle cx="175" cy="150" r="18" fill={C.eyeWhite} stroke={C.outline} strokeWidth="2.5" />
                    {isClosed ? (
                      <path d="M161,150 Q175,158 189,150" fill="none" stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" />
                    ) : (
                      <>
                        <circle cx="173" cy="149" r="11" fill={C.iris} />
                        <circle cx="172" cy="148" r="6" fill="#0D0805" />
                        <circle cx="168" cy="144" r="4.5" fill="white" />
                      </>
                    )}
                  </g>

                  {/* Sad eyebrows */}
                  {isSad && (
                    <>
                      <path d="M108,134 Q125,128 142,136" fill="none" stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M158,136 Q175,128 192,134" fill="none" stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" />
                    </>
                  )}
                </>
              )}
            </g>

            {/* === NOSE — flat, bold, clean === */}
            <ellipse cx="150" cy="178" rx="30" ry="22" fill={C.mask} stroke={C.outline} strokeWidth="2" />
            <ellipse cx="150" cy="174" rx="18" ry="12" fill={C.nose} stroke={C.outline} strokeWidth="1.5" />
            {/* Nose shine — single spot */}
            <ellipse cx="144" cy="170" rx="4" ry="3" fill="white" opacity="0.25" />
            {/* Nostrils */}
            <ellipse cx="142" cy="176" rx="4.5" ry="3" fill="#0A0A0A" />
            <ellipse cx="158" cy="176" rx="4.5" ry="3" fill="#0A0A0A" />

            {/* === MOUTH === */}
            <g>
              {isTalkingMouth ? (
                <motion.g>
                  <motion.ellipse
                    cx="150" cy="196" rx="14" ry="9"
                    fill="#2A1A1A"
                    stroke={C.outline}
                    strokeWidth="1.5"
                    animate={{ ry: [7, 12, 7], rx: [12, 16, 12] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  />
                  <motion.ellipse
                    cx="152" cy="200" rx="8" ry="5"
                    fill={C.tongue}
                    stroke={C.outline}
                    strokeWidth="1"
                    animate={{ ry: [4, 6, 4] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  />
                </motion.g>
              ) : isSad ? (
                <path d="M135,197 Q150,189 165,197" fill="none" stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" />
              ) : (
                <>
                  {/* Nose-to-lip line */}
                  <path d="M150,185 L150,192" stroke={C.outline} strokeWidth="2" />
                  {/* BIG adorable smile */}
                  <path d="M130,192 Q150,210 170,192" fill="none" stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" />
                  {/* Tongue peek — bigger and cuter */}
                  {(mood === "happy" || mood === "excited" || mood === "celebrating") && (
                    <ellipse cx="153" cy="202" rx="9" ry="7" fill={C.tongue} stroke={C.outline} strokeWidth="1.5" />
                  )}
                </>
              )}
            </g>

            {/* === CHEEKS — cute blush circles === */}
            <circle cx="104" cy="170" r="13" fill={C.cheek} opacity={mood === "love" || mood === "happy" ? "0.4" : "0.2"} />
            <circle cx="196" cy="170" r="13" fill={C.cheek} opacity={mood === "love" || mood === "happy" ? "0.4" : "0.2"} />

            {/* === NECK FOLDS — signature pug feature === */}
            <path d="M116,208 Q150,216 184,208" fill="none" stroke={C.jawLine} strokeWidth="2" strokeLinecap="round" />
            <path d="M120,215 Q150,222 180,215" fill="none" stroke={C.jawLine} strokeWidth="1.5" strokeLinecap="round" />

            {/* === Glasses layer === */}
            {equipped.glasses && <GlassesLayer id={equipped.glasses} />}

            {/* === Hat layer === */}
            {equipped.hat && <HatLayer id={equipped.hat} />}
          </g>

          {/* === Accessory front (bowtie, scarf, medal, etc.) === */}
          {equipped.accessory && <AccessoryLayer id={equipped.accessory} position="front" />}
        </motion.g>

        {/* === Floating mood particles === */}
        <AnimatePresence>
          {showParticles && mood === "sleeping" && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.text
                  key={`zzz-${i}`}
                  x={185 + i * 15} y={110 - i * 15}
                  fontSize={14 + i * 4}
                  initial={{ opacity: 0, y: 0, x: 0 }}
                  animate={{ opacity: [0, 0.7, 0], y: -20, x: 8 }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.7 }}
                  fill="#c4b5fd"
                >
                  z
                </motion.text>
              ))}
            </>
          )}
          {showParticles && mood === "love" && (
            <>
              {[0, 1, 2, 3].map((i) => (
                <motion.text
                  key={`heart-${i}`}
                  x={100 + i * 35} y={95}
                  fontSize={12 + (i % 2) * 4}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 0.8, 0], y: -30 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                >
                  💜
                </motion.text>
              ))}
            </>
          )}
          {showParticles && mood === "celebrating" && (
            <>
              {[0, 1, 2, 3].map((i) => (
                <motion.text
                  key={`sparkle-${i}`}
                  x={90 + i * 40} y={85}
                  fontSize={10 + (i % 2) * 3}
                  initial={{ opacity: 0, y: 0, rotate: 0 }}
                  animate={{ opacity: [0, 1, 0], y: -25, rotate: 180 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
                >
                  ✨
                </motion.text>
              ))}
            </>
          )}
          {showParticles && mood === "happy" && (
            <>
              {[0, 1].map((i) => (
                <motion.text
                  key={`star-${i}`}
                  x={110 + i * 70} y={95}
                  fontSize="11"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1.2, 0.5], y: -15 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.8 }}
                >
                  ⭐
                </motion.text>
              ))}
            </>
          )}
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}
