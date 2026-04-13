import type { User } from '@supabase/supabase-js'

// ── Admin ──

const ADMIN_EMAILS = ['aebon@kakao.com'] as const

export function isAdmin(user: User | null): boolean {
  if (!user) return false
  return ADMIN_EMAILS.includes(user.email as typeof ADMIN_EMAILS[number])
}

// ── Community Types ──

export interface Post {
  id: string
  author_id: string
  type: 'board' | 'tip' | 'success_story' | 'inquiry'
  title: string
  content: string
  category?: string
  tags?: string[]
  is_pinned: boolean
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  updated_at: string
  // joined from view
  author_name?: string
  author_avatar?: string
}

export interface Notice {
  id: string
  author_id: string
  title: string
  content: string
  is_pinned: boolean
  view_count: number
  created_at: string
  updated_at: string
  author_name?: string
  author_avatar?: string
}

export interface SuccessStory extends Post {
  exam_name?: string
  exam_score?: number
  exam_date?: string
  study_period?: string
  difficulty_rating?: number
}

export interface Tip extends Post {
  tags: string[]
}

export interface Comment {
  id: string
  post_id?: string
  notice_id?: string
  author_id: string
  content: string
  parent_id: string | null
  like_count: number
  created_at: string
  updated_at: string
  author_name?: string
  author_avatar?: string
  replies?: Comment[]
}

export interface Like {
  id: string
  user_id: string
  target_type: 'post' | 'comment'
  target_id: string
}

// ── Constants ──

export const BOARD_CATEGORIES = [
  { value: '', label: '전체' },
  { value: '일반', label: '일반' },
  { value: '질문', label: '질문' },
  { value: '토론', label: '토론' },
  { value: '스터디그룹', label: '스터디그룹' },
] as const

export const TIP_TAGS = [
  { value: '', label: '전체' },
  { value: '학습방법', label: '학습방법' },
  { value: '시험전략', label: '시험전략' },
  { value: '자료공유', label: '자료공유' },
  { value: '시간관리', label: '시간관리' },
  { value: '기타', label: '기타' },
] as const

export const PAGE_SIZE = 20

export function getAvatarUrl(name?: string, avatarUrl?: string): string {
  if (avatarUrl) return avatarUrl
  const n = encodeURIComponent(name || '?')
  return `https://ui-avatars.com/api/?name=${n}&background=FF9900&color=fff&size=32`
}
