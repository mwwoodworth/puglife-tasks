"use client";

import { useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Task, Priority, Category, SoundEffect } from "@/lib/types";
import TaskItem from "./TaskItem";
import AddTaskForm from "./AddTaskForm";
import ProgressBone from "./ProgressBone";
import FilterBar from "./FilterBar";
import GlassCard from "@/components/ui/GlassCard";

interface TasksViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onMoodChange: (mood: string, message: string) => void;
  playSound: (effect: SoundEffect) => void;
  onStreakUpdate: () => void;
}

function fireConfetti() {
  const colors = ["#a855f7", "#c084fc", "#f472b6", "#fbbf24", "#e879f9"];
  confetti({ particleCount: 40, spread: 360, origin: { x: 0.3, y: 0.6 }, colors, gravity: 0.5, decay: 0.94, startVelocity: 30, ticks: 100 });
  confetti({ particleCount: 40, spread: 360, origin: { x: 0.7, y: 0.6 }, colors, gravity: 0.5, decay: 0.94, startVelocity: 30, ticks: 100 });
}

function fireBigConfetti() {
  const colors = ["#a855f7", "#c084fc", "#f472b6", "#fbbf24", "#e879f9"];
  const end = Date.now() + 2000;
  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

const PUG_COMPLETE = [
  "AMAZING! You did it! 🎉", "That deserves a treat!", "WOOO! *happy zoomies*",
  "Task crushed! Unstoppable!", "I'm SO proud of you!", "YES! Gold star!",
];
const PUG_ALL_DONE = [
  "ALL DONE! You're a legend! 👑", "Everything complete! Snuggle time!",
  "Zero tasks left! Productivity queen! 💅",
];
const PUG_BUSY = [
  "You've got this!", "Look at you being productive!", "So many things to do!",
  "Productivity level: MAXIMUM PUG!", "Every task = celebration treat!",
];
const PUG_ENCOURAGE = [
  "Stay pawsitive!", "You're paw-some!", "Fur real, you're doing great!",
  "You're the leader of the pack!", "Howl yeah, let's do this!",
];

function rand(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function TasksView({ tasks, setTasks, onMoodChange, playSound, onStreakUpdate }: TasksViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [activePriority, setActivePriority] = useState<Priority | "all">("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priority" | "due">("newest");

  const addTask = useCallback((data: { title: string; priority: Priority; category: Category; notes?: string; dueDate?: string }) => {
    const newTask: Task = {
      id: crypto.randomUUID(), title: data.title, completed: false,
      priority: data.priority, category: data.category, createdAt: new Date().toISOString(),
      notes: data.notes, dueDate: data.dueDate,
    };
    setTasks((prev) => [newTask, ...prev]);
    onStreakUpdate();
    playSound("task-add");
    onMoodChange("love", "Ooh, a new task! Exciting! 🎉");
    setTimeout(() => onMoodChange("happy", rand(PUG_ENCOURAGE)), 2000);
  }, [setTasks, onMoodChange, playSound, onStreakUpdate]);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined } : t
      );
      const task = updated.find((t) => t.id === id);
      if (task?.completed) {
        fireConfetti();
        playSound("task-complete");
        onMoodChange("celebrating", rand(PUG_COMPLETE));
        if (updated.every((t) => t.completed)) setTimeout(fireBigConfetti, 500);
        setTimeout(() => onMoodChange("happy", rand(PUG_BUSY)), 3000);
      }
      return updated;
    });
  }, [setTasks, playSound, onMoodChange]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    playSound("task-delete");
    onMoodChange("sad", "Bye bye task... 🥺");
    setTimeout(() => onMoodChange("idle", rand(PUG_ENCOURAGE)), 2000);
  }, [setTasks, playSound, onMoodChange]);

  const editTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, [setTasks]);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
    onMoodChange("love", "Fresh start! Let's go! 🌟");
  }, [setTasks, onMoodChange]);

  const priorityOrder: Record<Priority, number> = { zoomies: 0, treat: 1, bone: 2, paw: 3 };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (!showCompleted && t.completed) return false;
        if (activeCategory !== "all" && t.category !== activeCategory) return false;
        if (activePriority !== "all" && t.priority !== activePriority) return false;
        if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        switch (sortBy) {
          case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case "priority": return priorityOrder[a.priority] - priorityOrder[b.priority];
          case "due": {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
          default: return 0;
        }
      });
  }, [tasks, activeCategory, activePriority, showCompleted, sortBy, searchQuery, priorityOrder]);

  const taskCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tasks.filter((t) => !t.completed).length };
    tasks.forEach((t) => { if (!t.completed) counts[t.category] = (counts[t.category] || 0) + 1; });
    return counts;
  }, [tasks]);

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-3 animate-slide-up">
      {/* Progress */}
      {tasks.length > 0 && (
        <GlassCard className="p-4"><ProgressBone completed={completedCount} total={tasks.length} /></GlassCard>
      )}

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">🔍</span>
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-white/50 rounded-2xl pl-11 pr-10 py-3 text-sm font-medium border border-purple-200/20 placeholder:text-purple-300"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 text-sm p-1">✕</button>
        )}
      </div>

      {/* Add task */}
      <AddTaskForm onAdd={addTask} />

      {/* Filters */}
      {tasks.length > 0 && (
        <GlassCard className="p-3">
          <FilterBar
            activeCategory={activeCategory} activePriority={activePriority}
            showCompleted={showCompleted} sortBy={sortBy}
            onCategoryChange={setActiveCategory} onPriorityChange={setActivePriority}
            onShowCompletedChange={setShowCompleted} onSortChange={setSortBy} taskCounts={taskCounts}
          />
        </GlassCard>
      )}

      {/* Task list */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, i) => (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} index={i} />
          ))}
        </AnimatePresence>

        {filteredTasks.length === 0 && tasks.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <span className="text-4xl mb-2 block">🔍</span>
            <p className="text-purple-300 font-medium text-sm">No tasks match</p>
            <button onClick={() => { setActiveCategory("all"); setActivePriority("all"); setShowCompleted(true); setSearchQuery(""); }}
              className="mt-2 text-xs text-purple-500 font-bold"
            >Clear filters</button>
          </motion.div>
        )}

        {tasks.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center py-10">
            <motion.span className="text-5xl mb-3 block" animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>🐾</motion.span>
            <p className="text-purple-500 font-bold text-base mb-1">No tasks yet!</p>
            <p className="text-purple-300 text-sm">Add your first task above!</p>
          </motion.div>
        )}
      </div>

      {/* Clear completed */}
      {completedCount > 0 && (
        <div className="text-center pt-2">
          <button onClick={clearCompleted}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/40 rounded-full text-xs font-bold text-purple-400 active:bg-white/60 transition-all"
          >🧹 Clear {completedCount} done</button>
        </div>
      )}
    </div>
  );
}
