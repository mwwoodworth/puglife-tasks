"use client";

import { useState, useCallback, useEffect } from "react";
import { MoodLevel } from "@/lib/types";
import {
  getTimeOfDay, getGreeting, getTaskCompleteMessage,
  getSectionCompleteMessage, getAllDoneMessage, getBadDayMessage,
  getWaterMessage, getWaterGoalMessage, getMoodResponse,
  getTimeGreetingPrefix,
} from "@/lib/lollie-personality";

interface LollieState {
  message: string;
  isTyping: boolean;
}

export function useLollie() {
  const [state, setState] = useState<LollieState>({
    message: "",
    isTyping: false,
  });

  // Show greeting on mount
  useEffect(() => {
    const ctx = {
      timeOfDay: getTimeOfDay(),
      badDayMode: false,
      streakDays: 0,
      tasksCompletedToday: 0,
      totalTasksToday: 0,
      waterCount: 0,
      waterGoal: 8,
      level: 1,
    };
    showMessage(getGreeting(ctx));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showMessage = useCallback((text: string) => {
    setState({ message: "", isTyping: true });
    // Brief typing animation then show message
    setTimeout(() => {
      setState({ message: text, isTyping: false });
    }, 600);
  }, []);

  const onTaskComplete = useCallback(() => {
    showMessage(getTaskCompleteMessage());
  }, [showMessage]);

  const onSectionComplete = useCallback(() => {
    showMessage(getSectionCompleteMessage());
  }, [showMessage]);

  const onAllDone = useCallback(() => {
    showMessage(getAllDoneMessage());
  }, [showMessage]);

  const onBadDay = useCallback(() => {
    showMessage(getBadDayMessage());
  }, [showMessage]);

  const onWaterDrink = useCallback(() => {
    showMessage(getWaterMessage());
  }, [showMessage]);

  const onWaterGoal = useCallback(() => {
    showMessage(getWaterGoalMessage());
  }, [showMessage]);

  const onMoodLog = useCallback((mood: MoodLevel) => {
    showMessage(getMoodResponse(mood));
  }, [showMessage]);

  const onItemEquip = useCallback((itemName: string) => {
    const msgs = [
      `Ooh, the ${itemName}! Looking fabulous, Danielle!`,
      `*strikes a pose* The ${itemName} is SO cute on me!`,
      `${itemName}? Yes please! Lollie approves!`,
      `Fashion icon status! Love the ${itemName}!`,
    ];
    showMessage(msgs[Math.floor(Math.random() * msgs.length)]);
  }, [showMessage]);

  const onGreeting = useCallback((badDayMode: boolean) => {
    const ctx = {
      timeOfDay: getTimeOfDay(),
      badDayMode,
      streakDays: 0,
      tasksCompletedToday: 0,
      totalTasksToday: 0,
      waterCount: 0,
      waterGoal: 8,
      level: 1,
    };
    showMessage(getGreeting(ctx));
  }, [showMessage]);

  return {
    message: state.message,
    isTyping: state.isTyping,
    showMessage,
    onTaskComplete,
    onSectionComplete,
    onAllDone,
    onBadDay,
    onWaterDrink,
    onWaterGoal,
    onMoodLog,
    onItemEquip,
    onGreeting,
    greetingPrefix: getTimeGreetingPrefix(),
  };
}
