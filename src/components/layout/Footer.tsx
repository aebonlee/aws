import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../lib/categories'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>
              <span className="brand-dream">Dream</span>
              <span className="brand-it">IT</span>{' '}
              <span className="brand-biz">Biz</span>
            </h3>
            <p>AWS Certification 학습 사이트.<br />도장깨기로 체계적으로 학습하세요.</p>
            <div className="footer-family">
              <select
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) window.open(e.target.value, '_blank')
                  e.target.value = ''
                }}
              >
                <option value="" disabled>Family Site</option>
                <option value="https://www.dreamitbiz.com">DreamIT Biz 메인</option>
                <option value="https://allthat.dreamitbiz.com">DreamIT 올댓</option>
                <option value="https://books.dreamitbiz.com">DreamIT Biz 출판사</option>
              </select>
            </div>
          </div>

          <div className="footer-links">
            <h4>학습 카테고리</h4>
            <ul>
              {CATEGORIES.map(cat => (
                <li key={cat.id}><Link to={cat.path}>{cat.title}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer-contact">
            <h4>연락처</h4>
            <p className="footer-email">
              <span className="footer-email-icon">&#9993;</span>
              <a href="mailto:aebon@dreamitbiz.com">aebon@dreamitbiz.com</a>
            </p>
            <p>010-3700-0629</p>
            <p>카카오톡: aebon</p>
            <p className="footer-hours">평일 09:00 ~ 18:00</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} 드림아이티비즈(DreamIT Biz). All rights reserved.</p>
          <p className="footer-bottom-info">
            대표이사: 이애본 | 사업자등록번호: 601-45-20154 | 통신판매신고번호: 제2024-수원팔달-0584호 | 출판사 신고번호: 제2026-000026호
          </p>
        </div>
      </div>
    </footer>
  )
}
