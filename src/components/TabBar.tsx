"use client";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

import { motion } from "framer-motion";
import { AppTab } from "@/lib/types";

interface TabBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  treatsCount?: number;
}

const tabs: { id: AppTab; label: string; icon: string }[] = [
  { id: "dashboard", label: "Home", icon: "House" },
  { id: "tasks", label: "Tasks", icon: "CircleCheck" },
  { id: "track", label: "Track", icon: "ChartBar" },
  { id: "rewards", label: "Rewards", icon: "Star" },
  { id: "lollie", label: "Lollie", icon: "Dog" },
];

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-purple-950/90 backdrop-blur-xl border-t border-purple-500/20 safe-area-pb">
      <div className="max-w-lg mx-auto flex items-center justify-around py-1.5" style={{ paddingBottom: "max(6px, env(safe-area-inset-bottom))" }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-0 px-3 py-1.5 rounded-2xl transition-all min-w-[54px]"
              aria-label={tab.label}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 bg-gradient-to-br from-purple-700/50 to-fuchsia-700/30 rounded-2xl border border-purple-400/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.span
                className="text-lg relative z-10"
                animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <DynamicIcon name={tab.icon} className="w-5 h-5" />
              </motion.span>
              <span
                className={`text-[9px] font-bold relative z-10 transition-colors ${
                  isActive ? "text-purple-200" : "text-purple-500"
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="tab-dot"
                  className="absolute -top-0.5 w-1 h-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
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
