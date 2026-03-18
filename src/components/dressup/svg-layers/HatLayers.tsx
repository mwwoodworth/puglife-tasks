"use client";

import { motion } from "framer-motion";

const equipAnim = { initial: { scale: 0, y: -20 }, animate: { scale: 1, y: 0 }, transition: { type: "spring" as const, stiffness: 400, damping: 15 } };

export function HatLayer({ id }: { id: string }) {
  switch (id) {
    case "hat-crown":
      return (
        <motion.g {...equipAnim}>
          {/* Gold crown */}
          <path d="M110,100 L120,70 L135,90 L150,60 L165,90 L180,70 L190,100 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
          <rect x="110" y="100" width="80" height="12" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
          {/* Gems */}
          <circle cx="135" cy="105" r="3" fill="#ef4444" />
          <circle cx="150" cy="105" r="3" fill="#3b82f6" />
          <circle cx="165" cy="105" r="3" fill="#10b981" />
        </motion.g>
      );
    case "hat-party":
      return (
        <motion.g {...equipAnim}>
          <path d="M150,50 L120,112 L180,112 Z" fill="#e879f9" stroke="#c026d3" strokeWidth="1" />
          <path d="M150,50 L120,112 L180,112 Z" fill="url(#party-stripes)" opacity="0.3" />
          <circle cx="150" cy="48" r="6" fill="#fbbf24" />
          {/* Stripe pattern */}
          <line x1="135" y1="80" x2="142" y2="112" stroke="#fbbf24" strokeWidth="2" opacity="0.4" />
          <line x1="158" y1="80" x2="165" y2="112" stroke="#60a5fa" strokeWidth="2" opacity="0.4" />
        </motion.g>
      );
    case "hat-beanie":
      return (
        <motion.g {...equipAnim}>
          <ellipse cx="150" cy="108" rx="55" ry="25" fill="#9333ea" />
          <path d="M95,108 Q95,75 150,70 Q205,75 205,108" fill="#a855f7" stroke="#7c3aed" strokeWidth="1" />
          <circle cx="150" cy="65" r="8" fill="#c084fc" />
          {/* Knit lines */}
          <path d="M105,90 Q150,85 195,90" fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.4" />
          <path d="M100,100 Q150,95 200,100" fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.4" />
        </motion.g>
      );
    case "hat-cowboy":
      return (
        <motion.g {...equipAnim}>
          {/* Brim */}
          <ellipse cx="150" cy="115" rx="75" ry="12" fill="#92700a" stroke="#6b5308" strokeWidth="1" />
          {/* Crown */}
          <path d="M112,115 Q110,80 130,75 Q150,72 170,75 Q190,80 188,115" fill="#b8860b" stroke="#8b6914" strokeWidth="1" />
          <path d="M112,115 Q150,110 188,115" fill="#a07808" />
          {/* Band */}
          <rect x="118" y="100" width="64" height="6" rx="2" fill="#6b5308" />
        </motion.g>
      );
    case "hat-chef":
      return (
        <motion.g {...equipAnim}>
          <ellipse cx="150" cy="110" rx="50" ry="8" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
          <path d="M108,110 Q100,50 150,45 Q200,50 192,110" fill="white" stroke="#d1d5db" strokeWidth="1" />
          {/* Puff details */}
          <circle cx="130" cy="60" r="18" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
          <circle cx="155" cy="55" r="20" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
          <circle cx="175" cy="62" r="16" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
        </motion.g>
      );
    case "hat-flower-crown":
      return (
        <motion.g {...equipAnim}>
          {/* Vine base */}
          <path d="M95,112 Q120,100 150,105 Q180,100 205,112" fill="none" stroke="#22c55e" strokeWidth="3" />
          {/* Flowers */}
          <circle cx="105" cy="105" r="8" fill="#f472b6" /><circle cx="105" cy="105" r="3" fill="#fbbf24" />
          <circle cx="125" cy="100" r="7" fill="#c084fc" /><circle cx="125" cy="100" r="2.5" fill="#fbbf24" />
          <circle cx="150" cy="98" r="9" fill="#f472b6" /><circle cx="150" cy="98" r="3.5" fill="#fbbf24" />
          <circle cx="175" cy="100" r="7" fill="#818cf8" /><circle cx="175" cy="100" r="2.5" fill="#fbbf24" />
          <circle cx="195" cy="105" r="8" fill="#f472b6" /><circle cx="195" cy="105" r="3" fill="#fbbf24" />
          {/* Leaves */}
          <ellipse cx="115" cy="108" rx="5" ry="3" fill="#22c55e" transform="rotate(-20 115 108)" />
          <ellipse cx="140" cy="104" rx="5" ry="3" fill="#22c55e" transform="rotate(15 140 104)" />
          <ellipse cx="165" cy="104" rx="5" ry="3" fill="#22c55e" transform="rotate(-10 165 104)" />
          <ellipse cx="185" cy="108" rx="5" ry="3" fill="#22c55e" transform="rotate(20 185 108)" />
        </motion.g>
      );
    case "hat-witch":
      return (
        <motion.g {...equipAnim}>
          <ellipse cx="150" cy="115" rx="60" ry="10" fill="#1e1b4b" stroke="#312e81" strokeWidth="1" />
          <path d="M150,30 L115,115 L185,115 Z" fill="#312e81" stroke="#4338ca" strokeWidth="1" />
          {/* Belt */}
          <rect x="120" y="102" width="60" height="8" rx="2" fill="#7c3aed" />
          <rect x="145" y="100" width="10" height="12" rx="2" fill="#fbbf24" />
          {/* Buckle */}
          <rect x="147" y="102" width="6" height="8" rx="1" fill="none" stroke="#fbbf24" strokeWidth="1" />
        </motion.g>
      );
    case "hat-santa":
      return (
        <motion.g {...equipAnim}>
          {/* Hat band */}
          <rect x="100" y="105" width="100" height="14" rx="7" fill="white" />
          {/* Hat body */}
          <path d="M105,112 Q100,70 150,40 Q200,70 195,112" fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
          {/* Pom pom */}
          <circle cx="170" cy="45" r="10" fill="white" />
          {/* Droop */}
          <path d="M150,40 Q180,35 170,45" fill="#ef4444" />
        </motion.g>
      );
    case "hat-diamond-crown":
      return (
        <motion.g {...equipAnim} filter="url(#epic-glow)">
          {/* Platinum crown */}
          <path d="M108,102 L118,65 L133,85 L150,52 L167,85 L182,65 L192,102 Z" fill="#e0e7ff" stroke="#818cf8" strokeWidth="1.5" />
          <rect x="108" y="102" width="84" height="14" rx="3" fill="#c7d2fe" stroke="#818cf8" strokeWidth="1" />
          {/* Diamonds */}
          <motion.path d="M135,108 L138,102 L141,108 L138,114 Z" fill="#60a5fa" stroke="#3b82f6" strokeWidth="0.5"
            animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <motion.path d="M150,108 L154,100 L158,108 L154,116 Z" fill="#a78bfa" stroke="#7c3aed" strokeWidth="0.5"
            animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
          <motion.path d="M163,108 L166,102 L169,108 L166,114 Z" fill="#60a5fa" stroke="#3b82f6" strokeWidth="0.5"
            animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} />
          {/* Center star */}
          <motion.text x="150" y="80" fontSize="14" textAnchor="middle"
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity }}
          >💎</motion.text>
        </motion.g>
      );
    default:
      return null;
  }
}
