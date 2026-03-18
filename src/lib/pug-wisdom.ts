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
  "You're on fire today! 🔥 (Don't worry, I called the fire department)",
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
  "YES! Gold star! ⭐ And a treat!",
  "You're basically a superhero now! 🦸‍♀️",
  "INCREDIBLE! *does a little dance*",
];

export const PUG_ALL_DONE_MESSAGES = [
  "ALL DONE! You're a legend! 👑",
  "Everything complete! Time for snuggles!",
  "Zero tasks left! You're a productivity queen! 💅",
  "All finished! I'm giving you an A+ 🌟",
  "PERFECT! Now let's celebrate with treats!",
  "You cleared the whole list! I'm speechless! (rare for a pug)",
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

export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getPugMoodEmoji(
  totalTasks: number,
  completedTasks: number
): string {
  if (totalTasks === 0) return "😴"; // sleeping
  const ratio = completedTasks / totalTasks;
  if (ratio === 1) return "🥳"; // all done party
  if (ratio >= 0.75) return "🤩"; // almost there
  if (ratio >= 0.5) return "😊"; // halfway
  if (ratio >= 0.25) return "🐶"; // working on it
  return "👀"; // just getting started
}
