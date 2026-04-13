import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz from '../components/Quiz'
import SectionStatusBar from '../components/SectionStatusBar'
import { getQuestionsByCategory } from '../data/quizData'

const sections = [
  { id: 'overview', title: 'SageMaker 개요' },
  { id: 'build', title: '빌드 단계 서비스' },
  { id: 'train', title: '학습 단계 서비스' },
  { id: 'deploy', title: '배포 및 모니터링' },
  { id: 'no-code', title: 'No-Code/Low-Code' },
  { id: 'quiz', title: '도장깨기 퀴즈' },
]

const quizQuestions = getQuestionsByCategory('sagemaker')

export default function SageMaker() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('sagemaker') }, [markStudied])

  return (
    <GuideLayout title="Amazon SageMaker" description="SageMaker의 전체 ML 라이프사이클 서비스를 학습합니다." icon="🔧" badges={[{ label: '출제비율 11.9%', type: 'primary' }, { label: '38문제', type: 'info' }]} sections={sections} categoryId="sagemaker">

      <section id="overview">
        <h2>SageMaker 개요</h2>
        <p>Amazon SageMaker는 ML 모델의 <strong>전체 라이프사이클</strong>(빌드→학습→배포)을 지원하는 완전 관리형 서비스입니다.</p>
        <TipBox type="important"><p>SageMaker는 AIF-C01 시험에서 다양한 하위 서비스와 함께 출제됩니다. 각 서비스의 역할을 정확히 구분하세요.</p></TipBox>
        <SectionStatusBar categoryId="sagemaker" sectionId="overview" />
      </section>

      <section id="build">
        <h2>빌드 단계 서비스</h2>
        <table className="info-table"><thead><tr><th>서비스</th><th>역할</th><th>핵심 기능</th></tr></thead><tbody>
          <tr><td><strong>Ground Truth</strong></td><td>데이터 라벨링</td><td>사람+자동 라벨링, 워크포스 관리</td></tr>
          <tr><td><strong>Data Wrangler</strong></td><td>데이터 전처리</td><td>시각적 데이터 정제/변환/분석</td></tr>
          <tr><td><strong>Feature Store</strong></td><td>피처 저장소</td><td>온라인/오프라인 피처 저장 및 공유</td></tr>
          <tr><td><strong>Clarify</strong></td><td>편향/설명 가능성</td><td>학습 전/후 편향 감지, SHAP 기반 설명</td></tr>
        </tbody></table>
        <ToggleSection title="Ground Truth 상세">
          <ul><li><strong>자동 라벨링:</strong> 학습이 진행될수록 자동 라벨링 비율 증가 → 비용 절감</li><li><strong>워크포스:</strong> Amazon Mechanical Turk, 사내 팀, 외부 벤더 선택 가능</li><li><strong>지원 유형:</strong> 이미지 분류, 객체 감지, 텍스트 분류, 시맨틱 세그멘테이션 등</li></ul>
        </ToggleSection>
        <SectionStatusBar categoryId="sagemaker" sectionId="build" />
      </section>

      <section id="train">
        <h2>학습 단계 서비스</h2>
        <table className="info-table"><thead><tr><th>서비스</th><th>역할</th></tr></thead><tbody>
          <tr><td><strong>내장 알고리즘</strong></td><td>XGBoost, 선형 학습기, K-Means, Image Classification 등 17개+ 내장</td></tr>
          <tr><td><strong>Automatic Model Tuning</strong></td><td>하이퍼파라미터 자동 최적화 (베이지안 최적화)</td></tr>
          <tr><td><strong>Experiments</strong></td><td>학습 실험 추적 및 비교</td></tr>
          <tr><td><strong>Debugger</strong></td><td>학습 중 문제(과적합, 기울기 소실 등) 실시간 감지</td></tr>
          <tr><td><strong>분산 학습</strong></td><td>데이터 병렬/모델 병렬 학습 지원</td></tr>
        </tbody></table>
        <TipBox type="info"><p><strong>JumpStart</strong>는 사전 학습된 모델(Hugging Face, PyTorch 등)과 솔루션 템플릿을 제공하여 빠르게 시작할 수 있습니다.</p></TipBox>
        <SectionStatusBar categoryId="sagemaker" sectionId="train" />
      </section>

      <section id="deploy">
        <h2>배포 및 모니터링</h2>
        <table className="info-table"><thead><tr><th>배포 옵션</th><th>사용 사례</th></tr></thead><tbody>
          <tr><td><strong>실시간 엔드포인트</strong></td><td>밀리초 단위 실시간 추론</td></tr>
          <tr><td><strong>서버리스 추론</strong></td><td>트래픽이 간헐적인 경우 (자동 스케일링)</td></tr>
          <tr><td><strong>배치 변환</strong></td><td>대량 데이터 일괄 추론</td></tr>
          <tr><td><strong>비동기 추론</strong></td><td>대용량 페이로드, 긴 처리 시간</td></tr>
        </tbody></table>
        <h3>Model Monitor</h3>
        <ul><li><strong>데이터 품질 모니터링:</strong> 입력 데이터의 통계적 변화 감지</li><li><strong>모델 품질 모니터링:</strong> 예측 정확도 추적</li><li><strong>편향 드리프트:</strong> 시간에 따른 편향 변화 감지</li><li><strong>피처 중요도 드리프트:</strong> 피처 기여도 변화 추적</li></ul>
        <SectionStatusBar categoryId="sagemaker" sectionId="deploy" />
      </section>

      <section id="no-code">
        <h2>No-Code/Low-Code</h2>
        <table className="info-table"><thead><tr><th>서비스</th><th>대상</th><th>특징</th></tr></thead><tbody>
          <tr><td><strong>Canvas</strong></td><td>비즈니스 분석가</td><td>코드 없이 포인트앤클릭으로 ML 모델 구축</td></tr>
          <tr><td><strong>Autopilot</strong></td><td>데이터 과학자</td><td>AutoML - 자동 모델 선택, 학습, 튜닝</td></tr>
          <tr><td><strong>Studio</strong></td><td>ML 엔지니어</td><td>통합 IDE - 전체 ML 워크플로우</td></tr>
        </tbody></table>
        <SectionStatusBar categoryId="sagemaker" sectionId="no-code" />
      </section>

      <section id="quiz">
        <h2>도장깨기 퀴즈</h2>
        <Quiz categoryId="sagemaker" categoryTitle="Amazon SageMaker" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
