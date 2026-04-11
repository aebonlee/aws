import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '120px 20px' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '16px' }}>404</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        페이지를 찾을 수 없습니다.
      </p>
      <Link to="/" className="btn btn-primary">홈으로 돌아가기</Link>
    </div>
  )
}
