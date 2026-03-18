"use client";

import { motion } from "framer-motion";

const equipAnim = { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: "spring" as const, stiffness: 350, damping: 18 } };

interface AccessoryLayerProps {
  id: string;
  position: "front" | "behind";
}

export function AccessoryLayer({ id, position }: AccessoryLayerProps) {
  // Items that render behind the body
  const behindItems = ["wings", "golden-wings", "backpack"];
  const isBehind = behindItems.includes(id);

  if (position === "behind" && !isBehind) return null;
  if (position === "front" && isBehind) return null;

  switch (id) {
    case "acc-bowtie":
      return (
        <motion.g {...equipAnim}>
          {/* Bow tie at neck */}
          <path d="M133,218 L150,225 L167,218 L150,222 Z" fill="#ec4899" stroke="#db2777" strokeWidth="1" />
          <path d="M133,232 L150,225 L167,232 L150,228 Z" fill="#ec4899" stroke="#db2777" strokeWidth="1" />
          <circle cx="150" cy="225" r="4" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
        </motion.g>
      );
    case "acc-necklace":
      return (
        <motion.g {...equipAnim}>
          <path d="M115,218 Q150,240 185,218" fill="none" stroke="#fbbf24" strokeWidth="2" />
          {/* Pearls */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const t = i / 6;
            const x = 115 + t * 70;
            const y = 218 + Math.sin(t * Math.PI) * 22;
            return <circle key={i} cx={x} cy={y} r="3.5" fill="#fef3c7" stroke="#fbbf24" strokeWidth="0.5" />;
          })}
        </motion.g>
      );
    case "acc-scarf":
      return (
        <motion.g {...equipAnim}>
          {/* Scarf wrapped around neck */}
          <path d="M108,215 Q150,230 192,215 Q195,225 192,235 Q150,250 108,235 Q105,225 108,215" fill="#f43f5e" opacity="0.85" stroke="#e11d48" strokeWidth="1" />
          {/* Hanging end */}
          <path d="M165,235 L170,280 Q175,285 168,286 L163,280 L160,235" fill="#f43f5e" opacity="0.8" stroke="#e11d48" strokeWidth="0.5" />
          {/* Stripes */}
          <path d="M115,222 Q150,236 185,222" fill="none" stroke="#fda4af" strokeWidth="2" opacity="0.4" />
          <path d="M110,230 Q150,244 190,230" fill="none" stroke="#fda4af" strokeWidth="2" opacity="0.3" />
        </motion.g>
      );
    case "acc-wings":
      return (
        <motion.g {...equipAnim}>
          {/* Left wing */}
          <path d="M90,230 Q50,200 60,250 Q55,220 75,260 Q65,240 85,270" fill="white" opacity="0.7" stroke="#e2e8f0" strokeWidth="1" />
          <path d="M90,230 Q60,215 65,255" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
          {/* Right wing */}
          <path d="M210,230 Q250,200 240,250 Q245,220 225,260 Q235,240 215,270" fill="white" opacity="0.7" stroke="#e2e8f0" strokeWidth="1" />
          <path d="M210,230 Q240,215 235,255" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
        </motion.g>
      );
    case "acc-backpack":
      return (
        <motion.g {...equipAnim}>
          {/* Backpack behind body */}
          <rect x="125" y="235" width="50" height="45" rx="8" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
          <rect x="133" y="240" width="34" height="18" rx="4" fill="#fb923c" stroke="#ea580c" strokeWidth="0.5" />
          {/* Straps peeking */}
          <line x1="135" y1="235" x2="120" y2="220" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="165" y1="235" x2="180" y2="220" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
          {/* Zipper */}
          <line x1="150" y1="258" x2="150" y2="275" stroke="#fbbf24" strokeWidth="1" />
          <circle cx="150" cy="258" r="2" fill="#fbbf24" />
        </motion.g>
      );
    case "acc-medal":
      return (
        <motion.g {...equipAnim}>
          {/* Ribbon */}
          <path d="M140,218 L145,260 L150,250 L155,260 L160,218" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.5" />
          {/* Medal */}
          <motion.circle
            cx="150" cy="265" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <text x="150" y="270" fontSize="14" textAnchor="middle">⭐</text>
        </motion.g>
      );
    case "acc-headphones":
      return (
        <motion.g {...equipAnim}>
          {/* Band */}
          <path d="M90,140 Q90,90 150,85 Q210,90 210,140" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
          {/* Left cup */}
          <rect x="78" y="130" width="22" height="28" rx="6" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <rect x="82" y="135" width="14" height="18" rx="4" fill="#374151" />
          {/* Right cup */}
          <rect x="200" y="130" width="22" height="28" rx="6" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <rect x="204" y="135" width="14" height="18" rx="4" fill="#374151" />
          {/* Cushion detail */}
          <ellipse cx="89" cy="144" rx="3" ry="8" fill="#4b5563" />
          <ellipse cx="211" cy="144" rx="3" ry="8" fill="#4b5563" />
        </motion.g>
      );
    case "acc-bandana":
      return (
        <motion.g {...equipAnim}>
          {/* Triangle bandana at neck */}
          <path d="M108,218 L150,270 L192,218" fill="#dc2626" stroke="#b91c1c" strokeWidth="1" />
          {/* Knot */}
          <circle cx="150" cy="218" r="5" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
          {/* Pattern dots */}
          <circle cx="135" cy="235" r="2" fill="white" opacity="0.3" />
          <circle cx="150" cy="248" r="2" fill="white" opacity="0.3" />
          <circle cx="165" cy="235" r="2" fill="white" opacity="0.3" />
          <circle cx="150" cy="232" r="1.5" fill="white" opacity="0.2" />
        </motion.g>
      );
    case "acc-golden-wings":
      return (
        <motion.g {...equipAnim} filter="url(#epic-glow)">
          {/* Left golden wing */}
          <motion.path
            d="M88,225 Q40,185 50,240 Q35,200 65,255 Q45,225 80,270 Q55,250 88,275"
            fill="#fbbf24" opacity="0.85" stroke="#d97706" strokeWidth="1"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ originX: "88px", originY: "250px" }}
          />
          {/* Left feather lines */}
          <path d="M88,230 Q55,200 55,245" fill="none" stroke="#fde68a" strokeWidth="0.5" opacity="0.5" />
          <path d="M85,240 Q50,215 60,260" fill="none" stroke="#fde68a" strokeWidth="0.5" opacity="0.4" />
          {/* Right golden wing */}
          <motion.path
            d="M212,225 Q260,185 250,240 Q265,200 235,255 Q255,225 220,270 Q245,250 212,275"
            fill="#fbbf24" opacity="0.85" stroke="#d97706" strokeWidth="1"
            animate={{ rotate: [2, -2, 2] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ originX: "212px", originY: "250px" }}
          />
          <path d="M212,230 Q245,200 245,245" fill="none" stroke="#fde68a" strokeWidth="0.5" opacity="0.5" />
          <path d="M215,240 Q250,215 240,260" fill="none" stroke="#fde68a" strokeWidth="0.5" opacity="0.4" />
          {/* Sparkle effects */}
          <motion.circle cx="55" cy="220" r="2" fill="#fbbf24" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <motion.circle cx="245" cy="220" r="2" fill="#fbbf24" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
        </motion.g>
      );
    default:
      return null;
  }
}
