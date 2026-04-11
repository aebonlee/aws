import { ReactNode, useState } from 'react'

interface ToggleSectionProps {
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

export default function ToggleSection({ title, defaultOpen = false, children }: ToggleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="toggle-section">
      <div className="toggle-header" onClick={() => setOpen(!open)}>
        <span className={`toggle-arrow ${open ? 'open' : ''}`}>▶</span>
        {title}
      </div>
      {open && <div className="toggle-body">{children}</div>}
    </div>
  )
}
