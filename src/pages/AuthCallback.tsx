import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      navigate('/', { replace: true })
    }
  }, [loading, navigate])

  return (
    <section className="community-page">
      <div className="container" style={{ textAlign: 'center', paddingTop: '120px' }}>
        <div className="loading-spinner">로그인 처리 중...</div>
      </div>
    </section>
  )
}
