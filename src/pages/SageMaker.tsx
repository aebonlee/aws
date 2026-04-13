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
  { id: 'lifecycle', title: 'ML 수명 주기' },
  { id: 'build', title: '데이터 엔지니어링 서비스' },
  { id: 'train', title: '모델 개발(훈련) 서비스' },
  { id: 'deploy', title: '배포 서비스' },
  { id: 'monitor', title: '모니터링 서비스' },
  { id: 'no-code', title: 'No-Code/Low-Code' },
  { id: 'scenarios', title: '상황별 서비스 선택 가이드' },
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
        <p><strong>인프라 관리 없이</strong> 머신러닝 수명주기의 전 과정을 지원하는 <strong>완전관리형</strong> 서비스입니다. 기계 학습의 시작과 끝(데이터 엔지니어링, 모델 구축, 훈련, 테스트, 튜닝, 배포)을 위한 <strong>통합 환경</strong>을 제공하며, 자동화된 모델 튜닝, 평가 등 ML 모델 개발을 위한 편의 기능을 지원합니다.</p>
        <TipBox type="important"><p>SageMaker는 AIF-C01 시험에서 다양한 하위 서비스와 함께 출제됩니다. 각 서비스의 역할을 정확히 구분하세요. 특히 <strong>Clarify, Model Monitor, Model Cards, Canvas, JumpStart, 추론 유형</strong>이 자주 출제됩니다.</p></TipBox>
        <SectionStatusBar categoryId="sagemaker" sectionId="overview" />
      </section>

      <section id="lifecycle">
        <h2>ML 수명 주기</h2>
        <p>비즈니스 목표부터 모델 모니터링까지의 <strong>순환적 프로세스</strong>입니다.</p>
        <table className="info-table"><thead><tr><th>단계</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>비즈니스 목표 식별</strong></td><td>비즈니스 목표와 성공 기준에 따라 비즈니스 가치를 측정. 이해관계자 인터뷰를 수행하여 사용 사례를 구체화하고 측정 가능한 목표를 설정. 규정 준수 및 규제 요구 사항을 결정</td></tr>
          <tr><td><strong>ML 문제 정의</strong></td><td>비즈니스 문제를 머신러닝 문제로 정의</td></tr>
          <tr><td><strong>데이터 엔지니어링</strong></td><td>데이터 수집 및 준비, 데이터 전처리(정제, 필터링, 변환, 정규화 - 예: AWS Glue), 탐색적 데이터 분석(상관관계 행렬, 통계 분석, 데이터 시각화), 특성(feature) 엔지니어링</td></tr>
          <tr><td><strong>모델 개발(훈련)</strong></td><td>모델 구축, 훈련, 튜닝 및 평가. CI/CD 파이프라인 활용. <strong>IaC(Infrastructure as Code)</strong>로 확장 가능하고 일관된 ML 워크로드 배포 간소화</td></tr>
          <tr><td><strong>배포</strong></td><td>모델이 대상을 예측(추론). 예: 물체 감지 모델 배포 후 새 이미지를 분석하여 물체 식별</td></tr>
          <tr><td><strong>모니터링</strong></td><td>조기 감지와 완화를 통해 모델 성능 유지 확인. 예: 데이터 드리프트 발견 시 새로운 데이터로 모델 재학습. <em>*데이터 드리프트: 입력 데이터 분포가 학습 데이터와 달라진 상태</em></td></tr>
        </tbody></table>
        <SectionStatusBar categoryId="sagemaker" sectionId="lifecycle" />
      </section>

      <section id="build">
        <h2>데이터 엔지니어링 서비스</h2>
        <table className="info-table"><thead><tr><th>서비스</th><th>역할</th><th>핵심 기능</th></tr></thead><tbody>
          <tr><td><strong>Ground Truth</strong> <span className="badge badge-exam">시험 빈출</span></td><td>데이터 라벨링</td><td>고품질 훈련 데이터셋 생성, 자동 데이터 라벨링, HITL(human-in-the-loop) 검증 지원</td></tr>
          <tr><td><strong>Data Wrangler</strong></td><td>데이터 전처리</td><td>로우 코드(Low-code) 데이터 전처리 도구, 데이터 시각화 및 품질 분석, 300개 이상의 사전 정의된 변환 제공</td></tr>
          <tr><td><strong>Feature Store</strong></td><td>피처 저장소</td><td>중앙 집중식 피처 저장소, 팀 간 피처 공유 및 재사용, 온라인/오프라인 저장소 제공, 피처 버전 관리</td></tr>
          <tr><td><strong>Clarify</strong> <span className="badge badge-exam">시험 빈출</span></td><td>편향/설명 가능성</td><td>사전/사후 학습 편향 감지, 모델 예측에 대한 특성 기여도 설명, FM 성능 평가 라이브러리(FMEval) 포함</td></tr>
        </tbody></table>

        <ToggleSection title="⭐ Ground Truth 상세 - 시험 빈출">
          <ul>
            <li><strong>인력 유형 3가지:</strong>
              <ul>
                <li>전 세계 50만 명 이상의 독립 계약자로 구성된 <strong>Amazon Mechanical Turk</strong> 인력</li>
                <li>조직 내 데이터 처리를 위한 직원이나 계약자로 구성한 <strong>프라이빗 인력</strong></li>
                <li>AWS Marketplace에서 찾을 수 있는 <strong>데이터 라벨링 전문 벤더 회사</strong></li>
              </ul>
            </li>
            <li><strong>자동 라벨링:</strong> 학습이 진행될수록 자동 라벨링 비율 증가 → 비용 절감</li>
            <li><strong>웹 기반 UI와 자동 레이블링 워크플로우</strong> 제공</li>
            <li><strong>Human-in-the-loop:</strong> 데이터 생성 및 주석부터 모델 검토, 커스터마이제이션, 평가까지 제공 → 여러 작업자의 검증을 거치고 품질 관리가 가능해서 <strong>잘못된 레이블링의 위험 최소화</strong> (편향, 독성 감소)</li>
            <li><strong>지원 유형:</strong> 이미지 분류, 객체 감지, 텍스트 분류, 시맨틱 세그멘테이션 등</li>
          </ul>
          <TipBox type="important"><p>시험 포인트: "정확도가 높아야 하며 주석이 잘못될 위험을 최소화" → <strong>Ground Truth의 Human-in-the-loop 검증</strong></p></TipBox>
        </ToggleSection>

        <ToggleSection title="Data Wrangler 상세">
          <ul>
            <li>머신러닝을 위한 데이터를 가장 빠르고 쉽게 <strong>준비(전처리)</strong>할 수 있도록 돕는 서비스</li>
            <li><strong>코드를 작성할 필요 없이</strong> 시각적 인터페이스를 통해 데이터 선택, 정제, 탐색 및 시각화 수행</li>
            <li><strong>300개 이상의 기본 제공 변환(Built-in transformations)</strong> 기능 제공 (예: 결측치 제거, 원-핫 인코딩, 포맷 변경 등)</li>
            <li>전처리 워크플로 자동화 및 통합</li>
          </ul>
        </ToggleSection>

        <ToggleSection title="Feature Store 상세">
          <ul>
            <li>특성(feature) 생성, 저장, 공유 및 관리 서비스</li>
            <li><strong>특성:</strong> 머신러닝 모델의 입력으로 사용되는 데이터의 속성이나 변수 (예: 고객 데이터에서 나이, 성별, 구매 이력 등)</li>
            <li><strong>중앙 집중식 피처 저장소:</strong> 팀 간 피처 공유 및 재사용</li>
            <li><strong>온라인/오프라인 저장소</strong> 제공</li>
            <li>피처 버전 관리</li>
          </ul>
          <TipBox type="info"><p>시험 포인트: "여러 팀 간에 모델 개발을 위한 변수를 공유하고 관리" → <strong>Feature Store</strong></p></TipBox>
        </ToggleSection>

        <ToggleSection title="⭐ Clarify 상세 - 시험 빈출">
          <ul>
            <li><strong>모델 편향성과 설명 가능성</strong>의 핵심 분석 엔진</li>
            <li><strong>사전/사후 학습 편향 감지</strong> 및 분석</li>
            <li>모델 예측에 대한 <strong>특성 기여도 설명</strong> - 다양한 입력 특성이 모델의 예측에 어떻게 기여하는지 이해 (SHAP 값 활용)</li>
            <li><strong>FM 성능 평가 라이브러리(FMEval)</strong> 포함: 정확성, 견고성, 유해성 등의 지표로 FM을 자동 평가</li>
            <li><strong>SageMaker Model Monitor의 bias/explainability 모니터링 기능에 통합</strong>됨</li>
          </ul>
          <TipBox type="important"><p>시험 포인트: "편향을 탐지" + "예측을 설명" → <strong>Clarify</strong> / "투명하고 설명 가능한 모델 필요, 규제 요구 사항 충족" → <strong>Clarify</strong></p></TipBox>
        </ToggleSection>

        <SectionStatusBar categoryId="sagemaker" sectionId="build" />
      </section>

      <section id="train">
        <h2>모델 개발(훈련) 서비스</h2>
        <table className="info-table"><thead><tr><th>서비스</th><th>역할</th><th>핵심 기능</th></tr></thead><tbody>
          <tr><td><strong>Notebook</strong></td><td>대화형 개발 환경</td><td>주피터 노트북 기반, 코드 작성/실행/디버깅 통합, TensorFlow/PyTorch 등 주요 ML 프레임워크 사전 설치</td></tr>
          <tr><td><strong>JumpStart</strong> <span className="badge badge-exam">시험 빈출</span></td><td>사전 학습 모델 허브</td><td>수백 개의 오픈소스 사전 학습 모델 제공, VPC 내 FM 빠른 배포, 원클릭 fine-tuning, 조직 거버넌스 및 접근 제어</td></tr>
          <tr><td><strong>Canvas</strong> <span className="badge badge-exam">시험 빈출</span></td><td>노코드 ML 도구</td><td>코드 작성 없이 시각적 인터페이스로 모델 학습/예측/배포, FM 포함 바로 사용가능한 모델 제공</td></tr>
          <tr><td><strong>Unified Studio</strong></td><td>통합 개발 환경</td><td>데이터와 AI 개발을 위한 단일 통합 환경, 다기능 팀 협업 지원</td></tr>
          <tr><td><strong>내장 알고리즘</strong></td><td>ML 알고리즘</td><td>XGBoost, 선형 학습기, K-Means, Image Classification 등 17개+ 내장</td></tr>
          <tr><td><strong>Automatic Model Tuning</strong></td><td>하이퍼파라미터 최적화</td><td>하이퍼파라미터 자동 최적화 (베이지안 최적화)</td></tr>
          <tr><td><strong>Experiments</strong></td><td>실험 추적</td><td>학습 실험 추적 및 비교</td></tr>
          <tr><td><strong>Debugger</strong></td><td>디버깅</td><td>학습 중 문제(과적합, 기울기 소실 등) 실시간 감지</td></tr>
          <tr><td><strong>분산 학습</strong></td><td>대규모 학습</td><td>데이터 병렬/모델 병렬 학습 지원</td></tr>
        </tbody></table>

        <ToggleSection title="⭐ JumpStart 상세 - 시험 빈출">
          <ul>
            <li><strong>수백 개의 오픈소스 사전 학습 모델</strong>을 제공하는 허브</li>
            <li>오픈소스 LLM을 <strong>원클릭으로 fine-tuning</strong>할 수 있는 프리빌트 솔루션(파인튜닝용 알고리즘) 제공</li>
            <li>VPC 내에 기초 모델(FM)을 <strong>빠르게 배포하고 사용</strong></li>
            <li><strong>조직 정책 및 규정 준수 지원:</strong> 관리자가 승인한 모델만 사용자에게 제공 가능</li>
            <li><strong>자동 모델 평가:</strong> 독성 점수를 자동으로 계산하여 여러 LLM 비교 가능</li>
          </ul>
          <TipBox type="important"><p>시험 포인트: "VPC 내에서 FM을 빠르게 배포" → <strong>JumpStart</strong> / "오픈소스 LLM 미세 조정, 최소 운영 노력" → <strong>JumpStart</strong> / "직원 FM 액세스 제어" → <strong>JumpStart 구성</strong></p></TipBox>
        </ToggleSection>

        <ToggleSection title="⭐ Canvas 상세 - 시험 빈출">
          <ul>
            <li><strong>코드 작성 없이(노코드 도구)</strong> 시각적 인터페이스를 통해 데이터 업로드, 모델 학습, 예측 생성, 배포</li>
            <li>FM(기초모델)을 포함하여 바로 사용가능한 모델을 제공</li>
            <li>Amazon Textract, Rekognition, Comprehend 등 <strong>AWS 서비스와 통합</strong> 가능</li>
            <li>자동화된 관리 기능: 자동 평가 수행, S3와 직접 연결하여 업데이트된 데이터로 모델 학습하는 자동화된 워크플로우 구성 가능</li>
          </ul>
          <TipBox type="important"><p>시험 포인트: "코딩 경험이나 ML 알고리즘에 대한 지식이 없어도" / "코드를 작성하지 않고 ML 모델 구축" → <strong>Canvas</strong></p></TipBox>
        </ToggleSection>

        <ToggleSection title="Unified Studio 상세">
          <ul>
            <li>데이터와 AI 개발을 위한 <strong>단일 통합 환경</strong></li>
            <li>여러 팀의 개발자가 하나의 환경에서 접근하고 협업 가능</li>
            <li>ML 모델과 생성형 AI 애플리케이션을 안전하게 구축하고 공유</li>
            <li><strong>다기능 팀(cross-functional team) 협업 지원:</strong> 데이터 엔지니어, ML 엔지니어, 앱 개발자가 하나의 플랫폼에서 작업</li>
          </ul>
        </ToggleSection>

        <SectionStatusBar categoryId="sagemaker" sectionId="train" />
      </section>

      <section id="deploy">
        <h2>배포 서비스</h2>

        <h3>⭐ SageMaker Inference (추론 옵션) - 시험 빈출</h3>
        <p>ML 모델을 실제 프로덕션 환경에 배포하고 예측을 수행하는 서비스입니다. 멀티 모델 배포와 고성능 추론 최적화를 지원합니다.</p>
        <table className="info-table"><thead><tr><th>배포 옵션</th><th>특징</th><th>사용 사례</th><th>제한</th></tr></thead><tbody>
          <tr><td><strong>실시간 추론</strong></td><td>온라인, 가장 낮은 지연시간, 즉시 응답</td><td>챗봇, 실시간 API</td><td>25MB / 60초</td></tr>
          <tr><td><strong>배치 변환</strong></td><td>오프라인, 대규모 일괄 처리</td><td>월별 리포트, 대용량 아카이브 데이터</td><td>응답을 바로 받을 필요 없을 경우</td></tr>
          <tr><td><strong>서버리스 추론</strong></td><td>인프라 관리 X, 자동 확장</td><td><strong>예측할 수 없는</strong> 트래픽 패턴</td><td>4MB / 60초</td></tr>
          <tr><td><strong>비동기 추론</strong></td><td>준 실시간(near-real time)</td><td>대용량 입력, 긴 처리 시간</td><td><strong>최대 1GB / 1시간 처리</strong></td></tr>
        </tbody></table>
        <TipBox type="important"><p>시험 포인트: "최대 1GB 대용량 + 1시간 처리 + 준실시간" → <strong>비동기 추론</strong> / "대규모 데이터 + 즉시 접근 불필요 + 비용 효율" → <strong>배치 변환</strong> / "인프라 관리 없이 + 간헐적 트래픽" → <strong>서버리스 추론</strong> / "최소 지연시간 + 즉시 응답" → <strong>실시간 추론</strong></p></TipBox>

        <h3>SageMaker Endpoint</h3>
        <ul>
          <li>추론을 위한 ML 모델 배포 및 확장 서비스 (SageMaker Inference에 포함)</li>
          <li><strong>REST API 엔드포인트</strong>로 모델 서빙</li>
          <li><strong>자동 확장 및 고가용성</strong> 보장</li>
          <li><strong>완전관리형 서비스:</strong> 서버나 인프라를 관리 없이 모델 배포</li>
          <li>서버리스 추론 지원: 트래픽에 따른 자동 확장/축소</li>
        </ul>

        <h3>⭐ Model Registry - 시험 빈출</h3>
        <table className="info-table"><thead><tr><th>기능</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>중앙 저장소 및 버전 관리</strong></td><td>모델 아티팩트, 메타데이터, 학습 지표를 체계적으로 저장. Git과 유사한 버전 관리로 모델 이력 추적</td></tr>
          <tr><td><strong>승인 워크플로우</strong></td><td>개발 → 스테이징 → 프로덕션 단계별 승인 프로세스. CI/CD 파이프라인과 통합하여 자동 배포 지원</td></tr>
          <tr><td><strong>모델 계보(Lineage) 추적</strong></td><td>학습 데이터, 하이퍼파라미터, 코드 버전 등 전체 모델 생성 과정 기록</td></tr>
        </tbody></table>

        <h3>⭐ Model Cards - 시험 빈출</h3>
        <ul>
          <li>ML 모델의 주요 세부 사항(critical details)을 문서화하기 위한 <strong>표준화</strong>된 형식</li>
          <li><strong>모델 투명성과 감사(audit), 규정 준수, 거버넌스</strong>에 도움</li>
          <li><strong>포함 내용:</strong> 모델 버전, 의도하는 사용 목적, 의사 결정 프로세스, 위험 등급, 훈련 세부 정보(편향, 품질 포함), 평가 지표, 모델 성능, 모델이 실행되는 컴퓨팅 환경 정보(ML 인스턴스 데이터)</li>
          <li>모델의 목적, 성능, 제한 사항, 모델 버전 추적, 모델 개발 기록 등에 대한 정보를 표준화</li>
        </ul>
        <ToggleSection title="Model Cards vs AWS AI Service Cards 비교">
          <table className="info-table"><thead><tr><th>항목</th><th>SageMaker Model Cards</th><th>AWS AI Service Cards</th></tr></thead><tbody>
            <tr><td><strong>대상</strong></td><td>사용자가 직접 구축한 <strong>커스텀 ML 모델</strong></td><td><strong>AWS AI 서비스</strong>에 대한 문서</td></tr>
            <tr><td><strong>내용</strong></td><td>모델 버전, 성능, 편향, 훈련 세부 정보, 의사 결정 프로세스</td><td>AWS AI 서비스의 일반적인 설명</td></tr>
            <tr><td><strong>한계</strong></td><td>-</td><td>오픈 소스나 서드파티 모델의 <strong>훈련이나 성능에 대한 정보는 제공하지 않음</strong></td></tr>
          </tbody></table>
        </ToggleSection>
        <TipBox type="important"><p>시험 포인트: "거버넌스 및 보고를 위한 ML 인스턴스 데이터 기록" / "모델 목적, 성능, 제한 사항 표준화" / "투명성과 감사 목적 문서화" → <strong>Model Cards</strong></p></TipBox>

        <SectionStatusBar categoryId="sagemaker" sectionId="deploy" />
      </section>

      <section id="monitor">
        <h2>⭐ 모니터링 서비스 - 시험 빈출</h2>

        <h3>SageMaker Model Monitor</h3>
        <p><strong>프로덕션 환경</strong>에서 <strong>모델의 품질 변화를 감지</strong>하여 자동으로 알람(CloudWatch)을 보내는 시스템입니다.</p>
        <table className="info-table"><thead><tr><th>모니터링 유형</th><th>설명</th><th>참고</th></tr></thead><tbody>
          <tr><td><strong>Data Quality Drift</strong></td><td>입력 데이터의 통계적 분포 변화 감지</td><td>-</td></tr>
          <tr><td><strong>Model Quality Drift</strong></td><td>예측 정확도(성능 메트릭) 추적</td><td>-</td></tr>
          <tr><td><strong>Bias Drift</strong></td><td>시간에 따른 편향성 변화 감지</td><td><strong>Clarify 기능 활용</strong></td></tr>
          <tr><td><strong>Feature Attribution Drift</strong></td><td>특성 기여도(피처 중요도) 변화 추적</td><td><strong>Clarify 기능 활용</strong></td></tr>
        </tbody></table>
        <TipBox type="important"><p>시험 포인트: "프로덕션 모델 품질 변화 감지" / "모델 드리프트 모니터링 + 알림" / "시간이 지남에 따라 모델 품질 관찰" → <strong>Model Monitor</strong>. 편향 드리프트와 피처 기여도 드리프트는 <strong>Clarify 기능이 Model Monitor에 통합</strong>된 것입니다.</p></TipBox>

        <SectionStatusBar categoryId="sagemaker" sectionId="monitor" />
      </section>

      <section id="no-code">
        <h2>No-Code/Low-Code</h2>
        <table className="info-table"><thead><tr><th>서비스</th><th>대상</th><th>특징</th></tr></thead><tbody>
          <tr><td><strong>Canvas</strong> <span className="badge badge-exam">시험 빈출</span></td><td>비즈니스 분석가</td><td>코드 없이 포인트앤클릭으로 ML 모델 구축, FM 포함 바로 사용 가능한 모델 제공, AWS 서비스 통합(Textract, Rekognition, Comprehend)</td></tr>
          <tr><td><strong>Data Wrangler</strong></td><td>데이터 분석가</td><td>로우 코드(Low-code) 데이터 전처리, 300개 이상 사전 정의 변환, 시각적 인터페이스</td></tr>
          <tr><td><strong>Autopilot</strong></td><td>데이터 과학자</td><td>AutoML - 자동 모델 선택, 학습, 튜닝</td></tr>
          <tr><td><strong>Studio</strong></td><td>ML 엔지니어</td><td>통합 IDE - 전체 ML 워크플로우</td></tr>
          <tr><td><strong>Unified Studio</strong></td><td>다기능 팀</td><td>데이터/AI 통합 개발 환경, 팀 간 협업 및 공유, 보안이 적용된 모델/앱 관리</td></tr>
        </tbody></table>
        <SectionStatusBar categoryId="sagemaker" sectionId="no-code" />
      </section>

      <section id="scenarios">
        <h2>상황별 서비스 선택 가이드</h2>
        <p>시험에서 자주 출제되는 상황별 올바른 SageMaker 서비스 선택입니다.</p>
        <table className="info-table"><thead><tr><th>상황</th><th>서비스</th></tr></thead><tbody>
          <tr><td>정확도가 높아야 하며 주석이 잘못될 위험을 최소화</td><td><strong>Ground Truth</strong>의 Human-in-the-loop 검증</td></tr>
          <tr><td>여러 팀 간에 모델 개발을 위한 변수를 공유하고 관리</td><td><strong>Feature Store</strong></td></tr>
          <tr><td>규제 요구 사항 충족, 투명하고 설명 가능한 모델 필요</td><td><strong>Clarify</strong>를 사용해 지표, 보고서 및 예제 생성</td></tr>
          <tr><td>모델의 편향을 탐지 + 모델의 예측을 설명</td><td><strong>Clarify</strong></td></tr>
          <tr><td>VPC 내에서 FM을 빠르게 배포하고 사용</td><td><strong>JumpStart</strong></td></tr>
          <tr><td>코딩 경험/ML 지식 없이 예측 모델 개발</td><td><strong>Canvas</strong></td></tr>
          <tr><td>코드 없이 시각적 인터페이스로 데이터 준비</td><td><strong>Data Wrangler</strong> 또는 <strong>Canvas</strong></td></tr>
          <tr><td>프로덕션 모델의 품질 변화 감지 및 드리프트 모니터링</td><td><strong>Model Monitor</strong></td></tr>
          <tr><td>모델의 의사 결정 프로세스 투명성 및 문서화</td><td><strong>Model Cards</strong></td></tr>
          <tr><td>거버넌스 및 보고를 위한 ML 인스턴스 데이터 기록</td><td><strong>Model Cards</strong></td></tr>
          <tr><td>모델 버전 추적과 개발 기록 표준화 문서</td><td><strong>Model Cards</strong></td></tr>
          <tr><td>모델 저장, 관리, 버전 관리</td><td><strong>Model Registry</strong></td></tr>
          <tr><td>LLM 출력 독성 비교 평가 (최소 운영 오버헤드)</td><td><strong>JumpStart</strong>의 자동 모델 평가</td></tr>
          <tr><td>오픈소스 LLM 미세 조정 (최소 운영 노력)</td><td><strong>JumpStart</strong></td></tr>
          <tr><td>직원의 FM 액세스 제어</td><td><strong>JumpStart</strong> 구성으로 검색 가능한 FM 제한</td></tr>
          <tr><td>인프라 관리 없이 모델 호스팅 및 예측</td><td><strong>SageMaker 엔드포인트</strong> 또는 <strong>서버리스 추론</strong></td></tr>
          <tr><td>데이터와 AI 개발을 위한 단일 통합 환경, 다기능 팀 협업</td><td><strong>Unified Studio</strong></td></tr>
          <tr><td>레이블링 앱 개발/인력 관리 없이 데이터 레이블링</td><td><strong>Ground Truth Plus</strong> (완전관리형)</td></tr>
          <tr><td>대용량 1GB + 1시간 처리 + 준실시간</td><td><strong>비동기 추론</strong></td></tr>
          <tr><td>대규모 데이터 일괄 처리 + 즉시 접근 불필요</td><td><strong>배치 변환</strong></td></tr>
          <tr><td>간헐적/예측 불가 트래픽 + 인프라 관리 X</td><td><strong>서버리스 추론</strong></td></tr>
          <tr><td>최소 지연시간 + 즉시 응답 필요</td><td><strong>실시간 추론</strong></td></tr>
        </tbody></table>
        <SectionStatusBar categoryId="sagemaker" sectionId="scenarios" />
      </section>

      <section id="quiz">
        <h2>도장깨기 퀴즈</h2>
        <Quiz categoryId="sagemaker" categoryTitle="Amazon SageMaker" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
