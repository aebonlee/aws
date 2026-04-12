import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { CERT_LEVELS } from '../../lib/certifications'
import { CATEGORIES } from '../../lib/categories'

const COMMUNITY_MENU = [
  { title: '공지사항', path: '/community/notices', icon: '📢' },
  { title: '게시판', path: '/community/board', icon: '📋' },
  { title: '시험합격수기', path: '/community/success-stories', icon: '🏆' },
  { title: '시험팁공유', path: '/community/tips', icon: '💡' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null)
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>(null)

  // Close dropdown when route changes
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

  const isAifPage = CATEGORIES.some(c => location.pathname === c.path) || location.pathname === '/'

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

          {CERT_LEVELS.map(level => (
            <div
              key={level.id}
              className="nav-dropdown"
              onMouseEnter={() => handleMouseEnter(level.id)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`nav-link nav-dropdown-trigger ${
                  level.id === 'foundational' && isAifPage ? 'active' : ''
                }`}
              >
                {level.title} <span className="nav-arrow">&#9662;</span>
              </button>
              {openDropdown === level.id && (
                <div className="nav-dropdown-menu">
                  {level.certs.map(cert => (
                    <Link
                      key={cert.code}
                      to={cert.available ? cert.path : '#'}
                      className={`nav-dropdown-item ${!cert.available ? 'disabled' : ''} ${
                        cert.available && (cert.path === '/' ? isAifPage : location.pathname === cert.path) ? 'active' : ''
                      }`}
                      onClick={e => { if (!cert.available) e.preventDefault() }}
                    >
                      <span className="nav-dropdown-code">{cert.code}</span>
                      <span className="nav-dropdown-title">{cert.title}</span>
                      {!cert.available && <span className="nav-dropdown-soon">준비 중</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="nav-divider" />

          <Link
            to="/stamp"
            className={`nav-link nav-link-accent ${location.pathname === '/stamp' ? 'active' : ''}`}
          >
            도장깨기
          </Link>
          <Link
            to="/practice"
            className={`nav-link nav-link-accent ${location.pathname === '/practice' ? 'active' : ''}`}
          >
            문제풀이
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
                  >
                    <span className="nav-dropdown-code">{item.icon}</span>
                    <span className="nav-dropdown-title">{item.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="테마 전환">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {user ? (
            <div className="nav-user-info">
              <img
                src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email || 'U')}&background=FF9900&color=fff&size=32`}
                alt="avatar"
                className="nav-user-avatar"
              />
              <span className="nav-user-name">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
              <button className="nav-logout-btn" onClick={signOut}>로그아웃</button>
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

        {CERT_LEVELS.map(level => (
          <div key={level.id} className="nav-mobile-group">
            <button
              className="nav-mobile-group-header"
              onClick={() => setMobileAccordion(mobileAccordion === level.id ? null : level.id)}
            >
              <span>{level.title} ({level.titleKo})</span>
              <span className={`nav-arrow ${mobileAccordion === level.id ? 'open' : ''}`}>&#9662;</span>
            </button>
            {mobileAccordion === level.id && (
              <div className="nav-mobile-group-items">
                {level.certs.map(cert => (
                  <Link
                    key={cert.code}
                    to={cert.available ? cert.path : '#'}
                    className={`nav-link nav-mobile-sub ${!cert.available ? 'disabled' : ''}`}
                    onClick={e => {
                      if (!cert.available) { e.preventDefault(); return }
                      setMobileOpen(false)
                    }}
                  >
                    <span className="nav-dropdown-code">{cert.code}</span> {cert.title}
                    {!cert.available && <span className="nav-dropdown-soon">준비 중</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="nav-mobile-divider" />

        <Link to="/stamp" className="nav-link nav-link-accent" onClick={() => setMobileOpen(false)}>도장깨기</Link>
        <Link to="/practice" className="nav-link nav-link-accent" onClick={() => setMobileOpen(false)}>문제풀이</Link>

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
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{item.icon}</span> {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>

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
