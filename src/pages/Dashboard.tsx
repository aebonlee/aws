import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useProgress } from '../contexts/ProgressContext'
import { useCoupon } from '../contexts/CouponContext'
import { CATEGORIES } from '../lib/categories'
import StampTierBadge from '../components/StampTierBadge'
import CouponInput from '../components/CouponInput'
import '../styles/dashboard.css'
import '../styles/coupon.css'

export default function Dashboard() {
  const { user } = useAuth()
  const { hasActiveAccess, remainingTime } = useCoupon()
  const { getOverallStats, getStampTier, getQuizHistory, getSectionProgress } = useProgress()
  const stats = getOverallStats()
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '학습자'

  // All quiz attempts sorted by time
  const allAttempts = CATEGORIES.flatMap(cat =>
    getQuizHistory(cat.id).map(h => ({ ...h, categoryId: cat.id, categoryTitle: cat.title }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 20)

  // Weak areas: < 70% best or needs-review sections
  const weakCategories = CATEGORIES.filter(cat => {
    const history = getQuizHistory(cat.id)
    if (history.length === 0) return false
    const best = Math.max(...history.map(h => h.percentage))
    return best < 70
  })

  const needsReviewCategories = CATEGORIES.filter(cat =>
    cat.sections.some(s => getSectionProgress(cat.id, s.id).reviewStatus === 'needs-review')
  )

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Hero greeting */}
        <div className="dashboard-hero">
          <div className="dashboard-greeting">
            <h1>{userName}님의 학습 대시보드</h1>
            <p>AWS AIF-C01 학습 현황을 한눈에 확인하세요.</p>
          </div>
          <div className="dashboard-stats-ring">
            <svg viewBox="0 0 120 120" className="progress-ring">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke="var(--primary)" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - stats.completionRate / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="55" textAnchor="middle" className="ring-text-num">{stats.completionRate}%</text>
              <text x="60" y="72" textAnchor="middle" className="ring-text-label">완료율</text>
            </svg>
          </div>
        </div>

        {/* Period pass status */}
        {hasActiveAccess ? (
          <div className="dashboard-coupon-card">
            <h3>이용권 사용 중</h3>
            <p>만료: {remainingTime}</p>
          </div>
        ) : (
          <div className="dashboard-coupon-input-section">
            <h3>쿠폰 코드 입력</h3>
            <CouponInput />
          </div>
        )}

        {/* Key metrics */}
        <div className="dashboard-metrics">
          <div className="dashboard-metric">
            <span className="dashboard-metric-num">{stats.studiedCount}</span>
            <span className="dashboard-metric-label">학습 시작</span>
          </div>
          <div className="dashboard-metric">
            <span className="dashboard-metric-num">{stats.clearedCount}/{stats.totalCategories}</span>
            <span className="dashboard-metric-label">도장 획득</span>
          </div>
          <div className="dashboard-metric">
            <span className="dashboard-metric-num">{stats.totalQuizAttempts}</span>
            <span className="dashboard-metric-label">퀴즈 응시</span>
          </div>
          <div className="dashboard-metric">
            <span className="dashboard-metric-num">{stats.averageScore}%</span>
            <span className="dashboard-metric-label">평균 점수</span>
          </div>
        </div>

        {/* Stamp collection */}
        <div className="dashboard-section">
          <h2>도장 컬렉션</h2>
          <div className="dashboard-stamps-grid">
            {CATEGORIES.map(cat => {
              const tier = getStampTier(cat.id)
              return (
                <Link key={cat.id} to={cat.path} className="dashboard-stamp-slot">
                  <StampTierBadge tier={tier} size="md" />
                  <span className="dashboard-stamp-name">{cat.icon} {cat.title}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Category detail table */}
        <div className="dashboard-section">
          <h2>카테고리별 상세</h2>
          <div className="dashboard-table-wrap">
            <table className="info-table dashboard-detail-table">
              <thead>
                <tr>
                  <th>카테고리</th>
                  <th>섹션 진행</th>
                  <th>퀴즈 응시</th>
                  <th>최고 점수</th>
                  <th>도장 티어</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map(cat => {
                  const history = getQuizHistory(cat.id)
                  const completedSections = cat.sections.filter(s =>
                    getSectionProgress(cat.id, s.id).reviewStatus === 'completed'
                  ).length
                  const best = history.length > 0 ? Math.max(...history.map(h => h.percentage)) : '-'

                  return (
                    <tr key={cat.id}>
                      <td><Link to={cat.path}>{cat.icon} {cat.title}</Link></td>
                      <td>{completedSections}/{cat.sections.length}</td>
                      <td>{history.length}회</td>
                      <td>{typeof best === 'number' ? `${best}%` : best}</td>
                      <td><StampTierBadge tier={getStampTier(cat.id)} size="sm" /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quiz timeline */}
        {allAttempts.length > 0 && (
          <div className="dashboard-section">
            <h2>퀴즈 히스토리</h2>
            <div className="dashboard-timeline">
              {allAttempts.map((a, i) => (
                <div key={i} className={`dashboard-timeline-item ${a.passed ? 'passed' : 'failed'}`}>
                  <span className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="timeline-title">{a.categoryTitle}</span>
                    <span className="timeline-score">{a.score}/{a.total} ({a.percentage}%)</span>
                    <span className="timeline-date">{new Date(a.timestamp).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weak areas */}
        {(weakCategories.length > 0 || needsReviewCategories.length > 0) && (
          <div className="dashboard-section">
            <h2>취약 영역</h2>
            <div className="dashboard-weak-grid">
              {weakCategories.map(cat => (
                <Link key={cat.id} to={cat.path} className="dashboard-weak-card weak-score">
                  <span className="weak-icon">📉</span>
                  <span className="weak-title">{cat.title}</span>
                  <span className="weak-reason">최고 점수 70% 미만</span>
                </Link>
              ))}
              {needsReviewCategories.map(cat => (
                <Link key={`review-${cat.id}`} to={cat.path} className="dashboard-weak-card weak-review">
                  <span className="weak-icon">🔄</span>
                  <span className="weak-title">{cat.title}</span>
                  <span className="weak-reason">재복습 필요 섹션 있음</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
