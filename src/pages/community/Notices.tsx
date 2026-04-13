import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { getAvatarUrl, isAdmin, PAGE_SIZE, type Notice } from '../../lib/community'
import { timeAgo } from '../../lib/timeago'

export default function Notices() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const admin = isAdmin(user)
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [showWrite, setShowWrite] = useState(false)

  // write form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pinned, setPinned] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !admin || !title.trim() || !content.trim()) return
    setSubmitting(true)

    const { data, error } = await supabase
      .from('notices')
      .insert({
        author_id: user.id,
        title: title.trim(),
        content: content.trim(),
        is_pinned: pinned,
      })
      .select('id')
      .single()

    if (!error && data) {
      navigate(`/community/notices/${data.id}`)
    }
    setSubmitting(false)
  }

  if (showWrite && admin) {
    return (
      <section className="community-page">
        <div className="container">
          <form className="community-write-form" onSubmit={handleSubmit}>
            <h2>공지사항 작성</h2>
            <div className="community-form-group">
              <label>제목</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="공지 제목을 입력하세요" required />
            </div>
            <div className="community-form-group">
              <label>내용</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="공지 내용을 입력하세요" required />
            </div>
            <div className="community-form-group">
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
                상단 고정
              </label>
            </div>
            <div className="community-form-actions">
              <button type="button" className="btn" onClick={() => setShowWrite(false)}
                style={{ background: 'var(--bg-section)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                취소
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? '저장 중...' : '작성 완료'}
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  }

  return (
    <section className="community-page">
      <div className="container">
        <div className="community-hero">
          <h1>공지사항</h1>
          <p>서비스 관련 중요 공지를 확인하세요.</p>
        </div>

        {admin && (
          <div className="community-toolbar">
            <div />
            <button className="btn btn-primary" onClick={() => setShowWrite(true)}>
              공지 작성
            </button>
          </div>
        )}

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
