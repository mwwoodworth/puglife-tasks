import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure this route can handle file uploads efficiently
export const runtime = 'nodejs';
export const maxDuration = 30;

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY || '';

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'Gemini API key missing' }, { status: 503 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('audio') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Convert the Blob to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    const genAI = new GoogleGenerativeAI(API_KEY);
    // Use gemini-2.5-flash for audio transcription as it handles multi-modal extremely well
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    console.log(`Sending audio to Gemini for STT (size: ${file.size} bytes)`);

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'audio/webm',
          data: base64Audio
        }
      },
      "Please transcribe this audio exactly as it is spoken. Do not add any extra commentary or formatting. If it's empty, return nothing."
    ]);

    const text = result.response.text().trim();

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error('Gemini Transcription Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Transcription failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
