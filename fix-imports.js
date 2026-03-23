const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let originalContent = content;

      if (content.includes('<DynamicIcon') && !content.includes('import { DynamicIcon }')) {
        content = `import { DynamicIcon } from "@/components/ui/DynamicIcon";\n` + content;
      }
      
      // Fix CategoryTabs.tsx which had mapped original `emoji: val.emoji` but now `val.icon` to `emoji` key which conflicts with type `icon: string`
      if (fullPath.includes('CategoryTabs.tsx')) {
        content = content.replace(/emoji: val\.icon/g, 'icon: val.icon');
        // also fix `emoji: "💎"` if it was left over or malformed
        content = content.replace(/emoji:/g, 'icon:');
      }

      // Fix AnimatedPug.tsx
      if (fullPath.includes('AnimatedPug.tsx')) {
        content = content.replace(/emoji: string/g, 'icon: string');
        content = content.replace(/emoji, i/g, 'icon, i');
        content = content.replace(/emoji,/g, 'icon,');
        // It had setParticles(set.map((emoji, i) => ({ id: Date.now() + i, emoji, x: (i - 2) * 22, delay: i * 0.1 })));
        content = content.replace(/set\.map\(\(emoji, i\)/g, 'set.map((icon, i)');
      }

      // Fix SparkleEffect.tsx
      if (fullPath.includes('SparkleEffect.tsx')) {
        content = content.replace(/emoji:/g, 'icon:');
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf-8');
      }
    }
  }
}

processDirectory('/home/matt-woodworth/dev/puglife-tasks/src');
console.log('Fixed imports and specific file issues!');
