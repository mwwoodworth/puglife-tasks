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

  // Auto-blink: 100ms close, 50ms open — snappy and natural
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

  // Scale animation values by pug size for perceptible motion
  const s = size / 120; // scale factor relative to default

  const easeIO = "easeInOut" as const;

  // Disney principle: head leads, body follows (staggered timing)
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

  // Ears flop with delay after head movement (overlapping action)
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
      {/* Purple glow background */}
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
          {/* Fawn pug body gradient — warm apricot */}
          <radialGradient id="pug-body-grad" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#F0C896" />
            <stop offset="50%" stopColor="#E5AA70" />
            <stop offset="100%" stopColor="#D4956A" />
          </radialGradient>
          {/* Head gradient — slightly lighter at top */}
          <radialGradient id="pug-head-grad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#F0C896" />
            <stop offset="60%" stopColor="#E5AA70" />
            <stop offset="100%" stopColor="#D4956A" />
          </radialGradient>
          {/* Black mask gradient — smooth transition */}
          <radialGradient id="pug-mask-grad" cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor="#1A1A1A" />
            <stop offset="70%" stopColor="#2A2A2A" />
            <stop offset="100%" stopColor="#3D3020" stopOpacity="0" />
          </radialGradient>
          {/* Nose — wet shine effect */}
          <radialGradient id="nose-shine" cx="35%" cy="25%" r="45%">
            <stop offset="0%" stopColor="#444" />
            <stop offset="50%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0D0D0D" />
          </radialGradient>
          {/* Belly highlight */}
          <radialGradient id="belly-light" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#F5DEB3" />
            <stop offset="100%" stopColor="#E5AA70" stopOpacity="0" />
          </radialGradient>
          {/* Shadow under pug */}
          <radialGradient id="shadow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.18)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          {/* Eye sheen */}
          <radialGradient id="eye-sheen" cx="40%" cy="35%" r="50%">
            <stop offset="0%" stopColor="#5C4030" />
            <stop offset="100%" stopColor="#2A1A10" />
          </radialGradient>
          {/* Coat sheen highlight band */}
          <linearGradient id="coat-sheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="40%" stopColor="white" stopOpacity="0.08" />
            <stop offset="60%" stopColor="white" stopOpacity="0.08" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          {/* Epic glow filter for special items */}
          <filter id="epic-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Soft inner shadow for depth */}
          <filter id="inner-shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="0" dy="2" />
            <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feFlood floodColor="#8B6914" floodOpacity="0.15" />
            <feComposite in2="SourceGraphic" operator="in" />
            <feComposite in="SourceGraphic" />
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

        {/* === Layer 3: Curly tail (behind body, at hip) === */}
        <motion.g
          style={{ originX: "195px", originY: "248px" }}
          animate={tailAnimation[mood]}
        >
          {/* Tail base */}
          <path
            d="M195,248 Q220,225 228,238 Q235,252 225,258 Q218,245 215,252 Q212,260 208,255"
            fill="url(#pug-body-grad)"
            stroke="#C4956A"
            strokeWidth="1.5"
          />
          {/* Tight curl */}
          <circle cx="226" cy="242" r="10" fill="url(#pug-body-grad)" stroke="#C4956A" strokeWidth="1" />
          <circle cx="226" cy="242" r="5" fill="#D4956A" opacity="0.3" />
        </motion.g>

        {/* === Layer 4: Outfit behind body (wings, cape) === */}
        {equipped.accessory && <AccessoryLayer id={equipped.accessory} position="behind" />}
        {equipped.outfit && <OutfitLayer id={equipped.outfit} position="behind" />}

        {/* === Layer 5: BODY — round, cuddly, chubby === */}
        <motion.g animate={bodyAnimation[mood]}>
          {/* Main body — round bean shape */}
          <ellipse cx="150" cy="262" rx="68" ry="62" fill="url(#pug-body-grad)" />
          {/* Body outline for definition */}
          <ellipse cx="150" cy="262" rx="68" ry="62" fill="none" stroke="#C4956A" strokeWidth="1.2" />
          {/* Belly — lighter center area */}
          <ellipse cx="150" cy="272" rx="44" ry="40" fill="url(#belly-light)" opacity="0.6" />
          {/* Coat sheen band across shoulders */}
          <ellipse cx="150" cy="240" rx="55" ry="20" fill="url(#coat-sheen)" />
          {/* Chest — broader front area */}
          <ellipse cx="150" cy="238" rx="50" ry="22" fill="#E5AA70" opacity="0.3" />

          {/* Short sturdy front legs */}
          <ellipse cx="112" cy="310" rx="20" ry="14" fill="url(#pug-body-grad)" stroke="#C4956A" strokeWidth="1" />
          <ellipse cx="188" cy="310" rx="20" ry="14" fill="url(#pug-body-grad)" stroke="#C4956A" strokeWidth="1" />
          {/* Paw pads — dark ovals */}
          <ellipse cx="107" cy="314" rx="5" ry="3" fill="#665544" opacity="0.5" />
          <ellipse cx="112" cy="316" rx="4" ry="2.5" fill="#665544" opacity="0.4" />
          <ellipse cx="117" cy="314" rx="5" ry="3" fill="#665544" opacity="0.5" />
          <ellipse cx="183" cy="314" rx="5" ry="3" fill="#665544" opacity="0.5" />
          <ellipse cx="188" cy="316" rx="4" ry="2.5" fill="#665544" opacity="0.4" />
          <ellipse cx="193" cy="314" rx="5" ry="3" fill="#665544" opacity="0.5" />

          {/* === Outfit on body === */}
          {equipped.outfit && <OutfitLayer id={equipped.outfit} position="front" />}

          {/* === HEAD — large, massive, round === */}
          <g>
            {/* Neck — short thick connection */}
            <ellipse cx="150" cy="210" rx="38" ry="18" fill="url(#pug-body-grad)" />

            {/* Main head circle — big round pug head */}
            <circle cx="150" cy="150" r="88" fill="url(#pug-head-grad)" />
            <circle cx="150" cy="150" r="88" fill="none" stroke="#C4956A" strokeWidth="1.2" />

            {/* === BLACK MASK — signature fawn pug feature === */}
            {/* Mask covers muzzle area and around eyes */}
            <ellipse cx="150" cy="172" rx="52" ry="42" fill="#2A2A2A" opacity="0.85" />
            {/* Mask extends between eyes/up forehead */}
            <path d="M120,140 Q150,125 180,140 L175,160 Q150,155 125,160 Z" fill="#2A2A2A" opacity="0.5" />
            {/* Mask gradient edges — smooth blend into fawn */}
            <ellipse cx="150" cy="172" rx="58" ry="48" fill="url(#pug-mask-grad)" opacity="0.3" />

            {/* === WRINKLES — deep, visible, signature pug trait === */}
            {/* Forehead diamond/thumbmark pattern */}
            <path d="M150,108 L140,120 L150,132 L160,120 Z" fill="none" stroke="#C4865A" strokeWidth="1.5" opacity="0.55" />
            {/* Horizontal wrinkles */}
            <path d="M112,118 Q150,112 188,118" fill="none" stroke="#C4865A" strokeWidth="1.3" opacity="0.5" />
            <path d="M118,128 Q150,122 182,128" fill="none" stroke="#C4865A" strokeWidth="1.2" opacity="0.45" />
            <path d="M122,137 Q150,133 178,137" fill="none" stroke="#C4865A" strokeWidth="1" opacity="0.35" />
            {/* Wrinkle highlights (3D crease effect) */}
            <path d="M113,120 Q150,114 187,120" fill="none" stroke="#F0C896" strokeWidth="0.8" opacity="0.3" />
            <path d="M119,130 Q150,124 181,130" fill="none" stroke="#F0C896" strokeWidth="0.7" opacity="0.25" />

            {/* Under-eye cushioning (puffy cheek pads) */}
            <ellipse cx="122" cy="162" rx="18" ry="10" fill="#E5AA70" opacity="0.4" />
            <ellipse cx="178" cy="162" rx="18" ry="10" fill="#E5AA70" opacity="0.4" />

            {/* === EARS — black velvet, button style, floppy === */}
            <motion.g animate={earAnimation[mood]}>
              {/* Left ear — rounded floppy, drops to eye level */}
              <motion.g style={{ originX: "85px", originY: "120px" }}>
                <path
                  d="M80,105 Q65,85 70,110 Q72,130 85,140 Q95,135 98,120 Q100,105 90,98 Z"
                  fill="#1A1A1A"
                  stroke="#111"
                  strokeWidth="0.8"
                />
                {/* Inner ear — subtle pink when perked */}
                <path
                  d="M82,108 Q72,95 76,115 Q78,128 86,134"
                  fill="#553344"
                  opacity="0.15"
                />
              </motion.g>
              {/* Right ear — mirror */}
              <motion.g style={{ originX: "215px", originY: "120px" }}>
                <path
                  d="M220,105 Q235,85 230,110 Q228,130 215,140 Q205,135 202,120 Q200,105 210,98 Z"
                  fill="#1A1A1A"
                  stroke="#111"
                  strokeWidth="0.8"
                />
                <path
                  d="M218,108 Q228,95 224,115 Q222,128 214,134"
                  fill="#553344"
                  opacity="0.15"
                />
              </motion.g>
            </motion.g>

            {/* === EYES — very large, bold, prominent, globular === */}
            <g>
              {isHeartEyes ? (
                <>
                  {/* Heart eyes — SVG hearts, not emoji */}
                  <motion.g
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <path d="M115,148 C115,140 106,138 106,145 C106,152 115,160 115,160 C115,160 124,152 124,145 C124,138 115,140 115,148 Z" fill="#ec4899" />
                    <circle cx="111" cy="144" r="1.5" fill="white" opacity="0.5" />
                  </motion.g>
                  <motion.g
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }}
                  >
                    <path d="M185,148 C185,140 176,138 176,145 C176,152 185,160 185,160 C185,160 194,152 194,145 C194,138 185,140 185,148 Z" fill="#ec4899" />
                    <circle cx="181" cy="144" r="1.5" fill="white" opacity="0.5" />
                  </motion.g>
                </>
              ) : (
                <>
                  {/* Left eye — white, large, expressive */}
                  <g>
                    <circle cx="125" cy="150" r="17" fill="#F5F0E8" stroke="#3D2B1F" strokeWidth="1.5" />
                    {isClosed ? (
                      <path d="M112,150 Q125,156 138,150" fill="none" stroke="#2A1A10" strokeWidth="2.5" strokeLinecap="round" />
                    ) : (
                      <>
                        {/* Iris */}
                        <circle cx="127" cy="149" r="10" fill="url(#eye-sheen)" />
                        {/* Pupil */}
                        <circle cx="128" cy="148" r="5.5" fill="#0D0805" />
                        {/* Catchlight — large top-left (Pixar trick) */}
                        <circle cx="122" cy="144" r="4" fill="white" opacity="0.85" />
                        {/* Catchlight — small bottom-right */}
                        <circle cx="131" cy="153" r="1.8" fill="white" opacity="0.55" />
                      </>
                    )}
                  </g>

                  {/* Right eye */}
                  <g>
                    <circle cx="175" cy="150" r="17" fill="#F5F0E8" stroke="#3D2B1F" strokeWidth="1.5" />
                    {isClosed ? (
                      <path d="M162,150 Q175,156 188,150" fill="none" stroke="#2A1A10" strokeWidth="2.5" strokeLinecap="round" />
                    ) : (
                      <>
                        <circle cx="173" cy="149" r="10" fill="url(#eye-sheen)" />
                        <circle cx="172" cy="148" r="5.5" fill="#0D0805" />
                        <circle cx="169" cy="144" r="4" fill="white" opacity="0.85" />
                        <circle cx="177" cy="153" r="1.8" fill="white" opacity="0.55" />
                      </>
                    )}
                  </g>

                  {/* Sad droopy eyebrows */}
                  {isSad && (
                    <>
                      <path d="M108,134 Q125,128 142,136" fill="none" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M158,136 Q175,128 192,134" fill="none" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
                    </>
                  )}
                </>
              )}
            </g>

            {/* === MUZZLE — broad, blunt, prominent === */}
            <ellipse cx="150" cy="178" rx="30" ry="22" fill="#2A2A2A" opacity="0.75" />

            {/* === NOSE — black, broad, flat, wet-looking === */}
            <ellipse cx="150" cy="174" rx="18" ry="13" fill="url(#nose-shine)" />
            {/* Nose bridge highlight — wet nose effect */}
            <ellipse cx="144" cy="170" rx="5" ry="3.5" fill="white" opacity="0.15" />
            {/* Nostrils */}
            <ellipse cx="142" cy="176" rx="4.5" ry="3" fill="#0A0A0A" />
            <ellipse cx="158" cy="176" rx="4.5" ry="3" fill="#0A0A0A" />
            {/* Nose top line — bisects center of eyes */}
            <path d="M146,168 Q150,166 154,168" fill="none" stroke="#333" strokeWidth="0.8" opacity="0.5" />

            {/* === MOUTH === */}
            <g>
              {isTalkingMouth ? (
                <motion.g>
                  {/* Open mouth */}
                  <motion.ellipse
                    cx="150" cy="195" rx="14" ry="9"
                    fill="#2A1A1A"
                    animate={{ ry: [7, 12, 7], rx: [12, 16, 12] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  />
                  {/* Tongue */}
                  <motion.ellipse
                    cx="152" cy="199" rx="8" ry="5"
                    fill="#E88B9C"
                    animate={{ ry: [4, 6, 4] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  />
                </motion.g>
              ) : isSad ? (
                <path d="M137,196 Q150,189 163,196" fill="none" stroke="#3D2B1F" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <>
                  {/* Nose-to-lip line */}
                  <path d="M150,185 L150,192" stroke="#3D2B1F" strokeWidth="1.5" />
                  {/* Smile curves */}
                  <path d="M136,192 Q150,203 164,192" fill="none" stroke="#3D2B1F" strokeWidth="1.8" strokeLinecap="round" />
                  {/* Tongue peek when happy/excited */}
                  {(mood === "happy" || mood === "excited" || mood === "celebrating") && (
                    <ellipse cx="153" cy="200" rx="7" ry="5" fill="#E88B9C" />
                  )}
                </>
              )}
            </g>

            {/* === CHEEKS — round, puffy, substantial === */}
            <circle cx="104" cy="170" r="14" fill="#F5A0A0" opacity={mood === "love" || mood === "happy" ? "0.35" : "0.18"} />
            <circle cx="196" cy="170" r="14" fill="#F5A0A0" opacity={mood === "love" || mood === "happy" ? "0.35" : "0.18"} />

            {/* Jaw shadow under chin */}
            <ellipse cx="150" cy="208" rx="35" ry="8" fill="#C4956A" opacity="0.25" />

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
