import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { CATEGORIES } from '../../lib/categories'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-logo">
          ☁️ <span>AWS</span> AIF-C01
        </Link>
        <div className="nav-links">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={cat.path}
              className={`nav-link ${location.pathname === cat.path ? 'active' : ''}`}
            >
              {cat.icon} {cat.title}
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
        <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>🏠 홈</Link>
        {CATEGORIES.map(cat => (
          <Link
            key={cat.id}
            to={cat.path}
            className={`nav-link ${location.pathname === cat.path ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {cat.icon} {cat.title}
          </Link>
        ))}
      </div>
    </nav>
  )
}
