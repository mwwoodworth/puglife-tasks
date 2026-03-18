"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChatMessage } from "@/lib/types";
import { loadChatHistory, saveChatHistory } from "@/lib/storage";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMessages(loadChatHistory());
  }, []);

  const sendMessage = useCallback(async (content: string, systemPrompt: string) => {
    if (!content.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(36) + "u",
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    saveChatHistory(updatedMessages);
    setIsStreaming(true);
    setError(null);

    const assistantId = Date.now().toString(36) + "a";
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMsg]);

    try {
      abortRef.current = new AbortController();

      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, systemPrompt }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              fullText += parsed.text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: fullText } : m
                )
              );
            }
          } catch {
            // skip parse errors
          }
        }
      }

      // Save final
      setMessages((prev) => {
        const final = prev.map((m) =>
          m.id === assistantId ? { ...m, content: fullText } : m
        );
        saveChatHistory(final);
        return final;
      });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError("Lollie got distracted by a squirrel! Try again?");
      // Remove empty assistant message on error
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== assistantId);
        saveChatHistory(filtered);
        return filtered;
      });
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [messages, isStreaming]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    saveChatHistory([]);
  }, []);

  return { messages, isStreaming, error, sendMessage, clearHistory };
}
