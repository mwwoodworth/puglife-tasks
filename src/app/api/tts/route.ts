import { NextRequest } from 'next/server';

// Use edge runtime for faster streaming proxy
export const runtime = 'edge';

const FALLBACK_VOICE_IDS = [
  'FGY2WhTYpPnrIDTdsKH5', // Laura
  'EXAVITQu4vr4xnSDxMaL', // Sarah
];

function fallbackResponse(reason: string) {
  return new Response(JSON.stringify({ fallback: true, reason }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), { status: 400 });
    }

    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    const configuredVoiceId = process.env.ELEVENLABS_VOICE_ID || '';

    if (!elevenLabsApiKey) {
      return fallbackResponse('provider_unavailable');
    }

    const candidateVoiceIds = Array.from(
      new Set([voiceId, configuredVoiceId, ...FALLBACK_VOICE_IDS].filter(Boolean))
    );

    for (const targetVoiceId of candidateVoiceIds) {
      // We use the turbo model for bleeding-edge low latency.
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
            stability: 0.4,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true,
          },
        }),
      });

      if (response.ok) {
        // Stream the MP3 audio directly back to the client.
        return new Response(response.body, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'no-cache',
          },
        });
      }

      const errorText = await response.text();
      console.error('ElevenLabs API Error:', targetVoiceId, errorText);

      if (response.status === 404 && errorText.includes('voice_not_found')) {
        continue;
      }

      if (response.status === 401 || response.status === 403) {
        return fallbackResponse('provider_auth');
      }

      if (response.status === 429) {
        return fallbackResponse('provider_rate_limited');
      }

      return fallbackResponse('provider_error');
    }

    return fallbackResponse('voice_unavailable');
  } catch (error: unknown) {
    console.error('TTS Route Error:', error);
    return fallbackResponse('route_error');
  }
}
