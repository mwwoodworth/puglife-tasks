"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";

import { Task, Priority, Category } from "@/lib/types";
import { loadTasks, saveTasks, updateStreak, getStreak } from "@/lib/storage";
import {
  PUG_IDLE_MESSAGES,
  PUG_BUSY_MESSAGES,
  PUG_COMPLETE_MESSAGES,
  PUG_ALL_DONE_MESSAGES,
  PUG_ENCOURAGEMENTS,
  getRandomMessage,
  getPugMoodEmoji,
} from "@/lib/pug-wisdom";

import PugMascot from "@/components/PugMascot";
import TaskItem from "@/components/TaskItem";
import AddTaskForm from "@/components/AddTaskForm";
import ProgressBone from "@/components/ProgressBone";
import FilterBar from "@/components/FilterBar";
import SparkleEffect from "@/components/SparkleEffect";

type PugMoodType = "sleeping" | "idle" | "happy" | "excited" | "celebrating" | "love";

function fireConfetti() {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0.5,
    decay: 0.94,
    startVelocity: 30,
    colors: ["#ff8fab", "#c77dff", "#ffd60a", "#90e0ef", "#ff6b6b", "#95d5b2"],
  };

  confetti({ ...defaults, particleCount: 40, origin: { x: 0.3, y: 0.6 } });
  confetti({ ...defaults, particleCount: 40, origin: { x: 0.7, y: 0.6 } });

  // Paw print shaped burst
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 25,
      origin: { x: 0.5, y: 0.5 },
      shapes: ["circle"],
      scalar: 1.2,
    });
  }, 200);
}

function fireBigConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;
  const colors = ["#ff8fab", "#c77dff", "#ffd60a", "#90e0ef", "#ff6b6b"];

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pugMood, setPugMood] = useState<PugMoodType>("sleeping");
  const [pugMessage, setPugMessage] = useState("Loading... *yawns*");
  const [streak, setStreak] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [activePriority, setActivePriority] = useState<Priority | "all">("all");
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priority" | "due">("newest");

  // Load on mount
  useEffect(() => {
    const loaded = loadTasks();
    setTasks(loaded);
    const s = getStreak();
    setStreak(s.current);
    setIsLoaded(true);
  }, []);

  // Save on change
  useEffect(() => {
    if (isLoaded) saveTasks(tasks);
  }, [tasks, isLoaded]);

  // Update pug mood based on tasks
  useEffect(() => {
    if (!isLoaded) return;

    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;

    if (total === 0) {
      setPugMood("sleeping");
      setPugMessage(getRandomMessage(PUG_IDLE_MESSAGES));
    } else if (completed === total) {
      setPugMood("celebrating");
      setPugMessage(getRandomMessage(PUG_ALL_DONE_MESSAGES));
    } else if (completed > total * 0.5) {
      setPugMood("excited");
      setPugMessage(getRandomMessage(PUG_BUSY_MESSAGES));
    } else if (completed > 0) {
      setPugMood("happy");
      setPugMessage(getRandomMessage(PUG_BUSY_MESSAGES));
    } else {
      setPugMood("idle");
      setPugMessage(getRandomMessage(PUG_ENCOURAGEMENTS));
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback(
    (taskData: {
      title: string;
      priority: Priority;
      category: Category;
      notes?: string;
      dueDate?: string;
    }) => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: taskData.title,
        completed: false,
        priority: taskData.priority,
        category: taskData.category,
        createdAt: new Date().toISOString(),
        notes: taskData.notes,
        dueDate: taskData.dueDate,
      };
      setTasks((prev) => [newTask, ...prev]);
      const newStreak = updateStreak();
      setStreak(newStreak);
      setPugMood("love");
      setPugMessage("Ooh, a new task! Exciting! 🎉");
      setTimeout(() => {
        setPugMood("happy");
        setPugMessage(getRandomMessage(PUG_ENCOURAGEMENTS));
      }, 2000);
    },
    []
  );

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== id) return t;
        const nowCompleted = !t.completed;
        return {
          ...t,
          completed: nowCompleted,
          completedAt: nowCompleted ? new Date().toISOString() : undefined,
        };
      });

      const task = updated.find((t) => t.id === id);
      if (task?.completed) {
        fireConfetti();
        const allDone = updated.every((t) => t.completed);
        if (allDone && updated.length > 0) {
          setTimeout(fireBigConfetti, 500);
        }
      }

      return updated;
    });

    // Set celebration message
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      if (task?.completed) {
        setPugMood("celebrating");
        setPugMessage(getRandomMessage(PUG_COMPLETE_MESSAGES));
        setTimeout(() => {
          setPugMood("happy");
          setPugMessage(getRandomMessage(PUG_BUSY_MESSAGES));
        }, 3000);
      }
      return prev;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const editTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
    setPugMood("love");
    setPugMessage("Fresh start! Let's go! 🌟");
  }, []);

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    const priorityOrder: Record<Priority, number> = {
      zoomies: 0,
      treat: 1,
      bone: 2,
      paw: 3,
    };

    return tasks
      .filter((t) => {
        if (!showCompleted && t.completed) return false;
        if (activeCategory !== "all" && t.category !== activeCategory) return false;
        if (activePriority !== "all" && t.priority !== activePriority) return false;
        if (
          searchQuery &&
          !t.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false;
        return true;
      })
      .sort((a, b) => {
        // Always put incomplete tasks first
        if (a.completed !== b.completed) return a.completed ? 1 : -1;

        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case "oldest":
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case "priority":
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          case "due": {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
          default:
            return 0;
        }
      });
  }, [tasks, activeCategory, activePriority, showCompleted, sortBy, searchQuery]);

  // Task counts
  const taskCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tasks.filter((t) => !t.completed).length };
    tasks.forEach((t) => {
      if (!t.completed) {
        counts[t.category] = (counts[t.category] || 0) + 1;
      }
    });
    return counts;
  }, [tasks]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const moodEmoji = getPugMoodEmoji(tasks.length, completedCount);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.span
            className="text-7xl block mb-4"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🐶
          </motion.span>
          <p className="text-pug-dark/60 font-semibold">Loading PugLife...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <SparkleEffect />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <motion.span
              className="text-3xl"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🐾
            </motion.span>
            <h1 className="text-3xl sm:text-4xl font-black gradient-text-sparkle">
              PugLife Tasks
            </h1>
            <motion.span
              className="text-3xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              🐾
            </motion.span>
          </div>
          <p className="text-sm text-pug-dark/50 font-medium">
            The cutest way to get stuff done {moodEmoji}
          </p>
        </motion.header>

        {/* Pug Mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <PugMascot mood={pugMood} message={pugMessage} streak={streak} />
        </motion.div>

        {/* Progress */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-4 mb-4"
          >
            <ProgressBone completed={completedCount} total={tasks.length} />
          </motion.div>
        )}

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-4"
        >
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-white/50 rounded-2xl pl-11 pr-4 py-3 text-sm font-medium border border-pug-tan/10 placeholder:text-pug-dark/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pug-dark/40 hover:text-pug-dark/60 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </motion.div>

        {/* Add Task */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-4"
        >
          <AddTaskForm onAdd={addTask} />
        </motion.div>

        {/* Filters */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="glass-card rounded-2xl p-4 mb-4"
          >
            <FilterBar
              activeCategory={activeCategory}
              activePriority={activePriority}
              showCompleted={showCompleted}
              sortBy={sortBy}
              onCategoryChange={setActiveCategory}
              onPriorityChange={setActivePriority}
              onShowCompletedChange={setShowCompleted}
              onSortChange={setSortBy}
              taskCounts={taskCounts}
            />
          </motion.div>
        )}

        {/* Task List */}
        <div className="space-y-3 mb-6">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={editTask}
                index={index}
              />
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {filteredTasks.length === 0 && tasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10"
            >
              <span className="text-5xl mb-3 block">🔍</span>
              <p className="text-pug-dark/40 font-medium text-sm">
                No tasks match your filters
              </p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setActivePriority("all");
                  setShowCompleted(true);
                  setSearchQuery("");
                }}
                className="mt-2 text-xs text-pug-purple font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}

          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center py-12"
            >
              <motion.span
                className="text-6xl mb-4 block"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🐾
              </motion.span>
              <p className="text-pug-dark/50 font-semibold text-lg mb-1">
                No tasks yet!
              </p>
              <p className="text-pug-dark/30 text-sm">
                Add your first task and let&apos;s get productive together!
              </p>
            </motion.div>
          )}
        </div>

        {/* Clear completed button */}
        {completedCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <button
              onClick={clearCompleted}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/50 rounded-full text-xs font-semibold text-pug-dark/50 hover:bg-white/70 hover:text-pug-coral transition-all"
            >
              🧹 Clear {completedCount} completed task
              {completedCount > 1 ? "s" : ""}
            </button>
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-10 mb-4"
        >
          <p className="text-[11px] text-pug-dark/25 font-medium">
            Made with 💖 and pug snuggles
          </p>
          <p className="text-[10px] text-pug-dark/15 mt-0.5">
            PugLife Tasks v1.0 — Your tasks are stored locally on this device
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
