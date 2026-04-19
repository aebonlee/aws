import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { user, loading, signInWithGoogle, signInWithKakao } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')

  useEffect(() => {
    if (!loading && user) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [user, loading, navigate, location.state])

  const tabDesc = activeTab === 'login'
    ? '소셜 계정으로 간편하게 로그인하세요.'
    : '처음 방문이라면 소셜 로그인으로 바로 가입됩니다.'

  return (
    <section className="community-page">
      <div className="container">
        <div className="login-box">
          <h1>AWS 자격증 스터디</h1>

          {/* Tabs */}
          <div className="login-tabs">
            <button
              type="button"
              className={`login-tab${activeTab === 'login' ? ' active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              로그인
            </button>
            <button
              type="button"
              className={`login-tab${activeTab === 'register' ? ' active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              회원가입
            </button>
          </div>

          <p className="login-tab-desc">{tabDesc}</p>

          <div className="login-social-buttons">
            <button className="login-social-btn login-google" onClick={signInWithGoogle}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {activeTab === 'login' ? 'Google로 로그인' : 'Google로 가입하기'}
            </button>
            <button className="login-social-btn login-kakao" onClick={signInWithKakao}>
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 3C6.48 3 2 6.36 2 10.44c0 2.62 1.75 4.93 4.37 6.24-.19.7-.69 2.54-.79 2.93-.12.49.18.48.38.35.15-.1 2.44-1.66 3.43-2.33.52.08 1.06.12 1.61.12 5.52 0 10-3.36 10-7.31S17.52 3 12 3z" fill="#3C1E1E"/>
              </svg>
              {activeTab === 'login' ? 'Kakao로 로그인' : 'Kakao로 가입하기'}
            </button>
          </div>

          {activeTab === 'register' && (
            <p className="login-tab-note">
              소셜 계정으로 처음 로그인하면 자동으로 회원 가입이 완료됩니다.<br />
              별도의 회원가입 절차 없이 바로 이용하실 수 있습니다.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
