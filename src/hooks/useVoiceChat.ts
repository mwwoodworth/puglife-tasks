import { useState, useRef, useCallback } from 'react';

export function useVoiceChat() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lollieVolumeLevel, setLollieVolumeLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const currentAudioSource = useRef<AudioBufferSourceNode | null>(null);
  const browserUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const fallbackSpeechInterval = useRef<number | null>(null);

  const stopFallbackSpeech = useCallback(() => {
    if (fallbackSpeechInterval.current) {
      window.clearInterval(fallbackSpeechInterval.current);
      fallbackSpeechInterval.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    browserUtterance.current = null;
    setIsSpeaking(false);
    setLollieVolumeLevel(0);
  }, []);

  const speakWithBrowserVoice = useCallback(async (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      throw new Error("Browser speech synthesis unavailable");
    }

    stopFallbackSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice =
      voices.find((voice) => /samantha|ava|victoria|female|zira|google us english/i.test(voice.name)) ||
      voices.find((voice) => /en(-|_)us|english/i.test(voice.lang)) ||
      null;
    utterance.rate = 1.02;
    utterance.pitch = 1.28;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      fallbackSpeechInterval.current = window.setInterval(() => {
        setLollieVolumeLevel((prev) => (prev > 0.7 ? 0.25 : prev + 0.22));
      }, 120);
    };

    utterance.onend = () => {
      stopFallbackSpeech();
    };

    utterance.onerror = () => {
      stopFallbackSpeech();
    };

    browserUtterance.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [stopFallbackSpeech]);

  const transcribeWithServer = useCallback(async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const sttRes = await fetch('/api/transcribe', { method: 'POST', body: formData });
    if (!sttRes.ok) {
      throw new Error('Transcription failed');
    }

    const { text } = await sttRes.json();
    return typeof text === 'string' ? text.trim() : '';
  }, []);

  const processVoiceInput = async (
    audioBlob: Blob,
    currentHistory: { role: string; content: string }[],
    systemPrompt: string,
    onTranscription: (text: string) => void,
    onResponseText: (text: string) => void,
    browserTranscript = ""
  ) => {
    setIsProcessing(true);
    try {
      // 1. STT: use browser speech when available, otherwise fall back to the server route.
      let transcribedText = browserTranscript.trim();
      if (!transcribedText) {
        try {
          transcribedText = await transcribeWithServer(audioBlob);
        } catch (sttError) {
          console.warn('STT fallback unavailable:', sttError);
        }
      }
      
      if (!transcribedText || transcribedText.trim() === '') {
        onResponseText("I couldn't make that out. Try speaking a little closer or type to me in chat.");
        return;
      }
      
      onTranscription(transcribedText);

      // 2. Brain: Get Lollie's response from Gemini
      const messages = [...currentHistory, { role: 'user', content: transcribedText }];
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, systemPrompt, quickResponse: true }), // quickResponse gets full text immediately
      });
      
      if (!chatRes.ok) throw new Error('Chat generation failed');
      const { text: lollieText } = await chatRes.json();
      
      onResponseText(lollieText);

      // 3. TTS: Convert text to speech via ElevenLabs
      try {
        const ttsRes = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: lollieText }),
        });

        if (!ttsRes.ok) {
          throw new Error('TTS generation failed');
        }

        const contentType = ttsRes.headers.get('content-type') || '';
        if (!contentType.includes('audio/')) {
          throw new Error('TTS audio unavailable');
        }

        const audioArrayBuffer = await ttsRes.arrayBuffer();

        // 4. Playback & Lip Sync Analysis
        if (!audioContext.current) {
          audioContext.current = new AudioContext();
        }
        if (audioContext.current.state === 'suspended') {
          await audioContext.current.resume();
        }

        const decodedAudio = await audioContext.current.decodeAudioData(audioArrayBuffer);

        currentAudioSource.current = audioContext.current.createBufferSource();
        currentAudioSource.current.buffer = decodedAudio;

        analyser.current = audioContext.current.createAnalyser();
        analyser.current.fftSize = 256;

        currentAudioSource.current.connect(analyser.current);
        analyser.current.connect(audioContext.current.destination);

        const bufferLength = analyser.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateLipSync = () => {
          if (!analyser.current || !isSpeaking) return;
          analyser.current.getByteFrequencyData(dataArray);

          // Focus on vocal frequencies (roughly indices 5-30 out of 128 depending on sample rate)
          let sum = 0;
          for (let i = 5; i < 30; i++) {
            sum += dataArray[i];
          }
          const avg = sum / 25;
          // Normalize to 0-1 range for the mouth scale
          setLollieVolumeLevel(Math.min(1, avg / 120));

          animationFrameId.current = requestAnimationFrame(updateLipSync);
        };

        setIsSpeaking(true);
        currentAudioSource.current.onended = () => {
          setIsSpeaking(false);
          setLollieVolumeLevel(0);
          if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };

        currentAudioSource.current.start(0);
        updateLipSync();
      } catch (ttsError) {
        console.warn('TTS fallback to browser speech:', ttsError);
        await speakWithBrowserVoice(lollieText);
      }

    } catch (error) {
      console.error('Voice Pipeline Error:', error);
      onResponseText("I hit a voice hiccup, but I’m still here. Try again or switch to chat for a second.");
    } finally {
      setIsProcessing(false);
    }
  };

  const stopAudio = useCallback(() => {
    if (currentAudioSource.current) {
      currentAudioSource.current.stop();
      currentAudioSource.current = null;
    }
    stopFallbackSpeech();
    setIsSpeaking(false);
    setLollieVolumeLevel(0);
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
  }, [stopFallbackSpeech]);

  return { processVoiceInput, stopAudio, isProcessing, isSpeaking, lollieVolumeLevel };
}
