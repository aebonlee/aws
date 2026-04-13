# Phase 17: 문제풀이 한/영 전환 + 해설 보기 기능

## 개요

문제풀이(Practice) 페이지에 두 가지 핵심 기능을 추가했습니다:
- **한/영 전환 버튼**: 문제, 선택지, 해설을 한국어↔영어로 실시간 전환
- **해설 보기 버튼**: 답을 선택하기 전에도 해설을 미리 확인 가능

---

## 변경 내역

### 1. Practice.tsx — PracticeQuiz 컴포넌트 개선

**파일:** `src/pages/Practice.tsx`

#### 새 상태 추가
- `lang: 'ko' | 'en'` — 현재 표시 언어 (기본값: `'ko'`)
- `showExplanation: boolean` — 답변 전 해설 표시 여부

#### 한/영 전환 로직
```typescript
const displayQuestion = lang === 'en' && q.questionEn ? q.questionEn : q.question
const displayOptions = lang === 'en' && q.optionsEn ? q.optionsEn : q.options
const displayExplanation = lang === 'en' && q.explanationEn ? q.explanationEn : q.explanation
```
- 영어 데이터가 없는 문제는 자동으로 한국어 fallback
- `QuizQuestion` 인터페이스의 `questionEn?`, `optionsEn?`, `explanationEn?` 필드 활용

#### UI 변경사항
- **Quiz 헤더**: `quiz-header-actions` div 추가 — EN/한 토글 버튼 + 진행률 표시
- **해설 보기 버튼**: `quiz-action-row` 영역에 "해설 보기" 버튼 배치
  - 답변 전: 버튼 클릭 시 주황색(neutral) 스타일로 해설 표시
  - 답변 후: 정답(초록)/오답(빨강) 스타일로 자동 표시, 해설 보기 버튼 숨김

#### 상태 초기화
- `handleNext()`: 다음 문제 이동 시 `showExplanation = false` 리셋
- `handleRetry()`: 다시 풀기 시 `showExplanation = false` 리셋
- `lang` 상태는 퀴즈 전체에서 유지 (문제 전환 시 리셋하지 않음)

### 2. quiz.css — 스타일 추가

**파일:** `src/styles/quiz.css`

#### 새 CSS 클래스
| 클래스 | 용도 |
|--------|------|
| `.quiz-header-actions` | 토글 버튼 + 진행률을 flex 정렬 |
| `.quiz-lang-toggle.active` | 영어 모드 활성 시 주황색 하이라이트 |
| `.quiz-action-row` | 해설 보기 버튼 영역 레이아웃 |
| `.quiz-explain-btn` | 해설 보기 버튼 폰트 사이즈 |
| `.quiz-explanation.neutral` | 답변 전 해설 박스 (주황색 테마) |

---

## 데이터 구조 참고

### QuizQuestion 인터페이스 (src/components/Quiz.tsx)
```typescript
export interface QuizQuestion {
  question: string        // 한국어 문제
  questionEn?: string     // 영어 문제
  options: string[]       // 한국어 선택지
  optionsEn?: string[]    // 영어 선택지
  answer: number | number[]
  explanation: string     // 한국어 해설
  explanationEn?: string  // 영어 해설
}
```

### PracticeQuestion 인터페이스 (src/data/quizData.ts)
```typescript
export interface PracticeQuestion extends QuizQuestion {
  categoryId: string
  explanationEn?: string
}
```

- 현재 424문제 중 대부분이 `questionEn`, `optionsEn` 필드를 포함
- `explanationEn`은 일부 문제에만 존재 → 없으면 한국어 해설로 fallback

---

## 수정 파일 요약

| 파일 | 변경 유형 | 내용 |
|------|-----------|------|
| `src/pages/Practice.tsx` | 수정 | 한/영 전환 + 해설 보기 기능 추가 |
| `src/styles/quiz.css` | 수정 | 관련 CSS 스타일 추가 |

---

## 검증

1. `npm run build` 성공
2. 문제풀이에서 EN 버튼 클릭 시 영어 문제/선택지/해설 표시
3. 한 버튼 클릭 시 한국어로 복귀
4. 영어 데이터 없는 문제는 한국어로 자동 fallback
5. 답변 전 "해설 보기" 버튼으로 해설 확인 가능
6. 답변 후 정답/오답 스타일로 해설 자동 표시
7. 다음 문제 이동 시 해설 보기 상태 초기화
