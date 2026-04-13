import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz from '../components/Quiz'
import SectionStatusBar from '../components/SectionStatusBar'
import { getQuestionsByCategory } from '../data/quizData'

const sections = [
  { id: 'improvement', title: 'FM 성능 개선 방법' },
  { id: 'rag', title: 'RAG (검색 증강 생성)' },
  { id: 'fine-tuning', title: 'Fine-tuning' },
  { id: 'evaluation', title: '평가 메트릭' },
  { id: 'quiz', title: '도장깨기 퀴즈' },
]

const quizQuestions = getQuestionsByCategory('fm-evaluation')

export default function FmEvaluation() {
  const { markStudied } = useProgress()
  useEffect(() => { markStudied('fm-evaluation') }, [markStudied])

  return (
    <GuideLayout title="FM 성능 평가 방법" description="RAG, Fine-tuning, 평가 메트릭을 학습합니다." icon="📊" badges={[{ label: '출제비율 21.3%', type: 'primary' }, { label: '61문제', type: 'info' }]} sections={sections} categoryId="fm-evaluation">

      <section id="improvement">
        <h2>FM 성능 개선 방법</h2>
        <table className="info-table"><thead><tr><th>방법</th><th>모델 수정</th><th>비용</th><th>속도</th><th>적합한 경우</th></tr></thead><tbody>
          <tr><td><strong>프롬프트 엔지니어링</strong></td><td>X</td><td>낮음</td><td>즉시</td><td>빠른 개선, 형식/스타일 조정</td></tr>
          <tr><td><strong>RAG</strong></td><td>X</td><td>중간</td><td>빠름</td><td>최신/도메인 지식 필요</td></tr>
          <tr><td><strong>Fine-tuning</strong></td><td>O</td><td>높음</td><td>느림</td><td>특정 도메인/스타일 학습</td></tr>
          <tr><td><strong>RLHF</strong></td><td>O</td><td>매우 높음</td><td>느림</td><td>인간 선호도 정렬</td></tr>
          <tr><td><strong>지속적 사전학습</strong></td><td>O</td><td>매우 높음</td><td>매우 느림</td><td>새로운 도메인 지식 습득</td></tr>
        </tbody></table>
        <TipBox type="important"><p>비용/시간 효율: <strong>프롬프트 &gt; RAG &gt; Fine-tuning &gt; RLHF &gt; 사전학습</strong> 순으로 시도하세요.</p></TipBox>
        <SectionStatusBar categoryId="fm-evaluation" sectionId="improvement" />
      </section>

      <section id="rag">
        <h2>RAG (검색 증강 생성)</h2>
        <p>RAG는 FM에 외부 지식을 제공하여 할루시네이션을 줄이고 최신 정보를 반영합니다.</p>
        <h3>RAG 파이프라인</h3>
        <ol><li><strong>문서 수집:</strong> 지식 문서를 수집</li><li><strong>청킹 (Chunking):</strong> 문서를 적절한 크기로 분할</li><li><strong>임베딩:</strong> 각 청크를 벡터로 변환</li><li><strong>벡터 DB 저장:</strong> 벡터를 데이터베이스에 저장</li><li><strong>검색:</strong> 질문을 벡터화 → 유사 문서 검색</li><li><strong>생성:</strong> 검색된 문서 + 질문을 FM에 전달 → 응답</li></ol>
        <ToggleSection title="RAG 장점 vs 한계">
          <table className="info-table"><thead><tr><th>장점</th><th>한계</th></tr></thead><tbody>
            <tr><td>모델 재학습 불필요</td><td>검색 품질에 의존</td></tr>
            <tr><td>최신 정보 반영 가능</td><td>청킹 전략이 성능에 영향</td></tr>
            <tr><td>출처 추적 가능</td><td>컨텍스트 윈도우 제한</td></tr>
            <tr><td>할루시네이션 감소</td><td>추가 인프라(벡터 DB) 필요</td></tr>
          </tbody></table>
        </ToggleSection>
        <TipBox type="info"><p><strong>Bedrock Knowledge Bases</strong>로 RAG를 쉽게 구현할 수 있습니다. S3의 문서를 자동 임베딩하고 OpenSearch Serverless에 저장합니다.</p></TipBox>
        <SectionStatusBar categoryId="fm-evaluation" sectionId="rag" />
      </section>

      <section id="fine-tuning">
        <h2>Fine-tuning</h2>
        <p>사전 학습된 FM의 가중치를 도메인 특화 데이터로 추가 학습하는 방법입니다.</p>
        <table className="info-table"><thead><tr><th>Fine-tuning 유형</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>Full Fine-tuning</strong></td><td>모든 파라미터 업데이트 (높은 비용/효과)</td></tr>
          <tr><td><strong>LoRA / QLoRA</strong></td><td>일부 파라미터만 효율적으로 업데이트 (PEFT)</td></tr>
          <tr><td><strong>Instruction Tuning</strong></td><td>지시-응답 쌍으로 지시 따르기 능력 향상</td></tr>
        </tbody></table>
        <ToggleSection title="RLHF (인간 피드백 강화 학습)">
          <ol><li>FM으로 여러 응답 생성</li><li>인간 평가자가 응답 순위 매김</li><li>보상 모델(Reward Model) 학습</li><li>강화 학습으로 FM 정렬(PPO 등)</li></ol>
          <p>ChatGPT, Claude 등이 RLHF로 인간 선호도에 맞게 정렬되었습니다.</p>
        </ToggleSection>
        <SectionStatusBar categoryId="fm-evaluation" sectionId="fine-tuning" />
      </section>

      <section id="evaluation">
        <h2>평가 메트릭</h2>
        <h3>자동 평가 메트릭</h3>
        <table className="info-table"><thead><tr><th>메트릭</th><th>대상</th><th>측정 방식</th></tr></thead><tbody>
          <tr><td><strong>BLEU</strong></td><td>번역</td><td>생성/참조 텍스트의 n-gram 정밀도</td></tr>
          <tr><td><strong>ROUGE</strong></td><td>요약</td><td>생성/참조 텍스트의 n-gram 재현율</td></tr>
          <tr><td><strong>BERTScore</strong></td><td>범용</td><td>BERT 임베딩 기반 의미적 유사성</td></tr>
          <tr><td><strong>Perplexity</strong></td><td>언어 모델</td><td>다음 토큰 예측 능력 (낮을수록 좋음)</td></tr>
          <tr><td><strong>METEOR</strong></td><td>번역</td><td>동의어, 어간 일치 고려한 유사도</td></tr>
        </tbody></table>
        <TipBox type="warning"><p><strong>BLEU = Precision 기반</strong>, <strong>ROUGE = Recall 기반</strong>으로 구분하세요. BLEU는 번역, ROUGE는 요약 평가에 주로 사용됩니다.</p></TipBox>
        <h3>인간 평가</h3>
        <ul><li><strong>유창성 (Fluency):</strong> 자연스러운 문장인가</li><li><strong>관련성 (Relevance):</strong> 질문에 적합한 답변인가</li><li><strong>정확성 (Accuracy):</strong> 사실에 부합하는가</li><li><strong>유용성 (Helpfulness):</strong> 실제로 도움이 되는가</li><li><strong>안전성 (Safety):</strong> 유해하거나 편향되지 않은가</li></ul>
        <SectionStatusBar categoryId="fm-evaluation" sectionId="evaluation" />
      </section>

      <section id="quiz">
        <h2>도장깨기 퀴즈</h2>
        <Quiz categoryId="fm-evaluation" categoryTitle="FM 성능 평가 방법" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
