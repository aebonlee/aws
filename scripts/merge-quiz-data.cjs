/**
 * merge-quiz-data.cjs
 *
 * Merges all JSON quiz data files and fills empty explanations in aifC01.ts
 *
 * Usage: node scripts/merge-quiz-data.cjs
 */

const fs = require('fs')
const path = require('path')

const QUIZ_DIR = path.join(__dirname, '..', 'data', 'quiz')
const AIF_C01_PATH = path.join(__dirname, '..', 'src', 'data', 'practice', 'aifC01.ts')

// Category ID mapping: JSON scrape IDs → aifC01.ts IDs
const CATEGORY_MAP = {
  'ai-ml-fundamentals': 'ai-ml-basics',
  'genai-fundamentals': 'gen-ai-basics',
  'fm-utilization': 'prompt-engineering',
  // These are the same in both
  'ml-development': 'ml-development',
  'sagemaker': 'sagemaker',
  'fm-evaluation': 'fm-evaluation',
  'responsible-ai': 'responsible-ai',
  'security-governance': 'security-governance',
}

function normalizeText(text) {
  if (!text) return ''
  return text.replace(/\s+/g, ' ').replace(/[""]/g, '"').replace(/['']/g, "'").trim()
}

function textKey(text) {
  return normalizeText(text).substring(0, 60)
}

// Step 1: Load all JSON files and build lookup map
function loadAllJsonData() {
  const files = fs.readdirSync(QUIZ_DIR).filter(f => f.endsWith('.json'))
  const questionMap = new Map() // key: first 60 chars of question → best data

  for (const file of files) {
    const filePath = path.join(QUIZ_DIR, file)
    let data
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch (e) {
      console.warn(`  Skipping ${file}: ${e.message}`)
      continue
    }

    if (!Array.isArray(data)) continue

    for (const q of data) {
      if (!q.question) continue
      const key = textKey(q.question)
      const existing = questionMap.get(key)

      const hasExplanation = q.explanation && q.explanation.length > 10
      const hasExplanationEn = q.explanationEn && q.explanationEn.length > 10
      const hasAnswer = q.answer !== undefined && q.answer !== -1

      // Prefer entries with explanation, then explanationEn, then answer
      if (!existing) {
        questionMap.set(key, q)
      } else {
        const existingHasExp = existing.explanation && existing.explanation.length > 10
        const existingHasExpEn = existing.explanationEn && existing.explanationEn.length > 10

        if (hasExplanation && !existingHasExp) {
          questionMap.set(key, { ...existing, ...q })
        } else if (hasExplanationEn && !existingHasExpEn) {
          questionMap.set(key, { ...existing, explanationEn: q.explanationEn })
        }
      }
    }

    const withExp = data.filter(q => q.explanation && q.explanation.length > 10).length
    console.log(`  ${file}: ${data.length} questions, ${withExp} with explanations`)
  }

  console.log(`\nTotal unique questions in map: ${questionMap.size}`)
  return questionMap
}

// Step 2: Parse aifC01.ts and fill empty explanations
function fillExplanations(questionMap) {
  let content = fs.readFileSync(AIF_C01_PATH, 'utf8')

  let filled = 0
  let notFound = 0
  let alreadyHad = 0
  let answerFixed = 0

  // Match each question object in the array
  // Pattern: { categoryId: 'xxx', question: 'xxx', ... explanation: '' ... }
  // Each question is on a single line (or a few lines)

  // Split by question boundaries
  const lines = content.split('\n')
  const newLines = []

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Check if this line has an empty explanation
    if (!line.match(/explanation:\s*''/)) {
      newLines.push(line)
      continue
    }

    // Extract question text from this line
    const questionMatch = line.match(/question:\s*'((?:[^'\\]|\\.)*)'/);
    if (!questionMatch) {
      newLines.push(line)
      continue
    }

    const questionText = questionMatch[1].replace(/\\'/g, "'")
    const key = textKey(questionText)
    const jsonData = questionMap.get(key)

    if (!jsonData || !jsonData.explanation || jsonData.explanation.length <= 10) {
      // Try fuzzy match - first 40 chars
      let found = null
      const shortKey = normalizeText(questionText).substring(0, 40)
      for (const [k, v] of questionMap) {
        if (k.startsWith(shortKey) && v.explanation && v.explanation.length > 10) {
          found = v
          break
        }
      }

      if (!found) {
        notFound++
        newLines.push(line)
        continue
      }

      // Use fuzzy match
      const escapedExp = found.explanation.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
      line = line.replace(/explanation:\s*''/, `explanation: '${escapedExp}'`)

      // Add explanationEn if available
      if (found.explanationEn && found.explanationEn.length > 10) {
        const escapedExpEn = found.explanationEn.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
        // Check if explanationEn already exists
        if (!line.includes('explanationEn:')) {
          // Add before the closing }
          line = line.replace(/\s*}\s*,?\s*$/, (match) => {
            const comma = match.includes(',') ? ',' : ''
            return `, explanationEn: '${escapedExpEn}' }${comma}`
          })
        }
      }

      filled++
      newLines.push(line)
      continue
    }

    // Direct match found
    const escapedExp = jsonData.explanation.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
    line = line.replace(/explanation:\s*''/, `explanation: '${escapedExp}'`)

    // Add explanationEn if available
    if (jsonData.explanationEn && jsonData.explanationEn.length > 10) {
      const escapedExpEn = jsonData.explanationEn.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
      if (!line.includes('explanationEn:')) {
        line = line.replace(/\s*}\s*,?\s*$/, (match) => {
          const comma = match.includes(',') ? ',' : ''
          return `, explanationEn: '${escapedExpEn}' }${comma}`
        })
      }
    }

    filled++
    newLines.push(line)
  }

  content = newLines.join('\n')

  // Also fix answer: -1 cases
  const answerFixRegex = /answer:\s*-1/g
  let match
  // We need to find each -1 answer and fix from JSON data
  const finalLines = content.split('\n')
  for (let i = 0; i < finalLines.length; i++) {
    if (finalLines[i].includes('answer: -1')) {
      const qMatch = finalLines[i].match(/question:\s*'((?:[^'\\]|\\.)*)'/);
      if (qMatch) {
        const qText = qMatch[1].replace(/\\'/g, "'")
        const key = textKey(qText)
        const jsonData = questionMap.get(key)
        if (jsonData && jsonData.answer !== undefined && jsonData.answer !== -1) {
          const answerStr = Array.isArray(jsonData.answer) ? `[${jsonData.answer.join(', ')}]` : String(jsonData.answer)
          finalLines[i] = finalLines[i].replace(/answer:\s*-1/, `answer: ${answerStr}`)
          answerFixed++
        }
      }
    }
  }

  content = finalLines.join('\n')

  console.log(`\nResults:`)
  console.log(`  Filled: ${filled} explanations`)
  console.log(`  Not found: ${notFound} (no matching JSON data)`)
  console.log(`  Answers fixed: ${answerFixed}`)

  fs.writeFileSync(AIF_C01_PATH, content, 'utf8')
  console.log(`\nWritten to ${AIF_C01_PATH}`)

  // Verify
  const verify = fs.readFileSync(AIF_C01_PATH, 'utf8')
  const stillEmpty = (verify.match(/explanation:\s*''/g) || []).length
  console.log(`Remaining empty explanations: ${stillEmpty}`)
}

// Main
console.log('=== Merging Quiz Data ===\n')
console.log('Loading JSON files...')
const questionMap = loadAllJsonData()
console.log('\nFilling empty explanations in aifC01.ts...')
fillExplanations(questionMap)
console.log('\nDone!')
