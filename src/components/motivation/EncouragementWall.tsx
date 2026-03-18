"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { getEncouragementWall } from "@/lib/daily-content";

interface EncouragementWallProps {
  favorites: string[];
  onToggleFavorite: (message: string) => void;
}

const BACK_MESSAGES: Record<string, string> = {
  "Strong is beautiful": "Your strength isn't measured by what you lift — it's measured by how you get back up. Lollie sees your strength every single day.",
  "Progress not perfection": "Every tiny step forward is progress. The messy middle is where magic happens. Keep going, gorgeous.",
  "You are enough": "Right here, right now, exactly as you are — you are enough. Lollie knows it. Now believe it.",
  "One day at a time": "Don't look at the whole mountain. Just take the next step. Then the next. You're already climbing.",
  "Be your own kind of beautiful": "Beautiful isn't a size or a look. It's the way you love, the way you try, the way you shine.",
  "Believe in your sparkle": "You have a light inside you that nothing can dim. Let it sparkle, Danielle.",
  "You've got this": "Whatever today throws at you, you can handle it. And Lollie will be right here cheering.",
  "Self love is the best love": "Treating yourself with kindness isn't selfish — it's survival. You deserve your own love first.",
  "Keep going queen": "Queens don't quit. They rest, regroup, and come back stronger. Crown's still on.",
  "Trust your journey": "Your path is unique. Comparison will steal your joy. Trust where you're going.",
  "Breathe and believe": "Take a deep breath. You've survived every hard day so far. That's a perfect record.",
  "Dream big, start small": "The biggest dreams start with the tiniest steps. Today's small win matters.",
  "Today is your day": "No matter what yesterday was, today is fresh. Brand new. Full of possibility.",
  "Radiate positivity": "Your energy is contagious. When you smile, the whole room lights up.",
  "You are magic": "There's something about you that can't be replicated. That's your magic. Own it.",
  "Stay pawsitive": "When things get ruff, stay pawsitive! Lollie's wagging her tail for you.",
  "Glow from within": "The best glow doesn't come from a filter — it comes from being authentically you.",
  "Create your own sunshine": "On cloudy days, be your own sunshine. You've done it before.",
  "Unstoppable": "Nothing can stop a woman who knows her worth. And you, Danielle, are priceless.",
  "Born to sparkle": "Some people are born to sparkle. You're one of them. Never dim your light.",
};

export default function EncouragementWall({ favorites, onToggleFavorite }: EncouragementWallProps) {
  const messages = getEncouragementWall();
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleFlip = useCallback((index: number) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const handleLongPressStart = useCallback((message: string) => {
    const timer = setTimeout(() => {
      onToggleFavorite(message);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
    setLongPressTimer(timer);
  }, [onToggleFavorite]);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  const handleShare = useCallback((message: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${message} — Lollie 🐾💜`);
    }
  }, []);

  // Sort: favorites first
  const sortedMessages = [...messages].sort((a, b) => {
    const aFav = favorites.includes(a.message) ? 0 : 1;
    const bFav = favorites.includes(b.message) ? 0 : 1;
    return aFav - bFav;
  });

  return (
    <div className="rounded-2xl bg-purple-900/30 border border-purple-500/20 p-4">
      <h3 className="text-sm font-bold text-purple-200 mb-1 flex items-center gap-2">
        <span>💜</span> Lollie&apos;s Encouragement Wall
      </h3>
      <p className="text-[10px] text-purple-400 mb-3">Tap to flip &middot; Hold to favorite &middot; Tap back to share</p>

      <div className="grid grid-cols-2 gap-2">
        {sortedMessages.map((item, i) => {
          const isFlipped = flipped.has(i);
          const isFav = favorites.includes(item.message);
          const backMsg = BACK_MESSAGES[item.message] || "You are incredible. Lollie knows it. Never forget.";

          return (
            <motion.div
              key={item.message}
              className="relative"
              style={{ perspective: "600px" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <motion.div
                className="relative w-full cursor-pointer select-none"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => handleFlip(i)}
                onPointerDown={() => handleLongPressStart(item.message)}
                onPointerUp={handleLongPressEnd}
                onPointerLeave={handleLongPressEnd}
              >
                {/* Front */}
                <div
                  className={`bg-gradient-to-br from-purple-800/40 to-fuchsia-800/30 rounded-xl p-3 text-center border ${
                    isFav ? "border-fuchsia-400/40" : "border-purple-500/15"
                  }`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {isFav && <span className="absolute top-1 right-1 text-[10px]">⭐</span>}
                  <span className="text-xl block mb-1">{item.emoji}</span>
                  <p className="text-[11px] font-bold text-purple-200">{item.message}</p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/50 to-purple-900/50 rounded-xl p-3 text-center border border-fuchsia-500/20 flex flex-col items-center justify-center"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <p className="text-[10px] text-purple-200 font-medium leading-relaxed mb-2 line-clamp-4">{backMsg}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(item.message);
                    }}
                    className="text-[9px] text-fuchsia-400 font-bold"
                  >
                    📋 Copy
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
