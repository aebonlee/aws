import { Link } from 'react-router-dom'
import { useProgress } from '../contexts/ProgressContext'
import { CATEGORIES } from '../lib/categories'

export default function Home() {
  const { progress, getCompletionRate, isCleared, resetProgress } = useProgress()
  const completionRate = getCompletionRate()
  const clearedCount = CATEGORIES.filter(c => isCleared(c.id)).length
  const studiedCount = CATEGORIES.filter(c => progress[c.id]?.studied).length

  return (
    <>
      <section className="hero">
        <div className="hero-bg-pattern" />
        <div className="container hero-content">
          <div className="hero-badge">AWS Certified</div>
          <h1>AI Practitioner<br /><span>AIF-C01</span></h1>
          <p className="hero-subtitle">
            AWS Certified AI Practitioner 자격증 시험을 위한<br />
            체계적인 학습 가이드와 424문제 완벽 해설
          </p>
          <div className="hero-exam-info">
            <span>65문제</span>
            <span className="hero-dot" />
            <span>90분</span>
            <span className="hero-dot" />
            <span>합격선 70%</span>
            <span className="hero-dot" />
            <span>150 USD</span>
          </div>
          <div className="hero-cta">
            <Link to="/study/ai-ml-basics" className="btn btn-primary btn-lg">학습 시작하기</Link>
            <Link to="/practice" className="btn btn-ghost btn-lg">문제풀이</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">8</div>
              <div className="hero-stat-label">학습 도메인</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value">424</div>
              <div className="hero-stat-label">실전 문제</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value">100%</div>
              <div className="hero-stat-label">해설 완비</div>
            </div>
          </div>
        </div>
      </section>

      <section className="progress-section">
        <div className="container">
          <div className="progress-card">
            <div className="progress-header">
              <h2 className="progress-title">나의 학습 현황</h2>
              <p className="progress-subtitle">도메인별 도장을 모두 모아 시험 준비를 완료하세요</p>
            </div>
            <div className="progress-metrics">
              <div className="progress-metric progress-metric-ring">
                <div className="progress-ring-wrap">
                  <svg className="progress-ring" viewBox="0 0 80 80">
                    <circle className="progress-ring-bg" cx="40" cy="40" r="34" />
                    <circle
                      className="progress-ring-fill"
                      cx="40" cy="40" r="34"
                      strokeDasharray={`${2 * Math.PI * 34}`}
                      strokeDashoffset={`${2 * Math.PI * 34 * (1 - completionRate / 100)}`}
                    />
                  </svg>
                  <span className="progress-ring-text">{completionRate}%</span>
                </div>
                <div className="progress-metric-label">진행률</div>
              </div>
              <div className="progress-metric">
                <span className="progress-metric-icon">📖</span>
                <div>
                  <div className="progress-metric-value">{studiedCount}/8</div>
                  <div className="progress-metric-label">학습 완료</div>
                </div>
              </div>
              <div className="progress-metric">
                <span className="progress-metric-icon">🏆</span>
                <div>
                  <div className="progress-metric-value">{clearedCount}/8</div>
                  <div className="progress-metric-label">도장 획득</div>
                </div>
              </div>
              <div className="progress-metric">
                <span className="progress-metric-icon">📝</span>
                <div>
                  <div className="progress-metric-value">424</div>
                  <div className="progress-metric-label">전체 문제</div>
                </div>
              </div>
            </div>
            {clearedCount === 8 && (
              <div className="progress-complete">
                모든 도장을 획득했습니다! 시험 준비 완료!
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">학습 도메인</h2>
            <p className="section-subtitle">AIF-C01 시험의 8개 도메인을 학습하고 퀴즈로 실력을 검증하세요</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat, idx) => {
              const cleared = isCleared(cat.id)
              const catProgress = progress[cat.id]
              const studied = catProgress?.studied === true
              return (
                <Link key={cat.id} to={cat.path} className={`category-card ${cleared ? 'cleared' : ''}`}>
                  <div className="category-card-number">Domain {idx + 1}</div>
                  <div className="category-card-header">
                    <span className="category-icon">{cat.icon}</span>
                    <span className={`category-stamp ${cleared ? 'cleared' : ''}`}>
                      {cleared ? '🏆' : studied ? '📖' : '🔒'}
                    </span>
                  </div>
                  <h3 className="category-title">{cat.title}</h3>
                  <p className="category-desc">{cat.description}</p>
                  <div className="category-footer">
                    <div className="category-tags">
                      <span className="badge badge-primary">{cat.weight}</span>
                      <span className="badge badge-info">{cat.questions}문제</span>
                    </div>
                    <span className="category-score">
                      {catProgress?.quizScore != null
                        ? `${catProgress.quizScore}/${catProgress.quizTotal}`
                        : '미응시'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">학습 가이드</h2>
            <p className="section-subtitle">효율적인 합격 전략을 따라 학습하세요</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-step">1</div>
              <h3>도메인별 학습</h3>
              <p>핵심 개념, 서비스, 용어를 정리한 가이드를 읽으며 기초를 다지세요.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">2</div>
              <h3>도장깨기 퀴즈</h3>
              <p>랜덤 10문제 퀴즈에서 70% 이상 정답을 맞춰 도장을 획득하세요.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">3</div>
              <h3>전체 문제 복습</h3>
              <p>424문제 전체를 한/영 해설과 함께 꼼꼼히 복습하세요.</p>
            </div>
            <div className="feature-card">
              <div className="feature-step">4</div>
              <h3>실전 모의고사</h3>
              <p>카테고리별 또는 전체 랜덤 문제풀이로 실전 감각을 키우세요.</p>
            </div>
          </div>
        </div>
      </section>

      {Object.keys(progress).length > 0 && (
        <section className="section">
          <div className="container" style={{ textAlign: 'center' }}>
            <button
              className="btn btn-reset"
              onClick={() => { if (confirm('모든 진행 상황을 초기화하시겠습니까?')) resetProgress() }}
            >
              진행 상황 초기화
            </button>
          </div>
        </section>
      )}
    </>
  )
}
