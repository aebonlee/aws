import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { getAvatarUrl, PAGE_SIZE, type Notice } from '../../lib/community'
import { timeAgo } from '../../lib/timeago'

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  const load = useCallback(async (pageNum: number, append = false) => {
    setLoading(true)
    const from = pageNum * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data } = await supabase
      .from('notices_with_author')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (data) {
      setNotices((prev) => append ? [...prev, ...data] : data)
      setHasMore(data.length === PAGE_SIZE)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load(0) }, [load])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    load(next, true)
  }

  return (
    <section className="community-page">
      <div className="container">
        <div className="community-hero">
          <h1>공지사항</h1>
          <p>서비스 관련 중요 공지를 확인하세요.</p>
        </div>

        {notices.length === 0 && !loading ? (
          <div className="community-empty">
            <span className="community-empty-icon">📢</span>
            <p>등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="community-list">
              {notices.map((n) => (
                <Link
                  key={n.id}
                  to={`/community/notices/${n.id}`}
                  className={`community-card${n.is_pinned ? ' pinned' : ''}`}
                >
                  <img
                    className="community-card-avatar"
                    src={getAvatarUrl(n.author_name, n.author_avatar)}
                    alt=""
                  />
                  <div className="community-card-body">
                    <div className="community-card-header">
                      <span className="community-card-author">{n.author_name || '관리자'}</span>
                      <span className="community-card-date">{timeAgo(n.created_at)}</span>
                    </div>
                    <div className="community-card-title">
                      {n.is_pinned && '📌 '}{n.title}
                    </div>
                    <div className="community-card-preview">{n.content}</div>
                    <div className="community-card-meta">
                      <span>👁 {n.view_count}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {hasMore && (
              <div className="community-load-more">
                <button onClick={loadMore} disabled={loading}>
                  {loading ? '로딩 중...' : '더 보기'}
                </button>
              </div>
            )}
          </>
        )}

        {loading && notices.length === 0 && (
          <div className="loading-spinner">로딩 중...</div>
        )}
      </div>
    </section>
  )
}
