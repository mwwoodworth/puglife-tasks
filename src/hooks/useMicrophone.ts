import { useState, useRef, useCallback } from 'react';

export function useMicrophone() {
  const [isRecording, setIsRecording] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const animationFrameId = useRef<number | null>(null);

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

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Microphone access is required to talk to Lollie!');
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorder.current) {
        resolve(null);
        return;
      }

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setIsRecording(false);
        setVolumeLevel(0);
        audioChunks.current = [];
        
        // Stop all tracks to release the mic light
        mediaRecorder.current?.stream.getTracks().forEach(track => track.stop());
        
        if (audioContext.current?.state !== 'closed') {
           audioContext.current?.close();
        }

        resolve(audioBlob);
      };

      mediaRecorder.current.stop();
    });
  }, []);

  return { isRecording, volumeLevel, startRecording, stopRecording };
}
