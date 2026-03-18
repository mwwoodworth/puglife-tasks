"use client";

import { motion } from "framer-motion";

const equipAnim = { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: "spring" as const, stiffness: 300, damping: 20 } };

interface OutfitLayerProps {
  id: string;
  position: "front" | "behind";
}

export function OutfitLayer({ id, position }: OutfitLayerProps) {
  // Items that go behind the body
  const behindItems = ["cape", "galaxy-cape"];
  const isBehind = behindItems.includes(id);

  if (position === "behind" && !isBehind) return null;
  if (position === "front" && isBehind) return null;

  switch (id) {
    case "outfit-cape":
      return (
        <motion.g {...equipAnim}>
          <path d="M110,220 Q90,280 100,330 L150,310 L200,330 Q210,280 190,220" fill="#dc2626" opacity="0.85" stroke="#b91c1c" strokeWidth="1" />
          <path d="M115,225 Q100,275 108,320" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.3" />
          <path d="M185,225 Q200,275 192,320" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.3" />
        </motion.g>
      );
    case "outfit-tuxedo":
      return (
        <motion.g {...equipAnim}>
          {/* Jacket */}
          <path d="M95,225 L95,295 Q150,310 205,295 L205,225 Q180,220 150,218 Q120,220 95,225" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          {/* Lapels */}
          <path d="M130,225 L150,260 L140,225" fill="#334155" />
          <path d="M170,225 L150,260 L160,225" fill="#334155" />
          {/* Shirt */}
          <path d="M140,225 L150,265 L160,225" fill="white" opacity="0.9" />
          {/* Bow tie */}
          <path d="M140,225 L150,230 L160,225 L150,228 Z" fill="#dc2626" />
          <circle cx="150" cy="227" r="3" fill="#ef4444" />
          {/* Buttons */}
          <circle cx="150" cy="250" r="2" fill="#64748b" />
          <circle cx="150" cy="265" r="2" fill="#64748b" />
        </motion.g>
      );
    case "outfit-princess":
      return (
        <motion.g {...equipAnim}>
          {/* Dress */}
          <path d="M95,225 Q85,290 75,320 L225,320 Q215,290 205,225 Q180,218 150,216 Q120,218 95,225" fill="#e879f9" stroke="#d946ef" strokeWidth="1" />
          {/* Bodice */}
          <path d="M110,225 Q150,215 190,225 L185,255 Q150,250 115,255 Z" fill="#d946ef" />
          {/* Sparkles */}
          <circle cx="130" cy="270" r="2" fill="#fbbf24" opacity="0.6" />
          <circle cx="160" cy="285" r="1.5" fill="#fbbf24" opacity="0.5" />
          <circle cx="145" cy="300" r="2" fill="#fbbf24" opacity="0.4" />
          <circle cx="175" cy="275" r="1.5" fill="#fbbf24" opacity="0.5" />
          {/* Sash */}
          <path d="M115,255 Q150,248 185,255" fill="none" stroke="#fbbf24" strokeWidth="2" />
        </motion.g>
      );
    case "outfit-pajamas":
      return (
        <motion.g {...equipAnim}>
          <path d="M95,225 L90,305 Q150,315 210,305 L205,225 Q180,218 150,216 Q120,218 95,225" fill="#818cf8" opacity="0.85" stroke="#6366f1" strokeWidth="1" />
          {/* Stars pattern */}
          <text x="115" y="255" fontSize="10" opacity="0.4">⭐</text>
          <text x="145" y="275" fontSize="8" opacity="0.3">🌙</text>
          <text x="170" y="250" fontSize="10" opacity="0.4">⭐</text>
          <text x="130" y="295" fontSize="8" opacity="0.3">🌙</text>
          {/* Buttons */}
          <circle cx="150" cy="240" r="3" fill="#c7d2fe" />
          <circle cx="150" cy="258" r="3" fill="#c7d2fe" />
          <circle cx="150" cy="276" r="3" fill="#c7d2fe" />
        </motion.g>
      );
    case "outfit-raincoat":
      return (
        <motion.g {...equipAnim}>
          <path d="M92,225 L88,305 Q150,315 212,305 L208,225 Q180,218 150,216 Q120,218 92,225" fill="#fbbf24" opacity="0.9" stroke="#d97706" strokeWidth="1" />
          {/* Hood at neck */}
          <path d="M110,220 Q150,210 190,220" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
          {/* Buttons */}
          <circle cx="150" cy="245" r="3.5" fill="#d97706" />
          <circle cx="150" cy="265" r="3.5" fill="#d97706" />
          <circle cx="150" cy="285" r="3.5" fill="#d97706" />
          {/* Pockets */}
          <rect x="108" y="270" width="22" height="16" rx="3" fill="none" stroke="#d97706" strokeWidth="1" />
          <rect x="170" y="270" width="22" height="16" rx="3" fill="none" stroke="#d97706" strokeWidth="1" />
        </motion.g>
      );
    case "outfit-hawaiian":
      return (
        <motion.g {...equipAnim}>
          <path d="M95,225 L92,300 Q150,312 208,300 L205,225 Q180,218 150,216 Q120,218 95,225" fill="#0ea5e9" opacity="0.85" stroke="#0284c7" strokeWidth="1" />
          {/* Floral pattern */}
          <text x="110" y="250" fontSize="12" opacity="0.6">🌺</text>
          <text x="155" y="260" fontSize="10" opacity="0.5">🌴</text>
          <text x="175" y="245" fontSize="12" opacity="0.6">🌺</text>
          <text x="125" y="280" fontSize="10" opacity="0.5">🌴</text>
          <text x="165" y="285" fontSize="12" opacity="0.5">🌺</text>
          {/* Collar */}
          <path d="M130,225 L150,245 L170,225" fill="none" stroke="#0284c7" strokeWidth="1.5" />
        </motion.g>
      );
    case "outfit-hoodie":
      return (
        <motion.g {...equipAnim}>
          <path d="M93,225 L90,302 Q150,314 210,302 L207,225 Q180,218 150,216 Q120,218 93,225" fill="#6b7280" opacity="0.9" stroke="#4b5563" strokeWidth="1" />
          {/* Hood */}
          <path d="M108,218 Q150,205 192,218" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
          {/* Kangaroo pocket */}
          <path d="M120,270 Q150,265 180,270 L178,295 Q150,300 122,295 Z" fill="none" stroke="#4b5563" strokeWidth="1.5" />
          {/* Drawstrings */}
          <line x1="140" y1="225" x2="138" y2="245" stroke="#9ca3af" strokeWidth="1" />
          <line x1="160" y1="225" x2="162" y2="245" stroke="#9ca3af" strokeWidth="1" />
        </motion.g>
      );
    case "outfit-superhero":
      return (
        <motion.g {...equipAnim}>
          <path d="M95,225 L92,300 Q150,312 208,300 L205,225 Q180,218 150,216 Q120,218 95,225" fill="#2563eb" opacity="0.9" stroke="#1d4ed8" strokeWidth="1" />
          {/* Belt */}
          <rect x="95" y="268" width="110" height="8" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
          <rect x="143" y="265" width="14" height="14" rx="3" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
          {/* Chest emblem */}
          <polygon points="150,232 155,245 168,245 158,253 162,266 150,258 138,266 142,253 132,245 145,245" fill="#fbbf24" />
          {/* Lines */}
          <path d="M130,225 L150,230 L170,225" fill="none" stroke="#60a5fa" strokeWidth="1" />
        </motion.g>
      );
    case "outfit-galaxy-cape":
      return (
        <motion.g {...equipAnim} filter="url(#epic-glow)">
          {/* Galaxy cape with gradient effect */}
          <path d="M108,220 Q85,280 95,335 L150,315 L205,335 Q215,280 192,220" fill="#1e1b4b" opacity="0.9" stroke="#4338ca" strokeWidth="1" />
          {/* Stars */}
          <motion.circle cx="120" cy="260" r="1.5" fill="white" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
          <motion.circle cx="140" cy="280" r="1" fill="white" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
          <motion.circle cx="165" cy="250" r="2" fill="#c084fc" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
          <motion.circle cx="185" cy="275" r="1.5" fill="#818cf8" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.8 }} />
          <motion.circle cx="150" cy="300" r="1" fill="white" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity, delay: 1 }} />
          <motion.circle cx="110" cy="290" r="1.5" fill="#e879f9" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.4 }} />
          {/* Nebula swirls */}
          <path d="M115,260 Q140,250 160,270 Q180,290 175,310" fill="none" stroke="#7c3aed" strokeWidth="2" opacity="0.3" />
          <path d="M130,270 Q155,260 170,280" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.2" />
        </motion.g>
      );
    default:
      return null;
  }
}
