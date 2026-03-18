"use client";

import { motion } from "framer-motion";
import { DressUpItem } from "@/lib/types";
import { RARITY_COLORS } from "@/lib/dressup-catalog";

interface ItemCardProps {
  item: DressUpItem;
  isOwned: boolean;
  isEquipped: boolean;
  isPreview: boolean;
  onTap: () => void;
}

export default function ItemCard({ item, isOwned, isEquipped, isPreview, onTap }: ItemCardProps) {
  const rarity = RARITY_COLORS[item.rarity];

  return (
    <motion.button
      onClick={onTap}
      className={`relative flex flex-col items-center gap-0.5 p-2 rounded-xl border transition-all ${rarity.bg} ${rarity.border} ${
        isEquipped ? "ring-2 ring-purple-400 ring-offset-1 ring-offset-purple-950" : ""
      } ${isPreview ? "ring-2 ring-fuchsia-400 ring-offset-1 ring-offset-purple-950" : ""} ${
        rarity.glow ? `shadow-lg ${rarity.glow}` : ""
      }`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Rarity glow for epic */}
      {item.rarity === "epic" && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Emoji preview */}
      <span className="text-2xl relative z-10">{item.previewEmoji}</span>

      {/* Name */}
      <span className={`text-[9px] font-bold relative z-10 leading-tight text-center ${rarity.text}`}>
        {item.name}
      </span>

      {/* Status badges */}
      {isEquipped && (
        <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full">
          ON
        </span>
      )}
      {!isOwned && (
        <span className="text-[8px] text-amber-400 font-bold relative z-10">
          {item.treatsCost} 🍖
        </span>
      )}
      {isOwned && !isEquipped && (
        <span className="text-[8px] text-green-400 font-bold relative z-10">Owned</span>
      )}
    </motion.button>
  );
}
