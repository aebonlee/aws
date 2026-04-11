import { useState, useMemo } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import { CATEGORIES } from '../lib/categories'
import { allQuestions, type PracticeQuestion } from '../data/quizData'
import type { QuizQuestion } from '../components/Quiz'

function PracticeQuiz({ questions, title }: { questions: QuizQuestion[]; title: string }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const correct = idx === questions[currentQ].answer
    setIsCorrect(correct)
    if (correct) setScore(prev => prev + 1)
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1)
      setSelected(null)
      setAnswered(false)
      setIsCorrect(false)
    } else {
      setShowResult(true)
    }
  }

  const handleRetry = () => {
    setCurrentQ(0)
    setSelected(null)
    setShowResult(false)
    setScore(0)
    setAnswered(false)
    setIsCorrect(false)
  }

  if (showResult) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="quiz-result">
        <div className={`quiz-result-card ${pct >= 70 ? 'passed' : 'failed'}`}>
          <h3>{pct >= 70 ? '훌륭합니다!' : '조금 더 노력해봐요!'}</h3>
          <p className="quiz-score">{score} / {questions.length} ({pct}%)</p>
          <button className="btn btn-primary" onClick={handleRetry}>다시 풀기</button>
        </div>
      </div>
    )
  }

  const q = questions[currentQ]

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
        <p className="quiz-q-text">{q.question}</p>
        <div className="quiz-options">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              className={`quiz-option ${selected === idx ? (idx === q.answer ? 'correct' : 'wrong') : ''} ${answered && idx === q.answer ? 'correct' : ''}`}
              onClick={() => handleSelect(idx)}
              disabled={answered}
            >
              <span className="quiz-option-letter">{String.fromCharCode(65 + idx)}</span>
              {opt}
            </button>
          ))}
        </div>
        {answered && (
          <div className={`quiz-explanation ${isCorrect ? 'correct' : 'wrong'}`}>
            <p><strong>{isCorrect ? 'O 정답!' : 'X 오답!'}</strong></p>
            <p>{q.explanation}</p>
          </div>
        )}
        {answered && (
          <button className="btn btn-primary quiz-next-btn" onClick={handleNext}>
            {currentQ < questions.length - 1 ? '다음 문제' : '결과 보기'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function Practice() {
  const { progress } = useProgress()
  const [mode, setMode] = useState<'select' | 'quiz'>('select')
  const [selectedCats, setSelectedCats] = useState<string[]>([])

  const filteredQuestions = useMemo((): PracticeQuestion[] => {
    if (selectedCats.length === 0) return allQuestions
    return allQuestions.filter(q => selectedCats.includes(q.categoryId))
  }, [selectedCats])

  const shuffled = useMemo(() => {
    return [...filteredQuestions].sort(() => Math.random() - 0.5).slice(0, 20)
  }, [filteredQuestions])

  const toggleCat = (catId: string) => {
    setSelectedCats(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    )
  }

  const startQuiz = () => {
    setMode('quiz')
  }

  if (mode === 'quiz' && shuffled.length > 0) {
    const title = selectedCats.length === 0
      ? '전체 랜덤 문제풀이'
      : selectedCats.map(id => CATEGORIES.find(c => c.id === id)?.title).filter(Boolean).join(', ')
    return (
      <div className="practice-page">
        <div className="container">
          <button className="btn btn-secondary practice-back" onClick={() => setMode('select')}>
            카테고리 선택으로
          </button>
          <PracticeQuiz questions={shuffled} title={title} />
        </div>
      </div>
    )
  }

  return (
    <div className="practice-page">
      <div className="container">
        <div className="practice-hero">
          <h1>문제풀이</h1>
          <p>카테고리를 선택하고 랜덤 문제를 풀어보세요. 최대 20문제씩 출제됩니다.</p>
        </div>

        <div className="practice-categories">
          <h2>카테고리 선택</h2>
          <p className="practice-hint">선택하지 않으면 전체 카테고리에서 출제됩니다.</p>
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
                  <span className="practice-cat-count">{cat.questions}문제</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="practice-start">
          <button className="btn btn-primary" onClick={startQuiz}>
            문제 풀기 시작 ({selectedCats.length === 0 ? '전체' : `${selectedCats.length}개 카테고리`})
          </button>
        </div>
      </div>
    </div>
  )
}
