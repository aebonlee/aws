import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import Quiz, { QuizQuestion } from '../components/Quiz'
import { CATEGORIES } from '../lib/categories'

const sections = [
  { id: 'exam-overview', title: '시험 개요' },
  { id: 'domains', title: '출제 도메인' },
  { id: 'exam-resources', title: '시험 참고 자료' },
  { id: 'study-guide', title: '학습 가이드' },
  { id: 'quiz', title: '실력 점검 퀴즈' },
]

const quizQuestions: QuizQuestion[] = [
  { question: '지도 학습(Supervised Learning)의 특징으로 올바른 것은?', options: ['레이블이 없는 데이터를 사용한다', '레이블이 있는 데이터로 학습한다', '보상 신호를 통해 학습한다', '데이터 없이 규칙을 생성한다'], answer: 1, explanation: '지도 학습은 입력과 정답(레이블)이 쌍으로 구성된 데이터를 사용하여 모델을 학습시킵니다.' },
  { question: 'Amazon Bedrock의 주요 기능은?', options: ['EC2 인스턴스 관리', 'Foundation Model API 제공', '데이터베이스 백업', '네트워크 모니터링'], answer: 1, explanation: 'Amazon Bedrock은 다양한 Foundation Model을 API로 제공하는 완전관리형 서비스입니다.' },
  { question: 'RAG(Retrieval-Augmented Generation)의 목적은?', options: ['모델 크기를 줄이는 것', '외부 지식을 활용하여 응답 정확도를 높이는 것', '학습 속도를 높이는 것', '모델을 처음부터 재학습하는 것'], answer: 1, explanation: 'RAG는 외부 데이터 소스에서 관련 정보를 검색하여 LLM 응답의 정확성과 최신성을 높입니다.' },
  { question: 'Temperature 파라미터를 낮게 설정하면?', options: ['더 창의적인 응답 생성', '더 일관되고 예측 가능한 응답', '응답 길이가 길어짐', '처리 속도가 느려짐'], answer: 1, explanation: 'Temperature가 낮을수록 확률이 높은 토큰을 선택하여 일관되고 사실적인 응답을 생성합니다.' },
  { question: 'AWS Responsible AI 원칙에 포함되지 않는 것은?', options: ['공정성', '투명성', '수익성', '프라이버시'], answer: 2, explanation: '수익성은 Responsible AI 원칙이 아닙니다. 공정성, 설명 가능성, 프라이버시, 안전성 등이 핵심 원칙입니다.' },
]

export default function AifC01() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('aif-c01') }, [markStudied])

  return (
    <GuideLayout title="AWS AI Practitioner" description="AI/ML 기초, 생성형 AI, 프롬프트 엔지니어링, 책임감 있는 AI, AWS AI 서비스에 대한 이해를 검증합니다." icon="🤖" badges={[{ label: '기초 레벨', type: 'primary' }, { label: '65문제 / 90분', type: 'info' }]} sections={sections} categoryId="aif-c01">

      <section id="exam-overview">
        <h2>시험 개요</h2>
        <table className="info-table"><thead><tr><th>항목</th><th>내용</th></tr></thead><tbody>
          <tr><td><strong>시험 코드</strong></td><td>AIF-C01</td></tr>
          <tr><td><strong>문항 수</strong></td><td>65문제 (채점 50 + 비채점 15)</td></tr>
          <tr><td><strong>시험 시간</strong></td><td>130분 (시험 90분 + 설문 10분 + 타국어 핸디캡 30분)</td></tr>
          <tr><td><strong>합격 점수</strong></td><td>700 / 1000</td></tr>
          <tr><td><strong>시험 비용</strong></td><td>$100 USD</td></tr>
          <tr><td><strong>유효 기간</strong></td><td>3년</td></tr>
          <tr><td><strong>문제 형식</strong></td><td>객관식 + 복수 선택</td></tr>
          <tr><td><strong>시험 언어</strong></td><td>영어, 일본어, 한국어, 포르투갈어, 중국어</td></tr>
        </tbody></table>

        <TipBox type="important" title="AI 입문자 환영">
          <p>AWS 클라우드 및 AI/ML 경험이 6개월 이상이면 도전 가능한 기초 레벨 자격증입니다. 코딩 경험은 필수가 아닙니다.</p>
        </TipBox>

        <h3>권장 준비 기간</h3>
        <table className="info-table"><thead><tr><th>배경</th><th>준비 기간</th></tr></thead><tbody>
          <tr><td>AI/ML 경험 있음</td><td>2~3주</td></tr>
          <tr><td>AWS 경험만 있음</td><td>4~6주</td></tr>
          <tr><td>완전 입문자</td><td>6~8주</td></tr>
        </tbody></table>
      </section>

      <section id="domains">
        <h2>출제 도메인</h2>
        <p>시험은 5개 도메인으로 구성되며, 총 424문제의 연습 문제가 준비되어 있습니다.</p>

        <table className="info-table"><thead><tr><th>도메인</th><th>비중</th><th>주요 내용</th></tr></thead><tbody>
          <tr><td><strong>1. AI/ML 기초</strong></td><td>20%</td><td>AI/ML/DL 개념, 지도/비지도/강화 학습, AWS AI 서비스</td></tr>
          <tr><td><strong>2. 생성형 AI 기초</strong></td><td>24%</td><td>Foundation Model, LLM, Transformer, 추론 파라미터</td></tr>
          <tr><td><strong>3. FM 활용</strong></td><td>28%</td><td>프롬프트 엔지니어링, Bedrock, Amazon Q, RAG</td></tr>
          <tr><td><strong>4. 책임감 있는 AI</strong></td><td>14%</td><td>공정성, 편향, 투명성, Guardrails</td></tr>
          <tr><td><strong>5. AI 보안/거버넌스</strong></td><td>14%</td><td>데이터 보호, 규정 준수, 공유 책임 모델</td></tr>
        </tbody></table>

        <TipBox type="warning">
          <p><strong>FM 활용 + 생성형 AI 기초</strong>가 전체의 52%를 차지합니다. 프롬프트 엔지니어링과 Bedrock을 집중적으로 학습하세요.</p>
        </TipBox>
      </section>

      <section id="exam-resources">
        <h2>시험 참고 자료</h2>
        <p>AWS 공식 시험 가이드와 핵심 정리 자료를 확인하세요.</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <a
            href="/ai-practitioner-01.pdf"
            download
            className="exam-resource-card"
          >
            <span className="exam-resource-icon">&#128196;</span>
            <div>
              <div className="exam-resource-title">AIF-C01 시험 가이드</div>
              <div className="exam-resource-desc">AWS 공식 시험 안내 문서 (PDF)</div>
            </div>
          </a>
          <a
            href="/c.pdf"
            download
            className="exam-resource-card"
          >
            <span className="exam-resource-icon">&#128203;</span>
            <div>
              <div className="exam-resource-title">AIF-C01 핵심 정리</div>
              <div className="exam-resource-desc">시험 대비 핵심 요약 자료 (PDF)</div>
            </div>
          </a>
        </div>
      </section>

      <section id="study-guide">
        <h2>학습 가이드</h2>
        <p>8개 카테고리별 상세 학습 페이지에서 깊이 있는 내용을 확인하세요.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={cat.path}
              style={{
                display: 'block',
                padding: '1.2rem',
                border: '1px solid rgba(200,200,200,0.4)',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,153,0,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,200,200,0.4)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{cat.title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{cat.description}</div>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.78rem' }}>
                <span className="badge badge-info">{cat.weight}</span>
                <span className="badge badge-primary">{cat.questions}문제</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="quiz">
        <h2>실력 점검 퀴즈</h2>
        <p>AIF-C01 전반적인 이해도를 간단히 점검해보세요.</p>
        <Quiz questions={quizQuestions} categoryId="aif-c01" categoryTitle="AWS AI Practitioner" />
      </section>

    </GuideLayout>
  )
}
