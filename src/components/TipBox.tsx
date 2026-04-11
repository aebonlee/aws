import { ReactNode } from 'react'

interface TipBoxProps {
  type?: 'info' | 'warning' | 'important' | 'danger'
  title?: string
  children: ReactNode
}

const ICONS: Record<string, string> = { info: 'ℹ️', warning: '⚠️', important: '💡', danger: '🚨' }
const TITLES: Record<string, string> = { info: '참고', warning: '주의', important: '중요', danger: '위험' }

export default function TipBox({ type = 'info', title, children }: TipBoxProps) {
  return (
    <div className={`tip-box ${type}`}>
      <p className="tip-box-title">{ICONS[type]} {title || TITLES[type]}</p>
      <div>{children}</div>
    </div>
  )
}
