import { useParams, Link } from 'react-router-dom'

const PDF_DOCS: Record<string, { title: string; description: string; src: string }> = {
  'exam-guide': {
    title: 'AIF-C01 시험 가이드',
    description: 'AWS 공식 AI Practitioner 시험 안내 문서',
    src: '/ai-practitioner-01.pdf',
  },
  'summary': {
    title: 'AIF-C01 핵심 정리',
    description: '시험 대비 핵심 요약 자료',
    src: '/c.pdf',
  },
}

export default function PdfViewer() {
  const { docId } = useParams<{ docId: string }>()
  const doc = docId ? PDF_DOCS[docId] : null

  if (!doc) {
    return (
      <div className="practice-page">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h2>문서를 찾을 수 없습니다</h2>
          <Link to="/aif-c01" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            AIF-C01 페이지로 이동
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="practice-page">
      <div className="container">
        <div style={{ marginBottom: '1rem' }}>
          <Link to="/aif-c01" className="btn btn-secondary" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
            AIF-C01 페이지로
          </Link>
          <h1 style={{ margin: '0.5rem 0 0.25rem' }}>{doc.title}</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>{doc.description}</p>
        </div>
        <div style={{
          border: '1px solid var(--border-color)',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          background: 'var(--bg-section)',
        }}>
          <iframe
            src={doc.src}
            title={doc.title}
            style={{ width: '100%', height: 'calc(100vh - 220px)', minHeight: '500px', border: 'none', display: 'block' }}
          />
          <div style={{
            padding: '0.5rem 1rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>{doc.title}</span>
            <a href={doc.src} target="_blank" rel="noopener noreferrer">
              새 탭에서 열기
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
