import { useState, useMemo } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import { useLang } from '../contexts/LanguageContext'
import StampTierBadge from './StampTierBadge'
import type { StampTier } from '../contexts/ProgressContext'

export interface QuizQuestion {
  question: string
  questionEn?: string
  options: string[]
  optionsEn?: string[]
  answer: number | number[]
  explanation: string
  explanationEn?: string
}

interface QuizProps {
  categoryId: string
  categoryTitle: string
  questions: QuizQuestion[]
}

function isCorrectAnswer(answer: number | number[], selected: number | null, selectedMulti: number[]): boolean {
  if (Array.isArray(answer)) {
    const sorted = [...selectedMulti].sort()
    const answerSorted = [...answer].sort()
    return sorted.length === answerSorted.length && sorted.every((v, i) => v === answerSorted[i])
  }
  return selected === answer
}

function isAnswerIndex(answer: number | number[], idx: number): boolean {
  return Array.isArray(answer) ? answer.includes(idx) : answer === idx
}

function formatAnswerLabel(answer: number | number[]): string {
  if (Array.isArray(answer)) return answer.map(a => String.fromCharCode(65 + a)).join(', ')
  return String.fromCharCode(65 + answer)
}

function shuffleAndPick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function getNextTierInfo(currentTier: StampTier, percentage: number): string | null {
  if (currentTier === 'gold') return null
  if (currentTier === 'silver') return '90%+ 3회 연속 또는 100%로 Gold 달성!'
  if (currentTier === 'bronze') return `85% 이상으로 Silver 달성! (현재 최고: ${percentage}%)`
  return '70% 이상으로 Bronze 달성!'
}

function getDisplayTexts(q: QuizQuestion, lang: 'ko' | 'en') {
  return {
    question: lang === 'en' && q.questionEn ? q.questionEn : q.question,
    options: lang === 'en' && q.optionsEn ? q.optionsEn : q.options,
    explanation: lang === 'en' && q.explanationEn ? q.explanationEn : q.explanation,
  }
}

/** Browse mode - shows all questions with accordion explanations */
function BrowseMode({ questions }: { questions: QuizQuestion[] }) {
  const { lang } = useLang()
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div className="quiz-browse">
      {questions.map((q, i) => {
        const isOpen = openIdx === i
        const d = getDisplayTexts(q, lang)

        return (
          <div key={i} className={`quiz-browse-item ${isOpen ? 'open' : ''}`}>
            <button
              className="quiz-browse-header"
              onClick={() => setOpenIdx(isOpen ? null : i)}
            >
              <span className="quiz-browse-num">Q{i + 1}</span>
              <span className="quiz-browse-q">{d.question}</span>
              <span className="quiz-browse-toggle">{isOpen ? '-' : '+'}</span>
            </button>
            {isOpen && (
              <div className="quiz-browse-body">
                <div className="quiz-browse-options">
                  {d.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`quiz-browse-option ${isAnswerIndex(q.answer, idx) ? 'correct' : ''}`}
                    >
                      <span className="quiz-option-letter">{String.fromCharCode(65 + idx)}</span>
                      {opt}
                    </div>
                  ))}
                </div>
                <div className="quiz-browse-answer">
                  <strong>{lang === 'en' ? 'Answer' : '정답'}: {formatAnswerLabel(q.answer)}</strong>
                </div>
                {d.explanation && (
                  <div className="quiz-browse-explanation">
                    <p style={{ whiteSpace: 'pre-line' }}>{d.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** Quiz mode - interactive quiz with scoring */
function QuizMode({ categoryId, categoryTitle, questions }: QuizProps) {
  const { saveQuizResult, progress, getStampTier, getQuizHistory } = useProgress()
  const { lang, toggleLang } = useLang()
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [selectedMulti, setSelectedMulti] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const prevResult = progress[categoryId]
  const q = questions[currentQ]
  const isMulti = Array.isArray(q.answer)
  const requiredCount = isMulti ? (q.answer as number[]).length : 1
  const d = getDisplayTexts(q, lang)

  const handleSelect = (idx: number) => {
    if (answered) return
    if (isMulti) {
      setSelectedMulti(prev =>
        prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
      )
    } else {
      setSelected(idx)
      setAnswered(true)
      const correct = idx === q.answer
      setIsCorrect(correct)
      if (correct) setScore(prev => prev + 1)
    }
  }

  const handleMultiSubmit = () => {
    setAnswered(true)
    const correct = isCorrectAnswer(q.answer, null, selectedMulti)
    setIsCorrect(correct)
    if (correct) setScore(prev => prev + 1)
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1)
      setSelected(null)
      setSelectedMulti([])
      setAnswered(false)
      setIsCorrect(false)
      setShowExplanation(false)
    } else {
      const finalScore = score
      saveQuizResult(categoryId, finalScore, questions.length)
      setShowResult(true)
    }
  }

  const handleRetry = () => {
    setCurrentQ(0)
    setSelected(null)
    setSelectedMulti([])
    setShowResult(false)
    setScore(0)
    setAnswered(false)
    setIsCorrect(false)
    setShowExplanation(false)
  }

  if (showResult) {
    const passed = score / questions.length >= 0.7
    const percentage = Math.round(score / questions.length * 100)
    const tier = getStampTier(categoryId)
    const history = getQuizHistory(categoryId)
    const recentHistory = history.slice(-5)
    const nextTierMsg = getNextTierInfo(tier, percentage)

    return (
      <div className="quiz-result">
        <div className={`quiz-result-card ${passed ? 'passed' : 'failed'}`}>
          <div className="quiz-result-icon">{passed ? '🎉' : '😢'}</div>
          <h3>{passed ? '도장 획득!' : '아쉽게 실패...'}</h3>
          <p className="quiz-score">{score} / {questions.length} ({percentage}%)</p>

          <div style={{ margin: '16px 0' }}>
            <StampTierBadge tier={tier} size="lg" />
          </div>

          <p className="quiz-result-msg">
            {passed
              ? `${categoryTitle} 도장을 깼습니다! 70% 이상 정답!`
              : '70% 이상 맞혀야 도장을 깰 수 있습니다. 다시 학습 후 도전하세요!'}
          </p>

          {nextTierMsg && (
            <p style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', marginBottom: '12px' }}>
              {nextTierMsg}
            </p>
          )}

          {recentHistory.length > 0 && (
            <div className="quiz-history-dots" style={{ justifyContent: 'center', marginBottom: '16px' }}>
              {recentHistory.map((h, i) => (
                <span
                  key={i}
                  className={`quiz-dot ${h.passed ? 'passed' : 'failed'}`}
                  title={`${h.percentage}%`}
                />
              ))}
            </div>
          )}

          <button className="btn btn-primary" onClick={handleRetry}>
            {passed ? '다시 풀기' : '재도전'}
          </button>
        </div>
      </div>
    )
  }

  const getOptionClass = (idx: number): string => {
    if (!answered) {
      if (isMulti && selectedMulti.includes(idx)) return 'selected'
      if (!isMulti && selected === idx) return 'selected'
      return ''
    }
    const isAnswer = isAnswerIndex(q.answer, idx)
    if (isMulti) {
      const wasSelected = selectedMulti.includes(idx)
      if (isAnswer) return 'correct'
      if (wasSelected && !isAnswer) return 'wrong'
      return ''
    }
    if (selected === idx) return idx === q.answer ? 'correct' : 'wrong'
    if (isAnswer) return 'correct'
    return ''
  }

  return (
    <>
      <div className="quiz-header">
        <h3>📝 도장깨기 퀴즈 - {categoryTitle}</h3>
        <span className="quiz-progress">{currentQ + 1} / {questions.length}</span>
        {prevResult?.quizScore !== null && prevResult?.quizScore !== undefined && (
          <span className="quiz-prev-score">{lang === 'en' ? 'Prev' : '이전 점수'}: {prevResult.quizScore}/{prevResult.quizTotal}</span>
        )}
      </div>
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
      </div>
      <div className="quiz-question">
        <div className="quiz-action-row">
          <button
            className="btn btn-secondary quiz-lang-btn"
            onClick={toggleLang}
          >
            {lang === 'ko' ? '영어로 보기' : '한국어로 보기'}
          </button>
          {!showExplanation && !answered && (
            <button
              className="btn btn-secondary quiz-explain-btn"
              onClick={() => setShowExplanation(true)}
            >
              {lang === 'en' ? 'Show Explanation' : '해설 보기'}
            </button>
          )}
        </div>
        <p className="quiz-q-text">{d.question}</p>
        {isMulti && !answered && (
          <p className="quiz-multi-hint">{requiredCount}{lang === 'en' ? ' selections required' : '개를 선택하세요'} ({selectedMulti.length}/{requiredCount})</p>
        )}
        <div className="quiz-options">
          {d.options.map((opt, idx) => (
            <button
              key={idx}
              className={`quiz-option ${getOptionClass(idx)}`}
              onClick={() => handleSelect(idx)}
              disabled={answered}
            >
              <span className="quiz-option-letter">{String.fromCharCode(65 + idx)}</span>
              {opt}
            </button>
          ))}
        </div>
        {isMulti && !answered && selectedMulti.length > 0 && (
          <button
            className="btn btn-primary quiz-submit-btn"
            onClick={handleMultiSubmit}
            disabled={selectedMulti.length !== requiredCount}
          >
            {lang === 'en' ? 'Check Answer' : '정답 확인'}
          </button>
        )}
        {answered && (
          <div className={`quiz-explanation ${isCorrect ? 'correct' : 'wrong'}`}>
            <p><strong>{isCorrect ? '✅ 정답!' : '❌ 오답!'}</strong></p>
            <p style={{ whiteSpace: 'pre-line' }}>{d.explanation}</p>
          </div>
        )}
        {!answered && showExplanation && (
          <div className="quiz-explanation neutral">
            <p><strong>{lang === 'en' ? 'Explanation' : '해설'}</strong></p>
            <p style={{ whiteSpace: 'pre-line' }}>{d.explanation}</p>
          </div>
        )}
        {answered && (
          <button className="btn btn-primary quiz-next-btn" onClick={handleNext}>
            {currentQ < questions.length - 1
              ? (lang === 'en' ? 'Next' : '다음 문제 →')
              : (lang === 'en' ? 'View Results' : '결과 보기')}
          </button>
        )}
      </div>
    </>
  )
}

const QUIZ_COUNT = 10

export default function Quiz({ categoryId, categoryTitle, questions }: QuizProps) {
  const [mode, setMode] = useState<'quiz' | 'browse'>('quiz')
  const [quizKey, setQuizKey] = useState(0)

  const quizQuestions = useMemo(() => {
    return shuffleAndPick(questions, QUIZ_COUNT)
  }, [questions, quizKey])

  const startNewQuiz = () => {
    setQuizKey(k => k + 1)
    setMode('quiz')
  }

  return (
    <div className="quiz-container">
      <div className="quiz-mode-bar">
        <div className="quiz-mode-tabs">
          <button
            className={`quiz-mode-tab ${mode === 'quiz' ? 'active' : ''}`}
            onClick={startNewQuiz}
          >
            📝 도장깨기 ({QUIZ_COUNT}문제)
          </button>
          <button
            className={`quiz-mode-tab ${mode === 'browse' ? 'active' : ''}`}
            onClick={() => setMode('browse')}
          >
            📖 전체 보기 ({questions.length}문제)
          </button>
        </div>
      </div>

      {mode === 'quiz' ? (
        <QuizMode
          key={quizKey}
          categoryId={categoryId}
          categoryTitle={categoryTitle}
          questions={quizQuestions}
        />
      ) : (
        <BrowseMode questions={questions} />
      )}
    </div>
  )
}
