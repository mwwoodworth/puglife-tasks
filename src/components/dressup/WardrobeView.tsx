"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PugMood, DressUpSlot, DressUpItem, SoundEffect, SavedLook } from "@/lib/types";
import { DRESSUP_ITEMS, getItemById, RARITY_COLORS, SLOT_LABELS } from "@/lib/dressup-catalog";
import SvgPug from "./SvgPug";
import CategoryTabs, { FilterCategory } from "./CategoryTabs";
import SavedLooks from "./SavedLooks";

interface WardrobeViewProps {
  pugMood: PugMood;
  equipped: Record<DressUpSlot, string | null>;
  displayEquipped: Record<DressUpSlot, string | null>;
  unlockedItems: string[];
  treats: number;
  savedLooks: SavedLook[];
  onEquip: (itemId: string) => void;
  onUnequip: (slot: DressUpSlot) => void;
  onPurchase: (itemId: string) => boolean;
  onPreview: (itemId: string | null) => void;
  onSaveLook: (name: string) => boolean;
  onLoadLook: (id: string) => void;
  onDeleteLook: (id: string) => void;
  onRandomOutfit: () => void;
  onSpendTreats: (amount: number) => void;
  playSound: (effect: SoundEffect) => void;
}

export default function WardrobeView({
  pugMood, equipped, displayEquipped, unlockedItems, treats, savedLooks,
  onEquip, onUnequip, onPurchase, onPreview, onSaveLook, onLoadLook, onDeleteLook, onRandomOutfit, onSpendTreats, playSound,
}: WardrobeViewProps) {
  const [category, setCategory] = useState<FilterCategory>("all");
  const [purchaseItem, setPurchaseItem] = useState<DressUpItem | null>(null);

  const filteredItems = DRESSUP_ITEMS.filter((item) => {
    if (category === "all") return true;
    if (category === "special") return item.isSpecial;
    return item.slot === category;
  });

  // Simplified single-tap UX:
  // - Owned + not equipped → equip immediately
  // - Equipped → unequip
  // - Not owned → show inline purchase confirmation
  const handleItemTap = useCallback((item: DressUpItem) => {
    const isOwned = unlockedItems.includes(item.id);
    const isEquipped = equipped[item.slot] === item.id;

    if (isEquipped) {
      onUnequip(item.slot);
      playSound("item-equip");
      return;
    }

    if (isOwned) {
      onEquip(item.id);
      playSound("item-equip");
      return;
    }

    // Not owned — show purchase inline
    setPurchaseItem(item);
    onPreview(item.id);
    playSound("item-preview");
  }, [unlockedItems, equipped, onEquip, onUnequip, onPreview, playSound]);

  const handleConfirmPurchase = useCallback(() => {
    if (!purchaseItem || treats < purchaseItem.treatsCost) return;
    onSpendTreats(purchaseItem.treatsCost);
    onPurchase(purchaseItem.id);
    onEquip(purchaseItem.id);
    playSound("shop-purchase");
    setPurchaseItem(null);
    onPreview(null);
  }, [purchaseItem, treats, onSpendTreats, onPurchase, onEquip, playSound, onPreview]);

  const handleCancelPurchase = useCallback(() => {
    setPurchaseItem(null);
    onPreview(null);
  }, [onPreview]);

  return (
    <div className="space-y-3">
      {/* Pug Preview — large, interactive */}
      <div className="flex justify-center pt-1 pb-2">
        <SvgPug
          mood={pugMood}
          equipped={displayEquipped}
          size={180}
          interactive
          showParticles
        />
      </div>

      {/* Treats + Quick Actions */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">
          {treats} 🍖
        </span>
        <motion.button
          onClick={() => { onRandomOutfit(); playSound("sparkle"); }}
          className="text-[10px] font-bold text-fuchsia-300 bg-fuchsia-500/15 px-3 py-1.5 rounded-xl border border-fuchsia-500/20"
          whileTap={{ scale: 0.95 }}
        >
          🎲 Surprise Me!
        </motion.button>
        <motion.button
          onClick={() => {
            const name = `Look ${savedLooks.length + 1}`;
            onSaveLook(name);
            playSound("sparkle");
          }}
          className="text-[10px] font-bold text-purple-300 bg-purple-500/15 px-3 py-1.5 rounded-xl border border-purple-500/20"
          whileTap={{ scale: 0.95 }}
        >
          💾 Save Look
        </motion.button>
      </div>

      {/* Inline Purchase Banner */}
      <AnimatePresence>
        {purchaseItem && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-purple-900/60 to-fuchsia-900/60 rounded-xl border border-purple-500/30 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{purchaseItem.previewEmoji}</span>
                <div>
                  <p className="text-xs font-bold text-white">{purchaseItem.name}</p>
                  <p className="text-[10px] text-amber-400">{purchaseItem.treatsCost} 🍖</p>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={handleCancelPurchase}
                  className="text-[10px] font-bold text-purple-400 px-3 py-1.5 rounded-lg bg-purple-900/50"
                  whileTap={{ scale: 0.95 }}
                >
                  Nah
                </motion.button>
                <motion.button
                  onClick={handleConfirmPurchase}
                  disabled={treats < purchaseItem.treatsCost}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-lg ${
                    treats >= purchaseItem.treatsCost
                      ? "text-white bg-gradient-to-r from-purple-500 to-fuchsia-500"
                      : "text-purple-500 bg-purple-900/30"
                  }`}
                  whileTap={treats >= purchaseItem.treatsCost ? { scale: 0.95 } : undefined}
                >
                  Buy! 🐾
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Tabs */}
      <CategoryTabs active={category} onChange={setCategory} />

      {/* Item Grid — 3 columns for mobile */}
      <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-1 scrollbar-hide">
        {filteredItems.map((item) => {
          const isOwned = unlockedItems.includes(item.id);
          const isEquipped = equipped[item.slot] === item.id;
          const rarity = RARITY_COLORS[item.rarity];

          return (
            <motion.button
              key={item.id}
              onClick={() => handleItemTap(item)}
              whileTap={{ scale: 0.93 }}
              className={`relative flex flex-col items-center gap-0.5 p-2 rounded-xl border transition-all ${
                isEquipped
                  ? "bg-purple-600/30 border-purple-400/60 shadow-lg shadow-purple-500/20"
                  : isOwned
                  ? `${rarity.bg} ${rarity.border}`
                  : "bg-gray-900/40 border-gray-700/30 opacity-70"
              }`}
            >
              {/* Rarity glow for epic items */}
              {item.rarity === "epic" && isOwned && (
                <div className="absolute inset-0 rounded-xl animate-rarity-glow" />
              )}
              <span className="text-xl">{item.previewEmoji}</span>
              <span className={`text-[9px] font-bold ${isOwned ? rarity.text : "text-gray-500"} text-center leading-tight`}>
                {item.name}
              </span>
              {isEquipped && (
                <span className="text-[8px] font-black text-purple-300">WORN</span>
              )}
              {!isOwned && (
                <span className="text-[8px] font-bold text-amber-500">{item.treatsCost} 🍖</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Saved Looks */}
      {savedLooks.length > 0 && (
        <SavedLooks
          looks={savedLooks}
          onLoad={(id) => { onLoadLook(id); playSound("item-equip"); }}
          onDelete={onDeleteLook}
          onSave={() => {
            const name = `Look ${savedLooks.length + 1}`;
            onSaveLook(name);
            playSound("sparkle");
          }}
          canSave={savedLooks.length < 5}
        />
      )}
    </div>
  );
}
