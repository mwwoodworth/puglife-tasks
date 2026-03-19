"use client";

import { motion } from "framer-motion";

const equipAnim = { initial: { scale: 0, y: -20 }, animate: { scale: 1, y: 0 }, transition: { type: "spring" as const, stiffness: 400, damping: 15 } };

export function HatLayer({ id }: { id: string }) {
  switch (id) {
    case "hat-crown":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 4px 4px rgba(0,0,0,0.3))">
          <g transform="translate(150 155) scale(0.833) translate(-150 -155)">
            <defs>
            <linearGradient id="gold-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="gem-red" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FCA5A5" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <linearGradient id="gem-blue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="gem-green" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          {/* Back edge of crown for depth */}
          <path d="M120,95 L135,80 L150,90 L165,80 L180,95 Z" fill="#92400E" />
          {/* Front gold crown */}
          <path d="M110,100 L118,65 L135,85 L150,55 L165,85 L182,65 L190,100 Z" fill="url(#gold-grad)" stroke="#78350F" strokeWidth="1.5" strokeLinejoin="round" />
          <rect x="110" y="100" width="80" height="12" rx="3" fill="url(#gold-grad)" stroke="#78350F" strokeWidth="1.5" filter="url(#inner-shadow)" />
          {/* Crown highlights */}
          <path d="M115,102 L185,102" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <circle cx="150" cy="55" r="3" fill="#FEF08A" />
          
          {/* Gems */}
          <circle cx="135" cy="106" r="3.5" fill="url(#gem-red)" stroke="#7F1D1D" strokeWidth="0.5" />
          <circle cx="134" cy="105" r="1" fill="white" opacity="0.8" />
          
          <circle cx="150" cy="106" r="4" fill="url(#gem-blue)" stroke="#1E3A8A" strokeWidth="0.5" />
          <circle cx="149" cy="104.5" r="1.5" fill="white" opacity="0.8" />
          
          <circle cx="165" cy="106" r="3.5" fill="url(#gem-green)" stroke="#064E3B" strokeWidth="0.5" />
          <circle cx="164" cy="105" r="1" fill="white" opacity="0.8" />
          </g>
        </motion.g>
      );
    case "hat-party":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 3px 3px rgba(0,0,0,0.25))">
          <g transform="translate(150 155) scale(0.833) translate(-150 -155)">
            <defs>
            <linearGradient id="party-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#C026D3" />
            </linearGradient>
          </defs>
          <path d="M150,45 L115,112 L185,112 Z" fill="url(#party-grad)" stroke="#86198F" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Curved base for 3D feel */}
          <path d="M115,112 Q150,118 185,112 L150,45 Z" fill="url(#party-grad)" />
          {/* Stripe patterns */}
          <path d="M142,65 L128,100 M158,65 L172,100" stroke="#FDE047" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
          <path d="M150,60 L150,105" stroke="#60A5FA" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
          {/* Highlight */}
          <path d="M145,55 L125,105" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
          {/* Fluffy Pom pom */}
          <circle cx="150" cy="45" r="9" fill="#FDE047" />
          <circle cx="147" cy="43" r="3" fill="white" opacity="0.6" />
          </g>
        </motion.g>
      );
    case "hat-beanie":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 4px 5px rgba(0,0,0,0.3))">
          <g transform="translate(150 155) scale(0.833) translate(-150 -155)">
            <defs>
            <linearGradient id="beanie-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#6B21A8" />
            </linearGradient>
            <radialGradient id="pom-grad" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="100%" stopColor="#9333EA" />
            </radialGradient>
          </defs>
          {/* Folded rim */}
          <ellipse cx="150" cy="110" rx="58" ry="18" fill="#7E22CE" />
          {/* Main dome */}
          <path d="M92,110 Q92,60 150,55 Q208,60 208,110 Z" fill="url(#beanie-grad)" />
          {/* Rim front */}
          <path d="M92,110 Q150,128 208,110 Q150,118 92,110 Z" fill="#9333EA" />
          {/* Knit texture lines */}
          <path d="M105,80 Q150,70 195,80 M100,95 Q150,85 200,95 M100,105 Q150,100 200,105" fill="none" stroke="#581C87" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <path d="M115,65 Q150,55 185,65" fill="none" stroke="#581C87" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          {/* Pom pom */}
          <circle cx="150" cy="50" r="12" fill="url(#pom-grad)" />
          </g>
        </motion.g>
      );
    case "hat-cowboy":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 6px 6px rgba(0,0,0,0.35))">
          <g transform="translate(150 155) scale(0.833) translate(-150 -155)">
            <defs>
            <radialGradient id="brim-grad" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="#A16207" />
              <stop offset="100%" stopColor="#713F12" />
            </radialGradient>
            <linearGradient id="crown-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#854D0E" />
            </linearGradient>
          </defs>
          {/* Brim Back */}
          <ellipse cx="150" cy="112" rx="80" ry="18" fill="#713F12" />
          {/* Crown */}
          <path d="M105,115 Q102,65 130,60 Q150,55 170,60 Q198,65 195,115 Z" fill="url(#crown-grad)" stroke="#451A03" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Crown dent */}
          <path d="M135,62 Q150,75 165,62" fill="none" stroke="#713F12" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
          {/* Brim Front */}
          <path d="M70,112 Q150,135 230,112 Q150,122 70,112 Z" fill="url(#brim-grad)" stroke="#451A03" strokeWidth="1.5" filter="url(#inner-shadow)" />
          {/* Band */}
          <path d="M106,105 Q150,115 194,105 L195,112 Q150,122 105,112 Z" fill="#451A03" />
          <rect x="145" y="107" width="10" height="6" rx="1" fill="#FBBF24" />
          </g>
        </motion.g>
      );
    case "hat-chef":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 4px 4px rgba(0,0,0,0.15))">
          <g transform="translate(150 155) scale(0.833) translate(-150 -155)">
            <defs>
            <radialGradient id="puff-grad" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="80%" stopColor="#F3F4F6" />
              <stop offset="100%" stopColor="#D1D5DB" />
            </radialGradient>
            <linearGradient id="band-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E5E7EB" />
            </linearGradient>
          </defs>
          {/* Base Band */}
          <ellipse cx="150" cy="112" rx="52" ry="12" fill="#D1D5DB" />
          <path d="M98,112 Q150,125 202,112 L200,95 Q150,105 100,95 Z" fill="url(#band-grad)" stroke="#9CA3AF" strokeWidth="1" filter="url(#inner-shadow)" />
          
          {/* Puffs */}
          <circle cx="120" cy="65" r="22" fill="url(#puff-grad)" />
          <circle cx="180" cy="65" r="22" fill="url(#puff-grad)" />
          <circle cx="150" cy="45" r="30" fill="url(#puff-grad)" />
          <circle cx="135" cy="50" r="25" fill="url(#puff-grad)" />
          <circle cx="165" cy="50" r="25" fill="url(#puff-grad)" />
          
          {/* Creases */}
          <path d="M125,75 Q135,65 145,80 M175,75 Q165,65 155,80 M150,45 Q150,60 150,70" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
          </g>
        </motion.g>
      );
    case "hat-flower-crown":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 3px 2px rgba(0,0,0,0.2))">
          <g transform="translate(150 155) scale(0.833) translate(-150 -155)">
            {/* Thick woven vine */}
          <path d="M90,112 Q120,95 150,102 Q180,95 210,112" fill="none" stroke="#15803D" strokeWidth="5" strokeLinecap="round" />
          <path d="M92,110 Q120,102 150,98 Q180,102 208,110" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
          
          {/* Large lush leaves */}
          {[
            { cx: 110, cy: 106, rot: -25 }, { cx: 135, cy: 100, rot: 15 }, 
            { cx: 165, cy: 100, rot: -15 }, { cx: 190, cy: 106, rot: 25 }
          ].map((l, i) => (
            <ellipse key={i} cx={l.cx} cy={l.cy} rx="8" ry="4" fill="#16A34A" stroke="#14532D" strokeWidth="0.5" transform={`rotate(${l.rot} ${l.cx} ${l.cy})`} />
          ))}

          {/* Premium Flowers with gradients */}
          <defs>
            <radialGradient id="fl-pink" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#FBCFE8"/><stop offset="100%" stopColor="#DB2777"/></radialGradient>
            <radialGradient id="fl-purple" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#E9D5FF"/><stop offset="100%" stopColor="#9333EA"/></radialGradient>
            <radialGradient id="fl-blue" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#BFDBFE"/><stop offset="100%" stopColor="#2563EB"/></radialGradient>
          </defs>

          {/* Left Pink */}
          <circle cx="102" cy="106" r="10" fill="url(#fl-pink)" stroke="#9D174D" strokeWidth="0.5" />
          <circle cx="102" cy="106" r="4" fill="#FBBF24" />
          
          {/* Mid Purple */}
          <circle cx="128" cy="98" r="9" fill="url(#fl-purple)" stroke="#581C87" strokeWidth="0.5" />
          <circle cx="128" cy="98" r="3.5" fill="#FBBF24" />
          
          {/* Center Pink (Large) */}
          <circle cx="150" cy="95" r="12" fill="url(#fl-pink)" stroke="#9D174D" strokeWidth="0.5" />
          <circle cx="150" cy="95" r="4.5" fill="#FBBF24" />
          
          {/* Mid Blue */}
          <circle cx="172" cy="98" r="9" fill="url(#fl-blue)" stroke="#1E3A8A" strokeWidth="0.5" />
          <circle cx="172" cy="98" r="3.5" fill="#FBBF24" />
          
          {/* Right Pink */}
          <circle cx="198" cy="106" r="10" fill="url(#fl-pink)" stroke="#9D174D" strokeWidth="0.5" />
          <circle cx="198" cy="106" r="4" fill="#FBBF24" />
          </g>
        </motion.g>
      );
    case "hat-witch":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 5px 6px rgba(0,0,0,0.4))">
          <g transform="translate(150 155) scale(0.833) translate(-150 -155)">
            <defs>
            <linearGradient id="witch-cone" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#312E81" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
            <radialGradient id="witch-brim" cx="50%" cy="50%" r="50%">
              <stop offset="50%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#0F172A" />
            </radialGradient>
          </defs>
          {/* Brim */}
          <ellipse cx="150" cy="115" rx="70" ry="14" fill="url(#witch-brim)" stroke="#0F172A" strokeWidth="2" filter="url(#inner-shadow)" />
          {/* Cone - crumpled and magical */}
          <path d="M105,115 Q120,60 170,20 Q150,70 195,115 Z" fill="url(#witch-cone)" stroke="#0F172A" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M125,75 Q150,85 165,70" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          
          {/* Magical Band */}
          <path d="M106,110 Q150,122 194,110 L190,100 Q150,112 110,100 Z" fill="#9333EA" />
          <path d="M108,105 Q150,117 192,105" fill="none" stroke="#D8B4FE" strokeWidth="1" opacity="0.5" />
          {/* Gold Buckle */}
          <rect x="142" y="102" width="16" height="14" rx="2" fill="none" stroke="#FBBF24" strokeWidth="3" />
          <rect x="146" y="106" width="8" height="6" fill="#1E1B4B" />
          </g>
        </motion.g>
      );
    case "hat-santa":
      return (
        <motion.g {...equipAnim} filter="drop-shadow(0px 4px 5px rgba(0,0,0,0.3))">
          <g transform="translate(150 155) scale(0.833) translate(-150 -155)">
            <defs>
            <linearGradient id="santa-red" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="60%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <radialGradient id="santa-fluff" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E5E7EB" />
            </radialGradient>
          </defs>
          {/* Hat Body */}
          <path d="M95,112 Q90,50 150,30 Q210,60 205,112 Z" fill="url(#santa-red)" />
          {/* Hat Fold/Droop */}
          <path d="M150,30 Q180,10 190,50 Q170,45 150,30" fill="#B91C1C" />
          
          {/* Fluffy Band */}
          <rect x="90" y="104" width="120" height="18" rx="9" fill="url(#santa-fluff)" stroke="#D1D5DB" strokeWidth="1" filter="url(#inner-shadow)" />
          <path d="M95,110 Q150,105 205,110 M95,115 Q150,120 205,115" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          
          {/* Pom Pom */}
          <circle cx="190" cy="50" r="14" fill="url(#santa-fluff)" />
          <circle cx="186" cy="46" r="4" fill="white" opacity="0.8" />
          </g>
        </motion.g>
      );
    case "hat-diamond-crown":
      return (
        <motion.g {...equipAnim} filter="url(#epic-glow)">
          <g transform="translate(150 155) scale(0.833) translate(-150 -155)">
            <defs>
            <linearGradient id="plat-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#C7D2FE" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
            <radialGradient id="diamond-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          {/* Back Edge */}
          <path d="M115,95 L133,75 L150,85 L167,75 L185,95 Z" fill="#6366F1" />
          {/* Front Platinum Crown */}
          <path d="M105,102 L115,55 L133,80 L150,42 L167,80 L185,55 L195,102 Z" fill="url(#plat-grad)" stroke="#4F46E5" strokeWidth="2" strokeLinejoin="round" />
          <rect x="105" y="102" width="90" height="16" rx="4" fill="url(#plat-grad)" stroke="#4F46E5" strokeWidth="2" filter="url(#inner-shadow)" />
          
          {/* Engraving lines */}
          <path d="M110,106 L190,106 M110,114 L190,114" stroke="#818CF8" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

          {/* Floating Diamond Aura */}
          <circle cx="150" cy="42" r="15" fill="url(#diamond-glow)" opacity="0.6" />
          <circle cx="115" cy="55" r="10" fill="url(#diamond-glow)" opacity="0.4" />
          <circle cx="185" cy="55" r="10" fill="url(#diamond-glow)" opacity="0.4" />

          {/* Sparkly Diamonds */}
          {[
            { cx: 135, cy: 110, scale: 0.8, d: 0 },
            { cx: 150, cy: 110, scale: 1.2, d: 0.3 },
            { cx: 165, cy: 110, scale: 0.8, d: 0.6 }
          ].map((dia, i) => (
            <motion.g key={i} transform={`translate(${dia.cx}, ${dia.cy}) scale(${dia.scale})`} 
              animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 1.5, repeat: Infinity, delay: dia.d }}>
              <path d="M0,-8 L6,0 L0,8 L-6,0 Z" fill="#E0E7FF" stroke="#6366F1" strokeWidth="1" filter="url(#inner-shadow)" />
              <path d="M0,-4 L3,0 L0,4 L-3,0 Z" fill="#FFFFFF" />
            </motion.g>
          ))}

          {/* Floating Magic Star */}
          <motion.g transform="translate(150, 25)" animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 180] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
             <path d="M0,-10 L2,-2 L10,0 L2,2 L0,10 L-2,2 L-10,0 L-2,-2 Z" fill="#FFFFFF" filter="url(#soft-drop-shadow)" />
          </motion.g>
          </g>
        </motion.g>
      );
    default:
      return null;
  }
}