/**
 * Patch aifC01.ts with missing questionEn/optionsEn from JSON source files.
 */
const fs = require('fs');
const path = require('path');

const QUIZ_DIR = path.join(__dirname, '..', 'data', 'quiz');
const TS_FILE = path.join(__dirname, '..', 'src', 'data', 'practice', 'aifC01.ts');

// JSON source files with English data (category-specific, most complete versions)
const SOURCE_FILES = [
  'ai-ml-fundamentals-2026-04-12.json',
  'ai-ml-fundamentals-Q41.json',
  'ai-ml-fundamentals-Q55.json',
  'ml-development-2026-04-12.json',
  'ml-developmen.json',
  'sagemaker-2026-04-12.json',
  'genai-fundamentals-2026-04-12.json',
  'genai-fundamentals.json',
  'fm-utilization-2026-04-12.json',
  'fm-utilization-Q56-Q82-2026-04-12.json',
  'fm-utilization-Q30.json',
  'fm-evaluation-2026-04-12.json',
  'fm-evaluation-Q28-Q62-2026-04-12.json',
  'fm-evaluation-Q15.json',
  'responsible-ai-2026-04-12.json',
  'responsible-ai-2026.json',
  'responsible-ai.json',
  'responsible-ai-Q28.json',
  'security-governance-2026-04-12.json',
  'quiz-2026-04-12.json',
  'quiz-2026-04-12_1.json',
  'quiz-2026-04-12-merged.json',
  'aif-c01_with_explanation.json',
  'security-governance-Q16.json',
  'security-governance-Q19.json',
  'security-governance-Q21.json',
  'security-governance-Q27.json',
  'security-governance-Q34.json',
];

// Build lookup: normalize Korean question text -> English fields
const lookup = new Map();

for (const file of SOURCE_FILES) {
  const filePath = path.join(QUIZ_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`WARN: ${file} not found, skipping`);
    continue;
  }
  const questions = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  for (const q of questions) {
    if (q.questionEn && q.optionsEn) {
      // Normalize: trim, collapse whitespace
      const key = q.question.trim().replace(/\s+/g, ' ');
      lookup.set(key, {
        questionEn: q.questionEn,
        optionsEn: q.optionsEn,
        explanationEn: q.explanationEn || null,
      });
    }
  }
}

console.log(`Loaded ${lookup.size} English translations from JSON sources`);

// Read the TS file
let content = fs.readFileSync(TS_FILE, 'utf-8');

// Count existing questionEn
const existingCount = (content.match(/questionEn:/g) || []).length;
console.log(`Existing questionEn in TS: ${existingCount}`);

// Process each line
const lines = content.split('\n');
let patchedCount = 0;
let notFoundCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Skip lines that already have questionEn
  if (line.includes('questionEn:')) continue;

  // Check if this line is a question object
  const qMatch = line.match(/question:\s*'((?:[^'\\]|\\.)*)'/);
  if (!qMatch) continue;

  // Extract Korean question text
  const koreanQ = qMatch[1].replace(/\\'/g, "'").replace(/\\n/g, '\n').trim().replace(/\s+/g, ' ');

  // Look up English translation
  const en = lookup.get(koreanQ);
  if (!en) {
    notFoundCount++;
    // Try partial match (first 50 chars)
    const partial = koreanQ.substring(0, 50);
    let found = false;
    for (const [key, val] of lookup) {
      if (key.startsWith(partial)) {
        // Found partial match
        const enStr = buildEnglishFields(val);
        lines[i] = insertEnglishFields(line, enStr);
        patchedCount++;
        found = true;
        break;
      }
    }
    if (!found) {
      // Try even shorter match (first 30 chars)
      const partial30 = koreanQ.substring(0, 30);
      for (const [key, val] of lookup) {
        if (key.startsWith(partial30)) {
          const enStr = buildEnglishFields(val);
          lines[i] = insertEnglishFields(line, enStr);
          patchedCount++;
          found = true;
          break;
        }
      }
      if (!found) {
        console.log(`NOT FOUND (line ${i + 1}): ${koreanQ.substring(0, 60)}...`);
      }
    }
    continue;
  }

  const enStr = buildEnglishFields(en);
  lines[i] = insertEnglishFields(line, enStr);
  patchedCount++;
}

function buildEnglishFields(en) {
  const qEn = en.questionEn.replace(/'/g, "\\'");
  const oEn = en.optionsEn.map(o => `'${o.replace(/'/g, "\\'")}'`).join(', ');
  let str = `questionEn: '${qEn}', optionsEn: [${oEn}]`;
  return str;
}

function insertEnglishFields(line, enStr) {
  // Insert before the closing }
  // Find the last } in the line
  const lastBrace = line.lastIndexOf('}');
  if (lastBrace === -1) return line;

  // Check if there's already a trailing comma before }
  const beforeBrace = line.substring(0, lastBrace).trimEnd();
  const separator = beforeBrace.endsWith(',') ? ' ' : ', ';

  return beforeBrace + separator + enStr + ' ' + line.substring(lastBrace);
}

// Write updated file
const updatedContent = lines.join('\n');
fs.writeFileSync(TS_FILE, updatedContent, 'utf-8');

// Final count
const finalCount = (updatedContent.match(/questionEn:/g) || []).length;
console.log(`\nResults:`);
console.log(`  Patched: ${patchedCount}`);
console.log(`  Not found: ${notFoundCount - patchedCount}`);
console.log(`  Total questionEn now: ${finalCount} / 424`);
