import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY || "";

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "api_key_missing", message: "Lollie needs her API key configured!" }), { status: 503 });
  }

  try {
    const { messages, systemPrompt, quickResponse } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages required" }), { status: 400 });
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

    const lastMessage = messages[messages.length - 1];
    const chat = model.startChat({ history });

    // Quick response mode — returns single JSON response (no stream)
    if (quickResponse) {
      const result = await chat.sendMessage(lastMessage.content);
      const text = result.response.text();
      return new Response(JSON.stringify({ text }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Stream the response
    const result = await chat.sendMessageStream(lastMessage.content);

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
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("429") || message.includes("quota") || message.includes("rate")) {
      return new Response(JSON.stringify({ error: "rate_limited", message: "Lollie needs a moment to catch her breath!" }), { status: 429 });
    }
    return new Response(JSON.stringify({ error: "server_error", message: "Lollie tripped over her paws!" }), { status: 500 });
  }
}
