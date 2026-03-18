export const PUG_IDLE_MESSAGES = [
  "Lollie is waiting for tasks... *snores adorably*",
  "No tasks? Lollie says it's nap time!",
  "Lollie is ready for action, Danielle!",
  "All clear! Lollie will just sit here looking cute.",
  "Empty list = treat time? Lollie thinks so!",
  "No tasks means more Lollie belly rub time!",
  "Lollie believes in you! Let's get productive!",
  "*tilts head* What are we doing today, Danielle?",
];

export const PUG_BUSY_MESSAGES = [
  "Lollie says: You've got this, Danielle!",
  "Look at you being productive! Lollie is impressed!",
  "Working hard? Lollie is supervising from here!",
  "So many things to do! Lollie is excited!",
  "Lollie says: *sits importantly* I'll supervise!",
  "Every task is a chance for a celebration treat!",
  "You're on fire today! Lollie approves!",
  "Productivity level: MAXIMUM LOLLIE ENERGY!",
];

export const PUG_COMPLETE_MESSAGES = [
  "AMAZING! Lollie is SO proud of you, Danielle!",
  "That deserves a treat! Lollie says so!",
  "You're the goodest human! — Love, Lollie",
  "WOOO! Lollie is doing happy zoomies!",
  "Task crushed! Lollie knew you could!",
  "Another one bites the dust! *Lollie celebrates*",
  "Lollie is SO proud! *wags tail furiously*",
  "YES! Gold star! Lollie demands celebration!",
  "Incredible! Lollie is doing a little dance!",
];

export const PUG_ALL_DONE_MESSAGES = [
  "ALL DONE! Danielle, you're a legend! — Lollie",
  "Everything complete! Lollie demands snuggles now!",
  "Zero tasks left! Lollie says you're a queen!",
  "All finished! Lollie gives you an A+",
  "PERFECT! Now Lollie says: celebrate with treats!",
  "You cleared the whole list! Lollie is speechless!",
];

export const PUG_ENCOURAGEMENTS = [
  "Lollie says: You've got pug-tential!",
  "Stay pawsitive! — Lollie",
  "Lollie says: You're paw-some, Danielle!",
  "Fur real, you're doing great! Love, Lollie",
  "Lollie says: Don't stop retrieving your goals!",
  "Paws and reflect on how far you've come!",
  "Lollie says: You're the leader of the pack!",
  "Howl yeah! Lollie is cheering for you!",
  "Lollie's advice: One paw at a time!",
  "Lollie whispers: You're amazing, Danielle.",
];

export const PUG_WEIGHT_MESSAGES = [
  "Lollie says: Every step counts! You're doing amazing!",
  "Lollie is SO proud of your dedication!",
  "Lollie's wisdom: Progress isn't always linear, and that's okay!",
  "Lollie says: You're taking care of yourself and that's beautiful!",
  "Lollie says: Healthy looks different on everyone. You're perfect.",
  "Keep going! Lollie believes in you!",
  "Lollie's advice: Small changes add up to big results!",
  "Lollie says: You showed up today. That's what matters!",
];

export const PUG_WEIGHT_MILESTONE: Record<string, string[]> = {
  "five-lbs": [
    "5 pounds down! Lollie is doing a happy dance!",
    "Five pounds lighter! Lollie demands a celebration zoomie!",
  ],
  "ten-lbs": [
    "TEN POUNDS! Lollie says that's like a whole bag of treats!",
    "Double digits! Lollie can't contain the excitement!",
  ],
  "halfway": [
    "HALFWAY THERE! Lollie is so proud she could burst!",
    "The halfway point! Lollie gives you ALL the high-fives!",
  ],
  "goal-reached": [
    "YOU DID IT! GOAL REACHED! Lollie is crying happy tears!",
    "GOAL ACHIEVED! Lollie says you're an absolute legend!",
  ],
  "new-low": [
    "New all-time low! Lollie says you're making history!",
    "New record! Lollie is so proud she could burst!",
  ],
};

export const PUG_WEIGHT_LOG_MESSAGES = [
  "Logged! Lollie is keeping track for you!",
  "Another entry! Lollie says consistency is queen!",
  "Data point captured! Lollie loves data!",
  "Noted! Lollie says every log is a victory!",
];

export const PUG_MOTIVATION_MESSAGES = [
  "Welcome to your happy place! — Lollie",
  "Lollie says: Time for some good vibes!",
  "Lollie has wisdom to share with you, Danielle!",
  "Lollie says: Breathe in sparkles, breathe out doubt!",
  "Lollie says: You are loved beyond measure.",
];

export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getPugMoodEmoji(total: number, completed: number): string {
  if (total === 0) return "sleeping";
  const ratio = completed / total;
  if (ratio === 1) return "celebrating";
  if (ratio >= 0.75) return "excited";
  if (ratio >= 0.5) return "happy";
  if (ratio >= 0.25) return "idle";
  return "idle";
}
