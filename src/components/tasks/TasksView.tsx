"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Task, Priority, Category, SoundEffect, ResetSectionId } from "@/lib/types";
import { RESET_SECTIONS } from "@/lib/daily-reset-plan";
import TaskItem from "./TaskItem";
import AddTaskForm from "./AddTaskForm";
import ProgressBone from "./ProgressBone";
import FilterBar from "./FilterBar";
import GlassCard from "@/components/ui/GlassCard";
import ResetSection from "./ResetSection";
import DailyWinCheck from "./DailyWinCheck";
import BadDayMode from "./BadDayMode";
import WeeklyFocus from "./WeeklyFocus";

interface TasksViewProps {
  // Daily Reset props
  completedResetTasks: string[];
  badDayMode: boolean;
  badDayCompletedTasks: string[];
  onToggleResetTask: (taskId: string) => void;
  onActivateBadDay: () => void;
  onDeactivateBadDay: () => void;
  currentSectionId: string | null;
  dayProgress: { total: number; done: number; percent: number };
  getSectionProgress: (id: ResetSectionId) => { total: number; done: number; percent: number };
  // Custom tasks props
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onMoodChange: (mood: string, message: string) => void;
  playSound: (effect: SoundEffect) => void;
  onStreakUpdate: () => void;
}

function fireConfetti() {
  const colors = ["#8b5cf6", "#a855f7", "#c084fc", "#ec4899", "#fbbf24"];
  confetti({ particleCount: 40, spread: 360, origin: { x: 0.3, y: 0.6 }, colors, gravity: 0.5, decay: 0.94, startVelocity: 30, ticks: 100 });
  confetti({ particleCount: 40, spread: 360, origin: { x: 0.7, y: 0.6 }, colors, gravity: 0.5, decay: 0.94, startVelocity: 30, ticks: 100 });
}

const PUG_COMPLETE = ["AMAZING Danielle! You did it!", "That deserves a treat!", "WOOO! Lollie is doing zoomies!"];
const PUG_ENCOURAGE = ["Stay pawsitive!", "You're paw-some, Danielle!", "Fur real, you're doing great!"];
function rand(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function TasksView({
  completedResetTasks, badDayMode, badDayCompletedTasks,
  onToggleResetTask, onActivateBadDay, onDeactivateBadDay,
  currentSectionId, dayProgress, getSectionProgress,
  tasks, setTasks, onMoodChange, playSound, onStreakUpdate,
}: TasksViewProps) {
  const [showCustomTasks, setShowCustomTasks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const customTasksRef = useRef<HTMLDivElement>(null);
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
    onMoodChange("love", "Ooh, a new task! Exciting!");
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
        setTimeout(() => onMoodChange("happy", rand(PUG_ENCOURAGE)), 3000);
      }
      return updated;
    });
  }, [setTasks, playSound, onMoodChange]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    playSound("task-delete");
    onMoodChange("sad", "Bye bye task...");
  }, [setTasks, playSound, onMoodChange]);

  const editTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, [setTasks]);

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

  // ── Bad Day Mode ──
  if (badDayMode) {
    return (
      <div className="space-y-3 animate-slide-up">
        <BadDayMode
          completedTasks={badDayCompletedTasks}
          onToggleTask={onToggleResetTask}
          onDeactivate={onDeactivateBadDay}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-slide-up">
      {/* Weekly Focus */}
      <WeeklyFocus />

      {/* Day Progress */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex-1 h-2.5 rounded-full bg-purple-900/50 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full"
            animate={{ width: `${dayProgress.percent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs font-bold text-purple-300">{dayProgress.percent}%</span>
      </div>

      {/* Reset Sections */}
      <div className="space-y-2">
        {RESET_SECTIONS.filter((s) => s.id !== "daily-win").map((section) => (
          <ResetSection
            key={section.id}
            section={section}
            completedTasks={completedResetTasks}
            onToggleTask={(taskId) => {
              onToggleResetTask(taskId);
              playSound("task-complete");
            }}
            isCurrentSection={section.id === currentSectionId}
            sectionProgress={getSectionProgress(section.id as ResetSectionId)}
          />
        ))}
      </div>

      {/* Daily Win Check */}
      <DailyWinCheck
        completedTasks={completedResetTasks}
        onToggle={(taskId) => {
          onToggleResetTask(taskId);
          playSound("sparkle");
        }}
      />

      {/* Bad Day Button */}
      <motion.button
        onClick={onActivateBadDay}
        className="w-full py-3 rounded-2xl bg-purple-900/20 border border-purple-500/15 text-xs font-bold text-purple-400 active:bg-purple-800/30 transition-all"
        whileTap={{ scale: 0.98 }}
      >
        💜 Having a bad day? Switch to survival mode
      </motion.button>

      {/* FAB — quick add custom task */}
      <motion.button
        className="fab-button"
        whileTap={{ scale: 0.88 }}
        onClick={() => {
          if (!showCustomTasks) setShowCustomTasks(true);
          setTimeout(() => customTasksRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
          if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(8);
        }}
        aria-label="Add custom task"
      >
        +
      </motion.button>

      {/* Custom Tasks Section (collapsible) */}
      <div ref={customTasksRef} className="border-t border-purple-500/15 pt-3">
        <button
          onClick={() => setShowCustomTasks(!showCustomTasks)}
          className="w-full flex items-center justify-between px-2 py-2"
        >
          <span className="text-xs font-bold text-purple-300">Custom Tasks ({tasks.length})</span>
          <span className="text-purple-400 text-xs">{showCustomTasks ? "▲" : "▼"}</span>
        </button>

        {showCustomTasks && (
          <div className="space-y-3 mt-2">
            <AddTaskForm onAdd={addTask} />

            {tasks.length > 0 && (
              <>
                <GlassCard className="p-4"><ProgressBone completed={tasks.filter(t => t.completed).length} total={tasks.length} /></GlassCard>

                <GlassCard className="p-3">
                  <FilterBar
                    activeCategory={activeCategory} activePriority={activePriority}
                    showCompleted={showCompleted} sortBy={sortBy}
                    onCategoryChange={setActiveCategory} onPriorityChange={setActivePriority}
                    onShowCompletedChange={setShowCompleted} onSortChange={setSortBy} taskCounts={taskCounts}
                  />
                </GlassCard>
              </>
            )}

            <div className="space-y-2.5">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task, i) => (
                  <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} index={i} />
                ))}
              </AnimatePresence>

              {tasks.length === 0 && (
                <p className="text-center text-xs text-purple-400 py-4">No custom tasks yet. Add one above!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
