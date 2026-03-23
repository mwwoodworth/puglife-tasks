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
      
      // If it starts with the import but has "use client" on line 2, swap them
      if (content.startsWith('import { DynamicIcon } from "@/components/ui/DynamicIcon";\n"use client";')) {
        content = content.replace(
          'import { DynamicIcon } from "@/components/ui/DynamicIcon";\n"use client";',
          '"use client";\nimport { DynamicIcon } from "@/components/ui/DynamicIcon";'
        );
        fs.writeFileSync(fullPath, content, 'utf-8');
      } else if (content.startsWith('import { DynamicIcon } from "@/components/ui/DynamicIcon";\r\n"use client";')) {
        content = content.replace(
          'import { DynamicIcon } from "@/components/ui/DynamicIcon";\r\n"use client";',
          '"use client";\r\nimport { DynamicIcon } from "@/components/ui/DynamicIcon";'
        );
        fs.writeFileSync(fullPath, content, 'utf-8');
      }
    }
  }
}

processDirectory('/home/matt-woodworth/dev/puglife-tasks/src');
console.log('Fixed use client order!');
