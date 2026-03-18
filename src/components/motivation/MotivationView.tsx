"use client";

import { StreakData } from "@/lib/types";
import DailyAffirmation from "./DailyAffirmation";
import EncouragementWall from "./EncouragementWall";
import StreakDisplay from "./StreakDisplay";

interface MotivationViewProps {
  streak: StreakData;
  favorites: string[];
  onToggleFavorite: (message: string) => void;
}

export default function MotivationView({ streak, favorites, onToggleFavorite }: MotivationViewProps) {
  return (
    <div className="space-y-3 animate-slide-up">
      <DailyAffirmation />
      <StreakDisplay streak={streak} />
      <EncouragementWall favorites={favorites} onToggleFavorite={onToggleFavorite} />
    </div>
  );
}
