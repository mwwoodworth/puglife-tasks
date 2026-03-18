import { NextRequest } from 'next/server';

// Use edge runtime for faster streaming proxy
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), { status: 400 });
    }

    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    // Fallback to a generally cute, high-pitched voice if no specific ID is set
    const defaultVoiceId = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obbf5AWCG131pE'; 

    if (!elevenLabsApiKey) {
      return new Response(JSON.stringify({ error: 'ElevenLabs API key missing from .env.local' }), { status: 503 });
    }

    const targetVoiceId = voiceId || defaultVoiceId;

    // We use the turbo model for bleeding-edge low latency
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5', 
        voice_settings: {
          stability: 0.4,       // Lower stability makes the voice more dynamic and emotive (cute)
          similarity_boost: 0.8,
          style: 0.2,           // Slight style exaggeration
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API Error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to generate audio via ElevenLabs' }), { status: response.status });
    }

    // Stream the MP3 audio directly back to the client
    return new Response(response.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error: unknown) {
    console.error('TTS Route Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
