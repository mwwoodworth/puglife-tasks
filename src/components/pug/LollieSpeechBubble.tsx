"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LollieSpeechBubbleProps {
  message: string;
  isTyping: boolean;
}

export default function LollieSpeechBubble({ message, isTyping }: LollieSpeechBubbleProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isTyping ? "typing" : message}
        initial={{ opacity: 0, y: 5, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -5, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative bg-purple-900/50 backdrop-blur-sm rounded-2xl px-4 py-2.5 border border-purple-500/20 max-w-[300px] mx-auto"
      >
        {/* Speech bubble tail */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-900/50 border-l border-t border-purple-500/20 rotate-45" />

        {isTyping ? (
          <div className="flex items-center gap-1.5 justify-center py-0.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-purple-400"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-purple-200 font-medium text-center leading-relaxed">
            {message}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
