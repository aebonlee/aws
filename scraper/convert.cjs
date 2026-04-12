const fs = require('fs');

const qs = JSON.parse(fs.readFileSync('D:/dreamit-web/aws/scraper/output/aif-c01.json', 'utf-8'));

function escapeTs(s) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '')
    .replace(/\t/g, ' ');
}

const lines = [
  "import type { PracticeQuestion } from '../quizData'",
  '',
  'export const aifC01Questions: PracticeQuestion[] = [',
];

for (const q of qs) {
  const question = escapeTs(q.question);
  const explanation = escapeTs(q.explanation || '');
  const opts = q.options.map(o => "'" + escapeTs(o) + "'").join(', ');

  // Handle multi-select (array) and single answers
  let answer;
  if (Array.isArray(q.answer)) {
    answer = `[${q.answer.join(', ')}]`;
  } else {
    answer = q.answer < 0 ? 0 : q.answer;
  }

  // Build optional English fields
  let extra = '';
  if (q.questionEn) {
    extra += `, questionEn: '${escapeTs(q.questionEn)}'`;
  }
  if (q.optionsEn && q.optionsEn.length > 0) {
    const optsEn = q.optionsEn.map(o => "'" + escapeTs(o) + "'").join(', ');
    extra += `, optionsEn: [${optsEn}]`;
  }

  lines.push(`  { categoryId: '${q.categoryId || 'unknown'}', question: '${question}', options: [${opts}], answer: ${answer}, explanation: '${explanation}'${extra} },`);
}

lines.push(']');
lines.push('');

fs.writeFileSync('D:/dreamit-web/aws/src/data/practice/aifC01.ts', lines.join('\n'), 'utf-8');
console.log(`${qs.length} questions converted to TypeScript -> src/data/practice/aifC01.ts`);
