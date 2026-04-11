import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../lib/categories'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>☁️ AWS AIF-C01 학습</h3>
            <p>AWS Certified AI Practitioner 자격증 학습 사이트. 도장깨기로 체계적으로 학습하세요.</p>
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
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AWS AIF-C01 Study. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
