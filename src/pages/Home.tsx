import { Link } from 'react-router-dom'
import { useProgress } from '../contexts/ProgressContext'
import { CATEGORIES } from '../lib/categories'

export default function Home() {
  const { progress, getCompletionRate, isCleared, resetProgress } = useProgress()
  const completionRate = getCompletionRate()
  const clearedCount = CATEGORIES.filter(c => isCleared(c.id)).length

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>AWS <span>AIF-C01</span> 도장깨기</h1>
          <p>AWS Certified AI Practitioner 자격증을 체계적으로 학습하고, 도장깨기로 실력을 검증하세요!</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">8</div>
              <div className="hero-stat-label">학습 카테고리</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">424</div>
              <div className="hero-stat-label">예상 문제 수</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">{clearedCount}/8</div>
              <div className="hero-stat-label">도장 획득</div>
            </div>
          </div>
        </div>
      </section>

      <section className="progress-section">
        <div className="container">
          <h2 className="section-title">학습 진행률</h2>
          <p className="section-subtitle">모든 카테고리의 도장을 깨보세요!</p>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${Math.max(completionRate, 5)}%` }}>
              {completionRate}%
            </div>
          </div>
          {clearedCount === 8 && (
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)' }}>
                🎉 축하합니다! 모든 도장을 깼습니다!
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">학습 카테고리</h2>
          <p className="section-subtitle">각 카테고리를 학습하고 퀴즈를 풀어 도장을 획득하세요</p>
          <div className="categories-grid">
            {CATEGORIES.map(cat => {
              const cleared = isCleared(cat.id)
              const catProgress = progress[cat.id]
              return (
                <Link key={cat.id} to={cat.path} className="category-card">
                  <div className="category-card-header">
                    <span className="category-icon">{cat.icon}</span>
                    <div className="category-badges">
                      <span className="badge badge-primary">{cat.weight}</span>
                      <span className="badge badge-info">{cat.questions}문제</span>
                    </div>
                  </div>
                  <h3 className="category-title">{cat.title}</h3>
                  <p className="category-desc">{cat.description}</p>
                  <div className="category-footer">
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {catProgress?.quizScore !== null && catProgress?.quizScore !== undefined
                        ? `최근: ${catProgress.quizScore}/${catProgress.quizTotal}`
                        : '미응시'}
                    </span>
                    <span className={`category-stamp ${cleared ? 'cleared' : ''}`}>
                      {cleared ? '🏆' : '🔒'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="study-tip">
            <h3>📖 학습 가이드</h3>
            <ul>
              <li>각 카테고리의 학습 자료를 먼저 꼼꼼히 읽으세요.</li>
              <li>학습 후 도장깨기 퀴즈를 풀어보세요 (70% 이상 정답 시 도장 획득).</li>
              <li>틀린 문제는 해설을 확인하고 해당 내용을 다시 복습하세요.</li>
              <li>모든 도장을 깨면 AIF-C01 시험 준비 완료!</li>
            </ul>
          </div>
          {Object.keys(progress).length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                className="btn"
                style={{ background: 'var(--bg-section)', color: 'var(--text-secondary)', fontSize: '0.82rem' }}
                onClick={() => { if (confirm('모든 진행 상황을 초기화하시겠습니까?')) resetProgress() }}
              >
                진행 상황 초기화
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
