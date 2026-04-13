import type { StampTier } from '../contexts/ProgressContext'

interface StampTierBadgeProps {
  tier: StampTier
  size?: 'sm' | 'md' | 'lg'
}

const TIER_CONFIG: Record<StampTier, { label: string; emoji: string; className: string }> = {
  gold: { label: 'Gold', emoji: '🥇', className: 'stamp-tier-gold' },
  silver: { label: 'Silver', emoji: '🥈', className: 'stamp-tier-silver' },
  bronze: { label: 'Bronze', emoji: '🥉', className: 'stamp-tier-bronze' },
  none: { label: '미획득', emoji: '⬜', className: 'stamp-tier-none' },
}

export default function StampTierBadge({ tier, size = 'md' }: StampTierBadgeProps) {
  const config = TIER_CONFIG[tier]

  return (
    <span className={`stamp-tier-badge ${config.className} stamp-tier-${size}`}>
      <span className="stamp-tier-emoji">{config.emoji}</span>
      <span className="stamp-tier-label">{config.label}</span>
    </span>
  )
}
