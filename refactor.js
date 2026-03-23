const fs = require('fs');
const path = require('path');

const emojiToIcon = {
  "🌅": "Sunrise",
  "☕": "Coffee",
  "🧺": "ShoppingBasket",
  "✨": "Sparkles",
  "☀️": "Sun",
  "⏱️": "Timer",
  "🍽️": "Utensils",
  "🌇": "Sunset",
  "🍳": "CookingPot",
  "🛋️": "Sofa",
  "📋": "ClipboardList",
  "🍝": "ChefHat",
  "👩‍🍳": "ChefHat",
  "👶": "Baby",
  "🫧": "Droplets",
  "🌙": "Moon",
  "🧸": "PackageOpen",
  "🏆": "Trophy",
  "💜": "Heart",
  "🍕": "Pizza",
  "🍗": "Drumstick",
  "💧": "Droplet",
  "🥤": "CupSoda",
  "🍫": "Candy",
  "🍺": "Beer",
  "🍷": "WineGlass",
  "🍹": "GlassWater",
  "🥃": "Martini",
  "🤩": "Star",
  "😊": "Smile",
  "😐": "Meh",
  "😔": "Frown",
  "😢": "Frown",
  "💎": "Gem",
  "🚿": "ShowerHead",
  "🛏️": "Bed",
  "🐾": "PawPrint",
  "🦴": "Bone",
  "🍖": "Drumstick",
  "💨": "Wind",
  "💖": "Heart",
  "💼": "Briefcase",
  "🛍️": "ShoppingBag",
  "🏠": "Home",
  "🧘‍♀️": "PersonStanding",
  "🎉": "PartyPopper",
  "🐶": "Dog",
  "✅": "CheckCircle",
  "📊": "BarChart",
  "⭐": "Star"
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // 1. Replace emoji: "..." with icon: "IconName"
  for (const [emoji, iconName] of Object.entries(emojiToIcon)) {
    // Regex to match emoji: "X" or emoji: 'X'
    const regex1 = new RegExp(`emoji:\\s*["']${emoji}["']`, 'g');
    content = content.replace(regex1, `icon: "${iconName}"`);

    // Just in case there are standalone literal emoji fields that were missed
    const regex2 = new RegExp(`"${emoji}"`, 'g');
    content = content.replace(regex2, `"${iconName}"`);
  }

  // Handle any other unmatched emoji defaults by matching the property key
  content = content.replace(/emoji:\s*["']([^"']+)["']/g, (match, p1) => {
    return `icon: "Star"`; // Fallback for any missed emojis
  });

  // 2. Replace type definitions: `emoji: string` with `icon: string`
  content = content.replace(/emoji:\s*string/g, 'icon: string');
  
  // Replace references
  content = content.replace(/\.emoji/g, '.icon');
  
  // Replace {p.emoji} etc in JSX
  // E.g. <span className="text-xl">{btn.icon}</span> -> <DynamicIcon name={btn.icon} className="text-xl" />
  // We'll replace <span>{...icon}</span> with DynamicIcon
  
  let jsxReplaced = false;

  // Match: <span className="something">{something.icon}</span>
  // Output: <DynamicIcon name={something.icon} className="something" />
  content = content.replace(/<span([^>]*)>\s*\{([^}]+)\.icon\}\s*<\/span>/g, (match, attrs, objName) => {
    jsxReplaced = true;
    return `<DynamicIcon name={${objName}.icon}${attrs} />`;
  });

  // Match bare {something.icon} if not in span
  // Just let it be, but if it needs DynamicIcon, we'll try to find it
  content = content.replace(/\{([^}]+)\.icon\}/g, (match, objName) => {
    if (!match.includes('DynamicIcon') && !jsxReplaced) {
      // It might be inside another element, so we replace it with <DynamicIcon name={objName.icon} />
      // But only if we are in a TSX file that seems to render it
      if (filePath.endsWith('.tsx')) {
        jsxReplaced = true;
        return `<DynamicIcon name={${objName}.icon} className="w-5 h-5" />`;
      }
    }
    return match;
  });

  if (jsxReplaced && !content.includes('DynamicIcon')) {
    // Inject import at the top
    let importStatement = `import { DynamicIcon } from "@/components/ui/DynamicIcon";\n`;
    if (!content.includes('@/components/ui/DynamicIcon')) {
      content = importStatement + content;
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated: ${filePath}`);
  }
}

processDirectory('/home/matt-woodworth/dev/puglife-tasks/src');
console.log('Done!');
