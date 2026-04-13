# Phase 10: 대시보드 + 세밀한 도장깨기 + 섹션별 학습추적 + 요금제 결제

## 개요

기존 시스템의 한계를 해결하기 위해 대규모 기능 개선을 수행했습니다:
- **도장깨기**: 카테고리당 1개 도장(70% 합격)만 존재 → **3단계 티어(Bronze/Silver/Gold)** 도입
- **학습 추적**: `studied: boolean` 하나뿐 → **섹션별 완료/재복습 상태 추적** 도입
- **대시보드**: 없음 → **개인 로그인 후 종합 대시보드** 신규 생성
- **요금제**: 없음 → **PortOne 결제 연동 요금제 페이지** 신규 생성

---

## 변경 내역

### 1. ProgressContext 확장 (데이터 레이어)

**파일:** `src/contexts/ProgressContext.tsx`

#### 새 타입 추가
- `SectionProgress`: 섹션별 완료 상태 (`completedAt`, `reviewStatus`)
- `QuizAttempt`: 퀴즈 시도 기록 (`score`, `total`, `percentage`, `timestamp`, `passed`)
- `StampTier`: 도장 등급 (`'none' | 'bronze' | 'silver' | 'gold'`)
- `OverallStats`: 대시보드용 종합 통계 인터페이스

#### CategoryProgress 확장 (v2)
기존 필드(`studied`, `quizScore`, `quizTotal`, `completedAt`) 보존 + 신규 필드:
- `sections: Record<string, SectionProgress>` — 섹션별 진행 상태
- `quizHistory: QuizAttempt[]` — 최대 20개 퀴즈 히스토리
- `stampTier: StampTier` — 도장 티어
- `lastStudiedAt: string | null` — 마지막 학습 일시
- `totalStudyVisits: number` — 총 방문 횟수

#### 스키마 마이그레이션 (v1 → v2)
- localStorage 로드 시 `_schemaVersion` 체크
- v1(기존) → v2(신규) 자동 변환: 기존 필드 보존 + 새 필드 기본값 설정
- 기존 `quizScore`가 있으면 `quizHistory`에 1건 자동 추가
- 기존 `completedAt`가 있으면 `stampTier` 자동 계산 (최소 bronze)

#### 도장 티어 계산 로직 (`computeStampTier`)
- **Bronze**: 70% 이상 합격
- **Silver**: 85% 이상 달성
- **Gold**: 100% 또는 90%+ 3회 연속

#### 새 Context 메서드 (7개)
| 메서드 | 설명 |
|--------|------|
| `markSectionComplete(categoryId, sectionId)` | 섹션 학습완료 마킹 |
| `markSectionNeedsReview(categoryId, sectionId)` | 섹션 재복습 필요 마킹 |
| `getSectionProgress(categoryId, sectionId)` | 섹션 진행 상태 조회 |
| `getStampTier(categoryId)` | 도장 티어 조회 |
| `getQuizHistory(categoryId)` | 퀴즈 히스토리 조회 |
| `getOverallStats()` | 대시보드용 종합 통계 |
| `recordStudyVisit(categoryId)` | 방문 횟수/날짜 기록 |

#### saveQuizResult 수정
- `quizHistory` 배열에 append (max 20)
- `stampTier` 자동 재계산
- 기존 `quizScore`/`completedAt`도 동시 업데이트 (하위 호환)

---

### 2. categories.ts에 sections 배열 추가

**파일:** `src/lib/categories.ts`

- `SectionInfo` 인터페이스 추가 (`id`, `title`)
- `CategoryInfo`에 `sections: SectionInfo[]` 필드 추가
- 8개 카테고리 각각에 학습 섹션 배열 정의 (quiz 제외):

| 카테고리 | 섹션 수 | 섹션 ID |
|----------|---------|---------|
| ai-ml-basics | 4 | ai-ml-dl, ml-types, classification-regression, aws-ai-services |
| ml-development | 5 | ec2-families, ml-process, data-preprocessing, model-evaluation, overfitting |
| sagemaker | 5 | overview, build, train, deploy, no-code |
| gen-ai-basics | 5 | foundation-model, llm, parameters, gen-ai-types, tokens-embeddings |
| prompt-engineering | 4 | prompt-basics, techniques, bedrock, amazon-q |
| fm-evaluation | 4 | improvement, rag, fine-tuning, evaluation |
| responsible-ai | 4 | principles, bias, explainability, aws-responsible |
| security-governance | 4 | threats, aws-security, data-privacy, governance |

---

### 3. SectionStatusBar 컴포넌트

**신규 파일:** `src/components/SectionStatusBar.tsx`

각 학습 섹션 하단에 배치하는 상태 표시/토글 바:
- **상태 뱃지**: 미완료(회색) / 학습완료(초록) / 재복습 필요(주황)
- **학습완료 버튼**: `markSectionComplete()` 호출
- **재복습 버튼**: `markSectionNeedsReview()` 호출
- 현재 상태에 따라 불필요한 버튼 자동 숨김

**CSS:** `src/styles/guide-pages.css`에 `.section-status-bar`, `.section-badge`, `.btn-section` 스타일 추가

---

### 4. StampTierBadge 컴포넌트

**신규 파일:** `src/components/StampTierBadge.tsx`

도장 티어 시각화 뱃지:
- **Gold**: 금색 그라데이션 (🥇)
- **Silver**: 은색 그라데이션 (🥈)
- **Bronze**: 동색 그라데이션 (🥉)
- **None**: 회색 dashed outline (⬜)
- 3가지 사이즈: `sm`, `md`, `lg`

재사용 위치: StampBreaking, Dashboard, Quiz 결과, GuideLayout

---

### 5. GuideLayout 사이드바 개선

**파일:** `src/components/GuideLayout.tsx`

- 사이드바 각 섹션 링크에 상태 아이콘 표시 (✅ 완료 / 🔄 재복습)
- 하단에 섹션 진행률 미니 프로그레스바: "3/4 섹션"
- 상단 stamp-status에 `StampTierBadge` 표시 (tier별)
- 티어 정보 텍스트 추가 ("티어: GOLD")

---

### 6. 8개 학습 페이지에 SectionStatusBar 추가

**수정 파일 (8개):**
- `src/pages/AiMlBasics.tsx` (4 섹션)
- `src/pages/MlDevelopment.tsx` (5 섹션)
- `src/pages/SageMaker.tsx` (5 섹션)
- `src/pages/GenAiBasics.tsx` (5 섹션)
- `src/pages/PromptEngineering.tsx` (4 섹션)
- `src/pages/FmEvaluation.tsx` (4 섹션)
- `src/pages/ResponsibleAi.tsx` (4 섹션)
- `src/pages/SecurityGovernance.tsx` (4 섹션)

각 `<section>` 마지막(quiz 섹션 제외)에 `<SectionStatusBar categoryId="..." sectionId="..." />` 추가

---

### 7. StampBreaking 페이지 리디자인

**파일:** `src/pages/StampBreaking.tsx`

**Hero 영역 강화:**
- Gold/Silver/Bronze 카운트 표시 (색상별 숫자)
- 기존 진행률 + 획득 도장 수치 유지

**티어 달성 조건 안내 패널:**
- Bronze: 70% 이상 합격
- Silver: 85% 이상 달성
- Gold: 100% 또는 90%+ 3회 연속

**카테고리 카드 개선:**
- `StampTierBadge`로 3단계 도장 표시
- 최근 5회 퀴즈 히스토리 dots (초록=합격, 빨강=실패)
- 섹션 완료율 뱃지: "3/4 섹션"
- 최고 점수 / 최근 점수 표시

---

### 8. Quiz 결과에 티어 피드백 추가

**파일:** `src/components/Quiz.tsx`

결과 화면에:
- 획득한 `StampTierBadge` (lg 사이즈) 표시
- 다음 티어 달성까지 안내 메시지 (`getNextTierInfo` 함수)
- 최근 5회 퀴즈 히스토리 dots

---

### 9. Dashboard 페이지 (신규)

**신규 파일:** `src/pages/Dashboard.tsx`
**신규 CSS:** `src/styles/dashboard.css`

로그인 후 `/dashboard` 에서 접근 가능한 개인 대시보드:

1. **인사 + 종합 통계**: 유저 이름, SVG 원형 프로그레스 링 (완료율%)
2. **핵심 수치 4개**: 학습 시작 / 도장 획득 / 퀴즈 응시 / 평균 점수
3. **도장 컬렉션**: 8개 카테고리 도장 슬롯 (4×2 그리드), 티어별 색상
4. **카테고리별 상세 테이블**: 섹션 진행률 + 퀴즈 응시 횟수 + 최고 점수 + 도장 티어
5. **퀴즈 히스토리 타임라인**: 최근 20건 시간순 리스트 (합격=초록, 실패=빨강)
6. **취약 영역**: 70% 미만 카테고리 + 재복습 표시된 카테고리 하이라이트

---

### 10. 요금제 페이지 + PortOne 결제 (신규)

**신규 파일:**
- `src/pages/Pricing.tsx` — 요금제 페이지
- `src/lib/portone.ts` — PortOne SDK 래퍼
- `src/styles/pricing.css` — 요금제 스타일

**요금제:**
| 플랜 | 가격 | 월 환산 | 비고 |
|------|------|---------|------|
| 1개월 | 9,900원/월 | 9,900원 | 기본 |
| 3개월 | 19,900원 | 6,633원 | 추천 (33% 할인) |

**PortOne 연동:**
- `index.html`에 `<script src="https://cdn.iamport.kr/v1/iamport.js">` SDK 추가
- `portone.ts`에서 `IMP.init()` → `IMP.request_pay()` 래핑
- KG이니시스 카드결제 (`html5_inicis`)
- 가맹점 코드: `imp00000000` (실제 코드로 교체 필요)

**결제 플로우:**
1. 로그인 미인증 시 → `/login` 리다이렉트
2. 결제 버튼 클릭 → PortOne 결제 팝업
3. 결제 성공 → alert 알림 (거래번호)
4. 결제 실패 → 에러 메시지 표시

**FAQ 섹션:** 결제 수단, 환불 정책, 기간 만료 안내

---

### 11. 라우트 + 네비게이션 업데이트

**파일:** `src/App.tsx`
- `/pricing` — public 라우트 (Pricing)
- `/dashboard` — ProtectedRoute (Dashboard)

**파일:** `src/components/layout/Navbar.tsx`
- 데스크톱 + 모바일 Nav에 "대시보드" 링크 추가 (로그인 시만 표시)
- 데스크톱 + 모바일 Nav에 "요금제" 링크 추가 (항상 표시)

---

### 12. CSS 업데이트

**파일:** `src/index.css`
- `dashboard.css`, `pricing.css` import 추가

**파일:** `src/styles/dark-mode.css`
- Dashboard, Pricing, SectionStatusBar, StampTierBadge 다크모드 스타일 추가

**파일:** `src/styles/responsive.css`
- Dashboard 반응형 (768px 이하: 2열 그리드, 480px 이하: 모바일 최적화)
- Pricing 반응형 (768px 이하: 1열 그리드)
- SectionStatusBar 반응형 (768px 이하: 세로 배치)

**파일:** `src/styles/guide-pages.css`
- SectionStatusBar 스타일 (상태별 색상, 버튼)
- 사이드바 상태 아이콘, 미니 프로그레스바
- StampTierBadge 스타일 (Gold/Silver/Bronze 그라데이션)
- 퀴즈 히스토리 dots 스타일
- StampBreaking 티어 카운트, 가이드 패널

---

## 파일 요약

### 신규 생성 (7개)
| 파일 | 용도 |
|------|------|
| `src/components/SectionStatusBar.tsx` | 섹션 학습완료/재복습 토글 바 |
| `src/components/StampTierBadge.tsx` | 도장 티어(Gold/Silver/Bronze) 뱃지 |
| `src/pages/Dashboard.tsx` | 개인 학습 대시보드 |
| `src/pages/Pricing.tsx` | 요금제 + PortOne 결제 |
| `src/lib/portone.ts` | PortOne SDK 래퍼 |
| `src/styles/dashboard.css` | 대시보드 스타일 |
| `src/styles/pricing.css` | 요금제 스타일 |

### 수정 (20개)
| 파일 | 주요 변경 |
|------|-----------|
| `src/contexts/ProgressContext.tsx` | 타입 확장, 마이그레이션, 7개 메서드 추가 |
| `src/lib/categories.ts` | sections 배열 + SectionInfo 타입 |
| `src/components/GuideLayout.tsx` | 사이드바 상태 아이콘, 프로그레스바, 티어 뱃지 |
| `src/components/Quiz.tsx` | 결과에 티어 뱃지, 히스토리 dots, 다음 티어 안내 |
| `src/pages/StampBreaking.tsx` | 3단계 도장, 히스토리 dots, 섹션 완료율 |
| `src/pages/AiMlBasics.tsx` | SectionStatusBar 4개 추가 |
| `src/pages/MlDevelopment.tsx` | SectionStatusBar 5개 추가 |
| `src/pages/SageMaker.tsx` | SectionStatusBar 5개 추가 |
| `src/pages/GenAiBasics.tsx` | SectionStatusBar 5개 추가 |
| `src/pages/PromptEngineering.tsx` | SectionStatusBar 4개 추가 |
| `src/pages/FmEvaluation.tsx` | SectionStatusBar 4개 추가 |
| `src/pages/ResponsibleAi.tsx` | SectionStatusBar 4개 추가 |
| `src/pages/SecurityGovernance.tsx` | SectionStatusBar 4개 추가 |
| `src/App.tsx` | /dashboard, /pricing 라우트 추가 |
| `src/components/layout/Navbar.tsx` | 대시보드, 요금제 메뉴 추가 |
| `src/index.css` | CSS import 2개 추가 |
| `src/styles/guide-pages.css` | 섹션/티어/히스토리 스타일 추가 |
| `src/styles/dark-mode.css` | 신규 컴포넌트 다크모드 |
| `src/styles/responsive.css` | 신규 컴포넌트 반응형 |
| `index.html` | PortOne SDK 스크립트 추가 |

---

## 빌드 검증

- `npm run build` 성공 (TypeScript + Vite)
- 총 134 모듈 정상 변환
- Dashboard CSS/JS, Pricing CSS/JS 정상 분리 (code splitting)

---

## 참고사항

- PortOne 가맹점 코드 (`imp00000000`)는 **실제 코드로 교체 필요**
- 기존 v1 진행 데이터는 localStorage에서 자동 마이그레이션됨
- 다크 모드 + 모바일 반응형 모두 지원
