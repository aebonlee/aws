# 개발일지 - Phase 14: 8개 학습 페이지 콘텐츠 대폭 보강

**날짜**: 2026-04-14
**Phase**: 14

---

## 1. 개요

Notion에 정리된 8개 AIF-C01 학습 자료(data/ 폴더)와 424개 퀴즈 문제를 교차 분석하여,
기존 학습 페이지의 누락된 콘텐츠를 대폭 보강하고 시험 빈출 표시를 추가.

### 작업 목표
1. Notion 데이터 파일 vs 현재 페이지 갭(gap) 분석
2. 퀴즈 424문항 역추적으로 빈출 토픽 식별
3. 누락 콘텐츠 추가 및 시험 빈출 배지(⭐/badge) 표시
4. CSS 일관성 확보 및 빌드 검증

---

## 2. 수정 파일 (11개)

### 학습 페이지 (8개)

| 파일 | Before | After | 주요 추가 내용 |
|------|--------|-------|---------------|
| `src/pages/AiMlBasics.tsx` | 5 섹션, 91줄 | 10 섹션, 283줄 | 지도/비지도 학습 상세, KNN vs K-Means, ML 아키텍처(연합학습), 상황별 ML 선택 가이드(9개), AWS AI 서비스 확장(HealthScribe, A2I, Neptune) |
| `src/pages/MlDevelopment.tsx` | 6 섹션 | 15 섹션 | 데이터 유형(4종), 데이터 품질 기준(7개), AWS Glue, 모델 선택, 비즈니스 지표(CTR/AOV/FCR), 특성 공학, 하이퍼파라미터, 편향 유형(4종), MLOps 수명주기 |
| `src/pages/SageMaker.tsx` | 6 섹션 | 9 섹션 | ML 수명주기(6단계), Model Monitor(4가지 드리프트), 상황별 서비스 매핑(22개), Ground Truth/Data Wrangler/Feature Store/Clarify 상세, Model Registry/Model Cards, Unified Studio |
| `src/pages/GenAiBasics.tsx` | ~8 섹션 | 13 섹션 | 생성형 AI 분류, GAN/VAE/Diffusion 상세, LLM 주요 용어(Token/Context Window/SLM/Hallucination/Inference Latency/Embeddings), FM 학습 단계(Pre-training vs Fine-tuning), 이미지 생성 파라미터(CFG/Generation Step) |
| `src/pages/PromptEngineering.tsx` | ~6 섹션 | 8 섹션 | 프롬프트 4대 구성요소(TRRS), 시스템 프롬프트, 기법 5→8개, Amazon Nova 모델(5종), 과금 모델(3종), Guardrails 6가지 정책, Agent vs KB 비교, Amazon Q 상세, OpenSearch, Security Scoping Matrix |
| `src/pages/FmEvaluation.tsx` | 5 섹션 | 11 섹션 | FM 커스터마이징(Continued Pre-training/Fine-tuning/Distillation), RLHF, In-context Learning/MCP, 벡터 검색(AWS 4개 서비스), 평가 방법론(Human vs Automated, 4단계 프로세스), 메트릭(BLEU/ROUGE/BERTScore/F1/GLUE/MMLU/HELM), LLM-as-a-judge, A/B 테스트, 상황별 대응(44개) |
| `src/pages/ResponsibleAi.tsx` | 5 섹션 | 9 섹션 | 원칙 7→9개(해석가능성/통제가능성), 투명성 vs 설명가능성 vs 해석가능성(WHAT/WHY/HOW), SHAP/PDP 상세, 개인정보 보호(Privacy by Design), AI 거버넌스 프레임워크 |
| `src/pages/SecurityGovernance.tsx` | 5 섹션 | 9 섹션 | 탈옥/프롬프트 유출/민감정보 노출, 네트워크 격리(PrivateLink/VPC Endpoint), 공유 책임 모델, 데이터 거버넌스(9개 개념), ISO 42001, 알고리즘 책임법 |

### 네비게이션 & CSS (3개)

| 파일 | 변경 내용 |
|------|----------|
| `src/components/layout/Navbar.tsx` | AIF-C01 메뉴 항상 강조(active) 상태, AWS Certification 드롭다운에서도 AIF-C01 강조 |
| `src/styles/base.css` | `.badge-danger`, `.badge-warning`, `.badge-exam` CSS 클래스 추가 |
| JSX `->` 이스케이프 | PromptEngineering.tsx의 `->` 화살표를 `→` (유니코드)로 변환 |

---

## 3. 핵심 구현 패턴

### 시험 빈출 배지 (Exam Frequency Badge)

모든 8개 페이지에서 통일된 CSS 클래스 사용:

```html
<span className="badge badge-exam">시험 빈출</span>
```

```css
/* base.css */
.badge-exam { background: rgba(239,68,68,0.15); color: #dc2626; font-size: 0.72rem; }
```

### 퀴즈 역추적 분석

```typescript
// aifC01.ts에서 categoryId별 문제 수 분석
const quizDistribution = {
  'prompt-engineering': 72,  // 24.2% (FM활용)
  'gen-ai-basics': 66,       // 22.7% (생성형AI)
  'fm-evaluation': 61,       // 21.3% (FM평가)
  'ai-ml-basics': 60,        // 17.6% (AI/ML기초)
  'ml-development': 46,      // 14.1% (ML개발)
  'sagemaker': 38,            // 11.9% (SageMaker)
  'security-governance': 44,  // 10.4% (보안)
  'responsible-ai': 37,       // 8.7%  (ResponsibleAI)
}
```

### Notion 데이터 파일 매핑

| data/ 파일 | 학습 페이지 |
|------------|-----------|
| `AI와 ML의 기초 c225549d...md` | AiMlBasics.tsx |
| `ML 개발 6d35549d...md` | MlDevelopment.tsx |
| `Amazon SageMaker a015549d...md` | SageMaker.tsx |
| `생성형 AI 기초 1b05549d...md` | GenAiBasics.tsx |
| `FM 활용과 프롬프트 엔지니어링 acc5549d...md` | PromptEngineering.tsx |
| `FM 성능 평가 방법 bd65549d...md` | FmEvaluation.tsx |
| `Responsible AI... 6a55549d...md` | ResponsibleAi.tsx |
| `AI 솔루션을 위한 보안... 8f85549d...md` | SecurityGovernance.tsx |

---

## 4. 페이지별 상세 변경

### AiMlBasics (AI/ML 기초)
- 준지도 학습, 전이 학습 추가
- 지도 학습 상세: 회귀, 이진/다중 분류, 의사결정 트리, KNN
- 비지도 학습 상세: 군집화, 차원 축소, 이상 탐지(RCF/Autoencoder)
- KNN vs K-Means 비교 테이블
- ML 아키텍처: 중앙 집중식, 연합 학습, 스플릿, 온라인 학습
- 상황별 ML 선택 가이드 (9개 시나리오)
- AWS AI 서비스 확장 (HealthScribe, Comprehend Medical, A2I, Neptune 추가)

### MlDevelopment (ML 개발)
- 데이터 유형 4종 (정형, 시계열, 텍스트, 이미지)
- 데이터셋 품질 기준 7개 (Accuracy~Reliability) + Recency Bias
- AWS Glue ETL 서비스
- 모델 선택 기준 (크기, 비용, 커스터마이징)
- 비즈니스 지표 (CTR, AOV, 유지율, 전환율, FCR)
- 특성 공학 4종 (생성, 변환, 추출, 선택)
- 하이퍼파라미터 (에포크, 학습률, 배치 크기)
- 편향 유형 4종 (측정, 표본, 관찰자, 확증)
- MLOps 수명주기 (5가지 핵심 관행 + 시각적 다이어그램)

### SageMaker
- ML 수명주기 6단계 테이블
- 데이터 엔지니어링 상세 (Ground Truth 워크포스, Data Wrangler 300+ 변환, Feature Store, Clarify FMEval)
- 모델 개발 확장 (Notebook, Canvas FM통합, JumpStart VPC배포, Unified Studio)
- 배포 확장 (추론 유형별 페이로드 한도, Model Registry 버전관리, Model Cards 문서화)
- Model Monitor 4가지 드리프트 유형
- 상황별 서비스 매핑 22개

### GenAiBasics (생성형 AI 기초)
- 생성형 AI 분류 체계 (Gen AI > FM > LLM)
- GAN/VAE/Diffusion 상세 메커니즘
- LLM 주요 용어 6개 (Token, Context Window, SLM, Hallucination, Inference Latency, Embeddings)
- FM 학습 단계 (Pre-training vs Fine-tuning 비교 테이블)
- Temperature 상세 (낮음/중간/높음 범위별 용도)
- Top P 상세 (가사 생성 시나리오 예시)
- 이미지 생성 파라미터 (CFG, Generation Step)

### PromptEngineering (FM 활용과 프롬프트 엔지니어링)
- TRRS 프레임워크 (Task/Role/Response style/Success criteria)
- 시스템 프롬프트 vs 사용자 프롬프트 비교
- 프롬프트 기법 확장: Prompt chaining, Positive/Negative prompting, Message History
- Amazon Nova 5종 (Micro/Lite/Pro/Canvas/Reel)
- 과금 모델 3종 (On-Demand/Batch/Provisioned Throughput)
- Guardrails 6가지 정책 유형
- Agent vs Knowledge Base 비교
- Amazon Q 상세 (Business 40+커넥터, Developer, QuickSight)
- OpenSearch 벡터 DB, Security Scoping Matrix

### FmEvaluation (FM 성능 평가)
- FM 커스터마이징 3종 (Continued Pre-training, Fine-tuning, Distillation)
- RLHF 상세
- FM 활용 (In-context Learning, Prompt-based, MCP)
- 벡터 검색 (DocumentDB, OpenSearch, RDS PostgreSQL, Aurora)
- 평가 방법론 (Human vs Automated, 4단계 프로세스)
- 평가 메트릭 확장 (BLEU/ROUGE/BERTScore/F1 + 벤치마크 GLUE/MMLU/HELM)
- LLM-as-a-judge (Completeness, Following instructions, Refusal)
- A/B 테스트
- 상황별 대응 방법 44개 (4개 카테고리로 분류)

### ResponsibleAi (책임감 있는 AI)
- 원칙 확장 7→9개 (해석 가능성, 통제 가능성 추가)
- 투명성 vs 설명 가능성 vs 해석 가능성 (WHAT/WHY/HOW 비교)
- SHAP/PDP 상세 (대출 승인 예시)
- 개인정보 보호 (Privacy by Design, PII 처리)
- AI 거버넌스 프레임워크 (프로세스, 핵심 특성, 교육)

### SecurityGovernance (보안/규정 준수/거버넌스)
- 보안 위협 확장: 탈옥, 프롬프트 유출, 민감 정보 노출
- 네트워크 격리: PrivateLink, VPC Endpoint, SageMaker Network Isolation
- 공유 책임 모델 (Security OF/IN the Cloud)
- 데이터 거버넌스 9개 개념 (Data Residency~Data Retention)
- ISO 42001, 알고리즘 책임법

---

## 5. CSS 통일

### 시험 빈출 배지 표준화

| 이전 (비일관) | 이후 (통일) |
|-------------|-----------|
| `examBadgeStyle` 인라인 CSS | `className="badge badge-exam"` |
| `style={{background: '#e74c3c'...}}` | `className="badge badge-exam"` |
| `className="badge-exam"` (base 없음) | `className="badge badge-exam"` |
| `className="badge badge-primary"` | `className="badge badge-exam"` |
| `className="badge badge-danger"` | `className="badge badge-exam"` |

### base.css 추가 클래스

```css
.badge-danger { background: rgba(239,68,68,0.15); color: #dc2626; }
.badge-warning { background: rgba(245,158,11,0.15); color: #d97706; }
.badge-exam { background: rgba(239,68,68,0.15); color: #dc2626; font-size: 0.72rem; }
```

---

## 6. Navbar 변경

- AIF-C01 AI Practitioner 최상위 메뉴: 항상 `active` 클래스 적용
- AWS Certification 드롭다운 내 AIF-C01 항목: 항상 `active` 클래스 적용
- 사이트의 핵심 콘텐츠임을 시각적으로 강조

---

## 7. 빌드 확인

- `npx tsc --noEmit` 통과 (TypeScript 타입 체크)
- `npm run build` 성공 (148 modules, 5.28s)
- JSX `->` 이스케이프 오류 수정 (PromptEngineering.tsx)
- quizData 청크 크기 경고 (741KB) - 기존 이슈, 향후 코드 스플릿 고려
