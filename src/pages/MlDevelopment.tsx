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
  { id: 'data-types', title: '데이터 유형' },
  { id: 'data-preprocessing', title: '데이터 전처리' },
  { id: 'data-quality', title: '데이터셋 품질 평가' },
  { id: 'aws-glue', title: 'AWS Glue' },
  { id: 'model-selection', title: '모델 선택' },
  { id: 'model-evaluation', title: '모델 평가 지표' },
  { id: 'business-metrics', title: '비즈니스 지표' },
  { id: 'feature-engineering', title: '특성 공학 (Feature Engineering)' },
  { id: 'hyperparameter', title: '하이퍼파라미터 튜닝' },
  { id: 'overfitting', title: '과적합 / 과소적합' },
  { id: 'bias-types', title: '편향 유형 (Bias)' },
  { id: 'mlops', title: 'MLOps' },
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
        <p>ML 워크로드에 맞는 EC2 인스턴스를 선택하는 것이 중요합니다. Amazon EC2는 클라우드에서 사용할 수 있는 가상 컴퓨터이며, 목적에 맞는 성능의 인스턴스를 선택해야 합니다.</p>
        <table className="info-table"><thead><tr><th>패밀리</th><th>용도</th><th>ML 활용</th></tr></thead><tbody>
          <tr><td><strong>P 패밀리</strong></td><td>최고급 GPU 탑재 고성능 AI</td><td>대규모 딥러닝, 복잡한 AI 모델 학습, 실시간 영상 처리</td></tr>
          <tr><td><strong>G 패밀리</strong></td><td>GPU 탑재 그래픽/ML 워크로드</td><td>이미지 처리, 비디오 분석, 중간 규모 딥러닝</td></tr>
          <tr><td><strong>Inf 패밀리</strong></td><td>ML 추론 특화</td><td>AWS Inferentia 칩, 비용 효율적 추론</td></tr>
          <tr><td><strong>Trn 패밀리</strong></td><td>ML 학습 특화</td><td>AWS Trainium 칩, 에너지 효율적 LLM 학습/추론 최적화</td></tr>
          <tr><td><strong>C 패밀리</strong></td><td>컴퓨팅 최적화</td><td>데이터 전처리, 간단한 ML 모델 학습/추론, CPU 기반 연산</td></tr>
          <tr><td><strong>R 패밀리</strong></td><td>메모리 최적화</td><td>대규모 데이터셋 처리</td></tr>
        </tbody></table>
        <TipBox type="important"><p><strong>P = 학습(Training)</strong>, <strong>Inf = 추론(Inference)</strong>, <strong>Trn = Trainium 학습</strong>으로 구분하세요.</p></TipBox>
        <SectionStatusBar categoryId="ml-development" sectionId="ec2-families" />
      </section>

      <section id="ml-process">
        <h2>ML 개발 프로세스</h2>
        <p>ML 프로젝트는 반복적(iterative) 프로세스를 따릅니다. 머신러닝은 <strong>데이터</strong>를 기반으로 패턴을 <strong>학습</strong>하고 이를 통해 <strong>새로운 상황에서 의사결정</strong>을 수행하는 시스템입니다.</p>
        <ol>
          <li><strong>데이터 엔지니어링:</strong> 데이터 수집, 전처리(pre-processing), 탐색적 데이터 분석(EDA), 피처 엔지니어링 <span style={{color: '#e74c3c', fontWeight: 'bold'}}>(Garbage in, Garbage out)</span></li>
          <li><strong>모델 선택 및 학습:</strong> 알고리즘 선택, 하이퍼파라미터 튜닝, 에포크(epoch) 반복 학습</li>
          <li><strong>평가 및 검증:</strong> 추론(inference)/예측(prediction)의 정확도 검토</li>
          <li><strong>배포(Deploy) 및 서빙:</strong> 프로덕션 환경에 모델 배포, 안정성/성능/확장성 고려</li>
          <li><strong>MLOps:</strong> 지속적 모니터링, 모델 재학습, 파이프라인 자동화</li>
        </ol>
        <TipBox type="info"><p>데이터 분할: <strong>학습(Training) 70-80%</strong>, <strong>검증(Validation) 10-15%</strong>, <strong>테스트(Test) 10-15%</strong>. 일반적으로 8:2 비율이 사용되며 과적합(overfitting) 검증을 위한 필수 과정입니다.</p></TipBox>
        <ToggleSection title="학습 과정 코드 예시">
          <pre style={{background: '#1e1e2e', color: '#cdd6f4', padding: '16px', borderRadius: '8px', overflowX: 'auto', fontSize: '14px'}}>
{`# 학습 과정 예시
for epoch in range(num_epochs):  # 여러 번 반복
    for data in training_data:   # 데이터로 학습
        predict = model(data)    # 예측
        loss = calculate_loss(predict, true_value)  # 얼마나 틀렸는지 확인
        optimize(loss)           # 개선`}
          </pre>
          <p>전체 데이터셋을 한 번 학습하는 것을 <strong>1 에포크(epoch)</strong>라고 합니다. 마치 학생이 시험을 위해 교과서를 여러 번 읽는 것처럼, 모델도 더 나은 성능을 위해 데이터를 반복적으로 학습합니다.</p>
        </ToggleSection>
        <SectionStatusBar categoryId="ml-development" sectionId="ml-process" />
      </section>

      <section id="data-types">
        <h2>데이터 유형</h2>
        <p>해결하려는 문제의 성격에 따라 수집해야 하는 데이터의 형태가 달라집니다. ML 모델 학습을 위해서는 적절한 데이터 유형을 선택하는 것이 필수적입니다.</p>
        <table className="info-table"><thead><tr><th>유형</th><th>설명</th><th>활용 사례</th></tr></thead><tbody>
          <tr><td><strong>정형 데이터 (Tabular Data)</strong></td><td>행(Row)과 열(Column)로 구성된 구조화된 데이터 (예: 엑셀)</td><td>고객 인구통계, 구매 이력 기반 광고 최적화</td></tr>
          <tr><td><strong>시계열 데이터 (Time Series Data)</strong></td><td>시간의 순서대로 기록된 데이터</td><td>주가 예측, 인터넷 속도 변화 분석, 트렌드/패턴 파악</td></tr>
          <tr><td><strong>텍스트 데이터 (Text Data)</strong></td><td>자연어로 된 비정형 데이터</td><td>소셜 미디어 감성 분석, AI 어시스턴트 대화형 데이터 학습</td></tr>
          <tr><td><strong>이미지 데이터 (Image Data)</strong></td><td>시각 정보 데이터</td><td>자율주행 교통 표지판 인식, 의료 영상 분석</td></tr>
        </tbody></table>
        <TipBox type="important"><p>시험에서 <strong>시계열 데이터</strong>가 자주 출제됩니다. DeepAR 같은 알고리즘은 시계열 데이터 예측에 특화되어 있습니다.</p></TipBox>
        <SectionStatusBar categoryId="ml-development" sectionId="data-types" />
      </section>

      <section id="data-preprocessing">
        <h2>데이터 전처리 <span className="badge badge-exam">시험 빈출</span></h2>
        <p>데이터 수집 후 모델이 학습할 수 있는 상태로 만드는 과정입니다. 각 단계의 목적을 구분하는 것이 중요합니다.</p>
        <ToggleSection title="주요 전처리 기법" defaultOpen>
          <table className="info-table"><thead><tr><th>기법</th><th>설명</th><th>예시</th></tr></thead><tbody>
            <tr><td><strong>데이터 레이블링 (Labeling)</strong></td><td>지도 학습을 위해 데이터(입력)에 정답(태그, 카테고리)을 부여하는 작업</td><td>거래 내역에 '개인' 또는 '기업' 분류 삽입, 사진에 '고양이' 태그</td></tr>
            <tr><td><strong>데이터 인코딩 (Encoding)</strong></td><td>문자(텍스트) 데이터를 숫자(수치) 데이터로 변환하는 작업</td><td>'Red, Green, Blue'를 [1,0,0], [0,1,0]으로 변경 (One-hot encoding)</td></tr>
            <tr><td><strong>데이터 정규화 (Normalization)</strong></td><td>서로 다른 범위(Scale)를 가진 수치형 데이터의 단위를 일정하게 맞추는 작업</td><td>나이(0~100)와 연봉(0~1억)을 모두 0과 1 사이로 변환</td></tr>
            <tr><td><strong>데이터 밸런싱 (Balancing)</strong></td><td>특정 클래스의 데이터가 너무 적거나 많을 때 비율을 맞추는 작업</td><td>암 환자:정상인 = 1:99일 때, Oversampling 또는 Undersampling</td></tr>
            <tr><td><strong>결측치 처리</strong></td><td>누락된 데이터를 처리하는 작업</td><td>평균/중앙값 대체, 행 삭제, KNN 대체</td></tr>
            <tr><td><strong>이상치 제거</strong></td><td>비정상적인 값을 탐지하고 처리</td><td>IQR, Z-score 기반 이상치 탐지</td></tr>
          </tbody></table>
        </ToggleSection>
        <ToggleSection title="대규모 데이터의 자동 레이블링 방법">
          <p>대량의 레이블이 없는 데이터를 보유한 경우, 다음과 같은 자동화된 방법으로 레이블을 생성할 수 있습니다.</p>
          <table className="info-table"><thead><tr><th>방법</th><th>설명</th></tr></thead><tbody>
            <tr><td><strong>배치 추론 (Batch Inference)</strong></td><td>사전 학습된 모델을 사용하여 대규모 데이터에 자동으로 레이블을 생성. 대량 처리에 적합</td></tr>
            <tr><td><strong>SageMaker AI 레이블링</strong></td><td>인간 검토자 또는 자동화된 워크플로를 통해 데이터를 레이블링하는 관리형 서비스</td></tr>
          </tbody></table>
        </ToggleSection>
        <SectionStatusBar categoryId="ml-development" sectionId="data-preprocessing" />
      </section>

      <section id="data-quality">
        <h2>데이터셋 품질 평가 기준</h2>
        <p>수집된 데이터의 품질을 평가하는 것은 모델 성능에 직접적인 영향을 미치므로 매우 중요합니다.</p>
        <table className="info-table"><thead><tr><th>특성</th><th>설명</th><th>체크포인트</th></tr></thead><tbody>
          <tr><td><strong>Accuracy (정확성)</strong></td><td>데이터가 실제를 정확히 반영하는가</td><td>오타, 측정 오류, 잘못된 레이블</td></tr>
          <tr><td><strong>Diversity (다양성)</strong></td><td>모든 그룹/시나리오를 포괄하는가</td><td>전 연령대, 모든 지역, 다양한 인종</td></tr>
          <tr><td><strong>Completeness (완전성)</strong></td><td>필요한 모든 데이터가 존재하는가</td><td>결측값(Missing values) 비율, 필수 속성 누락 여부</td></tr>
          <tr><td><strong>Consistency (일관성)</strong></td><td>데이터 간 모순이 없는가</td><td>형식 통일 (예: 날짜 YYYY-MM-DD), 중복 데이터 일치</td></tr>
          <tr><td><strong>Timeliness (적시성)</strong></td><td>적절한 시점의 데이터인가</td><td>최신 트렌드 반영 여부, 오래된 데이터의 현재 패턴 미반영</td></tr>
          <tr><td><strong>Relevance (관련성)</strong></td><td>목적에 맞는 데이터인가</td><td>불필요한 노이즈 제거, 예측 목표와 직접 관련된 속성 여부</td></tr>
          <tr><td><strong>Reliability (신뢰성)</strong></td><td>데이터 수집 과정의 일관성과 재현 가능성</td><td>신뢰할 수 있는 출처, 수집 방법의 표준화</td></tr>
        </tbody></table>
        <TipBox type="warning" title="Recency Bias 주의"><p>특정 시점(주로 최근) 데이터에 치우치면 계절성이나 장기 트렌드를 놓칠 수 있습니다. 예: 코로나 기간 데이터만으로 일반적인 소비 패턴 예측</p></TipBox>
        <SectionStatusBar categoryId="ml-development" sectionId="data-quality" />
      </section>

      <section id="aws-glue">
        <h2>AWS Glue</h2>
        <p>데이터 전처리 과정에서 <strong>AWS Glue</strong>를 활용하면 더욱 효율적으로 작업할 수 있습니다.</p>
        <table className="info-table"><thead><tr><th>특성</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>완전 관리형 ETL 서비스</strong></td><td>다양한 데이터 소스에서 데이터를 추출(Extract), 변환(Transform), 로드(Load)하는 작업을 자동화</td></tr>
          <tr><td><strong>서버리스 아키텍처</strong></td><td>인프라를 직접 관리할 필요 없이 확장성이 뛰어남</td></tr>
          <tr><td><strong>데이터 카탈로그</strong></td><td>데이터 정제, 스키마 추론, 데이터 카탈로그 생성 기능 제공</td></tr>
          <tr><td><strong>데이터 변환</strong></td><td>비정형 데이터(JSON, 로그 파일 등)를 구조화된 데이터(Parquet, CSV 등)로 변환</td></tr>
        </tbody></table>
        <TipBox type="info"><p>AWS Glue를 활용하여 비정형/비구조화 데이터를 <strong>구조화된 데이터(Parquet, CSV 등)로 변환</strong>하면 머신러닝 모델 학습에 더욱 적합하게 사용할 수 있습니다.</p></TipBox>
        <SectionStatusBar categoryId="ml-development" sectionId="aws-glue" />
      </section>

      <section id="model-selection">
        <h2>모델 선택 (Model Selection)</h2>
        <p>학습에 사용할 모델을 선택할 때는 비즈니스 요구 사항에 따라 여러 요소를 고려해야 합니다.</p>
        <table className="info-table"><thead><tr><th>고려 요소</th><th>설명</th><th>예시</th></tr></thead><tbody>
          <tr><td><strong>모델 크기 (Model Size)</strong></td><td>모델이 클수록 정확도는 높아질 수 있지만 추론 지연시간이 증가. 실시간 응답이 필요한 경우 작은 모델이 유리</td><td>차량 충돌 감지 후 30초 내 긴급 서비스 연락 시 작은 모델 선택</td></tr>
          <tr><td><strong>모델 비용 (Model Cost)</strong></td><td>모델 학습 및 추론에 드는 비용. 비즈니스 ROI와 비교하여 판단</td><td>대규모 GPU 비용 vs. 비즈니스 가치</td></tr>
          <tr><td><strong>모델 커스터마이징 (Customization)</strong></td><td>사전 학습 모델을 그대로 사용할지, 추가 학습이 필요한지 여부</td><td>사전 훈련 모델을 추가 학습 없이 사용 시 커스터마이징 불필요</td></tr>
        </tbody></table>
        <SectionStatusBar categoryId="ml-development" sectionId="model-selection" />
      </section>

      <section id="model-evaluation">
        <h2>모델 평가 지표 <span className="badge badge-exam">시험 빈출</span></h2>

        <h3>분류 모델 지표 (Classification Metrics)</h3>
        <p>모델이 데이터를 제대로 분류했는지가 핵심입니다.</p>
        <table className="info-table"><thead><tr><th>지표</th><th>공식</th><th>의미</th></tr></thead><tbody>
          <tr><td><strong>정확도 (Accuracy)</strong></td><td>(TP+TN) / 전체</td><td>전체 중 올바르게 예측한 비율. 정확하게(맞는 건 맞다, 아닌 건 아니다) 예측한 비율</td></tr>
          <tr><td><strong>정밀도 (Precision)</strong></td><td>TP / (TP+FP)</td><td>모델이 예측한 양성 중 실제 양성 비율. 거짓 양성을 줄이고 싶을 때 중시</td></tr>
          <tr><td><strong>재현율 (Recall)</strong></td><td>TP / (TP+FN)</td><td>실제 양성 중 맞춘 비율. 실제 양성을 놓치지 않는 능력</td></tr>
          <tr><td><strong>F1 Score</strong></td><td>2x(PxR)/(P+R)</td><td>정밀도와 재현율의 조화 평균, 모델 성능의 균형잡힌 측정치</td></tr>
          <tr><td><strong>AUC-ROC</strong></td><td>ROC 곡선 아래 면적</td><td>분류 성능 종합 평가 (0.5~1.0)</td></tr>
          <tr><td><strong>Confusion Matrix</strong></td><td>오차 행렬</td><td>분류 예측 성능을 측정하기 위한 표 (위 4가지 수치를 계산 가능)</td></tr>
        </tbody></table>
        <TipBox type="warning" title="지표 선택 기준"><p><strong>질병 진단, 사기 탐지</strong> -- 재현율(Recall) 중시 (양성을 놓치면 안 됨). <strong>스팸 필터</strong> -- 정밀도(Precision) 중시 (정상 메일을 스팸 처리하면 안 됨).</p></TipBox>

        <ToggleSection title="정확도 vs 정밀도 비교">
          <table className="info-table"><thead><tr><th>지표</th><th>설명</th></tr></thead><tbody>
            <tr><td><strong>정확도 (Accuracy)</strong></td><td>전체 100명 중 90명의 합격/불합격을 맞춤 -- 정확도 90%. '올바르게 분류된 항목과 잘못 분류된 항목의 총합' 대비 '올바르게 분류된 항목의 수'의 비율</td></tr>
            <tr><td><strong>정밀도 (Precision)</strong></td><td>합격(양성)이라고 예측한 80명 중 실제 합격자는 70명 -- 정밀도 87.5%. 실제로는 사기가 아니지만 사기로 표시된 사례를 검토하는 시간을 최소화</td></tr>
          </tbody></table>
        </ToggleSection>

        <h3>회귀 모델 지표 (Regression Metrics)</h3>
        <p>모델이 예측한 수치가 정답과 얼마나 차이가 나느냐, 즉 오차를 통해 성능을 측정합니다.</p>
        <table className="info-table"><thead><tr><th>지표</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>MAE</strong></td><td>Mean Absolute Error - 절대 오차 평균 (예: 집값 5억 예측 4.7억, 오차 0.3억)</td></tr>
          <tr><td><strong>MAPE</strong></td><td>Mean Absolute Percentage Error - 평균 절대 백분율 오차</td></tr>
          <tr><td><strong>MSE</strong></td><td>Mean Squared Error - 제곱 오차 평균</td></tr>
          <tr><td><strong>RMSE</strong></td><td>Root MSE - MSE의 제곱근 (큰 오차에 더 민감)</td></tr>
          <tr><td><strong>R2 Score</strong></td><td>결정계수 - 모델 설명력 (0~1)</td></tr>
        </tbody></table>

        <h3>지연 시간 (Latency) 지표</h3>
        <p>모델이 예측하는 데 걸리는 시간으로, 실시간 서비스에서 사용자 경험의 핵심 요소입니다.</p>
        <table className="info-table"><thead><tr><th>지표</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>평균 응답 시간</strong></td><td>모델이 입력을 받은 후 결과를 생성하는 데 걸리는 시간</td></tr>
          <tr><td><strong>평균 통화 시간</strong></td><td>콜센터 챗봇 등에서 상호작용에 소요되는 시간</td></tr>
          <tr><td><strong>추론 속도</strong></td><td>실시간 응답 제공 시 고려해야 하는 모델 특성</td></tr>
        </tbody></table>

        <ToggleSection title="상황별 지표 선택 예시">
          <table className="info-table"><thead><tr><th>상황</th><th>적합한 지표</th></tr></thead><tbody>
            <tr><td>모델이 올바르게 분류한 이미지의 수를 평가</td><td>정확도 (Accuracy)</td></tr>
            <tr><td>운영 AI 모델의 런타임 효율성 측정</td><td>평균 응답 시간 (Average response time)</td></tr>
            <tr><td>LLM 챗봇으로 콜센터 직원의 응답 조치 수를 줄이려 할 때</td><td>평균 통화 시간</td></tr>
            <tr><td>사용자에게 실시간으로 응답을 제공해야 할 때</td><td>추론 속도</td></tr>
          </tbody></table>
        </ToggleSection>
        <SectionStatusBar categoryId="ml-development" sectionId="model-evaluation" />
      </section>

      <section id="business-metrics">
        <h2>비즈니스 지표 <span className="badge badge-exam">시험 빈출</span></h2>
        <p>AI 솔루션이 비즈니스에 미치는 영향을 평가하기 위한 지표입니다.</p>
        <table className="info-table"><thead><tr><th>상황</th><th>적합한 지표</th></tr></thead><tbody>
          <tr><td>이커머스: 제품을 제대로 추천하는가</td><td><strong>클릭률 (CTR, Click-through rate)</strong></td></tr>
          <tr><td>이커머스: 제품 구매액에 얼마나 영향을 미치는가</td><td><strong>평균 주문 금액 (AOV, Average order value)</strong></td></tr>
          <tr><td>이커머스: 사용자가 재구매, 재방문하는가</td><td><strong>유지율 (Retention rate)</strong></td></tr>
          <tr><td>AI 솔루션이 매출에 미치는 영향 평가</td><td><strong>전환율 (Conversion rate)</strong></td></tr>
          <tr><td>AI 어시스턴트가 판매 성과에 미치는 직접적 영향</td><td><strong>전환율 (Conversion rate)</strong></td></tr>
          <tr><td>AI가 고객 문의를 자동 응대하여 상담원의 노력을 줄이려 할 때</td><td><strong>첫 번째 연락 해결률 (FCR, First Contact Resolution Rate)</strong></td></tr>
        </tbody></table>
        <TipBox type="important"><p>시험에서 비즈니스 지표와 기술 지표를 구분하는 문제가 자주 출제됩니다. <strong>전환율(Conversion rate)</strong>과 <strong>FCR</strong>이 특히 빈출 키워드입니다.</p></TipBox>
        <SectionStatusBar categoryId="ml-development" sectionId="business-metrics" />
      </section>

      <section id="feature-engineering">
        <h2>특성 공학 (Feature Engineering)</h2>
        <p>예측 모델을 만들 때 데이터의 속성이나 변수를 선택하고 변환하는 방법입니다. 훈련 데이터셋의 변수 수를 증가시켜 데이터를 풍부하게 만들고, 궁극적으로 모델의 성능을 향상시킵니다.</p>
        <table className="info-table"><thead><tr><th>기법</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>특성 생성 (Feature Creation)</strong></td><td>기존 데이터로부터 새로운 특성을 만들어내는 과정</td></tr>
          <tr><td><strong>특성 변환 (Feature Transformation)</strong></td><td>기존 특성을 더 유용한 형태로 변환하는 과정</td></tr>
          <tr><td><strong>특성 추출 (Feature Extraction)</strong></td><td>데이터에서 중요한 특성을 뽑아내는 과정</td></tr>
          <tr><td><strong>특성 선택 (Feature Selection)</strong></td><td>가장 유용한 특성들을 선별하는 과정</td></tr>
        </tbody></table>
        <TipBox type="info"><p>마치 요리사가 같은 재료라도 다양한 방식으로 가공하고 조합하여 더 맛있는 요리를 만드는 것과 유사합니다. 피처 엔지니어링은 데이터를 풍부하게 만들어 모델 성능을 향상시킵니다.</p></TipBox>
        <SectionStatusBar categoryId="ml-development" sectionId="feature-engineering" />
      </section>

      <section id="hyperparameter">
        <h2>하이퍼파라미터 튜닝</h2>
        <p>ML 알고리즘의 <strong>학습 방식을 미세 조정</strong>하는 과정입니다. 마치 요리사가 온도와 시간, 재료의 양을 조절하며 최적의 조리 방법을 찾는 것과 유사합니다.</p>
        <table className="info-table"><thead><tr><th>하이퍼파라미터</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>에포크 (Epoch)</strong></td><td>전체 데이터셋을 반복 학습하는 횟수. 많을수록 정확도 향상 가능하나 과적합 위험</td></tr>
          <tr><td><strong>학습률 (Learning Rate)</strong></td><td>모델이 각 단계에서 가중치를 얼마나 조정할지 결정. 너무 크면 발산, 너무 작으면 수렴 느림</td></tr>
          <tr><td><strong>배치 크기 (Batch Size)</strong></td><td>한 번에 처리하는 데이터 샘플 수</td></tr>
        </tbody></table>
        <TipBox type="warning"><p>하이퍼파라미터 튜닝은 <strong>기존 하이퍼파라미터만 조정</strong>하는 것입니다. 하이퍼파라미터를 새로 추가하는 것이 아닙니다.</p></TipBox>
        <SectionStatusBar categoryId="ml-development" sectionId="hyperparameter" />
      </section>

      <section id="overfitting">
        <h2>과적합 / 과소적합</h2>
        <table className="info-table"><thead><tr><th>구분</th><th>과적합 (Overfitting)</th><th>과소적합 (Underfitting)</th></tr></thead><tbody>
          <tr><td><strong>특성</strong></td><td>낮은 편향, 높은 분산 (variance)</td><td>높은 편향 (bias)</td></tr>
          <tr><td><strong>증상</strong></td><td>학습 성능 높음, 검증 성능 낮음</td><td>학습/검증 모두 성능 낮음</td></tr>
          <tr><td><strong>원인</strong></td><td>모델 복잡도 과다, 데이터 부족, 노이즈까지 학습</td><td>모델이 너무 단순, 학습 부족</td></tr>
          <tr><td><strong>비유</strong></td><td>시험문제의 답만 외우고 변형 문제는 풀지 못하는 학생</td><td>너무 단순한 공식으로 복잡한 문제를 해결하려는 것</td></tr>
        </tbody></table>

        <ToggleSection title="과적합 해결 기법 상세" defaultOpen>
          <table className="info-table"><thead><tr><th>해결 방법</th><th>설명</th></tr></thead><tbody>
            <tr><td><strong>훈련 데이터 증가</strong></td><td>실제로 새로운 데이터를 더 수집하여 모델의 학습 범위를 넓히는 방법</td></tr>
            <tr><td><strong>데이터 증강 (Data Augmentation)</strong></td><td>기존 데이터를 변형(이미지: 회전/반전/밝기 조절, 텍스트: 동의어 치환)하여 다양성을 높이는 방법</td></tr>
            <tr><td><strong>조기 종료 (Early Stopping)</strong></td><td>검증 성능 하락 시 학습 중단. 데이터를 과도하게 암기하지 않도록 함</td></tr>
            <tr><td><strong>하이퍼파라미터 조정</strong></td><td>학습률(learning rate), 배치 크기(batch size) 등을 조절 (기존 파라미터만 조정)</td></tr>
            <tr><td><strong>정규화 (Regularization)</strong></td><td>L1(Lasso), L2(Ridge) 패널티로 극단적인 가중치 값에 패널티를 부여</td></tr>
            <tr><td><strong>교차 검증 (Cross Validation)</strong></td><td>K-Fold로 데이터를 여러 부분으로 나누어 반복적으로 검증</td></tr>
            <tr><td><strong>단순한 모델 사용</strong></td><td>필요 이상으로 복잡한 모델은 불필요한 패턴까지 학습할 수 있음</td></tr>
            <tr><td><strong>차원 축소 (Dimension Reduction)</strong></td><td>PCA(Principal Component Analysis) 등으로 불필요한 특성을 제거하여 과적합 위험 감소</td></tr>
            <tr><td><strong>드롭아웃 (Dropout)</strong></td><td>학습 시 랜덤하게 뉴런을 비활성화</td></tr>
          </tbody></table>
        </ToggleSection>

        <ToggleSection title="훈련 데이터 증가 vs 데이터 증강">
          <table className="info-table"><thead><tr><th>구분</th><th>훈련 데이터 증가</th><th>데이터 증강</th></tr></thead><tbody>
            <tr><td><strong>방법</strong></td><td>실제 새로운 데이터를 추가 수집</td><td>기존 데이터를 변형하여 인공적으로 새 데이터 생성</td></tr>
            <tr><td><strong>예시</strong></td><td>실제 고객으로부터 더 많은 리뷰 수집</td><td>이미지 회전/반전/밝기 조절, 텍스트 동의어 치환</td></tr>
            <tr><td><strong>장점</strong></td><td>실제 환경의 다양성을 직접 반영</td><td>데이터 수집이 어렵거나 비용이 많이 드는 상황에서 유용</td></tr>
            <tr><td><strong>한계</strong></td><td>수집 비용과 시간 소요</td><td>인위적 데이터이므로 실제 데이터의 특성을 완벽히 반영 못할 수 있음</td></tr>
          </tbody></table>
          <p>다양한 학습 데이터의 이점: (1) 모델이 더 넓은 패턴을 학습하여 실제 환경의 새로운 데이터에 대해 더 나은 일반화 능력을 가짐 (2) 과적합 위험이 줄어듦</p>
        </ToggleSection>

        <ToggleSection title="상황별 과적합 해결 예시">
          <table className="info-table"><thead><tr><th>상황</th><th>방법</th></tr></thead><tbody>
            <tr><td>모델의 정확도를 특정 허용 수준까지 높이길 희망</td><td>에포크 늘리기</td></tr>
            <tr><td>프로덕션에 배포했을 때 모델의 성능이 크게 하락</td><td>학습에 사용되는 데이터의 양 늘리기</td></tr>
            <tr><td>입력 데이터가 편향되어 있고 특정 속성이 이미지 생성에 영향</td><td>불균형 클래스의 데이터 증대</td></tr>
            <tr><td>편향성을 최소화하며 책임감 있는 AI 구축</td><td>데이터의 불균형이나 격차를 감지 (SageMaker Clarify)</td></tr>
          </tbody></table>
        </ToggleSection>
        <SectionStatusBar categoryId="ml-development" sectionId="overfitting" />
      </section>

      <section id="bias-types">
        <h2>편향 유형 (Bias) <span className="badge badge-exam">시험 빈출</span></h2>
        <p>편향(Bias)은 모델이 데이터셋의 중요한 특성을 놓치고 있다는 의미입니다. 데이터가 너무 단순할 때 발생하며, 과소적합(underfitting)이라고도 합니다.</p>
        <table className="info-table"><thead><tr><th>편향 유형</th><th>설명</th><th>예시</th></tr></thead><tbody>
          <tr><td><strong>측정 편향 (Measurement Bias)</strong></td><td>측정 과정 자체의 문제로 발생하는 체계적 오류. 데이터를 수집하거나 레이블링하는 방식 자체에 문제가 있을 때 발생</td><td>체중계가 항상 실제보다 2kg 더 무겁게 측정</td></tr>
          <tr><td><strong>표본 편향 (Sampling Bias)</strong></td><td>데이터가 전체 모집단을 제대로 대표하지 못할 때 발생</td><td>서울에서만 설문조사를 하고 전국 의견이라고 말하는 것. AI 모델이 특정 그룹 데이터만 과도하게 학습</td></tr>
          <tr><td><strong>관찰자 편향 (Observer Bias)</strong></td><td>관찰자의 주관적 기대나 선입견이 결과 해석에 영향을 미치는 경우</td><td>연구자가 자신의 가설을 확인하고 싶은 나머지 데이터를 선택적으로 해석</td></tr>
          <tr><td><strong>확증 편향 (Confirmation Bias)</strong></td><td>자신의 기존 신념이나 가설을 지지하는 정보만 선택적으로 받아들이는 경향</td><td>다이어트 효과 연구 시 성공 사례만 모으고 실패 사례는 무시</td></tr>
        </tbody></table>
        <TipBox type="important"><p>시험에서 4가지 편향 유형의 정의와 예시를 구분하는 문제가 자주 출제됩니다. 특히 <strong>표본 편향(Sampling Bias)</strong>과 <strong>측정 편향(Measurement Bias)</strong>의 차이를 명확히 이해하세요.</p></TipBox>
        <SectionStatusBar categoryId="ml-development" sectionId="bias-types" />
      </section>

      <section id="mlops">
        <h2>MLOps <span className="badge badge-exam">시험 빈출</span></h2>
        <p><strong>MLOps(ML Operations)</strong>는 ML 모델의 개발, 배포, 운영을 체계적으로 관리하는 모범 사례입니다. 소프트웨어 개발의 DevOps와 유사한 개념으로, ML 시스템의 지속적인 품질 유지를 목표로 합니다.</p>
        <table className="info-table"><thead><tr><th>MLOps 핵심 관행</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>지속적 모니터링</strong></td><td>프로덕션 환경에서 모델 출력을 지속적으로 모니터링하여 성능 저하, 데이터 드리프트를 감지</td></tr>
          <tr><td><strong>모델 재학습</strong></td><td>새로운 데이터가 축적되거나 성능이 저하되면 모델을 재학습하여 최신 패턴 반영</td></tr>
          <tr><td><strong>실험 관리</strong></td><td>다양한 모델, 하이퍼파라미터, 데이터셋 조합을 체계적으로 추적하고 비교</td></tr>
          <tr><td><strong>반복 가능한 파이프라인</strong></td><td>데이터 수집부터 배포까지의 과정을 자동화하여 일관성 확보</td></tr>
          <tr><td><strong>기술 부채 관리</strong></td><td>코드, 데이터, 모델의 복잡성을 지속적으로 관리하여 유지보수 비용 절감</td></tr>
        </tbody></table>
        <ToggleSection title="MLOps 라이프사이클" defaultOpen>
          <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', padding: '16px 0'}}>
            <span style={{background: '#3498db', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold'}}>모델 준비</span>
            <span style={{padding: '8px 4px', fontSize: '20px'}}>{'-->'}</span>
            <span style={{background: '#2ecc71', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold'}}>테스트</span>
            <span style={{padding: '8px 4px', fontSize: '20px'}}>{'-->'}</span>
            <span style={{background: '#e67e22', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold'}}>배포</span>
            <span style={{padding: '8px 4px', fontSize: '20px'}}>{'-->'}</span>
            <span style={{background: '#9b59b6', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold'}}>모니터링</span>
            <span style={{padding: '8px 4px', fontSize: '20px'}}>{'-->'}</span>
            <span style={{background: '#e74c3c', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold'}}>개선</span>
            <span style={{padding: '8px 4px', fontSize: '20px'}}>{'-->'}</span>
            <span style={{background: '#3498db', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold'}}>모델 준비</span>
          </div>
          <p style={{textAlign: 'center', color: '#888'}}>MLOps는 지속적인 순환 프로세스입니다</p>
        </ToggleSection>
        <TipBox type="important"><p><strong>데이터 드리프트(Data Drift)</strong>: 시간이 지나면서 프로덕션 데이터의 분포가 학습 데이터와 달라지는 현상입니다. 지속적 모니터링을 통해 감지하고 모델 재학습으로 대응합니다.</p></TipBox>
        <SectionStatusBar categoryId="ml-development" sectionId="mlops" />
      </section>

      <section id="quiz">
        <h2>도장깨기 퀴즈</h2>
        <Quiz categoryId="ml-development" categoryTitle="ML 개발" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
