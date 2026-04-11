import { ReactNode, useState, useEffect, useRef } from 'react'
import { useProgress } from '../contexts/ProgressContext'

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
  const { isCleared, progress } = useProgress()
  const cleared = isCleared(categoryId)
  const catProgress = progress[categoryId]

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
            {sections.map(s => (
              <button
                key={s.id}
                className={`sidebar-link ${activeSection === s.id ? 'active' : ''}`}
                onClick={() => scrollToSection(s.id)}
              >
                {s.title}
              </button>
            ))}
          </aside>
          <div className="guide-content" ref={contentRef}>
            <div className="stamp-status">
              <span className="stamp-icon">{cleared ? '✅' : '📋'}</span>
              <div className="stamp-info">
                <h3>{cleared ? '도장 획득 완료!' : '도장깨기 진행 중'}</h3>
                <p>
                  {cleared
                    ? `완료 일시: ${new Date(catProgress?.completedAt || '').toLocaleDateString('ko-KR')}`
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
