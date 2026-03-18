"use client";

import { motion } from "framer-motion";
import { AppTab, TAB_CONFIG } from "@/lib/types";

interface TabBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const tabs: AppTab[] = ["tasks", "weight", "motivation"];

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-purple-200/40 safe-area-pb">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2" style={{ paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}>
        {tabs.map((tab) => {
          const config = TAB_CONFIG[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className="relative flex flex-col items-center gap-0.5 px-6 py-2 rounded-2xl transition-all min-w-[72px]"
              aria-label={config.label}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-50 rounded-2xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.span
                className="text-xl relative z-10"
                animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {config.emoji}
              </motion.span>
              <span
                className={`text-[10px] font-bold relative z-10 transition-colors ${
                  isActive ? "text-purple-700" : "text-purple-300"
                }`}
              >
                {config.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="tab-dot"
                  className="absolute -top-1 w-1 h-1 rounded-full bg-purple-500"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
