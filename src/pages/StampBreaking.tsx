import { Link } from 'react-router-dom'
import { useProgress } from '../contexts/ProgressContext'
import { CATEGORIES } from '../lib/categories'
import StampTierBadge from '../components/StampTierBadge'

export default function StampBreaking() {
  const { progress, getCompletionRate, resetProgress, getStampTier, getQuizHistory, getSectionProgress } = useProgress()
  const rate = getCompletionRate()
  const clearedCount = CATEGORIES.filter(c => progress[c.id]?.completedAt).length
  const goldCount = CATEGORIES.filter(c => getStampTier(c.id) === 'gold').length
  const silverCount = CATEGORIES.filter(c => getStampTier(c.id) === 'silver').length
  const bronzeCount = CATEGORIES.filter(c => getStampTier(c.id) === 'bronze').length

  return (
    <div className="stamp-page">
      <div className="container">
        <div className="stamp-hero">
          <h1>도장깨기 현황</h1>
          <p>각 카테고리를 학습하고 퀴즈에서 70% 이상 맞히면 도장을 획득합니다.</p>

          <div className="stamp-tier-counts">
            <div className="stamp-tier-count">
              <span className="stamp-tier-count-num" style={{ color: '#f59e0b' }}>{goldCount}</span>
              <span className="stamp-tier-count-label">Gold</span>
            </div>
            <div className="stamp-tier-count">
              <span className="stamp-tier-count-num" style={{ color: '#94a3b8' }}>{silverCount}</span>
              <span className="stamp-tier-count-label">Silver</span>
            </div>
            <div className="stamp-tier-count">
              <span className="stamp-tier-count-num" style={{ color: '#ea580c' }}>{bronzeCount}</span>
              <span className="stamp-tier-count-label">Bronze</span>
            </div>
          </div>

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

        {/* Tier guide */}
        <div className="stamp-tier-guide">
          <h3>도장 티어 달성 조건</h3>
          <div className="stamp-tier-guide-grid">
            <div className="stamp-tier-guide-item">
              <StampTierBadge tier="bronze" size="sm" />
              <span>70% 이상 합격</span>
            </div>
            <div className="stamp-tier-guide-item">
              <StampTierBadge tier="silver" size="sm" />
              <span>85% 이상 달성</span>
            </div>
            <div className="stamp-tier-guide-item">
              <StampTierBadge tier="gold" size="sm" />
              <span>100% 또는 90%+ 3회 연속</span>
            </div>
          </div>
        </div>

        <div className="stamp-grid">
          {CATEGORIES.map(cat => {
            const p = progress[cat.id]
            const cleared = p?.completedAt != null
            const studied = p?.studied === true
            const hasQuiz = p?.quizScore != null
            const tier = getStampTier(cat.id)
            const history = getQuizHistory(cat.id)
            const recentHistory = history.slice(-5)

            // Section completion
            const sectionCount = cat.sections.length
            const completedSections = cat.sections.filter(s => {
              const sp = getSectionProgress(cat.id, s.id)
              return sp.reviewStatus === 'completed'
            }).length

            // Best score
            const bestScore = history.length > 0 ? Math.max(...history.map(h => h.percentage)) : null
            const lastScore = history.length > 0 ? history[history.length - 1].percentage : null

            return (
              <Link key={cat.id} to={cat.path} className={`stamp-card ${cleared ? 'cleared' : ''}`}>
                <div className="stamp-card-header">
                  <StampTierBadge tier={tier} size="sm" />
                </div>
                <h3 className="stamp-title">{cat.icon} {cat.title}</h3>
                <p className="stamp-desc">{cat.description}</p>

                <div className="stamp-meta">
                  <span className="badge badge-info">{cat.weight}</span>
                  <span className="badge badge-primary">{cat.questions}문제</span>
                  {sectionCount > 0 && (
                    <span className="badge badge-success">{completedSections}/{sectionCount} 섹션</span>
                  )}
                </div>

                {/* Quiz history dots */}
                {recentHistory.length > 0 && (
                  <div className="quiz-history-dots" style={{ marginTop: '8px' }}>
                    {recentHistory.map((h, i) => (
                      <span
                        key={i}
                        className={`quiz-dot ${h.passed ? 'passed' : 'failed'}`}
                        title={`${h.percentage}% (${new Date(h.timestamp).toLocaleDateString('ko-KR')})`}
                      />
                    ))}
                  </div>
                )}

                {/* Score info */}
                {(bestScore !== null || lastScore !== null) && (
                  <div className="stamp-scores" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    {bestScore !== null && <span>최고: {bestScore}%</span>}
                    {bestScore !== null && lastScore !== null && <span> | </span>}
                    {lastScore !== null && <span>최근: {lastScore}%</span>}
                  </div>
                )}

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
