import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { getAvatarUrl, PAGE_SIZE, type SuccessStory } from '../../lib/community'
import { timeAgo } from '../../lib/timeago'
import WriteForm from '../../components/community/WriteForm'

function Stars({ rating }: { rating: number }) {
  return (
    <span className="community-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? '' : 'star-empty'}>★</span>
      ))}
    </span>
  )
}

export default function SuccessStories() {
  const { user } = useAuth()
  const [stories, setStories] = useState<SuccessStory[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [showWrite, setShowWrite] = useState(false)

  const load = useCallback(async (pageNum: number, append = false) => {
    setLoading(true)
    const from = pageNum * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data } = await supabase
      .from('posts_with_author')
      .select('*')
      .eq('type', 'success_story')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (data) {
      setStories((prev) => append ? [...prev, ...data] : data)
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

  if (showWrite) {
    return (
      <section className="community-page">
        <div className="container">
          <WriteForm
            type="success_story"
            onCancel={() => setShowWrite(false)}
            backPath="/community/success-stories"
          />
        </div>
      </section>
    )
  }

  return (
    <section className="community-page">
      <div className="container">
        <div className="community-hero">
          <h1>시험합격수기</h1>
          <p>합격 경험을 공유하고 다른 수험생에게 도움을 주세요.</p>
        </div>

        <div className="community-toolbar">
          <div /> {/* spacer */}
          {user && (
            <button className="btn btn-primary" onClick={() => setShowWrite(true)}>
              합격수기 작성
            </button>
          )}
        </div>

        {loading && stories.length === 0 ? (
          <div className="loading-spinner">로딩 중...</div>
        ) : stories.length === 0 ? (
          <div className="community-empty">
            <span className="community-empty-icon">🏆</span>
            <p>아직 작성된 합격수기가 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="community-stories-grid">
              {stories.map((s) => (
                <Link
                  key={s.id}
                  to={`/community/success-stories/${s.id}`}
                  className="community-story-card"
                >
                  <div className="community-story-card-header">
                    <img
                      className="community-card-avatar"
                      src={getAvatarUrl(s.author_name, s.author_avatar)}
                      alt=""
                    />
                    <div>
                      <span className="community-card-author">{s.author_name || '익명'}</span>
                      <br />
                      <span className="community-card-date">{timeAgo(s.created_at)}</span>
                    </div>
                  </div>
                  <div className="community-story-card-title">{s.title}</div>
                  <div className="community-story-meta">
                    {s.exam_name && <span className="community-story-meta-item">📝 {s.exam_name}</span>}
                    {s.exam_score != null && <span className="community-story-meta-item">🎯 {s.exam_score}점</span>}
                    {s.study_period && <span className="community-story-meta-item">📅 {s.study_period}</span>}
                    {s.difficulty_rating != null && (
                      <span className="community-story-meta-item">
                        <Stars rating={s.difficulty_rating} />
                      </span>
                    )}
                  </div>
                  <div className="community-story-card-preview">{s.content}</div>
                  <div className="community-story-card-footer">
                    <span>👁 {s.view_count}</span>
                    <span>❤️ {s.like_count}</span>
                    <span>💬 {s.comment_count}</span>
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
      </div>
    </section>
  )
}
