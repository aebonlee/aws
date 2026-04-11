import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz, { QuizQuestion } from '../components/Quiz'

const sections = [
  { id: 'overview', title: 'SageMaker 개요' },
  { id: 'build', title: '빌드 단계 서비스' },
  { id: 'train', title: '학습 단계 서비스' },
  { id: 'deploy', title: '배포 및 모니터링' },
  { id: 'no-code', title: 'No-Code/Low-Code' },
  { id: 'quiz', title: '도장깨기 퀴즈' },
]

const quizQuestions: QuizQuestion[] = [
  { question: 'SageMaker Ground Truth의 주요 기능은?', options: ['모델 학습', '데이터 라벨링', '모델 배포', '비용 분석'], answer: 1, explanation: 'Ground Truth는 ML 학습 데이터에 라벨(정답)을 붙이는 서비스입니다. 사람 라벨러 + 자동 라벨링을 결합합니다.' },
  { question: 'SageMaker Data Wrangler의 역할은?', options: ['모델 편향 감지', '데이터 전처리 및 변환', '모델 배포 자동화', '코드 없는 ML'], answer: 1, explanation: 'Data Wrangler는 시각적 인터페이스로 데이터를 탐색, 정제, 변환하는 전처리 도구입니다.' },
  { question: 'SageMaker Feature Store의 용도는?', options: ['모델 버전 관리', 'ML 피처 저장 및 공유', '학습 데이터 라벨링', '모델 성능 모니터링'], answer: 1, explanation: 'Feature Store는 ML 피처를 중앙에서 저장, 검색, 공유하는 저장소입니다.' },
  { question: 'SageMaker Clarify의 기능이 아닌 것은?', options: ['모델 편향 감지', '모델 설명 가능성', '피처 중요도 분석', '자동 하이퍼파라미터 튜닝'], answer: 3, explanation: '자동 하이퍼파라미터 튜닝은 SageMaker Automatic Model Tuning의 기능입니다. Clarify는 편향 감지와 설명 가능성을 제공합니다.' },
  { question: 'SageMaker JumpStart의 역할은?', options: ['사전 학습된 모델 및 솔루션 템플릿 제공', '실시간 추론 엔드포인트', '데이터 라벨링', '피처 저장소'], answer: 0, explanation: 'JumpStart는 사전 학습된 FM/ML 모델, 솔루션 템플릿, 예제 노트북을 제공하여 빠른 시작을 돕습니다.' },
  { question: 'SageMaker Model Monitor의 기능은?', options: ['모델 학습 자동화', '프로덕션 모델 품질 모니터링', '데이터 라벨링', '코드 없는 ML'], answer: 1, explanation: 'Model Monitor는 배포된 모델의 데이터 드리프트, 모델 품질, 편향, 피처 중요도를 지속 모니터링합니다.' },
  { question: 'SageMaker Canvas의 특징은?', options: ['Python 코딩 필요', '코드 없이 시각적으로 ML 모델 구축', '대규모 분산 학습 전용', '실시간 스트리밍 처리'], answer: 1, explanation: 'Canvas는 비즈니스 분석가를 위한 No-Code ML 도구로, 코딩 없이 포인트앤클릭으로 모델을 구축합니다.' },
  { question: 'SageMaker Autopilot의 기능은?', options: ['데이터 라벨링 자동화', 'AutoML - 자동으로 최적 ML 모델 생성', '모델 배포만 자동화', '데이터 시각화'], answer: 1, explanation: 'Autopilot은 AutoML 서비스로, 데이터를 분석하고 자동으로 여러 모델을 학습/비교하여 최적 모델을 추천합니다.' },
  { question: 'SageMaker 실시간 추론에 사용되는 것은?', options: ['배치 변환 작업', '실시간 엔드포인트', 'Processing Job', 'Ground Truth'], answer: 1, explanation: '실시간 엔드포인트는 밀리초 단위의 지연 시간으로 실시간 추론을 제공합니다.' },
  { question: 'SageMaker Studio의 역할은?', options: ['데이터 웨어하우스', 'ML 개발용 통합 IDE', '서버리스 컴퓨팅', '네트워크 관리'], answer: 1, explanation: 'SageMaker Studio는 ML 개발의 모든 단계를 하나의 웹 기반 IDE에서 수행할 수 있는 통합 환경입니다.' },
]

export default function SageMaker() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('sagemaker') }, [markStudied])

  return (
    <GuideLayout title="Amazon SageMaker" description="SageMaker의 전체 ML 라이프사이클 서비스를 학습합니다." icon="🔧" badges={[{ label: '출제비율 11.9%', type: 'primary' }, { label: '38문제', type: 'info' }]} sections={sections} categoryId="sagemaker">

      <section id="overview">
        <h2>SageMaker 개요</h2>
        <p>Amazon SageMaker는 ML 모델의 <strong>전체 라이프사이클</strong>(빌드→학습→배포)을 지원하는 완전 관리형 서비스입니다.</p>
        <TipBox type="important"><p>SageMaker는 AIF-C01 시험에서 다양한 하위 서비스와 함께 출제됩니다. 각 서비스의 역할을 정확히 구분하세요.</p></TipBox>
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
      </section>

      <section id="no-code">
        <h2>No-Code/Low-Code</h2>
        <table className="info-table"><thead><tr><th>서비스</th><th>대상</th><th>특징</th></tr></thead><tbody>
          <tr><td><strong>Canvas</strong></td><td>비즈니스 분석가</td><td>코드 없이 포인트앤클릭으로 ML 모델 구축</td></tr>
          <tr><td><strong>Autopilot</strong></td><td>데이터 과학자</td><td>AutoML - 자동 모델 선택, 학습, 튜닝</td></tr>
          <tr><td><strong>Studio</strong></td><td>ML 엔지니어</td><td>통합 IDE - 전체 ML 워크플로우</td></tr>
        </tbody></table>
      </section>

      <section id="quiz">
        <h2>도장깨기 퀴즈</h2>
        <Quiz categoryId="sagemaker" categoryTitle="Amazon SageMaker" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
