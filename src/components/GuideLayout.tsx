import { ReactNode, useState, useEffect, useRef } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import StampTierBadge from './StampTierBadge'

interface Section {
  id: string
  title: string
}

interface GuideLayoutProps {
  title: string
  description: string
  icon: string
  badges?: { label: string; type: string }[]
  sections: Section[]
  categoryId: string
  children: ReactNode
}

export default function GuideLayout({ title, description, icon, badges, sections, categoryId, children }: GuideLayoutProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '')
  const contentRef = useRef<HTMLDivElement>(null)
  const { isCleared, progress, getSectionProgress, getStampTier } = useProgress()
  const cleared = isCleared(categoryId)
  const catProgress = progress[categoryId]
  const stampTier = getStampTier(categoryId)

  // Sections excluding quiz
  const learningSections = sections.filter(s => s.id !== 'quiz')
  const completedSections = learningSections.filter(s => {
    const sp = getSectionProgress(categoryId, s.id)
    return sp.reviewStatus === 'completed'
  }).length

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    const headings = contentRef.current?.querySelectorAll('section[id]')
    headings?.forEach(h => observer.observe(h))

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const getSectionIcon = (sectionId: string): string => {
    if (sectionId === 'quiz') return ''
    const sp = getSectionProgress(categoryId, sectionId)
    if (sp.reviewStatus === 'completed') return '✅'
    if (sp.reviewStatus === 'needs-review') return '🔄'
    return ''
  }

  return (
    <>
      <div className="guide-hero">
        <div className="container">
          <div className="guide-hero-content">
            <span className="guide-hero-icon">{icon}</span>
            <div>
              <h1>{title}</h1>
              <p>{description}</p>
              {badges && (
                <div className="guide-hero-badges">
                  {badges.map((b, i) => (
                    <span key={i} className={`badge badge-${b.type}`}>{b.label}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="guide-layout">
          <aside className="guide-sidebar">
            <p className="sidebar-title">목차</p>
            {sections.map(s => {
              const sIcon = getSectionIcon(s.id)
              return (
                <button
                  key={s.id}
                  className={`sidebar-link ${activeSection === s.id ? 'active' : ''}`}
                  onClick={() => scrollToSection(s.id)}
                >
                  <span className="sidebar-link-with-status">
                    {sIcon && <span className="sidebar-section-icon">{sIcon}</span>}
                    {s.title}
                  </span>
                </button>
              )
            })}
            {learningSections.length > 0 && (
              <div className="sidebar-progress-mini">
                <div className="sidebar-progress-bar">
                  <div
                    className="sidebar-progress-fill"
                    style={{ width: `${learningSections.length > 0 ? (completedSections / learningSections.length) * 100 : 0}%` }}
                  />
                </div>
                <span>{completedSections}/{learningSections.length} 섹션</span>
              </div>
            )}
          </aside>
          <div className="guide-content" ref={contentRef}>
            <div className="stamp-status">
              <span className="stamp-icon">
                {stampTier !== 'none' ? <StampTierBadge tier={stampTier} size="lg" /> : (cleared ? '✅' : '📋')}
              </span>
              <div className="stamp-info">
                <h3>{cleared ? '도장 획득 완료!' : '도장깨기 진행 중'}</h3>
                <p>
                  {cleared
                    ? `완료 일시: ${new Date(catProgress?.completedAt || '').toLocaleDateString('ko-KR')} | 티어: ${stampTier.toUpperCase()}`
                    : catProgress?.quizScore !== null && catProgress?.quizScore !== undefined
                      ? `최근 퀴즈: ${catProgress.quizScore}/${catProgress.quizTotal} (70% 이상 필요)`
                      : '학습 후 퀴즈를 풀어 도장을 획득하세요!'
                  }
                </p>
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
