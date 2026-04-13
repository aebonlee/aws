import { useProgress } from '../contexts/ProgressContext'

interface SectionStatusBarProps {
  categoryId: string
  sectionId: string
}

export default function SectionStatusBar({ categoryId, sectionId }: SectionStatusBarProps) {
  const { getSectionProgress, markSectionComplete, markSectionNeedsReview } = useProgress()
  const sp = getSectionProgress(categoryId, sectionId)

  const statusClass =
    sp.reviewStatus === 'completed' ? 'status-completed' :
    sp.reviewStatus === 'needs-review' ? 'status-review' : 'status-none'

  const statusLabel =
    sp.reviewStatus === 'completed' ? '학습완료' :
    sp.reviewStatus === 'needs-review' ? '재복습 필요' : '미완료'

  return (
    <div className={`section-status-bar ${statusClass}`}>
      <span className={`section-badge ${statusClass}`}>{statusLabel}</span>
      <div className="section-status-actions">
        {sp.reviewStatus !== 'completed' && (
          <button
            className="btn-section btn-section-complete"
            onClick={() => markSectionComplete(categoryId, sectionId)}
          >
            학습완료
          </button>
        )}
        {sp.reviewStatus !== 'needs-review' && (
          <button
            className="btn-section btn-section-review"
            onClick={() => markSectionNeedsReview(categoryId, sectionId)}
          >
            재복습
          </button>
        )}
      </div>
    </div>
  )
}
