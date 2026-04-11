import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz, { QuizQuestion } from '../components/Quiz'

const sections = [
  { id: 'principles', title: '책임감 있는 AI 원칙' },
  { id: 'bias', title: '편향 유형' },
  { id: 'explainability', title: '모델 해석 방법' },
  { id: 'aws-responsible', title: 'AWS 책임감 있는 AI' },
  { id: 'quiz', title: '도장깨기 퀴즈' },
]

const quizQuestions: QuizQuestion[] = [
  { question: '책임감 있는 AI의 핵심 원칙이 아닌 것은?', options: ['공정성 (Fairness)', '투명성 (Transparency)', '수익 극대화 (Profit Max)', '개인정보 보호 (Privacy)'], answer: 2, explanation: '책임감 있는 AI 원칙: 공정성, 설명 가능성, 개인정보 보호, 안전성, 투명성. 수익 극대화는 원칙이 아닙니다.' },
  { question: '샘플링 편향(Sampling Bias)이란?', options: ['알고리즘의 구조적 결함', '학습 데이터가 실제 모집단을 대표하지 못하는 편향', '측정 도구의 오류', '확인하고 싶은 것만 보는 편향'], answer: 1, explanation: '샘플링 편향은 학습 데이터가 전체 모집단을 대표하지 못할 때 발생합니다. 예: 특정 연령대만 포함된 데이터.' },
  { question: 'SHAP의 역할은?', options: ['모델 학습 속도 향상', '각 피처의 예측 기여도를 설명', '데이터 암호화', '모델 압축'], answer: 1, explanation: 'SHAP(SHapley Additive exPlanations)은 게임 이론 기반으로 각 피처가 예측에 얼마나 기여했는지 설명합니다.' },
  { question: 'PDP(Partial Dependence Plot)의 용도는?', options: ['모델 학습 과정 시각화', '특정 피처와 예측값의 관계를 시각화', '데이터 분포 시각화', '네트워크 구조 시각화'], answer: 1, explanation: 'PDP는 다른 피처를 평균화하고, 특정 피처가 변할 때 예측값이 어떻게 변하는지 보여줍니다.' },
  { question: 'SageMaker Clarify의 기능은?', options: ['모델 배포 자동화', '편향 감지 및 모델 설명 가능성', '데이터 라벨링', '코드 생성'], answer: 1, explanation: 'Clarify는 학습 전/후 데이터 편향 감지와 SHAP 기반 모델 설명 가능성을 제공합니다.' },
  { question: 'Bedrock Guardrails의 역할은?', options: ['모델 학습 가속', 'FM 입출력의 안전성과 적절성 보장', '비용 절감', '데이터 백업'], answer: 1, explanation: 'Guardrails는 유해 콘텐츠, PII 노출, 주제 이탈 등을 필터링하여 안전한 AI 사용을 보장합니다.' },
  { question: '확인 편향(Confirmation Bias)이란?', options: ['데이터 수집 오류', '기존 가설을 확인하는 방향으로 데이터를 해석하는 편향', '알고리즘 결함', '라벨링 오류'], answer: 1, explanation: '확인 편향은 사람이 기존 믿음에 부합하는 데이터만 선택하거나 해석하는 경향입니다.' },
  { question: 'LIME의 특징은?', options: ['글로벌 설명 방법', '개별 예측에 대한 로컬 설명 제공', '모델 학습 방법', '데이터 전처리 도구'], answer: 1, explanation: 'LIME(Local Interpretable Model-agnostic Explanations)은 개별 예측을 간단한 모델로 근사하여 설명합니다.' },
  { question: 'Model Cards의 용도는?', options: ['모델 학습 코드 저장', '모델의 성능, 한계, 편향을 문서화', '모델 배포 자동화', '비용 관리'], answer: 1, explanation: 'Model Cards는 모델의 목적, 성능 메트릭, 한계, 편향, 윤리적 고려사항을 표준화된 형식으로 문서화합니다.' },
  { question: '알고리즘 편향의 원인은?', options: ['데이터 수집 오류만', '모델의 설계나 학습 과정에서 특정 그룹에 불공정한 결과', '하드웨어 오류', '네트워크 문제'], answer: 1, explanation: '알고리즘 편향은 모델 구조, 최적화 방법, 또는 학습 과정에서 특정 그룹에 불리한 결과가 나오는 것입니다.' },
]

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
