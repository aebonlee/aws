import { Link } from 'react-router-dom'
import { getAvatarUrl } from '../../lib/community'
import { timeAgo } from '../../lib/timeago'

interface PostCardProps {
  id: string
  title: string
  content: string
  authorName?: string
  authorAvatar?: string
  createdAt: string
  viewCount: number
  likeCount: number
  commentCount: number
  isPinned?: boolean
  badge?: string
  linkTo: string
}

export default function PostCard({
  title, content, authorName, authorAvatar, createdAt,
  viewCount, likeCount, commentCount, isPinned, badge, linkTo,
}: PostCardProps) {
  return (
    <Link to={linkTo} className={`community-card${isPinned ? ' pinned' : ''}`}>
      <img
        className="community-card-avatar"
        src={getAvatarUrl(authorName, authorAvatar)}
        alt={authorName || ''}
      />
      <div className="community-card-body">
        <div className="community-card-header">
          <span className="community-card-author">{authorName || '익명'}</span>
          {badge && <span className="community-card-badge">{badge}</span>}
          <span className="community-card-date">{timeAgo(createdAt)}</span>
        </div>
        <div className="community-card-title">
          {isPinned && '📌 '}{title}
        </div>
        <div className="community-card-preview">{content}</div>
        <div className="community-card-meta">
          <span>👁 {viewCount}</span>
          <span>❤️ {likeCount}</span>
          <span>💬 {commentCount}</span>
        </div>
      </div>
    </Link>
  )
}
