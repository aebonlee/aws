import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/', { replace: true })
      } else {
        // 세션 파싱 실패 시 로그인 페이지로
        navigate('/login', { replace: true })
      }
    }
  }, [loading, user, navigate])

  return (
    <section className="community-page">
      <div className="container" style={{ textAlign: 'center', paddingTop: '120px' }}>
        <div className="loading-spinner">로그인 처리 중...</div>
      </div>
    </section>
  )
}
