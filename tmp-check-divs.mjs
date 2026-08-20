import fs from 'node:fs';
const line = fs.readFileSync('client/src/pages/Home.tsx', 'utf8').split('\n')[156];
const tags = [...line.matchAll(/<\/?div\b[^>]*>|<\/?CardContent\b[^>]*>/g)];
let depth = 0;
for (const match of tags) {
  const tag = match[0];
  if (tag.startsWith('</')) depth -= 1; else depth += 1;
  console.log(String(match.index).padStart(5), String(depth).padStart(3), tag.slice(0, 90));
}
console.log({ depth });
