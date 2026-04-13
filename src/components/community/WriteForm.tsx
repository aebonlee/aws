import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import {
  BOARD_CATEGORIES,
  TIP_TAGS,
  type Post,
} from '../../lib/community'

interface WriteFormProps {
  type: 'board' | 'tip' | 'success_story'
  editPost?: Post | null
  onCancel: () => void
  backPath: string
}

export default function WriteForm({ type, editPost, onCancel, backPath }: WriteFormProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isEdit = !!editPost

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tag, setTag] = useState('')
  // success_story fields
  const [examName, setExamName] = useState('')
  const [examScore, setExamScore] = useState('')
  const [examDate, setExamDate] = useState('')
  const [studyPeriod, setStudyPeriod] = useState('')
  const [difficultyRating, setDifficultyRating] = useState(3)

  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title)
      setContent(editPost.content)
      setCategory(editPost.category || '')
      if (editPost.tags?.length) setTag(editPost.tags[0])
      const s = editPost as any
      if (s.exam_name) setExamName(s.exam_name)
      if (s.exam_score) setExamScore(String(s.exam_score))
      if (s.exam_date) setExamDate(s.exam_date)
      if (s.study_period) setStudyPeriod(s.study_period)
      if (s.difficulty_rating) setDifficultyRating(s.difficulty_rating)
    }
  }, [editPost])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title.trim() || !content.trim()) return
    setSubmitting(true)

    const base: Record<string, unknown> = {
      title: title.trim(),
      content: content.trim(),
      type,
    }

    if (type === 'board') base.category = category || '일반'
    if (type === 'tip') base.tags = tag ? [tag] : []
    if (type === 'success_story') {
      base.exam_name = examName || null
      base.exam_score = examScore ? Number(examScore) : null
      base.exam_date = examDate || null
      base.study_period = studyPeriod || null
      base.difficulty_rating = difficultyRating
    }

    if (isEdit && editPost) {
      const { error } = await supabase
        .from('posts')
        .update(base)
        .eq('id', editPost.id)
      if (!error) navigate(`${backPath}/${editPost.id}`)
    } else {
      base.author_id = user.id
      const { data, error } = await supabase
        .from('posts')
        .insert(base)
        .select('id')
        .single()
      if (!error && data) navigate(`${backPath}/${data.id}`)
    }

    setSubmitting(false)
  }

  return (
    <form className="community-write-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? '글 수정' : '글쓰기'}</h2>

      {type === 'board' && (
        <div className="community-form-group">
          <label>카테고리</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {BOARD_CATEGORIES.filter((c) => c.value).map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      )}

      {type === 'tip' && (
        <div className="community-form-group">
          <label>태그</label>
          <select value={tag} onChange={(e) => setTag(e.target.value)}>
            {TIP_TAGS.filter((t) => t.value).map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      )}

      {type === 'success_story' && (
        <>
          <div className="community-form-row">
            <div className="community-form-group">
              <label>시험 이름</label>
              <input value={examName} onChange={(e) => setExamName(e.target.value)} placeholder="예: AWS AIF-C01" />
            </div>
            <div className="community-form-group">
              <label>점수</label>
              <input type="number" value={examScore} onChange={(e) => setExamScore(e.target.value)} placeholder="예: 850" min={0} max={1000} />
            </div>
          </div>
          <div className="community-form-row">
            <div className="community-form-group">
              <label>시험 날짜</label>
              <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
            </div>
            <div className="community-form-group">
              <label>학습 기간</label>
              <input value={studyPeriod} onChange={(e) => setStudyPeriod(e.target.value)} placeholder="예: 2개월" />
            </div>
          </div>
          <div className="community-form-group">
            <label>난이도 (1~5)</label>
            <div className="community-stars" style={{ fontSize: '1.4rem', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} onClick={() => setDifficultyRating(n)} className={n <= difficultyRating ? '' : 'star-empty'}>
                  ★
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="community-form-group">
        <label>제목</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          required
        />
      </div>

      <div className="community-form-group">
        <label>내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          required
        />
      </div>

      <div className="community-form-actions">
        <button type="button" className="btn" onClick={onCancel}
          style={{ background: 'var(--bg-section)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          취소
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? '저장 중...' : isEdit ? '수정 완료' : '작성 완료'}
        </button>
      </div>
    </form>
  )
}
