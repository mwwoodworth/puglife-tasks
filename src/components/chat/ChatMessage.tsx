"use client";

import { motion } from "framer-motion";
import { ChatMessage as ChatMessageType } from "@/lib/types";

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export default function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-fuchsia-600 to-purple-600 text-white rounded-br-md"
            : "bg-purple-900/40 border border-purple-500/20 text-purple-100 rounded-bl-md"
        }`}
      >
        {!isUser && (
          <span className="text-[10px] font-bold text-purple-400 block mb-0.5">Lollie 🐶</span>
        )}
        <p className="whitespace-pre-wrap">{message.content}</p>
        {isStreaming && !message.content && (
          <motion.span
            className="inline-block text-purple-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            thinking...
          </motion.span>
        )}
        {isStreaming && message.content && (
          <motion.span
            className="inline-block w-1 h-3 bg-purple-400 ml-0.5 rounded"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
}
