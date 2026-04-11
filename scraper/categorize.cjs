const fs = require('fs');

const qs = JSON.parse(fs.readFileSync('D:/dreamit-web/aws/scraper/output/aif-c01_all.json', 'utf-8'));

// 사이트 순차 모드 기준: 카테고리별 문제 수 (합계 424)
const CATEGORY_RANGES = [
  { id: 'ai-ml-basics',        name: 'AI와 ML의 기초',              count: 60  },  // Q1~Q60
  { id: 'ml-development',      name: 'ML 개발',                     count: 46  },  // Q61~Q106
  { id: 'sagemaker',           name: 'Amazon SageMaker',            count: 38  },  // Q107~Q144
  { id: 'gen-ai-basics',       name: '생성형 AI 기초',              count: 66  },  // Q145~Q210
  { id: 'prompt-engineering',   name: 'FM 활용과 프롬프트 엔지니어링', count: 72  },  // Q211~Q282
  { id: 'fm-evaluation',       name: 'FM 성능 평가 방법',            count: 61  },  // Q283~Q343
  { id: 'responsible-ai',      name: 'Responsible AI',               count: 37  },  // Q344~Q380
  { id: 'security-governance',  name: '보안, 규정 준수, 거버넌스',    count: 44  },  // Q381~Q424
];

// 카테고리 할당 (순차 번호 기준)
let idx = 0;
let rangeStart = 1;
for (const cat of CATEGORY_RANGES) {
  const rangeEnd = rangeStart + cat.count - 1;
  let assigned = 0;
  for (let i = idx; i < qs.length && assigned < cat.count; i++) {
    qs[i].categoryId = cat.id;
    if (qs[i].answer < 0) qs[i].answer = 0;
    assigned++;
    idx = i + 1;
  }
  console.log(`  ${cat.name}: Q${rangeStart}~Q${rangeEnd} (${assigned}문제)`);
  rangeStart = rangeEnd + 1;
}

// 검증
const stats = {};
for (const q of qs) {
  stats[q.categoryId] = (stats[q.categoryId] || 0) + 1;
}
console.log('\n=== 검증 ===');
let total = 0;
for (const cat of CATEGORY_RANGES) {
  const count = stats[cat.id] || 0;
  const ok = count === cat.count ? 'OK' : 'MISMATCH';
  console.log(`  ${cat.name}: ${count}문제 ${ok}`);
  total += count;
}
console.log(`  합계: ${total}문제`);

// JSON 저장
fs.writeFileSync('D:/dreamit-web/aws/scraper/output/aif-c01_categorized.json',
  JSON.stringify(qs, null, 2), 'utf-8');

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

for (const q of qs) {
  const question = escapeTs(q.question);
  const explanation = escapeTs(q.explanation || '');
  const opts = q.options.map(o => "'" + escapeTs(o) + "'").join(', ');
  const answer = q.answer < 0 ? 0 : q.answer;
  lines.push(`  { categoryId: '${q.categoryId}', question: '${question}', options: [${opts}], answer: ${answer}, explanation: '${explanation}' },`);
}

lines.push(']');
lines.push('');

fs.writeFileSync('D:/dreamit-web/aws/src/data/practice/aifC01.ts', lines.join('\n'), 'utf-8');
console.log(`\nTypeScript 변환 완료: aifC01.ts (${qs.length}문제)`);
