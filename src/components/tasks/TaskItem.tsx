"use client";

import { motion } from "framer-motion";
import { Task, PRIORITY_CONFIG, CATEGORY_CONFIG } from "@/lib/types";
import { useState } from "react";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Task>) => void;
  index: number;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit, index }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editNotes, setEditNotes] = useState(task.notes || "");
  const [showNotes, setShowNotes] = useState(false);

  const priority = PRIORITY_CONFIG[task.priority];
  const category = CATEGORY_CONFIG[task.category];
  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(task.id, { title: editTitle.trim(), notes: editNotes.trim() || undefined });
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, layout: { duration: 0.25 } }}
      className={`glass-card rounded-2xl p-3.5 relative overflow-hidden ${
        task.completed ? "opacity-50" : ""
      } ${isOverdue ? "animate-rainbow-border" : ""}`}
    >
      {/* Priority stripe */}
      <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-2xl ${priority.className}`} />

      <div className="flex items-start gap-3 pl-2">
        <div className="pt-0.5">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="pug-checkbox"
            aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
          />
        </div>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setIsEditing(false); }}
                className="w-full bg-purple-900/40 rounded-xl px-3 py-2 text-sm border border-purple-500/30 font-medium"
                autoFocus
              />
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add notes..."
                className="w-full bg-purple-900/40 rounded-xl px-3 py-2 text-xs border border-purple-500/30 resize-none h-16"
              />
              <div className="flex gap-2">
                <button onClick={handleSave} className="text-xs bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-3 py-1.5 rounded-full font-semibold">
                  Save 🐾
                </button>
                <button onClick={() => { setIsEditing(false); setEditTitle(task.title); setEditNotes(task.notes || ""); }}
                  className="text-xs bg-purple-800/40 px-3 py-1.5 rounded-full font-medium text-purple-300"
                >Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <span className={`text-sm font-semibold leading-tight block ${task.completed ? "line-through text-purple-500" : "text-purple-100"}`}>
                {task.title}
                {task.isRecurring && <span className="ml-1.5" title="Daily Recurring">🔄</span>}
                {task.completed && <span className="ml-1.5">🐾</span>}
              </span>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full text-white ${priority.className}`}>
                  {priority.emoji} {priority.label}
                </span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${category.gradient} text-white`}>
                  {category.emoji} {category.label}
                </span>
                {task.dueDate && (
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${isOverdue ? "bg-red-500/30 text-red-300" : "bg-purple-800/40 text-purple-300"}`}>
                    {isOverdue ? "!!" : ""} {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                )}
              </div>
              {task.notes && (
                <button onClick={() => setShowNotes(!showNotes)} className="text-[11px] text-purple-400 mt-1 hover:text-purple-300 transition-colors">
                  {showNotes ? "Hide notes" : "Notes..."}
                </button>
              )}
              {showNotes && task.notes && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  className="text-xs text-purple-300/70 mt-1 pl-2 border-l-2 border-purple-500/30"
                >{task.notes}</motion.p>
              )}
            </>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center gap-0.5 shrink-0">
            <button onClick={() => setIsEditing(true)} className="p-2 rounded-full active:bg-purple-700/30 transition-colors text-sm" aria-label="Edit">✏️</button>
            <button onClick={() => onDelete(task.id)} className="p-2 rounded-full active:bg-red-500/20 transition-colors text-sm" aria-label="Delete">🗑️</button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
