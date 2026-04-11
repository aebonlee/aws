import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { CATEGORIES } from '../../lib/categories'

const EXTRA_LINKS = [
  { path: '/stamp', title: '도장깨기' },
  { path: '/practice', title: '문제풀이' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-logo">
          <span>AWS</span> AIF-C01
        </Link>
        <div className="nav-links">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={cat.path}
              className={`nav-link ${location.pathname === cat.path ? 'active' : ''}`}
            >
              {cat.title}
            </Link>
          ))}
          {EXTRA_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link nav-link-accent ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="테마 전환">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
      <div className={`nav-mobile ${mobileOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>홈</Link>
        {CATEGORIES.map(cat => (
          <Link
            key={cat.id}
            to={cat.path}
            className={`nav-link ${location.pathname === cat.path ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {cat.title}
          </Link>
        ))}
        {EXTRA_LINKS.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link nav-link-accent ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {link.title}
          </Link>
        ))}
      </div>
    </nav>
  )
}
