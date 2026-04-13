import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz from '../components/Quiz'
import SectionStatusBar from '../components/SectionStatusBar'
import { getQuestionsByCategory } from '../data/quizData'

const sections = [
  { id: 'ai-ml-dl', title: 'AI / ML / DL 개념' },
  { id: 'ml-types', title: 'ML 학습 방식 분류' },
  { id: 'supervised-detail', title: '지도 학습 상세' },
  { id: 'unsupervised-detail', title: '비지도 학습 상세' },
  { id: 'classification-regression', title: '분류 vs 회귀' },
  { id: 'knn-vs-kmeans', title: 'KNN vs K-Means' },
  { id: 'ml-architecture', title: 'ML 학습 아키텍처' },
  { id: 'ml-selection', title: '상황별 ML 선택 가이드' },
  { id: 'aws-ai-services', title: 'AWS AI 서비스' },
  { id: 'quiz', title: '도장깨기 퀴즈' },
]

const quizQuestions = getQuestionsByCategory('ai-ml-basics')

export default function AiMlBasics() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('ai-ml-basics') }, [markStudied])

  return (
    <GuideLayout title="AI와 ML의 기초" description="AI, ML, DL의 핵심 개념과 AWS AI 서비스를 학습합니다." icon="🤖" badges={[{ label: '출제비율 17.6%', type: 'primary' }, { label: '60문제', type: 'info' }]} sections={sections} categoryId="ai-ml-basics">

      <section id="ai-ml-dl">
        <h2>AI / ML / DL 개념</h2>
        <TipBox type="info" title="우리 일상 속 AI">
          <p>스마트폰 얼굴 인식, 음악 앱의 추천 재생, 번역기로 영어 과제 검토... AI는 이미 우리의 일상 깊숙이 스며들어 있습니다. <strong>"기계도 생각할 수 있을까?"</strong>라는 질문에서 출발한 AI의 기초를 알아보겠습니다.</p>
        </TipBox>
        <p>인공지능(AI), 머신러닝(ML), 딥러닝(DL)은 포함 관계에 있습니다: <strong>AI &#8835; ML &#8835; DL</strong></p>

        <table className="info-table"><thead><tr><th>구분</th><th>정의</th><th>특징</th><th>예시</th></tr></thead><tbody>
          <tr><td><strong>AI (인공지능)</strong></td><td>인간의 지능을 모방하는 기술 총칭. 사람처럼 '생각'하고 '행동'하는 것</td><td>가장 넓은 개념. 전문가 시스템, 규칙 기반 시스템 포함</td><td>자율주행 자동차의 보행자 인식, 키오스크 주문 시스템, 은행 대출 심사</td></tr>
          <tr><td><strong>ML (머신러닝)</strong></td><td>데이터(경험)를 통해 컴퓨터가 '학습'하는 AI 하위 분야</td><td>명시적 프로그래밍 없이 학습. 문제를 많이 풀면 실력이 느는 것과 유사</td><td>스팸 메일 필터링, 신용카드 이상 거래 탐지, 추천 시스템</td></tr>
          <tr><td><strong>DL (딥러닝)</strong></td><td>인간의 뉴런 구조를 모방한 <strong>신경망</strong> 기반 ML 하위 분야</td><td>복잡한 패턴 학습 가능. <strong>블랙박스 모델</strong>로 해석 가능성(Interpretability)이 가장 낮음</td><td>얼굴 인식, 음성 인식, 컴퓨터 비전, NLP, 시계열 예측(DeepAR)</td></tr>
        </tbody></table>

        <ToggleSection title="전문가 시스템과 규칙 기반 시스템">
          <p>인간의 지성을 구현하는 방법 중 ML 이전의 전통적 방식입니다. <strong>전문가 시스템(Expert Systems)</strong>과 <strong>규칙 기반 시스템(Rule-based Systems)</strong>이 대표적입니다.</p>
          <ul>
            <li>명확한 규칙(if-else)으로 동작하며, 키오스크 주문 등 간단한 자동화에 사용</li>
            <li>예: 은행 대출 심사 - "연소득 {'>'} 5000만원 AND 신용등급 {'>'} 800 이면 대출 승인"</li>
            <li>데이터에서 학습하는 것이 아닌, 사람이 직접 규칙을 정의</li>
          </ul>
        </ToggleSection>

        <TipBox type="important" title="시험 핵심"><p><strong>AI &#8835; ML &#8835; DL</strong> 관계를 기억하세요. 딥러닝은 <strong>블랙박스 모델</strong>로 해석 가능성이 가장 낮고, 선형 회귀는 설명 가능성이 가장 높습니다. 생성형 AI는 새로운 콘텐츠를 생성하는 DL 기반 기술입니다.</p></TipBox>
        <SectionStatusBar categoryId="ai-ml-basics" sectionId="ai-ml-dl" />
      </section>

      <section id="ml-types">
        <h2>ML 학습 방식 분류 <span className="badge badge-exam">시험 빈출</span></h2>
        <table className="info-table"><thead><tr><th>유형</th><th>데이터</th><th>설명</th><th>대표 알고리즘 / 사용 사례</th></tr></thead><tbody>
          <tr><td><strong>지도 학습 (Supervised) &#11088;</strong></td><td>레이블 있음</td><td>입력 데이터와 정답(레이블)이 주어진 상태에서 학습</td><td>선형회귀, 로지스틱 회귀, SVM, 의사결정 트리, KNN, XGBoost / 스팸 탐지, 가격 예측, 분류</td></tr>
          <tr><td><strong>비지도 학습 (Unsupervised) &#11088;</strong></td><td>레이블 없음</td><td>데이터의 패턴을 스스로 학습하여 그룹화하거나 이상치를 탐지</td><td>K-Means, PCA, Autoencoder, RCF / 고객 세분화, 이상 탐지, 차원 축소</td></tr>
          <tr><td><strong>준지도 학습 (Semi-supervised)</strong></td><td>일부만 레이블</td><td>정답이 있는 문제와 없는 문제를 섞어서 학습</td><td>사기 거래 탐지, 감정 분석, 문서 분류</td></tr>
          <tr><td><strong>강화 학습 (Reinforcement) &#11088;</strong></td><td>환경 상호작용</td><td>보상 시스템을 통해 시행 착오로 최적의 행동을 학습</td><td>Q-Learning, DQN / 게임 AI, DeepRacer, 알파고, 로봇 길찾기</td></tr>
          <tr><td><strong>전이 학습 (Transfer Learning) &#11088;</strong></td><td>사전 학습 모델 활용</td><td>사전 학습된 모델의 지식을 새로운 관련 작업에 활용. 개발 노력 감소</td><td>사전 학습된 DL 모델을 미세 조정(Fine-tuning)하여 새 작업 수행</td></tr>
        </tbody></table>

        <ToggleSection title="강화 학습 구성 요소와 예시">
          <ul>
            <li><strong>에이전트:</strong> 학습하고 행동을 결정하는 주체</li>
            <li><strong>환경:</strong> 상호작용하는 세계</li>
            <li><strong>보상:</strong> 행동의 결과 피드백</li>
            <li><strong>정책:</strong> 상태에서 행동을 결정하는 전략</li>
          </ul>
          <p><strong>강화 학습 예시:</strong></p>
          <ul>
            <li>행동의 가치를 계산해 최고의 선택하기 (예: 미로에서 보상이 가장 큰 경로 찾기)</li>
            <li>상황에 따른 최적의 행동 방침 학습하기 (예: 알파고가 바둑에서 최적의 수를 찾는 과정)</li>
            <li>행동을 선택하는 배우와 평가하는 비평가 조합 (예: 게임에서 전략을 세우고 결과를 평가하며 개선)</li>
            <li>환경 모델을 만들어 계획적으로 행동하기 (예: 체스나 바둑에서 수를 미리 생각하고 두기)</li>
          </ul>
        </ToggleSection>

        <ToggleSection title="전이 학습 예시 &#11088;">
          <ul>
            <li>강아지와 고양이를 구분하는 모델을 활용하여 다른 동물(여우, 늑대)도 구별하는 모델로 확장</li>
            <li>영어-프랑스어 번역 모델을 활용하여 영어-독일어 번역 모델을 개선</li>
            <li>사전 학습된 딥러닝 모델을 사용하여 새 데이터셋에 대해 미세 조정(Fine-tuning)</li>
          </ul>
          <TipBox type="important"><p>시험에서 "처음부터 새 모델을 만드는 것을 피하고, 사전 학습된 모델을 조정"하는 시나리오가 나오면 <strong>전이 학습</strong>이 정답입니다.</p></TipBox>
        </ToggleSection>

        <SectionStatusBar categoryId="ai-ml-basics" sectionId="ml-types" />
      </section>

      <section id="supervised-detail">
        <h2>지도 학습 상세 <span className="badge badge-exam">시험 빈출</span></h2>
        <p>지도 학습은 레이블이 달린 데이터로 학습하며, <strong>회귀</strong>와 <strong>분류</strong>로 나뉩니다.</p>

        <table className="info-table"><thead><tr><th>종류</th><th>설명</th><th>예시</th></tr></thead><tbody>
          <tr><td><strong>회귀 (Regression) &#11088;</strong></td><td>연속적인 수치 예측. 독립 변수와 종속 변수 간의 관계를 모델링. 명시적 가중치(weight) 파라미터 존재하며 도메인 지식으로 조정 가능. <strong>설명 가능성(Explainability)이 가장 높음</strong></td><td>매출 예측, 집값 예측, 온도 예측</td></tr>
          <tr><td><strong>이진 분류 (Binary Classification) &#11088;</strong></td><td>0 또는 1, 두 가지 클래스로 분류. 로지스틱 회귀(Logistic Regression) 사용</td><td>이메일 스팸/정상 분류, 대출 신청 위험 평가</td></tr>
          <tr><td><strong>다중 분류 (Multi-class) &#11088;</strong></td><td>3개 이상의 클래스로 분류</td><td>동물을 개/새/고양이로 분류, 리뷰를 긍정/부정/중립으로 분류</td></tr>
          <tr><td><strong>의사결정 트리 (Decision Tree) &#11088;</strong></td><td>예/아니오 질문을 통해 답을 찾는 알고리즘. 스무고개 원리를 수학적으로 확장. 회귀와 분류 모두 가능. <strong>다중 클래스 분류</strong> 문제에도 활용</td><td>유전자 특성에 따른 20가지 범주 분류</td></tr>
          <tr><td><strong>KNN (K-최근접 이웃) &#11088;</strong></td><td>새로운 데이터가 주어지면 <strong>사전 정의된 카테고리(레이블) 중</strong> 가장 가까운 K개를 찾아 다수결로 분류</td><td>기존 고객 그룹 중 어디에 속하는지 예측</td></tr>
        </tbody></table>

        <TipBox type="important" title="시험 핵심: 해석 가능성 순서">
          <p><strong>선형 회귀 {'>'} 의사결정 트리 {'>'} 딥러닝(신경망)</strong> 순서로 해석 가능성이 높습니다. 시험에서 "해석 가능성이 가장 높은 모델"을 물으면 <strong>선형 회귀</strong>, "블랙박스 모델"을 물으면 <strong>딥러닝</strong>이 정답입니다.</p>
        </TipBox>

        <SectionStatusBar categoryId="ai-ml-basics" sectionId="supervised-detail" />
      </section>

      <section id="unsupervised-detail">
        <h2>비지도 학습 상세 <span className="badge badge-exam">시험 빈출</span></h2>
        <p>비지도 학습은 레이블이 없는 데이터에서 패턴을 스스로 학습합니다.</p>

        <table className="info-table"><thead><tr><th>종류</th><th>설명</th><th>예시</th></tr></thead><tbody>
          <tr><td><strong>군집화 (K-Means Clustering) &#11088;</strong></td><td>데이터의 패턴을 분석하여 비슷한 데이터끼리 <strong>자동으로 그룹(클러스터)</strong>화. 세그멘테이션(segmentation) 수행</td><td>고객의 인구 통계 및 구매 패턴을 기반으로 고객 그룹 식별</td></tr>
          <tr><td><strong>차원 축소 (Dimension Reduction)</strong></td><td>복잡한 정보를 간단하게 줄이기. 고차원 데이터의 핵심 특성 추출</td><td>PCA를 활용한 데이터 압축, 시각화</td></tr>
          <tr><td><strong>이상 탐지 (Anomaly Detection) &#11088;</strong></td><td>정상 패턴에서 벗어나는 데이터를 감지. <strong>RCF(Random Cut Forest)</strong>, <strong>Autoencoder</strong> 활용</td><td>IP 트래픽 이상 탐지, 신용카드 부정 사용 탐지</td></tr>
          <tr><td><strong>군집 분석 (Cluster Analysis)</strong></td><td>데이터의 자연적 그룹 구조 분석</td><td>시장 세분화, 유사 문서 그룹핑</td></tr>
          <tr><td><strong>밀도 추정 (Density Estimation)</strong></td><td>데이터의 확률 분포를 추정</td><td>데이터 분포 모델링, 이상치 탐지</td></tr>
          <tr><td><strong>자기 지도 학습 (Self-supervised)</strong></td><td>준지도 학습으로 분류되기도 함. 데이터 자체에서 레이블을 생성하여 학습</td><td>텍스트 마스킹 후 예측(BERT 방식)</td></tr>
        </tbody></table>

        <TipBox type="warning" title="오토인코더(Autoencoder)와 이상 탐지">
          <p>오토인코더는 비지도 학습 방식으로 정상 데이터의 패턴을 학습한 뒤, 재구성 오차가 큰 데이터를 <strong>이상(anomaly)</strong>으로 판별합니다. AWS에서는 <strong>Random Cut Forest(RCF)</strong>도 이상 탐지에 자주 사용됩니다.</p>
        </TipBox>

        <SectionStatusBar categoryId="ai-ml-basics" sectionId="unsupervised-detail" />
      </section>

      <section id="classification-regression">
        <h2>분류 vs 회귀 <span className="badge badge-exam">시험 빈출</span></h2>
        <table className="info-table"><thead><tr><th>구분</th><th>분류 (Classification) &#11088;</th><th>회귀 (Regression) &#11088;</th></tr></thead><tbody>
          <tr><td>출력</td><td>범주형 (스팸/정상, 긍정/부정/중립)</td><td>연속 수치 (가격, 온도, 매출)</td></tr>
          <tr><td>하위 유형</td><td>이진 분류(0/1), 다중 분류(3+클래스)</td><td>선형 회귀, 다항 회귀</td></tr>
          <tr><td>평가 지표</td><td>정확도, 정밀도, 재현율, F1</td><td>MAE, MSE, RMSE, R&#178;</td></tr>
          <tr><td>알고리즘</td><td>로지스틱 회귀, SVM, 랜덤포레스트, 의사결정 트리</td><td>선형 회귀, 다항 회귀</td></tr>
          <tr><td>해석 가능성</td><td>의사결정 트리: 높음 / 신경망: 낮음</td><td>선형 회귀: 가장 높음 (가중치 직접 확인 가능)</td></tr>
        </tbody></table>
        <TipBox type="warning"><p>"로지스틱 회귀"는 이름에 회귀가 있지만 실제로는 <strong>분류</strong> 알고리즘입니다! 이진 분류(0 또는 1)에 사용됩니다.</p></TipBox>
        <TipBox type="important" title="시험 핵심: 심장 질환 예측 시나리오">
          <p>심장 질환 위험을 예측하는 ML 모델 개발 + 데이터셋에 심장 질환 유무(레이블)가 있는 경우 &#8594; <strong>지도 학습의 이진 분류</strong>입니다.</p>
        </TipBox>
        <SectionStatusBar categoryId="ai-ml-basics" sectionId="classification-regression" />
      </section>

      <section id="knn-vs-kmeans">
        <h2>KNN vs K-Means &#11088; <span className="badge badge-exam">시험 빈출</span></h2>
        <p>이름이 비슷하지만 완전히 다른 알고리즘입니다. 시험에서 자주 혼동을 유도합니다.</p>
        <table className="info-table"><thead><tr><th>구분</th><th>KNN (K-최근접 이웃)</th><th>K-Means (군집화)</th></tr></thead><tbody>
          <tr><td><strong>학습 방식</strong></td><td><strong>지도 학습</strong></td><td><strong>비지도 학습</strong></td></tr>
          <tr><td><strong>목적</strong></td><td>기존 그룹에 속하게 하기 (분류)</td><td>새로운 그룹을 만들기 (군집화)</td></tr>
          <tr><td><strong>레이블</strong></td><td>기존 그룹이 이미 존재해야 사용 가능. 학습 데이터에 정답(레이블) 필요</td><td>데이터에 레이블이 없고, 그룹을 사전에 모르는 경우에 사용</td></tr>
          <tr><td><strong>예시 1</strong></td><td>특정 고객이 기존의 어느 고객 그룹에 속하는지 예측</td><td>고객의 인구 통계, 구매 패턴 등을 기반으로 비슷한 고객을 자동 분류</td></tr>
          <tr><td><strong>예시 2</strong></td><td>새로운 전학생이 왔을 때 기존 그룹에 배정하기</td><td>반 친구들을 비슷한 관심사(게임, 운동 등)를 보고 자동으로 그룹 나누기</td></tr>
        </tbody></table>
        <TipBox type="important" title="시험 핵심">
          <p><strong>KNN</strong>: 이미 그룹이 있고, 새 데이터를 기존 그룹에 배정 &#8594; <strong>지도 학습</strong><br/>
          <strong>K-Means</strong>: 그룹이 없고, 데이터를 자동으로 그룹화 &#8594; <strong>비지도 학습</strong></p>
        </TipBox>
        <SectionStatusBar categoryId="ai-ml-basics" sectionId="knn-vs-kmeans" />
      </section>

      <section id="ml-architecture">
        <h2>ML 학습 아키텍처</h2>
        <p>데이터를 어디서, 어떻게 학습시키느냐에 따른 아키텍처 분류입니다.</p>
        <table className="info-table"><thead><tr><th>아키텍처</th><th>설명</th><th>특징</th></tr></thead><tbody>
          <tr><td><strong>중앙 집중식 학습 (Centralized Learning)</strong></td><td>모든 데이터를 하나의 중앙 서버나 데이터 센터로 모아 모델을 학습</td><td>데이터 관리와 모델 훈련이 용이하지만, 데이터 전송 비용과 프라이버시 침해 위험 존재. 가장 일반적인 방식</td></tr>
          <tr><td><strong>연합 학습 (Federated Learning) &#11088;</strong></td><td>데이터를 중앙 서버로 보내지 않고, 각 사용자의 기기(로컬 환경)에서 모델을 학습. <strong>학습된 결과(모델 가중치)만</strong> 중앙 서버로 보내 통합</td><td><strong>데이터 규정 준수와 개인정보 보호 보장 가능</strong></td></tr>
          <tr><td><strong>스플릿 학습 (Split Learning)</strong></td><td>하나의 딥러닝 모델을 앞단(클라이언트)과 뒷단(서버)으로 나누어 분할 학습</td><td>원본 데이터가 외부로 나가지 않아 의료/금융 등 민감 데이터 협업 학습에 적합</td></tr>
          <tr><td><strong>온라인 학습 (Online Learning)</strong></td><td>새로운 데이터가 실시간으로 들어올 때마다 순차적으로 모델을 업데이트</td><td>스트리밍 환경에 유리. 최신 패턴을 잘 반영하지만 노이즈에 민감할 수 있음</td></tr>
        </tbody></table>
        <TipBox type="important" title="시험 핵심: 연합 학습">
          <p>"AI 모델을 훈련할 때 <strong>데이터 규정 준수와 개인정보 보호를 보장</strong>하는 ML 기법"을 물으면 <strong>연합 학습(Federated Learning)</strong>이 정답입니다.</p>
        </TipBox>
        <SectionStatusBar categoryId="ai-ml-basics" sectionId="ml-architecture" />
      </section>

      <section id="ml-selection">
        <h2>상황별 ML 선택 가이드 &#11088; <span className="badge badge-exam">시험 빈출</span></h2>
        <p>시험에서 특정 시나리오를 주고 적절한 ML 방법을 선택하는 문제가 자주 출제됩니다.</p>
        <table className="info-table"><thead><tr><th>상황</th><th>적합한 알고리즘</th></tr></thead><tbody>
          <tr><td>유전자 특성에 따라 인간 유전자를 <strong>20가지 범주로 분류</strong></td><td>다중 클래스 분류, 의사결정 트리</td></tr>
          <tr><td><strong>레이블이 없는</strong> 고객 데이터로 고객을 등급별로 분류하여 광고</td><td>비지도 학습 (군집화, K-Means)</td></tr>
          <tr><td>처음부터 새 모델을 만들지 않고 <strong>사전 학습된 모델을 조정</strong></td><td>전이 학습 (Transfer Learning)</td></tr>
          <tr><td>IP 주소 트래픽 패턴 기반 <strong>이상 탐지</strong> 시스템 개발</td><td>이상 탐지 (RCF, Autoencoder)</td></tr>
          <tr><td>사진 속 동물을 수작업 없이 자동으로 식별하고 분류</td><td>신경망 - 컴퓨터 비전 (물체 감지)</td></tr>
          <tr><td>소프트웨어 개발 생산성을 높이기 위해 AI 사용</td><td>자연어 처리(NLP) 또는 LLM을 사용하여 코드 생성</td></tr>
          <tr><td>제조 회사에서 AI를 사용하여 제품 손상/결함 탐지</td><td>컴퓨터 비전 (신경망)</td></tr>
          <tr><td>교육용 게임에서 확률 예측 + <strong>최소한의 운영 오버헤드</strong></td><td>간단한 규칙/계산 코드 작성 (AI 모델은 운영 오버헤드 발생)</td></tr>
          <tr><td>AI 모델 훈련 시 <strong>데이터 규정 준수와 개인정보 보호</strong> 보장</td><td>연합 학습 (Federated Learning)</td></tr>
        </tbody></table>
        <TipBox type="warning" title="함정 주의">
          <p>단순한 확률 계산이나 규칙 기반 문제는 반드시 AI/ML이 정답이 아닙니다. <strong>운영 오버헤드를 최소화</strong>해야 하는 경우, 간단한 코드로 해결하는 것이 더 적절할 수 있습니다.</p>
        </TipBox>
        <SectionStatusBar categoryId="ai-ml-basics" sectionId="ml-selection" />
      </section>

      <section id="aws-ai-services">
        <h2>AWS AI 서비스 &#11088; <span className="badge badge-exam">시험 빈출</span></h2>
        <p>AWS는 다양한 목적의 사전 구축된 AI 서비스를 제공합니다. 각 서비스의 핵심 기능과 사용 사례를 정확히 구분하는 것이 중요합니다.</p>

        <h3>번역</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>핵심 기능</th><th>사용 사례</th></tr></thead><tbody>
          <tr><td><strong>Amazon Translate</strong></td><td>신경망 기계 번역(NMT) 서비스. 사용자 지정 용어(브랜드명 등)를 일관되게 처리하는 기능 지원</td><td>웹사이트/콘텐츠 현지화(Localization), 실시간 고객 지원 채팅/이메일 번역</td></tr>
        </tbody></table>

        <h3>이미지 / 비디오</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>핵심 기능</th><th>사용 사례</th></tr></thead><tbody>
          <tr><td><strong>Amazon Rekognition &#11088;</strong></td><td>이미지 및 비디오 분석을 위한 <strong>컴퓨터 비전</strong> 서비스. 객체, 사람, 텍스트, 장면, 활동 감지</td><td>보안 카메라 영상 분석, SNS 부적절 콘텐츠 필터링, 상품 이미지 자동 분류</td></tr>
        </tbody></table>

        <h3>텍스트 / 문서</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>핵심 기능</th><th>사용 사례</th></tr></thead><tbody>
          <tr><td><strong>Amazon Textract &#11088;</strong></td><td>문서(PDF, 이미지)에서 텍스트, 양식, 표 등의 데이터를 자동 추출. OCR 기반 지능형 문서 처리(IDP, Intelligent Document Processing)</td><td>송장/영수증 자동 처리, 양식 데이터 추출</td></tr>
          <tr><td><strong>Amazon Comprehend &#11088;</strong></td><td><strong>자연어 처리(NLP)</strong> 텍스트 분석 서비스. 감정 분석, 독성(toxicity) 감지, 엔티티 인식, 키 구문 추출. <strong>텍스트 생성 기능은 없음</strong></td><td>댓글에서 유해한 언어 식별, 리뷰 감정 분석</td></tr>
        </tbody></table>

        <h3>음성</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>핵심 기능</th><th>사용 사례</th></tr></thead><tbody>
          <tr><td><strong>Amazon Transcribe</strong></td><td><strong>오디오 &#8594; 텍스트</strong> 변환(STT/ASR). 변환된 텍스트에서 주요 정보 추출 가능</td><td>강의 자막 생성, 회의록 자동 작성, 콜센터 통화 내용 분석</td></tr>
          <tr><td><strong>Amazon Polly</strong></td><td><strong>텍스트 &#8594; 음성</strong> 변환(TTS). 생생한 음성 생성</td><td>오디오북 제작, 교육 콘텐츠 음성 변환, 안내 방송 시스템</td></tr>
        </tbody></table>

        <h3>추천 / 검색 / 챗봇</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>핵심 기능</th><th>사용 사례</th></tr></thead><tbody>
          <tr><td><strong>Amazon Personalize</strong></td><td>개인화된 추천을 위한 ML 서비스. 사용자 행동 데이터 기반 맞춤형 추천</td><td>상품 추천, 콘텐츠 추천</td></tr>
          <tr><td><strong>Amazon Kendra</strong></td><td>지능형 엔터프라이즈 <strong>검색</strong> 서비스. 대량의 문서에서 자연어 질의로 정확한 답변 검색</td><td>기업 내부 문서 검색, 지식 관리</td></tr>
          <tr><td><strong>Amazon Lex</strong></td><td><strong>대화형 인터페이스</strong> 구축. 음성 및 텍스트 기반 챗봇 개발. Amazon A<strong>lex</strong>a의 기반 기술</td><td>고객 서비스 챗봇, 주문 접수 봇</td></tr>
        </tbody></table>

        <h3>헬스케어</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>핵심 기능</th><th>사용 사례</th></tr></thead><tbody>
          <tr><td><strong>AWS HealthScribe</strong></td><td>환자-의료진 간 대화를 음성 인식 및 생성형 AI를 활용해 자동으로 임상 문서 생성. 역할 식별, 의학 용어 추출, 메모 생성</td><td>진료 기록 자동화, 의료 상담 녹취 분석, 초안 진료 노트 생성</td></tr>
          <tr><td><strong>Amazon Comprehend Medical</strong></td><td>의료 문서(진료 기록, 처방전 등)에서 <strong>의학 용어, 진단명, 약물, 개인건강정보(PHI)</strong> 등을 추출/분석하는 NLP 서비스</td><td>의료 기록 분석, PHI 추출</td></tr>
        </tbody></table>

        <h3>인간 검토 / 그래프 분석</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>핵심 기능</th><th>사용 사례</th></tr></thead><tbody>
          <tr><td><strong>Amazon A2I (Augmented AI)</strong></td><td>ML 예측 결과에 사람의 검토(<strong>Human Review</strong>) 과정을 통합. 모델의 신뢰도(Confidence)가 낮을 때 사람이 직접 개입하여 정확성 확보</td><td>흐릿한 문서의 텍스트 추출 검증, 애매한 유해 콘텐츠 판별</td></tr>
          <tr><td><strong>Amazon Neptune</strong></td><td>관계와 연결 패턴을 분석하는 관리형 <strong>그래프 데이터베이스</strong>. 그래프 기반 ML 기능 내장으로 엔티티 간 복잡한 관계를 모델링</td><td>사기 행위 패턴 분석, 소셜 네트워크 분석, 지식 그래프 구축</td></tr>
        </tbody></table>

        <h3>ML / Gen AI 플랫폼</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>핵심 기능</th><th>사용 사례</th></tr></thead><tbody>
          <tr><td><strong>Amazon SageMaker</strong></td><td><strong>머신러닝의 모든 과정</strong>(데이터 준비, 학습, 배포, 모니터링)을 지원하는 통합 플랫폼</td><td>커스텀 ML 모델 개발 및 배포</td></tr>
          <tr><td><strong>Amazon Bedrock</strong></td><td><strong>다양한 기초 모델(FM), LLM</strong>을 API로 제공. 생성형 AI 애플리케이션 구축 및 확장</td><td>일관된 작문 스타일로 웹사이트용 설명 생성, 대화형 AI 구축</td></tr>
        </tbody></table>

        <ToggleSection title="Polly vs Transcribe 구분">
          <p><strong>Polly = 텍스트 &#8594; 음성(TTS)</strong>, <strong>Transcribe = 음성 &#8594; 텍스트(STT)</strong>. 방향이 반대입니다.</p>
        </ToggleSection>

        <ToggleSection title="Comprehend vs Comprehend Medical">
          <p><strong>Comprehend</strong>는 일반 텍스트의 NLP 분석(감정 분석, 엔티티 인식)이며, <strong>Comprehend Medical</strong>은 의료 문서에 특화되어 의학 용어, 진단명, 약물, PHI를 추출합니다. 텍스트 생성 기능은 두 서비스 모두 <strong>없습니다</strong>.</p>
        </ToggleSection>

        <ToggleSection title="Textract: OCR vs IDP">
          <p><strong>OCR</strong>은 이미지에서 텍스트만 추출하는 기본 기능이고, <strong>IDP(Intelligent Document Processing)</strong>는 OCR + 양식/표 인식 + 데이터 분류/포맷팅까지 자동화하는 지능형 문서 처리입니다. Textract는 IDP를 지원합니다.</p>
        </ToggleSection>

        <SectionStatusBar categoryId="ai-ml-basics" sectionId="aws-ai-services" />
      </section>

      <section id="quiz">
        <h2>도장깨기 퀴즈</h2>
        <Quiz categoryId="ai-ml-basics" categoryTitle="AI와 ML의 기초" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
