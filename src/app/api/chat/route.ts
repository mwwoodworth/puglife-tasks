import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
import { buildLollieFallbackReply } from "@/lib/lollie-fallback";

export const runtime = "nodejs";
export const maxDuration = 30;

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY || "";

function jsonReply(text: string, fallback = false) {
  return new Response(JSON.stringify({ text, fallback }), {
    headers: { "Content-Type": "application/json" },
  });
}

function streamReply(text: string, fallback = false) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text, fallback })}\n\n`));
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt, quickResponse } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages required" }), { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const fallbackText = buildLollieFallbackReply(lastMessage?.content || "");

    if (!API_KEY) {
      return quickResponse ? jsonReply(fallbackText, true) : streamReply(fallbackText, true);
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt || "You are Lollie, a sweet and supportive pug assistant.",
    });

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });

    // Quick response mode — returns single JSON response (no stream)
    if (quickResponse) {
      try {
        const result = await chat.sendMessage(lastMessage.content);
        const text = result.response.text();
        return jsonReply(text);
      } catch (quickErr) {
        console.error("Chat quick response fallback:", quickErr);
        return jsonReply(fallbackText, true);
      }
    }

    let result;
    try {
      result = await chat.sendMessageStream(lastMessage.content);
    } catch (streamErr) {
      console.error("Chat stream fallback:", streamErr);
      return streamReply(fallbackText, true);
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (streamErr) {
          console.error("Chat stream error:", streamErr);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    let fallbackText = "I hit a cloud hiccup, but I’m still here. Let’s keep the next step tiny and kind.";
    try {
      const clone = req.clone();
      const body = await clone.json();
      const lastMessage = Array.isArray(body?.messages) ? body.messages[body.messages.length - 1] : null;
      fallbackText = buildLollieFallbackReply(lastMessage?.content || "");
    } catch {
      // Ignore body re-read issues and keep generic fallback text.
    }
    return jsonReply(fallbackText, true);
  }
}
