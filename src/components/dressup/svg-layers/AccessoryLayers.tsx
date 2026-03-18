"use client";

import { motion } from "framer-motion";

const equipAnim = { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: "spring" as const, stiffness: 350, damping: 18 } };

interface AccessoryLayerProps {
  id: string;
  position: "front" | "behind";
}

export function AccessoryLayer({ id, position }: AccessoryLayerProps) {
  const behindItems = ["wings", "golden-wings", "backpack"];
  const isBehind = behindItems.includes(id);

  if (position === "behind" && !isBehind) return null;
  if (position === "front" && isBehind) return null;

  switch (id) {
    case "acc-bowtie":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 3px 2px rgba(0,0,0,0.3))">
          <defs>
            <linearGradient id="bowtie-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#BE185D" />
            </linearGradient>
          </defs>
          {/* Wings */}
          <path d="M125,215 L150,225 L175,215 L175,235 L150,225 L125,235 Z" fill="url(#bowtie-grad)" stroke="#831843" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Creases */}
          <path d="M135,220 L145,225 M135,230 L145,225 M165,220 L155,225 M165,230 L155,225" fill="none" stroke="#831843" strokeWidth="1" opacity="0.5" />
          {/* Center Knot */}
          <rect x="145" y="218" width="10" height="14" rx="3" fill="#EC4899" stroke="#831843" strokeWidth="1.5" filter="url(#inner-shadow)" />
          <line x1="147" y1="220" x2="147" y2="230" stroke="#FBCFE8" strokeWidth="1" opacity="0.6" />
        </motion.g>
      );
    case "acc-necklace":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.2))">
          <defs>
            <radialGradient id="pearl-grad" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#D97706" />
            </radialGradient>
          </defs>
          <path d="M112,222 Q150,248 188,222" fill="none" stroke="#B45309" strokeWidth="1.5" />
          {/* Premium Pearls */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
            const t = i / 8;
            const x = 112 + t * 76;
            const y = 222 + Math.sin(t * Math.PI) * 26;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="4.5" fill="url(#pearl-grad)" stroke="#B45309" strokeWidth="0.5" />
                <circle cx={x - 1.5} cy={y - 1.5} r="1" fill="#FFFFFF" opacity="0.9" />
              </g>
            );
          })}
        </motion.g>
      );
    case "acc-scarf":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 4px 3px rgba(0,0,0,0.3))">
          <defs>
            <linearGradient id="scarf-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="100%" stopColor="#BE123C" />
            </linearGradient>
          </defs>
          {/* Main wrap */}
          <path d="M102,215 Q150,235 198,215 Q202,228 198,240 Q150,258 102,240 Q98,228 102,215" fill="url(#scarf-grad)" stroke="#881337" strokeWidth="2" strokeLinejoin="round" />
          {/* Tail */}
          <path d="M165,240 L172,295 Q178,300 170,302 L162,295 L158,240" fill="url(#scarf-grad)" stroke="#881337" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Folds & Stripes */}
          <path d="M115,222 Q150,242 185,222 M110,232 Q150,252 190,232" fill="none" stroke="#FFE4E6" strokeWidth="2.5" opacity="0.4" strokeLinecap="round" />
          <path d="M162,250 L170,250 M163,265 L171,265 M165,280 L173,280" fill="none" stroke="#FFE4E6" strokeWidth="2" opacity="0.4" />
          {/* Fringes */}
          <path d="M162,295 L162,305 M166,298 L166,308 M170,300 L170,310 M172,295 L172,305" stroke="#881337" strokeWidth="1" strokeLinecap="round" />
        </motion.g>
      );
    case "acc-wings":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 6px 6px rgba(0,0,0,0.15))">
          <defs>
            <linearGradient id="wing-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
          </defs>
          {/* Left wing - fluffier */}
          <motion.path
            d="M92,235 Q30,195 40,260 Q35,220 65,275 Q45,245 80,285 Q65,265 92,285 Z"
            fill="url(#wing-grad)" stroke="#94A3B8" strokeWidth="1.5" strokeLinejoin="round"
            animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "92px", originY: "250px" }}
          />
          <path d="M92,240 Q60,210 60,255 M88,250 Q55,230 65,270" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          
          {/* Right wing */}
          <motion.path
            d="M208,235 Q270,195 260,260 Q265,220 235,275 Q255,245 220,285 Q235,265 208,285 Z"
            fill="url(#wing-grad)" stroke="#94A3B8" strokeWidth="1.5" strokeLinejoin="round"
            animate={{ rotate: [3, -3, 3] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "208px", originY: "250px" }}
          />
          <path d="M208,240 Q240,210 240,255 M212,250 Q245,230 235,270" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>
      );
    case "acc-backpack":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 5px 4px rgba(0,0,0,0.3))">
          <defs>
            <linearGradient id="pack-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
            <linearGradient id="pocket-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>
          {/* Main pack */}
          <rect x="115" y="230" width="70" height="55" rx="12" fill="url(#pack-grad)" stroke="#7C2D12" strokeWidth="2" filter="url(#inner-shadow)" />
          {/* Front Pocket */}
          <rect x="125" y="245" width="50" height="30" rx="6" fill="url(#pocket-grad)" stroke="#7C2D12" strokeWidth="1.5" filter="url(#inner-shadow)" />
          {/* Straps wrapping over shoulders (visible from front) */}
          <path d="M120,230 Q110,215 125,220" fill="none" stroke="#9A3412" strokeWidth="4" strokeLinecap="round" />
          <path d="M180,230 Q190,215 175,220" fill="none" stroke="#9A3412" strokeWidth="4" strokeLinecap="round" />
          {/* Zipper detail */}
          <line x1="125" y1="245" x2="175" y2="245" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
          <rect x="145" y="245" width="4" height="8" rx="1" fill="#FCD34D" stroke="#B45309" strokeWidth="0.5" />
        </motion.g>
      );
    case "acc-medal":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 3px 2px rgba(0,0,0,0.3))">
          <defs>
            <linearGradient id="ribbon-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <radialGradient id="medal-gold" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </radialGradient>
          </defs>
          {/* V-Ribbon */}
          <path d="M135,220 L150,265 L165,220" fill="none" stroke="url(#ribbon-grad)" strokeWidth="6" strokeLinejoin="round" />
          <path d="M135,220 L150,265 L165,220" fill="none" stroke="#1E3A8A" strokeWidth="8" strokeLinejoin="round" opacity="0.3" style={{ mixBlendMode: 'multiply' }} />
          {/* Medal Pendant */}
          <motion.g animate={{ rotateY: [0, 20, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "150px", originY: "270px" }}>
            <circle cx="150" cy="270" r="16" fill="url(#medal-gold)" stroke="#78350F" strokeWidth="2" filter="url(#inner-shadow)" />
            <circle cx="150" cy="270" r="12" fill="none" stroke="#D97706" strokeWidth="1" />
            <path d="M150,258 L153,266 L161,266 L154,271 L157,279 L150,274 L143,279 L146,271 L139,266 L147,266 Z" fill="#FFFFFF" stroke="#D97706" strokeWidth="0.5" />
          </motion.g>
        </motion.g>
      );
    case "acc-headphones":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 4px 4px rgba(0,0,0,0.3))">
          <defs>
            <linearGradient id="hp-band" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="hp-cup" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          {/* Thick padded band */}
          <path d="M85,145 Q85,85 150,80 Q215,85 215,145" fill="none" stroke="url(#hp-band)" strokeWidth="10" strokeLinecap="round" />
          <path d="M85,145 Q85,85 150,80 Q215,85 215,145" fill="none" stroke="#0F172A" strokeWidth="12" strokeLinecap="round" opacity="0.4" style={{ mixBlendMode: 'multiply' }} />
          
          {/* Left Cup */}
          <rect x="70" y="130" width="26" height="36" rx="8" fill="url(#hp-cup)" stroke="#020617" strokeWidth="2" filter="url(#inner-shadow)" />
          <rect x="74" y="136" width="14" height="24" rx="4" fill="#64748B" />
          {/* Glowing accent */}
          <circle cx="81" cy="148" r="3" fill="#10B981" filter="url(#soft-drop-shadow)" />
          {/* Cushion */}
          <ellipse cx="88" cy="148" rx="6" ry="12" fill="#0F172A" />
          
          {/* Right Cup */}
          <rect x="204" y="130" width="26" height="36" rx="8" fill="url(#hp-cup)" stroke="#020617" strokeWidth="2" filter="url(#inner-shadow)" />
          <rect x="212" y="136" width="14" height="24" rx="4" fill="#64748B" />
          <circle cx="219" cy="148" r="3" fill="#10B981" filter="url(#soft-drop-shadow)" />
          <ellipse cx="212" cy="148" rx="6" ry="12" fill="#0F172A" />
        </motion.g>
      );
    case "acc-bandana":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 3px 2px rgba(0,0,0,0.25))">
          <defs>
            <linearGradient id="bandana-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>
          <path d="M102,218 Q150,225 198,218 L150,278 Z" fill="url(#bandana-grad)" stroke="#7F1D1D" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Crease lines */}
          <path d="M130,222 L145,260 M170,222 L155,260 M150,230 L150,270" fill="none" stroke="#7F1D1D" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
          {/* Knot */}
          <circle cx="150" cy="220" r="6" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1.5" filter="url(#inner-shadow)" />
          {/* Paisley pattern elements */}
          <g fill="#FFFFFF" opacity="0.8">
            <circle cx="135" cy="235" r="2.5" />
            <circle cx="150" cy="250" r="2.5" />
            <circle cx="165" cy="235" r="2.5" />
            <circle cx="150" cy="232" r="1.5" />
            <path d="M140,242 Q145,238 145,245 Q140,248 140,242" />
            <path d="M160,242 Q155,238 155,245 Q160,248 160,242" />
          </g>
        </motion.g>
      );
    case "acc-golden-wings":
      return (
        <motion.g {...equipAnim} filter="url(#epic-glow)">
          <defs>
            <linearGradient id="gold-wing-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          {/* Left golden wing */}
          <motion.path
            d="M88,230 Q25,180 35,245 Q20,200 55,265 Q30,230 70,280 Q45,255 88,285 Z"
            fill="url(#gold-wing-grad)" stroke="#78350F" strokeWidth="1.5" strokeLinejoin="round"
            animate={{ rotate: [-4, 4, -4], scale: [1, 1.05, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ originX: "88px", originY: "255px" }}
          />
          <path d="M88,235 Q50,205 50,250 M85,245 Q45,220 55,265" fill="none" stroke="#FEF08A" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
          
          {/* Right golden wing */}
          <motion.path
            d="M212,230 Q275,180 265,245 Q280,200 245,265 Q270,230 230,280 Q255,255 212,285 Z"
            fill="url(#gold-wing-grad)" stroke="#78350F" strokeWidth="1.5" strokeLinejoin="round"
            animate={{ rotate: [4, -4, 4], scale: [1, 1.05, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
            style={{ originX: "212px", originY: "255px" }}
          />
          <path d="M212,235 Q250,205 250,250 M215,245 Q255,220 245,265" fill="none" stroke="#FEF08A" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
          
          {/* Premium Sparkles */}
          {[
            { cx: 45, cy: 220, d: 0 }, { cx: 255, cy: 220, d: 0.5 }, { cx: 70, cy: 200, d: 1 }, { cx: 230, cy: 200, d: 1.5 }
          ].map((s, i) => (
            <motion.path key={i} d={`M${s.cx},${s.cy-6} L${s.cx+1.5},${s.cy-1.5} L${s.cx+6},${s.cy} L${s.cx+1.5},${s.cy+1.5} L${s.cx},${s.cy+6} L${s.cx-1.5},${s.cy+1.5} L${s.cx-6},${s.cy} L${s.cx-1.5},${s.cy-1.5} Z`} fill="#FFFFFF" filter="url(#soft-drop-shadow)" animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], rotate: 90 }} transition={{ duration: 2, repeat: Infinity, delay: s.d }} />
          ))}
        </motion.g>
      );
    default:
      return null;
  }
}