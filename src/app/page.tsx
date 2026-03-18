"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task, AppTab, PugMood, SoundEffect } from "@/lib/types";
import { loadTasks, saveTasks, updateStreak, getStreak, loadActiveTab, saveActiveTab } from "@/lib/storage";
import {
  PUG_IDLE_MESSAGES, PUG_ENCOURAGEMENTS, PUG_WEIGHT_MESSAGES,
  PUG_MOTIVATION_MESSAGES, getRandomMessage,
} from "@/lib/pug-wisdom";
import { useSound } from "@/hooks/useSound";

import AnimatedPug from "@/components/pug/AnimatedPug";
import TabBar from "@/components/TabBar";
import SparkleEffect from "@/components/ui/SparkleEffect";
import SoundToggle from "@/components/ui/SoundToggle";
import DashboardView from "@/components/dashboard/DashboardView";
import TasksView from "@/components/tasks/TasksView";
import WeightView from "@/components/weight/WeightView";
import MotivationView from "@/components/motivation/MotivationView";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>("dashboard");
  const [pugMood, setPugMood] = useState<PugMood>("sleeping");
  const [pugMessage, setPugMessage] = useState("Loading... *yawns*");
  const [streak, setStreak] = useState(getStreak());
  const [isLoaded, setIsLoaded] = useState(false);
  const { muted, toggleMute, play } = useSound();

  // Load on mount
  useEffect(() => {
    setTasks(loadTasks());
    setStreak(getStreak());
    const savedTab = loadActiveTab();
    setActiveTab(savedTab);
    setIsLoaded(true);
  }, []);

  // Save tasks on change
  useEffect(() => {
    if (isLoaded) saveTasks(tasks);
  }, [tasks, isLoaded]);

  // Update pug mood based on context
  useEffect(() => {
    if (!isLoaded) return;
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;

    if (pugMood === "sleeping" || pugMood === "idle") {
      if (total === 0) {
        setPugMood("sleeping");
        setPugMessage(getRandomMessage(PUG_IDLE_MESSAGES));
      } else if (completed === total) {
        setPugMood("celebrating");
        setPugMessage("ALL DONE! Danielle, you're a legend!");
      } else if (completed > 0) {
        setPugMood("happy");
        setPugMessage(getRandomMessage(PUG_ENCOURAGEMENTS));
      } else {
        setPugMood("idle");
        setPugMessage(getRandomMessage(PUG_ENCOURAGEMENTS));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, isLoaded]);

  const handleTabChange = useCallback((tab: AppTab) => {
    setActiveTab(tab);
    saveActiveTab(tab);
    play("tab-switch");

    const tabMessages: Record<AppTab, { mood: PugMood; getMessage: () => string }> = {
      dashboard: { mood: "happy", getMessage: () => "Welcome home, Danielle!" },
      tasks: { mood: "idle", getMessage: () => getRandomMessage(PUG_ENCOURAGEMENTS) },
      weight: { mood: "happy", getMessage: () => getRandomMessage(PUG_WEIGHT_MESSAGES) },
      motivation: { mood: "love", getMessage: () => getRandomMessage(PUG_MOTIVATION_MESSAGES) },
    };
    const config = tabMessages[tab];
    setPugMood(config.mood);
    setPugMessage(config.getMessage());
  }, [play]);

  const handleMoodChange = useCallback((mood: string, message: string) => {
    setPugMood(mood as PugMood);
    setPugMessage(message);
  }, []);

  const handleStreakUpdate = useCallback(() => {
    const updated = updateStreak();
    setStreak(updated);
  }, []);

  const handlePlaySound = useCallback((effect: SoundEffect) => {
    play(effect);
  }, [play]);

  const handlePugClick = useCallback(() => {
    play("pug-toot");
    setPugMood("excited");
    setPugMessage("*TOOT* Hehe excuse me, Danielle!");
    setTimeout(() => {
      setPugMood("happy");
      setPugMessage(getRandomMessage(PUG_ENCOURAGEMENTS));
    }, 2500);
  }, [play]);

  const handleDailyReset = useCallback(() => {
    setTasks((prev) => prev.map((t) => ({ ...t, completed: false, completedAt: undefined })));
    setPugMood("excited");
    setPugMessage("Fresh day! Let's crush it, Danielle!");
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <motion.span className="text-6xl block mb-3" animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 1, repeat: Infinity }}>
            🐶
          </motion.span>
          <p className="text-purple-300 font-bold">Loading Lollie Life...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh relative">
      <SparkleEffect />
      <SoundToggle muted={muted} onToggle={toggleMute} />

      <div className="relative z-10 max-w-lg mx-auto px-4 pt-4 pb-safe">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2"
        >
          <div className="flex items-center justify-center gap-2">
            <motion.span className="text-xl" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>🐾</motion.span>
            <h1 className="text-2xl sm:text-3xl font-black gradient-text-sparkle">Lollie Life</h1>
            <motion.span className="text-xl" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>🐾</motion.span>
          </div>
          <p className="text-[11px] text-purple-400 font-medium mt-0.5">
            Danielle&apos;s sparkly life companion
          </p>
        </motion.header>

        {/* Animated Pug */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center mb-3"
        >
          <AnimatedPug mood={pugMood} size={130} onClick={handlePugClick} />
          {/* Speech bubble */}
          <AnimatePresence mode="wait">
            <motion.div
              key={pugMessage}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="glass-card rounded-2xl px-4 py-2 max-w-[280px] text-center mt-1 relative"
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-800/40 rotate-45 border-l border-t border-purple-400/20" />
              <p className="text-xs font-semibold text-purple-200 relative z-10">{pugMessage}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" && (
              <DashboardView
                tasks={tasks}
                onMoodChange={handleMoodChange}
                playSound={handlePlaySound}
                onDailyReset={handleDailyReset}
              />
            )}
            {activeTab === "tasks" && (
              <TasksView
                tasks={tasks}
                setTasks={setTasks}
                onMoodChange={handleMoodChange}
                playSound={handlePlaySound}
                onStreakUpdate={handleStreakUpdate}
              />
            )}
            {activeTab === "weight" && (
              <WeightView
                onMoodChange={handleMoodChange}
                playSound={handlePlaySound}
              />
            )}
            {activeTab === "motivation" && (
              <MotivationView streak={streak} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center mt-8 mb-4">
          <p className="text-[10px] text-purple-500 font-medium">Made with all the love for Danielle</p>
          <p className="text-[9px] text-purple-600 mt-0.5">From Lollie (and Matt) with snuggles</p>
        </motion.footer>
      </div>

      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
