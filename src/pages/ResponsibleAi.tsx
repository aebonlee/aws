import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz from '../components/Quiz'
import SectionStatusBar from '../components/SectionStatusBar'
import { getQuestionsByCategory } from '../data/quizData'

const sections = [
  { id: 'principles', title: '책임감 있는 AI 원칙' },
  { id: 'transparency-explainability', title: '투명성 vs 설명 가능성 vs 해석 가능성' },
  { id: 'shap-pdp', title: 'SHAP과 PDP' },
  { id: 'bias', title: '편향 유형과 완화' },
  { id: 'privacy', title: '개인정보 보호와 학습 데이터 정제' },
  { id: 'explainability', title: '모델 해석 방법' },
  { id: 'governance', title: 'AI 거버넌스 프레임워크' },
  { id: 'aws-responsible', title: 'AWS 책임감 있는 AI 서비스' },
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
        <TipBox type="info"><p>"큰 힘에는 큰 책임이 따른다(<strong>With great power comes great responsibility</strong>)." AI가 특정 성별이나 인종에 대해 편향된 판단을 내리거나, 불투명한 결정을 하는 경우가 있습니다. 그래서 등장한 것이 <strong>Responsible AI</strong> — 공정하고, 투명하고, 안전한 AI를 만들기 위한 원칙입니다.</p></TipBox>
        <table className="info-table"><thead><tr><th>원칙</th><th>설명</th><th>관련 개념/방법</th></tr></thead><tbody>
          <tr><td><strong>공정성 (Fairness)</strong> <span className="badge badge-exam">시험 빈출</span></td><td>편향(bias)되지 않은 ML 모델을 개발하는 것. 시스템이 모든 사용자와 그룹을 차별 없이 동등하게 대우하는 것. 특정 집단이나 개인에 대한 편향성 없이 일관된 결과를 제공하는 능력</td><td>공정성 지표(fairness metrics), 데이터셋을 다양한 데이터로 구성(학습 데이터 편향 제거), 데이터 클래스 불균형을 측정하고 적절하게 훈련 과정 조정, Human-in-the-loop (독성, 편향 감소)</td></tr>
          <tr><td><strong>투명성 (Transparency)</strong> <span className="badge badge-exam">시험 빈출</span></td><td>유리창처럼 속이 들여다보듯 AI가 <strong>무엇</strong>을 하는지 누구나 볼 수 있게 공개하는 것. 이해관계자들과 관리자들이 AI 솔루션에 대해 정보에 기반한 결정을 내릴 수 있게 도와주는 것</td><td>부분 의존도 차트(PDPs), Shapley 값(SHAP)</td></tr>
          <tr><td><strong>설명 가능성 (Explainability)</strong> <span className="badge badge-exam">시험 빈출</span></td><td>AI가 <strong>왜</strong> 그 결정을 내렸는지 사람이 이해할 수 있게 설명하는 능력. 모델의 내부 동작 과정에 대한 설명 또는 근거를 (인간의 용어로) 제공할 수 있는 능력. 모델 복잡성(Model complexity)이 높을수록 그만큼 설명 가능성도 낮아짐</td><td>부분 의존도 차트(PDPs), Shapley 값(SHAP)</td></tr>
          <tr><td><strong>해석 가능성 (Interpretability)</strong></td><td>AI 모델 <strong>내부의 작동 방식</strong>과 예측 과정을 직접 이해하는 것. 구체적인 계산 과정과 작동 원리에 초점(<strong>어떻게</strong> 작동하는지)</td><td>모델 트레이닝 코드</td></tr>
          <tr><td><strong>개인정보 보호와 보안 (Privacy and Security)</strong> <span className="badge badge-exam">시험 빈출</span></td><td>개인정보와 민감한 데이터를 안전하게 보호하고 관리하는 것. 무단 접근과 데이터 유출을 방지하기 위한 체계적인 보안 조치 구현. <strong>Privacy by Design: 사후 필터링(Guardrails, Masking)보다 사전 예방 우선</strong></td><td>데이터 암호화 및 접근 제어, PII 제거/마스킹 (학습 전 단계), 기밀 데이터가 포함된 모델의 완전 재훈련, Bedrock Guardrails (추론 시점 필터링 - 보조적 수단)</td></tr>
          <tr><td><strong>견고성 (Robustness)</strong></td><td>예상치 못한 상황이나 입력에도 안정적으로 작동하는 능력. 다양한 환경과 조건에서도 일관된 성능을 유지하는 특성. 오류와 예외 상황에 대한 적절한 대응 메커니즘 보유</td><td>스트레스 테스트, 예외 처리 메커니즘, 성능 안정성 평가</td></tr>
          <tr><td><strong>관리체계 (Governance)</strong></td><td>AI 시스템의 개발, 배포, 운영에 관한 체계적인 <strong>정책과 절차</strong>. 위험 관리와 품질 보증을 위한 종합적인 프레임워크. 책임과 권한의 명확한 정의 및 할당</td><td>정책 및 절차 수립, 리스크 관리 체계, 품질 관리 프로세스</td></tr>
          <tr><td><strong>안전성 (Safety)</strong> <span className="badge badge-exam">시험 빈출</span></td><td>AI 시스템이 인간과 환경에 해를 끼치지 않도록 보장하는 것. 잠재적 위험을 사전에 식별하고 예방하는 능력. 안전 관련 규제와 표준을 준수하는 운영 체계</td><td>안전성 평가 및 인증, 위험 분석 및 대응, 중재(Moderation) API: 유해 콘텐츠를 사전에 식별하여 예방</td></tr>
          <tr><td><strong>통제 가능성 (Controllability)</strong></td><td>AI 시스템의 동작을 인간이 원하는 방향으로 제어할 수 있는 능력. 필요시 시스템을 중지하거나 수정할 수 있는 메커니즘 보유. 시스템의 행동 범위를 명확히 정의하고 제한하는 기능</td><td>수동 개입 메커니즘, 행동 제약 설정, 긴급 중지 시스템</td></tr>
        </tbody></table>
        <TipBox type="important"><p>시험에서는 각 원칙의 정의와 해당 원칙이 적용되는 시나리오를 구분하는 문제가 자주 출제됩니다. 특히 <strong>공정성, 투명성, 설명 가능성, 개인정보 보호, 안전성</strong>은 시나리오 기반 문제에서 매우 빈출됩니다.</p></TipBox>
        <SectionStatusBar categoryId="responsible-ai" sectionId="principles" />
      </section>

      <section id="transparency-explainability">
        <h2>투명성 vs 설명 가능성 vs 해석 가능성 <span className="badge badge-exam">시험 빈출</span></h2>
        <TipBox type="info"><p>주식 투자 AI를 예로 들어 세 개념의 차이를 이해해 보세요.</p></TipBox>
        <table className="info-table"><thead><tr><th>개념</th><th>핵심 질문</th><th>예시 (주식 투자 AI)</th></tr></thead><tbody>
          <tr><td><strong>투명성 (Transparency)</strong></td><td><strong>무엇을 (WHAT)</strong></td><td>"이 AI는 주식 데이터를 분석해서 투자 추천을 해줍니다." AI가 무엇을 하는지 전체적으로 공개하는 것. 마치 식당 메뉴판처럼 하는 일을 명확히 보여주는 것</td></tr>
          <tr><td><strong>설명 가능성 (Explainability)</strong></td><td><strong>왜 (WHY)</strong></td><td>"삼성전자를 추천한 이유는 최근 실적이 좋고 신제품 출시가 예정되어 있기 때문입니다." AI의 결정 이유를 사람이 이해할 수 있게 설명하는 것. 결과의 '이유'에 초점</td></tr>
          <tr><td><strong>해석 가능성 (Interpretability)</strong></td><td><strong>어떻게 (HOW)</strong></td><td>"AI는 1,000개의 주식 데이터를 분석하고, 각 항목별로 가중치를 부여한 뒤..." AI의 내부 작동 방식을 자세히 들여다보는 것. 구체적인 계산 과정과 작동 원리에 초점</td></tr>
        </tbody></table>

        <ToggleSection title="성능 vs 해석 가능성 트레이드오프">
          <p>신경망과 같은 복잡한 모델은 높은 예측 정확도(성능)를 달성하지만, 의사결정 트리보다 설명 가능성이 낮습니다. 이것이 전형적인 <strong>성능-해석 가능성 트레이드오프</strong>입니다.</p>
          <ul>
            <li><strong>모델 복잡성이 높을수록</strong> 설명 가능성이 낮아짐</li>
            <li><strong>의사결정 트리:</strong> 해석 가능성 높음, 성능 상대적으로 낮음</li>
            <li><strong>신경망/딥러닝:</strong> 성능 높음, 해석 가능성 낮음</li>
          </ul>
        </ToggleSection>

        <ToggleSection title="모델 투명성을 높이면 나타나는 결과">
          <ul>
            <li><strong>편향 식별 능력 향상</strong> 및 <strong>모델 거버넌스 개선</strong></li>
            <li>투명성은 검증의 필요성을 줄이지 않으며, 오히려 검증을 지원</li>
            <li>투명성은 규제 준수 요구 사항을 제거하지 않음</li>
            <li>투명성은 편향을 감지하는 데 도움이 되지만 자동으로 제거하지는 않음 (추가적인 의도적 조치 필요)</li>
          </ul>
        </ToggleSection>
        <SectionStatusBar categoryId="responsible-ai" sectionId="transparency-explainability" />
      </section>

      <section id="shap-pdp">
        <h2>SHAP과 PDP <span className="badge badge-exam">시험 빈출</span></h2>
        <table className="info-table"><thead><tr><th>방법</th><th>설명</th><th>예시</th></tr></thead><tbody>
          <tr><td><strong>부분 의존도 (PDPs, Partial Dependence Plots)</strong></td><td>입력(특성)과 출력(예측)의 관계를 이해하는 데 유용한 방법으로, 하나 혹은 두 개의 변수가 예측 결과에 미치는 영향을 보여주는 그래프. PDPs는 모델의 <strong>내부 작동을 깊이 이해하지 않고도</strong> 예측에 대한 개별 기능의 영향을 시각적으로 보여주기 때문에 이해관계자에게 특히 유용</td><td>소득이 오르면 대출 승인율이 전반적으로 올라가는가 (전체적인 경향성)</td></tr>
          <tr><td><strong>Shapley 값 (SHAP, Shapley Additive exPlanations)</strong></td><td>게임 이론에 기반하여 <strong>각 특성(Feature)이 개별 예측 결과에 얼마나 기여했는지를 수치로 계산하여 설명</strong>하는 방법. SHAP은 모델이 예측한 최종 값을 각 변수의 영향력(양수 또는 음수의 기여도)으로 분해하여 보여주기 때문에, 복잡한 모델이라도 '왜(Why) 이 건에 대해 그런 결과가 나왔는지'를 구체적이고 일관성 있게 설명할 수 있어 투명성 확보에 필수적</td><td>철수의 대출이 거절된 결정적인 이유는 소득 때문인가, 연체 이력 때문인가? (개별 건에 대한 구체적 이유)</td></tr>
        </tbody></table>
        <TipBox type="important"><p>시험에서 이해관계자에게 모델의 투명성과 설명 가능성을 제공하기 위한 방법으로 <strong>PDP</strong>와 <strong>SHAP</strong>이 자주 출제됩니다. PDP는 전체적인 경향성(글로벌), SHAP은 개별 건의 구체적 이유(로컬/글로벌) 설명에 활용됩니다.</p></TipBox>
        <SectionStatusBar categoryId="responsible-ai" sectionId="shap-pdp" />
      </section>

      <section id="bias">
        <h2>편향 유형과 완화 <span className="badge badge-exam">시험 빈출</span></h2>
        <p>편향(Bias)은 책임감 있는 AI에서 가장 중요한 주제 중 하나입니다. 데이터, 알고리즘, 인간의 판단 등 다양한 원인에서 발생할 수 있습니다.</p>
        <table className="info-table"><thead><tr><th>편향 유형</th><th>설명</th><th>예시</th></tr></thead><tbody>
          <tr><td><strong>샘플링 편향</strong></td><td>학습 데이터가 모집단을 대표하지 못함</td><td>특정 인종만 포함된 얼굴 인식 데이터</td></tr>
          <tr><td><strong>측정 편향</strong></td><td>데이터 수집/측정 도구의 체계적 오류</td><td>특정 센서만 사용하여 편향된 측정</td></tr>
          <tr><td><strong>알고리즘 편향</strong></td><td>모델 설계/학습 과정의 구조적 편향</td><td>특정 그룹에 불리한 가중치 학습</td></tr>
          <tr><td><strong>확인 편향</strong></td><td>기존 가설을 확인하려는 인간의 편향</td><td>원하는 결과만 선택적으로 해석</td></tr>
          <tr><td><strong>제외 편향</strong></td><td>중요한 특성/그룹을 데이터에서 제외</td><td>장애인 데이터 누락</td></tr>
          <tr><td><strong>리포팅 편향</strong></td><td>결과를 선택적으로 보고</td><td>좋은 결과만 발표</td></tr>
        </tbody></table>

        <ToggleSection title="편향 완화를 위한 핵심 실천 방법">
          <ul>
            <li><strong>데이터 균형 확보:</strong> 다양한 인구통계 그룹에서 균형 잡힌 데이터 수집 (클래스 대표성의 균형)</li>
            <li><strong>클래스 불균형 측정:</strong> 훈련 데이터셋의 클래스 불균형을 측정하고 이에 따라 훈련 과정 조정</li>
            <li><strong>공정성 메트릭 포함:</strong> 모델 평가에 공정성 지표(fairness metrics)를 반드시 포함</li>
            <li><strong>훈련 데이터 편향 검토:</strong> 모든 인구 통계의 데이터를 포함하여 편향 완화</li>
            <li><strong>편향 인식 교육:</strong> 개발팀에 편향 인식(Bias Awareness) 및 책임감 있는 AI 교육 실시</li>
            <li><strong>특성 제거의 한계:</strong> 편향된 특성(예: 연령)을 단순히 제거해도 연령과 상관관계가 있는 대리 패턴을 학습하여 편향이 해결되지 않음</li>
            <li><strong>Human-in-the-loop:</strong> 포스트 프로세싱 단계에서 인간이 직접 검토하여 편향과 독성 콘텐츠를 실시간으로 제거</li>
          </ul>
        </ToggleSection>

        <ToggleSection title="편향 발견 시 비용 효율적 해결 방법">
          <ul>
            <li><strong>가장 비용 효율적:</strong> 더 다양한 훈련 데이터를 포함하여 기존 모델을 다시 파인튜닝</li>
            <li><strong>비효율적:</strong> 새 LLM을 처음부터 사전 학습 (막대한 비용과 시간 소요)</li>
            <li>RAG는 외부 지식을 검색하여 응답을 보강하지만, 모델 자체에 학습된 편향을 근본적으로 해결하지 못함</li>
            <li>AWS Trusted Advisor는 인프라 보안/비용/성능 최적화 도구이며, 모델 편향 탐지와는 무관</li>
          </ul>
        </ToggleSection>
        <TipBox type="warning"><p>시험에서 편향 관련 문제가 가장 빈출됩니다. "다양한 데이터로 균형 잡힌 데이터셋 구성"과 "공정성 메트릭 포함"이 정답인 경우가 많습니다. 특성을 단순히 제거하는 것은 편향 해결이 되지 않는다는 것도 기억하세요.</p></TipBox>
        <SectionStatusBar categoryId="responsible-ai" sectionId="bias" />
      </section>

      <section id="privacy">
        <h2>개인정보 보호와 학습 데이터 정제 <span className="badge badge-exam">시험 빈출</span></h2>
        <p>AI 모델이 민감한 정보를 '기억'하고 '재생산'하는 것을 원천 차단하는 것이 가장 효과적인 보호 방법입니다.</p>

        <h3>학습 데이터 정제 원칙 (Privacy by Design)</h3>
        <table className="info-table"><thead><tr><th>원칙</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>사전 예방 우선</strong></td><td>사후 필터링(Guardrails, Masking)보다 <strong>사전 예방이 우선</strong>. 학습이나 입력 단계에서 기밀 데이터를 제거하는 것이 가장 확실한 방법</td></tr>
          <tr><td><strong>Fine-tuning 전 PII 제거</strong></td><td>Fine-tuning이나 모델 학습 전 PII 및 기밀 데이터를 사전 제거하여 모델이 민감 정보를 학습하지 않도록 함</td></tr>
          <tr><td><strong>기밀 데이터 포함 모델 재훈련</strong></td><td>기밀 데이터로 학습된 모델은 삭제 후, 정제된 데이터로 완전히 재훈련. 기밀 데이터가 추론의 근거가 되는 것을 원천 차단</td></tr>
          <tr><td><strong>Bedrock Guardrails (보조적 수단)</strong></td><td>추론 시점 필터링은 보조적 수단. 이미 학습된 개인 데이터가 노출될 가능성이 잔존</td></tr>
        </tbody></table>

        <ToggleSection title="시험에서 자주 나오는 PII/기밀 데이터 시나리오">
          <ul>
            <li><strong>기밀 데이터로 학습된 모델이 기밀 정보를 응답에 포함하는 경우:</strong> 모델을 삭제하고, 훈련 데이터에서 기밀 데이터를 제거한 후, 사용자 지정 모델을 다시 학습</li>
            <li><strong>LLM 파인튜닝 시 고객 데이터 노출 방지:</strong> 파인튜닝 전에 고객 데이터에서 PII를 제거 (Guardrails보다 우선)</li>
            <li><strong>데이터 암호화와 네트워크 격리:</strong> 개인정보 보호 및 보안(Privacy and Security) 원칙에 해당</li>
          </ul>
        </ToggleSection>
        <TipBox type="important"><p>시험에서 "기밀 데이터 기반 응답 방지"가 나오면 정답은 거의 항상 <strong>"학습 데이터에서 기밀/PII 데이터를 제거하고 모델을 재훈련"</strong>입니다. 런타임 마스킹이나 암호화는 근본적인 해결이 아닙니다.</p></TipBox>
        <SectionStatusBar categoryId="responsible-ai" sectionId="privacy" />
      </section>

      <section id="explainability">
        <h2>모델 해석 방법</h2>
        <table className="info-table"><thead><tr><th>방법</th><th>유형</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>SHAP</strong> <span className="badge badge-exam">시험 빈출</span></td><td>로컬/글로벌</td><td>게임 이론 기반 각 피처의 기여도 계산. 각 특성이 개별 예측 결과에 얼마나 기여했는지를 수치로 계산하여 설명</td></tr>
          <tr><td><strong>LIME</strong></td><td>로컬</td><td>개별 예측을 간단한 모델로 근사 설명</td></tr>
          <tr><td><strong>PDP</strong> <span className="badge badge-exam">시험 빈출</span></td><td>글로벌</td><td>특정 피처와 예측값의 관계 시각화. 모델의 내부 작동을 깊이 이해하지 않고도 이해관계자에게 예측에 대한 개별 기능의 영향을 시각적으로 보여줌</td></tr>
          <tr><td><strong>Feature Importance</strong></td><td>글로벌</td><td>피처의 전체적 중요도 순위</td></tr>
          <tr><td><strong>Attention 시각화</strong></td><td>로컬</td><td>Transformer 모델의 주의 가중치 시각화</td></tr>
        </tbody></table>
        <ToggleSection title="로컬 vs 글로벌 설명">
          <ul><li><strong>로컬 (Local):</strong> 개별 예측에 대한 설명 (왜 이 고객에게 대출 거부?)</li><li><strong>글로벌 (Global):</strong> 모델 전체의 동작 패턴 설명 (어떤 피처가 가장 중요?)</li></ul>
        </ToggleSection>
        <SectionStatusBar categoryId="responsible-ai" sectionId="explainability" />
      </section>

      <section id="governance">
        <h2>AI 거버넌스 프레임워크</h2>
        <p>AI 거버넌스 프레임워크는 데이터 정책, 투명성 원칙, 책임성 기준, 규정 준수 가이드라인을 수립하는 것을 핵심 특성으로 합니다.</p>
        <h3>핵심 거버넌스 프로세스 구현 순서</h3>
        <table className="info-table"><thead><tr><th>단계</th><th>내용</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>Step 1</strong></td><td>거버넌스 목표, 위험 및 정책 결정</td><td>프레임워크를 수립하기 위해 먼저 목표와 위험을 정의</td></tr>
          <tr><td><strong>Step 2</strong></td><td>다기능 AI 거버넌스 그룹 구성</td><td>정의된 정책을 시행할 다기능 팀 구성</td></tr>
          <tr><td><strong>Step 3</strong></td><td>모델 모니터링 메커니즘 설정</td><td>준수 여부를 추적하기 위한 모니터링 체계 구축</td></tr>
        </tbody></table>

        <ToggleSection title="AI 거버넌스 프레임워크의 핵심 특성">
          <ul>
            <li><strong>핵심 특성:</strong> 데이터, 투명성, 책임 있는 AI 및 규정 준수에 대한 정책 및 지침을 개발하는 것</li>
            <li>AI 수명 주기 전반에 걸쳐 공정성, 투명성, 책임성 및 보안을 보장</li>
            <li>기술 전문가뿐만 아니라 다양한 이해 관계자의 참여가 필요 (포용적 거버넌스)</li>
            <li>의사 결정 프로세스에 대한 투명성과 사용자 접근을 보장 (제한하면 안 됨)</li>
          </ul>
        </ToggleSection>

        <ToggleSection title="편향 인식 및 책임감 있는 AI 교육">
          <p>AI 시스템의 공정성과 설명 가능성을 보장하기 위해 개발팀에 필요한 교육:</p>
          <ul>
            <li><strong>편향 인식(Bias Awareness) 및 책임감 있는 AI 교육</strong>이 가장 적합</li>
            <li>고급 코딩 기술, ML 알고리즘 교육은 기술적 역량이지 윤리적 원칙과는 직접 관련 없음</li>
            <li>데이터 프라이버시/암호화 교육은 보안 중심이며 공정성 보장과 직접 연결되지 않음</li>
          </ul>
        </ToggleSection>
        <SectionStatusBar categoryId="responsible-ai" sectionId="governance" />
      </section>

      <section id="aws-responsible">
        <h2>AWS 책임감 있는 AI 서비스 <span className="badge badge-exam">시험 빈출</span></h2>
        <table className="info-table"><thead><tr><th>서비스/기능</th><th>역할</th></tr></thead><tbody>
          <tr><td><strong>SageMaker Clarify</strong> <span className="badge badge-exam">시험 빈출</span></td><td>학습 전/후 편향 감지, SHAP 기반 설명 가능성 제공. 편향 메트릭과 설명을 제공하여 ML 모델 및 데이터의 잠재적 편향 감지 (예: 성별 기반 추천 편향 조사)</td></tr>
          <tr><td><strong>SageMaker Model Cards</strong></td><td>모델의 목적, 성능, 한계, 편향 문서화. 모델 투명성 제공</td></tr>
          <tr><td><strong>SageMaker Catalog</strong></td><td>승인된 데이터 세트를 검색, 거버넌스 및 액세스 제어할 수 있는 중앙 집중식 데이터 카탈로그. 회사 정책에 따라 승인된 데이터만 모델 훈련에 사용되도록 보장</td></tr>
          <tr><td><strong>Bedrock Guardrails</strong> <span className="badge badge-exam">시험 빈출</span></td><td>FM 입출력 안전성 필터링. 혐오 발언, 모욕, 성적 콘텐츠, 폭력이 포함된 응답 차단. 유해 콘텐츠, PII 노출, 주제 이탈, 할루시네이션 등을 정책 기반으로 차단</td></tr>
          <tr><td><strong>SageMaker Model Monitor</strong></td><td>배포 후 편향 드리프트 모니터링. 프로덕션에서 모델 성능과 데이터 드리프트 추적</td></tr>
          <tr><td><strong>Amazon A2I (Augmented AI)</strong> <span className="badge badge-exam">시험 빈출</span></td><td>ML 예측에 인간 검토 추가. 낮은 신뢰도 또는 높은 위험의 ML 예측을 인간 분석가에게 라우팅하는 내장 인간 검토 워크플로 제공</td></tr>
          <tr><td><strong>중재(Moderation) API</strong></td><td>유해 콘텐츠를 사전에 식별하여 예방. 부적절하거나 원치 않는 이미지/콘텐츠 반환 방지</td></tr>
        </tbody></table>

        <ToggleSection title="SageMaker Clarify + Model Cards 조합">
          <p>AI 모델의 투명성과 지속 가능성을 위한 SageMaker 기능 조합:</p>
          <ul>
            <li><strong>SageMaker Model Cards:</strong> 투명성 제공 (모델 메타데이터 문서화)</li>
            <li><strong>SageMaker Clarify:</strong> 편향 감지와 설명 가능성 제공</li>
            <li>SageMaker Pipelines (ML 워크플로 자동화), Model Monitor (성능 모니터링), Debugger (학습 디버깅)와는 역할이 다름</li>
          </ul>
        </ToggleSection>

        <ToggleSection title="환각(Hallucination)과 안전성">
          <ul>
            <li><strong>환각(Hallucination):</strong> AI 모델이 그럴듯하지만 사실과 다른 출력을 생성하는 현상. 예산이나 수치 데이터에서 잘못된 숫자를 생성하는 것이 대표적</li>
            <li><strong>Bedrock Guardrails:</strong> 유해한 응답을 방지하기 위한 내장 콘텐츠 필터. Amazon Bedrock과 직접 통합</li>
            <li><strong>환경적 영향 최소화:</strong> 모델 추론 중 계산 효율성을 우선시하도록 배포된 모델 아키텍처를 최적화</li>
          </ul>
        </ToggleSection>

        <ToggleSection title="Amazon A2I (Human-in-the-loop) 상세">
          <p>Amazon Augmented AI(A2I)는 인간 검토 워크플로를 제공합니다:</p>
          <ul>
            <li>낮은 신뢰도 또는 높은 위험의 ML 예측을 인간 분석가에게 라우팅</li>
            <li>조치를 취하기 전에 인간이 검토할 수 있는 워크플로</li>
            <li>SageMaker Ground Truth(데이터 레이블링)와 다른 용도: A2I는 실시간 예측 검토용</li>
            <li>포스트 프로세싱 단계에서 편향과 독성을 낮추기 위한 핵심 기술</li>
          </ul>
        </ToggleSection>
        <TipBox type="info"><p><strong>SageMaker Clarify</strong>는 편향 감지와 SHAP 기반 설명 가능성, <strong>Bedrock Guardrails</strong>는 유해 콘텐츠 필터링, <strong>Amazon A2I</strong>는 인간 검토 워크플로 — 이 세 가지는 시험에서 가장 자주 출제되는 AWS 서비스입니다.</p></TipBox>
        <SectionStatusBar categoryId="responsible-ai" sectionId="aws-responsible" />
      </section>

      <section id="quiz">
        <h2>도장깨기 퀴즈</h2>
        <Quiz categoryId="responsible-ai" categoryTitle="Responsible AI" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
