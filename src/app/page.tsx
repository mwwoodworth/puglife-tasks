"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task, AppTab, PugMood, SoundEffect, MoodLevel, AlcoholDrinkType } from "@/lib/types";
import { loadTasks, saveTasks, updateStreak, getStreak, loadActiveTab, saveActiveTab, loadFavorites, saveFavorites, loadStats, saveStats, migrateV4ToV5 } from "@/lib/storage";
import { PUG_ENCOURAGEMENTS, getRandomMessage } from "@/lib/pug-wisdom";
import { TREAT_VALUES } from "@/lib/rewards-engine";
import { buildSystemPrompt, getTimeOfDay } from "@/lib/chat-context";
import { useSound } from "@/hooks/useSound";
import { useDailyReset } from "@/hooks/useDailyReset";
import { useWaterTracker } from "@/hooks/useWaterTracker";
import { useMoodTracker } from "@/hooks/useMoodTracker";
import { useRewards } from "@/hooks/useRewards";
import { useConfetti } from "@/hooks/useConfetti";
import { useLollie } from "@/hooks/useLollie";
import { useDressUp } from "@/hooks/useDressUp";
import { useChat } from "@/hooks/useChat";
import { useAlcoholTracker } from "@/hooks/useAlcoholTracker";
import { useToast } from "@/hooks/useToast";

import SvgPug from "@/components/dressup/SvgPug";
import LollieSpeechBubble from "@/components/pug/LollieSpeechBubble";
import TreatsCounter from "@/components/rewards/TreatsCounter";
import TabBar from "@/components/TabBar";
import SparkleEffect from "@/components/ui/SparkleEffect";
import BadDayBanner from "@/components/ui/BadDayBanner";
import ToastProvider from "@/components/ui/ToastProvider";
import DashboardView from "@/components/dashboard/DashboardView";
import TasksView from "@/components/tasks/TasksView";
import TrackView from "@/components/track/TrackView";
import RewardsView from "@/components/rewards/RewardsView";
import LollieView from "@/components/lollie/LollieView";

export default function Home() {
  // ── Legacy Tasks ──
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>("dashboard");
  const [pugMood, setPugMood] = useState<PugMood>("sleeping");
  const [streak, setStreak] = useState(getStreak());
  const [isLoaded, setIsLoaded] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // ── Hooks ──
  const { muted, toggleMute, play } = useSound();
  const dailyReset = useDailyReset();
  const water = useWaterTracker();
  const mood = useMoodTracker();
  const rewards = useRewards();
  const confetti = useConfetti();
  const lollie = useLollie();
  const dressUp = useDressUp();
  const chat = useChat();
  const alcohol = useAlcoholTracker();
  const toast = useToast();

  // Ref to track previous water goal state for confetti
  const prevWaterGoalRef = useRef(false);

  // ── Init ──
  useEffect(() => {
    migrateV4ToV5();
    setTasks(loadTasks());
    setStreak(getStreak());
    setActiveTab(loadActiveTab());
    setFavorites(loadFavorites());
    setIsLoaded(true);
  }, []);

  // Save tasks on change
  useEffect(() => {
    if (isLoaded) saveTasks(tasks);
  }, [tasks, isLoaded]);

  // Watch for water goal completion
  useEffect(() => {
    if (water.goalReached && !prevWaterGoalRef.current && water.isLoaded) {
      confetti.waterConfetti();
      lollie.onWaterGoal();
      rewards.earnTreats(TREAT_VALUES.waterGoalHit);
      play("celebration");
      const stats = loadStats();
      stats.waterGoalDays += 1;
      saveStats(stats);
    }
    prevWaterGoalRef.current = water.goalReached;
  }, [water.goalReached, water.isLoaded]);

  // ── Tab change ──
  const handleTabChange = useCallback((tab: AppTab) => {
    setActiveTab(tab);
    saveActiveTab(tab);
    play("tab-switch");
  }, [play]);

  const handleMoodChange = useCallback((mood: string, message: string) => {
    setPugMood(mood as PugMood);
    lollie.showMessage(message);
  }, [lollie]);

  const handleStreakUpdate = useCallback(() => {
    const updated = updateStreak();
    setStreak(updated);
  }, []);

  const handlePlaySound = useCallback((effect: SoundEffect) => {
    play(effect);
  }, [play]);

  // ── Pug click ──
  const handlePugClick = useCallback(() => {
    play("pug-toot");
    setPugMood("excited");
    lollie.showMessage("*TOOT* Hehe excuse me, Danielle!");
    setTimeout(() => {
      setPugMood("happy");
      lollie.showMessage(getRandomMessage(PUG_ENCOURAGEMENTS));
    }, 2500);
  }, [play, lollie]);

  // ── Reset task toggle (with rewards/confetti wiring) ──
  const handleToggleResetTask = useCallback((taskId: string) => {
    if (!dailyReset.state) return;
    const wasCompleted = dailyReset.completedTasks.includes(taskId);
    dailyReset.toggleTask(taskId);

    if (!wasCompleted) {
      play("task-complete");
      confetti.smallBurst();
      rewards.earnTreats(TREAT_VALUES.resetTask);
      toast.show(`+${TREAT_VALUES.resetTask} 🍖`, "success");
      lollie.onTaskComplete();
      setPugMood("celebrating");
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(30);

      setTimeout(() => {
        const updated = dailyReset.completedTasks.concat(taskId);
        const sections = dailyReset.allSections;
        for (const section of sections) {
          const allDone = section.tasks.every((t) => updated.includes(t.id));
          if (allDone) {
            confetti.mediumBurst();
            lollie.onSectionComplete();
            rewards.earnTreats(TREAT_VALUES.resetSectionComplete);
            play("celebration");
            const stats = loadStats();
            stats.resetSectionsCompleted += 1;
            saveStats(stats);
            break;
          }
        }
        const totalTasks = sections.reduce((sum, s) => sum + s.tasks.length, 0);
        if (updated.length >= totalTasks) {
          confetti.bigCelebration();
          lollie.onAllDone();
          rewards.earnTreats(TREAT_VALUES.fullDayComplete);
          play("milestone");
          const stats = loadStats();
          stats.fullDaysCompleted += 1;
          saveStats(stats);
        }
        setPugMood("happy");
      }, 100);
    }
  }, [dailyReset, play, confetti, rewards, lollie]);

  // ── Water ──
  const handleAddDrink = useCallback((type: Parameters<typeof water.addDrink>[0]) => {
    water.addDrink(type);
    play("water-gulp");
    lollie.onWaterDrink();
    rewards.earnTreats(TREAT_VALUES.waterDrink);
    setPugMood("eating");
    setTimeout(() => setPugMood("happy"), 1500);
  }, [water, play, lollie, rewards]);

  const handleRemoveLastDrink = useCallback(() => {
    water.removeLast();
  }, [water]);

  // ── Alcohol ──
  const handleAddAlcoholDrink = useCallback((type: AlcoholDrinkType) => {
    alcohol.addDrink(type);
    play("water-gulp");
    lollie.showMessage("No judgment! Lollie's keeping track for you 💜");
    setPugMood("happy");
  }, [alcohol, play, lollie]);

  const handleRemoveLastAlcoholDrink = useCallback(() => {
    alcohol.removeLast();
  }, [alcohol]);

  // ── Mood ──
  const handleLogMood = useCallback((moodLevel: MoodLevel) => {
    mood.logMood(moodLevel);
    play("sparkle");
    confetti.smallBurst();
    rewards.earnTreats(TREAT_VALUES.moodLog);
    lollie.onMoodLog(moodLevel);
    const stats = loadStats();
    stats.moodLogDays += 1;
    saveStats(stats);

    if (moodLevel <= 2 && !dailyReset.badDayMode) {
      setTimeout(() => {
        lollie.showMessage("Rough day? The survival plan is here if you need it. 💜");
      }, 2000);
    }
  }, [mood, play, confetti, rewards, lollie, dailyReset.badDayMode]);

  // ── Bad Day ──
  const handleActivateBadDay = useCallback(() => {
    dailyReset.activateBadDay();
    lollie.onBadDay();
    play("pug-whimper");
    setPugMood("sad");
    setTimeout(() => setPugMood("love"), 2000);
  }, [dailyReset, lollie, play]);

  const handleDeactivateBadDay = useCallback(() => {
    dailyReset.deactivateBadDay();
    lollie.showMessage("Switching back! You've got this, Danielle!");
    setPugMood("happy");
  }, [dailyReset, lollie]);

  // ── Favorites ──
  const handleToggleFavorite = useCallback((message: string) => {
    setFavorites((prev) => {
      const next = prev.includes(message)
        ? prev.filter((m) => m !== message)
        : [...prev, message];
      saveFavorites(next);
      return next;
    });
  }, []);

  // ── Rewards ──
  const handleEquipOutfit = useCallback((id: string | null) => {
    rewards.equipOutfit(id);
    if (id) play("sparkle");
  }, [rewards, play]);

  const handleUnlockOutfit = useCallback((id: string) => {
    rewards.unlockOutfit(id);
    play("achievement");
    confetti.achievementUnlock();
  }, [rewards, play, confetti]);

  // ── Chat ──
  const handleChatSend = useCallback((content: string) => {
    const systemPrompt = buildSystemPrompt({
      timeOfDay: getTimeOfDay(),
      tasksCompleted: dailyReset.completedTasks.length,
      totalTasks: dailyReset.allSections.reduce((s, sec) => s + sec.tasks.length, 0),
      waterOz: water.totalOz,
      waterGoalOz: water.goalOz,
      todayMood: mood.todayMood?.mood || null,
      streak: streak.current,
      level: rewards.level,
      levelName: rewards.levelProgress?.currentLevel?.name || "Puppy",
      treats: rewards.treats,
      badDayMode: dailyReset.badDayMode,
      equippedItems: Object.values(dressUp.equipped).filter(Boolean) as string[],
    });
    chat.sendMessage(content, systemPrompt);
    play("chat-send");
  }, [dailyReset, water, mood, streak, rewards, dressUp.equipped, chat, play]);

  // ── Dress-Up spend treats ──
  const handleSpendTreats = useCallback((amount: number) => {
    rewards.spendTreats(amount);
  }, [rewards]);

  // ── Level name for header ──
  const levelName = rewards.levelProgress?.currentLevel?.name || "Puppy";

  // ── SVG Pug equipped state (with preview overlay) ──
  const displayEquipped = dressUp.getDisplayEquipped();

  // ── Loading ──
  if (!isLoaded || !dailyReset.isLoaded) {
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
      <ToastProvider toasts={toast.toasts} onDismiss={toast.dismiss} />
      <SparkleEffect />

      <div className="relative z-10 max-w-lg mx-auto px-4 pt-3 pb-safe">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.span className="text-lg" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>🐾</motion.span>
              <h1 className="text-xl font-black gradient-text-sparkle">Lollie Life</h1>
            </div>
            <TreatsCounter count={rewards.treats} level={rewards.level} levelName={levelName} />
          </div>
        </motion.header>

        {/* SVG Pug + Speech Bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center mb-3"
        >
          <SvgPug
            mood={pugMood}
            equipped={displayEquipped}
            size={activeTab === "dashboard" ? 120 : 80}
            onClick={handlePugClick}
            isTalking={chat.isStreaming}
            showParticles={activeTab === "dashboard"}
          />
          <div className="mt-1">
            <LollieSpeechBubble message={lollie.message} isTyping={lollie.isTyping} />
          </div>
        </motion.div>

        {/* Bad Day Banner — persistent across all tabs */}
        {activeTab !== "dashboard" && <BadDayBanner active={dailyReset.badDayMode} />}

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
                completedTasks={dailyReset.completedTasks}
                badDayMode={dailyReset.badDayMode}
                onToggleTask={handleToggleResetTask}
                onActivateBadDay={handleActivateBadDay}
                dayProgress={dailyReset.dayProgress}
                waterPercent={water.percent}
                waterCount={water.count}
                streak={streak.current}
                todayMood={mood.todayMood?.mood || null}
                onLogMood={handleLogMood}
                treats={rewards.treats}
                onSwitchTab={handleTabChange}
                playSound={handlePlaySound}
              />
            )}

            {activeTab === "tasks" && (
              <TasksView
                completedResetTasks={dailyReset.completedTasks}
                badDayMode={dailyReset.badDayMode}
                badDayCompletedTasks={dailyReset.state?.badDayCompletedTasks || []}
                onToggleResetTask={handleToggleResetTask}
                onActivateBadDay={handleActivateBadDay}
                onDeactivateBadDay={handleDeactivateBadDay}
                currentSectionId={dailyReset.currentSection?.id || null}
                dayProgress={dailyReset.dayProgress}
                getSectionProgress={dailyReset.getSectionProgress}
                tasks={tasks}
                setTasks={setTasks}
                onMoodChange={handleMoodChange}
                playSound={handlePlaySound}
                onStreakUpdate={handleStreakUpdate}
              />
            )}

            {activeTab === "track" && (
              <TrackView
                onMoodChange={handleMoodChange}
                playSound={handlePlaySound}
                waterTotalOz={water.totalOz}
                waterGoalOz={water.goalOz}
                waterPercent={water.percent}
                waterCount={water.count}
                waterGoalReached={water.goalReached}
                onAddDrink={handleAddDrink}
                onRemoveLastDrink={handleRemoveLastDrink}
                moodLast30={mood.last30Days()}
                moodWeekAvg={mood.weekAverage()}
                todayMood={mood.todayMood?.mood || null}
                onLogMood={handleLogMood}
                alcoholTodayCount={alcohol.todayCount}
                alcoholLast7Days={alcohol.last7Days}
                onAddAlcoholDrink={handleAddAlcoholDrink}
                onRemoveLastAlcoholDrink={handleRemoveLastAlcoholDrink}
              />
            )}

            {activeTab === "rewards" && rewards.state && (
              <RewardsView
                state={rewards.state}
                onEquipOutfit={handleEquipOutfit}
                onUnlockOutfit={handleUnlockOutfit}
              />
            )}

            {activeTab === "lollie" && (
              <LollieView
                chat={{
                  messages: chat.messages,
                  isStreaming: chat.isStreaming,
                  error: chat.error,
                  onSend: handleChatSend,
                  onClear: chat.clearHistory,
                }}
                wardrobe={{
                  equipped: dressUp.equipped,
                  displayEquipped,
                  unlockedItems: dressUp.unlockedItems,
                  treats: rewards.treats,
                  savedLooks: dressUp.savedLooks,
                  onEquip: dressUp.equipItem,
                  onUnequip: dressUp.unequipSlot,
                  onPurchase: dressUp.purchaseItem,
                  onPreview: dressUp.preview,
                  onSaveLook: dressUp.saveLook,
                  onLoadLook: dressUp.loadLook,
                  onDeleteLook: dressUp.deleteLook,
                  onRandomOutfit: dressUp.randomOutfit,
                  onSpendTreats: handleSpendTreats,
                }}
                settings={{
                  streak,
                  favorites,
                  onToggleFavorite: handleToggleFavorite,
                  muted,
                  onToggleMute: toggleMute,
                }}
                pugMood={pugMood}
                playSound={handlePlaySound}
              />
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
