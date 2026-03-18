"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Priority, Category, PRIORITY_CONFIG, CATEGORY_CONFIG } from "@/lib/types";

interface AddTaskFormProps {
  onAdd: (task: {
    title: string;
    priority: Priority;
    category: Category;
    notes?: string;
    dueDate?: string;
  }) => void;
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

    onAdd({
      title: title.trim(),
      priority,
      category,
      notes: notes.trim() || undefined,
      dueDate: dueDate || undefined,
    });

    setTitle("");
    setNotes("");
    setDueDate("");
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="add-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-3 hover:shadow-lg transition-all group cursor-pointer"
          >
            <span className="w-10 h-10 rounded-full bg-gradient-to-r from-pug-pink to-pug-purple flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform shadow-md">
              +
            </span>
            <span className="text-pug-dark/50 font-medium text-sm group-hover:text-pug-dark/70 transition-colors">
              Add a new task... 🐾
            </span>
          </motion.button>
        ) : (
          <motion.form
            key="add-form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl p-5 space-y-4"
          >
            {/* Title input */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs doing? 🐶"
                className="w-full bg-white/60 rounded-xl px-4 py-3 text-sm font-medium border border-pug-tan/20 placeholder:text-pug-dark/30 transition-all"
                autoFocus
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg animate-paw-bounce">
                🐾
              </span>
            </div>

            {/* Priority selector */}
            <div>
              <label className="text-xs font-bold text-pug-dark/60 mb-2 block uppercase tracking-wider">
                Priority Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG.paw][]).map(
                  ([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPriority(key)}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                        priority === key
                          ? `${config.className} text-white shadow-lg scale-105`
                          : "bg-white/50 text-pug-dark/60 hover:bg-white/70"
                      }`}
                    >
                      <span className="text-lg">{config.emoji}</span>
                      <span className="text-[10px]">{config.label}</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Category selector */}
            <div>
              <label className="text-xs font-bold text-pug-dark/60 mb-2 block uppercase tracking-wider">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG.personal][]).map(
                  ([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCategory(key)}
                      className={`category-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        category === key
                          ? `bg-gradient-to-r ${config.gradient} text-white shadow-md active`
                          : "bg-white/50 text-pug-dark/60 hover:bg-white/70"
                      }`}
                    >
                      <span>{config.emoji}</span>
                      <span>{config.label}</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Due date and notes row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-pug-dark/60 mb-1.5 block uppercase tracking-wider">
                  Due Date (optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-white/60 rounded-xl px-3 py-2 text-sm border border-pug-tan/20"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-pug-dark/60 mb-1.5 block uppercase tracking-wider">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any extra details..."
                  className="w-full bg-white/60 rounded-xl px-3 py-2 text-sm border border-pug-tan/20 placeholder:text-pug-dark/30"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={!title.trim()}
                className="flex-1 bg-gradient-to-r from-pug-pink to-pug-purple text-white font-bold py-3 rounded-xl text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Add Task 🐾
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setTitle("");
                  setNotes("");
                  setDueDate("");
                }}
                className="px-5 py-3 bg-white/50 rounded-xl text-sm font-medium text-pug-dark/60 hover:bg-white/70 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
