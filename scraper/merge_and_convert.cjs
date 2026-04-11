const fs = require('fs');

// 전체 424문제 로드
const merged = JSON.parse(fs.readFileSync('D:/dreamit-web/aws/scraper/output/aif-c01_all.json', 'utf-8'));
console.log(`Total: ${merged.length} questions`);

// 전체 JSON 저장
fs.writeFileSync('D:/dreamit-web/aws/scraper/output/aif-c01_all.json', JSON.stringify(merged, null, 2), 'utf-8');
console.log(`Saved aif-c01_all.json (${merged.length} questions)`);

// TypeScript 변환
function escapeTs(s) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .replace(/\t/g, ' ');
}

const lines = [
  "import type { PracticeQuestion } from '../quizData'",
  '',
  'export const aifC01Questions: PracticeQuestion[] = [',
];

for (const q of merged) {
  const question = escapeTs(q.question);
  const explanation = escapeTs(q.explanation || '');
  const opts = q.options.map(o => "'" + escapeTs(o) + "'").join(', ');
  const answer = q.answer < 0 ? 0 : q.answer;
  lines.push(`  { categoryId: 'aif-c01', question: '${question}', options: [${opts}], answer: ${answer}, explanation: '${explanation}' },`);
}

lines.push(']');
lines.push('');

fs.writeFileSync('D:/dreamit-web/aws/src/data/practice/aifC01.ts', lines.join('\n'), 'utf-8');
console.log(`Converted to TypeScript -> aifC01.ts (${merged.length} questions)`);
