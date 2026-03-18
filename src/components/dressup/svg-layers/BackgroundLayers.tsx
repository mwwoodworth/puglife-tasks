"use client";

import { motion } from "framer-motion";

export function BackgroundLayer({ id }: { id: string }) {
  switch (id) {
    case "bg-clouds":
      return (
        <g opacity="0.6" filter="drop-shadow(0px 2px 4px rgba(255,255,255,0.4))">
          <motion.g animate={{ x: [0, 8, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
            <ellipse cx="60" cy="50" rx="35" ry="15" fill="white" />
            <ellipse cx="50" cy="48" rx="25" ry="12" fill="white" />
            <ellipse cx="75" cy="52" rx="20" ry="10" fill="white" />
          </motion.g>
          <motion.g animate={{ x: [0, -6, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}>
            <ellipse cx="230" cy="35" rx="30" ry="12" fill="white" />
            <ellipse cx="240" cy="33" rx="22" ry="10" fill="white" />
            <ellipse cx="215" cy="37" rx="18" ry="8" fill="white" />
          </motion.g>
          <motion.g animate={{ x: [0, 5, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}>
            <ellipse cx="150" cy="25" rx="28" ry="10" fill="white" />
          </motion.g>
        </g>
      );
    case "bg-stars":
      return (
        <g>
          {[
            { x: 30, y: 30, r: 2.5, d: 0 }, { x: 80, y: 15, r: 1.5, d: 0.3 }, { x: 140, y: 25, r: 2, d: 0.6 },
            { x: 200, y: 20, r: 1.5, d: 0.9 }, { x: 260, y: 35, r: 2.5, d: 1.2 }, { x: 50, y: 55, r: 1.5, d: 0.4 },
            { x: 250, y: 60, r: 2, d: 0.7 }, { x: 170, y: 45, r: 2, d: 1.0 }, { x: 100, y: 50, r: 1.5, d: 1.5 },
          ].map((s, i) => (
            <motion.path
              key={i}
              d={`M${s.x},${s.y - s.r} L${s.x + s.r/2},${s.y - s.r/2} L${s.x + s.r},${s.y} L${s.x + s.r/2},${s.y + s.r/2} L${s.x},${s.y + s.r} L${s.x - s.r/2},${s.y + s.r/2} L${s.x - s.r},${s.y} L${s.x - s.r/2},${s.y - s.r/2} Z`}
              fill="#FDE047"
              filter="url(#soft-drop-shadow)"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.7, 1.3, 0.7], rotate: [0, 45, 0] }}
              transition={{ duration: 2 + (i % 2), repeat: Infinity, delay: s.d, ease: "easeInOut" }}
            />
          ))}
        </g>
      );
    case "bg-hearts":
      return (
        <g opacity="0.45">
          {[
            { x: 40, y: 40, s: 1, d: 0 }, { x: 100, y: 20, s: 0.8, d: 0.5 },
            { x: 200, y: 30, s: 1.2, d: 1 }, { x: 260, y: 50, s: 0.9, d: 1.5 },
            { x: 70, y: 60, s: 0.7, d: 0.8 }, { x: 240, y: 15, s: 1, d: 0.3 },
          ].map((h, i) => (
            <motion.g
              key={i}
              animate={{ y: [h.y, h.y - 12, h.y], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: h.d, ease: "easeInOut" }}
              transform={`translate(${h.x}, 0) scale(${h.s})`}
            >
              <path d="M0,5 A5,5 0 0,1 10,5 A5,5 0 0,1 20,5 Q20,12 10,20 Q0,12 0,5 Z" fill="#F472B6" />
            </motion.g>
          ))}
        </g>
      );
    case "bg-beach":
      return (
        <g opacity="0.5">
          <defs>
            <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>
          </defs>
          {/* Sun */}
          <motion.circle cx="250" cy="30" r="22" fill="url(#sun-grad)" filter="url(#soft-drop-shadow)"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <motion.line
              key={angle}
              x1={250 + Math.cos(angle * Math.PI / 180) * 26}
              y1={30 + Math.sin(angle * Math.PI / 180) * 26}
              x2={250 + Math.cos(angle * Math.PI / 180) * 36}
              y2={30 + Math.sin(angle * Math.PI / 180) * 36}
              stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round"
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: angle / 360, ease: "easeInOut" }}
            />
          ))}
          {/* Detailed Palm */}
          <path d="M40,80 Q45,50 50,25" fill="none" stroke="#713F12" strokeWidth="4" strokeLinecap="round" />
          <path d="M50,25 Q15,10 5,20" fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
          <path d="M50,25 Q60,5 80,15" fill="none" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
          <path d="M50,25 Q35,0 15,5" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
          <path d="M50,25 Q75,10 90,25" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
          <circle cx="43" cy="28" r="3" fill="#854D0E" />
          <circle cx="48" cy="32" r="3.5" fill="#854D0E" />
        </g>
      );
    case "bg-forest":
      return (
        <g opacity="0.4">
          {/* Trees */}
          {[
            { x: 20, s: 1 }, { x: 60, s: 0.8 }, { x: 240, s: 0.9 }, { x: 275, s: 1.1 },
            { x: 40, s: 0.6 }, { x: 260, s: 0.7 }
          ].map((t, i) => (
            <g key={i} transform={`translate(${t.x}, 0) scale(${t.s})`}>
              <rect x="-3" y="45" width="6" height="35" fill="#713F12" />
              <path d="M0,15 L-18,55 L18,55 Z" fill="#15803D" />
              <path d="M0,5 L-14,40 L14,40 Z" fill="#16A34A" />
              <path d="M0,15 L-18,55 L0,55 Z" fill="#14532D" opacity="0.4" />
              <path d="M0,5 L-14,40 L0,40 Z" fill="#14532D" opacity="0.4" />
            </g>
          ))}
          {/* Glowing Fireflies */}
          {[10, 2, 8, 4, 12].map((delay, i) => (
            <motion.circle key={`ff-${i}`} cx={100 + i*30} cy={60 + (i%2)*10} r="1" fill="#BEF264" filter="url(#soft-drop-shadow)"
              animate={{ opacity: [0, 1, 0], y: [0, -10, 0] }}
              transition={{ duration: 3 + (i%3), repeat: Infinity, delay: delay*0.2 }}
            />
          ))}
        </g>
      );
    case "bg-rainbow":
      return (
        <g opacity="0.45" filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.1))">
          {[
            { r: 125, color: "#EF4444" },
            { r: 115, color: "#F97316" },
            { r: 105, color: "#FBBF24" },
            { r: 95, color: "#22C55E" },
            { r: 85, color: "#3B82F6" },
            { r: 75, color: "#8B5CF6" },
          ].map((band, i) => (
            <path
              key={i}
              d={`M${150 - band.r},80 A${band.r},${band.r} 0 0,1 ${150 + band.r},80`}
              fill="none" stroke={band.color} strokeWidth="10" opacity="0.9"
            />
          ))}
        </g>
      );
    case "bg-aurora":
      return (
        <g opacity="0.5">
          <defs>
            <linearGradient id="aurora-1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
              <stop offset="30%" stopColor="#10B981" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="aurora-2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
              <stop offset="40%" stopColor="#06B6D4" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#A855F7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,40 Q75,0 150,35 Q225,70 300,30"
            fill="none" stroke="url(#aurora-1)" strokeWidth="20" filter="blur(8px)"
            animate={{ d: ["M0,40 Q75,0 150,35 Q225,70 300,30", "M0,35 Q75,20 150,25 Q225,50 300,35", "M0,40 Q75,0 150,35 Q225,70 300,30"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,55 Q100,20 200,50 Q250,70 300,45"
            fill="none" stroke="url(#aurora-2)" strokeWidth="15" filter="blur(6px)"
            animate={{ d: ["M0,55 Q100,20 200,50 Q250,70 300,45", "M0,50 Q100,40 200,40 Q250,50 300,50", "M0,55 Q100,20 200,50 Q250,70 300,45"] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Bright twinkling stars */}
          {[{ x: 50, y: 15 }, { x: 130, y: 10 }, { x: 220, y: 18 }, { x: 270, y: 8 }, { x: 80, y: 25 }, { x: 180, y: 15 }].map((s, i) => (
            <motion.circle key={i} cx={s.x} cy={s.y} r="1.5" fill="white"
              animate={{ opacity: [0.1, 1, 0.1], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2 + (i%2), repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </g>
      );
    default:
      return null;
  }
}