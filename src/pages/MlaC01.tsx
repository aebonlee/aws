import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz, { QuizQuestion } from '../components/Quiz'

const sections = [
  { id: 'exam-overview', title: '시험 개요' },
  { id: 'data-prep', title: 'ML 데이터 준비 (28%)' },
  { id: 'model-dev', title: '모델 개발 (26%)' },
  { id: 'deployment', title: '배포 및 오케스트레이션 (22%)' },
  { id: 'monitoring', title: '모니터링 및 보안 (24%)' },
  { id: 'quiz', title: '실력 점검 퀴즈' },
]

const quizQuestions: QuizQuestion[] = [
  { question: 'SageMaker Feature Store 실시간 추론용 저장소는?', options: ['오프라인', '온라인', 'S3', 'DynamoDB'], answer: 1, explanation: '온라인 스토어는 밀리초 지연으로 실시간 피처를 제공합니다.' },
  { question: '이상 탐지에 적합한 SageMaker 알고리즘은?', options: ['XGBoost', 'Linear Learner', 'Random Cut Forest', 'BlazingText'], answer: 2, explanation: 'RCF는 비지도 학습 기반 이상 탐지 알고리즘입니다.' },
  { question: 'SageMaker 하이퍼파라미터 튜닝 기본 전략은?', options: ['그리드', '랜덤', '베이지안', '수동'], answer: 2, explanation: '베이지안 최적화는 이전 결과를 활용하여 효율적으로 탐색합니다.' },
  { question: '간헐적 트래픽에 비용 효율적인 추론 옵션은?', options: ['실시간', '서버리스', '비동기', '배치'], answer: 1, explanation: '서버리스 추론은 요청 없을 때 자동 스케일 다운합니다.' },
  { question: 'ML 모델 예측을 설명하는 SageMaker 기능은?', options: ['Model Monitor', 'Clarify', 'Debugger', 'Experiments'], answer: 1, explanation: 'Clarify는 SHAP 값으로 피처 중요도를 설명합니다.' },
  { question: 'Model Monitor가 감지하지 않는 것은?', options: ['데이터 드리프트', '품질 저하', '편향', '하이퍼파라미터 변경'], answer: 3, explanation: 'Model Monitor는 데이터/모델/편향/피처를 모니터링하지만 하이퍼파라미터는 아닙니다.' },
  { question: 'SageMaker Pipelines의 목적은?', options: ['시각화', 'ML 워크플로 자동화', '모델 설명', '피처 저장'], answer: 1, explanation: 'Pipelines는 ML 워크플로를 정의, 실행, 관리합니다.' },
  { question: '모델 버전 관리와 승인 워크플로를 제공하는 것은?', options: ['Model Registry', 'Model Monitor', 'Experiments', 'JumpStart'], answer: 0, explanation: 'Model Registry는 모델 버전을 관리하고 배포를 제어합니다.' },
  { question: 'Ground Truth의 주요 목적은?', options: ['모델 훈련', '데이터 라벨링', '모델 배포', '피처 엔지니어링'], answer: 1, explanation: 'Ground Truth는 ML 데이터 라벨링 서비스입니다.' },
  { question: '입력 데이터 분포가 시간에 따라 변하는 현상은?', options: ['모델 편향', '과적합', '데이터 드리프트', '레이블 노이즈'], answer: 2, explanation: '데이터 드리프트는 프로덕션 데이터가 훈련 데이터와 달라지는 현상입니다.' },
]

export default function MlaC01() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('mla-c01') }, [markStudied])

  return (
    <GuideLayout title="Machine Learning Engineer Associate" description="ML 워크로드의 구현, 배포, 유지 관리 능력을 검증합니다." icon="🧠" badges={[{ label: 'Associate', type: 'primary' }, { label: '65문제 / 130분', type: 'info' }]} sections={sections} categoryId="mla-c01">

      <section id="exam-overview">
        <h2>시험 개요</h2>
        <table className="info-table"><thead><tr><th>항목</th><th>내용</th></tr></thead><tbody>
          <tr><td><strong>시험 코드</strong></td><td>MLA-C01</td></tr>
          <tr><td><strong>문항 수</strong></td><td>65문제</td></tr>
          <tr><td><strong>시간 / 합격</strong></td><td>130분 / 720점</td></tr>
          <tr><td><strong>비용</strong></td><td>$150 USD</td></tr>
          <tr><td><strong>권장 경험</strong></td><td>2년 이상 ML 경험</td></tr>
        </tbody></table>
        <TipBox type="info"><p>2024년 신설. SageMaker 중심의 실무형 ML 엔지니어링 자격증입니다.</p></TipBox>
      </section>

      <section id="data-prep">
        <h2>ML 데이터 준비 (28%)</h2>
        <h3>SageMaker Feature Store</h3>
        <table className="info-table"><thead><tr><th>저장소</th><th>지연</th><th>용도</th></tr></thead><tbody>
          <tr><td><strong>온라인</strong></td><td>밀리초</td><td>실시간 추론 피처</td></tr>
          <tr><td><strong>오프라인</strong></td><td>분</td><td>배치 학습 데이터</td></tr>
        </tbody></table>

        <h3>데이터 전처리 기법</h3>
        <table className="info-table"><thead><tr><th>기법</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>정규화</strong></td><td>Min-Max Scaling (0~1)</td></tr>
          <tr><td><strong>표준화</strong></td><td>Z-score (평균 0, 표준편차 1)</td></tr>
          <tr><td><strong>원핫인코딩</strong></td><td>범주형 → 이진 벡터</td></tr>
          <tr><td><strong>결측치 처리</strong></td><td>평균/중앙값 대체, KNN 대체</td></tr>
        </tbody></table>
        <TipBox type="important"><p>Feature Store의 온라인(실시간) vs 오프라인(배치) 구분을 숙지하세요.</p></TipBox>
      </section>

      <section id="model-dev">
        <h2>모델 개발 (26%)</h2>
        <h3>SageMaker 내장 알고리즘</h3>
        <table className="info-table"><thead><tr><th>알고리즘</th><th>유형</th><th>사용 사례</th></tr></thead><tbody>
          <tr><td><strong>XGBoost</strong></td><td>지도학습</td><td>분류, 회귀 (범용)</td></tr>
          <tr><td><strong>Linear Learner</strong></td><td>지도학습</td><td>이진/다중 분류, 회귀</td></tr>
          <tr><td><strong>Random Cut Forest</strong></td><td>비지도학습</td><td>이상 탐지</td></tr>
          <tr><td><strong>BlazingText</strong></td><td>NLP</td><td>텍스트 분류, Word2Vec</td></tr>
          <tr><td><strong>DeepAR</strong></td><td>시계열</td><td>수요 예측</td></tr>
          <tr><td><strong>KNN</strong></td><td>지도학습</td><td>분류, 회귀</td></tr>
        </tbody></table>

        <h3>모델 평가 지표</h3>
        <table className="info-table"><thead><tr><th>유형</th><th>지표</th></tr></thead><tbody>
          <tr><td><strong>분류</strong></td><td>정확도, 정밀도, 재현율, F1, AUC-ROC</td></tr>
          <tr><td><strong>회귀</strong></td><td>MSE, RMSE, MAE, R²</td></tr>
        </tbody></table>

        <ToggleSection title="과적합 vs 과소적합">
          <table className="info-table"><thead><tr><th>구분</th><th>과적합</th><th>과소적합</th></tr></thead><tbody>
            <tr><td>증상</td><td>학습↑ 검증↓</td><td>모두↓</td></tr>
            <tr><td>해결</td><td>정규화, 드롭아웃, 데이터 증강</td><td>복잡도 증가, 피처 추가</td></tr>
          </tbody></table>
        </ToggleSection>
      </section>

      <section id="deployment">
        <h2>배포 및 오케스트레이션 (22%)</h2>
        <h3>SageMaker 추론 옵션</h3>
        <table className="info-table"><thead><tr><th>옵션</th><th>지연</th><th>적합</th></tr></thead><tbody>
          <tr><td><strong>실시간</strong></td><td>밀리초</td><td>지속적 트래픽</td></tr>
          <tr><td><strong>서버리스</strong></td><td>초 (콜드스타트)</td><td>간헐적 트래픽</td></tr>
          <tr><td><strong>비동기</strong></td><td>분</td><td>대용량 페이로드</td></tr>
          <tr><td><strong>배치</strong></td><td>시간</td><td>대량 일괄 처리</td></tr>
        </tbody></table>

        <h3>MLOps</h3>
        <ul>
          <li><strong>Pipelines:</strong> ML 워크플로 오케스트레이션</li>
          <li><strong>Model Registry:</strong> 모델 버전/승인 관리</li>
          <li><strong>Projects:</strong> ML CI/CD 템플릿</li>
        </ul>
        <TipBox type="warning"><p>실시간 vs 서버리스 vs 비동기 추론의 사용 사례 구분이 중요합니다.</p></TipBox>
      </section>

      <section id="monitoring">
        <h2>모니터링, 유지 관리 및 보안 (24%)</h2>
        <h3>SageMaker Model Monitor</h3>
        <table className="info-table"><thead><tr><th>유형</th><th>감지 대상</th></tr></thead><tbody>
          <tr><td><strong>데이터 품질</strong></td><td>입력 데이터 통계 변화</td></tr>
          <tr><td><strong>모델 품질</strong></td><td>예측 정확도 저하</td></tr>
          <tr><td><strong>편향 드리프트</strong></td><td>시간에 따른 편향 변화</td></tr>
          <tr><td><strong>피처 귀인</strong></td><td>피처 기여도 변화</td></tr>
        </tbody></table>

        <h3>보안</h3>
        <ul>
          <li><strong>VPC 모드:</strong> SageMaker를 VPC 내에서 실행</li>
          <li><strong>KMS 암호화:</strong> 노트북, 훈련 데이터, 모델 아티팩트</li>
          <li><strong>실행 역할:</strong> IAM 역할로 최소 권한 적용</li>
        </ul>

        <ToggleSection title="데이터 드리프트 유형">
          <ul>
            <li><strong>공변량 이동:</strong> 입력 피처 분포 변화</li>
            <li><strong>사전 확률 이동:</strong> 타겟 변수 분포 변화</li>
            <li><strong>개념 이동:</strong> 입력-출력 관계 자체가 변화</li>
          </ul>
        </ToggleSection>
      </section>

      <section id="quiz">
        <h2>실력 점검 퀴즈</h2>
        <Quiz categoryId="mla-c01" categoryTitle="Machine Learning Engineer Associate" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
