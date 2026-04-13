import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../lib/categories'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3><span style={{ color: 'var(--primary)' }}>Dream</span>IT <span style={{ opacity: 0.7 }}>Biz</span></h3>
            <p>AWS Certification 학습 사이트. 도장깨기로 체계적으로 학습하세요.</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>학습 카테고리</h4>
              {CATEGORIES.slice(0, 4).map(cat => (
                <Link key={cat.id} to={cat.path}>{cat.title}</Link>
              ))}
            </div>
            <div>
              <h4>학습 카테고리</h4>
              {CATEGORIES.slice(4).map(cat => (
                <Link key={cat.id} to={cat.path}>{cat.title}</Link>
              ))}
            </div>
            <div>
              <h4>연락처</h4>
              <a href="mailto:aebon@dreamitbiz.com">aebon@dreamitbiz.com</a>
              <span>010-3700-0629</span>
              <span>카카오톡: aebon</span>
              <span>평일 09:00 ~ 18:00</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} 드림아이티비즈(DreamIT Biz). All rights reserved.</p>
          <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.25rem' }}>
            대표이사: 이애본 | 사업자등록번호: 601-45-20154 | 통신판매신고번호: 제2024-수원팔달-0584호 | 출판사 신고번호: 제2026-000026호
          </p>
        </div>
      </div>
    </footer>
  )
}
