import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { getAvatarUrl, type Post } from '../../lib/community'
import { timeAgo } from '../../lib/timeago'
import LikeButton from '../../components/community/LikeButton'
import CommentSection from '../../components/community/CommentSection'
import WriteForm from '../../components/community/WriteForm'

export default function TipDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
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
        setPost(data)
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
    navigate('/community/tips')
  }

  if (loading) return <div className="loading-spinner">로딩 중...</div>
  if (!post) return (
    <section className="community-page">
      <div className="container">
        <div className="community-empty">
          <span className="community-empty-icon">🔍</span>
          <p>게시글을 찾을 수 없습니다.</p>
        </div>
      </div>
    </section>
  )

  if (editing) {
    return (
      <section className="community-page">
        <div className="container">
          <WriteForm
            type="tip"
            editPost={post}
            onCancel={() => setEditing(false)}
            backPath="/community/tips"
          />
        </div>
      </section>
    )
  }

  return (
    <section className="community-page">
      <div className="container">
        <div className="community-detail">
          <Link to="/community/tips" className="community-detail-back">← 팁 목록</Link>

          <div className="community-detail-header">
            {post.tags?.map((t) => (
              <span key={t} className="community-card-badge" style={{ marginBottom: 8, marginRight: 4 }}>{t}</span>
            ))}
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
