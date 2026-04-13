import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { getAvatarUrl, isAdmin, type Post } from '../../lib/community'
import { timeAgo } from '../../lib/timeago'
import CommentSection from '../../components/community/CommentSection'
import WriteForm from '../../components/community/WriteForm'

export default function InquiryDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const admin = isAdmin(user)
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
        // 일반 사용자는 본인 문의만 열람 가능
        if (!isAdmin(user) && data.author_id !== user?.id) {
          setLoading(false)
          return
        }
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
  }, [id, user])

  const handleDelete = async () => {
    if (!post || !confirm('이 문의를 삭제하시겠습니까?')) return
    await supabase.from('posts').delete().eq('id', post.id)
    navigate('/community/inquiry')
  }

  const canEdit = post && (user?.id === post.author_id || admin)

  if (loading) return <div className="loading-spinner">로딩 중...</div>
  if (!post) return (
    <section className="community-page">
      <div className="container">
        <div className="community-empty">
          <span className="community-empty-icon">🔍</span>
          <p>문의를 찾을 수 없습니다.</p>
        </div>
      </div>
    </section>
  )

  if (editing) {
    return (
      <section className="community-page">
        <div className="container">
          <WriteForm
            type="inquiry"
            editPost={post}
            onCancel={() => setEditing(false)}
            backPath="/community/inquiry"
          />
        </div>
      </section>
    )
  }

  return (
    <section className="community-page">
      <div className="container">
        <div className="community-detail">
          <Link to="/community/inquiry" className="community-detail-back">← 문의 목록</Link>

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

          <div className="community-detail-content">{post.content}</div>

          {canEdit && (
            <div className="community-detail-actions">
              {user?.id === post.author_id && (
                <button className="community-detail-edit" onClick={() => setEditing(true)}>수정</button>
              )}
              <button className="community-detail-delete" onClick={handleDelete}>삭제</button>
            </div>
          )}

          <CommentSection postId={post.id} />
        </div>
      </div>
    </section>
  )
}
