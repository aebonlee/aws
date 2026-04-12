# 개발일지 - Phase 8: 커뮤니티 메뉴, 퀴즈 기능 개선, 스크래퍼 고도화

**날짜**: 2026-04-12
**Phase**: 8

---

## 1. 네비게이션 — 커뮤니티 드롭다운 + 로그인 버튼

### 변경 파일
- `src/components/layout/Navbar.tsx` — 커뮤니티 드롭다운 메뉴 + 로그인 버튼 추가
- `src/App.tsx` — 5개 라우트 추가 (lazy loading)
- `src/pages/community/Notices.tsx` — 공지사항 플레이스홀더
- `src/pages/community/Board.tsx` — 게시판 플레이스홀더
- `src/pages/community/SuccessStories.tsx` — 시험합격수기 플레이스홀더
- `src/pages/community/Tips.tsx` — 시험팁공유 플레이스홀더
- `src/pages/Login.tsx` — 로그인 페이지 플레이스홀더
- `src/styles/community.css` — 커뮤니티/로그인 스타일
- `src/index.css` — community.css import 추가

### 구현 내용
- 데스크톱: 기존 cert 드롭다운과 동일한 hover 패턴 (`handleMouseEnter`/`handleMouseLeave`)
- 모바일: 커뮤니티 아코디언 그룹 + 로그인 링크
- 커뮤니티 하위 메뉴: 공지사항(📢), 게시판(📋), 시험합격수기(🏆), 시험팁공유(💡)
- 로그인 버튼: 네비 우측 `.nav-login-btn`
- 모든 페이지는 "서비스 준비 중" 플레이스홀더 (백엔드 연동 추후)

---

## 2. 퀴즈 — 다중정답(Multi-select) 지원

### 변경 파일
- `src/components/Quiz.tsx` — 다중정답 로직 추가
- `src/pages/Practice.tsx` — 동일 다중정답 로직 추가
- `src/styles/quiz.css` — 선택 상태/힌트/제출 버튼 스타일

### 구현 내용
- `answer` 타입: `number | number[]` — 배열이면 다중정답
- `selectedMulti` 상태로 토글 선택 관리
- "N개를 선택하세요 (count/required)" 힌트 표시
- "정답 확인" 버튼: 필요 개수만큼 선택해야 활성화
- `isCorrectAnswer()`: 배열 비교 (정렬 후 매칭)
- `isAnswerIndex()`: 개별 옵션이 정답인지 확인
- CSS: `.quiz-option.selected` (주황 테두리), `.quiz-multi-hint`, `.quiz-submit-btn:disabled`

### 데이터 수정
- `data/aif-c01_with_explanation.json`: 16개 다중정답 문제 수정 (answer: -1 → [1,3] 등)
- `src/data/practice/aifC01.ts`: 14개 다중정답 문제 수정
- 선지 "E. " prefix 버그 수정 (5번째 옵션)

---

## 3. 퀴즈 — 해설 표시 개선

### 변경 파일
- `src/styles/quiz.css` — `.quiz-explanation`에 `white-space: pre-line; line-height: 1.7` 추가

### 구현 내용
- 해설 텍스트의 `\n` 줄바꿈이 화면에 반영되도록 처리
- 기존에는 해설이 한 줄로 표시되어 가독성 나빴음

---

## 4. 퀴즈 — 영어 문제/선지 지원

### 변경 파일
- `src/components/Quiz.tsx` — `QuizQuestion` 인터페이스에 `questionEn?`, `optionsEn?` 추가
- `scraper/convert.cjs` — 영어 필드 변환 지원

### 구현 내용
- `questionEn`, `optionsEn` 옵셔널 필드 추가
- convert.cjs: JSON → TypeScript 변환 시 영어 필드 포함
- 다중정답 배열 출력: `answer: [1, 3]` 형태 지원
- 해설 `\n` 보존 (이전에는 공백으로 치환됨)

---

## 5. 해설 데이터 정리

### 작업 내용
- Q425~Q484 (드릴존 60문제) 해설 정리: 58개 dirty 해설에서 네비 가비지 텍스트 제거
  - "전체N / 60English..." prefix 제거
  - "이전/다음/종료/홈/드릴 존/과제/마이" 네비 텍스트 제거
- Q1~Q424 중 동일 문제 71개에 해설 복사
- 영어 데이터 머지: quiz-2026-04-12.json → 기존 데이터 (118개 JSON, 59개 TS)

---

## 6. 스크래퍼 스크립트 v6

### 파일
- `scraper/scrape-console.js` — 브라우저 콘솔 스크래핑 스크립트 (v6)
- `scraper/scrape-tampermonkey.js` — Tampermonkey 자동 실행 버전
- `scraper/merge-english.cjs` — 영어 데이터 머지 스크립트
- `scraper/convert.cjs` — JSON → TypeScript 변환 스크립트

### 스크래퍼 발전 과정
1. **v1**: 기본 DOM 파싱 → `:has-text()` CSS 에러
2. **v2**: `findBtn()` 텍스트 매칭으로 수정 → 정답/해설 추출 실패 (제출 전 상태)
3. **v3**: 제출 후 추출 로직 추가 → 여전히 정답 -1
4. **v4**: 옵션A 클릭 → 정답 제출 → 추출 → 다음 흐름 → 1문제만 추출 (60개 같은 Q1)
5. **v5**: localStorage 상태 저장 + 페이지 전환 대응 → Q1 성공, 수동 반복 필요
6. **v6 (최종)**:
   - `realClick()`: pointerdown → mousedown → pointerup → mouseup → click + React 핸들러
   - 8개 카테고리 설정: SET_NAME + TOTAL 상단 설정
   - 해설 표시 감지 후 추출 (폴링 최대 5초)
   - 영어: 이미 제출된 상태에서 바로 추출 (재제출 안 함)
   - "마이" 등 네비 잔존 텍스트 정리 강화
   - localStorage 세트별 백업 (`__quiz_{SET_NAME}`)
   - categoryId 필드 자동 포함

### 8개 카테고리

| SET_NAME | 카테고리 | 문제 수 |
|----------|---------|---------|
| ai-ml-fundamentals | Fundamentals of AI & ML | 58 |
| ml-development | ML Development | 48 |
| sagemaker | Amazon SageMaker | 42 |
| genai-fundamentals | Fundamentals of Generative AI | 55 |
| fm-utilization | FM Utilization | 82 |
| fm-evaluation | FM Evaluation and Improvement | 62 |
| responsible-ai | Guidelines for Responsible AI | 32 |
| security-governance | Security, Compliance and Governance | 45 |

**합계**: 424문제

---

## 7. 데이터 파이프라인

```
브라우저 콘솔 (scrape-console.js)
    ↓ JSON 다운로드
data/quiz/{set-name}-{date}.json
    ↓ merge-english.cjs (영어 데이터 병합)
data/aif-c01_with_explanation.json
    ↓ convert.cjs (JSON → TypeScript)
src/data/practice/aifC01.ts
    ↓ Quiz.tsx / Practice.tsx
사이트 퀴즈 UI
```

---

## 8. 기술 이슈 및 해결

| 이슈 | 원인 | 해결 |
|------|------|------|
| `:has-text()` CSS 에러 | Playwright 전용 셀렉터 | JS `findBtn()` 텍스트 매칭 |
| `require` ES module 에러 | `package.json`의 `"type": "module"` | 파일 확장자 `.cjs`로 변경 |
| 정답 추출 실패 (answer: -1) | 제출 전 상태에서 추출 시도 | 옵션 클릭 → 정답 제출 → 대기 → 추출 |
| 60개 동일 Q1 반복 | 페이지 전환 시 스크립트 소멸 | localStorage 상태 저장 + 재실행 |
| 상태 바 텍스트 해설에 혼입 | `document.body`에 div 추가 | 상태 바를 `document.title`로 변경 |
| "다음" 버튼 오탐 | 하단 네비의 "다음"과 문제 "다음" 혼동 | `<button>` 태그 우선 탐색 |
| 영어 전환 시 상태 꼬임 | 영어에서 불필요한 재제출 | 이미 제출된 상태에서 바로 추출 |
| 해설 끝 "마이" 잔존 | 네비 텍스트 정리 불완전 | 정규식 패턴 추가 |
| `element.click()` 미동작 | 사이트의 React 이벤트 핸들링 | `realClick()` — 실제 마우스 이벤트 시퀀스 |
