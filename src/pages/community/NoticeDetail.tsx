import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { getAvatarUrl, isAdmin, type Notice } from '../../lib/community'
import { timeAgo } from '../../lib/timeago'

export default function NoticeDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const admin = isAdmin(user)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  // edit form state
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editPinned, setEditPinned] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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

  const startEdit = () => {
    if (!notice) return
    setEditTitle(notice.title)
    setEditContent(notice.content)
    setEditPinned(notice.is_pinned)
    setEditing(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notice || !editTitle.trim() || !editContent.trim()) return
    setSubmitting(true)
    await supabase.from('notices').update({
      title: editTitle.trim(),
      content: editContent.trim(),
      is_pinned: editPinned,
    }).eq('id', notice.id)
    setEditing(false)
    // reload
    const { data } = await supabase.from('notices_with_author').select('*').eq('id', notice.id).single()
    if (data) setNotice(data)
    setSubmitting(false)
  }

  const handleDelete = async () => {
    if (!notice || !confirm('이 공지사항을 삭제하시겠습니까?')) return
    await supabase.from('notices').delete().eq('id', notice.id)
    navigate('/community/notices')
  }

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

  if (editing && admin) {
    return (
      <section className="community-page">
        <div className="container">
          <form className="community-write-form" onSubmit={handleUpdate}>
            <h2>공지사항 수정</h2>
            <div className="community-form-group">
              <label>제목</label>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
            </div>
            <div className="community-form-group">
              <label>내용</label>
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} required />
            </div>
            <div className="community-form-group">
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={editPinned} onChange={(e) => setEditPinned(e.target.checked)} />
                상단 고정
              </label>
            </div>
            <div className="community-form-actions">
              <button type="button" className="btn" onClick={() => setEditing(false)}
                style={{ background: 'var(--bg-section)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                취소
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? '저장 중...' : '수정 완료'}
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

          {admin && (
            <div className="community-detail-actions">
              <button className="community-detail-edit" onClick={startEdit}>수정</button>
              <button className="community-detail-delete" onClick={handleDelete}>삭제</button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
