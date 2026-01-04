const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IGNORE = ['node_modules', '.git'];

function shouldProcess(file) {
  const exts = ['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.json', '.md', '.cjs', '.env'];
  return exts.includes(path.extname(file));
}

function stripComments(content) {
  
  let out = content.replace(/\/\*[\s\S]*?\*\//g, '');
  
  out = out.replace(/(^|[^:\\])\/\/.*$/gm, '$1');
  return out;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && shouldProcess(full)) {
      try {
        const content = fs.readFileSync(full, 'utf8');
        const stripped = stripComments(content);
        if (stripped !== content) {
          fs.writeFileSync(full, stripped, 'utf8');
          console.log('Stripped comments:', full);
        }
      } catch (e) {
        console.error('Failed to process', full, e.message);
      }
    }
  }
}

walk(ROOT);
console.log('Done stripping comments.');
