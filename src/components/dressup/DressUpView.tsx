"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { PugMood, DressUpSlot, DressUpItem, SoundEffect } from "@/lib/types";
import { DRESSUP_ITEMS, getItemById } from "@/lib/dressup-catalog";
import SvgPug from "./SvgPug";
import CategoryTabs, { FilterCategory } from "./CategoryTabs";
import ItemCard from "./ItemCard";
import PurchaseModal from "./PurchaseModal";
import SavedLooks from "./SavedLooks";

interface DressUpViewProps {
  pugMood: PugMood;
  equipped: Record<DressUpSlot, string | null>;
  unlockedItems: string[];
  previewItem: string | null;
  displayEquipped: Record<DressUpSlot, string | null>;
  treats: number;
  savedLooks: Array<{ id: string; name: string; equipped: Record<DressUpSlot, string | null>; createdAt: string }>;
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

export default function DressUpView({
  pugMood,
  equipped,
  unlockedItems,
  previewItem,
  displayEquipped,
  treats,
  savedLooks,
  onEquip,
  onUnequip,
  onPurchase,
  onPreview,
  onSaveLook,
  onLoadLook,
  onDeleteLook,
  onRandomOutfit,
  onSpendTreats,
  playSound,
}: DressUpViewProps) {
  const [category, setCategory] = useState<FilterCategory>("all");
  const [purchaseTarget, setPurchaseTarget] = useState<DressUpItem | null>(null);

  const filteredItems = DRESSUP_ITEMS.filter((item) => {
    if (category === "all") return true;
    if (category === "special") return item.isSpecial;
    return item.slot === category;
  });

  const handleItemTap = useCallback((item: DressUpItem) => {
    const isOwned = unlockedItems.includes(item.id);
    const isEquipped = equipped[item.slot] === item.id;

    if (isEquipped) {
      // Unequip
      onUnequip(item.slot);
      onPreview(null);
      playSound("item-equip");
      return;
    }

    if (isOwned) {
      // Equip owned item
      onEquip(item.id);
      onPreview(null);
      playSound("item-equip");
      return;
    }

    // Preview, then offer purchase
    if (previewItem === item.id) {
      // Second tap — open purchase
      setPurchaseTarget(item);
      onPreview(null);
    } else {
      onPreview(item.id);
      playSound("item-preview");
    }
  }, [unlockedItems, equipped, previewItem, onEquip, onUnequip, onPreview, playSound]);

  const handlePurchase = useCallback(() => {
    if (!purchaseTarget) return;
    if (treats < purchaseTarget.treatsCost) return;
    onSpendTreats(purchaseTarget.treatsCost);
    onPurchase(purchaseTarget.id);
    onEquip(purchaseTarget.id);
    playSound("shop-purchase");
    setPurchaseTarget(null);
  }, [purchaseTarget, treats, onSpendTreats, onPurchase, onEquip, playSound]);

  const handleSaveLook = useCallback(() => {
    const name = `Look ${savedLooks.length + 1}`;
    onSaveLook(name);
    playSound("sparkle");
  }, [savedLooks.length, onSaveLook, playSound]);

  return (
    <div className="space-y-3 animate-slide-up">
      {/* SVG Pug Display */}
      <div className="flex justify-center py-2">
        <SvgPug
          mood={pugMood}
          equipped={displayEquipped}
          size={160}
          interactive={false}
          showParticles
        />
      </div>

      {/* Treats balance */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs font-bold text-amber-400">{treats} 🍖</span>
        <motion.button
          onClick={() => { onRandomOutfit(); playSound("sparkle"); }}
          className="text-[10px] font-bold text-fuchsia-300 bg-fuchsia-500/15 px-3 py-1.5 rounded-xl border border-fuchsia-500/20"
          whileTap={{ scale: 0.95 }}
        >
          🎲 Surprise Me!
        </motion.button>
      </div>

      {/* Category Tabs */}
      <CategoryTabs active={category} onChange={setCategory} />

      {/* Item Grid */}
      <div className="grid grid-cols-4 gap-2 max-h-[240px] overflow-y-auto pr-1 scrollbar-hide">
        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            isOwned={unlockedItems.includes(item.id)}
            isEquipped={equipped[item.slot] === item.id}
            isPreview={previewItem === item.id}
            onTap={() => handleItemTap(item)}
          />
        ))}
      </div>

      {/* Saved Looks */}
      <SavedLooks
        looks={savedLooks}
        onLoad={(id) => { onLoadLook(id); playSound("item-equip"); }}
        onDelete={onDeleteLook}
        onSave={handleSaveLook}
        canSave={savedLooks.length < 5}
      />

      {/* Purchase Modal */}
      <PurchaseModal
        item={purchaseTarget}
        treats={treats}
        onConfirm={handlePurchase}
        onCancel={() => setPurchaseTarget(null)}
      />
    </div>
  );
}
