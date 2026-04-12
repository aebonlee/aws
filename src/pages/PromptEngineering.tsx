import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz from '../components/Quiz'
import { getQuestionsByCategory } from '../data/quizData'

const sections = [
  { id: 'prompt-basics', title: '프롬프트 엔지니어링 기초' },
  { id: 'techniques', title: '프롬프트 기법' },
  { id: 'bedrock', title: 'Amazon Bedrock' },
  { id: 'amazon-q', title: 'Amazon Q' },
  { id: 'quiz', title: '도장깨기 퀴즈' },
]

const quizQuestions = getQuestionsByCategory('prompt-engineering')

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
