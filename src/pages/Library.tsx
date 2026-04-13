import { useState } from 'react'
import { useLang } from '../contexts/LanguageContext'

const PDF_DOCS = [
  { id: 'exam-guide', title: 'AIF-C01 시험 가이드', titleEn: 'AIF-C01 Exam Guide', desc: 'AWS 공식 시험 안내 문서', descEn: 'AWS Official Exam Guide', file: '/ai-practitioner-01.pdf' },
  { id: 'summary', title: 'AIF-C01 핵심 정리', titleEn: 'AIF-C01 Key Summary', desc: '시험 대비 핵심 요약 자료', descEn: 'Exam preparation summary', file: '/c.pdf' },
  { id: 'cert-paths', title: 'AWS 인증 경로', titleEn: 'AWS Certification Paths', desc: 'AWS 자격증 체계 전체 로드맵', descEn: 'Full AWS certification roadmap', file: '/AWS_certification_paths.pdf' },
]

export default function Library() {
  const { lang } = useLang()
  const [activeDoc, setActiveDoc] = useState(PDF_DOCS[0].id)

  const currentDoc = PDF_DOCS.find(d => d.id === activeDoc) || PDF_DOCS[0]

  return (
    <div className="library-page">
      <div className="container">
        <div className="library-layout">
          <aside className="library-sidebar">
            <h3 className="library-sidebar-title">{lang === 'en' ? 'Documents' : '자료 목록'}</h3>
            {PDF_DOCS.map(doc => (
              <button
                key={doc.id}
                className={`library-sidebar-item ${activeDoc === doc.id ? 'active' : ''}`}
                onClick={() => setActiveDoc(doc.id)}
              >
                <span className="library-sidebar-icon">&#128196;</span>
                <div>
                  <div className="library-sidebar-name">{lang === 'en' ? doc.titleEn : doc.title}</div>
                  <div className="library-sidebar-desc">{lang === 'en' ? doc.descEn : doc.desc}</div>
                </div>
              </button>
            ))}
          </aside>
          <main className="library-viewer">
            <div className="library-viewer-header">
              <h2>{lang === 'en' ? currentDoc.titleEn : currentDoc.title}</h2>
              <div className="library-viewer-actions">
                <a href={currentDoc.file} download className="btn btn-secondary library-download-btn">
                  {lang === 'en' ? 'Download' : '다운로드'}
                </a>
                <a href={currentDoc.file} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  {lang === 'en' ? 'Open in New Tab' : '새 탭에서 열기'}
                </a>
              </div>
            </div>
            <iframe
              key={currentDoc.id}
              src={currentDoc.file}
              className="library-pdf-frame"
              title={currentDoc.title}
            />
          </main>
        </div>
      </div>
    </div>
  )
}
