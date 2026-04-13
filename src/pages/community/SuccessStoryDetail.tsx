import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { getAvatarUrl, type SuccessStory } from '../../lib/community'
import { timeAgo } from '../../lib/timeago'
import LikeButton from '../../components/community/LikeButton'
import CommentSection from '../../components/community/CommentSection'
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

export default function SuccessStoryDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState<SuccessStory | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const { data } = await supabase
        .from('posts_with_author')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        setPost(data as SuccessStory)
        const viewKey = `viewed-post-${id}`
        if (!sessionStorage.getItem(viewKey)) {
          await supabase
            .from('posts')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', id)
          sessionStorage.setItem(viewKey, '1')
        }
      }
      setLoading(false)
    })()
  }, [id])

  const handleDelete = async () => {
    if (!post || !confirm('정말 삭제하시겠습니까?')) return
    await supabase.from('posts').delete().eq('id', post.id)
    navigate('/community/success-stories')
  }

  if (loading) return <div className="loading-spinner">로딩 중...</div>
  if (!post) return (
    <section className="community-page">
      <div className="container">
        <div className="community-empty">
          <span className="community-empty-icon">🔍</span>
          <p>합격수기를 찾을 수 없습니다.</p>
        </div>
      </div>
    </section>
  )

  if (editing) {
    return (
      <section className="community-page">
        <div className="container">
          <WriteForm
            type="success_story"
            editPost={post}
            onCancel={() => setEditing(false)}
            backPath="/community/success-stories"
          />
        </div>
      </section>
    )
  }

  return (
    <section className="community-page">
      <div className="container">
        <div className="community-detail">
          <Link to="/community/success-stories" className="community-detail-back">← 합격수기 목록</Link>

          <div className="community-detail-header">
            <h1 className="community-detail-title">{post.title}</h1>
            <div className="community-detail-info">
              <div className="community-detail-author">
                <img src={getAvatarUrl(post.author_name, post.author_avatar)} alt="" />
                <span>{post.author_name || '익명'}</span>
              </div>
              <span className="community-detail-date">{timeAgo(post.created_at)}</span>
              <div className="community-detail-stats">
                <span>👁 {post.view_count}</span>
                <span>💬 {post.comment_count}</span>
              </div>
            </div>
          </div>

          {/* Meta Panel */}
          <div className="community-detail-meta-panel">
            {post.exam_name && (
              <div className="community-meta-item">
                <div className="community-meta-item-label">시험</div>
                <div className="community-meta-item-value">{post.exam_name}</div>
              </div>
            )}
            {post.exam_score != null && (
              <div className="community-meta-item">
                <div className="community-meta-item-label">점수</div>
                <div className="community-meta-item-value">{post.exam_score}점</div>
              </div>
            )}
            {post.exam_date && (
              <div className="community-meta-item">
                <div className="community-meta-item-label">시험일</div>
                <div className="community-meta-item-value">{post.exam_date}</div>
              </div>
            )}
            {post.study_period && (
              <div className="community-meta-item">
                <div className="community-meta-item-label">학습기간</div>
                <div className="community-meta-item-value">{post.study_period}</div>
              </div>
            )}
            {post.difficulty_rating != null && (
              <div className="community-meta-item">
                <div className="community-meta-item-label">난이도</div>
                <div className="community-meta-item-value"><Stars rating={post.difficulty_rating} /></div>
              </div>
            )}
          </div>

          <div className="community-detail-content">{post.content}</div>

          <div className="community-detail-actions">
            <LikeButton targetType="post" targetId={post.id} initialCount={post.like_count} />
            {user?.id === post.author_id && (
              <>
                <button className="community-detail-edit" onClick={() => setEditing(true)}>수정</button>
                <button className="community-detail-delete" onClick={handleDelete}>삭제</button>
              </>
            )}
          </div>

          <CommentSection postId={post.id} />
        </div>
      </div>
    </section>
  )
}
