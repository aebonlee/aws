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
  { id: 'customization', title: 'FM 커스터마이징' },
  { id: 'alignment', title: 'FM 정렬 (Alignment)' },
  { id: 'utilization', title: 'FM 활용 (학습 없이)' },
  { id: 'rag', title: 'RAG (검색 증강 생성)' },
  { id: 'vector-search', title: '벡터 검색 (Vector Search)' },
  { id: 'evaluation-methods', title: 'FM 평가 방법론' },
  { id: 'evaluation-metrics', title: '평가 메트릭 및 벤치마크' },
  { id: 'advanced-evaluation', title: '고급 평가 방법론' },
  { id: 'situational', title: '상황별 대응 방법' },
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
        <TipBox type="info"><p>AI 모델의 성능을 향상시키는 방법은 크게 세 가지로 분류됩니다: <strong>FM 커스터마이징</strong>(모델 직접 수정), <strong>FM 정렬</strong>(행동 정렬), <strong>FM 활용</strong>(모델 수정 없이 활용). 비용/시간 효율 순서로 시도하는 것이 중요합니다.</p></TipBox>
        <table className="info-table"><thead><tr><th>분류</th><th>방법</th><th>모델 수정</th><th>비용</th><th>속도</th><th>적합한 경우</th></tr></thead><tbody>
          <tr><td><strong>FM 활용</strong></td><td><strong>프롬프트 엔지니어링</strong></td><td>X</td><td>낮음</td><td>즉시</td><td>빠른 개선, 형식/스타일 조정</td></tr>
          <tr><td><strong>FM 활용</strong></td><td><strong>In-context Learning</strong></td><td>X</td><td>낮음</td><td>즉시</td><td>예시 기반 패턴 학습</td></tr>
          <tr><td><strong>FM 활용</strong></td><td><strong>RAG</strong> <span className="badge badge-exam">&#11088; 시험 빈출</span></td><td>X</td><td>중간</td><td>빠름</td><td>최신/도메인 지식 필요</td></tr>
          <tr><td><strong>FM 활용</strong></td><td><strong>MCP</strong></td><td>X</td><td>중간</td><td>빠름</td><td>외부 서비스 연결</td></tr>
          <tr><td><strong>FM 커스터마이징</strong></td><td><strong>Fine-tuning</strong> <span className="badge badge-exam">&#11088; 시험 빈출</span></td><td>O</td><td>높음</td><td>느림</td><td>특정 도메인/스타일 학습</td></tr>
          <tr><td><strong>FM 커스터마이징</strong></td><td><strong>Distillation (모델 증류)</strong></td><td>O</td><td>높음</td><td>느림</td><td>모델 경량화</td></tr>
          <tr><td><strong>FM 커스터마이징</strong></td><td><strong>지속적 사전학습</strong> <span className="badge badge-exam">&#11088; 시험 빈출</span></td><td>O</td><td>매우 높음</td><td>매우 느림</td><td>새로운 도메인 지식 습득</td></tr>
          <tr><td><strong>FM 정렬</strong></td><td><strong>RLHF</strong></td><td>O</td><td>매우 높음</td><td>느림</td><td>인간 선호도 정렬</td></tr>
        </tbody></table>
        <TipBox type="important"><p>비용/시간 효율: <strong>프롬프트 &gt; In-context Learning &gt; RAG &gt; Fine-tuning &gt; Distillation &gt; RLHF &gt; 지속적 사전학습</strong> 순으로 시도하세요. 최소 노력 순서 문제가 자주 출제됩니다.</p></TipBox>
        <SectionStatusBar categoryId="fm-evaluation" sectionId="improvement" />
      </section>

      <section id="customization">
        <h2>FM 커스터마이징 <span className="badge badge-exam">&#11088; 시험 빈출</span></h2>
        <p>모델을 <strong>직접 수정</strong>하여 가중치를 조정하거나 새로운 데이터를 추가하는 방법입니다. 그 결과로 <strong>새로운 모델</strong>이 생성됩니다.</p>

        <h3>1. 지속적 사전 학습 (Continued Pre-training) <span className="badge badge-exam">&#11088; 시험 빈출</span></h3>
        <table className="info-table"><thead><tr><th>항목</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>데이터 유형</strong></td><td><strong>레이블 없는 데이터</strong>로 도메인 지식 학습 (Domain adaptation with unlabeled data)</td></tr>
          <tr><td><strong>목적</strong></td><td>일반 모델을 특정 분야(의료, 법률, 금융)에 적응</td></tr>
          <tr><td><strong>비용</strong></td><td>가장 비싼 방법</td></tr>
          <tr><td><strong>특징</strong></td><td>지속적인 사전 학습(ongoing pre-training)을 통해 시간이 지날수록 모델의 성능이 향상됨</td></tr>
        </tbody></table>
        <TipBox type="warning"><p><strong>핵심 구분:</strong> 지속적 사전학습은 <strong>레이블 없는 데이터</strong>를 사용합니다. 레이블된 데이터를 사용하면 Fine-tuning입니다. 이 구분이 자주 출제됩니다.</p></TipBox>

        <h3>2. Fine-tuning (미세 조정) <span className="badge badge-exam">&#11088; 시험 빈출</span></h3>
        <table className="info-table"><thead><tr><th>항목</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>데이터 유형</strong></td><td><strong>레이블이 지정된 데이터</strong>로 특정 작업 학습</td></tr>
          <tr><td><strong>비용</strong></td><td>모델 커스터마이징 방법 중 비교적 비용 효율적</td></tr>
          <tr><td><strong>Instruction-based</strong></td><td>프롬프트-응답 쌍(pair)을 통해 추가 학습. 질문과 답변 쌍을 생성하여 준비</td></tr>
          <tr><td><strong>Domain adaptation</strong></td><td>레이블된 데이터로 도메인 특화 학습(도메인 지식, 용어 등)</td></tr>
          <tr><td><strong>Bedrock 형식</strong></td><td>JSONL 형식의 prompt-completion 쌍 데이터 필요</td></tr>
        </tbody></table>
        <table className="info-table"><thead><tr><th>Fine-tuning 세부 유형</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>Full Fine-tuning</strong></td><td>모든 파라미터 업데이트 (높은 비용/효과)</td></tr>
          <tr><td><strong>LoRA / QLoRA</strong></td><td>일부 파라미터만 효율적으로 업데이트 (PEFT)</td></tr>
          <tr><td><strong>Instruction Tuning</strong></td><td>지시-응답 쌍으로 지시 따르기 능력 향상</td></tr>
        </tbody></table>

        <h3>3. Distillation (모델 증류)</h3>
        <table className="info-table"><thead><tr><th>항목</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>개념</strong></td><td>더 크고 성능이 좋은 <strong>교사(teacher) 모델</strong>의 지식을 더 작은 <strong>학생(student) 모델</strong>로 전달하는 기법</td></tr>
          <tr><td><strong>원리</strong></td><td>학생 모델이 교사 모델의 출력 패턴을 학습하여, 적은 파라미터로도 유사한 성능을 달성</td></tr>
          <tr><td><strong>특징</strong></td><td>교사 모델이 레이블을 만들어주는 Fine-tuning 방식</td></tr>
          <tr><td><strong>장점</strong></td><td>교사 모델 대비 추론 비용 절감 및 지연 시간 단축</td></tr>
        </tbody></table>
        <TipBox type="info"><p><strong>Distillation 핵심:</strong> "더 크고 지능적인 모델에서 더 작은 모델로 지식을 전달" - 이 정의를 기억하세요.</p></TipBox>

        <SectionStatusBar categoryId="fm-evaluation" sectionId="customization" />
      </section>

      <section id="alignment">
        <h2>FM 정렬 (Alignment)</h2>
        <p>모델의 행동을 인간의 가치와 선호에 맞게 조정합니다. 성능 향상이 아닌 <strong>행동 정렬</strong>이 목적입니다.</p>

        <h3>RLHF (Reinforcement Learning from Human Feedback)</h3>
        <table className="info-table"><thead><tr><th>항목</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>원리</strong></td><td>숙련된 인간 평가자의 <strong>선호도 피드백을 보상 신호로</strong> 활용하여 모델 행동을 최적화</td></tr>
          <tr><td><strong>목적</strong></td><td>새로운 지식을 가르치는 것이 아니라, 이미 아는 것을 <strong>어떻게 표현할지를 조정</strong></td></tr>
          <tr><td><strong>활용</strong></td><td>회사의 가치, 윤리, 톤앤매너에 맞게 모델을 정렬(alignment)</td></tr>
          <tr><td><strong>적응성</strong></td><td>새로운 트렌드나 새로운 유형의 문제에 <strong>지속적으로 적응</strong> 가능</td></tr>
        </tbody></table>
        <ToggleSection title="RLHF 프로세스 및 활용 사례">
          <ol><li>FM으로 여러 응답 생성</li><li>인간 평가자가 응답 순위 매김</li><li>보상 모델(Reward Model) 학습</li><li>강화 학습으로 FM 정렬(PPO 등)</li></ol>
          <p><strong>활용 사례:</strong></p>
          <ul>
            <li><strong>콘텐츠 조정(Content Moderation):</strong> 회사 정책에 맞는 콘텐츠 필터링</li>
            <li><strong>챗봇 톤 조정:</strong> 긍정적 고객 피드백에 보상을 제공하여 응대 품질 향상</li>
          </ul>
          <p>ChatGPT, Claude 등이 RLHF로 인간 선호도에 맞게 정렬되었습니다.</p>
        </ToggleSection>
        <SectionStatusBar categoryId="fm-evaluation" sectionId="alignment" />
      </section>

      <section id="utilization">
        <h2>FM 활용 (학습 없이)</h2>
        <p>모델 자체는 변하지 않습니다. <strong>학습 X, 튜닝 X</strong> - 입력 방식만으로 성능을 개선합니다.</p>

        <h3>1. In-context Learning <span className="badge badge-exam">&#11088; 시험 빈출</span></h3>
        <table className="info-table"><thead><tr><th>항목</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>방식</strong></td><td>프롬프트 내 구체적 예시 제공 (few-shot learning)</td></tr>
          <tr><td><strong>특징</strong></td><td>문제와 정답의 여러 쌍을 제공하여 패턴 학습 유도</td></tr>
          <tr><td><strong>장점</strong></td><td><strong>최소한의 구현 노력</strong>으로 가능</td></tr>
        </tbody></table>

        <h3>2. Prompt-based Learning</h3>
        <table className="info-table"><thead><tr><th>항목</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>방식</strong></td><td>프롬프트 엔지니어링으로 원하는 결과 유도</td></tr>
          <tr><td><strong>특징</strong></td><td>명령어, 지시사항 중심. 모델 수정(학습) 없이 입력 형식만 조정</td></tr>
          <tr><td><strong>장점</strong></td><td><strong>최소한의 구현 노력</strong>으로 가능</td></tr>
        </tbody></table>

        <h3>3. MCP (Model Context Protocol)</h3>
        <table className="info-table"><thead><tr><th>항목</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>개념</strong></td><td>FM이 <strong>외부 데이터 소스 및 서비스에 표준화된 방식으로 연결</strong>할 수 있게 하는 <strong>개방형 표준(open standard)</strong></td></tr>
          <tr><td><strong>장점</strong></td><td>각 외부 서비스마다 독자적인 API 통합을 구축할 필요 없이, MCP를 통해 통합 연결</td></tr>
          <tr><td><strong>효과</strong></td><td>모델이 정보에 기반한 의사결정에 필요한 추가 컨텍스트를 확보</td></tr>
          <tr><td><strong>예시</strong></td><td>여행 예약 에이전트가 항공사 API, 호텔 예약 시스템 등 외부 서비스에 MCP로 연결</td></tr>
        </tbody></table>

        <SectionStatusBar categoryId="fm-evaluation" sectionId="utilization" />
      </section>

      <section id="rag">
        <h2>RAG (검색 증강 생성) <span style={{color: '#e74c3c', fontWeight: 'bold'}}>&#11088; 시험 최빈출</span></h2>
        <p>RAG는 FM에 외부 지식을 제공하여 할루시네이션을 줄이고 최신 정보를 반영합니다. 모델 자체를 수정하지 않고 외부 지식/문서를 검색하여 모델 응답에 통합하는 기법입니다.</p>

        <h3>RAG 파이프라인</h3>
        <p>RAG 파이프라인은 <strong>데이터 준비(오프라인)</strong>와 <strong>검색 및 생성(실시간)</strong> 두 단계로 구성됩니다.</p>

        <h4>데이터 준비 단계 (오프라인 배치 처리) <span className="badge badge-exam">&#11088; 시험 빈출</span></h4>
        <ol>
          <li><strong>문서 수집:</strong> 지식 문서를 수집</li>
          <li><strong>청킹 (Chunking):</strong> 원본 문서를 의미 있는 작은 단위(chunk)로 분할. 검색 시 질문과 <strong>관련성 높은 컨텍스트(contextual relevancy)를 정확히</strong> 찾아내기 위한 과정</li>
          <li><strong>임베딩 및 인덱싱:</strong> 분할된 각 청크를 <strong>벡터로 변환(임베딩 생성)</strong>하고, 검색 가능한 <strong>벡터 인덱스에 저장(서치 인덱스 구축)</strong>. 새 콘텐츠가 추가될 때마다 주기적으로 실행</li>
        </ol>

        <h4>검색 및 생성 단계 (실시간 처리)</h4>
        <ol>
          <li><strong>쿼리 임베딩:</strong> 사용자 질문이 들어오면 이를 <strong>임베딩</strong>으로 변환</li>
          <li><strong>검색 (Retrieval):</strong> 인덱스에서 <strong>관련성 높은 청크를 검색</strong></li>
          <li><strong>생성 (Generation):</strong> 검색된 청크와 사용자 질문을 함께 LLM에 전달해 최종 <strong>답변을 생성</strong></li>
        </ol>

        <TipBox type="important"><p><strong>오프라인 배치 처리 vs 실시간 처리 구분이 자주 출제됩니다:</strong> 콘텐츠 임베딩 생성, 검색 인덱스 생성은 <strong>오프라인 배치</strong>. 쿼리 임베딩, 검색, 응답 생성은 <strong>실시간</strong>.</p></TipBox>

        <ToggleSection title="RAG 장점 vs 한계">
          <table className="info-table"><thead><tr><th>장점</th><th>한계</th></tr></thead><tbody>
            <tr><td>모델 재학습 불필요</td><td>검색 품질에 의존</td></tr>
            <tr><td>최신 정보 반영 가능</td><td>청킹 전략이 성능에 영향</td></tr>
            <tr><td>출처 추적 가능 (응답에 참조 링크 포함하여 신뢰도 향상)</td><td>컨텍스트 윈도우 제한</td></tr>
            <tr><td>할루시네이션 감소</td><td>추가 인프라(벡터 DB) 필요</td></tr>
          </tbody></table>
        </ToggleSection>

        <TipBox type="info"><p><strong>Bedrock Knowledge Bases</strong>로 RAG를 쉽게 구현할 수 있습니다. S3의 문서를 자동 임베딩하고 OpenSearch Serverless에 저장합니다. 회사의 내부 데이터 소스에서 가져온 관련 데이터를 사용하여 FM 모델을 보완하려면 <strong>Amazon Bedrock 지식 베이스를 생성</strong>하세요.</p></TipBox>

        <ToggleSection title="임베딩(Embedding) 상세 설명">
          <p>임베딩은 고차원 데이터(텍스트, 이미지 등)를 고정 크기의 저차원 수치(예: 벡터)로 변환하는 기술입니다.</p>
          <ul>
            <li>임베딩된 데이터는 축소된 차원 공간의 수치로 표현되어 <strong>의미적 관계를 포착</strong>할 수 있습니다</li>
            <li>의미적으로 유사한 데이터는 근접한 공간에 위치하여 <strong>의미적 유사도 계산이 가능</strong></li>
            <li>텍스트를 수학적으로 비교할 수 있는 능력을 제공</li>
            <li>검색 애플리케이션이 텍스트와 이미지가 포함된 쿼리를 처리하려면 <strong>멀티모달 임베딩 모델</strong>을 사용</li>
          </ul>
        </ToggleSection>

        <SectionStatusBar categoryId="fm-evaluation" sectionId="rag" />
      </section>

      <section id="vector-search">
        <h2>벡터 검색 (Vector Search)</h2>
        <p>벡터 검색은 데이터의 의미를 이해하고 유사성을 기반으로 검색하는 시스템입니다. 전통적인 검색이 단순히 키워드를 매칭하는 것과 달리, 벡터 검색은 데이터에서 자동으로 의미를 추출하여 비슷한 항목을 찾아냅니다.</p>

        <ToggleSection title="벡터 검색 개발 프로세스">
          <ol>
            <li><strong>데이터 전처리:</strong> 데이터 수집, 정제, 변환 (이미지 배경 제거/크기 표준화, 텍스트 핵심 키워드 추출, 메타데이터 정규화)</li>
            <li><strong>벡터 변환:</strong> 정제된 데이터를 벡터로 변환 (이미지의 시각적 특징과 텍스트를 숫자 배열로 변환하고 결합)</li>
            <li><strong>유사도 검색:</strong> 벡터 간의 거리를 계산하여 가장 유사한 항목 추천</li>
            <li><strong>시스템 개선:</strong> 클릭률, 구매 전환율, 사용자 피드백 등을 분석하여 지속적 개선</li>
          </ol>
        </ToggleSection>

        <h3>AWS 벡터 스토어 서비스</h3>
        <table className="info-table"><thead><tr><th>서비스</th><th>특징</th><th>적합한 사용 사례</th></tr></thead><tbody>
          <tr><td><strong>Amazon DocumentDB</strong></td><td>대규모 문서형 데이터 저장/검색 특화</td><td>콘텐츠 관리 시스템 (블로그, 제품 설명서, 고객 리뷰)</td></tr>
          <tr><td><strong>Amazon OpenSearch Service</strong> <span style={{color: '#e74c3c', fontWeight: 'bold'}}>&#11088;</span></td><td>실시간 검색과 분석, k-NN 벡터 DB 기능 지원</td><td>전자상거래 상품 검색, 대규모 로그 분석, 시맨틱 검색</td></tr>
          <tr><td><strong>Amazon RDS for PostgreSQL</strong> <span style={{color: '#e74c3c', fontWeight: 'bold'}}>&#11088;</span></td><td>pgvector 확장으로 벡터 검색 기능 추가</td><td>사용자 프로필 기반 추천 시스템</td></tr>
          <tr><td><strong>Amazon Aurora PostgreSQL</strong></td><td>고성능 관계형 DB + 벡터 검색</td><td>금융 거래 패턴 분석, 이상 거래 탐지</td></tr>
        </tbody></table>

        <SectionStatusBar categoryId="fm-evaluation" sectionId="vector-search" />
      </section>

      <section id="evaluation-methods">
        <h2>FM 평가 방법론 <span className="badge badge-exam">&#11088; 시험 빈출</span></h2>
        <p>LLM을 평가하는 방법은 크게 <strong>인간 평가</strong>와 <strong>자동 평가</strong>로 나뉩니다.</p>

        <h3>인간 평가 (Human Evaluation) <span className="badge badge-exam">&#11088; 시험 빈출</span></h3>
        <table className="info-table"><thead><tr><th>항목</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>방식</strong></td><td>사람이 직접 모델이 생성한 응답을 보고 평가</td></tr>
          <tr><td><strong>평가 항목</strong></td><td>유창성(Fluency), 정확성(Accuracy), 관련성(Relevance), 공정성, 유용성(Helpfulness), 안전성(Safety)</td></tr>
          <tr><td><strong>중요성</strong></td><td>LLM/FM 평가에서 <strong>가장 중요한 방식</strong>. 최종적으로는 사람이 선호하는 모델을 선택해야 함</td></tr>
          <tr><td><strong>단점</strong></td><td>평가자마다 일관성 부족, 비용이 많이 듦, 자동화 어려움</td></tr>
        </tbody></table>
        <TipBox type="warning"><p><strong>인간 평가가 필수인 영역:</strong> 창의적 표현 평가, 맥락 이해력 평가, 윤리성 및 공정성 평가. 자동 평가로는 이런 부분을 완전히 반영할 수 없습니다. "직원이 선호하는 스타일" 관련 문제에서 답은 <strong>인력과 맞춤형 프롬프트 데이터셋</strong>입니다.</p></TipBox>

        <h3>자동 평가 (Automated Evaluation)</h3>
        <table className="info-table"><thead><tr><th>항목</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>방식</strong></td><td>알고리즘을 사용하여 모델의 성능을 자동으로 측정</td></tr>
          <tr><td><strong>장점</strong></td><td>빠르고 일관된 비교 가능, 수치화된 결과</td></tr>
          <tr><td><strong>단점</strong></td><td>실제 인간 만족도와 차이가 있을 수 있음</td></tr>
          <tr><td><strong>대표 지표</strong></td><td>BLEU, ROUGE, Perplexity, BERTScore, F1 Score</td></tr>
        </tbody></table>

        <ToggleSection title="FM 평가의 단계별 프로세스">
          <ol>
            <li><strong>1단계: 기본 자동 평가</strong> - BLEU, ROUGE, Perplexity 등 지표에서 높은 점수를 받는지 확인. 낮은 점수면 기본적 문제(문법 오류, 문맥 파악 실패) 분석</li>
            <li><strong>2단계: 인간 평가단 샘플링 평가</strong> - 커스텀 프롬프트 데이터셋을 활용. 실제 사용자가 원하는 응답 스타일, 창의성, 공정성, 논리적 정합성 점검</li>
            <li><strong>3단계: 종합 평가 및 모델 선택</strong> - 사전 정의된 벤치마크 데이터셋으로 정확도 측정. 자동 평가 + 인간 평가를 종합하여 최적 모델 선택</li>
            <li><strong>4단계: 지속적 개선</strong> - 실제 사용자 피드백 수집, 필요시 Fine-tuning 수행</li>
          </ol>
          <TipBox type="info"><p>자동 평가 점수가 낮아도 인간 평가가 높으면 = 창의적 응답 가능성. 자동 평가 높지만 인간 평가 낮으면 = 기계적이고 사용자 비친화적일 가능성.</p></TipBox>
        </ToggleSection>

        <SectionStatusBar categoryId="fm-evaluation" sectionId="evaluation-methods" />
      </section>

      <section id="evaluation-metrics">
        <h2>평가 메트릭 및 벤치마크 <span className="badge badge-exam">&#11088; 시험 빈출</span></h2>

        <h3>자동 평가 메트릭</h3>
        <table className="info-table"><thead><tr><th>메트릭</th><th>대상</th><th>측정 방식</th><th>핵심 포인트</th></tr></thead><tbody>
          <tr><td><strong>BLEU</strong> <span style={{color: '#e74c3c', fontWeight: 'bold'}}>&#11088;</span></td><td>번역 + 요약</td><td>n-gram <strong>정확 매칭. 정밀도(Precision) 중심</strong></td><td><strong>B</strong>y the book - 참조 텍스트 기준으로 얼마나 정확한가</td></tr>
          <tr><td><strong>ROUGE</strong> <span style={{color: '#e74c3c', fontWeight: 'bold'}}>&#11088;</span></td><td>요약 + 번역</td><td>n-gram <strong>중첩 측정. 재현율(Recall) 중심</strong></td><td>참조 텍스트의 내용을 얼마나 포함했나</td></tr>
          <tr><td><strong>BERTScore</strong> <span style={{color: '#e74c3c', fontWeight: 'bold'}}>&#11088;</span></td><td>범용 (의미적 유사성)</td><td>BERT 임베딩 <strong>코사인 유사도</strong> 측정</td><td>창의적 표현(축약어, 비표준 철자)도 의미 기반 평가 가능</td></tr>
          <tr><td><strong>F1 Score</strong> <span style={{color: '#e74c3c', fontWeight: 'bold'}}>&#11088;</span></td><td>분류, QA</td><td>정밀도(Precision)와 재현율(Recall)의 <strong>조합(균형)</strong></td><td>정확한 토큰 매칭 기반. 불균형 데이터셋에서도 균형잡힌 평가</td></tr>
          <tr><td><strong>Perplexity</strong></td><td>언어 모델</td><td>다음 토큰 예측 능력</td><td>낮을수록 좋음. 주어진 단어 시퀀스 생성 확률 측정</td></tr>
          <tr><td><strong>METEOR</strong></td><td>번역</td><td>동의어, 어간 일치 고려한 유사도</td><td>BLEU보다 유연한 매칭</td></tr>
        </tbody></table>

        <TipBox type="important"><p><strong>BLEU = Precision(정밀도) 기반</strong>, <strong>ROUGE = Recall(재현율) 기반</strong>으로 구분하세요. 번역 품질 → BLEU, 요약 품질 → ROUGE, 의미적 유사성/스타일 변형 → BERTScore, QA/분류 정확도 → F1 Score. 이 구분이 매우 자주 출제됩니다.</p></TipBox>

        <h3>벤치마크 데이터셋</h3>
        <table className="info-table"><thead><tr><th>벤치마크</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>GLUE</strong></td><td>텍스트 분류, 질의응답, 자연어 추론 등 일반적인 언어 이해 작업 평가를 위한 데이터셋 모음</td></tr>
          <tr><td><strong>SuperGLUE</strong></td><td>GLUE를 확장한 것으로, 더 도전적인 작업과 복합적 언어 이해에 초점</td></tr>
          <tr><td><strong>MMLU</strong></td><td>대규모 다중 작업 언어 이해. 의학, 수학, 역사, 법률, 윤리 등 <strong>57개 과목</strong>에서 추출한 문제로 구성된 벤치마크</td></tr>
          <tr><td><strong>BIG-bench</strong></td><td>현재 모델 능력을 넘어서는 작업 평가</td></tr>
          <tr><td><strong>HELM</strong></td><td>언어 모델의 전체론적 평가. 정확성, 견고성, 공정성, 편향성, 투명성, 효율성 등을 <strong>종합적으로</strong> 평가</td></tr>
          <tr><td><strong>SQuAD</strong></td><td>질의 응답 능력 평가용 데이터셋 (Stanford Question Answering Dataset)</td></tr>
          <tr><td><strong>WMT</strong></td><td>기계 번역 시스템 평가를 위한 데이터셋과 작업들 (Workshop on Machine Translation)</td></tr>
        </tbody></table>

        <TipBox type="info"><p><strong>벤치마크 데이터셋</strong>은 LLM을 포함한 AI 모델들의 성능을 평가하기 위해 특별히 설계된, <strong>미리 준비되고 정제된</strong> 데이터 모음입니다. 편견/차별 평가나 이미지 분류 정확도 평가에는 사전 정의된 벤치마크 데이터셋을 사용합니다.</p></TipBox>

        <SectionStatusBar categoryId="fm-evaluation" sectionId="evaluation-metrics" />
      </section>

      <section id="advanced-evaluation">
        <h2>고급 평가 방법론</h2>

        <h3>LLM-as-a-judge (LLM을 평가자로 사용) <span className="badge badge-exam">&#11088; 시험 빈출</span></h3>
        <p><strong>LLM 자체를 평가 도구로 활용</strong>하여 다른 모델이나 에이전트의 응답 품질을 자동으로 평가하는 방식입니다. 인간 평가보다 빠르고 비용이 적게 들며, 프로덕션 환경에서 대규모 자동 평가에 적합합니다.</p>

        <h4>Amazon Bedrock 기본 제공 평가 메트릭</h4>
        <table className="info-table"><thead><tr><th>메트릭</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>Completeness (완전성)</strong> <span style={{color: '#e74c3c', fontWeight: 'bold'}}>&#11088;</span></td><td>응답이 프롬프트의 <strong>모든 부분을 얼마나 철저하게</strong> 다루는지 평가</td></tr>
          <tr><td><strong>Following instructions (지침 준수)</strong></td><td>응답이 <strong>특정 지침이나 제약 조건을 준수</strong>하는지 평가</td></tr>
          <tr><td><strong>Refusal (거부)</strong></td><td>모델이 부적절한 프롬프트에 대해 <strong>적절하게 응답을 거부</strong>하는지 평가</td></tr>
        </tbody></table>

        <h3>A/B 테스트 <span className="badge badge-exam">&#11088; 시험 빈출</span></h3>
        <table className="info-table"><thead><tr><th>항목</th><th>설명</th></tr></thead><tbody>
          <tr><td><strong>방식</strong></td><td>통제된 환경에서 <strong>실제 사용자</strong>에게 두 가지 이상의 모델 변형(A, B)을 노출시키고 결과를 비교</td></tr>
          <tr><td><strong>핵심</strong></td><td><strong>실제 애플리케이션 성능</strong>을 가장 직접적으로 측정할 수 있는 전략</td></tr>
          <tr><td><strong>인간 평가와의 차이</strong></td><td>A/B 테스트는 실제 사용자의 <strong>행동 데이터</strong>(클릭률, 전환율 등)를 기반으로 평가. 인간 평가는 전문가의 품질 판단</td></tr>
        </tbody></table>

        <h3>FM 평가 방법 종합 비교</h3>
        <table className="info-table"><thead><tr><th>평가 방법</th><th>평가 주체</th><th>측정 대상</th><th>적합 상황</th></tr></thead><tbody>
          <tr><td><strong>자동 평가</strong> (BLEU, ROUGE 등)</td><td>알고리즘</td><td>텍스트 품질</td><td>빠른 모델 비교</td></tr>
          <tr><td><strong>인간 평가</strong></td><td>전문가</td><td>응답 품질, 창의성, 공정성</td><td>주관적 판단 필요 시</td></tr>
          <tr><td><strong>LLM-as-a-judge</strong></td><td>LLM</td><td>완전성, 지침 준수, 거부</td><td>프로덕션 대규모 평가</td></tr>
          <tr><td><strong>A/B 테스트</strong></td><td>실제 사용자</td><td>사용자 행동, 비즈니스 결과</td><td>실전 성능 검증</td></tr>
        </tbody></table>

        <SectionStatusBar categoryId="fm-evaluation" sectionId="advanced-evaluation" />
      </section>

      <section id="situational">
        <h2>상황별 대응 방법 <span className="badge badge-exam">&#11088; 시험 빈출</span></h2>
        <p>시험에서 자주 출제되는 상황별 대응 방법입니다. 상황에 따라 적절한 기법을 선택하는 능력이 중요합니다.</p>

        <ToggleSection title="Fine-tuning이 답인 상황">
          <table className="info-table"><thead><tr><th>상황</th><th>해결 방법</th></tr></thead><tbody>
            <tr><td>연구 논문의 복잡한 과학 용어로 인해 FM 성능 저조</td><td>도메인 적응 미세 조정(domain adaptation fine-tuning)</td></tr>
            <tr><td>레이블이 지정된 데이터셋에서 AI 모델 훈련</td><td>Fine-tuning</td></tr>
            <tr><td>명령 기반 파인튜닝의 훈련 데이터 준비</td><td>도메인 관련 질문과 답변 쌍 생성</td></tr>
            <tr><td>회사 데이터로 모델을 더 정확하게 미세 조정</td><td>프롬프트 필드 및 완료 필드와 함께 <strong>레이블이 지정된 데이터</strong> 제공 (JSONL 형식)</td></tr>
            <tr><td>회사 톤에 맞게 챗봇 응답 개선 (고품질 대화 100개 보유)</td><td>Bedrock으로 파인튜닝</td></tr>
            <tr><td>고품질 레이블링된 데이터로 FM 커스터마이징</td><td>파인 튜닝 수행</td></tr>
            <tr><td>회사 데이터 기반 응답 생성을 위한 LLM 사용</td><td>회사 데이터로 커스텀 모델을 파인 튜닝</td></tr>
          </tbody></table>
        </ToggleSection>

        <ToggleSection title="RAG가 답인 상황">
          <table className="info-table"><thead><tr><th>상황</th><th>해결 방법</th></tr></thead><tbody>
            <tr><td>빠르게 변화하는 재고 데이터의 모델 정확도 향상</td><td>검색 증강 생성(RAG) 사용</td></tr>
            <tr><td>LLM과 지식 베이스를 사용한 텍스트 기반 챗봇</td><td>Amazon Bedrock을 사용하여 RAG 에이전트 개발</td></tr>
            <tr><td>인사 정책에 대한 질문에 답하는 LLM 챗봇</td><td>검색 증강 생성(RAG)</td></tr>
            <tr><td>회사의 내부 데이터 소스에서 FM 모델 보완</td><td>Amazon Bedrock 지식 베이스 생성</td></tr>
            <tr><td>FM이 회사 정보로 더 많은 컨텍스트를 포함</td><td>Bedrock Knowledge Bases 사용</td></tr>
            <tr><td>회사 제품 설명서(PDFs)를 위한 채팅 인터페이스</td><td>Amazon Bedrock 지식 베이스에 PDF 업로드 (가장 비용 효율적)</td></tr>
            <tr><td>미해결 고객 청구건 확인 및 문서 접근 AI 앱</td><td>Amazon Bedrock 지식 베이스 + Bedrock 에이전트</td></tr>
            <tr><td>자주 업데이트되는 회사 정책에 대한 챗봇</td><td>Bedrock Knowledge Bases를 사용한 RAG 워크플로</td></tr>
            <tr><td>LLM의 환각(Hallucination) 감소</td><td>RAG 기법 적용</td></tr>
            <tr><td>내부 문서를 사용하여 FM 커스터마이징 (최소 노력)</td><td>RAG 아키텍처 사용</td></tr>
          </tbody></table>
        </ToggleSection>

        <ToggleSection title="프롬프트 엔지니어링이 답인 상황">
          <table className="info-table"><thead><tr><th>상황</th><th>해결 방법</th></tr></thead><tbody>
            <tr><td>LLM 출력이 짧고 특정 언어로 작성되길 희망</td><td>프롬프트를 수정하는 것으로 충분</td></tr>
            <tr><td>챗봇이 회사 분위기에 맞는 응답 생성하길 희망</td><td>원하는 응답을 생성할 때까지 실험하고 프롬프트를 수정</td></tr>
            <tr><td>브랜드 톤앤매너와 메시징 요구사항 부합</td><td>명확한 지시사항과 맥락을 제공하는 효과적인 프롬프트 작성</td></tr>
            <tr><td>에이전트의 정확도를 향상하기 위해 구체적 예시 제공</td><td>예시를 포함하도록 고급 프롬프트 수정</td></tr>
            <tr><td>텍스트의 감정을 긍정/부정으로 분류</td><td>프롬프트에 레이블이 있는 텍스트 예시 제공 후 새 텍스트 배치</td></tr>
            <tr><td>연령대에 따른 응답 스타일 자동 변경 (최소 구현 노력)</td><td>역할 설명을 프롬프트 컨텍스트에 추가</td></tr>
            <tr><td>조작되어 바람직하지 않은 작업 수행/민감 정보 노출 방지</td><td>LLM에 공격 패턴 탐지 프롬프트 템플릿 제공</td></tr>
          </tbody></table>
        </ToggleSection>

        <ToggleSection title="기타 상황별 대응">
          <table className="info-table"><thead><tr><th>상황</th><th>해결 방법</th></tr></thead><tbody>
            <tr><td>기존 코드를 다른 언어로 변환 시 고려 기준</td><td>구문, 의미 이해 및 코드 최적화 기능</td></tr>
            <tr><td>복잡한 하드코딩 로직을 시장/제품 전반에 확장 시 생성형 AI 장점</td><td>적응성(Adaptability)</td></tr>
            <tr><td>제품 매뉴얼 기반 에이전트의 고객 신뢰도 향상</td><td>응답에 참조된 제품 매뉴얼 링크 포함</td></tr>
            <tr><td>오프라인 배치 처리로 구현해야 하는 RAG 단계</td><td>콘텐츠 임베딩 생성, 검색 인덱스 생성</td></tr>
            <tr><td>텍스트+이미지 검색 애플리케이션</td><td>멀티모달 임베딩 모델</td></tr>
            <tr><td>Amazon Bedrock 결과가 어린이에게 적합한지 확인</td><td>Amazon Bedrock Guardrails 사용</td></tr>
            <tr><td>모델이 개인 환자 정보를 포함하는 것 방지 + 위반 시 알람</td><td>Bedrock Guardrails 콘텐츠 필터링 + CloudWatch 알람</td></tr>
            <tr><td>챗봇이 과거 상호작용/온라인 리소스 학습하여 개선</td><td>긍정적 고객 피드백에 보상을 제공하는 강화 학습 (RLHF)</td></tr>
            <tr><td>LLM 결과의 편견/차별 평가 (최소 관리 노력)</td><td>벤치마크 데이터세트 활용</td></tr>
            <tr><td>이미지 분류 FM의 정확도 평가</td><td>사전 정의된 벤치마크 데이터셋으로 측정</td></tr>
            <tr><td>직원이 선호하는 스타일의 응답 모델 탐색</td><td>인력과 맞춤형 프롬프트 데이터셋으로 모델 평가</td></tr>
            <tr><td>콘텐츠 조정을 위해 LLM 개선 + 새로운 트렌드 대응</td><td>숙련된 조정자의 RLHF</td></tr>
            <tr><td>에이전트가 외부 서비스에 액세스하여 추가 컨텍스트 확보</td><td>Model Context Protocol (MCP)</td></tr>
            <tr><td>실제 애플리케이션에서 FM 성능 평가</td><td>통제된 환경에서 사용자와 A/B 테스트 수행</td></tr>
          </tbody></table>
        </ToggleSection>

        <TipBox type="important"><p><strong>핵심 판단 기준:</strong> "최소 비용/노력" → 프롬프트 엔지니어링 또는 RAG. "레이블된 데이터 보유" → Fine-tuning. "레이블 없는 데이터" → 지속적 사전학습. "최신 정보/자주 변하는 데이터" → RAG. "인간 가치 정렬" → RLHF. "실전 성능 검증" → A/B 테스트.</p></TipBox>

        <SectionStatusBar categoryId="fm-evaluation" sectionId="situational" />
      </section>

      <section id="quiz">
        <h2>도장깨기 퀴즈</h2>
        <Quiz categoryId="fm-evaluation" categoryTitle="FM 성능 평가 방법" questions={quizQuestions} />
      </section>
    </GuideLayout>
  )
}
