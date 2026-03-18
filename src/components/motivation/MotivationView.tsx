"use client";

import { StreakData } from "@/lib/types";
import DailyAffirmation from "./DailyAffirmation";
import EncouragementWall from "./EncouragementWall";
import StreakDisplay from "./StreakDisplay";

interface MotivationViewProps {
  streak: StreakData;
}

export default function MotivationView({ streak }: MotivationViewProps) {
  return (
    <div className="space-y-3 animate-slide-up">
      <DailyAffirmation />
      <StreakDisplay streak={streak} />
      <EncouragementWall />
    </div>
  );
}
