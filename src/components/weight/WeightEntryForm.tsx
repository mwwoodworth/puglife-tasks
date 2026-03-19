"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getLocalDateString } from "@/lib/date";

interface WeightEntryFormProps {
  onAdd: (date: string, weight: number, note?: string) => void;
}

export default function WeightEntryForm({ onAdd }: WeightEntryFormProps) {
  const today = getLocalDateString();
  const [date, setDate] = useState(today);
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    onAdd(date, w, note.trim() || undefined);
    setWeight("");
    setNote("");
    setDate(today);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="glass-card rounded-2xl p-4 space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-sm font-bold text-purple-200 flex items-center gap-2">
        <span className="text-base">⚖️</span> Log Today&apos;s Weight
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-bold text-purple-400 mb-1 block uppercase tracking-wider">Weight (lbs)</label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="150.0"
            className="w-full bg-purple-900/40 rounded-xl px-3 py-2.5 text-sm font-semibold border border-purple-500/30"
            inputMode="decimal"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-purple-400 mb-1 block uppercase tracking-wider">Date</label>
          <input
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-purple-900/40 rounded-xl px-3 py-2.5 text-sm border border-purple-500/30"
          />
        </div>
      </div>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="How are you feeling? (optional)"
        className="w-full bg-purple-900/40 rounded-xl px-3 py-2.5 text-sm border border-purple-500/30"
      />
      <button
        type="submit"
        disabled={!weight || parseFloat(weight) <= 0}
        className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-bold py-3 rounded-xl text-sm active:scale-[0.98] transition-all disabled:opacity-40 shadow-lg"
      >
        Log Weight 🐾
      </button>
    </motion.form>
  );
}
