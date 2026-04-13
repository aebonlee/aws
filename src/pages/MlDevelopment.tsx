import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz from '../components/Quiz'
import SectionStatusBar from '../components/SectionStatusBar'
import { getQuestionsByCategory } from '../data/quizData'

const sections = [
  { id: 'ec2-families', title: 'EC2 인스턴스 패밀리' },
  { id: 'ml-process', title: 'ML 개발 프로세스' },
  { id: 'data-preprocessing', title: '데이터 전처리' },
  { id: 'model-evaluation', title: '모델 평가 지표' },
  { id: 'overfitting', title: '과적합 / 과소적합' },
  { id: 'quiz', title: '도장깨기 퀴즈' },
]

const quizQuestions = getQuestionsByCategory('ml-development')

export default function MlDevelopment() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('ml-development') }, [markStudied])

  return (
    <GuideLayout title="ML 개발" description="ML 개발 프로세스, EC2 인스턴스, 모델 평가 지표를 학습합니다." icon="⚙️" badges={[{ label: '출제비율 14.1%', type: 'primary' }, { label: '46문제', type: 'info' }]} sections={sections} categoryId="ml-development">

      <section id="ec2-families">
        <h2>EC2 인스턴스 패밀리</h2>
        <p>ML 워크로드에 맞는 EC2 인스턴스를 선택하는 것이 중요합니다.</p>
        <table className="info-table"><thead><tr><th>패밀리</th><th>용도</th><th>ML 활용</th></tr></thead><tbody>
          <tr><td><strong>P 패밀리</strong></td><td>GPU 기반 가속 컴퓨팅</td><td>DL 모델 학습 (NVIDIA GPU)</td></tr>
          <tr><td><strong>G 패밀리</strong></td><td>그래픽/ML 추론</td><td>모델 추론, 그래픽 렌더링</td></tr>
          <tr><td><strong>Inf 패밀리</strong></td><td>ML 추론 특화</td><td>AWS Inferentia 칩, 비용 효율적 추론</td></tr>
          <tr><td><strong>Trn 패밀리</strong></td><td>ML 학습 특화</td><td>AWS Trainium 칩, 학습 최적화</td></tr>
          <tr><td><strong>C 패밀리</strong></td><td>컴퓨팅 최적화</td><td>CPU 기반 ML, 데이터 전처리</td></tr>
          <tr><td><strong>R 패밀리</strong></td><td>메모리 최적화</td><td>대규모 데이터셋 처리</td></tr>
        </tbody></table>
        <TipBox type="important"><p><strong>P = 학습(Training)</strong>, <strong>Inf = 추론(Inference)</strong>, <strong>Trn = Trainium 학습</strong>으로 구분하세요.</p></TipBox>
        <SectionStatusBar categoryId="ml-development" sectionId="ec2-families" />
      </section>

      <section id="ml-process">
        <h2>ML 개발 프로세스</h2>
        <p>ML 프로젝트는 반복적(iterative) 프로세스를 따릅니다.</p>
        <ol><li><strong>비즈니스 문제 정의:</strong> 해결할 문제와 성공 기준 정의</li><li><strong>데이터 수집:</strong> 관련 데이터 수집 및 저장</li><li><strong>데이터 전처리:</strong> 정제, 변환, 피처 엔지니어링</li><li><strong>모델 선택 및 학습:</strong> 알고리즘 선택, 하이퍼파라미터 튜닝</li><li><strong>모델 평가:</strong> 검증 데이터로 성능 측정</li><li><strong>배포:</strong> 프로덕션 환경에 모델 배포</li><li><strong>모니터링:</strong> 성능 모니터링 및 재학습</li></ol>
        <TipBox type="info"><p>데이터 분할: <strong>학습(Training) 70-80%</strong>, <strong>검증(Validation) 10-15%</strong>, <strong>테스트(Test) 10-15%</strong></p></TipBox>
        <SectionStatusBar categoryId="ml-development" sectionId="ml-process" />
      </section>

      <section id="data-preprocessing">
        <h2>데이터 전처리</h2>
        <ToggleSection title="주요 전처리 기법" defaultOpen>
          <table className="info-table"><thead><tr><th>기법</th><th>설명</th></tr></thead><tbody>
            <tr><td><strong>결측치 처리</strong></td><td>평균/중앙값 대체, 행 삭제, KNN 대체</td></tr>
            <tr><td><strong>이상치 제거</strong></td><td>IQR, Z-score 기반 이상치 탐지 및 처리</td></tr>
            <tr><td><strong>정규화/표준화</strong></td><td>Min-Max Scaling, Z-score 정규화</td></tr>
            <tr><td><strong>인코딩</strong></td><td>범주형→수치형 변환 (One-Hot, Label Encoding)</td></tr>
            <tr><td><strong>피처 엔지니어링</strong></td><td>새로운 특성 생성, 특성 선택</td></tr>
          </tbody></table>
        </ToggleSection>
        <SectionStatusBar categoryId="ml-development" sectionId="data-preprocessing" />
      </section>

      <section id="model-evaluation">
        <h2>모델 평가 지표</h2>
        <h3>분류 모델 지표</h3>
        <table className="info-table"><thead><tr><th>지표</th><th>공식</th><th>의미</th></tr></thead><tbody>
          <tr><td><strong>정확도 (Accuracy)</strong></td><td>(TP+TN) / 전체</td><td>전체 중 올바르게 예측한 비율</td></tr>
          <tr><td><strong>정밀도 (Precision)</strong></td><td>TP / (TP+FP)</td><td>양성 예측 중 실제 양성 비율</td></tr>
          <tr><td><strong>재현율 (Recall)</strong></td><td>TP / (TP+FN)</td><td>실제 양성 중 맞춘 비율</td></tr>
          <tr><td><strong>F1 Score</strong></td><td>2×(P×R)/(P+R)</td><td>정밀도와 재현율의 조화 평균</td></tr>
          <tr><td><strong>AUC-ROC</strong></td><td>ROC 곡선 아래 면적</td><td>분류 성능 종합 평가 (0.5~1.0)</td></tr>
        </tbody></table>
        <TipBox type="warning" title="지표 선택 기준"><p><strong>질병 진단, 사기 탐지</strong> → 재현율(Recall) 중시. <strong>스팸 필터</strong> → 정밀도(Precision) 중시.</p></TipBox>
        <h3>회귀 모델 지표</h3>
        <table className="info-table"><thead><tr><th>지표</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>MAE</strong></td><td>Mean Absolute Error - 절대 오차 평균</td></tr>
          <tr><td><strong>MSE</strong></td><td>Mean Squared Error - 제곱 오차 평균</td></tr>
          <tr><td><strong>RMSE</strong></td><td>Root MSE - MSE의 제곱근</td></tr>
          <tr><td><strong>R² Score</strong></td><td>결정계수 - 모델 설명력 (0~1)</td></tr>
        </tbody></table>
        <SectionStatusBar categoryId="ml-development" sectionId="model-evaluation" />
      </section>

      <section id="overfitting">
        <h2>과적합 / 과소적합</h2>
        <table className="info-table"><thead><tr><th>구분</th><th>과적합 (Overfitting)</th><th>과소적합 (Underfitting)</th></tr></thead><tbody>
          <tr><td>증상</td><td>학습 성능 ↑, 검증 성능 ↓</td><td>학습/검증 모두 성능 ↓</td></tr>
          <tr><td>원인</td><td>모델 복잡도 과다, 데이터 부족</td><td>모델이 너무 단순, 학습 부족</td></tr>
          <tr><td>해결</td><td>정규화, 드롭아웃, 데이터 증강, 조기 종료</td><td>모델 복잡도 증가, 피처 추가, 학습 시간 증가</td></tr>
        </tbody></table>
        <ToggleSection title="과적합 해결 기법 상세">
          <ul><li><strong>정규화 (Regularization):</strong> L1(Lasso), L2(Ridge) 패널티로 가중치 제한</li><li><strong>드롭아웃 (Dropout):</strong> 학습 시 랜덤하게 뉴런 비활성화</li><li><strong>조기 종료 (Early Stopping):</strong> 검증 성능 하락 시 학습 중단</li><li><strong>데이터 증강:</strong> 이미지 회전, 반전 등으로 데이터 다양화</li><li><strong>교차 검증 (Cross-Validation):</strong> K-Fold로 안정적 성능 평가</li></ul>
        </ToggleSection>
        <SectionStatusBar categoryId="ml-development" sectionId="overfitting" />
      </section>

      <section id="quiz">
        <h2>도장깨기 퀴즈</h2>
        <Quiz categoryId="ml-development" categoryTitle="ML 개발" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
