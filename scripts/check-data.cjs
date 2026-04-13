const fs = require('fs');
const path = require('path');
const dataDir = 'D:/dreamit-web/aws/data';
const quizDir = 'D:/dreamit-web/aws/data/quiz';

const categories = {
  'ai-ml-fundamentals': { expected: 58, files: [] },
  'ml-development': { expected: 48, files: [] },
  'sagemaker': { expected: 42, files: [] },
  'genai-fundamentals': { expected: 55, files: [] },
  'fm-utilization': { expected: 82, files: [] },
  'fm-evaluation': { expected: 62, files: [] },
  'responsible-ai': { expected: 32, files: [] },
  'security-governance': { expected: 45, files: [] },
};

[dataDir, quizDir].forEach(dir => {
  try {
    fs.readdirSync(dir).forEach(f => {
      if (!f.endsWith('.json')) return;
      const fp = path.join(dir, f);
      try {
        const d = JSON.parse(fs.readFileSync(fp, 'utf8'));
        if (!Array.isArray(d) || d.length === 0) return;
        const catId = d[0].categoryId;
        if (catId && categories[catId]) {
          const ok = d.filter(q => q.answer >= 0 || Array.isArray(q.answer)).length;
          const nums = d.map(q => q.number).sort((a, b) => a - b);
          categories[catId].files.push({
            file: (dir === quizDir ? 'quiz/' : '') + f,
            count: d.length,
            ok,
            min: nums[0],
            max: nums[nums.length - 1]
          });
        }
      } catch (e) {}
    });
  } catch (e) {}
});

console.log('\n========== AIF-C01 데이터 현황 ==========\n');

let totalExpected = 0, totalHave = 0, totalOk = 0;

Object.entries(categories).forEach(([cat, info]) => {
  console.log(`--- ${cat} (필요: ${info.expected}) ---`);
  if (info.files.length === 0) {
    console.log('  !! 파일 없음 !!');
  } else {
    // Merge all numbers across files to find best coverage
    const allNums = new Map(); // number -> best answer
    info.files.forEach(fi => {
      console.log(`  ${fi.file}: ${fi.count}문제 (Q${fi.min}~Q${fi.max}) 정답 ${fi.ok}/${fi.count}`);
      const d = JSON.parse(fs.readFileSync(
        fi.file.startsWith('quiz/') ? path.join(quizDir, fi.file.replace('quiz/', '')) : path.join(dataDir, fi.file),
        'utf8'
      ));
      d.forEach(q => {
        const hasAnswer = q.answer >= 0 || Array.isArray(q.answer);
        const existing = allNums.get(q.number);
        if (!existing || (!existing.hasAnswer && hasAnswer)) {
          allNums.set(q.number, { hasAnswer });
        }
      });
    });
    const covered = allNums.size;
    const withAnswer = [...allNums.values()].filter(v => v.hasAnswer).length;
    const missing = [];
    for (let i = 1; i <= info.expected; i++) {
      if (!allNums.has(i)) missing.push(i);
    }
    const noAnswer = [];
    allNums.forEach((v, k) => { if (!v.hasAnswer) noAnswer.push(k); });
    noAnswer.sort((a, b) => a - b);

    console.log(`  => 커버: ${covered}/${info.expected}, 정답: ${withAnswer}/${covered}`);
    if (missing.length > 0) console.log(`  => 미수집: Q${formatRanges(missing)}`);
    if (noAnswer.length > 0) console.log(`  => 정답누락: Q${noAnswer.join(', Q')}`);
    totalHave += covered;
    totalOk += withAnswer;
  }
  totalExpected += info.expected;
  console.log('');
});

console.log('==========================================');
console.log(`전체: ${totalHave}/${totalExpected} 수집, ${totalOk}/${totalHave} 정답`);
console.log(`미수집: ${totalExpected - totalHave}문제`);

function formatRanges(nums) {
  if (nums.length === 0) return '';
  const ranges = [];
  let start = nums[0], end = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === end + 1) {
      end = nums[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}~${end}`);
      start = end = nums[i];
    }
  }
  ranges.push(start === end ? `${start}` : `${start}~${end}`);
  return ranges.join(', Q');
}
