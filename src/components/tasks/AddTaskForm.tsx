"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Priority, Category, PRIORITY_CONFIG, CATEGORY_CONFIG } from "@/lib/types";

interface AddTaskFormProps {
  onAdd: (task: { title: string; priority: Priority; category: Category; notes?: string; dueDate?: string }) => void;
}

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("bone");
  const [category, setCategory] = useState<Category>("personal");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), priority, category, notes: notes.trim() || undefined, dueDate: dueDate || undefined });
    setTitle(""); setNotes(""); setDueDate("");
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="add-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 100); }}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-all group cursor-pointer"
          >
            <span className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center text-white text-xl font-bold shadow-lg group-active:scale-110 transition-transform">
              +
            </span>
            <span className="text-purple-400 font-medium text-sm">Add a new task... 🐾</span>
          </motion.button>
        ) : (
          <motion.form
            key="add-form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl p-4 space-y-3"
          >
            <div className="relative">
              <input
                ref={inputRef}
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs doing, Danielle?"
                className="w-full bg-purple-900/40 rounded-xl px-4 py-3 text-sm font-medium border border-purple-500/30"
                autoFocus
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-purple-400 mb-1.5 block uppercase tracking-wider">Priority</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG.paw][]).map(([key, config]) => (
                  <button
                    key={key} type="button" onClick={() => setPriority(key)}
                    className={`flex flex-col items-center gap-0.5 p-2 rounded-xl text-xs font-semibold transition-all ${
                      priority === key ? `${config.className} text-white shadow-lg scale-105` : "bg-purple-800/30 text-purple-300 active:bg-purple-700/40"
                    }`}
                  >
                    <span className="text-base">{config.emoji}</span>
                    <span className="text-[9px]">{config.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-purple-400 mb-1.5 block uppercase tracking-wider">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG.personal][]).map(([key, config]) => (
                  <button
                    key={key} type="button" onClick={() => setCategory(key)}
                    className={`category-pill inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                      category === key ? `bg-gradient-to-r ${config.gradient} text-white shadow-md active` : "bg-purple-800/30 text-purple-300"
                    }`}
                  >
                    <span>{config.emoji}</span><span>{config.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-purple-400 mb-1 block uppercase tracking-wider">Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-purple-900/40 rounded-xl px-3 py-2 text-sm border border-purple-500/30"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-purple-400 mb-1 block uppercase tracking-wider">Notes</label>
                <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Details..."
                  className="w-full bg-purple-900/40 rounded-xl px-3 py-2 text-sm border border-purple-500/30"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={!title.trim()}
                className="flex-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-bold py-3 rounded-xl text-sm active:scale-[0.98] transition-all disabled:opacity-40 shadow-lg"
              >Add Task 🐾</button>
              <button type="button"
                onClick={() => { setIsOpen(false); setTitle(""); setNotes(""); setDueDate(""); }}
                className="px-5 py-3 bg-purple-800/40 rounded-xl text-sm font-medium text-purple-300 active:bg-purple-700/50 transition-all"
              >Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
