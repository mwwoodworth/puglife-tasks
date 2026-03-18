export const PUG_IDLE_MESSAGES = [
  "Waiting for tasks... *snores adorably*",
  "No tasks? Time for a nap! 💤",
  "This pug is ready for action! Add a task!",
  "All clear! I'll just sit here looking cute.",
  "Empty list = treat time? 🥺",
  "No tasks means more belly rub time!",
  "I believe in you! Let's get productive!",
  "*tilts head* What are we doing today?",
];

export const PUG_BUSY_MESSAGES = [
  "You've got this! I believe in you!",
  "Look at you being productive! 🌟",
  "Working hard or hardly working? JK you're amazing!",
  "So many things to do! Exciting!",
  "I'll supervise from here. *sits importantly*",
  "Every task is a chance for a celebration treat!",
  "You're on fire today! *grabs tiny fire extinguisher*",
  "Productivity level: MAXIMUM PUG ENERGY!",
];

export const PUG_COMPLETE_MESSAGES = [
  "AMAZING! You did it! 🎉",
  "That deserves a treat! 🍖",
  "You're the goodest human! 🏆",
  "WOOO! *happy zoomies* 💨",
  "Task crushed! You're unstoppable!",
  "Another one bites the dust! 🎵",
  "I'm SO proud of you! *wags tail furiously*",
  "YES! Gold star! And a treat!",
  "You're basically a superhero now!",
  "INCREDIBLE! *does a little dance*",
];

export const PUG_ALL_DONE_MESSAGES = [
  "ALL DONE! You're a legend! 👑",
  "Everything complete! Time for snuggles!",
  "Zero tasks left! You're a productivity queen! 💅",
  "All finished! I'm giving you an A+ 🌟",
  "PERFECT! Now let's celebrate with treats!",
  "You cleared the whole list! I'm speechless!",
];

export const PUG_ENCOURAGEMENTS = [
  "You've got pug-tential!",
  "Stay pawsitive!",
  "You're paw-some!",
  "Fur real, you're doing great!",
  "Don't stop retrieving... your goals!",
  "Paws and reflect on how far you've come!",
  "You're the leader of the pack!",
  "Howl yeah, let's do this!",
];

export const PUG_WEIGHT_MESSAGES = [
  "Every step counts! You're doing amazing!",
  "The pug is SO proud of your dedication!",
  "Progress isn't always linear, and that's okay!",
  "You're taking care of yourself and that's beautiful!",
  "Healthy looks different on everyone. You're perfect.",
  "Keep going! The pug believes in you!",
  "Small changes add up to big results!",
  "You showed up today. That's what matters!",
];

export const PUG_WEIGHT_MILESTONE: Record<string, string[]> = {
  "five-lbs": [
    "5 pounds down! The pug is doing a happy dance!",
    "Five pounds lighter! Time for a celebration zoomie!",
  ],
  "ten-lbs": [
    "TEN POUNDS! That's like a whole bag of dog treats!",
    "Double digits! The pug can't contain the excitement!",
  ],
  "halfway": [
    "HALFWAY THERE! You're crushing it!",
    "The halfway point! ALL the high-fives!",
  ],
  "goal-reached": [
    "YOU DID IT! GOAL REACHED! The pug is crying happy tears!",
    "GOAL ACHIEVED! You absolute legend! Party time!",
  ],
  "new-low": [
    "New all-time low! You're making history!",
    "New record! The pug is so proud it could burst!",
  ],
};

export const PUG_WEIGHT_LOG_MESSAGES = [
  "Logged! The pug is keeping track for you!",
  "Another entry! Consistency is queen!",
  "Data point captured! The pug loves data!",
  "Noted! Every log is a victory!",
];

export const PUG_MOTIVATION_MESSAGES = [
  "Welcome to your happy place! 💜",
  "Time for some good vibes!",
  "The pug has wisdom to share!",
  "Breathe in sparkles, breathe out doubt!",
];

export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getPugMoodEmoji(total: number, completed: number): string {
  if (total === 0) return "😴";
  const ratio = completed / total;
  if (ratio === 1) return "🥳";
  if (ratio >= 0.75) return "🤩";
  if (ratio >= 0.5) return "😊";
  if (ratio >= 0.25) return "🐶";
  return "👀";
}
