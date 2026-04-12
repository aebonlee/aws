import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz from '../components/Quiz'
import { getQuestionsByCategory } from '../data/quizData'

const sections = [
  { id: 'foundation-model', title: 'Foundation Model (FM)' },
  { id: 'llm', title: 'LLM과 Transformer' },
  { id: 'parameters', title: '추론 파라미터' },
  { id: 'gen-ai-types', title: '생성형 AI 유형' },
  { id: 'tokens-embeddings', title: '토큰과 임베딩' },
  { id: 'quiz', title: '도장깨기 퀴즈' },
]

const quizQuestions = getQuestionsByCategory('gen-ai-basics')

export default function GenAiBasics() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('gen-ai-basics') }, [markStudied])

  return (
    <GuideLayout title="생성형 AI 기초" description="Foundation Model, LLM, Transformer, 추론 파라미터를 학습합니다." icon="✨" badges={[{ label: '출제비율 22.7%', type: 'primary' }, { label: '66문제', type: 'info' }]} sections={sections} categoryId="gen-ai-basics">

      <section id="foundation-model">
        <h2>Foundation Model (FM)</h2>
        <p>Foundation Model은 대규모 데이터로 사전 학습(Pre-training)된 범용 AI 모델입니다.</p>
        <table className="info-table"><thead><tr><th>특성</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>대규모 사전 학습</strong></td><td>인터넷 규모의 데이터로 학습 (수십억 파라미터)</td></tr>
          <tr><td><strong>범용성</strong></td><td>하나의 모델로 다양한 작업 수행 가능</td></tr>
          <tr><td><strong>적응성</strong></td><td>파인 튜닝, 프롬프트 엔지니어링으로 맞춤화</td></tr>
          <tr><td><strong>전이 학습</strong></td><td>사전 학습된 지식을 새 작업에 전이</td></tr>
        </tbody></table>
        <TipBox type="important"><p>시험에서 FM = 대규모 사전학습 + 범용 + 다양한 다운스트림 작업에 적용 가능한 모델로 이해하세요.</p></TipBox>
      </section>

      <section id="llm">
        <h2>LLM과 Transformer</h2>
        <p><strong>LLM(Large Language Model)</strong>은 텍스트 생성에 특화된 FM입니다. 대부분 Transformer 아키텍처 기반입니다.</p>
        <h3>Transformer 핵심</h3>
        <ul><li><strong>Self-Attention:</strong> 입력 시퀀스의 모든 토큰 간 관계를 병렬 처리</li><li><strong>인코더:</strong> 입력을 이해 (BERT 계열)</li><li><strong>디코더:</strong> 출력을 생성 (GPT 계열)</li><li><strong>인코더-디코더:</strong> 번역 등 seq2seq (T5 계열)</li></ul>
        <ToggleSection title="주요 FM 모델">
          <table className="info-table"><thead><tr><th>모델</th><th>제공사</th><th>특징</th></tr></thead><tbody>
            <tr><td>Claude</td><td>Anthropic</td><td>안전성, 도움됨, 정직함 강조</td></tr>
            <tr><td>Titan</td><td>Amazon</td><td>텍스트, 임베딩, 이미지 모델 제공</td></tr>
            <tr><td>Llama</td><td>Meta</td><td>오픈소스 LLM</td></tr>
            <tr><td>Stable Diffusion</td><td>Stability AI</td><td>이미지 생성 Diffusion 모델</td></tr>
            <tr><td>Jurassic</td><td>AI21 Labs</td><td>다국어 텍스트 생성</td></tr>
          </tbody></table>
        </ToggleSection>
      </section>

      <section id="parameters">
        <h2>추론 파라미터</h2>
        <table className="info-table"><thead><tr><th>파라미터</th><th>범위</th><th>효과</th></tr></thead><tbody>
          <tr><td><strong>Temperature</strong></td><td>0~1+</td><td>낮을수록 결정적, 높을수록 창의적/다양</td></tr>
          <tr><td><strong>Top-P</strong></td><td>0~1</td><td>누적 확률 P까지의 토큰만 후보</td></tr>
          <tr><td><strong>Top-K</strong></td><td>정수</td><td>확률 상위 K개 토큰만 후보</td></tr>
          <tr><td><strong>Max Tokens</strong></td><td>정수</td><td>생성할 최대 토큰 수</td></tr>
          <tr><td><strong>Stop Sequences</strong></td><td>문자열</td><td>생성을 멈출 구분자</td></tr>
        </tbody></table>
        <TipBox type="warning"><p><strong>Temperature와 Top-P를 동시에 극단적으로 설정하지 마세요.</strong> 일반적으로 하나를 조정하고 다른 하나는 기본값 유지합니다.</p></TipBox>
        <ToggleSection title="Temperature 활용 예시">
          <ul><li><strong>Temperature=0:</strong> 코드 생성, 수학 문제, 정확한 정보 추출</li><li><strong>Temperature=0.3~0.5:</strong> 요약, 질의응답, 일반 대화</li><li><strong>Temperature=0.7~1.0:</strong> 창작 글쓰기, 브레인스토밍, 시 쓰기</li></ul>
        </ToggleSection>
      </section>

      <section id="gen-ai-types">
        <h2>생성형 AI 유형</h2>
        <table className="info-table"><thead><tr><th>유형</th><th>모델/기술</th><th>사용 사례</th></tr></thead><tbody>
          <tr><td><strong>텍스트 생성</strong></td><td>LLM (GPT, Claude, Titan)</td><td>대화, 요약, 번역, 코드 생성</td></tr>
          <tr><td><strong>이미지 생성</strong></td><td>Diffusion, GAN, VAE</td><td>이미지 생성/편집, 스타일 변환</td></tr>
          <tr><td><strong>코드 생성</strong></td><td>Code LLM</td><td>코드 자동 완성, 코드 리뷰</td></tr>
          <tr><td><strong>음악/오디오</strong></td><td>MusicLM, AudioLM</td><td>음악 생성, 음성 합성</td></tr>
          <tr><td><strong>멀티모달</strong></td><td>GPT-4V, Claude 3</td><td>텍스트+이미지 입력 처리</td></tr>
        </tbody></table>
        <ToggleSection title="이미지 생성 모델 비교">
          <table className="info-table"><thead><tr><th>모델</th><th>원리</th></tr></thead><tbody>
            <tr><td><strong>GAN</strong></td><td>생성자와 판별자가 경쟁하며 학습</td></tr>
            <tr><td><strong>VAE</strong></td><td>잠재 공간(Latent Space)에서 샘플링하여 생성</td></tr>
            <tr><td><strong>Diffusion</strong></td><td>노이즈에서 점진적으로 이미지 복원 (denoising)</td></tr>
          </tbody></table>
        </ToggleSection>
      </section>

      <section id="tokens-embeddings">
        <h2>토큰과 임베딩</h2>
        <h3>토큰 (Token)</h3>
        <p>LLM이 텍스트를 처리하는 기본 단위입니다. 영어는 약 4글자 = 1토큰, 한국어는 1~2글자 = 1토큰입니다.</p>
        <ul><li>입력과 출력 토큰 수에 따라 비용 결정</li><li>컨텍스트 윈도우 = 한 번에 처리 가능한 최대 토큰 수</li></ul>
        <h3>임베딩 (Embedding)</h3>
        <p>텍스트를 고차원 수치 벡터로 변환합니다. 의미적으로 유사한 텍스트는 벡터 공간에서 가까이 위치합니다.</p>
        <ul><li><strong>Amazon Titan Embeddings:</strong> 텍스트를 벡터로 변환하는 임베딩 모델</li><li><strong>RAG의 핵심:</strong> 문서를 임베딩 → 벡터 DB 저장 → 질문과 유사 문서 검색</li></ul>
        <TipBox type="important"><p><strong>Hallucination(환각)</strong>: FM이 그럴듯하지만 사실이 아닌 정보를 생성하는 현상. RAG, Guardrails 등으로 완화합니다.</p></TipBox>
      </section>

      <section id="quiz">
        <h2>도장깨기 퀴즈</h2>
        <Quiz categoryId="gen-ai-basics" categoryTitle="생성형 AI 기초" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
