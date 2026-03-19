import { useState, useRef, useCallback } from 'react';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionEventLike extends Event {
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error?: string;
}

interface BrowserSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  start: () => void;
  stop: () => void;
}

interface BrowserSpeechRecognitionCtor {
  new (): BrowserSpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: BrowserSpeechRecognitionCtor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionCtor;
  }
}

export interface VoiceCaptureResult {
  audioBlob: Blob;
  transcript: string;
}

export function useMicrophone() {
  const [isRecording, setIsRecording] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const speechRecognition = useRef<BrowserSpeechRecognition | null>(null);
  const speechStopResolver = useRef<(() => void) | null>(null);
  const speechStopPromise = useRef<Promise<void> | null>(null);
  const transcriptRef = useRef("");

  const stopSpeechRecognition = useCallback(async () => {
    if (!speechRecognition.current) {
      return;
    }

    const settle = speechStopPromise.current;
    speechRecognition.current.stop();

    if (settle) {
      await Promise.race([
        settle,
        new Promise<void>((resolve) => window.setTimeout(resolve, 500)),
      ]);
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup MediaRecorder
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };

      // Setup AudioContext for volume analysis (for dynamic UI feedback)
      audioContext.current = new AudioContext();
      const source = audioContext.current.createMediaStreamSource(stream);
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 256;
      source.connect(analyser.current);

      const bufferLength = analyser.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!analyser.current) return;
        analyser.current.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const avg = sum / bufferLength;
        setVolumeLevel(Math.min(1, avg / 128)); // Normalize to 0-1
        animationFrameId.current = requestAnimationFrame(updateVolume);
      };
      
      updateVolume();

      transcriptRef.current = "";

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = navigator.language || "en-US";
        recognition.onresult = (event) => {
          let nextTranscript = "";
          for (let i = 0; i < event.results.length; i += 1) {
            const result = event.results[i];
            const firstAlternative = result?.[0];
            if (firstAlternative?.transcript) {
              nextTranscript += firstAlternative.transcript;
            }
          }
          transcriptRef.current = nextTranscript.trim();
        };
        recognition.onend = () => {
          speechRecognition.current = null;
          speechStopResolver.current?.();
          speechStopResolver.current = null;
          speechStopPromise.current = null;
        };
        recognition.onerror = () => {
          recognition.stop();
        };

        speechStopPromise.current = new Promise<void>((resolve) => {
          speechStopResolver.current = resolve;
        });

        try {
          recognition.start();
          speechRecognition.current = recognition;
        } catch {
          speechRecognition.current = null;
          speechStopResolver.current?.();
          speechStopResolver.current = null;
          speechStopPromise.current = null;
        }
      }

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Microphone access is required to talk to Lollie!');
    }
  }, []);

  const stopRecording = useCallback((): Promise<VoiceCaptureResult | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorder.current) {
        resolve(null);
        return;
      }

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      mediaRecorder.current.onstop = () => {
        void (async () => {
          await stopSpeechRecognition();

          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          const transcript = transcriptRef.current.trim();
          setIsRecording(false);
          setVolumeLevel(0);
          audioChunks.current = [];
          transcriptRef.current = "";

          // Stop all tracks to release the mic light
          mediaRecorder.current?.stream.getTracks().forEach(track => track.stop());
          
          if (audioContext.current?.state !== 'closed') {
             await audioContext.current?.close();
          }

          resolve({ audioBlob, transcript });
        })();
      };

      mediaRecorder.current.stop();
    });
  }, [stopSpeechRecognition]);

  return { isRecording, volumeLevel, startRecording, stopRecording };
}
