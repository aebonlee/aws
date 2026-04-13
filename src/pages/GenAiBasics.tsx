import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz from '../components/Quiz'
import SectionStatusBar from '../components/SectionStatusBar'
import { getQuestionsByCategory } from '../data/quizData'

const sections = [
  { id: 'gen-ai-overview', title: '생성형 AI 분류' },
  { id: 'foundation-model', title: 'Foundation Model (FM)' },
  { id: 'llm', title: 'LLM과 Transformer' },
  { id: 'other-gen-models', title: '기타 생성 모델 (GAN, VAE, Diffusion)' },
  { id: 'key-concepts', title: 'LLM 주요 용어' },
  { id: 'fm-training', title: 'FM 학습 단계 (Pre-training vs Fine-tuning)' },
  { id: 'parameters', title: '추론 파라미터' },
  { id: 'image-parameters', title: '이미지 생성 파라미터' },
  { id: 'tokens-embeddings', title: '토큰과 임베딩' },
  { id: 'quiz', title: '도장깨기 퀴즈' },
]

const quizQuestions = getQuestionsByCategory('gen-ai-basics')

export default function GenAiBasics() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('gen-ai-basics') }, [markStudied])

  return (
    <GuideLayout title="생성형 AI 기초" description="Foundation Model, LLM, Transformer, 추론 파라미터를 학습합니다." icon="✨" badges={[{ label: '출제비율 22.7%', type: 'primary' }, { label: '66문제', type: 'info' }]} sections={sections} categoryId="gen-ai-basics">

      <section id="gen-ai-overview">
        <h2>생성형 AI 분류</h2>
        <TipBox type="info"><p>ChatGPT나 Claude 같은 AI와 대화해 본 적이 있으신가요? 질문을 하면 마치 사람처럼 대답하고, 글을 써달라고 하면 뚝딱 만들어주고, 심지어 그림까지 그려줍니다. 이렇게 <strong>새로운 콘텐츠를 스스로 만들어내는 AI</strong>를 생성형 AI(Generative AI)라고 합니다.</p></TipBox>
        <p><strong>생성형 AI(Generative AI, Gen AI)</strong>는 새로운 콘텐츠를 만들어낼 수 있는 모든 AI 시스템을 말합니다. 합성 데이터(synthetic data)를 생성하는 데에도 활용합니다.</p>
        <table className="info-table"><thead><tr><th>분류</th><th>설명</th><th>예시</th></tr></thead><tbody>
          <tr><td><strong>기초 모델 (FM)</strong></td><td>대규모 데이터로 사전 학습된 범용 AI 모델</td><td>GPT, Claude, Titan, Llama</td></tr>
          <tr><td><strong>LLM</strong></td><td>텍스트 특화 기초 모델 (Transformer 구조)</td><td>GPT, BERT, Claude</td></tr>
          <tr><td><strong>확산 모델</strong></td><td>이미지 생성 특화 모델</td><td>Stable Diffusion</td></tr>
          <tr><td><strong>멀티모달 모델</strong></td><td>다중 양식(텍스트, 이미지 등) 처리</td><td>GPT-4V, Claude 3</td></tr>
          <tr><td><strong>GAN</strong></td><td>생성자-판별자 경쟁 학습 (전통 생성 모델)</td><td>이미지/합성 데이터 생성</td></tr>
          <tr><td><strong>VAE</strong></td><td>잠재 공간 활용 (전통 생성 모델)</td><td>이미지 생성/압축</td></tr>
        </tbody></table>
        <TipBox type="important" title="시험 핵심"><p>생성형 AI 안에 <strong>기초 모델(FM)</strong>이 있고, 기초 모델 안에 <strong>LLM</strong>이 있습니다. <strong>Gen AI ⊃ FM ⊃ LLM</strong> 관계를 기억하세요.</p></TipBox>
        <SectionStatusBar categoryId="gen-ai-basics" sectionId="gen-ai-overview" />
      </section>

      <section id="foundation-model">
        <h2>Foundation Model (FM) ⭐ <span className="badge badge-exam">시험 빈출</span></h2>
        <p>Foundation Model은 대규모 데이터로 사전 학습(Pre-training)된 범용 AI 모델입니다.</p>
        <table className="info-table"><thead><tr><th>특성</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>대규모 사전 학습</strong></td><td>인터넷 규모의 데이터로 학습 (예: GPT-4는 약 250p 책 20억권 분량 학습)</td></tr>
          <tr><td><strong>범용성</strong></td><td>하나의 모델로 요약, 번역, 창작, 질의응답 등 다양한 작업 수행 가능</td></tr>
          <tr><td><strong>높은 적응성 (High Adaptability)</strong></td><td>별도의 대규모 재학습 없이 프롬프트 변경이나 약간의 파인튜닝만으로 다양한 작업에 적응</td></tr>
          <tr><td><strong>전이 학습 (Transfer Learning)</strong></td><td>특정 영역에서 학습한 지식을 새로운 작업이나 데이터에 효과적으로 전이하여 활용</td></tr>
        </tbody></table>

        <ToggleSection title="기초 모델을 '기초(Foundation)'라고 부르는 이유">
          <table className="info-table"><thead><tr><th>구분</th><th>전통적인 AI</th><th>기초 모델</th></tr></thead><tbody>
            <tr><td><strong>작업 범위</strong></td><td>하나의 특정 작업(예: 번역)만 수행</td><td>다양한 작업에 쉽게 적응</td></tr>
            <tr><td><strong>적응 방법</strong></td><td>새 작업마다 별도 모델 개발</td><td>프롬프트 변경이나 파인튜닝</td></tr>
            <tr><td><strong>역할</strong></td><td>단일 목적</td><td>다양한 AI 모델/앱의 '기초'가 됨</td></tr>
          </tbody></table>
          <p>텍스트 완성(Text completion) 모델, 지시 따르기(Instruction following) 모델, 텍스트 임베딩(Text embeddings) 모델, 이미지 생성(Image generation) 모델 등 다양한 모델과 애플리케이션의 기반이 됩니다.</p>
        </ToggleSection>

        <ToggleSection title="FM의 학습 방식: 자기 지도 학습 + 대규모 사전 학습">
          <ul>
            <li><strong>자기 지도 학습(Self-supervised learning)</strong>과 <strong>대규모 사전 학습(Pre-trained)</strong>을 결합</li>
            <li>레이블이 지정되지 않은 방대한 데이터로부터 스스로 학습하여, 언어와 이미지에 대한 근본적인 이해와 패턴을 내재화</li>
            <li>지도 학습과 비지도 학습의 중간 형태</li>
            <li>마치 백과사전처럼 엄청난 양의 정보를 가지고 있는 AI (예: GPT, BERT)</li>
          </ul>
        </ToggleSection>

        <ToggleSection title="FM의 하위 모델 유형">
          <table className="info-table"><thead><tr><th>모델 유형</th><th>설명</th><th>용도</th></tr></thead><tbody>
            <tr><td><strong>텍스트 완성 모델</strong></td><td>주어진 텍스트를 이어서 완성</td><td>문장 자동 완성</td></tr>
            <tr><td><strong>지시 따르기 모델</strong></td><td>사용자 지시사항을 이해하고 수행</td><td>Claude, ChatGPT 등 대화형 AI</td></tr>
            <tr><td><strong>텍스트 임베딩 모델</strong></td><td>텍스트를 벡터 표현으로 변환</td><td>벡터 DB 저장, 유사도 검색</td></tr>
            <tr><td><strong>이미지 생성 모델</strong></td><td>텍스트 설명으로부터 이미지 생성</td><td>Stable Diffusion, DALL-E</td></tr>
          </tbody></table>
        </ToggleSection>

        <TipBox type="important"><p>시험에서 FM = 대규모 사전학습 + 범용 + 다양한 다운스트림 작업에 적용 가능한 모델로 이해하세요. FM의 가장 큰 장점은 <strong>적응성(Adaptability)</strong>입니다.</p></TipBox>
        <SectionStatusBar categoryId="gen-ai-basics" sectionId="foundation-model" />
      </section>

      <section id="llm">
        <h2>LLM과 Transformer ⭐ <span className="badge badge-exam">시험 빈출</span></h2>
        <p><strong>LLM(Large Language Model)</strong>은 텍스트 생성에 특화된 FM입니다. 대부분 Transformer 아키텍처 기반입니다.</p>

        <h3>Transformer 핵심: Self-Attention ⭐</h3>
        <ul>
          <li><strong>Self-Attention(셀프 어텐션):</strong> 문장 내 모든 단어의 관계를 <strong>동시에 계산(병렬 처리)</strong>하여, 어떤 단어가 서로에게 중요한 영향을 미치는지 파악</li>
          <li>문장 전체의 <strong>맥락적 관계(contextual relationships)</strong>를 효과적으로 학습</li>
          <li><strong>인코더:</strong> 입력을 이해 (BERT 계열)</li>
          <li><strong>디코더:</strong> 출력을 생성 (GPT 계열)</li>
          <li><strong>인코더-디코더:</strong> 번역 등 seq2seq (T5 계열)</li>
        </ul>
        <TipBox type="warning"><p><strong>GPT = Generative Pre-trained Transformers</strong>의 약자이며, 트랜스포머 구조 사용을 의미합니다. OpenAI의 특정 제품 모델만을 지칭하는 것이 아닙니다.</p></TipBox>

        <h3>BERT (Bidirectional Encoder Representations from Transformers) ⭐</h3>
        <ul>
          <li><strong>양방향(Bidirectional)</strong> 문맥 이해를 위한 트랜스포머 기반 모델</li>
          <li>누락된 단어의 앞뒤를 파악해 문맥을 이해하여 단어를 유추</li>
          <li>예: 문서에서 누락된 단어를 채우는 작업에 적합</li>
        </ul>

        <h3>LLM 활용 사례</h3>
        <ul>
          <li>자연어 처리(NLP): 감정분석, 번역, 챗봇, 요약</li>
          <li>자연어 입력을 SQL 쿼리로 <strong>변환</strong>하여 데이터베이스 분석 지원</li>
          <li>코드 생성, 코드 변환</li>
        </ul>

        <ToggleSection title="주요 FM 모델">
          <table className="info-table"><thead><tr><th>모델</th><th>제공사</th><th>특징</th></tr></thead><tbody>
            <tr><td>Claude</td><td>Anthropic</td><td>안전성, 도움됨, 정직함 강조</td></tr>
            <tr><td>Titan</td><td>Amazon</td><td>텍스트, 임베딩, 이미지 모델 제공</td></tr>
            <tr><td>Llama</td><td>Meta</td><td>오픈소스 LLM</td></tr>
            <tr><td>Stable Diffusion</td><td>Stability AI</td><td>이미지 생성 Diffusion 모델</td></tr>
            <tr><td>Jurassic</td><td>AI21 Labs</td><td>다국어 텍스트 생성</td></tr>
          </tbody></table>
        </ToggleSection>
        <SectionStatusBar categoryId="gen-ai-basics" sectionId="llm" />
      </section>

      <section id="other-gen-models">
        <h2>기타 생성 모델 (GAN, VAE, Diffusion) ⭐</h2>
        <table className="info-table"><thead><tr><th>모델</th><th>원리</th><th>주요 용도</th></tr></thead><tbody>
          <tr><td><strong>GAN (생성적 적대 신경망)</strong></td><td>생성기(Generator)와 판별기(Discriminator)의 경쟁 학습. 생성기가 판별기를 속일 수 있는 데이터 생성 시도</td><td><strong>이미지</strong> 생성, 합성 데이터(synthetic data) 생성</td></tr>
          <tr><td><strong>VAE (변분 오토인코더)</strong></td><td>데이터의 잠재 공간(Latent Space)을 활용하여 샘플링하여 생성</td><td><strong>이미지</strong> 생성/압축</td></tr>
          <tr><td><strong>Diffusion (확산 모델)</strong></td><td>순수 노이즈/무작위 데이터에서 시작해 의미 있는 정보를 점진적으로 추가 (denoising)</td><td>이미지 생성에 특화 (Stable Diffusion)</td></tr>
        </tbody></table>
        <TipBox type="important"><p><strong>합성 데이터(synthetic data) 생성</strong>이 출제되면 <strong>GAN</strong>을 먼저 떠올리세요. 텍스트 생성에는 <strong>Transformer(LLM)</strong>, 이미지 생성에는 <strong>Diffusion</strong>이 대표적입니다.</p></TipBox>

        <h3>멀티모달 (Multi-Modal) ⭐ <span className="badge badge-exam">시험 빈출</span></h3>
        <ul>
          <li><strong>Modal</strong>: 모델이 처리/생성하는 데이터 유형 (텍스트, 이미지, 오디오 등)</li>
          <li><strong>멀티모달 모델</strong>: 단일 모델 내에서 여러 데이터 유형을 동시에 처리/생성</li>
          <li>예: 텍스트와 이미지를 입력받아 텍스트 답변을 생성하는 개인 튜터 애플리케이션</li>
          <li>GPT-4V, Claude 3 등이 대표적</li>
        </ul>

        <h3>생성형 AI 유형별 사용 사례</h3>
        <table className="info-table"><thead><tr><th>유형</th><th>모델/기술</th><th>사용 사례</th></tr></thead><tbody>
          <tr><td><strong>텍스트 생성</strong></td><td>LLM (GPT, Claude, Titan)</td><td>대화, 요약, 번역, 코드 생성</td></tr>
          <tr><td><strong>이미지 생성</strong></td><td>Diffusion, GAN, VAE</td><td>이미지 생성/편집, 스타일 변환</td></tr>
          <tr><td><strong>코드 생성</strong></td><td>Code LLM</td><td>코드 자동 완성, 코드 리뷰</td></tr>
          <tr><td><strong>음악/오디오</strong></td><td>MusicLM, AudioLM</td><td>음악 생성, 음성 합성</td></tr>
          <tr><td><strong>멀티모달</strong></td><td>GPT-4V, Claude 3</td><td>텍스트+이미지 입력 처리</td></tr>
        </tbody></table>
        <SectionStatusBar categoryId="gen-ai-basics" sectionId="other-gen-models" />
      </section>

      <section id="key-concepts">
        <h2>LLM 주요 용어 ⭐ <span className="badge badge-exam">시험 빈출</span></h2>

        <h3>Token (토큰) ⭐ <span className="badge badge-exam">시험 빈출</span></h3>
        <table className="info-table"><thead><tr><th>항목</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>정의</strong></td><td>LLM이 텍스트를 처리하는 기본 단위. 단어, 부분 단어, 문자 등이 될 수 있음</td></tr>
          <tr><td><strong>예시</strong></td><td>"안녕하세요" → "안녕", "하세", "요"로 분리. 영어는 약 4글자 = 1토큰, 한국어는 1~2글자 = 1토큰</td></tr>
          <tr><td><strong>과금 단위</strong></td><td>입력 토큰 + 출력 토큰 수에 기반하여 비용 계산 (예: Claude 3 Haiku 입력 $0.25/백만 토큰)</td></tr>
          <tr><td><strong>비용 절감</strong></td><td>LLM 사용 비용을 줄이려면 <strong>토큰 수를 줄이는 것</strong>을 먼저 고려</td></tr>
          <tr><td><strong>토큰 한도</strong></td><td>초과 시 일부 텍스트가 무시되거나 오류 발생</td></tr>
        </tbody></table>
        <TipBox type="important"><p><strong>추론 비용</strong>을 높이는 요인 = <strong>소비한 토큰 수</strong>. Temperature나 모델 크기가 아닌 토큰 사용량이 비용에 직결됩니다.</p></TipBox>

        <h3>Context Window (컨텍스트 윈도우) ⭐ <span className="badge badge-exam">시험 빈출</span></h3>
        <ul>
          <li>LLM이 <strong>한 번에 처리할 수 있는 최대 텍스트 길이</strong> (토큰 한도)</li>
          <li>단일 프롬프트에 담을 수 있는 정보량</li>
          <li>입력 토큰이 모델의 컨텍스트 크기를 초과하면:
            <ul>
              <li>초과된 입력이 잘리거나</li>
              <li>오류가 발생해 모델이 아예 응답을 생성하지 못함</li>
            </ul>
          </li>
          <li>책 요약이 실패하는 경우 → <strong>입력 토큰이 컨텍스트 크기를 초과</strong>했기 때문</li>
        </ul>

        <h3>SLM (Small Language Model)</h3>
        <ul>
          <li>파라미터 수가 적고, 학습 데이터셋이 작거나 구조가 단순한 모델</li>
          <li>큰 모델(GPT, Claude 등)에 비해 언어 이해나 생성 능력이 떨어짐</li>
          <li>그대신 <strong>제한된 컴퓨팅 자원(스마트폰, PC, 엣지 디바이스)</strong>에서도 운영 가능</li>
          <li>빠른 학습과 추론 속도 제공</li>
          <li><strong>엣지 디바이스에서 최소 지연 시간 추론</strong>이 필요하면 → SLM 배포</li>
        </ul>

        <h3>Hallucination (환각) ⭐ <span className="badge badge-exam">시험 빈출</span></h3>
        <ul>
          <li>LLM이 <strong>그럴듯하고 사실처럼 들리지만 실제로는 잘못된 내용</strong>을 생성하는 현상</li>
          <li>예: 거짓된 역사적 사실을 진실처럼 서술, 존재하지 않는 제품 특징 설명, 실제하지 않는 연구/통계 인용</li>
          <li><strong>완화 방법</strong>: Temperature 낮추기, RAG(검색 증강 생성), Guardrails 등</li>
        </ul>
        <TipBox type="warning"><p>"그럴듯하지만 정확하지 않은 내용" = <strong>Hallucination(환각)</strong>. "동일 입력에 다른 출력" = <strong>Non-determinism(비결정성)</strong>. 두 개념을 혼동하지 마세요!</p></TipBox>

        <h3>Inference Latency (추론 지연시간) ⭐</h3>
        <ul>
          <li>FM이 입력 요청을 처리하고 출력을 반환하는 데 걸리는 시간(속도)</li>
          <li>모델 선택 시 중요한 고려 요소</li>
          <li>실시간 챗봇: 낮은 지연 시간 필요</li>
          <li>배치 분석: 지연 시간보다 처리량(throughput)이 중요</li>
        </ul>
        <ToggleSection title="혼동하기 쉬운 개념 비교">
          <table className="info-table"><thead><tr><th>개념</th><th>의미</th><th>추론 속도와의 관계</th></tr></thead><tbody>
            <tr><td><strong>추론 지연시간</strong></td><td>모델이 응답을 생성하기까지의 시간</td><td>속도 자체를 의미</td></tr>
            <tr><td><strong>모델 크기</strong></td><td>모델의 매개변수 수</td><td>지연 시간에 영향을 줄 수 있지만 속도 자체가 아님</td></tr>
            <tr><td><strong>컨텍스트 윈도우</strong></td><td>한 번에 수용 가능한 최대 입력 토큰 수</td><td>처리 용량이지 속도가 아님</td></tr>
            <tr><td><strong>파인 튜닝</strong></td><td>특정 작업에 맞게 조정하는 프로세스</td><td>학습 과정이지 속도가 아님</td></tr>
          </tbody></table>
        </ToggleSection>

        <h3>Non-determinism (비결정성) ⭐</h3>
        <ul>
          <li>LLM의 응답은 <strong>비결정적(non-deterministic)</strong>: 동일한 입력에 대해 다른 출력이 생성됨</li>
          <li>Temperature, 샘플링 기법으로 인해 발생하는 확률적 행동</li>
          <li>Hallucination(사실이 아닌 정보 생성)과 구별해야 함</li>
        </ul>

        <h3>Embeddings (임베딩) ⭐ <span className="badge badge-exam">시험 빈출</span></h3>
        <ul>
          <li>텍스트, 이미지 등의 데이터를 <strong>수치적 표현(예: 벡터)</strong>으로 변환</li>
          <li>수치적 표현은 AI가 자연어를 이해하기 위한 수단</li>
          <li>고차원 데이터(텍스트, 이미지)가 저차원 밀집 데이터로 재표현</li>
          <li><strong>의미적 관계를 포착</strong>: 의미적으로 유사한 데이터들은 비슷한 수치(벡터 공간의 좌표)로 변환</li>
          <li>데이터(텍스트, 이미지)를 수학적으로 비교할 수 있는 능력을 제공</li>
          <li>이 좌표를 통해 <strong>벡터 검색</strong>이 가능해짐</li>
          <li><strong>Amazon Titan Embeddings</strong>: 텍스트를 벡터로 변환하는 임베딩 모델</li>
          <li><strong>RAG의 핵심</strong>: 문서를 임베딩 → 벡터 DB 저장 → 질문과 유사 문서 검색</li>
        </ul>
        <TipBox type="important"><p>"실제 물체와 개념을 수치로 표현" = <strong>임베딩</strong>. "텍스트 처리 기본 단위" = <strong>토큰</strong>. 두 개념을 혼동하지 마세요!</p></TipBox>

        <ToggleSection title="벡터 데이터베이스 (AWS 서비스)">
          <table className="info-table"><thead><tr><th>서비스</th><th>특징</th></tr></thead><tbody>
            <tr><td><strong>Amazon Aurora PostgreSQL</strong></td><td>pgvector 확장으로 벡터 임베딩 저장과 유사도 검색을 네이티브 지원</td></tr>
            <tr><td><strong>Amazon OpenSearch Service</strong></td><td>k-NN 플러그인으로 고차원 벡터 인덱싱과 유사도 검색</td></tr>
          </tbody></table>
        </ToggleSection>
        <SectionStatusBar categoryId="gen-ai-basics" sectionId="key-concepts" />
      </section>

      <section id="fm-training">
        <h2>FM 학습 단계 (Pre-training vs Fine-tuning) ⭐ <span className="badge badge-exam">시험 빈출</span></h2>
        <p>파운데이션 모델은 크게 두 단계를 거쳐 완성됩니다.</p>

        <h3>1단계: 사전 훈련 (Pre-training)</h3>
        <ul>
          <li>모델 가중치를 <strong>무작위로 초기화(random initialization)</strong>한 상태에서 시작</li>
          <li>대규모 웹 데이터 등 방대한 비지도(unlabeled) 데이터 코퍼스를 사용</li>
          <li><strong>언어 모델링 목적 함수(language modeling objective)</strong>를 통해 "다음 단어 예측" 등의 패턴을 학습</li>
          <li>이 단계의 결과로 범용적인 언어 이해 능력을 갖춘 기초 모델이 생성됨</li>
        </ul>

        <h3>2단계: 파인 튜닝 (Fine-tuning)</h3>
        <ul>
          <li><strong>이미 사전 훈련된 모델</strong>에서 시작 (가중치를 무작위로 초기화하지 않음)</li>
          <li>레이블이 지정된 <strong>소규모</strong> 데이터셋으로 특정 작업에 맞게 모델을 조정</li>
        </ul>

        <table className="info-table"><thead><tr><th>구분</th><th>Pre-training (사전 훈련)</th><th>Fine-tuning (파인 튜닝)</th></tr></thead><tbody>
          <tr><td><strong>시작점</strong></td><td>무작위 가중치</td><td>사전 훈련된 가중치</td></tr>
          <tr><td><strong>데이터</strong></td><td>대규모, 레이블 없음</td><td>소규모, 레이블 있음</td></tr>
          <tr><td><strong>목적</strong></td><td>범용 언어 이해</td><td>특정 작업 최적화</td></tr>
          <tr><td><strong>비용</strong></td><td>매우 높음</td><td>상대적으로 낮음</td></tr>
        </tbody></table>

        <TipBox type="important"><p>시험 핵심: "무작위 가중치 초기화 + 대규모 데이터 + 언어 모델링 목적 함수" = <strong>Pre-training</strong>. "사전 훈련된 모델 + 소규모 레이블 데이터 + 특정 작업 조정" = <strong>Fine-tuning</strong>.</p></TipBox>
        <SectionStatusBar categoryId="gen-ai-basics" sectionId="fm-training" />
      </section>

      <section id="parameters">
        <h2>추론 파라미터 ⭐ <span className="badge badge-exam">시험 빈출</span></h2>
        <p>생성형 AI의 기초 모델 안에 LLM과 Diffusion Model이 있으며, 각각 다른 파라미터를 사용합니다.</p>

        <h3>Text Generation (LLM) 파라미터</h3>
        <table className="info-table"><thead><tr><th>파라미터</th><th>범위</th><th>효과</th></tr></thead><tbody>
          <tr><td><strong>Temperature ⭐</strong></td><td>0~1+</td><td>응답의 창의성(creativity)과 다양성, 무작위성(randomness) 조절</td></tr>
          <tr><td><strong>Top-P ⭐</strong></td><td>0~1</td><td>다음 토큰 선택 시 고려(sampling)할 누적 확률 범위</td></tr>
          <tr><td><strong>Top-K</strong></td><td>정수</td><td>확률 상위 K개 토큰만 후보로 고려</td></tr>
          <tr><td><strong>Max Tokens</strong></td><td>정수</td><td>생성할 최대 토큰 수 (출력 길이 제한)</td></tr>
          <tr><td><strong>Stop Sequences</strong></td><td>문자열</td><td>생성을 멈출 구분자</td></tr>
        </tbody></table>

        <h3>Temperature 상세 ⭐ <span className="badge badge-exam">시험 빈출</span></h3>
        <table className="info-table"><thead><tr><th>Temperature</th><th>동작</th><th>적합한 작업</th></tr></thead><tbody>
          <tr><td><strong>낮음 (0~0.3)</strong></td><td>가장 확률 높은 단어를 우선 선택 → <strong>결정론적(deterministic)</strong> 응답. 일관성 높음</td><td>사실 기반 Q&A, 기술 설명, 법률, 의료, 데이터 분석 등 <strong>정확성이 중요한 작업</strong></td></tr>
          <tr><td><strong>중간 (0.3~0.5)</strong></td><td>적절한 균형</td><td>요약, 질의응답, 일반 대화</td></tr>
          <tr><td><strong>높음 (0.7~1.0)</strong></td><td>낮은 확률의 단어도 선택 가능 → 창의적이지만 불안정. 환각 가능성 증가</td><td>Story telling, 시(poetry), 브레인스토밍</td></tr>
        </tbody></table>
        <TipBox type="important"><p><strong>"결정적이고 일관된 응답"</strong> = Temperature를 <strong>낮추기(0에 가깝게)</strong>. <strong>"다양하고 창의적인 출력"</strong> = Temperature를 <strong>높이기</strong>. <strong>"환각 줄이기"</strong> = Temperature를 <strong>낮추기</strong>.</p></TipBox>

        <h3>Top P 상세 ⭐</h3>
        <ToggleSection title="Top P 이해하기 (가사 생성 예시)">
          <p>다음과 같은 가사의 시작 부분이 있다고 해 봅시다: <strong>"머리부터 발끝까지"</strong></p>
          <p>AI는 이어질 가사로 여러 선택지를 고려합니다:</p>
          <ul>
            <li>'오로나민 C' (확률 40%)</li>
            <li>'핫 이슈' (확률 30%)</li>
            <li>'사랑스러워' (확률 20%)</li>
            <li>'밀리오레' (확률 10%)</li>
          </ul>
          <table className="info-table"><thead><tr><th>Top P</th><th>결과</th></tr></thead><tbody>
            <tr><td><strong>0.4</strong></td><td>'오로나민 C'만 고려</td></tr>
            <tr><td><strong>0.7</strong></td><td>'오로나민 C'와 '핫 이슈'만 고려</td></tr>
            <tr><td><strong>0.9</strong></td><td>상위 3개 옵션 고려</td></tr>
            <tr><td><strong>1.0</strong></td><td>모든 옵션 고려</td></tr>
          </tbody></table>
          <p>Top P 값이 높을수록 더 창의적이고 다양한 응답을 생성할 수 있습니다. 하지만 너무 높으면 부적절하거나 맥락에 맞지 않는 응답이 생성될 수 있습니다.</p>
        </ToggleSection>

        <h3>Temperature vs Top P</h3>
        <ul>
          <li>보통 <strong>temperature와 top-p 중 하나만 조절</strong></li>
          <li>일관적이고 반복적인 결과를 원하는 경우: temperature 0.01 또는 top-p 0.01</li>
        </ul>
        <TipBox type="warning"><p><strong>Temperature와 Top-P를 동시에 극단적으로 설정하지 마세요.</strong> 일반적으로 하나를 조정하고 다른 하나는 기본값을 유지합니다.</p></TipBox>

        <ToggleSection title="FM 특성 매칭 (시험 빈출)">
          <table className="info-table"><thead><tr><th>정의</th><th>FM 특성</th></tr></thead><tbody>
            <tr><td>단일 프롬프트에 들어갈 수 있는 정보의 양</td><td><strong>Context Window (컨텍스트 윈도우)</strong></td></tr>
            <tr><td>모델이 출력을 생성하는 데 걸리는 시간</td><td><strong>Latency (추론 지연시간)</strong></td></tr>
            <tr><td>여러 사용자가 동시에 엔드포인트 호출</td><td><strong>Concurrency (동시성)</strong></td></tr>
            <tr><td>모델이 처리/생성하는 데이터 유형</td><td><strong>Modality (모달리티)</strong></td></tr>
          </tbody></table>
        </ToggleSection>
        <SectionStatusBar categoryId="gen-ai-basics" sectionId="parameters" />
      </section>

      <section id="image-parameters">
        <h2>이미지 생성 파라미터 (Diffusion Model) ⭐</h2>
        <table className="info-table"><thead><tr><th>파라미터</th><th>설명</th><th>효과</th></tr></thead><tbody>
          <tr><td><strong>CFG (Classifier-Free Guidance) ⭐</strong></td><td>텍스트-이미지 생성 모델에서 프롬프트와 생성 이미지 간의 정렬도 조절</td><td>스케일 높을수록 프롬프트를 더 충실히 따르는 이미지 생성. 낮을수록 더 자유롭고 창의적</td></tr>
          <tr><td><strong>Generation Step (Diffusion Steps)</strong></td><td>노이즈 제거 반복 횟수 제어</td><td>스텝이 많을수록 더 상세하고 정교한 이미지 생성</td></tr>
        </tbody></table>
        <TipBox type="important"><p><strong>"이미지가 무작위적이고 세부 정보 부족"</strong> → <strong>CFG 스케일 증가</strong>(프롬프트 준수도 향상). <strong>"이미지 상세도/정교함 제어"</strong> → <strong>Generation Steps</strong> 조정.</p></TipBox>
        <ToggleSection title="CFG (Classifier-Free Guidance) 상세">
          <ul>
            <li>(예전 방식처럼) 이미지가 텍스트 프롬프트와 얼마나 잘 매칭되는지 판단하는 분류기(Classifier)에 의존하지 않는(free) 방식</li>
            <li>스케일 값이 높을수록 프롬프트를 더 충실하게 따르는 이미지 생성</li>
            <li>스케일 값이 낮을수록 프롬프트와의 연관성은 낮아지고 더 자유롭고 창의적인 이미지 생성</li>
          </ul>
        </ToggleSection>
        <SectionStatusBar categoryId="gen-ai-basics" sectionId="image-parameters" />
      </section>

      <section id="tokens-embeddings">
        <h2>토큰과 임베딩 종합 정리</h2>
        <h3>토큰 (Token) - 요약</h3>
        <ul>
          <li>LLM이 텍스트를 처리하는 <strong>기본 입력 및 출력 단위</strong></li>
          <li>단어, 하위 단어(subword), 문자 등을 나타냄</li>
          <li>입력과 출력 토큰 수에 따라 <strong>비용 결정</strong></li>
          <li>컨텍스트 윈도우 = 한 번에 처리 가능한 최대 토큰 수</li>
          <li>토큰화(Tokenization) = 처리를 위해 텍스트를 더 작은 단위로 분할하는 전처리 과정</li>
        </ul>

        <h3>임베딩 (Embedding) - 요약</h3>
        <ul>
          <li>텍스트를 고차원 <strong>수치 벡터</strong>로 변환</li>
          <li>의미적으로 유사한 텍스트는 벡터 공간에서 <strong>가까이 위치</strong></li>
          <li><strong>Amazon Titan Embeddings:</strong> 텍스트를 벡터로 변환하는 임베딩 모델</li>
          <li><strong>텍스트 임베딩 모델</strong>: 데이터를 벡터 표현으로 변환하여 벡터 DB에 저장 가능</li>
          <li><strong>멀티모달 임베딩 모델</strong>: 텍스트와 이미지를 동일한 벡터 공간에 매핑하여 크로스모달 검색 구현</li>
          <li><strong>RAG의 핵심:</strong> 문서를 임베딩 → 벡터 DB 저장 → 질문과 유사 문서 검색</li>
        </ul>

        <ToggleSection title="토큰 vs 임베딩 비교">
          <table className="info-table"><thead><tr><th>구분</th><th>토큰 (Token)</th><th>임베딩 (Embedding)</th></tr></thead><tbody>
            <tr><td><strong>정의</strong></td><td>텍스트 분할 단위 (아직 수치화 안됨)</td><td>데이터를 수치 벡터로 변환한 표현</td></tr>
            <tr><td><strong>목적</strong></td><td>텍스트를 모델이 처리할 수 있는 단위로 분할</td><td>의미적 관계 포착 및 수학적 비교</td></tr>
            <tr><td><strong>비용</strong></td><td>토큰 수 기반 과금</td><td>임베딩 생성 시 토큰 비용 발생</td></tr>
            <tr><td><strong>활용</strong></td><td>LLM 입출력</td><td>벡터 검색, RAG, 유사도 계산</td></tr>
          </tbody></table>
        </ToggleSection>

        <TipBox type="important"><p><strong>Hallucination(환각)</strong>: FM이 그럴듯하지만 사실이 아닌 정보를 생성하는 현상. <strong>Temperature 낮추기, RAG, Guardrails</strong> 등으로 완화합니다.</p></TipBox>
        <SectionStatusBar categoryId="gen-ai-basics" sectionId="tokens-embeddings" />
      </section>

      <section id="quiz">
        <h2>도장깨기 퀴즈</h2>
        <Quiz categoryId="gen-ai-basics" categoryTitle="생성형 AI 기초" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
