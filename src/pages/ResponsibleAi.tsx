import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz from '../components/Quiz'
import { getQuestionsByCategory } from '../data/quizData'

const sections = [
  { id: 'principles', title: '책임감 있는 AI 원칙' },
  { id: 'bias', title: '편향 유형' },
  { id: 'explainability', title: '모델 해석 방법' },
  { id: 'aws-responsible', title: 'AWS 책임감 있는 AI' },
  { id: 'quiz', title: '도장깨기 퀴즈' },
]

const quizQuestions = getQuestionsByCategory('responsible-ai')

export default function ResponsibleAi() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('responsible-ai') }, [markStudied])

  return (
    <GuideLayout title="Responsible AI" description="공정성, 편향, 설명 가능성, AWS 책임감 있는 AI를 학습합니다." icon="🛡️" badges={[{ label: '출제비율 8.7%', type: 'primary' }, { label: '37문제', type: 'info' }]} sections={sections} categoryId="responsible-ai">

      <section id="principles">
        <h2>책임감 있는 AI 원칙</h2>
        <table className="info-table"><thead><tr><th>원칙</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>공정성 (Fairness)</strong></td><td>특정 그룹에 불공정하지 않은 예측 결과</td></tr>
          <tr><td><strong>설명 가능성 (Explainability)</strong></td><td>모델의 결정 과정을 이해하고 설명 가능</td></tr>
          <tr><td><strong>개인정보 보호 (Privacy)</strong></td><td>사용자 데이터의 적절한 보호 및 처리</td></tr>
          <tr><td><strong>안전성 (Safety)</strong></td><td>유해하거나 위험한 출력 방지</td></tr>
          <tr><td><strong>투명성 (Transparency)</strong></td><td>AI 시스템의 동작 방식 공개</td></tr>
          <tr><td><strong>견고성 (Robustness)</strong></td><td>다양한 상황에서 안정적으로 동작</td></tr>
          <tr><td><strong>거버넌스 (Governance)</strong></td><td>AI 개발/배포의 체계적 관리</td></tr>
        </tbody></table>
        <TipBox type="important"><p>시험에서는 각 원칙의 정의와 해당 원칙이 적용되는 시나리오를 구분하는 문제가 출제됩니다.</p></TipBox>
      </section>

      <section id="bias">
        <h2>편향 유형</h2>
        <table className="info-table"><thead><tr><th>편향 유형</th><th>설명</th><th>예시</th></tr></thead><tbody>
          <tr><td><strong>샘플링 편향</strong></td><td>학습 데이터가 모집단을 대표하지 못함</td><td>특정 인종만 포함된 얼굴 인식 데이터</td></tr>
          <tr><td><strong>측정 편향</strong></td><td>데이터 수집/측정 도구의 체계적 오류</td><td>특정 센서만 사용하여 편향된 측정</td></tr>
          <tr><td><strong>알고리즘 편향</strong></td><td>모델 설계/학습 과정의 구조적 편향</td><td>특정 그룹에 불리한 가중치 학습</td></tr>
          <tr><td><strong>확인 편향</strong></td><td>기존 가설을 확인하려는 인간의 편향</td><td>원하는 결과만 선택적으로 해석</td></tr>
          <tr><td><strong>제외 편향</strong></td><td>중요한 특성/그룹을 데이터에서 제외</td><td>장애인 데이터 누락</td></tr>
          <tr><td><strong>리포팅 편향</strong></td><td>결과를 선택적으로 보고</td><td>좋은 결과만 발표</td></tr>
        </tbody></table>
      </section>

      <section id="explainability">
        <h2>모델 해석 방법</h2>
        <table className="info-table"><thead><tr><th>방법</th><th>유형</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>SHAP</strong></td><td>로컬/글로벌</td><td>게임 이론 기반 각 피처의 기여도 계산</td></tr>
          <tr><td><strong>LIME</strong></td><td>로컬</td><td>개별 예측을 간단한 모델로 근사 설명</td></tr>
          <tr><td><strong>PDP</strong></td><td>글로벌</td><td>특정 피처와 예측값의 관계 시각화</td></tr>
          <tr><td><strong>Feature Importance</strong></td><td>글로벌</td><td>피처의 전체적 중요도 순위</td></tr>
          <tr><td><strong>Attention 시각화</strong></td><td>로컬</td><td>Transformer 모델의 주의 가중치 시각화</td></tr>
        </tbody></table>
        <ToggleSection title="로컬 vs 글로벌 설명">
          <ul><li><strong>로컬 (Local):</strong> 개별 예측에 대한 설명 (왜 이 고객에게 대출 거부?)</li><li><strong>글로벌 (Global):</strong> 모델 전체의 동작 패턴 설명 (어떤 피처가 가장 중요?)</li></ul>
        </ToggleSection>
      </section>

      <section id="aws-responsible">
        <h2>AWS 책임감 있는 AI</h2>
        <table className="info-table"><thead><tr><th>서비스/기능</th><th>역할</th></tr></thead><tbody>
          <tr><td><strong>SageMaker Clarify</strong></td><td>학습 전/후 편향 감지, SHAP 기반 설명</td></tr>
          <tr><td><strong>SageMaker Model Cards</strong></td><td>모델 성능, 한계, 편향 문서화</td></tr>
          <tr><td><strong>Bedrock Guardrails</strong></td><td>FM 입출력 안전성 필터링</td></tr>
          <tr><td><strong>SageMaker Model Monitor</strong></td><td>배포 후 편향 드리프트 모니터링</td></tr>
          <tr><td><strong>Amazon A2I</strong></td><td>ML 예측에 인간 검토 추가</td></tr>
        </tbody></table>
        <TipBox type="info"><p><strong>Guardrails 필터링:</strong> 유해 콘텐츠, PII 노출, 주제 이탈, 할루시네이션 등을 정책 기반으로 차단합니다.</p></TipBox>
      </section>

      <section id="quiz">
        <h2>도장깨기 퀴즈</h2>
        <Quiz categoryId="responsible-ai" categoryTitle="Responsible AI" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
