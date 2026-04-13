import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { isAdmin } from '../lib/community'

const FREE_PAGE_LIMIT = 5
const STORAGE_PREFIX = 'free_trial_'

function getViewedPages(userId: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_PREFIX + userId) || '[]')
  } catch {
    return []
  }
}

export default function FreeTrialGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const admin = isAdmin(user)

  const viewedPages = user ? getViewedPages(user.id) : []
  const isAlreadyViewed = viewedPages.includes(location.pathname)
  const isOverLimit = !admin && !isAlreadyViewed && viewedPages.length >= FREE_PAGE_LIMIT
  const remaining = FREE_PAGE_LIMIT - viewedPages.length - (isAlreadyViewed ? 0 : 1)

  // Track new page view (skip for admin)
  useEffect(() => {
    if (!user || admin || isAlreadyViewed || isOverLimit) return
    const updated = [...viewedPages, location.pathname]
    localStorage.setItem(STORAGE_PREFIX + user.id, JSON.stringify(updated))
  }, [user, admin, location.pathname, isAlreadyViewed, isOverLimit])

  if (loading) return <div className="loading-spinner">...</div>
  if (!user) return <Navigate to="/login" replace />
  if (isOverLimit) return <Navigate to="/pricing" replace state={{ fromTrial: true }} />

  return (
    <>
      {children}
      {!admin && remaining >= 0 && remaining < FREE_PAGE_LIMIT && (
        <div className="free-trial-banner">
          무료 체험: {FREE_PAGE_LIMIT - remaining === 0 ? 0 : FREE_PAGE_LIMIT - remaining}/{FREE_PAGE_LIMIT} 페이지 사용
          {remaining === 0 && ' (마지막 무료 페이지입니다)'}
        </div>
      )}
    </>
  )
}
