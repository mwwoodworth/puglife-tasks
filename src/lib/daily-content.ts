import { DailyMotivation } from "./types";

const AFFIRMATIONS: DailyMotivation[] = [
  { quote: "You are loved more than you know, Danielle. You deserve every good thing coming your way.", author: "Lollie", category: "self-love" },
  { quote: "Every big journey starts with a tiny paw step. You've already begun.", author: "Lollie", category: "persistence" },
  { quote: "You don't have to be perfect. You just have to be you. And you is pretty amazing.", author: "Lollie", category: "encouragement" },
  { quote: "Your body is your home. Treat it with the same love you give everyone else.", author: "Lollie", category: "self-love" },
  { quote: "Progress isn't always visible, but it's always happening. Trust the process.", author: "Lollie", category: "persistence" },
  { quote: "You are stronger than you think, braver than you feel, and more beautiful than you imagine.", author: "Lollie", category: "strength" },
  { quote: "Rest is not lazy. Rest is productive. Even pugs need naps.", author: "Lollie", category: "self-love" },
  { quote: "Comparison is the thief of joy. Your journey is uniquely yours.", author: "Lollie", category: "encouragement" },
  { quote: "The fact that you're trying makes you incredible. Never forget that.", author: "Lollie", category: "persistence" },
  { quote: "Be gentle with yourself. You're doing the best you can, and that's enough.", author: "Lollie", category: "self-love" },
  { quote: "Setbacks aren't failures. They're just plot twists in your success story.", author: "Lollie", category: "persistence" },
  { quote: "You radiate sunshine. The world is brighter because you're in it.", author: "Lollie", category: "encouragement" },
  { quote: "Your worth is not measured by a number on a scale or tasks on a list.", author: "Lollie", category: "self-love" },
  { quote: "Celebrate every tiny win. They add up to something magnificent.", author: "Lollie", category: "encouragement" },
  { quote: "You are not behind. You are exactly where you need to be.", author: "Lollie", category: "self-love" },
  { quote: "The only workout you'll regret is the one you didn't do. But also, naps count.", author: "Lollie", category: "humor" },
  { quote: "Strength doesn't come from what you can do. It comes from overcoming what you thought you couldn't.", author: "Lollie", category: "strength" },
  { quote: "You are allowed to take up space. You are allowed to be loud. You are allowed to shine.", author: "Lollie", category: "self-love" },
  { quote: "Every day is a fresh start. Yesterday is gone. Today is yours.", author: "Lollie", category: "encouragement" },
  { quote: "The pug believes in you even when you don't believe in yourself.", author: "Lollie", category: "encouragement" },
  { quote: "Slow progress is still progress. Even a snail reaches its destination.", author: "Lollie", category: "persistence" },
  { quote: "You are worthy of love, happiness, and all the good things in life.", author: "Lollie", category: "self-love" },
  { quote: "Your potential is limitless. Don't let anyone (including yourself) tell you otherwise.", author: "Lollie", category: "strength" },
  { quote: "It's okay to not be okay. It's okay to ask for help. It's okay to rest.", author: "Lollie", category: "self-love" },
  { quote: "Look at how far you've come! That's something to be proud of.", author: "Lollie", category: "encouragement" },
  { quote: "Drink your water. Do your stretches. Tell yourself something nice. Repeat.", author: "Lollie", category: "self-love" },
  { quote: "Not every day will be your best day. But every day has something good in it.", author: "Lollie", category: "encouragement" },
  { quote: "Strong looks different on everyone. Your version of strong is beautiful.", author: "Lollie", category: "strength" },
  { quote: "You're not just surviving. You're building a life you love, one day at a time.", author: "Lollie", category: "persistence" },
  { quote: "The universe didn't make a mistake when it made you. You are exactly right.", author: "Lollie", category: "self-love" },
  { quote: "Discipline is choosing between what you want now and what you want most.", author: "Lollie", category: "strength" },
  { quote: "Your smile could light up the whole room. Use it generously.", author: "Lollie", category: "encouragement" },
  { quote: "Fall seven times, stand up eight. That's the pug way.", author: "Lollie", category: "persistence" },
  { quote: "The best project you'll ever work on is yourself.", author: "Lollie", category: "self-love" },
  { quote: "Magic happens outside your comfort zone. But snacks help.", author: "Lollie", category: "humor" },
  { quote: "You have survived 100% of your worst days. That's a perfect record.", author: "Lollie", category: "strength" },
  { quote: "Don't rush the process. Good things take time. Like training a pug.", author: "Lollie", category: "humor" },
  { quote: "You matter. Your feelings matter. Your goals matter. You. Matter.", author: "Lollie", category: "self-love" },
  { quote: "Today's effort is tomorrow's result. Keep planting those seeds.", author: "Lollie", category: "persistence" },
  { quote: "You are more than enough. Actually, you're kind of everything.", author: "Lollie", category: "self-love" },
  { quote: "Start where you are. Use what you have. Do what you can.", author: "Lollie", category: "encouragement" },
  { quote: "Small steps every day lead to massive results over time.", author: "Lollie", category: "persistence" },
  { quote: "Your body heard everything your mind said. Talk kindly to yourself.", author: "Lollie", category: "self-love" },
  { quote: "Don't count the days. Make the days count.", author: "Lollie", category: "encouragement" },
  { quote: "Inhale confidence. Exhale doubt. Repeat until fabulous.", author: "Lollie", category: "strength" },
  { quote: "You are the author of your own story. Make it a page-turner.", author: "Lollie", category: "encouragement" },
  { quote: "Champions aren't made in gyms. Champions are made from something deep inside.", author: "Lollie", category: "strength" },
  { quote: "Life is tough, darling. But so are you.", author: "Lollie", category: "strength" },
  { quote: "Your glow-up is happening right now, even if you can't see it yet.", author: "Lollie", category: "encouragement" },
  { quote: "Be the energy you want to attract. Be sparkly. Be purple. Be you.", author: "Lollie", category: "self-love" },
  { quote: "Exercise: because punching people is frowned upon.", author: "Lollie", category: "humor" },
  { quote: "Three things you can control: your effort, your attitude, and how many treats you give the pug.", author: "Lollie", category: "humor" },
  { quote: "You didn't come this far to only come this far.", author: "Lollie", category: "persistence" },
  { quote: "Rome wasn't built in a day. Neither was a six pack. But consistency works miracles.", author: "Lollie", category: "persistence" },
  { quote: "Believe in yourself as much as this pug believes in treats.", author: "Lollie", category: "humor" },
  { quote: "You have the same hours in a day as Beyonce. Also as a pug. Choose your inspiration.", author: "Lollie", category: "humor" },
  { quote: "Embrace the glorious mess that you are.", author: "Lollie", category: "self-love" },
  { quote: "What if I told you that you are already becoming the person you dream of being?", author: "Lollie", category: "encouragement" },
  { quote: "Success isn't linear. Some days are step forwards. Some are rest days. Both are valid.", author: "Lollie", category: "persistence" },
  { quote: "You are sunshine mixed with a little hurricane. And that's beautiful.", author: "Lollie", category: "strength" },
];

export const ENCOURAGEMENT_WALL = [
  { message: "Strong is beautiful", emoji: "💪" },
  { message: "Progress not perfection", emoji: "🌟" },
  { message: "You are enough", emoji: "💜" },
  { message: "One day at a time", emoji: "🐾" },
  { message: "Be your own kind of beautiful", emoji: "🦋" },
  { message: "Believe in your sparkle", emoji: "✨" },
  { message: "You've got this", emoji: "🔥" },
  { message: "Self love is the best love", emoji: "💖" },
  { message: "Keep going queen", emoji: "👑" },
  { message: "Trust your journey", emoji: "🌈" },
  { message: "Breathe and believe", emoji: "🧘‍♀️" },
  { message: "Dream big, start small", emoji: "⭐" },
  { message: "Today is your day", emoji: "🌸" },
  { message: "Radiate positivity", emoji: "☀️" },
  { message: "You are magic", emoji: "🪄" },
  { message: "Stay pawsitive", emoji: "🐶" },
  { message: "Glow from within", emoji: "🌙" },
  { message: "Create your own sunshine", emoji: "🌻" },
  { message: "Unstoppable", emoji: "💨" },
  { message: "Born to sparkle", emoji: "💎" },
];

export const STREAK_MILESTONES = [
  { days: 3, message: "3 days! Lollie is impressed, Danielle!", animation: "bounce" as const },
  { days: 7, message: "ONE WHOLE WEEK! Lollie says you're a legend!", animation: "spin" as const },
  { days: 14, message: "Two weeks strong! Lollie is doing zoomies!", animation: "confetti" as const },
  { days: 30, message: "30 DAYS! Lollie crowns you queen!", animation: "fireworks" as const },
  { days: 60, message: "60 days! Lollie is crying happy tears!", animation: "crown" as const },
  { days: 100, message: "100 DAYS! ULTRA LOLLIE MODE ACTIVATED!", animation: "rainbow" as const },
  { days: 365, message: "A WHOLE YEAR! Lollie and Danielle are legends!", animation: "epic" as const },
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

export function getDailyAffirmation(): DailyMotivation {
  return AFFIRMATIONS[getDayOfYear() % AFFIRMATIONS.length];
}

export function getEncouragementWall() {
  return ENCOURAGEMENT_WALL;
}
