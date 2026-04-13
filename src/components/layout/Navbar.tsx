import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { useLang } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import { isAdmin } from '../../lib/community'
import { CERT_LEVELS } from '../../lib/certifications'
import { CATEGORIES } from '../../lib/categories'

const COMMUNITY_MENU = [
  { title: '공지사항', path: '/community/notices', icon: '📢' },
  { title: '게시판', path: '/community/board', icon: '📋' },
  { title: '시험합격수기', path: '/community/success-stories', icon: '🏆' },
  { title: '시험팁공유', path: '/community/tips', icon: '💡' },
  { title: '문의하기', path: '/community/inquiry', icon: '💬' },
]


// AIF-C01 study pages (public)
const PUBLIC_PATHS = new Set([
  '/', '/about', '/login', '/auth/callback', '/pricing',
])

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { lang, toggleLang } = useLang()
  const { user, signOut } = useAuth()
  const admin = isAdmin(user)
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null)
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    setOpenDropdown(null)
    setMobileOpen(false)
    setMobileAccordion(null)
  }, [location.pathname])

  const handleMouseEnter = (id: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current)
    setOpenDropdown(id)
  }

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150)
  }

  const handleProtectedClick = (e: React.MouseEvent, path: string) => {
    if (!user && !PUBLIC_PATHS.has(path)) {
      e.preventDefault()
      navigate('/login')
    }
  }

  const isAifPage = CATEGORIES.some(c => location.pathname === c.path) || location.pathname === '/'
  const isCertPage = CERT_LEVELS.some(l => l.certs.some(c => c.available && location.pathname === c.path))

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-logo">
          <span>AWS</span> Certification
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links">
          <Link
            to="/about"
            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          >
            About
          </Link>

          {/* AWS Certification mega dropdown */}
          <div
            className="nav-dropdown"
            onMouseEnter={() => handleMouseEnter('certifications')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`nav-link nav-dropdown-trigger ${isCertPage ? 'active' : ''}`}
            >
              AWS Certification <span className="nav-arrow">&#9662;</span>
            </button>
            {openDropdown === 'certifications' && (
              <div className="nav-dropdown-menu nav-mega-menu">
                {CERT_LEVELS.map(level => (
                  <div key={level.id} className="nav-mega-group">
                    <div className="nav-mega-header">{level.title} <span className="nav-mega-header-ko">{level.titleKo}</span></div>
                    {level.certs.map(cert => {
                      const isPublic = cert.code === 'AIF-C01'
                      const needsLogin = !isPublic && !user
                      return (
                        <Link
                          key={cert.code}
                          to={cert.available ? cert.path : '#'}
                          className={`nav-dropdown-item ${!cert.available ? 'disabled' : ''} ${
                            cert.available && location.pathname === cert.path ? 'active' : ''
                          }`}
                          onClick={e => {
                            if (!cert.available) { e.preventDefault(); return }
                            if (!isPublic) handleProtectedClick(e, cert.path)
                          }}
                        >
                          <span className="nav-dropdown-code">{cert.code}</span>
                          <span className="nav-dropdown-title">{cert.title}</span>
                          {!cert.available && <span className="nav-dropdown-soon">준비 중</span>}
                          {needsLogin && cert.available && <span className="nav-dropdown-lock">🔒</span>}
                        </Link>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AIF-C01 AI Practitioner dropdown */}
          <div
            className="nav-dropdown"
            onMouseEnter={() => handleMouseEnter('aif')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`nav-link nav-dropdown-trigger ${isAifPage ? 'active' : ''}`}
            >
              AIF-C01 학습 <span className="nav-arrow">&#9662;</span>
            </button>
            {openDropdown === 'aif' && (
              <div className="nav-dropdown-menu">
                {CATEGORIES.map(cat => (
                  <Link
                    key={cat.id}
                    to={cat.path}
                    className={`nav-dropdown-item ${location.pathname === cat.path ? 'active' : ''}`}
                    onClick={e => handleProtectedClick(e, cat.path)}
                  >
                    <span className="nav-dropdown-title">{cat.title}</span>
                    <span className="nav-dropdown-weight">{cat.weight}</span>
                    {!user && <span className="nav-dropdown-lock">🔒</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="nav-divider" />

          <Link
            to="/stamp"
            className={`nav-link nav-link-accent ${location.pathname === '/stamp' ? 'active' : ''}`}
            onClick={e => handleProtectedClick(e, '/stamp')}
          >
            도장깨기{!user && ' 🔒'}
          </Link>
          <Link
            to="/practice"
            className={`nav-link nav-link-accent ${location.pathname === '/practice' ? 'active' : ''}`}
            onClick={e => handleProtectedClick(e, '/practice')}
          >
            문제풀이{!user && ' 🔒'}
          </Link>

          <div
            className="nav-dropdown"
            onMouseEnter={() => handleMouseEnter('community')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`nav-link nav-dropdown-trigger ${
                location.pathname.startsWith('/community') ? 'active' : ''
              }`}
            >
              커뮤니티 <span className="nav-arrow">&#9662;</span>
            </button>
            {openDropdown === 'community' && (
              <div className="nav-dropdown-menu">
                {COMMUNITY_MENU.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-dropdown-item ${
                      location.pathname === item.path ? 'active' : ''
                    }`}
                    onClick={e => handleProtectedClick(e, item.path)}
                  >
                    <span className="nav-dropdown-code">{item.icon}</span>
                    <span className="nav-dropdown-title">{item.title}</span>
                    {!user && <span className="nav-dropdown-lock">🔒</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/library"
            className={`nav-link ${location.pathname === '/library' ? 'active' : ''}`}
          >
            {lang === 'en' ? 'Library' : '자료실'}
          </Link>

          <Link
            to="/pricing"
            className={`nav-link ${location.pathname === '/pricing' ? 'active' : ''}`}
          >
            {lang === 'en' ? 'Pricing' : '요금제'}
          </Link>
        </div>

        {/* Actions */}
        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleLang} title={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}>
            {lang === 'ko' ? 'EN' : 'KO'}
          </button>
          <button className="theme-toggle" onClick={toggleTheme} title="테마 전환">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {user ? (
            <div
              className="nav-user-info"
              onMouseEnter={() => handleMouseEnter('user-menu')}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email || 'U')}&background=FF9900&color=fff&size=32`}
                alt="avatar"
                className="nav-user-avatar"
              />
              <span className="nav-user-name">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
              {openDropdown === 'user-menu' && (
                <div className="nav-user-tooltip">
                  <Link to="/dashboard" className="nav-user-tooltip-item">대시보드</Link>
                  <Link to="/profile" className="nav-user-tooltip-item">개인정보</Link>
                  {admin && <Link to="/admin/coupons" className="nav-user-tooltip-item">쿠폰 관리</Link>}
                  <div className="nav-user-tooltip-divider" />
                  <button className="nav-user-tooltip-item nav-user-tooltip-logout" onClick={signOut}>로그아웃</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-login-btn">로그인</Link>
          )}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`nav-mobile ${mobileOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>홈</Link>
        <Link to="/about" className="nav-link" onClick={() => setMobileOpen(false)}>About</Link>

        {/* AWS Certification accordion */}
        <div className="nav-mobile-group">
          <button
            className="nav-mobile-group-header"
            onClick={() => setMobileAccordion(mobileAccordion === 'certifications' ? null : 'certifications')}
          >
            <span>AWS Certification</span>
            <span className={`nav-arrow ${mobileAccordion === 'certifications' ? 'open' : ''}`}>&#9662;</span>
          </button>
          {mobileAccordion === 'certifications' && (
            <div className="nav-mobile-group-items">
              {CERT_LEVELS.map(level => (
                <div key={level.id}>
                  <div className="nav-mobile-level-header">{level.title} ({level.titleKo})</div>
                  {level.certs.map(cert => {
                    const isPublic = cert.code === 'AIF-C01'
                    const needsLogin = !isPublic && !user
                    return (
                      <Link
                        key={cert.code}
                        to={cert.available ? cert.path : '#'}
                        className={`nav-link nav-mobile-sub ${!cert.available ? 'disabled' : ''}`}
                        onClick={e => {
                          if (!cert.available) { e.preventDefault(); return }
                          if (!isPublic) handleProtectedClick(e, cert.path)
                          if (cert.available && (user || isPublic)) setMobileOpen(false)
                        }}
                      >
                        <span className="nav-dropdown-code">{cert.code}</span> {cert.title}
                        {!cert.available && <span className="nav-dropdown-soon">준비 중</span>}
                        {needsLogin && cert.available && <span className="nav-dropdown-lock">🔒</span>}
                      </Link>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AIF-C01 AI Practitioner accordion */}
        <div className="nav-mobile-group">
          <button
            className="nav-mobile-group-header"
            onClick={() => setMobileAccordion(mobileAccordion === 'aif' ? null : 'aif')}
          >
            <span>AIF-C01 학습</span>
            <span className={`nav-arrow ${mobileAccordion === 'aif' ? 'open' : ''}`}>&#9662;</span>
          </button>
          {mobileAccordion === 'aif' && (
            <div className="nav-mobile-group-items">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.id}
                  to={cat.path}
                  className={`nav-link nav-mobile-sub ${location.pathname === cat.path ? 'active' : ''}`}
                  onClick={e => { handleProtectedClick(e, cat.path); if (user) setMobileOpen(false) }}
                >
                  {cat.title}
                  {!user && <span className="nav-dropdown-lock">🔒</span>}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="nav-mobile-divider" />

        <Link
          to="/stamp"
          className="nav-link nav-link-accent"
          onClick={e => { handleProtectedClick(e, '/stamp'); if (user) setMobileOpen(false) }}
        >
          도장깨기{!user && ' 🔒'}
        </Link>
        <Link
          to="/practice"
          className="nav-link nav-link-accent"
          onClick={e => { handleProtectedClick(e, '/practice'); if (user) setMobileOpen(false) }}
        >
          문제풀이{!user && ' 🔒'}
        </Link>

        <div className="nav-mobile-group">
          <button
            className="nav-mobile-group-header"
            onClick={() => setMobileAccordion(mobileAccordion === 'community' ? null : 'community')}
          >
            <span>커뮤니티</span>
            <span className={`nav-arrow ${mobileAccordion === 'community' ? 'open' : ''}`}>&#9662;</span>
          </button>
          {mobileAccordion === 'community' && (
            <div className="nav-mobile-group-items">
              {COMMUNITY_MENU.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="nav-link nav-mobile-sub"
                  onClick={e => { handleProtectedClick(e, item.path); if (user) setMobileOpen(false) }}
                >
                  <span>{item.icon}</span> {item.title}
                  {!user && <span className="nav-dropdown-lock">🔒</span>}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          to="/library"
          className="nav-link"
          onClick={() => setMobileOpen(false)}
        >
          {lang === 'en' ? 'Library' : '자료실'}
        </Link>
        <Link
          to="/pricing"
          className="nav-link"
          onClick={() => setMobileOpen(false)}
        >
          {lang === 'en' ? 'Pricing' : '요금제'}
        </Link>

        {user && (
          <>
            <div className="nav-mobile-divider" />
            <Link
              to="/dashboard"
              className="nav-link nav-link-accent"
              onClick={() => setMobileOpen(false)}
            >
              대시보드
            </Link>
            {admin && (
              <Link
                to="/admin/coupons"
                className="nav-link nav-link-accent"
                onClick={() => setMobileOpen(false)}
              >
                쿠폰 관리
              </Link>
            )}
          </>
        )}

        <div className="nav-mobile-divider" />
        {user ? (
          <div className="nav-mobile-user">
            <img
              src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email || 'U')}&background=FF9900&color=fff&size=32`}
              alt="avatar"
              className="nav-user-avatar"
            />
            <span className="nav-user-name">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
            <button className="nav-logout-btn" onClick={() => { signOut(); setMobileOpen(false) }}>로그아웃</button>
          </div>
        ) : (
          <Link to="/login" className="nav-link" onClick={() => setMobileOpen(false)}>로그인</Link>
        )}
      </div>
    </nav>
  )
}
