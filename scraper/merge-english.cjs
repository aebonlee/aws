const fs = require('fs');
const path = require('path');

const existing = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'aif-c01_with_explanation.json'), 'utf8'));
let tsContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'practice', 'aifC01.ts'), 'utf8');

// Get questions that have English data (first 424 only = aifC01.ts range)
const withEn = existing.slice(0, 424).filter(q => q.questionEn);
console.log('English data available:', withEn.length);

let count = 0;
withEn.forEach(q => {
  const searchText = q.question.substring(0, 40);
  const idx = tsContent.indexOf(searchText);
  if (idx === -1) return;

  // Find the end of this object line: "}, " or "},\n"
  const lineEnd = tsContent.indexOf('},', idx);
  if (lineEnd === -1) return;

  const line = tsContent.substring(idx, lineEnd);

  // Skip if already has questionEn
  if (line.includes('questionEn:')) return;

  // Escape for TS
  const esc = s => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  const enQuestion = esc(q.questionEn);
  const enOptions = q.optionsEn.map(o => "'" + esc(o) + "'").join(', ');

  // Insert before the closing },
  const insertStr = `, questionEn: '${enQuestion}', optionsEn: [${enOptions}]`;

  // Find the last ' },' pattern for this entry
  const closingIdx = tsContent.lastIndexOf(' }', lineEnd);
  if (closingIdx === -1 || closingIdx < idx) return;

  tsContent = tsContent.substring(0, closingIdx) + insertStr + tsContent.substring(closingIdx);
  count++;
});

console.log('Updated in TS:', count);
fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'practice', 'aifC01.ts'), tsContent, 'utf8');
console.log('aifC01.ts saved');
