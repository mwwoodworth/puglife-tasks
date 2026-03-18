"use client";

import { motion, AnimatePresence, TargetAndTransition } from "framer-motion";
import { PugMood, DressUpSlot } from "@/lib/types";
import { useCallback, useEffect, useState, useRef } from "react";

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
  audioVolumeLevel?: number; // Hook for Phase 3 Lip Sync
}

// ── Ultra-Polished Color Palette with Gradients ──
const C = {
  outline: "#1F1513",     // Even richer, darker brown outline
  eyeWhite: "#FFFFFF",
  iris: "#2A1409",        // Darker, wetter looking eyes
  tongueFlat: "#FF7B93",
  cheek: "#FF708C",       // More saturated blush
  pawPad: "#4D362C",      
} as const;

export default function SvgPug({
  mood,
  equipped,
  size = 120,
  onClick,
  isTalking = false,
  interactive = true,
  showParticles = false,
  audioVolumeLevel = 0,
}: SvgPugProps) {
  const [blinking, setBlinking] = useState(false);
  const [tapReaction, setTapReaction] = useState<string | null>(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-blink & Dynamic Global Mouse Tracking
  useEffect(() => {
    if (mood === "sleeping") return;
    
    // Blink logic - fast, organic
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 120); 
    };
    const blinkInterval = setInterval(blink, 2500 + Math.random() * 3000);
    
    // Global mouse tracking for eye pupils
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const diffX = e.clientX - centerX;
      const diffY = e.clientY - centerY;
      
      // Limit eye movement distance based on distance from center
      const angle = Math.atan2(diffY, diffX);
      const distance = Math.min(Math.sqrt(diffX*diffX + diffY*diffY) / 100, 6); // Max 6px radius
      
      setPupilOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    
    return () => {
      clearInterval(blinkInterval);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mood, interactive]);

  const handleClick = useCallback(() => {
    if (!interactive) return;
    onClick?.();
    const reactions = ["bounce", "wiggle", "squish"];
    setTapReaction(reactions[Math.floor(Math.random() * reactions.length)]);
    setTimeout(() => setTapReaction(null), 600);
  }, [interactive, onClick]);

  const s = size / 120;
  const easeIO = "easeInOut" as const;

  // ── Lifelike Organic Breathing ──
  const breathing: TargetAndTransition = {
    scaleX: [1, 1.015, 1],
    scaleY: [1, 0.98, 1],
    transition: { duration: 2.5, repeat: Infinity, ease: easeIO }
  };

  // ── High-Fidelity Physics/Body Animations ──
  const bodyAnimation: Record<PugMood, TargetAndTransition> = {
    sleeping: { scaleY: [1, 1.05, 1], scaleX: [1, 0.96, 1], transition: { duration: 3.5, repeat: Infinity, ease: easeIO } },
    idle: { y: [0, -3 * s, 0], transition: { duration: 3, repeat: Infinity, ease: easeIO } },
    happy: { y: [0, -10 * s, 0], scaleY: [1, 0.95, 1.04, 1], transition: { duration: 0.6, repeat: Infinity, ease: easeIO } },
    excited: { y: [0, -16 * s, 0], scaleX: [1, 0.9, 1.08, 1], scaleY: [1, 1.1, 0.9, 1], transition: { duration: 0.35, repeat: Infinity } },
    celebrating: { y: [0, -18 * s, 0], scaleX: [1, 0.88, 1.1, 1], scaleY: [1, 1.12, 0.88, 1], rotate: [0, -6, 6, 0], transition: { duration: 0.45, repeat: Infinity } },
    sad: { y: [0, 3, 0], scale: 0.94, transition: { duration: 4, repeat: Infinity, ease: easeIO } },
    eating: { y: [0, -4, 0], scaleY: [1, 0.96, 1.03, 1], transition: { duration: 0.3, repeat: Infinity } },
    love: { scale: [1, 1.06, 1], x: [0, 4, -4, 0], transition: { duration: 1.4, repeat: Infinity, ease: easeIO } },
    "working-out": { y: [0, -8, 0], scaleY: [1, 0.92, 1.05, 1], transition: { duration: 0.35, repeat: Infinity } },
  };

  const earAnimation: Record<PugMood, TargetAndTransition> = {
    sleeping: { rotate: -12, transition: { duration: 1 } },
    idle: { rotate: [0, -4, 4, 0], transition: { duration: 4.5, repeat: Infinity, ease: easeIO } },
    happy: { rotate: [0, 14, -14, 0], transition: { duration: 0.6, repeat: Infinity, delay: 0.08 } },
    excited: { rotate: [0, 22, -22, 0], transition: { duration: 0.35, repeat: Infinity, delay: 0.05 } },
    celebrating: { rotate: [0, 28, -28, 0], transition: { duration: 0.45, repeat: Infinity, delay: 0.06 } },
    sad: { rotate: -18, transition: { duration: 0.8, ease: easeIO } },
    eating: { rotate: [0, 7, -7, 0], transition: { duration: 0.4, repeat: Infinity, delay: 0.05 } },
    love: { rotate: [0, 8, -8, 0], transition: { duration: 1.4, repeat: Infinity, delay: 0.1 } },
    "working-out": { rotate: [0, 12, -12, 0], transition: { duration: 0.35, repeat: Infinity } },
  };

  const tailAnimation: Record<PugMood, TargetAndTransition> = {
    sleeping: { rotate: 0 },
    idle: { rotate: [0, 6, -6, 0], transition: { duration: 3, repeat: Infinity, ease: easeIO } },
    happy: { rotate: [0, 30, -30, 0], transition: { duration: 0.3, repeat: Infinity } },
    excited: { rotate: [0, 45, -45, 0], transition: { duration: 0.15, repeat: Infinity } },
    celebrating: { rotate: [0, 50, -50, 0], transition: { duration: 0.2, repeat: Infinity } },
    sad: { rotate: -10, transition: { duration: 0.8 } },
    eating: { rotate: [0, 15, -15, 0], transition: { duration: 0.4, repeat: Infinity } },
    love: { rotate: [0, 22, -22, 0], transition: { duration: 0.45, repeat: Infinity } },
    "working-out": { rotate: [0, 20, -20, 0], transition: { duration: 0.3, repeat: Infinity } },
  };

  const isHeartEyes = mood === "love";
  const isClosed = mood === "sleeping" || blinking;
  const isSad = mood === "sad";
  
  // Phase 3 Prep: Audio Volume drives mouth height dynamically
  const isTalkingMouth = isTalking || mood === "eating";
  const lipSyncOffset = isTalking ? (audioVolumeLevel > 0 ? audioVolumeLevel * 15 : 10) : (mood === "eating" ? 12 : 0);

  const tapAnim = tapReaction === "bounce" ? { scale: [1, 1.18, 0.88, 1.1, 1] } : tapReaction === "wiggle" ? { rotate: [0, -10, 10, -6, 6, 0] } : tapReaction === "squish" ? { scaleX: [1, 1.2, 0.9, 1], scaleY: [1, 0.8, 1.1, 1] } : undefined;

  return (
    <motion.div
      ref={containerRef}
      onClick={handleClick}
      className="relative cursor-pointer select-none"
      style={{ width: size, height: size * 1.15 }}
      whileHover={interactive ? { scale: 1.03 } : undefined}
      whileTap={interactive ? { scale: 0.92 } : undefined}
      animate={tapAnim}
      transition={tapReaction ? { duration: 0.6, ease: easeIO } : undefined}
    >
      {/* 3D Radiant Aura */}
      <div
        className="absolute inset-0 rounded-full animate-glow-pulse opacity-60"
        style={{
          background: "radial-gradient(circle, rgba(167,139,250,0.3) 0%, rgba(236,72,153,0.1) 40%, transparent 75%)",
          transform: "scale(1.5)",
          filter: "blur(8px)",
        }}
      />

      <svg viewBox="0 0 300 345" width={size} height={size * 1.15} xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
        <defs>
          {/* Advanced Multi-Stop Volumetric Gradients */}
          <radialGradient id="body-grad" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF6EB" />   
            <stop offset="30%" stopColor="#FDE3C4" />
            <stop offset="70%" stopColor="#E6B88A" />
            <stop offset="100%" stopColor="#C4915F" /> 
          </radialGradient>
          
          <radialGradient id="mask-grad" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#5E5659" />
            <stop offset="40%" stopColor="#363033" />
            <stop offset="85%" stopColor="#1E1A1C" />
            <stop offset="100%" stopColor="#120F10" />
          </radialGradient>
          
          <linearGradient id="tongue-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFA6B6" />
            <stop offset="40%" stopColor="#FF7A95" />
            <stop offset="100%" stopColor="#E64A6A" />
          </linearGradient>

          <radialGradient id="shadow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.35)" />
            <stop offset="60%" stopColor="rgba(0,0,0,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* Deep 3D Drop Shadows */}
          <filter id="soft-drop-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.25" />
          </filter>
          
          <filter id="inner-shadow">
            <feOffset dx="0" dy="3"/>
            <feGaussianBlur stdDeviation="3" result="offset-blur"/>
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
            <feFlood floodColor="black" floodOpacity="0.3" result="color"/>
            <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
            <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
          </filter>
        </defs>

        {equipped.background && <BackgroundLayer id={equipped.background} />}

        <motion.ellipse cx="150" cy="326" rx="80" ry="14" fill="url(#shadow-grad)" animate={bodyAnimation[mood]} />

        <motion.g style={{ originX: "205px", originY: "258px" }} animate={tailAnimation[mood]}>
          <path d="M195,258 Q230,225 245,245 Q255,265 235,275 Q220,255 215,262 Q210,275 200,265" fill="url(#body-grad)" stroke={C.outline} strokeWidth="3.5" strokeLinejoin="round" />
          <circle cx="242" cy="252" r="12" fill="url(#body-grad)" stroke={C.outline} strokeWidth="3" />
        </motion.g>

        {equipped.accessory && <AccessoryLayer id={equipped.accessory} position="behind" />}
        {equipped.outfit && <OutfitLayer id={equipped.outfit} position="behind" />}

        {/* ── BODY ── */}
        <motion.g animate={bodyAnimation[mood]}>
          <motion.g animate={mood === "sleeping" ? undefined : breathing}>
            <ellipse cx="150" cy="265" rx="80" ry="68" fill="url(#body-grad)" stroke={C.outline} strokeWidth="3" />
            <ellipse cx="150" cy="275" rx="50" ry="45" fill="#FFFFFF" opacity="0.4" filter="blur(6px)" />

            <g stroke={C.outline} strokeWidth="3" strokeLinejoin="round" filter="url(#inner-shadow)">
              <path d="M96,318 Q115,320 130,318 C130,285 120,265 96,265 C76,265 80,318 96,318 Z" fill="url(#body-grad)" />
              <path d="M204,318 Q185,320 170,318 C170,285 180,265 204,265 C224,265 220,318 204,318 Z" fill="url(#body-grad)" />
            </g>

            <g fill={C.pawPad}>
              <ellipse cx="90" cy="312" rx="4.5" ry="6" transform="rotate(-20 90 312)" />
              <ellipse cx="100" cy="310" rx="5" ry="6.5" />
              <ellipse cx="110" cy="312" rx="4.5" ry="6" transform="rotate(20 110 312)" />
              <ellipse cx="190" cy="312" rx="4.5" ry="6" transform="rotate(-20 190 312)" />
              <ellipse cx="200" cy="310" rx="5" ry="6.5" />
              <ellipse cx="210" cy="312" rx="4.5" ry="6" transform="rotate(20 210 312)" />
            </g>

            {equipped.outfit && <OutfitLayer id={equipped.outfit} position="front" />}
          </motion.g>

          {/* ── HEAD ── */}
          <g>
            <ellipse cx="150" cy="215" rx="46" ry="22" fill="url(#body-grad)" stroke={C.outline} strokeWidth="3" />
            <path d="M108,215 Q150,234 192,215" fill="none" stroke="#A87B51" strokeWidth="4" strokeLinecap="round" opacity="0.6" filter="blur(1px)" />

            <ellipse cx="150" cy="155" rx="102" ry="92" fill="url(#body-grad)" stroke={C.outline} strokeWidth="3" filter="url(#soft-drop-shadow)" />
            <ellipse cx="145" cy="105" rx="45" ry="18" fill="#FFFFFF" opacity="0.3" filter="blur(8px)" transform="rotate(-5 145 105)" />

            {/* MASK */}
            <g stroke={C.outline} strokeWidth="3">
              <ellipse cx="150" cy="184" rx="64" ry="50" fill="url(#mask-grad)" />
              <path d="M112,146 Q150,130 188,146 L184,168 Q150,158 116,168 Z" fill="url(#mask-grad)" />
            </g>
            <ellipse cx="150" cy="158" rx="25" ry="10" fill="#FFFFFF" opacity="0.15" filter="blur(3px)" />

            {/* WRINKLES */}
            <g stroke="#9C6B43" strokeLinecap="round" fill="none">
              <path d="M100,110 Q150,98 200,110" strokeWidth="5" opacity="0.75" />
              <path d="M110,125 Q150,115 190,125" strokeWidth="4" opacity="0.65" />
              <path d="M120,138 Q150,132 180,138" strokeWidth="3" opacity="0.55" />
            </g>

            {/* EARS */}
            <motion.g animate={earAnimation[mood]}>
              <motion.g style={{ originX: "70px", originY: "125px" }}>
                <path d="M65,100 Q40,75 48,115 Q50,145 70,158 Q85,150 90,125 Q95,100 82,90 Z" fill="url(#mask-grad)" stroke={C.outline} strokeWidth="3.5" strokeLinejoin="round" />
                <ellipse cx="68" cy="120" rx="9" ry="16" fill="#3D202D" opacity="0.4" transform="rotate(-18 68 120)" />
              </motion.g>
              <motion.g style={{ originX: "230px", originY: "125px" }}>
                <path d="M235,100 Q260,75 252,115 Q250,145 230,158 Q215,150 210,125 Q205,100 218,90 Z" fill="url(#mask-grad)" stroke={C.outline} strokeWidth="3.5" strokeLinejoin="round" />
                <ellipse cx="232" cy="120" rx="9" ry="16" fill="#3D202D" opacity="0.4" transform="rotate(18 232 120)" />
              </motion.g>
            </motion.g>

            {/* EYES */}
            <g>
              {isHeartEyes ? (
                <>
                  <motion.g animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                    <path d="M115,152 C115,140 102,135 102,148 C102,160 115,172 115,172 C115,172 128,160 128,148 C128,135 115,140 115,152 Z" fill="#FF2E63" stroke={C.outline} strokeWidth="2.5" />
                    <circle cx="108" cy="145" r="4" fill="white" opacity="0.9" />
                  </motion.g>
                  <motion.g animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}>
                    <path d="M185,152 C185,140 172,135 172,148 C172,160 185,172 185,172 C185,172 198,160 198,148 C198,135 185,140 185,152 Z" fill="#FF2E63" stroke={C.outline} strokeWidth="2.5" />
                    <circle cx="178" cy="145" r="4" fill="white" opacity="0.9" />
                  </motion.g>
                </>
              ) : (
                <>
                  <g>
                    <circle cx="118" cy="154" r="24" fill={C.eyeWhite} stroke={C.outline} strokeWidth="3.5" filter="url(#inner-shadow)" />
                    {isClosed ? (
                      <>
                        <path d="M96,154 Q118,168 140,154" fill="none" stroke={C.outline} strokeWidth="4.5" strokeLinecap="round" />
                        <path d="M102,160 L96,167 M118,164 L118,172 M134,160 L140,167" stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" />
                      </>
                    ) : (
                      <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
                        <circle cx="120" cy="154" r="16" fill={C.iris} />
                        <circle cx="123" cy="152" r="10" fill="#0D0704" />
                        <circle cx="113" cy="145" r="7" fill="white" filter="blur(0.5px)" />
                        <circle cx="127" cy="159" r="3" fill="white" opacity="0.85" />
                      </g>
                    )}
                  </g>

                  <g>
                    <circle cx="182" cy="154" r="24" fill={C.eyeWhite} stroke={C.outline} strokeWidth="3.5" filter="url(#inner-shadow)" />
                    {isClosed ? (
                      <>
                        <path d="M160,154 Q182,168 204,154" fill="none" stroke={C.outline} strokeWidth="4.5" strokeLinecap="round" />
                        <path d="M166,160 L160,167 M182,164 L182,172 M198,160 L204,167" stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" />
                      </>
                    ) : (
                      <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
                        <circle cx="180" cy="154" r="16" fill={C.iris} />
                        <circle cx="177" cy="152" r="10" fill="#0D0704" />
                        <circle cx="173" cy="145" r="7" fill="white" filter="blur(0.5px)" />
                        <circle cx="187" cy="159" r="3" fill="white" opacity="0.85" />
                      </g>
                    )}
                  </g>

                  {isSad && (
                    <>
                      <path d="M92,136 Q118,124 142,142" fill="none" stroke={C.outline} strokeWidth="4" strokeLinecap="round" />
                      <path d="M158,142 Q182,124 208,136" fill="none" stroke={C.outline} strokeWidth="4" strokeLinecap="round" />
                    </>
                  )}
                </>
              )}
            </g>

            {/* CHEEKS */}
            <ellipse cx="94" cy="182" rx="18" ry="12" fill={C.cheek} opacity={mood === "love" || mood === "happy" || mood === "celebrating" ? "0.75" : "0.3"} filter="blur(3px)" />
            <ellipse cx="206" cy="182" rx="18" ry="12" fill={C.cheek} opacity={mood === "love" || mood === "happy" || mood === "celebrating" ? "0.75" : "0.3"} filter="blur(3px)" />

            {/* WET NOSE */}
            <g>
              <ellipse cx="150" cy="188" rx="38" ry="26" fill="#141112" stroke={C.outline} strokeWidth="3" filter="url(#inner-shadow)" />
              <ellipse cx="150" cy="184" rx="24" ry="15" fill="#050404" />
              <path d="M134,177 Q150,168 166,177 Q150,180 134,177 Z" fill="#FFFFFF" opacity="0.5" filter="blur(1px)" />
              <ellipse cx="138" cy="188" rx="6" ry="3.5" fill="#000" transform="rotate(18 138 188)" />
              <ellipse cx="162" cy="188" rx="6" ry="3.5" fill="#000" transform="rotate(-18 162 188)" />
            </g>

            {/* MOUTH & LIP SYNC */}
            <g>
              {isTalkingMouth ? (
                <motion.g>
                  {/* Dynamic talking mouth based on lipSyncOffset */}
                  <motion.path
                    d={`M128,206 Q150,${215 + lipSyncOffset} 172,206 Z`}
                    fill="#261017"
                    stroke={C.outline}
                    strokeWidth="3"
                    animate={
                      !audioVolumeLevel && isTalking
                        ? { d: ["M128,206 Q150,218 172,206 Z", "M128,206 Q150,235 172,206 Z", "M128,206 Q150,218 172,206 Z"] }
                        : undefined
                    }
                    transition={{ duration: 0.3, repeat: Infinity }}
                  />
                  <motion.ellipse
                    cx="150" cy="216" rx="12" ry="7"
                    fill="url(#tongue-grad)"
                    animate={{ ry: [6, 9, 6], cy: [214, 218, 214] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  />
                </motion.g>
              ) : isSad ? (
                <path d="M125,212 Q150,198 175,212" fill="none" stroke={C.outline} strokeWidth="4" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M150,196 L150,206" stroke={C.outline} strokeWidth="3" />
                  <path d="M120,206 Q150,228 180,206" fill="none" stroke={C.outline} strokeWidth="4" strokeLinecap="round" />
                  <path d="M110,198 Q122,210 134,204" fill="none" stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M190,198 Q178,210 166,204" fill="none" stroke={C.outline} strokeWidth="2.5" strokeLinecap="round" />
                  
                  {(mood === "happy" || mood === "excited" || mood === "celebrating" || mood === "idle") && (
                    <motion.g
                      animate={mood === "excited" || mood === "celebrating" ? { y: [0, 4, 0], scaleY: [1, 1.15, 1] } : {}}
                      transition={{ duration: 0.2, repeat: Infinity }}
                    >
                      <path d="M140,214 Q150,236 160,214 Z" fill="url(#tongue-grad)" stroke={C.outline} strokeWidth="2.5" />
                      <line x1="150" y1="214" x2="150" y2="226" stroke="#C2304C" strokeWidth="2" strokeLinecap="round" />
                    </motion.g>
                  )}
                </>
              )}
            </g>

            {equipped.glasses && <GlassesLayer id={equipped.glasses} />}
            {equipped.hat && <HatLayer id={equipped.hat} />}
          </g>

          {equipped.accessory && <AccessoryLayer id={equipped.accessory} position="front" />}
        </motion.g>

        {/* Custom Premium Particles */}
        <AnimatePresence>
          {showParticles && mood === "sleeping" && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.g key={`zzz-${i}`} initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }} animate={{ opacity: [0, 1, 0], y: -50, x: 20, scale: 1.3 }} transition={{ duration: 3.5, repeat: Infinity, delay: i * 1.2 }} transform={`translate(${185 + i * 12}, ${90 - i * 12})`}>
                  <path d="M0,0 L18,0 L6,18 L24,18" fill="none" stroke="#C084FC" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" style={{ filter: "drop-shadow(0px 0px 4px rgba(192,132,252,0.6))" }} />
                </motion.g>
              ))}
            </>
          )}
          {showParticles && mood === "love" && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.g key={`heart-${i}`} initial={{ opacity: 0, y: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], y: -60, scale: [0, 1.8, 0.9] }} transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.7 }} transform={`translate(${85 + i * 50}, ${85})`}>
                  <path d="M0,6 A6,6 0 0,1 12,6 A6,6 0 0,1 24,6 Q24,14 12,24 Q0,14 0,6 Z" fill="#FF2E63" style={{ filter: "drop-shadow(0px 4px 6px rgba(255,46,99,0.5))" }} />
                </motion.g>
              ))}
            </>
          )}
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}