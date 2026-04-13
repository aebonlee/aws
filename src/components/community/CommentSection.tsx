import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { getAvatarUrl, type Comment } from '../../lib/community'
import { timeAgo } from '../../lib/timeago'

interface CommentSectionProps {
  postId: string
  tableName?: string // 'post_comments' | 'notice_comments' — default: post_comments
}

export default function CommentSection({ postId, tableName = 'post_comments' }: CommentSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const idField = tableName === 'notice_comments' ? 'notice_id' : 'post_id'

  const load = useCallback(async () => {
    const { data } = await supabase
      .from(`${tableName}_with_author`)
      .select('*')
      .eq(idField, postId)
      .order('created_at', { ascending: true })

    if (!data) return

    // Build tree: top-level + replies
    const top: Comment[] = []
    const replyMap = new Map<string, Comment[]>()

    for (const c of data as Comment[]) {
      if (c.parent_id) {
        const arr = replyMap.get(c.parent_id) || []
        arr.push(c)
        replyMap.set(c.parent_id, arr)
      } else {
        top.push(c)
      }
    }

    for (const c of top) {
      c.replies = replyMap.get(c.id) || []
    }

    setComments(top)
  }, [postId, tableName, idField])

  useEffect(() => { load() }, [load])

  const submit = async () => {
    if (!user || !text.trim()) return
    setSubmitting(true)
    await supabase.from(tableName).insert({
      [idField]: postId,
      author_id: user.id,
      content: text.trim(),
      parent_id: null,
    })
    setText('')
    await load()
    setSubmitting(false)
  }

  const submitReply = async (parentId: string) => {
    if (!user || !replyText.trim()) return
    setSubmitting(true)
    await supabase.from(tableName).insert({
      [idField]: postId,
      author_id: user.id,
      content: replyText.trim(),
      parent_id: parentId,
    })
    setReplyTo(null)
    setReplyText('')
    await load()
    setSubmitting(false)
  }

  const submitEdit = async (commentId: string) => {
    if (!editText.trim()) return
    setSubmitting(true)
    await supabase.from(tableName).update({ content: editText.trim() }).eq('id', commentId)
    setEditId(null)
    setEditText('')
    await load()
    setSubmitting(false)
  }

  const deleteComment = async (commentId: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return
    await supabase.from(tableName).delete().eq('id', commentId)
    await load()
  }

  const totalCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)

  const renderComment = (c: Comment, isReply = false) => (
    <div key={c.id} className={`community-comment${isReply ? ' reply' : ''}`}>
      <img
        className="community-comment-avatar"
        src={getAvatarUrl(c.author_name, c.author_avatar)}
        alt=""
      />
      <div className="community-comment-body">
        <div className="community-comment-header">
          <span className="community-comment-author">{c.author_name || '익명'}</span>
          <span className="community-comment-date">{timeAgo(c.created_at)}</span>
        </div>
        {editId === c.id ? (
          <div className="community-comment-input" style={{ marginTop: 0 }}>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
            />
            <button onClick={() => submitEdit(c.id)} disabled={submitting}>수정</button>
            <button
              onClick={() => setEditId(null)}
              style={{ background: 'var(--bg-section)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              취소
            </button>
          </div>
        ) : (
          <div className="community-comment-content">{c.content}</div>
        )}
        <div className="community-comment-actions">
          {!isReply && user && (
            <button onClick={() => { setReplyTo(replyTo === c.id ? null : c.id); setReplyText('') }}>
              답글
            </button>
          )}
          {user?.id === c.author_id && editId !== c.id && (
            <>
              <button onClick={() => { setEditId(c.id); setEditText(c.content) }}>수정</button>
              <button onClick={() => deleteComment(c.id)}>삭제</button>
            </>
          )}
        </div>
        {replyTo === c.id && (
          <div className="community-comment-input">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="답글을 입력하세요..."
              rows={2}
            />
            <button onClick={() => submitReply(c.id)} disabled={submitting || !replyText.trim()}>
              답글
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="community-comments">
      <h3 className="community-comments-title">댓글 {totalCount}개</h3>

      {comments.map((c) => (
        <div key={c.id}>
          {renderComment(c)}
          {c.replies?.map((r) => renderComment(r, true))}
        </div>
      ))}

      {user ? (
        <div className="community-comment-input">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="댓글을 입력하세요..."
            rows={2}
          />
          <button onClick={submit} disabled={submitting || !text.trim()}>등록</button>
        </div>
      ) : (
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: 16 }}>
          댓글을 작성하려면 로그인이 필요합니다.
        </p>
      )}
    </div>
  )
}
