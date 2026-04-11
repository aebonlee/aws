import { useState } from 'react'
import { useProgress } from '../contexts/ProgressContext'

export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
  explanation: string
}

interface QuizProps {
  categoryId: string
  categoryTitle: string
  questions: QuizQuestion[]
}

export default function Quiz({ categoryId, categoryTitle, questions }: QuizProps) {
  const { saveQuizResult, progress } = useProgress()
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const prevResult = progress[categoryId]

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
      const finalScore = score
      saveQuizResult(categoryId, finalScore, questions.length)
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
    const passed = score / questions.length >= 0.7
    return (
      <div className="quiz-result">
        <div className={`quiz-result-card ${passed ? 'passed' : 'failed'}`}>
          <div className="quiz-result-icon">{passed ? '🎉' : '😢'}</div>
          <h3>{passed ? '도장 획득!' : '아쉽게 실패...'}</h3>
          <p className="quiz-score">{score} / {questions.length} ({Math.round(score / questions.length * 100)}%)</p>
          <p className="quiz-result-msg">
            {passed
              ? `${categoryTitle} 도장을 깼습니다! 70% 이상 정답!`
              : '70% 이상 맞혀야 도장을 깰 수 있습니다. 다시 학습 후 도전하세요!'}
          </p>
          <button className="btn btn-primary" onClick={handleRetry}>
            {passed ? '다시 풀기' : '재도전'}
          </button>
        </div>
      </div>
    )
  }

  const q = questions[currentQ]

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h3>📝 도장깨기 퀴즈 - {categoryTitle}</h3>
        <span className="quiz-progress">{currentQ + 1} / {questions.length}</span>
        {prevResult?.quizScore !== null && prevResult?.quizScore !== undefined && (
          <span className="quiz-prev-score">이전 점수: {prevResult.quizScore}/{prevResult.quizTotal}</span>
        )}
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
            <p><strong>{isCorrect ? '✅ 정답!' : '❌ 오답!'}</strong></p>
            <p>{q.explanation}</p>
          </div>
        )}
        {answered && (
          <button className="btn btn-primary quiz-next-btn" onClick={handleNext}>
            {currentQ < questions.length - 1 ? '다음 문제 →' : '결과 보기'}
          </button>
        )}
      </div>
    </div>
  )
}
