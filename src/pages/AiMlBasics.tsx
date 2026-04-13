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
  { id: 'ml-types', title: 'ML 유형' },
  { id: 'classification-regression', title: '분류 vs 회귀' },
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
        <p>인공지능(AI), 머신러닝(ML), 딥러닝(DL)은 포함 관계에 있습니다.</p>
        <table className="info-table"><thead><tr><th>구분</th><th>정의</th><th>특징</th><th>예시</th></tr></thead><tbody>
          <tr><td><strong>AI</strong></td><td>인간 지능을 모방하는 기술 총칭</td><td>가장 넓은 개념</td><td>체스 엔진, 전문가 시스템</td></tr>
          <tr><td><strong>ML</strong></td><td>데이터로부터 패턴을 학습하는 AI 하위 분야</td><td>명시적 프로그래밍 없이 학습</td><td>스팸 필터, 추천 시스템</td></tr>
          <tr><td><strong>DL</strong></td><td>인공 신경망을 활용하는 ML 하위 분야</td><td>대량 데이터와 GPU 필요</td><td>이미지 인식, 음성 인식</td></tr>
        </tbody></table>
        <TipBox type="important" title="시험 핵심"><p><strong>AI ⊃ ML ⊃ DL</strong> 관계를 기억하세요. 생성형 AI는 새로운 콘텐츠를 생성하는 DL 기반 기술입니다.</p></TipBox>
        <SectionStatusBar categoryId="ai-ml-basics" sectionId="ai-ml-dl" />
      </section>

      <section id="ml-types">
        <h2>ML 유형</h2>
        <table className="info-table"><thead><tr><th>유형</th><th>데이터</th><th>대표 알고리즘</th><th>사용 사례</th></tr></thead><tbody>
          <tr><td><strong>지도 학습</strong></td><td>레이블 있음</td><td>선형회귀, SVM, XGBoost</td><td>스팸 탐지, 가격 예측</td></tr>
          <tr><td><strong>비지도 학습</strong></td><td>레이블 없음</td><td>K-Means, PCA</td><td>고객 세분화, 이상 탐지</td></tr>
          <tr><td><strong>강화 학습</strong></td><td>환경 상호작용</td><td>Q-Learning, DQN</td><td>게임 AI, DeepRacer</td></tr>
        </tbody></table>
        <ToggleSection title="강화 학습 구성 요소">
          <ul><li><strong>에이전트:</strong> 학습하고 행동을 결정하는 주체</li><li><strong>환경:</strong> 상호작용하는 세계</li><li><strong>보상:</strong> 행동의 결과 피드백</li><li><strong>정책:</strong> 상태에서 행동을 결정하는 전략</li></ul>
        </ToggleSection>
        <SectionStatusBar categoryId="ai-ml-basics" sectionId="ml-types" />
      </section>

      <section id="classification-regression">
        <h2>분류 vs 회귀</h2>
        <table className="info-table"><thead><tr><th>구분</th><th>분류 (Classification)</th><th>회귀 (Regression)</th></tr></thead><tbody>
          <tr><td>출력</td><td>범주형 (스팸/정상)</td><td>연속 수치 (가격, 온도)</td></tr>
          <tr><td>평가 지표</td><td>정확도, 정밀도, 재현율, F1</td><td>MAE, MSE, RMSE, R²</td></tr>
          <tr><td>알고리즘</td><td>로지스틱 회귀, SVM, 랜덤포레스트</td><td>선형 회귀, 다항 회귀</td></tr>
        </tbody></table>
        <TipBox type="warning"><p>\"로지스틱 회귀\"는 이름에 회귀가 있지만 실제로는 <strong>분류</strong> 알고리즘입니다!</p></TipBox>
        <SectionStatusBar categoryId="ai-ml-basics" sectionId="classification-regression" />
      </section>

      <section id="aws-ai-services">
        <h2>AWS AI 서비스</h2>
        <table className="info-table"><thead><tr><th>서비스</th><th>핵심 기능</th></tr></thead><tbody>
          <tr><td><strong>Rekognition</strong></td><td>이미지/비디오 분석, 얼굴 인식, 객체 감지</td></tr>
          <tr><td><strong>Textract</strong></td><td>문서 텍스트/표/양식 추출 (OCR+)</td></tr>
          <tr><td><strong>Comprehend</strong></td><td>NLP - 감성 분석, 엔티티 인식, PII 탐지</td></tr>
          <tr><td><strong>Translate</strong></td><td>실시간 다국어 번역 (75개 이상 언어)</td></tr>
          <tr><td><strong>Polly</strong></td><td>텍스트→음성 (TTS)</td></tr>
          <tr><td><strong>Transcribe</strong></td><td>음성→텍스트 (STT/ASR)</td></tr>
          <tr><td><strong>Lex</strong></td><td>챗봇/음성봇 구축 (Alexa 기술)</td></tr>
          <tr><td><strong>Personalize</strong></td><td>실시간 개인화 추천</td></tr>
          <tr><td><strong>Forecast</strong></td><td>시계열 수요 예측</td></tr>
          <tr><td><strong>Kendra</strong></td><td>ML 기반 지능형 엔터프라이즈 검색</td></tr>
          <tr><td><strong>Bedrock</strong></td><td>FM(Foundation Model) API 서비스</td></tr>
          <tr><td><strong>Fraud Detector</strong></td><td>온라인 사기 탐지</td></tr>
        </tbody></table>
        <ToggleSection title="Polly vs Transcribe 구분">
          <p><strong>Polly = 텍스트→음성(TTS)</strong>, <strong>Transcribe = 음성→텍스트(STT)</strong>. 방향이 반대입니다.</p>
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
