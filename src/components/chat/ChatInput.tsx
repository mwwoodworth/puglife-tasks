"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text, disabled, onSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleInput = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 80) + "px";
    }
  }, []);

  return (
    <div className="flex items-end gap-2 p-2 rounded-2xl bg-purple-900/30 border border-purple-500/20">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder="Talk to Lollie..."
        className="flex-1 bg-transparent text-xs text-purple-100 placeholder-purple-500 outline-none resize-none min-h-[28px] max-h-[80px]"
        rows={1}
        disabled={disabled}
      />
      <motion.button
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all ${
          text.trim() && !disabled
            ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white"
            : "bg-purple-900/30 text-purple-600"
        }`}
        whileTap={{ scale: 0.9 }}
      >
        🐾
      </motion.button>
    </div>
  );
}
