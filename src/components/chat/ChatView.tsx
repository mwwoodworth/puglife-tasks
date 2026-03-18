"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChatMessage as ChatMessageType, SoundEffect } from "@/lib/types";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

interface ChatViewProps {
  messages: ChatMessageType[];
  isStreaming: boolean;
  error: string | null;
  onSend: (content: string) => void;
  onClear: () => void;
  playSound: (effect: SoundEffect) => void;
}

export default function ChatView({ messages, isStreaming, error, onSend, onClear, playSound }: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (content: string) => {
    playSound("chat-send");
    onSend(content);
  };

  return (
    <div className="space-y-2 animate-slide-up">
      {/* Chat Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-purple-200 flex items-center gap-1.5">
          <span>💬</span> Chat with Lollie
        </h3>
        {messages.length > 0 && (
          <button
            onClick={onClear}
            className="text-[10px] text-purple-500 font-bold bg-purple-900/20 px-2 py-1 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide rounded-xl"
      >
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 space-y-2"
          >
            <span className="text-4xl block">🐶</span>
            <p className="text-xs text-purple-400 font-bold">Hey Danielle!</p>
            <p className="text-[10px] text-purple-500">
              Ask me anything — meal ideas, motivation, planning, or just chat!
            </p>
          </motion.div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isStreaming={isStreaming && i === messages.length - 1 && msg.role === "assistant"}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <p className="text-[10px] text-red-400 text-center">{error}</p>
      )}

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}
