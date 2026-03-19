import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Ensure this route can handle file uploads efficiently
export const runtime = 'nodejs';
export const maxDuration = 30;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

function fallbackResponse(reason: string) {
  return NextResponse.json({ text: "", fallback: true, reason });
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackResponse('provider_unavailable');
  }

  try {
    const formData = await req.formData();
    const file = formData.get('audio') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    if (file.size === 0) {
      return fallbackResponse('empty_audio');
    }

    // Convert Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Whisper requires a file-like object with a name and extension.
    // The easiest way in Node is to write to a temp file and create a ReadStream.
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `upload-${Date.now()}.webm`);
    await fs.writeFile(tempFilePath, buffer);

    console.log(`Sending audio to OpenAI Whisper for STT (size: ${file.size} bytes)`);

    const transcription = await openai.audio.transcriptions.create({
      file: require('fs').createReadStream(tempFilePath),
      model: 'whisper-1',
    });

    // Cleanup temp file
    await fs.unlink(tempFilePath).catch(console.error);

    const text = transcription.text.trim();
    return NextResponse.json({ text });

  } catch (error: unknown) {
    console.error('OpenAI Whisper Transcription Error:', error);
    return fallbackResponse('provider_error');
  }
}
