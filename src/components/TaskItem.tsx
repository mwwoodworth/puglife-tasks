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

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
  index,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isHovered, setIsHovered] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [editNotes, setEditNotes] = useState(task.notes || "");

  const priority = PRIORITY_CONFIG[task.priority];
  const category = CATEGORY_CONFIG[task.category];

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(task.id, { title: editTitle.trim(), notes: editNotes.trim() || undefined });
      setIsEditing(false);
    }
  };

  const isOverdue =
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.9, height: 0, marginBottom: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.05,
        layout: { duration: 0.3 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glass-card rounded-2xl p-4 group relative overflow-hidden ${
        task.completed ? "opacity-70" : ""
      } ${isOverdue ? "animate-rainbow-border" : ""}`}
    >
      {/* Priority indicator stripe */}
      <div
        className={`absolute top-0 left-0 w-1.5 h-full rounded-l-2xl ${priority.className}`}
      />

      <div className="flex items-start gap-3 pl-2">
        {/* Checkbox */}
        <div className="pt-0.5">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="pug-checkbox"
            aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") setIsEditing(false);
                }}
                className="w-full bg-white/50 rounded-xl px-3 py-2 text-sm border border-pug-tan/30 font-medium"
                autoFocus
              />
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add notes... 📝"
                className="w-full bg-white/50 rounded-xl px-3 py-2 text-xs border border-pug-tan/30 resize-none h-16"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="text-xs bg-gradient-to-r from-pug-pink to-pug-purple text-white px-3 py-1.5 rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  Save 🐾
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditTitle(task.title);
                    setEditNotes(task.notes || "");
                  }}
                  className="text-xs bg-white/60 px-3 py-1.5 rounded-full font-medium hover:bg-white/80 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-sm font-semibold leading-tight ${
                    task.completed
                      ? "line-through text-pug-dark/40"
                      : "text-pug-dark"
                  }`}
                >
                  {task.title}
                </span>
                {task.completed && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-sm"
                  >
                    ✅
                  </motion.span>
                )}
              </div>

              {/* Tags row */}
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full text-white ${priority.className}`}
                >
                  {priority.emoji} {priority.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${category.gradient} text-white`}
                >
                  {category.emoji} {category.label}
                </span>
                {task.dueDate && (
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      isOverdue
                        ? "bg-red-100 text-red-600"
                        : "bg-white/50 text-pug-dark/60"
                    }`}
                  >
                    {isOverdue ? "⚠️" : "📅"}{" "}
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>

              {/* Notes */}
              {task.notes && (
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="text-[11px] text-pug-dark/50 mt-1 hover:text-pug-purple transition-colors"
                >
                  {showNotes ? "Hide notes ▲" : "📝 Show notes ▼"}
                </button>
              )}
              {showNotes && task.notes && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="text-xs text-pug-dark/60 mt-1 pl-1 border-l-2 border-pug-purple/20"
                >
                  {task.notes}
                </motion.p>
              )}
            </>
          )}
        </div>

        {/* Action buttons */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered || isEditing ? 1 : 0 }}
          className="flex items-center gap-1 shrink-0"
        >
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-full hover:bg-pug-purple/10 transition-colors text-sm"
                aria-label="Edit task"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 rounded-full hover:bg-red-50 transition-colors text-sm"
                aria-label="Delete task"
              >
                🗑️
              </button>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
