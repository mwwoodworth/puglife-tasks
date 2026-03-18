"use client";

import { useState, useCallback, useEffect } from "react";
import { DressUpSlot, DressUpState, SavedLook } from "@/lib/types";
import { loadDressUpState, saveDressUpState } from "@/lib/storage";
import { DRESSUP_ITEMS, getItemById } from "@/lib/dressup-catalog";

export function useDressUp() {
  const [state, setState] = useState<DressUpState | null>(null);
  const [previewItem, setPreviewItem] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadDressUpState();
    setState(loaded);
    setIsLoaded(true);
  }, []);

  const save = useCallback((next: DressUpState) => {
    setState(next);
    saveDressUpState(next);
  }, []);

  const equipped = state?.equipped || { hat: null, glasses: null, outfit: null, accessory: null, background: null };
  const unlockedItems = state?.unlockedItems || [];

  const isUnlocked = useCallback((itemId: string) => {
    return unlockedItems.includes(itemId);
  }, [unlockedItems]);

  const equipItem = useCallback((itemId: string) => {
    if (!state) return;
    const item = getItemById(itemId);
    if (!item) return;
    const next = { ...state, equipped: { ...state.equipped, [item.slot]: itemId } };
    save(next);
  }, [state, save]);

  const unequipSlot = useCallback((slot: DressUpSlot) => {
    if (!state) return;
    const next = { ...state, equipped: { ...state.equipped, [slot]: null } };
    save(next);
  }, [state, save]);

  const purchaseItem = useCallback((itemId: string): boolean => {
    if (!state) return false;
    const item = getItemById(itemId);
    if (!item) return false;
    if (state.unlockedItems.includes(itemId)) return false;
    const next = { ...state, unlockedItems: [...state.unlockedItems, itemId] };
    save(next);
    return true;
  }, [state, save]);

  const preview = useCallback((itemId: string | null) => {
    setPreviewItem(itemId);
  }, []);

  // Get the equipped state with preview overlaid
  const getDisplayEquipped = useCallback((): Record<DressUpSlot, string | null> => {
    if (!previewItem) return equipped;
    const item = getItemById(previewItem);
    if (!item) return equipped;
    return { ...equipped, [item.slot]: previewItem };
  }, [equipped, previewItem]);

  const saveLook = useCallback((name: string): boolean => {
    if (!state) return false;
    if (state.savedLooks.length >= 5) return false;
    const look: SavedLook = {
      id: Date.now().toString(36),
      name,
      equipped: { ...state.equipped },
      createdAt: new Date().toISOString(),
    };
    save({ ...state, savedLooks: [...state.savedLooks, look] });
    return true;
  }, [state, save]);

  const loadLook = useCallback((lookId: string) => {
    if (!state) return;
    const look = state.savedLooks.find((l) => l.id === lookId);
    if (!look) return;
    save({ ...state, equipped: { ...look.equipped } });
  }, [state, save]);

  const deleteLook = useCallback((lookId: string) => {
    if (!state) return;
    save({ ...state, savedLooks: state.savedLooks.filter((l) => l.id !== lookId) });
  }, [state, save]);

  const randomOutfit = useCallback(() => {
    if (!state) return;
    const slots: DressUpSlot[] = ["hat", "glasses", "outfit", "accessory", "background"];
    const newEquipped: Record<DressUpSlot, string | null> = { hat: null, glasses: null, outfit: null, accessory: null, background: null };

    for (const slot of slots) {
      const available = DRESSUP_ITEMS.filter(
        (item) => item.slot === slot && state.unlockedItems.includes(item.id)
      );
      if (available.length > 0 && Math.random() > 0.3) {
        const pick = available[Math.floor(Math.random() * available.length)];
        newEquipped[slot] = pick.id;
      }
    }
    save({ ...state, equipped: newEquipped });
  }, [state, save]);

  return {
    state,
    isLoaded,
    equipped,
    unlockedItems,
    isUnlocked,
    equipItem,
    unequipSlot,
    purchaseItem,
    preview,
    previewItem,
    getDisplayEquipped,
    saveLook,
    loadLook,
    deleteLook,
    randomOutfit,
    savedLooks: state?.savedLooks || [],
  };
}
