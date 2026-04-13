import { ReactNode } from 'react'

interface ToggleSectionProps {
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

export default function ToggleSection({ title, children }: ToggleSectionProps) {
  return (
    <div className="toggle-section">
      <div className="toggle-header">
        <span className="toggle-arrow open">▶</span>
        {title}
      </div>
      <div className="toggle-body">{children}</div>
    </div>
  )
}
