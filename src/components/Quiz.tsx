import { useState } from 'react'
import { useProgress } from '../contexts/ProgressContext'

export interface QuizQuestion {
  question: string
  questionEn?: string
  options: string[]
  optionsEn?: string[]
  answer: number | number[]
  explanation: string
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

export default function Quiz({ categoryId, categoryTitle, questions }: QuizProps) {
  const { saveQuizResult, progress } = useProgress()
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [selectedMulti, setSelectedMulti] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const prevResult = progress[categoryId]
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
        {isMulti && !answered && (
          <p className="quiz-multi-hint">{requiredCount}개를 선택하세요 ({selectedMulti.length}/{requiredCount})</p>
        )}
        <div className="quiz-options">
          {q.options.map((opt, idx) => (
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
            정답 확인
          </button>
        )}
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
