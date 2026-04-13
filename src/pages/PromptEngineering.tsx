import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz from '../components/Quiz'
import SectionStatusBar from '../components/SectionStatusBar'
import { getQuestionsByCategory } from '../data/quizData'

const sections = [
  { id: 'prompt-basics', title: '프롬프트 엔지니어링 기초' },
  { id: 'techniques', title: '프롬프트 기법' },
  { id: 'bedrock', title: 'Amazon Bedrock' },
  { id: 'bedrock-features', title: 'Bedrock 주요 기능' },
  { id: 'aws-gen-ai', title: 'AWS 기타 생성형 AI 서비스' },
  { id: 'quiz', title: '도장깨기 퀴즈' },
]

const quizQuestions = getQuestionsByCategory('prompt-engineering')

export default function PromptEngineering() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('prompt-engineering') }, [markStudied])

  return (
    <GuideLayout title="FM 활용과 프롬프트 엔지니어링" description="프롬프트 기법, Bedrock, Amazon Q를 학습합니다." icon="💬" badges={[{ label: '출제비율 24.2%', type: 'primary' }, { label: '72문제', type: 'info' }]} sections={sections} categoryId="prompt-engineering">

      <section id="prompt-basics">
        <h2>프롬프트 엔지니어링 기초</h2>
        <p>AI 모델이 더 정확하고 원하는 방식으로 응답을 생성하도록 입력(prompt)을 최적화하는 기술입니다. <strong>파인튜닝 없이도 모델 성능을 향상</strong>시킬 수 있어 다양한 AI 활용 사례에서 중요합니다.</p>
        <TipBox type="important"><p>이 카테고리는 <strong>출제비율 24.2%</strong>로 가장 높습니다. 프롬프트 기법과 Bedrock 서비스를 확실히 익히세요.</p></TipBox>

        <h3>핵심 목표</h3>
        <ul>
          <li><strong>최소한의 노력</strong>으로 최상의 결과 도출 (프롬프트 조정)</li>
          <li>명확한 지침과 컨텍스트 제공 (효과적인 프롬프트 설계)</li>
          <li>불필요한 응답 제거 및 원하는 출력 형식 유지</li>
        </ul>

        <h3>기본 원칙</h3>
        <ul>
          <li>최대한 구체적으로 작성 - 모든 것을 포괄하는 만능 프롬프트는 없음</li>
          <li>원하는 출력 형식과 길이를 포함 (예: 5분 길이, 3단락 등)</li>
          <li>모델 재학습, 파인튜닝, RAG를 적용하기 전에 <strong>프롬프트부터 조정</strong> - 모델이 원하는 응답을 생성할 때까지 실험하고 수정</li>
        </ul>

        <h3>프롬프트 설계의 4대 구성 요소 <span className="badge badge-exam">시험 빈출</span></h3>
        <p>효과적인 프롬프트는 아래 네 가지 요소를 포함하여 반복적 개선(iterative refinement)을 지원합니다.</p>
        <table className="info-table"><thead><tr><th>구성 요소</th><th>정의</th><th>예시</th></tr></thead><tbody>
          <tr><td><strong>Task (작업)</strong></td><td>모델의 <strong>사용 사례</strong>를 지정</td><td>"제품 설명을 바탕으로 마케팅 슬로건을 작성하세요"</td></tr>
          <tr><td><strong>Role (역할)</strong></td><td>요구 사항을 효과적으로 충족하기 위해 모델이 맡아야 할 <strong>페르소나</strong>를 정의</td><td>"당신은 10년 경력의 카피라이터입니다"</td></tr>
          <tr><td><strong>Response style (응답 스타일)</strong></td><td>모델이 따라야 할 <strong>어조, 형식, 구조</strong>를 설명</td><td>"캐주얼한 톤, 15자 이내, 한 줄로 작성"</td></tr>
          <tr><td><strong>Success criteria (성공 기준)</strong></td><td>모델 출력이 기대치를 충족하는지 평가하기 위한 <strong>명확한 지표</strong>를 설정</td><td>"브랜드 키워드를 반드시 포함, 부정적 표현 없음"</td></tr>
        </tbody></table>

        <ToggleSection title="시스템 프롬프트 (System Prompt) ⭐">
          <p>AI 모델의 <strong>역할(Role)</strong>, 페르소나, <strong>행동 경계(behavioral boundaries)</strong>를 사전에 정의하는 지침입니다. 사용자의 질문과 별도로 모델이 "어떻게 행동해야 하는지"를 안내합니다.</p>
          <p><em>예: "당신은 AWS 전문 기술 지원 엔지니어입니다. 제품 관련 질문에만 답변하고, 정치나 종교 관련 질문에는 답변을 거부하세요."</em></p>
          <table className="info-table"><thead><tr><th>구분</th><th>시스템 프롬프트</th><th>사용자 프롬프트</th></tr></thead><tbody>
            <tr><td><strong>목적</strong></td><td>모델의 역할, 톤, 제약 조건 설정</td><td>구체적인 질문이나 요청</td></tr>
            <tr><td><strong>설정 주체</strong></td><td>개발자/관리자</td><td>최종 사용자</td></tr>
            <tr><td><strong>변경 빈도</strong></td><td>앱 배포 시 고정</td><td>매 대화마다 변경</td></tr>
          </tbody></table>
        </ToggleSection>
        <SectionStatusBar categoryId="prompt-engineering" sectionId="prompt-basics" />
      </section>

      <section id="techniques">
        <h2>프롬프트 기법 ⭐</h2>
        <TipBox type="warning" title="시험 핵심"><p>Zero-shot, Few-shot, Chain-of-thought, Negative prompting, ReAct 기법은 <strong>시험에 매우 자주 출제</strong>됩니다. 각 기법의 정의와 적용 시나리오를 반드시 구분하세요.</p></TipBox>
        <table className="info-table"><thead><tr><th>기법</th><th>설명</th><th>예시/활용</th></tr></thead><tbody>
          <tr><td><strong>Zero-shot prompting</strong> <span className="badge badge-exam">시험 빈출</span></td><td>예제(example) 없이 질문만으로 AI가 자유롭게 추론하고 답을 생성하도록 유도하는 방식</td><td>"이 문장의 감성을 분석해주세요"</td></tr>
          <tr><td><strong>Few-shot prompting</strong> <span className="badge badge-exam">시험 빈출</span></td><td>도메인 특화 예시나 명시적 지침을 제공하여, 모델이 원하는 결과물의 패턴이나 형식을 참고하는 방식</td><td>"긍정: 좋아요 →긍정{'\n'}별로예요 →?"</td></tr>
          <tr><td><strong>Chain-of-thought prompting</strong> <span className="badge badge-exam">시험 빈출</span></td><td>모델에게 문제 해결 과정을 논리적으로 생각하고 설명하도록 요구하여 추론의 정확도를 높이는 방식</td><td>"단계별로 생각해보세요 (Let's think step by step)"</td></tr>
          <tr><td><strong>Prompt chaining</strong></td><td>복잡한 작업을 여러 개의 작은 하위 작업으로 분할하여 순차적으로 처리하는 기법. 앞선 프롬프트의 결과를 다음 프롬프트의 입력으로 사용</td><td>요약 →번역 →포맷팅</td></tr>
          <tr><td><strong>Positive prompting</strong></td><td>원하는 결과(특정 톤, 형식, 정보 포함 등)를 얻기 위해 구체적인 조건을 명시하여 모델을 활용하는 방식</td><td>"친절한 톤으로, 3문장으로 작성"</td></tr>
          <tr><td><strong>Negative prompting</strong> <span className="badge badge-exam">시험 빈출</span></td><td>원하지 않는 결과(예: 유해한 콘텐츠, 특정 주제)를 생성하지 않도록 명시적으로 지시하는 기법. 공격 패턴 탐지 지시에도 해당</td><td>이미지 생성 시 "흐릿한 이미지, 관련 없는 객체 제외"</td></tr>
          <tr><td><strong>ReAct prompting</strong> <span className="badge badge-exam">시험 빈출</span></td><td>추론(Reasoning)과 행동(Acting)을 반복하며 <strong>외부 도구나 API와 상호작용</strong>하여 문제를 해결하는 기법</td><td>Thought: 재고 확인 필요 →Action: API 호출 →Observation: 재고 5개</td></tr>
          <tr><td><strong>Message History</strong></td><td>이전 대화 기록을 프롬프트에 포함하여 문맥을 유지하고 일관된 답변을 얻는 방식. API 사용 시에는 대화 기록을 직접 전달해야 함</td><td>챗봇 대화 연속성 유지</td></tr>
        </tbody></table>

        <ToggleSection title="프롬프트 최적화 팁">
          <ul>
            <li>명확하고 구체적인 지시를 사용</li>
            <li>구분자(delimiter)로 입력 데이터 구분: {"```"}, {"---"}, {"<>"}</li>
            <li>출력 형식 지정: JSON, 표, 불릿 포인트 등</li>
            <li>네거티브 프롬프트: 하지 말아야 할 것도 명시</li>
            <li>단계적으로 복잡한 작업을 분해</li>
            <li>모델 재학습, 파인튜닝, RAG를 적용하기 전에 <strong>프롬프트부터 조정</strong></li>
          </ul>
        </ToggleSection>
        <SectionStatusBar categoryId="prompt-engineering" sectionId="techniques" />
      </section>

      <section id="bedrock">
        <h2>Amazon Bedrock ⭐</h2>
        <p><strong>완전 관리형</strong> 서버리스 생성형 AI 서비스입니다. 여러 AI 기업들의 기초 모델(FM)을 단일 <strong>API</strong>를 통해 제공합니다.</p>
        <ul>
          <li>텍스트 생성 모델, 이미지 생성 모델, 임베딩 생성 모델을 사용한 만큼만 지불(Pay-as-you-go)</li>
          <li>기업의 프라이빗 데이터로 모델 커스터마이징 가능</li>
          <li>엄격한 데이터 격리 정책으로 <strong>완전한 기밀성 보장</strong> - 사용자의 입력 프롬프트와 모델 출력을 서드파티 모델 제공업체와 절대 공유하지 않음</li>
        </ul>

        <h3>Amazon Nova 모델 제품군 <span className="badge badge-exam">시험 빈출</span></h3>
        <p>AWS의 자체 차세대 멀티모달 파운데이션 모델 제품군입니다.</p>
        <table className="info-table"><thead><tr><th>모델</th><th>특징</th></tr></thead><tbody>
          <tr><td><strong>Nova Micro</strong></td><td><strong>텍스트 전용(Text-only)</strong> 모델. Nova 제품군 중 <strong>가장 낮은 지연 시간과 비용</strong>. 텍스트 요약, 간단한 Q&A, 분류 등 텍스트만으로 충분한 작업에 적합</td></tr>
          <tr><td><strong>Nova Lite</strong></td><td><strong>초저지연 및 저비용</strong> 처리에 최적화된 모델 (<strong>텍스트+이미지+비디오</strong> 지원). 간단한 챗봇, 요약, 대규모 텍스트 처리 등 <strong>속도와 가성비</strong>가 중요한 작업에 적합</td></tr>
          <tr><td><strong>Nova Pro</strong></td><td><strong>복잡한 추론(Reasoning)</strong>, 코딩, 수학적 문제 해결 등 <strong>고성능</strong>이 요구되는 작업에 최적화. 정확도와 속도의 균형. 미세 조정 지원</td></tr>
          <tr><td><strong>Nova Canvas</strong></td><td>텍스트 프롬프트를 통해 전문가 수준의 고품질 <strong>이미지를 생성</strong> 및 편집. 로고 디자인, 마케팅 자산, 인페인팅/아웃페인팅 지원</td></tr>
          <tr><td><strong>Nova Reel</strong></td><td>텍스트를 입력하여 <strong>고화질 비디오를 생성</strong>. 소셜 미디어 콘텐츠, 광고 영상, 시각 효과 등 영상 제작에 특화</td></tr>
        </tbody></table>

        <h3>과금 모델 <span className="badge badge-exam">시험 빈출</span></h3>
        <table className="info-table"><thead><tr><th>모델</th><th>핵심 특징</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>온디맨드 (On-Demand)</strong></td><td>Flexibility - <strong>사용한 만큼 지불</strong></td><td>별도의 약정 없이 사용한 만큼만 비용을 지불. 입출력 토큰 수와 FM 종류에 따라 비용 책정. <strong>예산이 제한적이거나 사용량을 예측하기 어려운 경우</strong>에 가장 적합</td></tr>
          <tr><td><strong>배치 (Batch)</strong></td><td>Cost-efficiency - <strong>비동기 워크로드 할인</strong></td><td>즉각적인 응답이 필요 없는 대량 처리 작업에 대해 <strong>토큰당 요금을 50% 할인</strong>. 주간 카탈로그 업데이트, 대량 합성 데이터 생성 등 예약된 비긴급 작업에 가장 비용 효율적</td></tr>
          <tr><td><strong>프로비저닝된 처리량 (Provisioned Throughput)</strong></td><td>Performance - <strong>안정적인 성능 보장</strong></td><td>특정 기간(1개월 또는 6개월) 동안 일정 수준의 처리량을 약정 구매. 대규모의 안정적인 처리가 필요하거나, 일관된 지연 시간이 중요한 프로덕션 환경에 적합. <strong>커스텀 모델 사용 시 필수</strong></td></tr>
        </tbody></table>
        <TipBox type="warning" title="커스텀 모델과 Provisioned Throughput"><p>Amazon Bedrock에서 <strong>커스텀 모델을 사용하려면 프로비저닝된 처리량을 필수</strong>로 사용해야 합니다. AWS가 각 모델을 위한 전용 컴퓨팅 리소스를 미리 할당해야 하기 때문입니다.</p></TipBox>

        <TipBox type="info"><p><strong>Bedrock vs SageMaker:</strong> Bedrock은 사전 학습된 FM 활용, SageMaker는 커스텀 ML 모델 전체 라이프사이클 관리. SageMaker에서 fine-tuning한 모델을 Bedrock으로 import하여 배포(Custom Model Import)하는 것도 가능합니다.</p></TipBox>
        <SectionStatusBar categoryId="prompt-engineering" sectionId="bedrock" />
      </section>

      <section id="bedrock-features">
        <h2>Bedrock 주요 기능</h2>
        <table className="info-table"><thead><tr><th>기능</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>모델 커스터마이징 (Model Customization)</strong></td><td>기존 FM을 특정 요구사항에 맞게 조정. fine-tuning은 JSONL 형식의 입출력 쌍(labeled data) 필요. <strong>커스텀 모델 사용 시 Provisioned Throughput 필수</strong>. Custom Model Import로 SageMaker 등 외부에서 훈련한 모델을 Bedrock으로 가져와 배포 가능</td></tr>
          <tr><td><strong>프롬프트 관리 (Prompt Management)</strong></td><td>프롬프트를 생성, 테스트, 버전 관리 및 배포할 수 있는 중앙 집중식 도구. 다양한 모델 간 프롬프트 성능 비교 및 최적화 지원. 프롬프트 변수({`{{input}}`})와 도구 구성(Tools configuration, Function calling) 지원</td></tr>
          <tr><td><strong>에이전트 (Agent)</strong> <span className="badge badge-exam">시험 빈출</span></td><td>FM에 외부 데이터 소스 연결, API 호출, 다단계 추론, 응답 우선순위 결정 등 <strong>자율적 태스크 수행 능력</strong> 부여. 외부 시스템과의 상호작용이 필요한 작업에 적합 (예: OpenSearch에서 고객 데이터 검색 →CSV 파일 생성 →S3에 업로드). MCP 지원</td></tr>
          <tr><td><strong>지식 기반 (Knowledge Base)</strong> <span className="badge badge-exam">시험 빈출</span></td><td>AI 모델이 참조할 수 있는 구조화된 지식 저장소. 외부 문서, 기업 데이터, 정책 문서, 최신 데이터 등을 포함. RAG 패턴 구현으로 비공개 데이터를 FM에 통합. 필요 시 관련 내용만 검색하여 토큰 최적화 (비용 효율적)</td></tr>
          <tr><td><strong>워터마크 감지 (Watermark Detection)</strong></td><td>Amazon Titan Image Generator가 생성한 이미지를 식별. AI 생성 이미지와 실제 이미지를 구분</td></tr>
          <tr><td><strong>가드레일 (Guardrails)</strong> <span className="badge badge-exam">시험 빈출</span></td><td>Bedrock이 생성하는 콘텐츠 통제. 규정 위반 여부에 대한 사용자 입력 모니터링. 책임감 있는 AI(Responsible AI) 보장</td></tr>
          <tr><td><strong>모델 평가 (Model Evaluation)</strong></td><td>사용 사례에 가장 적합한 FM을 평가, 비교, 선택. 인적 기반(human-based) 모델 평가 작업 지원</td></tr>
          <tr><td><strong>호출 로깅 (Invocation Logging)</strong></td><td>활성화할 경우, 모델 호출 로그를 S3나 CloudWatch에 저장. 모델 입력 및 출력 데이터를 모니터링 가능</td></tr>
          <tr><td><strong>배치 추론 (Batch Inference)</strong></td><td>대량의 프롬프트를 <strong>비동기적으로</strong> 처리. 실시간 추론 대비 <strong>토큰 요금 50% 할인</strong>. 주간 보고서, 수천 개의 제품 설명 생성, 합성 데이터 응답 대량 생성에 적합</td></tr>
        </tbody></table>

        <ToggleSection title="가드레일 (Guardrails) 정책 유형 상세 ⭐">
          <TipBox type="warning"><p>가드레일의 6가지 정책 유형은 시험에 매우 자주 출제됩니다. 각 정책의 역할과 적용 시나리오를 정확히 구분해야 합니다.</p></TipBox>
          <table className="info-table"><thead><tr><th>정책 유형</th><th>설명</th></tr></thead><tbody>
            <tr><td><strong>콘텐츠 필터 (Content Filters)</strong></td><td>혐오 발언, 모욕, 성적 콘텐츠, 폭력 등 <strong>유해 카테고리별 필터링</strong> 강도를 설정</td></tr>
            <tr><td><strong>거부 주제 (Denied Topics)</strong></td><td>관리자가 정의한 <strong>특정 주제 영역의 논의를 차단</strong> (예: 투자/법률 조언, 의료 진단, 정치)</td></tr>
            <tr><td><strong>프롬프트 공격 (Prompt Attacks)</strong></td><td><strong>프롬프트 인젝션 및 탈옥(Jailbreak) 시도를 탐지</strong>하고 차단. AI의 내장 안전 기능을 우회하려는 시도를 방지</td></tr>
            <tr><td><strong>민감 정보 필터 (Sensitive Information Filters)</strong></td><td>입출력에서 <strong>PII(개인 식별 정보) 또는 민감 데이터를 탐지하고 마스킹/삭제</strong></td></tr>
            <tr><td><strong>문맥 기반 근거 확인 (Contextual Grounding Check)</strong></td><td>모델 응답이 <strong>제공된 소스 자료에 근거하는지 검증</strong>. 환각(Hallucination) 방지에 활용</td></tr>
            <tr><td><strong>단어 필터 (Word Filters)</strong></td><td>공격적인 용어를 감지하고 차단 (예: 경쟁사 언급 금지)</td></tr>
          </tbody></table>
        </ToggleSection>

        <ToggleSection title="에이전트 (Agent) vs 지식 기반 (Knowledge Base) 비교">
          <table className="info-table"><thead><tr><th>구분</th><th>에이전트 (Agent)</th><th>지식 기반 (Knowledge Base)</th></tr></thead><tbody>
            <tr><td><strong>용도</strong></td><td>외부 API 호출, 다단계 작업 자동화</td><td>문서 기반 RAG 검색, 정보 보강</td></tr>
            <tr><td><strong>동작 방식</strong></td><td>추론 →행동 →관찰 반복 (자율적)</td><td>질문에 맞는 문서 검색 →FM에 컨텍스트로 전달</td></tr>
            <tr><td><strong>사용 시나리오</strong></td><td>고객 문의 자동 처리, 주문 상태 확인, 데이터 추출 후 파일 생성</td><td>챗봇이 제품 매뉴얼 참조, 회사 정책에 맞는 응답 생성</td></tr>
          </tbody></table>
        </ToggleSection>
        <SectionStatusBar categoryId="prompt-engineering" sectionId="bedrock-features" />
      </section>

      <section id="aws-gen-ai">
        <h2>AWS 기타 생성형 AI 서비스</h2>

        <h3>Amazon Q <span className="badge badge-exam">시험 빈출</span></h3>
        <p>생성형 AI 기반의 업무용 어시스턴트입니다. 내부적으로 Amazon Bedrock이 제공하는 다양한 기초 모델(FMs)을 사용하지만, <strong>사용자가 LLM을 직접 선택할 수는 없습니다</strong>.</p>
        <ul>
          <li><strong>접근 제어(access control):</strong> 기존 시스템의 접근 제어를 재활용 →별도의 권한 설정 없이 기존 보안 체계 유지</li>
          <li><strong>가드레일(guardrails):</strong> 특정 내용을 차단하거나 필터링 →기업의 정책과 규정 준수</li>
        </ul>
        <table className="info-table"><thead><tr><th>서비스</th><th>대상</th><th>기능</th></tr></thead><tbody>
          <tr><td><strong>Amazon Q Business</strong></td><td>기업 사용자</td><td>기업 내부 데이터(문서, 위키, 이메일 등)를 연결하여 질의응답이 가능한 생성형 AI 어시스턴트. 40개 이상의 내장 커넥터(S3, Salesforce, Google Drive, Microsoft 365, ServiceNow, Gmail, Slack, Atlassian, Zendesk 등). 관리자가 주제 수준 제어를 정의하여 <strong>회사 승인 주제에만 응답</strong>하도록 제한 가능</td></tr>
          <tr><td><strong>Amazon Q Developer</strong></td><td>개발자</td><td>AWS 솔루션 개발과 운영을 지원하는 생성형 AI 기반 대화형 어시스턴스. 코드/테스트케이스 생성 및 검토, 소프트웨어 스니펫 생성, 참조 추적, 문서화, <strong>오픈 소스 라이선스 추적</strong></td></tr>
          <tr><td><strong>Amazon Q in QuickSight</strong></td><td>비즈니스 분석가</td><td>BI 및 리포팅 도구 (<strong>데이터 시각화</strong>). 자연어로 데이터 소스를 쿼리하고 차트나 도표를 생성하는 기능에 특화</td></tr>
        </tbody></table>

        <h3>Amazon PartyRock</h3>
        <p>Amazon Bedrock 기반 <strong>무료</strong> AI 앱 놀이터입니다. 코딩 없이 생성형 AI 앱을 빌드하고 테스트 가능합니다. 학습/프로토타이핑에 가장 비용 효율적입니다.</p>

        <h3>Amazon OpenSearch Service</h3>
        <p><strong>벡터 데이터베이스</strong>로 활용 가능합니다. 대규모 데이터셋에서 벡터 기반 유사도 검색과 분석을 제공하는 완전 관리형 서비스입니다. K-NN(최근접 이웃) 알고리즘을 통한 실시간 유사도 검색과 자동화된 클러스터 확장/인덱스 관리를 지원합니다.</p>

        <ToggleSection title="Generative AI Security Scoping Matrix (생성형 AI 보안 범위 정의 매트릭스)">
          <p>생성형 AI 사용 사례를 분류하고, AI 솔루션에 필요한 소유권 수준을 평가하거나 보안 문제의 우선순위를 정하기 위한 프레임워크입니다. 기업이 생성형 AI를 도입할 때 "어떤 수준의 보안이 필요한지", "어떤 위험이 있는지", "어떤 보호 조치를 먼저 해야 하는지"를 체계적으로 판단 가능합니다.</p>
          <h4>보안 책임의 크기 비교 (낮은 →높은 책임 순)</h4>
          <table className="info-table"><thead><tr><th>접근 방식</th><th>설명</th></tr></thead><tbody>
            <tr><td><strong>1. AI 내장 서드파티 앱 사용</strong></td><td>가장 기본적인 접근 방식 (가장 낮은 책임). 이미 만들어진 AI 기능이 포함된 소프트웨어를 그대로 사용</td></tr>
            <tr><td><strong>2. 기존 FM 활용 앱 구축</strong></td><td>한 단계 더 깊은 방식. 기존 AI 모델을 기반으로 자신만의 애플리케이션을 구축 (예: GPT 모델로 고객 서비스 챗봇 구현)</td></tr>
            <tr><td><strong>3. 기존 FM 미세 조정</strong></td><td>기존 AI 모델을 자신의 필요에 맞게 추가 학습 (예: 법률 회사가 기존 모델을 법률 문서로 추가 학습)</td></tr>
            <tr><td><strong>4. 처음부터 AI 모델 구축</strong></td><td>가장 깊은 수준 (가장 높은 책임). AI 모델을 완전히 처음부터 만드는 것</td></tr>
          </tbody></table>
        </ToggleSection>
        <SectionStatusBar categoryId="prompt-engineering" sectionId="aws-gen-ai" />
      </section>

      <section id="quiz">
        <h2>도장깨기 퀴즈</h2>
        <Quiz categoryId="prompt-engineering" categoryTitle="FM 활용과 프롬프트 엔지니어링" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
