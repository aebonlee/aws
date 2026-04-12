# Phase 8: 424문제 전체 해설 통합 + 문제 뷰어

## 개요

AIF-C01 424문제의 빈 해설 339개를 CertiNavigator 스크랩 JSON 데이터로 병합하여 채우고,
학습 페이지에서 전체 문제를 볼 수 있도록 개선한 업데이트입니다.

## 변경 내역

### 1. 데이터 병합 스크립트 (신규)

**파일:** `scripts/merge-quiz-data.cjs`

- `data/quiz/` 디렉터리의 31개 JSON 파일을 모두 로드
- 카테고리 ID 매핑 처리 (`ai-ml-fundamentals` -> `ai-ml-basics` 등)
- 질문 텍스트 앞 60자 기준으로 매칭
- 같은 문제에 대해 해설이 있는 데이터 우선 채택
- `aifC01.ts`의 빈 explanation 필드를 자동으로 채움
- **결과:** 339개 빈 해설 -> 0개 (100% 채움)

### 2. aifC01.ts 해설 완성

**파일:** `src/data/practice/aifC01.ts`

- 339개 빈 explanation을 JSON 스크랩 데이터로 채움
- explanationEn (영어 해설)도 함께 추가
- 1개 매칭 불가 문제는 수동으로 해설 작성
- 424문제 전체 해설 완비

### 3. 학습 페이지 8개 수정

**파일:** `src/pages/AiMlBasics.tsx`, `MlDevelopment.tsx`, `SageMaker.tsx`, `GenAiBasics.tsx`, `PromptEngineering.tsx`, `FmEvaluation.tsx`, `ResponsibleAi.tsx`, `SecurityGovernance.tsx`

**변경 전:**
```typescript
import Quiz, { QuizQuestion } from '../components/Quiz'
const quizQuestions: QuizQuestion[] = [/* 10개 하드코딩 */]
```

**변경 후:**
```typescript
import Quiz from '../components/Quiz'
import { getQuestionsByCategory } from '../data/quizData'
const quizQuestions = getQuestionsByCategory('ai-ml-basics')
```

- 각 카테고리별 전체 문제(38~72개)를 로드
- 인라인 하드코딩 10문제 제거

### 4. Quiz 컴포넌트 개선

**파일:** `src/components/Quiz.tsx`

두 가지 모드 추가:
- **도장깨기 모드 (Quiz):** 랜덤 10문제 선별, 70% 이상 맞추면 도장 획득
- **전체 보기 모드 (Browse):** 모든 문제를 아코디언 형태로 리스트 표시
  - 문제 번호, 질문, 선지, 정답 표시
  - 해설 접기/펼치기
  - 한/영 토글 버튼 (한국어/영어 전환)

### 5. Practice 페이지 업데이트

**파일:** `src/pages/Practice.tsx`

- 20문제 고정 -> 10/20/전체 문제 수 선택 가능
- 전체 모드에서는 해당 카테고리 모든 문제 순서대로
- 총 문제 수 표시 (424문제)

### 6. quizData.ts 업데이트

**파일:** `src/data/quizData.ts`

- `getQuestionsByCategory()` 헬퍼 함수 추가
- `PracticeQuestion`에 `explanationEn` 필드 추가

### 7. CSS 스타일 추가

**파일:** `src/styles/quiz.css`, `src/styles/home.css`

- 모드 전환 탭 바 스타일
- 한/영 토글 버튼 스타일
- 전체 보기(Browse) 모드의 아코디언 스타일
- 문제 수 선택 버튼 스타일

## 카테고리별 문제 수

| 카테고리 | 문제 수 | 빈 해설 (전) | 빈 해설 (후) |
|---------|---------|-------------|-------------|
| AI와 ML의 기초 | 60 | 1 | 0 |
| ML 개발 | 46 | 42 | 0 |
| Amazon SageMaker | 38 | 38 | 0 |
| 생성형 AI 기초 | 66 | 66 | 0 |
| FM 활용과 프롬프트 엔지니어링 | 72 | 70 | 0 |
| FM 성능 평가 방법 | 61 | 59 | 0 |
| Responsible AI | 37 | 29 | 0 |
| 보안, 규정 준수, 거버넌스 | 44 | 34 | 0 |
| **합계** | **424** | **339** | **0** |

## 기술 스택

- React 19 + TypeScript
- Vite 7
- CSS (커스텀 프로퍼티 기반 테마)

## 빌드 검증

- `npm run build` 성공
- TypeScript 타입 체크 통과
- 모든 모듈 정상 번들링

## 날짜

2026-04-13
