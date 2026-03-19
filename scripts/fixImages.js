import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, '../frontend/src/components');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  if (content.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+(\?[^'"\s\\]*)?/g)) {
    content = content.replace(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+(\?[^'"\s\\]*)?/g, (match) => {
      const seed = Math.random().toString(36).substring(7);
      return `https://picsum.photos/seed/${seed}/800/600`;
    });
    changed = true;
  }

  if (content.match(/https:\/\/logo\.clearbit\.com\/[a-zA-Z0-9.-]+/g)) {
    content = content.replace(/https:\/\/logo\.clearbit\.com\/[a-zA-Z0-9.-]+/g, (match) => {
      const seed = Math.random().toString(36).substring(7);
      return `https://picsum.photos/seed/logo_${seed}/200/200`; 
    });
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverse(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  }
}

traverse(dir);
console.log('Replaced all Unsplash and Clearbit images with Picsum placeholders.');
