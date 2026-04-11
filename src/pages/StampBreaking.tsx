import { Link } from 'react-router-dom'
import { useProgress } from '../contexts/ProgressContext'
import { CATEGORIES } from '../lib/categories'

export default function StampBreaking() {
  const { progress, getCompletionRate, resetProgress } = useProgress()
  const rate = getCompletionRate()
  const clearedCount = CATEGORIES.filter(c => progress[c.id]?.completedAt).length

  return (
    <div className="stamp-page">
      <div className="container">
        <div className="stamp-hero">
          <h1>도장깨기 현황</h1>
          <p>각 카테고리를 학습하고 퀴즈에서 70% 이상 맞히면 도장을 획득합니다.</p>
          <div className="stamp-summary">
            <div className="stamp-rate">
              <span className="stamp-rate-number">{rate}%</span>
              <span className="stamp-rate-label">전체 진행률</span>
            </div>
            <div className="stamp-rate">
              <span className="stamp-rate-number">{clearedCount} / {CATEGORIES.length}</span>
              <span className="stamp-rate-label">획득 도장</span>
            </div>
          </div>
          <div className="stamp-progress-bar">
            <div className="stamp-progress-fill" style={{ width: `${rate}%` }} />
          </div>
        </div>

        <div className="stamp-grid">
          {CATEGORIES.map(cat => {
            const p = progress[cat.id]
            const cleared = p?.completedAt != null
            const studied = p?.studied === true
            const hasQuiz = p?.quizScore != null

            return (
              <Link key={cat.id} to={cat.path} className={`stamp-card ${cleared ? 'cleared' : ''}`}>
                <div className="stamp-icon">{cleared ? '✅' : studied ? '📖' : '⬜'}</div>
                <h3 className="stamp-title">{cat.title}</h3>
                <p className="stamp-desc">{cat.description}</p>
                <div className="stamp-meta">
                  <span className="badge badge-info">{cat.weight}</span>
                  <span className="badge badge-primary">{cat.questions}문제</span>
                </div>
                <div className="stamp-status">
                  {cleared && <span className="stamp-cleared">도장 획득!</span>}
                  {!cleared && hasQuiz && (
                    <span className="stamp-retry">
                      {p.quizScore}/{p.quizTotal} ({Math.round((p.quizScore! / p.quizTotal) * 100)}%) - 재도전 필요
                    </span>
                  )}
                  {!cleared && !hasQuiz && studied && <span className="stamp-studying">학습 중</span>}
                  {!cleared && !hasQuiz && !studied && <span className="stamp-notstarted">미시작</span>}
                </div>
              </Link>
            )
          })}
        </div>

        {clearedCount > 0 && (
          <div className="stamp-reset">
            <button className="btn btn-secondary" onClick={() => {
              if (confirm('진행 상황을 모두 초기화하시겠습니까?')) resetProgress()
            }}>
              진행 상황 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
