import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { getAvatarUrl, type Notice } from '../../lib/community'
import { timeAgo } from '../../lib/timeago'

export default function NoticeDetail() {
  const { id } = useParams<{ id: string }>()
  const [notice, setNotice] = useState<Notice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const { data } = await supabase
        .from('notices_with_author')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        setNotice(data)
        // Increment view count (session dedup)
        const viewKey = `viewed-notice-${id}`
        if (!sessionStorage.getItem(viewKey)) {
          await supabase
            .from('notices')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', id)
          sessionStorage.setItem(viewKey, '1')
        }
      }
      setLoading(false)
    })()
  }, [id])

  if (loading) return <div className="loading-spinner">로딩 중...</div>
  if (!notice) return (
    <section className="community-page">
      <div className="container">
        <div className="community-empty">
          <span className="community-empty-icon">🔍</span>
          <p>공지사항을 찾을 수 없습니다.</p>
        </div>
      </div>
    </section>
  )

  return (
    <section className="community-page">
      <div className="container">
        <div className="community-detail">
          <Link to="/community/notices" className="community-detail-back">← 공지사항 목록</Link>

          <div className="community-detail-header">
            <h1 className="community-detail-title">{notice.title}</h1>
            <div className="community-detail-info">
              <div className="community-detail-author">
                <img src={getAvatarUrl(notice.author_name, notice.author_avatar)} alt="" />
                <span>{notice.author_name || '관리자'}</span>
              </div>
              <span className="community-detail-date">{timeAgo(notice.created_at)}</span>
              <div className="community-detail-stats">
                <span>👁 {notice.view_count}</span>
              </div>
            </div>
          </div>

          <div className="community-detail-content">{notice.content}</div>
        </div>
      </div>
    </section>
  )
}
