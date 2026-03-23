"use client";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

import { motion } from "framer-motion";
import { DressUpSlot } from "@/lib/types";
import { SLOT_LABELS } from "@/lib/dressup-catalog";

type FilterCategory = "all" | DressUpSlot | "special";

interface CategoryTabsProps {
  active: FilterCategory;
  onChange: (cat: FilterCategory) => void;
}

const categories: { id: FilterCategory; label: string; icon: string }[] = [
  { id: "all", label: "All", icon: "Sparkles" },
  ...Object.entries(SLOT_LABELS).map(([id, val]) => ({
    id: id as FilterCategory,
    label: val.label,
    icon: val.icon,
  })),
  { id: "special", label: "Special", icon: "Gem" },
];

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`relative flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${
              isActive
                ? "text-white"
                : "text-purple-400 bg-purple-900/20 border border-purple-500/10"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="cat-bg"
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <DynamicIcon name={cat.icon} className="relative z-10" />
            <span className="relative z-10">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export type { FilterCategory };
