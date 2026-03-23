import { DressUpItem, DressUpSlot, ItemRarity } from "./types";

// ── Dress-Up Item Catalog ──
// 40+ items across 5 categories + specials

export const DRESSUP_ITEMS: DressUpItem[] = [
  // ── HATS (9) ──
  { id: "hat-crown", name: "Crown", slot: "hat", rarity: "rare", treatsCost: 150, svgLayerId: "crown", previewEmoji: "👑" },
  { id: "hat-party", name: "Party Hat", slot: "hat", rarity: "common", treatsCost: 25, svgLayerId: "party-hat", previewEmoji: "PartyPopper" },
  { id: "hat-beanie", name: "Beanie", slot: "hat", rarity: "common", treatsCost: 20, svgLayerId: "beanie", previewEmoji: "🧶" },
  { id: "hat-cowboy", name: "Cowboy Hat", slot: "hat", rarity: "uncommon", treatsCost: 60, svgLayerId: "cowboy", previewEmoji: "🤠" },
  { id: "hat-chef", name: "Chef Hat", slot: "hat", rarity: "uncommon", treatsCost: 55, svgLayerId: "chef", previewEmoji: "👨‍🍳" },
  { id: "hat-flower-crown", name: "Flower Crown", slot: "hat", rarity: "rare", treatsCost: 120, svgLayerId: "flower-crown", previewEmoji: "🌸" },
  { id: "hat-witch", name: "Witch Hat", slot: "hat", rarity: "uncommon", treatsCost: 70, svgLayerId: "witch", previewEmoji: "🧙‍♀️" },
  { id: "hat-santa", name: "Santa Hat", slot: "hat", rarity: "uncommon", treatsCost: 65, svgLayerId: "santa", previewEmoji: "🎅" },
  { id: "hat-diamond-crown", name: "Diamond Crown", slot: "hat", rarity: "epic", treatsCost: 400, svgLayerId: "diamond-crown", previewEmoji: "Gem", isSpecial: true },

  // ── GLASSES (6) ──
  { id: "glasses-sun", name: "Sunglasses", slot: "glasses", rarity: "common", treatsCost: 30, svgLayerId: "sunglasses", previewEmoji: "🕶️" },
  { id: "glasses-heart", name: "Heart Glasses", slot: "glasses", rarity: "common", treatsCost: 25, svgLayerId: "heart-glasses", previewEmoji: "💕" },
  { id: "glasses-star", name: "Star Glasses", slot: "glasses", rarity: "uncommon", treatsCost: 50, svgLayerId: "star-glasses", previewEmoji: "Star" },
  { id: "glasses-reading", name: "Reading Glasses", slot: "glasses", rarity: "common", treatsCost: 15, svgLayerId: "reading", previewEmoji: "🤓" },
  { id: "glasses-aviator", name: "Aviator Shades", slot: "glasses", rarity: "uncommon", treatsCost: 55, svgLayerId: "aviator", previewEmoji: "😎" },
  { id: "glasses-nerd", name: "Nerd Specs", slot: "glasses", rarity: "common", treatsCost: 20, svgLayerId: "nerd", previewEmoji: "🧐" },

  // ── OUTFITS (9) ──
  { id: "outfit-cape", name: "Superhero Cape", slot: "outfit", rarity: "rare", treatsCost: 100, svgLayerId: "cape", previewEmoji: "🦸" },
  { id: "outfit-tuxedo", name: "Tuxedo", slot: "outfit", rarity: "rare", treatsCost: 120, svgLayerId: "tuxedo", previewEmoji: "🤵" },
  { id: "outfit-princess", name: "Princess Dress", slot: "outfit", rarity: "rare", treatsCost: 140, svgLayerId: "princess", previewEmoji: "👸" },
  { id: "outfit-pajamas", name: "Cozy Pajamas", slot: "outfit", rarity: "common", treatsCost: 35, svgLayerId: "pajamas", previewEmoji: "😴" },
  { id: "outfit-raincoat", name: "Raincoat", slot: "outfit", rarity: "common", treatsCost: 30, svgLayerId: "raincoat", previewEmoji: "🌧️" },
  { id: "outfit-hawaiian", name: "Hawaiian Shirt", slot: "outfit", rarity: "uncommon", treatsCost: 50, svgLayerId: "hawaiian", previewEmoji: "🌺" },
  { id: "outfit-hoodie", name: "Cozy Hoodie", slot: "outfit", rarity: "common", treatsCost: 25, svgLayerId: "hoodie", previewEmoji: "🧥" },
  { id: "outfit-superhero", name: "Super Suit", slot: "outfit", rarity: "uncommon", treatsCost: 80, svgLayerId: "superhero", previewEmoji: "💪" },
  { id: "outfit-lorelei", name: "Lorelei Dress", slot: "outfit", rarity: "epic", treatsCost: 300, svgLayerId: "lorelei", previewEmoji: "Gem", isSpecial: true },
  { id: "outfit-galaxy-cape", name: "Galaxy Cape", slot: "outfit", rarity: "epic", treatsCost: 350, svgLayerId: "galaxy-cape", previewEmoji: "🌌", isSpecial: true },

  // ── ACCESSORIES (9) ──
  { id: "acc-bowtie", name: "Bow Tie", slot: "accessory", rarity: "common", treatsCost: 20, svgLayerId: "bowtie", previewEmoji: "🎀" },
  { id: "acc-necklace", name: "Pearl Necklace", slot: "accessory", rarity: "uncommon", treatsCost: 60, svgLayerId: "necklace", previewEmoji: "📿" },
  { id: "acc-scarf", name: "Cozy Scarf", slot: "accessory", rarity: "common", treatsCost: 25, svgLayerId: "scarf", previewEmoji: "🧣" },
  { id: "acc-wings", name: "Angel Wings", slot: "accessory", rarity: "rare", treatsCost: 180, svgLayerId: "wings", previewEmoji: "👼" },
  { id: "acc-backpack", name: "Mini Backpack", slot: "accessory", rarity: "common", treatsCost: 30, svgLayerId: "backpack", previewEmoji: "🎒" },
  { id: "acc-medal", name: "Gold Medal", slot: "accessory", rarity: "uncommon", treatsCost: 70, svgLayerId: "medal", previewEmoji: "🏅" },
  { id: "acc-headphones", name: "Headphones", slot: "accessory", rarity: "uncommon", treatsCost: 55, svgLayerId: "headphones", previewEmoji: "🎧" },
  { id: "acc-bandana", name: "Bandana", slot: "accessory", rarity: "common", treatsCost: 15, svgLayerId: "bandana", previewEmoji: "🏴‍☠️" },
  { id: "acc-golden-wings", name: "Golden Wings", slot: "accessory", rarity: "epic", treatsCost: 450, svgLayerId: "golden-wings", previewEmoji: "Sparkles", isSpecial: true },

  // ── BACKGROUNDS (7) ──
  { id: "bg-clouds", name: "Fluffy Clouds", slot: "background", rarity: "common", treatsCost: 15, svgLayerId: "clouds", previewEmoji: "☁️" },
  { id: "bg-stars", name: "Starry Night", slot: "background", rarity: "common", treatsCost: 20, svgLayerId: "stars", previewEmoji: "🌟" },
  { id: "bg-hearts", name: "Love Hearts", slot: "background", rarity: "common", treatsCost: 15, svgLayerId: "hearts", previewEmoji: "💕" },
  { id: "bg-beach", name: "Beach Vibes", slot: "background", rarity: "uncommon", treatsCost: 50, svgLayerId: "beach", previewEmoji: "🏖️" },
  { id: "bg-forest", name: "Enchanted Forest", slot: "background", rarity: "uncommon", treatsCost: 60, svgLayerId: "forest", previewEmoji: "🌲" },
  { id: "bg-rainbow", name: "Rainbow Sky", slot: "background", rarity: "rare", treatsCost: 100, svgLayerId: "rainbow", previewEmoji: "🌈" },
  { id: "bg-aurora", name: "Aurora Borealis", slot: "background", rarity: "epic", treatsCost: 300, svgLayerId: "aurora", previewEmoji: "🌌", isSpecial: true },
];

export function getItemById(id: string): DressUpItem | undefined {
  return DRESSUP_ITEMS.find((item) => item.id === id);
}

export function getItemsBySlot(slot: DressUpSlot): DressUpItem[] {
  return DRESSUP_ITEMS.filter((item) => item.slot === slot);
}

export function getItemsByRarity(rarity: ItemRarity): DressUpItem[] {
  return DRESSUP_ITEMS.filter((item) => item.rarity === rarity);
}

export function getSpecialItems(): DressUpItem[] {
  return DRESSUP_ITEMS.filter((item) => item.isSpecial);
}

export const RARITY_COLORS: Record<ItemRarity, { bg: string; border: string; text: string; glow: string }> = {
  common: { bg: "bg-gray-800/50", border: "border-gray-500/30", text: "text-gray-300", glow: "" },
  uncommon: { bg: "bg-green-900/40", border: "border-green-500/30", text: "text-green-300", glow: "shadow-green-500/20" },
  rare: { bg: "bg-blue-900/40", border: "border-blue-500/30", text: "text-blue-300", glow: "shadow-blue-500/20" },
  epic: { bg: "bg-purple-900/40", border: "border-purple-400/50", text: "text-purple-200", glow: "shadow-purple-400/40" },
};

export const SLOT_LABELS: Record<DressUpSlot, { label: string; icon: string }> = {
  hat: { label: "Hats", icon: "Star" },
  glasses: { label: "Glasses", icon: "Star" },
  outfit: { label: "Outfits", icon: "Star" },
  accessory: { label: "Accessories", icon: "Star" },
  background: { label: "Scenes", icon: "Star" },
};
