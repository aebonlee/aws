import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { CERT_LEVELS } from '../lib/certifications'

const LEVEL_COLORS: Record<string, string> = {
  foundational: '#10b981',
  associate: '#3b82f6',
  professional: '#8b5cf6',
  specialty: '#ef4444',
}

const JOB_PATHS = [
  {
    category: '아키텍처',
    roles: [
      { title: 'Solutions Architect', desc: '클라우드 인프라 설계, 개발, 관리 및 애플리케이션 마이그레이션', certs: ['CLF-C02', 'AIF-C01', 'SAA-C03', 'SAP-C02'] },
      { title: '애플리케이션 아키텍트', desc: '사용자 인터페이스, 미들웨어, 인프라를 포함한 애플리케이션 아키텍처 설계', certs: ['CLF-C02', 'AIF-C01', 'SAA-C03', 'SAP-C02'] },
    ],
  },
  {
    category: '데이터 분석',
    roles: [
      { title: '클라우드 데이터 엔지니어', desc: '정형/반정형 데이터의 수집 및 처리 자동화, 데이터 파이프라인 성능 모니터링', certs: ['CLF-C02', 'AIF-C01', 'DEA-C01', 'MLA-C01'] },
    ],
  },
  {
    category: '개발',
    roles: [
      { title: '소프트웨어 개발 엔지니어', desc: '플랫폼 및 디바이스 전반의 소프트웨어 개발, 구성 및 유지 관리', certs: ['CLF-C02', 'AIF-C01', 'DVA-C02'] },
      { title: '테스트 엔지니어', desc: '설계부터 출시까지 제품 수명 주기 전반의 테스트 및 품질 관리', certs: ['CLF-C02', 'AIF-C01', 'DVA-C02'] },
    ],
  },
  {
    category: '운영',
    roles: [
      { title: '시스템 관리자', desc: '컴퓨터 구성 요소 및 소프트웨어 설치, 업그레이드, 유지 관리 및 자동화', certs: ['CLF-C02', 'AIF-C01', 'SOA-C02'] },
      { title: '클라우드 엔지니어', desc: '네트워크 컴퓨팅 인프라 구현/운영, 보안 시스템 구현', certs: ['CLF-C02', 'AIF-C01', 'SOA-C02'] },
    ],
  },
  {
    category: 'DevOps',
    roles: [
      { title: '클라우드 DevOps 엔지니어', desc: '대규모 하이브리드 클라우드 환경 설계/배포/운영, CI/CD 파이프라인 자동화', certs: ['CLF-C02', 'AIF-C01', 'DVA-C02', 'DOP-C02', 'MLA-C01'] },
      { title: 'DevSecOps 엔지니어', desc: 'CI/CD 원칙으로 기능을 빠르고 안정적으로 제공, 보안 통합', certs: ['CLF-C02', 'AIF-C01', 'DVA-C02', 'DOP-C02', 'SCS-C02'] },
    ],
  },
  {
    category: '보안',
    roles: [
      { title: '클라우드 보안 엔지니어', desc: '보안 아키텍처 설계, 사이버 보안 설계 개발, 보안 조치 추적', certs: ['CLF-C02', 'AIF-C01', 'SOA-C02', 'SCS-C02'] },
      { title: '클라우드 보안 아키텍트', desc: '거버넌스 적용으로 비즈니스/기술 위험을 최소화하는 솔루션 설계', certs: ['CLF-C02', 'AIF-C01', 'SAA-C03', 'SCS-C02'] },
    ],
  },
  {
    category: '네트워킹',
    roles: [
      { title: '네트워크 엔지니어', desc: 'LAN, WAN, 인트라넷, 엑스트라넷 등 네트워크 설계 및 구현', certs: ['CLF-C02', 'AIF-C01', 'SOA-C02', 'ANS-C01'] },
    ],
  },
  {
    category: 'AI/ML',
    roles: [
      { title: '프롬프트 엔지니어', desc: '텍스트 프롬프트를 설계, 테스트 및 수정하여 AI 언어 모델 성능 최적화', certs: ['CLF-C02', 'AIF-C01', 'MLA-C01'] },
      { title: '기계 학습 엔지니어', desc: 'AI 시스템 연구/구축/설계, 예측 모델 자동화, ML 시스템 설계', certs: ['CLF-C02', 'AIF-C01', 'MLA-C01', 'SCS-C02'] },
      { title: '기계 학습 Ops 엔지니어', desc: 'AI/ML 플랫폼과 인프라 구축/유지 관리, 모델 배포 인프라 설계', certs: ['CLF-C02', 'AIF-C01', 'MLA-C01', 'SCS-C02'] },
      { title: '데이터 과학자', desc: '비즈니스 문제 해결을 위한 AI/ML 모델 개발, 훈련, 미세 조정, 성능 평가', certs: ['CLF-C02', 'AIF-C01', 'MLA-C01', 'SCS-C02'] },
    ],
  },
]

const SECTIONS = [
  { id: 'choose', title: '자격증 선택 방법' },
  { id: 'levels', title: '레벨별 구분' },
  { id: 'job-paths', title: '직무별 추천 경로' },
  { id: 'steps', title: '시험 준비 4단계' },
  { id: 'reviews', title: '취득 후기' },
  { id: 'cert-pdf', title: '자격증 경로 PDF' },
]

export default function About() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )

    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observerRef.current!.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="about-page">
      {/* Hero */}
      <div className="about-hero">
        <div className="container">
          <h1>AWS Certification 가이드</h1>
          <p>AWS 자격증 체계를 이해하고, 경력 목표에 맞는 자격증 여정을 계획하세요.</p>
        </div>
      </div>

      <div className="about-layout container">
        {/* Sidebar */}
        <aside className="about-sidebar">
          <nav className="about-sidebar-nav">
            {SECTIONS.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`about-sidebar-link ${activeSection === s.id ? 'active' : ''}`}
                onClick={e => {
                  e.preventDefault()
                  document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {s.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="about-content">
          {/* 자격증 선택 방법 */}
          <section id="choose" className="about-section">
            <h2>AWS Certification을 선택하는 방법</h2>
            <div className="about-cards-row">
              <div className="about-card">
                <h3>IT 경력이 없는 경우</h3>
                <p>Cloud Practitioner로 기본 AWS 클라우드 지식을 검증한 다음, AI Practitioner를 취득합니다.</p>
                <p className="about-card-result">수요가 많은 클라우드 및 AI 직무에 대비하고 추가 자격증 취득의 기반을 마련합니다.</p>
              </div>
              <div className="about-card">
                <h3>영업/마케팅/비즈니스 직무</h3>
                <p>Cloud Practitioner로 기본 지식을 검증한 다음, AI Practitioner를 취득합니다.</p>
                <p className="about-card-result">AI 및 클라우드 지식으로 경쟁 우위를 강화하며 경력 발전의 기반을 마련합니다.</p>
              </div>
              <div className="about-card">
                <h3>IT/STEM 분야 1~3년 경력</h3>
                <p>해당 직무에 맞는 Associate 수준의 자격증으로 시작합니다. AI 지식 검증에는 AI Practitioner가 권장됩니다.</p>
                <p className="about-card-result">AI/ML 프로젝트에 기여할 수 있는 자신감과 신뢰도를 높이고 고급 자격증 취득의 기반을 마련합니다.</p>
              </div>
            </div>
          </section>

          {/* 자격증 레벨 */}
          <section id="levels" className="about-section">
            <h2>자격증 레벨별 구분</h2>
            <p className="about-section-desc">AWS Certification은 4단계 레벨로 구성됩니다.</p>

            {CERT_LEVELS.map(level => (
              <div key={level.id} className="about-level-group">
                <div className="about-level-header">
                  <span className="about-level-badge" style={{ background: LEVEL_COLORS[level.id] }}>
                    {level.title}
                  </span>
                  <span className="about-level-title">{level.titleKo}</span>
                </div>
                <div className="about-cert-grid">
                  {level.certs.map(cert => (
                    <div key={cert.code} className={`about-cert-card ${cert.available ? 'available' : ''}`}>
                      <div className="about-cert-header">
                        <span className="about-cert-code">{cert.code}</span>
                        {cert.available && <span className="about-cert-active">학습 가능</span>}
                        {!cert.available && <span className="about-cert-soon">준비 중</span>}
                      </div>
                      <h3>{cert.title}</h3>
                      <p className="about-cert-title-ko">{cert.titleKo}</p>
                      <p className="about-cert-desc">{cert.description}</p>
                      {cert.available && (
                        <Link to={cert.path} className="btn btn-primary about-cert-btn">학습 시작</Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* 직무별 추천 경로 */}
          <section id="job-paths" className="about-section">
            <h2>직무별 추천 자격증 경로</h2>
            <p className="about-section-desc">관심 있는 직무를 선택하고 경력 목표를 달성하기 위한 자격증 여정을 시작하세요.</p>

            <div className="about-job-list">
              {JOB_PATHS.map(group => (
                <div key={group.category} className="about-job-group">
                  <h3 className="about-job-category">{group.category}</h3>
                  {group.roles.map(role => (
                    <div key={role.title} className="about-job-card">
                      <h4>{role.title}</h4>
                      <p>{role.desc}</p>
                      <div className="about-job-certs">
                        {role.certs.map(code => (
                          <span key={code} className="about-job-cert-badge">{code}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* 시험 준비 단계 */}
          <section id="steps" className="about-section">
            <h2>시험 준비 4단계</h2>
            <div className="about-steps">
              <div className="about-step">
                <div className="about-step-num">1</div>
                <h3>시험 알아보기</h3>
                <p>시험 스타일로 출제된 문제를 통해 시험에 대해 알아봅니다.</p>
              </div>
              <div className="about-step">
                <div className="about-step-num">2</div>
                <h3>지식/기술 강화</h3>
                <p>AWS Skill Builder를 통해 AWS 지식과 기술을 강화합니다.</p>
              </div>
              <div className="about-step">
                <div className="about-step-num">3</div>
                <h3>복습 및 연습</h3>
                <p>AWS Skill Builder에서 시험에 대비하여 복습 및 연습합니다.</p>
              </div>
              <div className="about-step">
                <div className="about-step-num">4</div>
                <h3>시험 응시</h3>
                <p>시험 준비도를 평가하고 자신 있게 응시합니다.</p>
              </div>
            </div>
          </section>

          {/* 후기 */}
          <section id="reviews" className="about-section">
            <h2>자격증 취득 후기</h2>
            <div className="about-quotes">
              <blockquote className="about-quote">
                <p>"자격증은 신뢰성을 높여주고 실제 프로젝트에서 모범 사례를 배우고 구현하려는 저의 헌신을 보여줍니다. AWS Certified Solutions Architect - Professional, AWS Certified DevOps Engineer - Professional 자격증은 투입한 시간과 노력 대비 가장 큰 가치를 안겨주었습니다."</p>
                <cite>- Igor Soroka, 프리랜스 클라우드 소프트웨어 컨설턴트</cite>
              </blockquote>
              <blockquote className="about-quote">
                <p>"AWS 에코시스템, 제공되는 서비스, 각 서비스에 적합한 사용 사례를 훨씬 더 잘 이해할 수 있게 되었습니다. AWS Certified Solutions Architect - Associate 자격증부터 시작해서 지금은 AWS Certification을 10개 보유하고 있습니다."</p>
                <cite>- Rola Dali, 데이터 과학 선임 리드</cite>
              </blockquote>
            </div>
          </section>

          {/* PDF 미리보기 */}
          <section id="cert-pdf" className="about-section">
            <h2>AWS Certification 경로 PDF</h2>
            <p className="about-section-desc">AWS 공식 자격증 경로 가이드 문서를 확인하세요.</p>
            <div className="about-pdf-viewer">
              <iframe
                src="/AWS_certification_paths.pdf"
                title="AWS Certification Paths PDF"
                className="about-pdf-frame"
              />
              <a
                href="/AWS_certification_paths.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost about-pdf-download"
              >
                PDF 새 탭에서 열기
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
