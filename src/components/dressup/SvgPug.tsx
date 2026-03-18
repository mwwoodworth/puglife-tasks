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

// ── Ultra-Polished Color Palette with Gradients ──
const C = {
  outline: "#2A1F1D",     // Rich dark brown/black outline
  eyeWhite: "#FFFFFF",
  iris: "#382211",        // Deep warm brown
  tongue: "url(#tongue-grad)",
  tongueFlat: "#FF7B93",
  cheek: "#FF8C9D",       // Brighter blush
  pawPad: "#5A433A",      // Darker paw pads for contrast
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
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

  // Auto-blink & Random looking around
  useEffect(() => {
    if (mood === "sleeping") return;
    
    // Blink logic
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150); // slightly slower blink for cuteness
    };
    const blinkInterval = setInterval(blink, 2500 + Math.random() * 3000);
    
    // Look around logic (subtle pupil movement)
    const lookAround = () => {
      if (Math.random() > 0.5) {
        setPupilOffset({
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 2,
        });
        setTimeout(() => setPupilOffset({ x: 0, y: 0 }), 800 + Math.random() * 1000);
      }
    };
    const lookInterval = setInterval(lookAround, 2000);
    
    return () => {
      clearInterval(blinkInterval);
      clearInterval(lookInterval);
    };
  }, [mood]);

  const handleClick = useCallback(() => {
    if (!interactive) return;
    onClick?.();
    const reactions = ["bounce", "wiggle", "squish"];
    setTapReaction(reactions[Math.floor(Math.random() * reactions.length)]);
    setTimeout(() => setTapReaction(null), 600);
  }, [interactive, onClick]);

  const s = size / 120;
  const easeSpring = { type: "spring", stiffness: 300, damping: 15 };
  const easeIO = "easeInOut" as const;

  // ── Lifelike Breathing (Continuous background animation) ──
  const breathing: TargetAndTransition = {
    scaleX: [1, 1.015, 1],
    scaleY: [1, 0.985, 1],
    transition: { duration: 2.2, repeat: Infinity, ease: easeIO }
  };

  // ── Body animations (Head leads, body follows + breathing) ──
  const bodyAnimation: Record<PugMood, TargetAndTransition> = {
    sleeping: {
      scaleY: [1, 1.04, 1],
      scaleX: [1, 0.98, 1],
      transition: { duration: 3.5, repeat: Infinity, ease: easeIO },
    },
    idle: {
      y: [0, -2 * s, 0],
      transition: { duration: 3, repeat: Infinity, ease: easeIO },
    },
    happy: {
      y: [0, -8 * s, 0],
      scaleY: [1, 0.96, 1.03, 1],
      transition: { duration: 0.6, repeat: Infinity, ease: easeIO },
    },
    excited: {
      y: [0, -14 * s, 0],
      scaleX: [1, 0.93, 1.05, 1],
      scaleY: [1, 1.06, 0.94, 1],
      transition: { duration: 0.35, repeat: Infinity },
    },
    celebrating: {
      y: [0, -16 * s, 0],
      scaleX: [1, 0.9, 1.08, 1],
      scaleY: [1, 1.1, 0.9, 1],
      rotate: [0, -4, 4, 0],
      transition: { duration: 0.45, repeat: Infinity },
    },
    sad: {
      y: [0, 2, 0],
      scale: 0.95,
      transition: { duration: 4, repeat: Infinity, ease: easeIO },
    },
    eating: {
      y: [0, -3, 0],
      scaleY: [1, 0.97, 1.02, 1],
      transition: { duration: 0.3, repeat: Infinity },
    },
    love: {
      scale: [1, 1.05, 1],
      x: [0, 3, -3, 0],
      transition: { duration: 1.4, repeat: Infinity, ease: easeIO },
    },
    "working-out": {
      y: [0, -5, 0],
      scaleY: [1, 0.95, 1.03, 1],
      transition: { duration: 0.4, repeat: Infinity },
    },
  };

  // ── Ear animations (floppier, more gravity) ──
  const earAnimation: Record<PugMood, TargetAndTransition> = {
    sleeping: { rotate: -10, transition: { duration: 1 } },
    idle: { rotate: [0, -3, 3, 0], transition: { duration: 4.5, repeat: Infinity, ease: easeIO } },
    happy: { rotate: [0, 10, -10, 0], transition: { duration: 0.6, repeat: Infinity, delay: 0.08 } },
    excited: { rotate: [0, 18, -18, 0], transition: { duration: 0.35, repeat: Infinity, delay: 0.05 } },
    celebrating: { rotate: [0, 25, -25, 0], transition: { duration: 0.45, repeat: Infinity, delay: 0.06 } },
    sad: { rotate: -15, transition: { duration: 0.8, ease: easeIO } },
    eating: { rotate: [0, 5, -5, 0], transition: { duration: 0.4, repeat: Infinity, delay: 0.05 } },
    love: { rotate: [0, 6, -6, 0], transition: { duration: 1.4, repeat: Infinity, delay: 0.1 } },
    "working-out": { rotate: [0, 8, -8, 0], transition: { duration: 0.4, repeat: Infinity } },
  };

  // ── Tail animations (snappier) ──
  const tailAnimation: Record<PugMood, TargetAndTransition> = {
    sleeping: { rotate: 0 },
    idle: { rotate: [0, 5, -5, 0], transition: { duration: 3, repeat: Infinity, ease: easeIO } },
    happy: { rotate: [0, 25, -25, 0], transition: { duration: 0.3, repeat: Infinity } },
    excited: { rotate: [0, 35, -35, 0], transition: { duration: 0.15, repeat: Infinity } },
    celebrating: { rotate: [0, 40, -40, 0], transition: { duration: 0.2, repeat: Infinity } },
    sad: { rotate: -8, transition: { duration: 0.8 } },
    eating: { rotate: [0, 12, -12, 0], transition: { duration: 0.4, repeat: Infinity } },
    love: { rotate: [0, 18, -18, 0], transition: { duration: 0.45, repeat: Infinity } },
    "working-out": { rotate: [0, 15, -15, 0], transition: { duration: 0.3, repeat: Infinity } },
  };

  const isHeartEyes = mood === "love";
  const isClosed = mood === "sleeping" || blinking;
  const isSad = mood === "sad";
  const isTalkingMouth = isTalking || mood === "eating";

  // Tap reaction animations
  const tapAnim = tapReaction === "bounce"
    ? { scale: [1, 1.15, 0.9, 1.08, 1] }
    : tapReaction === "wiggle"
    ? { rotate: [0, -8, 8, -5, 5, 0] }
    : tapReaction === "squish"
    ? { scaleX: [1, 1.15, 0.95, 1], scaleY: [1, 0.85, 1.05, 1] }
    : undefined;

  return (
    <motion.div
      onClick={handleClick}
      className="relative cursor-pointer select-none"
      style={{ width: size, height: size * 1.15 }}
      whileHover={interactive ? { scale: 1.02 } : undefined}
      whileTap={interactive ? { scale: 0.92 } : undefined}
      animate={tapAnim}
      transition={tapReaction ? { duration: 0.6, ease: easeIO } : undefined}
    >
      {/* Dynamic Aura */}
      <div
        className="absolute inset-0 rounded-full animate-glow-pulse opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)",
          transform: "scale(1.4)",
        }}
      />

      <svg
        viewBox="0 0 300 345"
        width={size}
        height={size * 1.15}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Gradients for rich shading */}
          <radialGradient id="body-grad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFF2E0" />   {/* Highlight */}
            <stop offset="60%" stopColor="#F5D0A9" />  {/* Base */}
            <stop offset="100%" stopColor="#D9AA7A" /> {/* Shadow */}
          </radialGradient>
          
          <radialGradient id="mask-grad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#4A4447" />
            <stop offset="70%" stopColor="#2D282A" />
            <stop offset="100%" stopColor="#1A1718" />
          </radialGradient>
          
          <linearGradient id="tongue-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF9EAF" />
            <stop offset="100%" stopColor="#FF6B8B" />
          </linearGradient>

          <radialGradient id="shadow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.25)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          <filter id="epic-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="soft-drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* === Layer 1: Background === */}
        {equipped.background && <BackgroundLayer id={equipped.background} />}

        {/* === Layer 2: Floor shadow === */}
        <motion.ellipse
          cx="150" cy="326" rx="75" ry="12"
          fill="url(#shadow-grad)"
          animate={bodyAnimation[mood]}
        />

        {/* === Layer 3: Curly tail === */}
        <motion.g
          style={{ originX: "205px", originY: "258px" }}
          animate={tailAnimation[mood]}
        >
          {/* Thicker, cuter tail */}
          <path
            d="M195,258 Q225,230 238,245 Q248,262 232,270 Q222,255 218,262 Q214,272 208,265"
            fill="url(#body-grad)"
            stroke={C.outline}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="236" cy="250" r="11" fill="url(#body-grad)" stroke={C.outline} strokeWidth="3" />
        </motion.g>

        {/* === Layer 4: Outfit behind body === */}
        {equipped.accessory && <AccessoryLayer id={equipped.accessory} position="behind" />}
        {equipped.outfit && <OutfitLayer id={equipped.outfit} position="behind" />}

        {/* === Layer 5: BODY === */}
        <motion.g animate={bodyAnimation[mood]}>
          {/* Breathing wrapper */}
          <motion.g animate={mood === "sleeping" ? undefined : breathing}>
            {/* Main torso - squishier */}
            <ellipse cx="150" cy="265" rx="76" ry="66" fill="url(#body-grad)" stroke={C.outline} strokeWidth="3" />
            {/* Belly highlight */}
            <ellipse cx="150" cy="275" rx="45" ry="40" fill="#FFFFFF" opacity="0.3" filter="blur(4px)" />

            {/* Front legs - chunkier */}
            <g stroke={C.outline} strokeWidth="3" strokeLinejoin="round">
              <path d="M100,318 Q115,318 128,318 C128,290 120,270 100,270 C80,270 85,318 100,318 Z" fill="url(#body-grad)" />
              <path d="M200,318 Q185,318 172,318 C172,290 180,270 200,270 C220,270 215,318 200,318 Z" fill="url(#body-grad)" />
            </g>

            {/* Paw details - little cute toes */}
            <g fill={C.pawPad}>
              {/* Left paw */}
              <ellipse cx="94" cy="312" rx="4" ry="5" transform="rotate(-15 94 312)" />
              <ellipse cx="103" cy="310" rx="4.5" ry="5.5" />
              <ellipse cx="112" cy="312" rx="4" ry="5" transform="rotate(15 112 312)" />
              {/* Right paw */}
              <ellipse cx="188" cy="312" rx="4" ry="5" transform="rotate(-15 188 312)" />
              <ellipse cx="197" cy="310" rx="4.5" ry="5.5" />
              <ellipse cx="206" cy="312" rx="4" ry="5" transform="rotate(15 206 312)" />
            </g>

            {/* === Outfit on body === */}
            {equipped.outfit && <OutfitLayer id={equipped.outfit} position="front" />}
          </motion.g>

          {/* === HEAD === */}
          <g>
            {/* Neck / Collar fold */}
            <ellipse cx="150" cy="215" rx="42" ry="20" fill="url(#body-grad)" stroke={C.outline} strokeWidth="3" />
            <path d="M112,215 Q150,230 188,215" fill="none" stroke="#B88A5D" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

            {/* Main head circle - wider for cuteness */}
            <ellipse cx="150" cy="155" rx="96" ry="86" fill="url(#body-grad)" stroke={C.outline} strokeWidth="3" filter="url(#soft-drop-shadow)" />

            {/* Head highlight */}
            <ellipse cx="150" cy="110" rx="40" ry="15" fill="#FFFFFF" opacity="0.25" filter="blur(6px)" />

            {/* === BLACK MASK === */}
            <g stroke={C.outline} strokeWidth="2.5">
              {/* Main muzzle */}
              <ellipse cx="150" cy="182" rx="58" ry="46" fill="url(#mask-grad)" />
              {/* Bridge to eyes */}
              <path d="M116,146 Q150,132 184,146 L180,166 Q150,158 120,166 Z" fill="url(#mask-grad)" />
            </g>

            {/* Muzzle highlight for 3D effect */}
            <ellipse cx="150" cy="155" rx="20" ry="8" fill="#FFFFFF" opacity="0.1" filter="blur(2px)" />

            {/* === WRINKLES — thick, soft, expressive === */}
            <g stroke="#AD7B4D" strokeLinecap="round" fill="none">
              <path d="M105,115 Q150,105 195,115" strokeWidth="4" opacity="0.8" />
              <path d="M115,128 Q150,120 185,128" strokeWidth="3" opacity="0.7" />
              <path d="M125,140 Q150,135 175,140" strokeWidth="2.5" opacity="0.6" />
            </g>

            {/* === EARS — dark floppy === */}
            <motion.g animate={earAnimation[mood]}>
              {/* Left ear */}
              <motion.g style={{ originX: "75px", originY: "125px" }}>
                <path
                  d="M70,105 Q50,80 55,115 Q58,140 75,152 Q88,145 92,125 Q95,105 85,95 Z"
                  fill="url(#mask-grad)"
                  stroke={C.outline}
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <ellipse cx="72" cy="120" rx="8" ry="14" fill="#5C3645" opacity="0.3" transform="rotate(-15 72 120)" />
              </motion.g>
              {/* Right ear */}
              <motion.g style={{ originX: "225px", originY: "125px" }}>
                <path
                  d="M230,105 Q250,80 245,115 Q242,140 225,152 Q212,145 208,125 Q205,105 215,95 Z"
                  fill="url(#mask-grad)"
                  stroke={C.outline}
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <ellipse cx="228" cy="120" rx="8" ry="14" fill="#5C3645" opacity="0.3" transform="rotate(15 228 120)" />
              </motion.g>
            </motion.g>

            {/* === EYES === */}
            <g>
              {isHeartEyes ? (
                <>
                  <motion.g animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                    <path d="M115,152 C115,142 104,138 104,148 C104,158 115,168 115,168 C115,168 126,158 126,148 C126,138 115,142 115,152 Z" fill="#FF477E" stroke={C.outline} strokeWidth="2" />
                    <circle cx="110" cy="146" r="3" fill="white" opacity="0.8" />
                  </motion.g>
                  <motion.g animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }}>
                    <path d="M185,152 C185,142 174,138 174,148 C174,158 185,168 185,168 C185,168 196,158 196,148 C196,138 185,142 185,152 Z" fill="#FF477E" stroke={C.outline} strokeWidth="2" />
                    <circle cx="180" cy="146" r="3" fill="white" opacity="0.8" />
                  </motion.g>
                </>
              ) : (
                <>
                  {/* Left eye — huge, glossy, cute */}
                  <g>
                    <circle cx="118" cy="154" r="22" fill={C.eyeWhite} stroke={C.outline} strokeWidth="3" />
                    {isClosed ? (
                      <>
                        <path d="M100,154 Q118,166 136,154" fill="none" stroke={C.outline} strokeWidth="4" strokeLinecap="round" />
                        <path d="M105,159 L100,165 M118,162 L118,169 M131,159 L136,165" stroke={C.outline} strokeWidth="2" strokeLinecap="round" />
                      </>
                    ) : (
                      <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
                        <circle cx="120" cy="154" r="15" fill={C.iris} />
                        <circle cx="122" cy="152" r="9" fill="#120A05" />
                        {/* Anime-style gloss highlights */}
                        <circle cx="114" cy="146" r="6" fill="white" />
                        <circle cx="126" cy="158" r="2.5" fill="white" opacity="0.8" />
                      </g>
                    )}
                  </g>

                  {/* Right eye */}
                  <g>
                    <circle cx="182" cy="154" r="22" fill={C.eyeWhite} stroke={C.outline} strokeWidth="3" />
                    {isClosed ? (
                      <>
                        <path d="M164,154 Q182,166 200,154" fill="none" stroke={C.outline} strokeWidth="4" strokeLinecap="round" />
                        <path d="M169,159 L164,165 M182,162 L182,169 M195,159 L200,165" stroke={C.outline} strokeWidth="2" strokeLinecap="round" />
                      </>
                    ) : (
                      <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
                        <circle cx="180" cy="154" r="15" fill={C.iris} />
                        <circle cx="178" cy="152" r="9" fill="#120A05" />
                        {/* Highlights (mirrored slightly for consistent light source) */}
                        <circle cx="174" cy="146" r="6" fill="white" />
                        <circle cx="186" cy="158" r="2.5" fill="white" opacity="0.8" />
                      </g>
                    )}
                  </g>

                  {/* Expressive Sad Eyebrows */}
                  {isSad && (
                    <>
                      <path d="M98,136 Q118,128 138,140" fill="none" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M162,140 Q182,128 202,136" fill="none" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" />
                    </>
                  )}
                </>
              )}
            </g>

            {/* === CHEEKS — vibrant, soft blush === */}
            <ellipse cx="98" cy="180" rx="16" ry="10" fill={C.cheek} opacity={mood === "love" || mood === "happy" || mood === "celebrating" ? "0.6" : "0.25"} filter="blur(2px)" />
            <ellipse cx="202" cy="180" rx="16" ry="10" fill={C.cheek} opacity={mood === "love" || mood === "happy" || mood === "celebrating" ? "0.6" : "0.25"} filter="blur(2px)" />

            {/* === NOSE — squishy and wet-looking === */}
            <g>
              <ellipse cx="150" cy="186" rx="34" ry="24" fill="#1A1718" stroke={C.outline} strokeWidth="2.5" />
              <ellipse cx="150" cy="182" rx="22" ry="14" fill="#0A0809" />
              {/* Glossy wet nose highlight */}
              <path d="M136,176 Q150,170 164,176 Q150,178 136,176 Z" fill="#FFFFFF" opacity="0.4" />
              {/* Nostrils */}
              <ellipse cx="140" cy="185" rx="5" ry="3" fill="#000" transform="rotate(15 140 185)" />
              <ellipse cx="160" cy="185" rx="5" ry="3" fill="#000" transform="rotate(-15 160 185)" />
            </g>

            {/* === MOUTH === */}
            <g>
              {isTalkingMouth ? (
                <motion.g>
                  {/* Open mouth inner */}
                  <motion.path
                    d="M132,204 Q150,225 168,204 Z"
                    fill="#331A22"
                    stroke={C.outline}
                    strokeWidth="2.5"
                    animate={{ d: ["M132,204 Q150,215 168,204 Z", "M132,204 Q150,230 168,204 Z", "M132,204 Q150,215 168,204 Z"] }}
                    transition={{ duration: 0.35, repeat: Infinity }}
                  />
                  {/* Tongue animating inside */}
                  <motion.ellipse
                    cx="150" cy="214" rx="10" ry="6"
                    fill="url(#tongue-grad)"
                    animate={{ ry: [5, 8, 5], cy: [212, 216, 212] }}
                    transition={{ duration: 0.35, repeat: Infinity }}
                  />
                </motion.g>
              ) : isSad ? (
                <path d="M130,208 Q150,198 170,208" fill="none" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" />
              ) : (
                <>
                  {/* Nose-to-lip crease */}
                  <path d="M150,192 L150,202" stroke={C.outline} strokeWidth="2.5" />
                  {/* Smiling Jowls */}
                  <path d="M125,202 Q150,222 175,202" fill="none" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M115,195 Q125,205 135,200" fill="none" stroke={C.outline} strokeWidth="2" strokeLinecap="round" />
                  <path d="M185,195 Q175,205 165,200" fill="none" stroke={C.outline} strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Big cute derp tongue */}
                  {(mood === "happy" || mood === "excited" || mood === "celebrating" || mood === "idle") && (
                    <motion.g
                      animate={mood === "excited" || mood === "celebrating" ? { y: [0, 3, 0], scaleY: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.2, repeat: Infinity }}
                    >
                      <path d="M142,212 Q150,230 158,212 Z" fill="url(#tongue-grad)" stroke={C.outline} strokeWidth="2" />
                      <line x1="150" y1="212" x2="150" y2="222" stroke="#D1506B" strokeWidth="1.5" strokeLinecap="round" />
                    </motion.g>
                  )}
                </>
              )}
            </g>

            {/* === Glasses layer === */}
            {equipped.glasses && <GlassesLayer id={equipped.glasses} />}

            {/* === Hat layer === */}
            {equipped.hat && <HatLayer id={equipped.hat} />}
          </g>

          {/* === Accessory front === */}
          {equipped.accessory && <AccessoryLayer id={equipped.accessory} position="front" />}
        </motion.g>

        {/* === Custom Premium Floating Particles === */}
        <AnimatePresence>
          {showParticles && mood === "sleeping" && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.g
                  key={`zzz-${i}`}
                  initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0], y: -40, x: 15, scale: 1.2 }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
                  transform={`translate(${180 + i * 10}, ${100 - i * 10})`}
                >
                  <path d="M0,0 L15,0 L5,15 L20,15" fill="none" stroke="#A78BFA" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                </motion.g>
              ))}
            </>
          )}
          {showParticles && mood === "love" && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.g
                  key={`heart-${i}`}
                  initial={{ opacity: 0, y: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], y: -50, scale: [0, 1.5, 0.8] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6 }}
                  transform={`translate(${90 + i * 45}, ${95})`}
                >
                  <path d="M0,5 A5,5 0 0,1 10,5 A5,5 0 0,1 20,5 Q20,12 10,20 Q0,12 0,5 Z" fill="#FF477E" />
                </motion.g>
              ))}
            </>
          )}
          {showParticles && mood === "celebrating" && (
            <>
              {[0, 1, 2, 3].map((i) => (
                <motion.g
                  key={`sparkle-${i}`}
                  initial={{ opacity: 0, y: 0, scale: 0, rotate: 0 }}
                  animate={{ opacity: [0, 1, 0], y: -40, scale: 1.5, rotate: 180 }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
                  transform={`translate(${80 + i * 40}, ${85})`}
                >
                  <path d="M10,0 Q10,10 20,10 Q10,10 10,20 Q10,10 0,10 Q10,10 10,0 Z" fill="#FBBF24" />
                </motion.g>
              ))}
            </>
          )}
          {showParticles && mood === "happy" && (
            <>
              {[0, 1].map((i) => (
                <motion.g
                  key={`star-${i}`}
                  initial={{ opacity: 0, y: 0, scale: 0, rotate: -30 }}
                  animate={{ opacity: [0, 1, 0], y: -30, scale: 1.2, rotate: 30 }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 1 }}
                  transform={`translate(${100 + i * 80}, ${90})`}
                >
                  <path d="M10,0 L13,7 L20,7 L14,12 L16,19 L10,15 L4,19 L6,12 L0,7 L7,7 Z" fill="#FCD34D" />
                </motion.g>
              ))}
            </>
          )}
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}