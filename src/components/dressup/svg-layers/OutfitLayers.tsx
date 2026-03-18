"use client";

import { motion } from "framer-motion";

const equipAnim = { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: "spring" as const, stiffness: 300, damping: 20 } };

interface OutfitLayerProps {
  id: string;
  position: "front" | "behind";
}

export function OutfitLayer({ id, position }: OutfitLayerProps) {
  const behindItems = ["cape", "galaxy-cape"];
  const isBehind = behindItems.includes(id);

  if (position === "behind" && !isBehind) return null;
  if (position === "front" && isBehind) return null;

  switch (id) {
    case "outfit-cape":
      return (
        <motion.g {...equipAnim} filter={position === "behind" ? "drop-shadow(0px 8px 8px rgba(0,0,0,0.4))" : ""}>
          <defs>
            <linearGradient id="cape-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>
          <path d="M105,225 Q80,290 90,340 L150,320 L210,340 Q220,290 195,225" fill="url(#cape-grad)" stroke="#7F1D1D" strokeWidth="2" strokeLinejoin="round" />
          {/* Folds */}
          <path d="M115,230 Q105,280 102,330 M185,230 Q195,280 198,330 M140,230 Q145,280 148,322 M160,230 Q155,280 152,322" fill="none" stroke="#7F1D1D" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        </motion.g>
      );
    case "outfit-tuxedo":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 4px 4px rgba(0,0,0,0.25))">
          <defs>
            <linearGradient id="tux-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          {/* Jacket */}
          <path d="M92,230 L90,300 Q150,315 210,300 L208,230 Q180,225 150,222 Q120,225 92,230" fill="url(#tux-grad)" stroke="#020617" strokeWidth="2" strokeLinejoin="round" />
          {/* Shirt */}
          <path d="M135,225 L150,270 L165,225" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
          {/* Lapels */}
          <path d="M125,225 L145,265 L135,225 Z" fill="#1E293B" stroke="#020617" strokeWidth="1" />
          <path d="M175,225 L155,265 L165,225 Z" fill="#1E293B" stroke="#020617" strokeWidth="1" />
          {/* Premium Bow tie */}
          <path d="M138,225 L150,232 L162,225 L162,235 L150,228 L138,235 Z" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1" />
          <circle cx="150" cy="230" r="3.5" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1" />
          {/* Buttons */}
          <circle cx="150" cy="252" r="2.5" fill="#0F172A" stroke="#475569" strokeWidth="0.5" />
          <circle cx="150" cy="268" r="2.5" fill="#0F172A" stroke="#475569" strokeWidth="0.5" />
        </motion.g>
      );
    case "outfit-princess":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 5px 5px rgba(217,70,239,0.3))">
          <defs>
            <linearGradient id="dress-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F0ABFC" />
              <stop offset="100%" stopColor="#C026D3" />
            </linearGradient>
            <linearGradient id="bodice-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E879F9" />
              <stop offset="100%" stopColor="#A21CAF" />
            </linearGradient>
          </defs>
          {/* Skirt */}
          <path d="M92,230 Q80,295 70,330 L230,330 Q220,295 208,230 Q180,225 150,222 Q120,225 92,230" fill="url(#dress-grad)" stroke="#86198F" strokeWidth="2" strokeLinejoin="round" />
          {/* Folds */}
          <path d="M105,250 Q100,300 95,330 M195,250 Q200,300 205,330 M130,250 Q125,300 120,330 M170,250 Q175,300 180,330" fill="none" stroke="#86198F" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          
          {/* Bodice */}
          <path d="M108,230 Q150,220 192,230 L185,260 Q150,255 115,260 Z" fill="url(#bodice-grad)" stroke="#86198F" strokeWidth="1" />
          
          {/* Gold Sash */}
          <path d="M112,258 Q150,250 188,258 L185,264 Q150,256 115,264 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
          
          {/* Sparkles */}
          <circle cx="130" cy="280" r="2.5" fill="white" />
          <circle cx="165" cy="295" r="2" fill="white" />
          <circle cx="145" cy="310" r="2.5" fill="white" />
          <circle cx="180" cy="280" r="2" fill="white" />
          <circle cx="110" cy="305" r="2" fill="white" />
        </motion.g>
      );
    case "outfit-pajamas":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 3px 3px rgba(0,0,0,0.2))">
          <defs>
            <linearGradient id="pj-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A5B4FC" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
          <path d="M92,230 L88,310 Q150,320 212,310 L208,230 Q180,225 150,222 Q120,225 92,230" fill="url(#pj-grad)" stroke="#3730A3" strokeWidth="2" strokeLinejoin="round" />
          {/* Creases */}
          <path d="M120,230 L115,312 M180,230 L185,312" fill="none" stroke="#312E81" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          
          {/* High-quality Stars & Moons pattern */}
          <path d="M115,255 L118,262 L125,262 L120,267 L122,274 L115,270 L108,274 L110,267 L105,262 L112,262 Z" fill="#FEF08A" transform="scale(0.6) translate(80, 180)" />
          <path d="M170,250 L173,257 L180,257 L175,262 L177,269 L170,265 L163,269 L165,262 L160,257 L167,257 Z" fill="#FEF08A" transform="scale(0.6) translate(120, 160)" />
          <path d="M150,280 A 6,6 0 1,1 158,288 A 8,8 0 1,0 150,280" fill="#FEF08A" />
          <path d="M130,300 A 5,5 0 1,1 137,307 A 7,7 0 1,0 130,300" fill="#FEF08A" />

          {/* Premium Buttons */}
          <circle cx="150" cy="245" r="3.5" fill="#E0E7FF" stroke="#3730A3" strokeWidth="1" />
          <circle cx="150" cy="265" r="3.5" fill="#E0E7FF" stroke="#3730A3" strokeWidth="1" />
          <circle cx="150" cy="285" r="3.5" fill="#E0E7FF" stroke="#3730A3" strokeWidth="1" />
        </motion.g>
      );
    case "outfit-raincoat":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 4px 4px rgba(0,0,0,0.25))">
          <defs>
            <linearGradient id="rain-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="rain-highlight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="20%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <path d="M90,230 L85,310 Q150,320 215,310 L210,230 Q180,225 150,222 Q120,225 90,230" fill="url(#rain-grad)" stroke="#78350F" strokeWidth="2" strokeLinejoin="round" />
          {/* Glossy highlight */}
          <path d="M95,230 L90,310 Q110,315 110,230 Z" fill="url(#rain-highlight)" />
          
          {/* Hood roll */}
          <path d="M105,225 Q150,215 195,225" fill="#F59E0B" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          
          {/* Snaps */}
          <circle cx="150" cy="245" r="4" fill="#78350F" />
          <circle cx="150" cy="245" r="2" fill="#D97706" />
          <circle cx="150" cy="265" r="4" fill="#78350F" />
          <circle cx="150" cy="265" r="2" fill="#D97706" />
          <circle cx="150" cy="285" r="4" fill="#78350F" />
          <circle cx="150" cy="285" r="2" fill="#D97706" />
          
          {/* Pockets with flaps */}
          <path d="M105,275 L128,275 L128,295 L105,295 Z" fill="url(#rain-grad)" stroke="#78350F" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M103,275 L130,275 L125,282 L108,282 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M172,275 L195,275 L195,295 L172,295 Z" fill="url(#rain-grad)" stroke="#78350F" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M170,275 L197,275 L192,282 L175,282 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" strokeLinejoin="round" />
        </motion.g>
      );
    case "outfit-hawaiian":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 3px 3px rgba(0,0,0,0.2))">
          <defs>
            <linearGradient id="hawaii-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          <path d="M92,230 L88,305 Q150,315 212,305 L208,230 Q180,225 150,222 Q120,225 92,230" fill="url(#hawaii-grad)" stroke="#0C4A6E" strokeWidth="2" strokeLinejoin="round" />
          
          {/* Vector Floral pattern */}
          <g stroke="#BE185D" strokeWidth="1" fill="#F472B6">
            <path d="M110,250 Q115,245 120,250 Q115,255 110,250 M115,245 Q120,240 125,245 M115,255 Q120,260 125,255 M105,245 Q110,240 115,245 M105,255 Q110,260 115,255" transform="translate(-5, -5)" />
            <path d="M170,245 Q175,240 180,245 Q175,250 170,245 M175,240 Q180,235 185,240 M175,250 Q180,255 185,250 M165,240 Q170,235 175,240 M165,250 Q170,255 175,250" transform="translate(-5, -5)" />
            <path d="M160,285 Q165,280 170,285 Q165,290 160,285 M165,280 Q170,275 175,280 M165,290 Q170,295 175,290 M155,280 Q160,275 165,280 M155,290 Q160,295 165,290" transform="translate(-5, -5)" />
          </g>
          <g fill="#16A34A">
            <path d="M150,260 Q155,255 160,260 Q155,265 150,260" />
            <path d="M125,280 Q130,275 135,280 Q130,285 125,280" />
            <path d="M185,265 Q190,260 195,265 Q190,270 185,265" />
          </g>

          {/* Deep open collar */}
          <path d="M125,225 L150,260 L175,225" fill="none" stroke="#0C4A6E" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M125,225 L135,245 L115,245 Z" fill="#0EA5E9" stroke="#0C4A6E" strokeWidth="1.5" />
          <path d="M175,225 L165,245 L185,245 Z" fill="#0EA5E9" stroke="#0C4A6E" strokeWidth="1.5" />
          
          {/* Buttons */}
          <circle cx="150" cy="275" r="2.5" fill="#FDE047" stroke="#B45309" strokeWidth="0.5" />
          <circle cx="150" cy="295" r="2.5" fill="#FDE047" stroke="#B45309" strokeWidth="0.5" />
        </motion.g>
      );
    case "outfit-hoodie":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 4px 4px rgba(0,0,0,0.25))">
          <defs>
            <linearGradient id="hoodie-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9CA3AF" />
              <stop offset="100%" stopColor="#4B5563" />
            </linearGradient>
          </defs>
          <path d="M92,230 L88,305 Q150,315 212,305 L208,230 Q180,225 150,222 Q120,225 92,230" fill="url(#hoodie-grad)" stroke="#1F2937" strokeWidth="2" strokeLinejoin="round" />
          
          {/* Thick Hood Collar */}
          <path d="M105,222 Q150,205 195,222" fill="#6B7280" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M115,225 Q150,235 185,225" fill="none" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
          
          {/* Kangaroo pocket */}
          <path d="M118,272 Q150,265 182,272 L180,298 Q150,305 120,298 Z" fill="url(#hoodie-grad)" stroke="#1F2937" strokeWidth="2" strokeLinejoin="round" />
          <path d="M118,272 Q130,285 120,298 M182,272 Q170,285 180,298" fill="none" stroke="#1F2937" strokeWidth="2" />
          
          {/* Drawstrings with aglets */}
          <path d="M135,228 Q132,240 135,255" fill="none" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M165,228 Q168,240 165,255" fill="none" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="135" cy="256" r="2" fill="#F3F4F6" />
          <circle cx="165" cy="256" r="2" fill="#F3F4F6" />
        </motion.g>
      );
    case "outfit-superhero":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 3px 3px rgba(0,0,0,0.3))">
          <defs>
            <linearGradient id="suit-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="belt-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          <path d="M92,230 L88,305 Q150,315 212,305 L208,230 Q180,225 150,222 Q120,225 92,230" fill="url(#suit-grad)" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
          
          {/* Muscle definitions */}
          <path d="M150,230 L150,265 M125,235 Q135,245 150,240 M175,235 Q165,245 150,240 M130,250 Q140,255 150,252 M170,250 Q160,255 150,252" fill="none" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          
          {/* Hero Belt */}
          <path d="M90,272 Q150,282 210,272 L208,280 Q150,290 92,280 Z" fill="url(#belt-grad)" stroke="#78350F" strokeWidth="1.5" />
          <rect x="140" y="268" width="20" height="16" rx="3" fill="url(#belt-grad)" stroke="#78350F" strokeWidth="2" />
          <circle cx="150" cy="276" r="4" fill="#EF4444" />
          
          {/* Chest emblem (Diamond/S-shield style) */}
          <polygon points="150,235 165,245 155,262 145,262 135,245" fill="url(#belt-grad)" stroke="#78350F" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M142,245 Q150,240 158,245 Q145,255 155,255" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
      );
    case "outfit-lorelei":
      return (
        <motion.g {...equipAnim} filter="url(#epic-glow)">
          <defs>
            <linearGradient id="lorelei-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#BE185D" />
            </linearGradient>
            <linearGradient id="glove-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F9A8D4" />
              <stop offset="100%" stopColor="#DB2777" />
            </linearGradient>
          </defs>
          {/* Satin Dress */}
          <path d="M96,230 Q84,285 76,330 L224,330 Q216,285 204,230 Q180,225 150,222 Q120,225 96,230" fill="url(#lorelei-grad)" stroke="#831843" strokeWidth="1.5" strokeLinejoin="round" />
          
          {/* Sweetheart Bodice */}
          <path d="M108,230 Q128,220 150,226 Q172,220 192,230 L188,255 Q150,248 112,255 Z" fill="#DB2777" stroke="#831843" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M125,225 Q150,215 175,225" fill="none" stroke="#FBCFE8" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
          
          {/* Deep satin folds */}
          <path d="M115,260 Q125,305 118,328 M185,260 Q175,305 182,328 M145,255 Q148,295 142,328 M155,255 Q152,295 158,328" fill="none" stroke="#FBCFE8" strokeWidth="2.5" opacity="0.4" strokeLinecap="round" />
          
          {/* High-fidelity Long satin gloves */}
          <path d="M92,230 L84,275 M88,230 L80,275" stroke="url(#glove-grad)" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
          <path d="M208,230 L216,275 M212,230 L220,275" stroke="url(#glove-grad)" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
          
          {/* Premium Diamond Necklace */}
          <motion.g animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <path d="M120,225 Q150,238 180,225" fill="none" stroke="#E2E8F0" strokeWidth="2" />
            <polygon points="150,230 146,236 150,242 154,236" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
            <polygon points="138,228 135,233 138,238 141,233" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
            <polygon points="162,228 159,233 162,238 165,233" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
          </motion.g>
          
          {/* Intense Sparkles */}
          {[
            { cx: 130, cy: 280, d: 0 }, { cx: 170, cy: 295, d: 0.4 }, { cx: 150, cy: 315, d: 0.8 }, { cx: 100, cy: 310, d: 0.2 }, { cx: 200, cy: 300, d: 0.6 }
          ].map((s, i) => (
            <motion.path key={i} d={`M${s.cx},${s.cy-4} L${s.cx+1},${s.cy-1} L${s.cx+4},${s.cy} L${s.cx+1},${s.cy+1} L${s.cx},${s.cy+4} L${s.cx-1},${s.cy+1} L${s.cx-4},${s.cy} L${s.cx-1},${s.cy-1} Z`} fill="#FFFFFF" animate={{ scale: [0.5, 1.2, 0.5], opacity: [0, 1, 0], rotate: [0, 90] }} transition={{ duration: 2, repeat: Infinity, delay: s.d }} />
          ))}
        </motion.g>
      );
    case "outfit-galaxy-cape":
      return (
        <motion.g {...equipAnim} filter="url(#epic-glow)">
          <defs>
            <linearGradient id="galaxy-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="50%" stopColor="#312E81" />
              <stop offset="100%" stopColor="#4C1D95" />
            </linearGradient>
          </defs>
          <path d="M102,225 Q75,285 85,345 L150,325 L215,345 Q225,285 198,225" fill="url(#galaxy-grad)" stroke="#818CF8" strokeWidth="2" opacity="0.95" strokeLinejoin="round" />
          
          {/* Nebula clouds */}
          <path d="M110,260 Q140,240 160,280 Q180,320 160,340" fill="none" stroke="#C084FC" strokeWidth="15" strokeLinecap="round" opacity="0.15" filter="blur(6px)" />
          <path d="M180,250 Q150,270 140,310 Q120,330 130,340" fill="none" stroke="#38BDF8" strokeWidth="20" strokeLinecap="round" opacity="0.15" filter="blur(8px)" />
          
          {/* Shimmering Stars */}
          {[
            { cx: 120, cy: 270, r: 1.5, c: "#FFFFFF" }, { cx: 140, cy: 290, r: 1, c: "#93C5FD" }, 
            { cx: 170, cy: 260, r: 2, c: "#E9D5FF" }, { cx: 185, cy: 295, r: 1.5, c: "#FFFFFF" },
            { cx: 150, cy: 310, r: 1, c: "#FDE047" }, { cx: 110, cy: 310, r: 2, c: "#C084FC" },
            { cx: 160, cy: 330, r: 1.5, c: "#93C5FD" }, { cx: 130, cy: 250, r: 1, c: "#FFFFFF" }
          ].map((s, i) => (
            <motion.circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.c} animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }} />
          ))}
          
          {/* Shooting star */}
          <motion.path d="M180,240 L130,290" stroke="url(#glare)" strokeWidth="2" strokeLinecap="round" opacity="0.8" animate={{ strokeDasharray: ["0, 100", "100, 100"], strokeDashoffset: [0, -100] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
        </motion.g>
      );
    default:
      return null;
  }
}