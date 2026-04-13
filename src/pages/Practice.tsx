import { useState, useMemo } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import { useLang } from '../contexts/LanguageContext'
import { CATEGORIES } from '../lib/categories'
import { allQuestions, type PracticeQuestion } from '../data/quizData'
import type { QuizQuestion } from '../components/Quiz'

function isAnswerIndex(answer: number | number[], idx: number): boolean {
  return Array.isArray(answer) ? answer.includes(idx) : answer === idx
}

function PracticeQuiz({ questions, title }: { questions: QuizQuestion[]; title: string }) {
  const { lang } = useLang()
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [selectedMulti, setSelectedMulti] = useState<number[]>([])
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const q = questions[currentQ]
  const isMulti = Array.isArray(q.answer)
  const requiredCount = isMulti ? (q.answer as number[]).length : 1

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
    const sorted = [...selectedMulti].sort()
    const answerSorted = [...(q.answer as number[])].sort()
    const correct = sorted.length === answerSorted.length && sorted.every((v, i) => v === answerSorted[i])
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
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="quiz-result">
        <div className={`quiz-result-card ${pct >= 70 ? 'passed' : 'failed'}`}>
          <h3>{pct >= 70 ? '훌륭합니다!' : '조금 더 노력해봐요!'}</h3>
          <p className="quiz-score">{score} / {questions.length} ({pct}%)</p>
          <button className="btn btn-primary" onClick={handleRetry}>{lang === 'en' ? 'Retry' : '다시 풀기'}</button>
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
    const isAns = isAnswerIndex(q.answer, idx)
    if (isMulti) {
      if (isAns) return 'correct'
      if (selectedMulti.includes(idx) && !isAns) return 'wrong'
      return ''
    }
    if (selected === idx) return idx === q.answer ? 'correct' : 'wrong'
    if (isAns) return 'correct'
    return ''
  }

  const displayQuestion = lang === 'en' && q.questionEn ? q.questionEn : q.question
  const displayOptions = lang === 'en' && q.optionsEn ? q.optionsEn : q.options
  const displayExplanation = lang === 'en' && q.explanationEn ? q.explanationEn : q.explanation

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h3>{title}</h3>
        <span className="quiz-progress">{currentQ + 1} / {questions.length}</span>
      </div>
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
      </div>
      <div className="quiz-question">
        <div className="quiz-action-row">
          {!showExplanation && !answered && (
            <button
              className="btn btn-secondary quiz-explain-btn"
              onClick={() => setShowExplanation(true)}
            >
              {lang === 'en' ? 'Show Explanation' : '해설 보기'}
            </button>
          )}
        </div>
        <p className="quiz-q-text">{displayQuestion}</p>
        {isMulti && !answered && (
          <p className="quiz-multi-hint">{requiredCount}{lang === 'en' ? ' selections required' : '개를 선택하세요'} ({selectedMulti.length}/{requiredCount})</p>
        )}
        <div className="quiz-options">
          {displayOptions.map((opt, idx) => (
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
            <p style={{ whiteSpace: 'pre-line' }}>{displayExplanation}</p>
          </div>
        )}
        {!answered && showExplanation && (
          <div className="quiz-explanation neutral">
            <p><strong>{lang === 'en' ? 'Explanation' : '해설'}</strong></p>
            <p style={{ whiteSpace: 'pre-line' }}>{displayExplanation}</p>
          </div>
        )}
        {answered && (
          <button className="btn btn-primary quiz-next-btn" onClick={handleNext}>
            {currentQ < questions.length - 1
              ? (lang === 'en' ? 'Next' : '다음 문제')
              : (lang === 'en' ? 'View Results' : '결과 보기')}
          </button>
        )}
      </div>
    </div>
  )
}

export default function Practice() {
  const { progress } = useProgress()
  const { lang } = useLang()
  const [mode, setMode] = useState<'select' | 'quiz'>('select')
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [quizKey, setQuizKey] = useState(0)

  const filteredQuestions = useMemo((): PracticeQuestion[] => {
    if (selectedCats.length === 0) return allQuestions
    return allQuestions.filter(q => selectedCats.includes(q.categoryId))
  }, [selectedCats])

  const quizQuestions = useMemo(() => {
    return [...filteredQuestions].sort(() => Math.random() - 0.5)
  }, [filteredQuestions, quizKey])

  const toggleCat = (catId: string) => {
    setSelectedCats(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    )
  }

  const startQuiz = () => {
    setQuizKey(k => k + 1)
    setMode('quiz')
  }

  if (mode === 'quiz' && quizQuestions.length > 0) {
    const title = selectedCats.length === 0
      ? (lang === 'en' ? 'All Random Questions' : '전체 랜덤 문제풀이')
      : selectedCats.map(id => CATEGORIES.find(c => c.id === id)?.title).filter(Boolean).join(', ')
    const subtitle = `(${quizQuestions.length}${lang === 'en' ? ' Q' : '문제'})`
    return (
      <div className="practice-page">
        <div className="container">
          <button className="btn btn-secondary practice-back" onClick={() => setMode('select')}>
            {lang === 'en' ? 'Back to Categories' : '카테고리 선택으로'}
          </button>
          <PracticeQuiz questions={quizQuestions} title={`${title} ${subtitle}`} />
        </div>
      </div>
    )
  }

  return (
    <div className="practice-page">
      <div className="container">
        <div className="practice-hero">
          <h1>{lang === 'en' ? 'Practice Questions' : '문제풀이'}</h1>
          <p>{lang === 'en'
            ? `Select categories and start practicing. ${allQuestions.length} questions available.`
            : `카테고리를 선택하고 문제를 풀어보세요. 총 ${allQuestions.length}문제가 준비되어 있습니다.`}</p>
        </div>

        <div className="practice-categories">
          <h2>{lang === 'en' ? 'Select Categories' : '카테고리 선택'}</h2>
          <p className="practice-hint">{lang === 'en' ? 'All categories if none selected.' : '선택하지 않으면 전체 카테고리에서 출제됩니다.'}</p>
          <div className="practice-cat-grid">
            {CATEGORIES.map(cat => {
              const cleared = progress[cat.id]?.completedAt != null
              return (
                <button
                  key={cat.id}
                  className={`practice-cat-btn ${selectedCats.includes(cat.id) ? 'selected' : ''}`}
                  onClick={() => toggleCat(cat.id)}
                >
                  <span className="practice-cat-icon">{cleared ? 'O' : '-'}</span>
                  <span className="practice-cat-title">{cat.title}</span>
                  <span className="practice-cat-count">{cat.questions}{lang === 'en' ? ' Q' : '문제'}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="practice-start">
          <button className="btn btn-primary" onClick={startQuiz}>
            {lang === 'en'
              ? `Start (${selectedCats.length === 0 ? 'All' : `${selectedCats.length} cat.`} / ${filteredQuestions.length} Q)`
              : `문제 풀기 시작 (${selectedCats.length === 0 ? '전체' : `${selectedCats.length}개 카테고리`} / ${filteredQuestions.length}문제)`}
          </button>
        </div>
      </div>
    </div>
  )
}
