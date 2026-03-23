"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SoundEffect, WeightMilestone } from "@/lib/types";
import { useWeightTracker } from "@/hooks/useWeightTracker";
import { getRandomMessage } from "@/lib/pug-wisdom";
import { PUG_WEIGHT_MILESTONE } from "@/lib/pug-wisdom";
import WeightEntryForm from "./WeightEntryForm";
import WeightChart from "./WeightChart";
import WeightGoal from "./WeightGoal";
import WeightStats from "./WeightStats";

interface WeightViewProps {
  onMoodChange: (mood: string, message: string) => void;
  playSound: (effect: SoundEffect) => void;
}

export default function WeightView({ onMoodChange, playSound }: WeightViewProps) {
  const {
    entries, goal, milestones, newMilestone, progress, isLoaded,
    addEntry, deleteEntry, setWeightGoal, dismissMilestone,
  } = useWeightTracker();

  const handleAdd = (date: string, weight: number, note?: string) => {
    addEntry(date, weight, note);
    playSound("weight-log");
    onMoodChange("eating", "Logged! Lollie is keeping track for you!");
    setTimeout(() => onMoodChange("happy", "Lollie says: You're doing amazing, Danielle!"), 2500);
  };

  const handleMilestoneDismiss = () => {
    dismissMilestone();
    onMoodChange("happy", "Lollie says: Keep going, you're incredible!");
  };

  if (!isLoaded) return null;

  return (
    <div className="space-y-3 animate-slide-up">
      <AnimatePresence>
        {newMilestone && (
          <MilestoneOverlay milestone={newMilestone} onDismiss={handleMilestoneDismiss} playSound={playSound} />
        )}
      </AnimatePresence>

      <WeightEntryForm onAdd={handleAdd} />
      <WeightGoal goal={goal} progress={progress} onSetGoal={setWeightGoal} />
      <WeightChart entries={entries} goal={goal} />
      <WeightStats entries={entries} goal={goal} onDeleteEntry={deleteEntry} />

      {milestones.length > 0 && (
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-sm font-bold text-purple-200 mb-2 flex items-center gap-2"><span>🏆</span> Milestones</h3>
          <div className="flex flex-wrap gap-2">
            {milestones.map((m, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-md shadow-purple-500/20">
                {m.type === "goal-reached" ? "Trophy" : m.type === "halfway" ? "🎯" : m.type === "new-low" ? "Star" : "PartyPopper"}
                {m.type.replace("-", " ")}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MilestoneOverlay({ milestone, onDismiss, playSound }: { milestone: WeightMilestone; onDismiss: () => void; playSound: (e: SoundEffect) => void }) {
  const messages = PUG_WEIGHT_MILESTONE[milestone.type] || ["Amazing milestone!"];
  playSound("milestone");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/60 backdrop-blur-sm p-4"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 50 }}
        className="glass-card rounded-3xl p-8 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.span className="text-6xl block mb-4" animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>
          🏆
        </motion.span>
        <h2 className="text-xl font-black gradient-text-sparkle mb-2">MILESTONE!</h2>
        <p className="text-purple-200 font-bold mb-4">{getRandomMessage(messages)}</p>
        <button onClick={onDismiss}
          className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-bold py-3 px-8 rounded-full text-sm shadow-lg active:scale-95 transition-all"
        >Yay! 🐾</button>
      </motion.div>
    </motion.div>
  );
}
