"use client";

import { motion } from "framer-motion";

export function BackgroundLayer({ id }: { id: string }) {
  switch (id) {
    case "bg-clouds":
      return (
        <g opacity="0.4">
          <motion.g animate={{ x: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
            <ellipse cx="60" cy="50" rx="30" ry="12" fill="white" />
            <ellipse cx="50" cy="48" rx="20" ry="10" fill="white" />
          </motion.g>
          <motion.g animate={{ x: [0, -4, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
            <ellipse cx="230" cy="35" rx="25" ry="10" fill="white" />
            <ellipse cx="240" cy="33" rx="18" ry="8" fill="white" />
          </motion.g>
          <motion.g animate={{ x: [0, 3, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}>
            <ellipse cx="150" cy="25" rx="22" ry="9" fill="white" />
          </motion.g>
        </g>
      );
    case "bg-stars":
      return (
        <g>
          {[
            { x: 30, y: 30, d: 0 }, { x: 80, y: 15, d: 0.3 }, { x: 140, y: 25, d: 0.6 },
            { x: 200, y: 20, d: 0.9 }, { x: 260, y: 35, d: 1.2 }, { x: 50, y: 55, d: 0.4 },
            { x: 250, y: 60, d: 0.7 }, { x: 170, y: 45, d: 1.0 },
          ].map((s, i) => (
            <motion.circle
              key={i} cx={s.x} cy={s.y} r="2"
              fill="#fbbf24"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: s.d }}
            />
          ))}
        </g>
      );
    case "bg-hearts":
      return (
        <g opacity="0.35">
          {[
            { x: 40, y: 40, s: 10, d: 0 }, { x: 100, y: 20, s: 8, d: 0.5 },
            { x: 200, y: 30, s: 12, d: 1 }, { x: 260, y: 50, s: 9, d: 1.5 },
            { x: 70, y: 60, s: 7, d: 0.8 }, { x: 240, y: 15, s: 10, d: 0.3 },
          ].map((h, i) => (
            <motion.text
              key={i} x={h.x} y={h.y} fontSize={h.s}
              animate={{ y: [h.y, h.y - 8, h.y], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: h.d }}
            >
              💜
            </motion.text>
          ))}
        </g>
      );
    case "bg-beach":
      return (
        <g opacity="0.3">
          {/* Sun */}
          <motion.circle cx="250" cy="30" r="18" fill="#fbbf24"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <motion.line
              key={angle}
              x1={250 + Math.cos(angle * Math.PI / 180) * 22}
              y1={30 + Math.sin(angle * Math.PI / 180) * 22}
              x2={250 + Math.cos(angle * Math.PI / 180) * 30}
              y2={30 + Math.sin(angle * Math.PI / 180) * 30}
              stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: angle / 360 }}
            />
          ))}
          {/* Palm */}
          <line x1="40" y1="80" x2="45" y2="30" stroke="#8b6914" strokeWidth="3" />
          <path d="M45,30 Q20,15 10,25" fill="#22c55e" stroke="#16a34a" strokeWidth="0.5" />
          <path d="M45,30 Q55,10 70,20" fill="#22c55e" stroke="#16a34a" strokeWidth="0.5" />
          <path d="M45,30 Q30,5 15,10" fill="#16a34a" stroke="#15803d" strokeWidth="0.5" />
        </g>
      );
    case "bg-forest":
      return (
        <g opacity="0.25">
          {/* Trees */}
          {[20, 60, 240, 275].map((x, i) => (
            <g key={i}>
              <rect x={x - 3} y={50} width="6" height="30" fill="#8b6914" />
              <path d={`M${x},20 L${x - 15},55 L${x + 15},55 Z`} fill="#22c55e" />
              <path d={`M${x},10 L${x - 12},40 L${x + 12},40 Z`} fill="#16a34a" />
            </g>
          ))}
          {/* Mushroom */}
          <rect x="148" y="70" width="4" height="8" fill="#fde68a" />
          <ellipse cx="150" cy="70" rx="8" ry="5" fill="#ef4444" />
          <circle cx="147" cy="68" r="1.5" fill="white" opacity="0.6" />
          <circle cx="153" cy="69" r="1" fill="white" opacity="0.5" />
        </g>
      );
    case "bg-rainbow":
      return (
        <g opacity="0.25">
          {[
            { r: 120, color: "#ef4444" },
            { r: 112, color: "#f97316" },
            { r: 104, color: "#fbbf24" },
            { r: 96, color: "#22c55e" },
            { r: 88, color: "#3b82f6" },
            { r: 80, color: "#8b5cf6" },
          ].map((band, i) => (
            <path
              key={i}
              d={`M${150 - band.r},80 A${band.r},${band.r} 0 0,1 ${150 + band.r},80`}
              fill="none" stroke={band.color} strokeWidth="6"
            />
          ))}
        </g>
      );
    case "bg-aurora":
      return (
        <g opacity="0.3">
          <defs>
            <linearGradient id="aurora-grad-1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
              <stop offset="30%" stopColor="#22c55e" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="aurora-grad-2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#a855f7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,40 Q75,10 150,35 Q225,60 300,30"
            fill="none" stroke="url(#aurora-grad-1)" strokeWidth="15"
            animate={{ d: ["M0,40 Q75,10 150,35 Q225,60 300,30", "M0,35 Q75,20 150,30 Q225,50 300,35", "M0,40 Q75,10 150,35 Q225,60 300,30"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,55 Q100,30 200,50 Q250,60 300,45"
            fill="none" stroke="url(#aurora-grad-2)" strokeWidth="10"
            animate={{ d: ["M0,55 Q100,30 200,50 Q250,60 300,45", "M0,50 Q100,40 200,45 Q250,50 300,50", "M0,55 Q100,30 200,50 Q250,60 300,45"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Stars through aurora */}
          {[{ x: 50, y: 15 }, { x: 130, y: 10 }, { x: 220, y: 18 }, { x: 270, y: 8 }].map((s, i) => (
            <motion.circle key={i} cx={s.x} cy={s.y} r="1.5" fill="white"
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </g>
      );
    default:
      return null;
  }
}
