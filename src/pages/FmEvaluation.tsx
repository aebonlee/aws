import { useEffect } from 'react'
import { useProgress } from '../contexts/ProgressContext'
import GuideLayout from '../components/GuideLayout'
import TipBox from '../components/TipBox'
import ToggleSection from '../components/ToggleSection'
import Quiz, { QuizQuestion } from '../components/Quiz'

const sections = [
  { id: 'improvement', title: 'FM 성능 개선 방법' },
  { id: 'rag', title: 'RAG (검색 증강 생성)' },
  { id: 'fine-tuning', title: 'Fine-tuning' },
  { id: 'evaluation', title: '평가 메트릭' },
  { id: 'quiz', title: '도장깨기 퀴즈' },
]

const quizQuestions: QuizQuestion[] = [
  { question: 'RAG의 핵심 목적은?', options: ['모델 파라미터 수정', '외부 지식으로 FM 응답 품질 향상', '모델 크기 축소', '학습 속도 향상'], answer: 1, explanation: 'RAG는 질문과 관련된 외부 문서를 검색하여 FM에 컨텍스트로 제공, 더 정확한 응답을 생성합니다.' },
  { question: 'Fine-tuning과 RAG의 차이는?', options: ['동일한 기법이다', 'Fine-tuning은 모델 가중치 수정, RAG는 외부 지식 참조', 'RAG가 항상 더 좋다', 'Fine-tuning은 프롬프트만 수정'], answer: 1, explanation: 'Fine-tuning은 모델 가중치를 직접 업데이트하고, RAG는 모델을 수정하지 않고 외부 지식을 활용합니다.' },
  { question: 'BLEU 스코어가 측정하는 것은?', options: ['생성 텍스트의 감성', '생성 텍스트와 참조 텍스트의 n-gram 유사도', '모델 학습 속도', '토큰 수'], answer: 1, explanation: 'BLEU는 기계 번역 품질을 평가하며, 생성 텍스트와 참조 텍스트 간 n-gram 일치 비율을 측정합니다.' },
  { question: 'ROUGE가 주로 평가하는 작업은?', options: ['이미지 분류', '텍스트 요약', '음성 인식', '객체 감지'], answer: 1, explanation: 'ROUGE는 텍스트 요약 품질을 평가하며, 참조 요약과 생성 요약 간 n-gram 재현율을 측정합니다.' },
  { question: 'RLHF의 의미는?', options: ['규칙 기반 강화 학습', '인간 피드백 기반 강화 학습', '자동 하이퍼파라미터 튜닝', '데이터 증강 기법'], answer: 1, explanation: 'RLHF(Reinforcement Learning from Human Feedback)는 인간의 선호도 피드백으로 FM을 정렬(align)합니다.' },
  { question: 'RAG 파이프라인의 올바른 순서는?', options: ['질문→검색→생성', '생성→검색→질문', '학습→검색→배포', '검색→학습→생성'], answer: 0, explanation: 'RAG: 질문 입력 → 벡터 DB에서 관련 문서 검색 → 검색된 문서와 질문을 FM에 전달 → 응답 생성.' },
  { question: 'BERTScore의 특징은?', options: ['단어 빈도 기반 비교', 'BERT 임베딩으로 의미적 유사성 평가', 'n-gram 일치만 측정', '문법 오류 감지'], answer: 1, explanation: 'BERTScore는 BERT 임베딩을 활용하여 생성/참조 텍스트의 의미적 유사성을 측정합니다.' },
  { question: 'FM 성능 개선 시 모델 수정 없이 가장 빠른 방법은?', options: ['Fine-tuning', '프롬프트 엔지니어링', 'RLHF', '사전 학습'], answer: 1, explanation: '프롬프트 엔지니어링은 모델을 수정하지 않고 입력만 최적화하여 빠르게 성능을 개선할 수 있습니다.' },
  { question: 'Perplexity가 낮을수록 의미하는 것은?', options: ['모델이 더 혼란스러움', '모델의 예측 성능이 더 좋음', '학습 데이터가 부족', '과적합 발생'], answer: 1, explanation: 'Perplexity가 낮을수록 모델이 다음 토큰을 잘 예측한다는 의미로, 언어 모델 성능이 좋습니다.' },
  { question: '인간 평가(Human Evaluation)가 필요한 이유는?', options: ['자동 메트릭이 존재하지 않아서', '유창성, 유용성 등 주관적 품질은 자동 메트릭으로 완전히 측정 불가', '비용이 저렴해서', '항상 자동 메트릭보다 빠르므로'], answer: 1, explanation: '자동 메트릭은 표면적 유사도만 측정하며, 응답의 유용성, 정확성, 안전성 등은 인간 평가가 필요합니다.' },
]

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
      </section>

      <section id="quiz">
        <h2>도장깨기 퀴즈</h2>
        <Quiz categoryId="fm-evaluation" categoryTitle="FM 성능 평가 방법" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
