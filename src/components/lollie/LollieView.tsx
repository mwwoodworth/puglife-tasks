"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { PugMood, DressUpSlot, SoundEffect, LollieSubTab, ChatMessage, StreakData, SavedLook } from "@/lib/types";
import { exportAllData, importAllData, getStorageUsage, ExportData } from "@/lib/storage";
import { getLocalDateString } from "@/lib/date";
import ChatView from "../chat/ChatView";
import WardrobeView from "../dressup/WardrobeView";
import StreakDisplay from "../motivation/StreakDisplay";
import DailyAffirmation from "../motivation/DailyAffirmation";
import EncouragementWall from "../motivation/EncouragementWall";

// Grouped prop interfaces for cleanliness
interface ChatProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  onSend: (content: string) => void;
  onClear: () => void;
}

interface WardrobeProps {
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
}

interface SettingsProps {
  streak: StreakData;
  favorites: string[];
  onToggleFavorite: (message: string) => void;
  muted: boolean;
  onToggleMute: () => void;
}

interface LollieViewProps {
  chat: ChatProps;
  wardrobe: WardrobeProps;
  settings: SettingsProps;
  pugMood: PugMood;
  playSound: (effect: SoundEffect) => void;
}

const SUB_TABS: { id: LollieSubTab; label: string; icon: string }[] = [
  { id: "chat", label: "Chat", icon: "💬" },
  { id: "dressup", label: "Wardrobe", icon: "👗" },
];

export default function LollieView({ chat, wardrobe, settings, pugMood, playSound }: LollieViewProps) {
  const [subTab, setSubTab] = useState<LollieSubTab>("chat");
  const [showSettings, setShowSettings] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(() => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lollie-life-backup-${getLocalDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setImportStatus("Backup downloaded!");
    setTimeout(() => setImportStatus(null), 3000);
  }, []);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as ExportData;
        const result = importAllData(data);
        if (result.success) {
          setImportStatus("Data restored! Refreshing...");
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setImportStatus(result.error || "Import failed");
        }
      } catch {
        setImportStatus("Invalid backup file");
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  return (
    <div className="space-y-3 animate-slide-up">
      {/* Sub-tab toggle + settings gear */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex bg-purple-900/30 rounded-xl p-0.5 border border-purple-500/15">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex-1 relative px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                subTab === tab.id ? "text-white" : "text-purple-500"
              }`}
            >
              {subTab === tab.id && (
                <motion.div
                  layoutId="lollie-subtab"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-lg"
                  transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.icon} {tab.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`w-8 h-8 flex items-center justify-center rounded-xl border text-sm transition-all ${
            showSettings
              ? "bg-purple-600/40 border-purple-400/50"
              : "bg-purple-900/30 border-purple-500/15"
          }`}
        >
          ⚙️
        </button>
      </div>

      {/* Chat Tab */}
      {subTab === "chat" && (
        <ChatView
          messages={chat.messages}
          isStreaming={chat.isStreaming}
          error={chat.error}
          onSend={chat.onSend}
          onClear={chat.onClear}
          playSound={playSound}
        />
      )}

      {/* Wardrobe Tab */}
      {subTab === "dressup" && (
        <WardrobeView
          pugMood={pugMood}
          equipped={wardrobe.equipped}
          displayEquipped={wardrobe.displayEquipped}
          unlockedItems={wardrobe.unlockedItems}
          treats={wardrobe.treats}
          savedLooks={wardrobe.savedLooks}
          onEquip={wardrobe.onEquip}
          onUnequip={wardrobe.onUnequip}
          onPurchase={wardrobe.onPurchase}
          onPreview={wardrobe.onPreview}
          onSaveLook={wardrobe.onSaveLook}
          onLoadLook={wardrobe.onLoadLook}
          onDeleteLook={wardrobe.onDeleteLook}
          onRandomOutfit={wardrobe.onRandomOutfit}
          onSpendTreats={wardrobe.onSpendTreats}
          playSound={playSound}
        />
      )}

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-3 overflow-hidden"
        >
          {/* Sound toggle */}
          <div className="rounded-2xl bg-purple-900/30 border border-purple-500/20 p-4">
            <h3 className="text-sm font-bold text-purple-200 mb-3 flex items-center gap-2">
              <span>🔊</span> Settings
            </h3>
            <button
              onClick={settings.onToggleMute}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl bg-purple-900/30 border border-purple-500/15"
            >
              <span className="text-xs font-bold text-purple-300">Sound Effects</span>
              <motion.span className="text-lg" whileTap={{ scale: 1.2 }}>
                {settings.muted ? "🔇" : "🔊"}
              </motion.span>
            </button>
          </div>

          <StreakDisplay streak={settings.streak} />
          <DailyAffirmation />
          <EncouragementWall favorites={settings.favorites} onToggleFavorite={settings.onToggleFavorite} />

          {/* Data Management */}
          <div className="rounded-2xl bg-purple-900/30 border border-purple-500/20 p-4">
            <h3 className="text-sm font-bold text-purple-200 mb-3 flex items-center gap-2">
              <span>💾</span> Your Data
            </h3>
            {/* Storage usage */}
            {(() => {
              const usage = typeof window !== "undefined" ? getStorageUsage() : { usedBytes: 0, percentFull: 0 };
              return (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[10px] text-purple-400 mb-1">
                    <span>Storage used</span>
                    <span>{usage.percentFull}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-purple-900/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        usage.percentFull > 90 ? "bg-red-400" : usage.percentFull > 70 ? "bg-yellow-400" : "bg-purple-400"
                      }`}
                      style={{ width: `${Math.min(100, usage.percentFull)}%` }}
                    />
                  </div>
                </div>
              );
            })()}
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex-1 px-3 py-2 rounded-xl bg-purple-700/40 border border-purple-500/20 text-xs font-bold text-purple-200 active:scale-95 transition-transform"
              >
                Export Backup
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-3 py-2 rounded-xl bg-purple-700/40 border border-purple-500/20 text-xs font-bold text-purple-200 active:scale-95 transition-transform"
              >
                Import Backup
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
            {importStatus && (
              <p className="text-[10px] text-purple-300 mt-2 text-center">{importStatus}</p>
            )}
          </div>

          {/* About */}
          <div className="rounded-2xl bg-purple-900/20 border border-purple-500/10 p-4">
            <p className="text-xs text-purple-300 leading-relaxed">
              Made with all the love for Danielle — from Lollie (and Matt) with snuggles. 💜
            </p>
            <p className="text-[10px] text-purple-500 mt-2">
              v7.0 &middot; Lollie Life
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
