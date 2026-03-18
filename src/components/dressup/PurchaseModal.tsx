"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DressUpItem } from "@/lib/types";
import { RARITY_COLORS } from "@/lib/dressup-catalog";

interface PurchaseModalProps {
  item: DressUpItem | null;
  treats: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PurchaseModal({ item, treats, onConfirm, onCancel }: PurchaseModalProps) {
  if (!item) return null;

  const canAfford = treats >= item.treatsCost;
  const rarity = RARITY_COLORS[item.rarity];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal */}
        <motion.div
          className={`relative w-full max-w-xs rounded-2xl border p-5 ${rarity.bg} ${rarity.border} bg-purple-950/95 backdrop-blur-xl`}
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
        >
          <div className="text-center space-y-3">
            {/* Item preview */}
            <motion.span
              className="text-5xl block"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {item.previewEmoji}
            </motion.span>

            <h3 className="text-lg font-black text-white">{item.name}</h3>
            <p className={`text-xs font-bold uppercase tracking-wide ${rarity.text}`}>{item.rarity}</p>

            {/* Cost */}
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="text-2xl font-black text-amber-400">{item.treatsCost}</span>
              <span className="text-xl">🍖</span>
            </div>

            {/* Balance */}
            <p className="text-xs text-purple-300">
              Your treats: <span className={canAfford ? "text-green-400" : "text-red-400"}>{treats}</span>
            </p>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 rounded-xl bg-purple-900/50 border border-purple-500/20 text-xs font-bold text-purple-300"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={!canAfford}
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  canAfford
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/30"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
              >
                {canAfford ? "Buy!" : "Not enough"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
