import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz, { QuizQuestion } from '../components/Quiz'

const sections = [
  { id: 'prompt-basics', title: '프롬프트 엔지니어링 기초' },
  { id: 'techniques', title: '프롬프트 기법' },
  { id: 'bedrock', title: 'Amazon Bedrock' },
  { id: 'amazon-q', title: 'Amazon Q' },
  { id: 'quiz', title: '도장깨기 퀴즈' },
]

const quizQuestions: QuizQuestion[] = [
  { question: 'Zero-shot 프롬프팅이란?', options: ['예시 없이 직접 질문', '1~2개 예시 제공', '단계적 사고 과정 요청', '여러 답변 후 다수결'], answer: 0, explanation: 'Zero-shot은 예시 없이 직접 작업을 지시합니다. "이 문장의 감성을 분석해주세요."' },
  { question: 'Few-shot 프롬프팅의 특징은?', options: ['예시를 전혀 제공하지 않음', '소수의 입력-출력 예시를 제공하여 패턴 학습 유도', '모델을 재학습시킴', '파인 튜닝과 동일'], answer: 1, explanation: 'Few-shot은 2~5개의 입력-출력 예시를 프롬프트에 포함하여 모델이 패턴을 파악하도록 합니다.' },
  { question: 'Chain-of-Thought(CoT) 프롬프팅의 목적은?', options: ['응답 길이 제한', '단계적 추론 과정을 유도하여 정확도 향상', '이미지 생성', '다국어 번역'], answer: 1, explanation: 'CoT는 "단계별로 생각해보세요"와 같은 지시로 중간 추론 과정을 거쳐 더 정확한 답을 도출합니다.' },
  { question: 'Amazon Bedrock의 핵심 특징은?', options: ['자체 모델만 제공', '다양한 FM을 API로 제공하는 완전 관리형 서비스', '온프레미스 전용', '무료 서비스'], answer: 1, explanation: 'Bedrock은 Claude, Titan, Llama 등 다양한 FM을 API로 제공하며, 인프라 관리 없이 사용할 수 있습니다.' },
  { question: 'Bedrock Knowledge Bases의 용도는?', options: ['모델 학습', 'RAG 구현을 위한 지식 베이스', '데이터 라벨링', '비용 관리'], answer: 1, explanation: 'Knowledge Bases는 문서를 벡터화하여 저장하고, 질문 시 관련 문서를 검색하여 RAG를 구현합니다.' },
  { question: '시스템 프롬프트의 역할은?', options: ['사용자 입력 대체', '모델의 역할, 규칙, 응답 스타일 정의', '모델 파라미터 조정', '토큰 수 제한'], answer: 1, explanation: '시스템 프롬프트는 모델의 역할("당신은 AWS 전문가입니다"), 응답 규칙, 형식 등을 정의합니다.' },
  { question: 'Amazon Q Business의 주요 기능은?', options: ['코드 자동 생성', '기업 데이터 기반 AI 어시스턴트', '이미지 생성', '서버 관리'], answer: 1, explanation: 'Amazon Q Business는 기업 내부 데이터(S3, SharePoint 등)에 연결하여 질문에 답변하는 AI 어시스턴트입니다.' },
  { question: 'Bedrock Guardrails의 기능은?', options: ['네트워크 보안', 'FM 응답의 안전성과 적절성 보장', '비용 관리', '데이터 백업'], answer: 1, explanation: 'Guardrails는 FM의 입출력을 필터링하여 유해 콘텐츠, 할루시네이션, PII 노출 등을 방지합니다.' },
  { question: 'Bedrock Agents의 역할은?', options: ['모델 학습 자동화', '멀티스텝 작업을 FM이 자동으로 수행', '서버 프로비저닝', '데이터 전처리'], answer: 1, explanation: 'Agents는 FM이 API 호출, 데이터 조회 등 여러 단계를 자동으로 수행하여 복잡한 작업을 처리합니다.' },
  { question: 'PartyRock의 용도는?', options: ['대규모 모델 학습', '코드 없이 생성형 AI 앱 프로토타이핑', '데이터 분석', '보안 감사'], answer: 1, explanation: 'PartyRock은 코드 없이 생성형 AI 앱을 빠르게 만들어볼 수 있는 Bedrock 기반 플레이그라운드입니다.' },
]

export default function PromptEngineering() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('prompt-engineering') }, [markStudied])

  return (
    <GuideLayout title="FM 활용과 프롬프트 엔지니어링" description="프롬프트 기법, Bedrock, Amazon Q를 학습합니다." icon="💬" badges={[{ label: '출제비율 24.2%', type: 'primary' }, { label: '72문제', type: 'info' }]} sections={sections} categoryId="prompt-engineering">

      <section id="prompt-basics">
        <h2>프롬프트 엔지니어링 기초</h2>
        <p>프롬프트 엔지니어링은 FM에 효과적으로 지시하여 원하는 결과를 얻는 기법입니다.</p>
        <h3>좋은 프롬프트의 구성 요소</h3>
        <ul><li><strong>역할 (Role):</strong> 모델의 역할 정의 ("당신은 AWS 전문가입니다")</li><li><strong>지시 (Instruction):</strong> 수행할 작업 명확히 기술</li><li><strong>컨텍스트 (Context):</strong> 배경 정보 제공</li><li><strong>입력 데이터 (Input):</strong> 처리할 데이터</li><li><strong>출력 형식 (Output Format):</strong> 원하는 응답 형식 지정</li></ul>
        <TipBox type="important"><p>이 카테고리는 <strong>출제비율 24.2%</strong>로 가장 높습니다. 프롬프트 기법과 Bedrock 서비스를 확실히 익히세요.</p></TipBox>
      </section>

      <section id="techniques">
        <h2>프롬프트 기법</h2>
        <table className="info-table"><thead><tr><th>기법</th><th>설명</th><th>예시</th></tr></thead><tbody>
          <tr><td><strong>Zero-shot</strong></td><td>예시 없이 직접 질문</td><td>"이 문장의 감성을 분석해주세요"</td></tr>
          <tr><td><strong>Few-shot</strong></td><td>소수 예시를 제공</td><td>"긍정: 좋아요 → 긍정\n별로예요 → ?"</td></tr>
          <tr><td><strong>Chain-of-Thought</strong></td><td>단계적 추론 유도</td><td>"단계별로 생각해보세요"</td></tr>
          <tr><td><strong>Self-Consistency</strong></td><td>여러 추론 경로 후 다수결</td><td>CoT를 여러 번 수행 → 가장 일관된 답</td></tr>
          <tr><td><strong>ReAct</strong></td><td>추론(Reasoning) + 행동(Action)</td><td>생각 → 행동 → 관찰 반복</td></tr>
        </tbody></table>
        <ToggleSection title="프롬프트 최적화 팁">
          <ul><li>명확하고 구체적인 지시를 사용</li><li>구분자(delimiter)로 입력 데이터 구분: {"```"}, {"---"}, {"<>"}</li><li>출력 형식 지정: JSON, 표, 불릿 포인트 등</li><li>네거티브 프롬프트: 하지 말아야 할 것도 명시</li><li>단계적으로 복잡한 작업을 분해</li></ul>
        </ToggleSection>
      </section>

      <section id="bedrock">
        <h2>Amazon Bedrock</h2>
        <p>다양한 FM을 API로 제공하는 완전 관리형 서비스입니다.</p>
        <table className="info-table"><thead><tr><th>기능</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>Model Access</strong></td><td>Claude, Titan, Llama, Stable Diffusion 등 다양한 FM</td></tr>
          <tr><td><strong>Knowledge Bases</strong></td><td>RAG 구현 - 문서를 벡터화하여 검색 기반 응답</td></tr>
          <tr><td><strong>Agents</strong></td><td>FM이 API 호출 등 멀티스텝 작업 자동 수행</td></tr>
          <tr><td><strong>Guardrails</strong></td><td>입출력 필터링 - 유해 콘텐츠, PII, 할루시네이션 방지</td></tr>
          <tr><td><strong>Fine-tuning</strong></td><td>커스텀 데이터로 FM 맞춤 학습</td></tr>
          <tr><td><strong>Model Evaluation</strong></td><td>자동/사람 평가로 모델 성능 비교</td></tr>
        </tbody></table>
        <TipBox type="info"><p><strong>Bedrock vs SageMaker:</strong> Bedrock은 사전 학습된 FM 활용, SageMaker는 커스텀 ML 모델 전체 라이프사이클 관리.</p></TipBox>
      </section>

      <section id="amazon-q">
        <h2>Amazon Q</h2>
        <table className="info-table"><thead><tr><th>서비스</th><th>대상</th><th>기능</th></tr></thead><tbody>
          <tr><td><strong>Amazon Q Business</strong></td><td>기업 사용자</td><td>기업 데이터 기반 질의응답, 요약, 분석</td></tr>
          <tr><td><strong>Amazon Q Developer</strong></td><td>개발자</td><td>코드 생성, 디버깅, 리팩토링, 보안 스캔</td></tr>
          <tr><td><strong>Amazon Q in QuickSight</strong></td><td>비즈니스 분석가</td><td>자연어로 데이터 시각화 및 인사이트</td></tr>
          <tr><td><strong>Amazon Q in Connect</strong></td><td>고객 서비스</td><td>상담원 실시간 지원</td></tr>
        </tbody></table>
        <ToggleSection title="PartyRock">
          <p>Amazon Bedrock 기반의 생성형 AI 앱 빌더입니다. 코드 없이 프롬프트만으로 AI 앱을 프로토타이핑할 수 있습니다.</p>
        </ToggleSection>
      </section>

      <section id="quiz">
        <h2>도장깨기 퀴즈</h2>
        <Quiz categoryId="prompt-engineering" categoryTitle="FM 활용과 프롬프트 엔지니어링" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
