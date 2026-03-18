"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PugMood, DressUpSlot, SoundEffect, LollieSubTab, ChatMessage, StreakData, SavedLook } from "@/lib/types";
import ChatView from "../chat/ChatView";
import DressUpView from "../dressup/DressUpView";
import StreakDisplay from "../motivation/StreakDisplay";
import DailyAffirmation from "../motivation/DailyAffirmation";
import EncouragementWall from "../motivation/EncouragementWall";

interface LollieViewProps {
  // Chat
  chatMessages: ChatMessage[];
  isChatStreaming: boolean;
  chatError: string | null;
  onChatSend: (content: string) => void;
  onChatClear: () => void;
  // Dress Up
  pugMood: PugMood;
  equipped: Record<DressUpSlot, string | null>;
  unlockedItems: string[];
  previewItem: string | null;
  displayEquipped: Record<DressUpSlot, string | null>;
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
  // Settings / More
  streak: StreakData;
  favorites: string[];
  onToggleFavorite: (message: string) => void;
  muted: boolean;
  onToggleMute: () => void;
  // General
  playSound: (effect: SoundEffect) => void;
}

export default function LollieView(props: LollieViewProps) {
  const [subTab, setSubTab] = useState<LollieSubTab>("chat");
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="space-y-3 animate-slide-up">
      {/* Sub-tab toggle */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex bg-purple-900/30 rounded-xl p-0.5 border border-purple-500/15">
          {(["chat", "dressup"] as LollieSubTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`flex-1 relative px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                subTab === tab ? "text-white" : "text-purple-500"
              }`}
            >
              {subTab === tab && (
                <motion.div
                  layoutId="lollie-subtab"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {tab === "chat" ? "💬 Chat" : "👗 Dress Up"}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-purple-900/30 border border-purple-500/15 text-sm"
        >
          ⚙️
        </button>
      </div>

      {/* Content */}
      {subTab === "chat" && (
        <ChatView
          messages={props.chatMessages}
          isStreaming={props.isChatStreaming}
          error={props.chatError}
          onSend={props.onChatSend}
          onClear={props.onChatClear}
          playSound={props.playSound}
        />
      )}

      {subTab === "dressup" && (
        <DressUpView
          pugMood={props.pugMood}
          equipped={props.equipped}
          unlockedItems={props.unlockedItems}
          previewItem={props.previewItem}
          displayEquipped={props.displayEquipped}
          treats={props.treats}
          savedLooks={props.savedLooks}
          onEquip={props.onEquip}
          onUnequip={props.onUnequip}
          onPurchase={props.onPurchase}
          onPreview={props.onPreview}
          onSaveLook={props.onSaveLook}
          onLoadLook={props.onLoadLook}
          onDeleteLook={props.onDeleteLook}
          onRandomOutfit={props.onRandomOutfit}
          onSpendTreats={props.onSpendTreats}
          playSound={props.playSound}
        />
      )}

      {/* Settings drawer */}
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
              onClick={props.onToggleMute}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl bg-purple-900/30 border border-purple-500/15"
            >
              <span className="text-xs font-bold text-purple-300">Sound Effects</span>
              <motion.span className="text-lg" whileTap={{ scale: 1.2 }}>
                {props.muted ? "🔇" : "🔊"}
              </motion.span>
            </button>
          </div>

          <StreakDisplay streak={props.streak} />
          <DailyAffirmation />
          <EncouragementWall favorites={props.favorites} onToggleFavorite={props.onToggleFavorite} />
        </motion.div>
      )}
    </div>
  );
}
