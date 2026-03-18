import { motion } from "framer-motion";

interface VoiceChatButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  micVolumeLevel: number;
  onStart: () => void;
  onStop: () => void;
  onInterrupt: () => void;
}

export default function VoiceChatButton({
  isRecording,
  isProcessing,
  isSpeaking,
  micVolumeLevel,
  onStart,
  onStop,
  onInterrupt,
}: VoiceChatButtonProps) {
  
  // Simple CSS variables to drive the glowing pulse based on mic volume
  const glowScale = 1 + (micVolumeLevel * 0.5);
  
  if (isSpeaking) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={onInterrupt}
        className="mt-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-xs font-bold shadow-sm border border-pink-200 flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
        Lollie is speaking... (Tap to stop)
      </motion.button>
    );
  }

  if (isProcessing) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="mt-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-xs font-bold shadow-sm border border-purple-200 flex items-center gap-2"
      >
        <svg className="animate-spin h-3 w-3 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Thinking...
      </motion.div>
    );
  }

  return (
    <motion.div className="relative mt-2" initial={{ scale: 0 }} animate={{ scale: 1 }}>
      {/* Dynamic Voice Waveform Glow */}
      {isRecording && (
        <motion.div 
          className="absolute inset-0 bg-fuchsia-500 rounded-full opacity-30"
          animate={{ scale: glowScale }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          style={{ filter: "blur(6px)" }}
        />
      )}
      
      <button
        onPointerDown={(e) => {
          e.preventDefault(); // prevent text selection
          onStart();
        }}
        onPointerUp={onStop}
        onPointerLeave={onStop} // Catch edge cases where finger slides off
        className={`relative z-10 px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all border-2 select-none ${
          isRecording 
            ? "bg-fuchsia-600 text-white border-fuchsia-400 scale-95" 
            : "bg-white text-fuchsia-600 border-fuchsia-200 hover:bg-fuchsia-50"
        }`}
      >
        <div className="flex items-center gap-2 pointer-events-none">
          {isRecording ? (
            <>
              <span className="animate-ping">🎤</span> Listening...
            </>
          ) : (
            <>
              <span>🎤</span> Hold to Speak
            </>
          )}
        </div>
      </button>
    </motion.div>
  );
}
