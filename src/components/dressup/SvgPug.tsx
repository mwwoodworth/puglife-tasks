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

  // Auto-blink every 3-5 seconds
  useEffect(() => {
    if (mood === "sleeping") return;
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    };
    const interval = setInterval(blink, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [mood]);

  const handleClick = useCallback(() => {
    if (!interactive) return;
    onClick?.();
    setTapReaction("bounce");
    setTimeout(() => setTapReaction(null), 500);
  }, [interactive, onClick]);

  // Mood-based animation variants
  const easeIO = "easeInOut" as const;
  const bodyAnimation: Record<PugMood, TargetAndTransition> = {
    sleeping: { y: [0, 2, 0], transition: { duration: 3, repeat: Infinity, ease: easeIO } },
    idle: { y: [0, -2, 0], transition: { duration: 2.5, repeat: Infinity, ease: easeIO } },
    happy: { y: [0, -4, 0], transition: { duration: 0.8, repeat: Infinity, ease: easeIO } },
    excited: { y: [0, -8, 0], rotate: [0, -2, 2, 0], transition: { duration: 0.4, repeat: Infinity } },
    celebrating: { y: [0, -10, 0], rotate: [0, -5, 5, 0], transition: { duration: 0.5, repeat: Infinity } },
    sad: { y: [0, 1, 0], scale: 0.95, transition: { duration: 3, repeat: Infinity, ease: easeIO } },
    eating: { y: [0, -2, 0], transition: { duration: 0.3, repeat: Infinity } },
    love: { scale: [1, 1.03, 1], transition: { duration: 1.2, repeat: Infinity, ease: easeIO } },
    "working-out": { y: [0, -3, 0], scaleY: [1, 0.97, 1], transition: { duration: 0.5, repeat: Infinity } },
  };

  const earAnimation: Record<PugMood, TargetAndTransition> = {
    sleeping: { rotate: -5 },
    idle: { rotate: [0, -2, 0], transition: { duration: 3, repeat: Infinity } },
    happy: { rotate: [0, 5, -5, 0], transition: { duration: 0.6, repeat: Infinity } },
    excited: { rotate: [0, 10, -10, 0], transition: { duration: 0.3, repeat: Infinity } },
    celebrating: { rotate: [0, 15, -15, 0], transition: { duration: 0.4, repeat: Infinity } },
    sad: { rotate: -10, transition: { duration: 0.5 } },
    eating: { rotate: [0, 3, -3, 0], transition: { duration: 0.4, repeat: Infinity } },
    love: { rotate: [0, 3, -3, 0], transition: { duration: 1, repeat: Infinity } },
    "working-out": { rotate: [0, 5, -5, 0], transition: { duration: 0.5, repeat: Infinity } },
  };

  const tailAnimation: Record<PugMood, TargetAndTransition> = {
    sleeping: {},
    idle: { rotate: [0, 5, -5, 0], transition: { duration: 2, repeat: Infinity } },
    happy: { rotate: [0, 15, -15, 0], transition: { duration: 0.4, repeat: Infinity } },
    excited: { rotate: [0, 25, -25, 0], transition: { duration: 0.2, repeat: Infinity } },
    celebrating: { rotate: [0, 30, -30, 0], transition: { duration: 0.3, repeat: Infinity } },
    sad: { rotate: -5 },
    eating: { rotate: [0, 8, -8, 0], transition: { duration: 0.5, repeat: Infinity } },
    love: { rotate: [0, 10, -10, 0], transition: { duration: 0.6, repeat: Infinity } },
    "working-out": { rotate: [0, 10, -10, 0], transition: { duration: 0.4, repeat: Infinity } },
  };

  const isHeartEyes = mood === "love";
  const isClosed = mood === "sleeping" || blinking;
  const isSad = mood === "sad";
  const isTalkingMouth = isTalking || mood === "eating";

  return (
    <motion.div
      onClick={handleClick}
      className="relative cursor-pointer select-none"
      style={{ width: size, height: size * 1.15 }}
      whileTap={interactive ? { scale: 0.95 } : undefined}
      animate={tapReaction === "bounce" ? { scale: [1, 1.1, 1] } : undefined}
    >
      <svg
        viewBox="0 0 300 345"
        width={size}
        height={size * 1.15}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Body gradient */}
          <radialGradient id="pug-body-grad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#f5deb3" />
            <stop offset="70%" stopColor="#deb887" />
            <stop offset="100%" stopColor="#c8a87c" />
          </radialGradient>
          {/* Head gradient */}
          <radialGradient id="pug-head-grad" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#f5deb3" />
            <stop offset="80%" stopColor="#deb887" />
            <stop offset="100%" stopColor="#c4a06a" />
          </radialGradient>
          {/* Nose shine */}
          <radialGradient id="nose-shine" cx="35%" cy="30%" r="40%">
            <stop offset="0%" stopColor="#555" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </radialGradient>
          {/* Shadow */}
          <radialGradient id="shadow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          {/* Epic glow filter */}
          <filter id="epic-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Layer 1: Background */}
        {equipped.background && <BackgroundLayer id={equipped.background} />}

        {/* Layer 2: Shadow */}
        <motion.ellipse
          cx="150" cy="320" rx="70" ry="12"
          fill="url(#shadow-grad)"
          animate={bodyAnimation[mood]}
        />

        {/* Layer 3: Tail */}
        <motion.g
          style={{ originX: "200px", originY: "250px" }}
          animate={tailAnimation[mood]}
        >
          <path
            d="M210,240 Q240,210 250,230 Q260,250 240,255"
            fill="url(#pug-body-grad)"
            stroke="#c4a06a"
            strokeWidth="1"
          />
          {/* Tail curl */}
          <circle cx="248" cy="235" r="8" fill="url(#pug-body-grad)" stroke="#c4a06a" strokeWidth="1" />
        </motion.g>

        {/* Layer 4: Outfit behind body (wings, cape) */}
        {equipped.accessory && (
          <AccessoryLayer id={equipped.accessory} position="behind" />
        )}
        {equipped.outfit && (
          <OutfitLayer id={equipped.outfit} position="behind" />
        )}

        {/* Layer 5: Body */}
        <motion.g animate={bodyAnimation[mood]}>
          {/* Body */}
          <ellipse cx="150" cy="260" rx="65" ry="55" fill="url(#pug-body-grad)" stroke="#c4a06a" strokeWidth="1.5" />
          {/* Belly */}
          <ellipse cx="150" cy="270" rx="40" ry="35" fill="#f5e6cc" opacity="0.5" />
          {/* Front paws */}
          <ellipse cx="110" cy="305" rx="18" ry="12" fill="url(#pug-body-grad)" stroke="#c4a06a" strokeWidth="1" />
          <ellipse cx="190" cy="305" rx="18" ry="12" fill="url(#pug-body-grad)" stroke="#c4a06a" strokeWidth="1" />
          {/* Paw pads */}
          <ellipse cx="110" cy="308" rx="6" ry="4" fill="#d4a574" />
          <ellipse cx="190" cy="308" rx="6" ry="4" fill="#d4a574" />

          {/* Layer 6: Outfit on body */}
          {equipped.outfit && (
            <OutfitLayer id={equipped.outfit} position="front" />
          )}

          {/* Layer 7: Head */}
          <g>
            {/* Head shape */}
            <circle cx="150" cy="160" r="72" fill="url(#pug-head-grad)" stroke="#c4a06a" strokeWidth="1.5" />

            {/* Wrinkles */}
            <path d="M120,130 Q150,125 180,130" fill="none" stroke="#c4a06a" strokeWidth="1" opacity="0.4" />
            <path d="M125,140 Q150,136 175,140" fill="none" stroke="#c4a06a" strokeWidth="1" opacity="0.3" />

            {/* Dark muzzle area */}
            <ellipse cx="150" cy="175" rx="35" ry="28" fill="#8b7355" opacity="0.3" />

            {/* Layer 8: Ears */}
            <motion.g animate={earAnimation[mood]}>
              {/* Left ear */}
              <motion.path
                d="M88,120 Q75,90 95,105 Q100,115 95,130"
                fill="#8b6f4e"
                stroke="#7a5f3e"
                strokeWidth="1"
                style={{ originX: "95px", originY: "125px" }}
              />
              {/* Right ear */}
              <motion.path
                d="M212,120 Q225,90 205,105 Q200,115 205,130"
                fill="#8b6f4e"
                stroke="#7a5f3e"
                strokeWidth="1"
                style={{ originX: "205px", originY: "125px" }}
              />
            </motion.g>

            {/* Layer 9: Eyes */}
            <g>
              {isHeartEyes ? (
                <>
                  {/* Heart eyes */}
                  <motion.text
                    x="125" y="160" fontSize="22" textAnchor="middle"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    ❤️
                  </motion.text>
                  <motion.text
                    x="175" y="160" fontSize="22" textAnchor="middle"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.1 }}
                  >
                    ❤️
                  </motion.text>
                </>
              ) : (
                <>
                  {/* Left eye */}
                  <circle cx="125" cy="152" r="12" fill="white" />
                  <motion.circle
                    cx="125" cy="152" r="12"
                    fill="white"
                    animate={isClosed ? { scaleY: 0.1 } : { scaleY: 1 }}
                    style={{ originY: "152px" }}
                    transition={{ duration: 0.1 }}
                  />
                  {!isClosed && (
                    <>
                      <circle cx="127" cy="150" r="7" fill="#3d2b1f" />
                      <circle cx="129" cy="148" r="2.5" fill="white" />
                    </>
                  )}
                  {isClosed && (
                    <path d="M115,152 Q125,157 135,152" fill="none" stroke="#3d2b1f" strokeWidth="2" strokeLinecap="round" />
                  )}

                  {/* Right eye */}
                  <circle cx="175" cy="152" r="12" fill="white" />
                  <motion.circle
                    cx="175" cy="152" r="12"
                    fill="white"
                    animate={isClosed ? { scaleY: 0.1 } : { scaleY: 1 }}
                    style={{ originY: "152px" }}
                    transition={{ duration: 0.1 }}
                  />
                  {!isClosed && (
                    <>
                      <circle cx="177" cy="150" r="7" fill="#3d2b1f" />
                      <circle cx="179" cy="148" r="2.5" fill="white" />
                    </>
                  )}
                  {isClosed && (
                    <path d="M165,152 Q175,157 185,152" fill="none" stroke="#3d2b1f" strokeWidth="2" strokeLinecap="round" />
                  )}

                  {/* Sad droopy eyebrows */}
                  {isSad && (
                    <>
                      <path d="M113,138 Q125,134 137,140" fill="none" stroke="#7a5f3e" strokeWidth="2" strokeLinecap="round" />
                      <path d="M163,140 Q175,134 187,138" fill="none" stroke="#7a5f3e" strokeWidth="2" strokeLinecap="round" />
                    </>
                  )}
                </>
              )}
            </g>

            {/* Layer 10: Nose */}
            <ellipse cx="150" cy="178" rx="14" ry="10" fill="url(#nose-shine)" />
            {/* Nostrils */}
            <ellipse cx="144" cy="179" rx="3" ry="2" fill="#111" />
            <ellipse cx="156" cy="179" rx="3" ry="2" fill="#111" />

            {/* Layer 11: Mouth */}
            <g>
              {isTalkingMouth ? (
                <motion.ellipse
                  cx="150" cy="195" rx="12" ry="8"
                  fill="#c2655a"
                  stroke="#a04535"
                  strokeWidth="1"
                  animate={{ ry: [6, 10, 6], rx: [10, 14, 10] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                />
              ) : isSad ? (
                <path d="M135,195 Q150,188 165,195" fill="none" stroke="#7a5f3e" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <>
                  {/* Smile */}
                  <path d="M150,185 L150,193" stroke="#7a5f3e" strokeWidth="1.5" />
                  <path d="M135,193 Q150,202 165,193" fill="none" stroke="#7a5f3e" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Tongue peek for happy/excited */}
                  {(mood === "happy" || mood === "excited" || mood === "celebrating") && (
                    <ellipse cx="155" cy="200" rx="6" ry="4" fill="#e8838b" />
                  )}
                </>
              )}
            </g>

            {/* Cheek blush */}
            <circle cx="110" cy="172" r="10" fill="#f5a0a0" opacity="0.2" />
            <circle cx="190" cy="172" r="10" fill="#f5a0a0" opacity="0.2" />

            {/* Layer 12: Glasses */}
            {equipped.glasses && <GlassesLayer id={equipped.glasses} />}

            {/* Layer 13: Hat */}
            {equipped.hat && <HatLayer id={equipped.hat} />}
          </g>

          {/* Layer 14: Accessory (front — bowtie, scarf, medal, etc.) */}
          {equipped.accessory && (
            <AccessoryLayer id={equipped.accessory} position="front" />
          )}
        </motion.g>

        {/* Floating mood particles */}
        <AnimatePresence>
          {showParticles && mood === "sleeping" && (
            <motion.text
              x="200" y="120" fontSize="18"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: -30 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💤
            </motion.text>
          )}
          {showParticles && mood === "love" && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.text
                  key={`heart-${i}`}
                  x={120 + i * 40} y={100}
                  fontSize="14"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], y: -25 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                >
                  💜
                </motion.text>
              ))}
            </>
          )}
          {showParticles && mood === "celebrating" && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.text
                  key={`sparkle-${i}`}
                  x={100 + i * 50} y={90}
                  fontSize="12"
                  initial={{ opacity: 0, y: 0, rotate: 0 }}
                  animate={{ opacity: [0, 1, 0], y: -20, rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                >
                  ✨
                </motion.text>
              ))}
            </>
          )}
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}
