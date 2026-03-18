import { useState, useRef, useCallback } from 'react';

export function useVoiceChat() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lollieVolumeLevel, setLollieVolumeLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const currentAudioSource = useRef<AudioBufferSourceNode | null>(null);

  const processVoiceInput = async (
    audioBlob: Blob,
    currentHistory: { role: string; content: string }[],
    systemPrompt: string,
    onTranscription: (text: string) => void,
    onResponseText: (text: string) => void
  ) => {
    setIsProcessing(true);
    try {
      // 1. STT: Transcribe user audio via Whisper
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const sttRes = await fetch('/api/transcribe', { method: 'POST', body: formData });
      if (!sttRes.ok) throw new Error('Transcription failed');
      const { text: transcribedText } = await sttRes.json();
      
      if (!transcribedText || transcribedText.trim() === '') {
        setIsProcessing(false);
        return; // Empty audio
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
      const ttsRes = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: lollieText }),
      });
      
      if (!ttsRes.ok) throw new Error('TTS generation failed');
      
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

    } catch (error) {
      console.error('Voice Pipeline Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const stopAudio = useCallback(() => {
    if (currentAudioSource.current) {
      currentAudioSource.current.stop();
      currentAudioSource.current = null;
    }
    setIsSpeaking(false);
    setLollieVolumeLevel(0);
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
  }, []);

  return { processVoiceInput, stopAudio, isProcessing, isSpeaking, lollieVolumeLevel };
}
