# Development Log - AWS AIF-C01 Study Site

## 프로젝트 개요

- **프로젝트명**: AWS AIF-C01 Study Site
- **목적**: AWS Certified AI Practitioner (AIF-C01) 자격증 학습 사이트
- **URL**: https://aws.dreamitbiz.com
- **Repository**: https://github.com/aebonlee/aws
- **개발 기간**: 2026년 4월

---

## 개발 히스토리

### Phase 1: 프로젝트 초기화

**커밋**: `15ff0bf` - Initial commit

- GitHub 레포지토리 생성
- 기본 프로젝트 파일 구성

**커밋**: `c278e37` - Create CNAME

- 커스텀 도메인 설정: `aws.dreamitbiz.com`

---

### Phase 2: 전체 사이트 구축

**커밋**: `6ef7efb` - feat: Build AWS AIF-C01 study site with stamp-breaking quiz system

#### 기술 스택 결정
- **React 19 + Vite 7 + TypeScript**: 최신 React SPA
- **Pure CSS with CSS Variables**: Tailwind 미사용, AWS 브랜드 컬러 활용
- **React Router DOM v7**: 클라이언트 사이드 라우팅
- **localStorage**: 학습 진행률 영구 저장

#### 생성된 파일 (30+ 파일)

**설정 파일:**
- `package.json` - React 19, Vite 7, React Router DOM v7
- `vite.config.ts` - base: '/', port: 5182
- `tsconfig.json` - ES2020 target, strict mode
- `index.html` - Noto Sans KR 폰트, SEO 메타태그

**CSS 스타일 시스템 (8파일):**
- `styles/base.css` - CSS 변수 정의 (AWS Orange #FF9900, Accent #232F3E), 기본 스타일
- `styles/navbar.css` - 고정 네비게이션, backdrop-filter blur
- `styles/home.css` - 히어로 섹션, 카테고리 그리드
- `styles/guide-pages.css` - 학습 페이지 2칼럼 레이아웃, sticky 사이드바
- `styles/quiz.css` - 퀴즈 UI (옵션 카드, 정답/오답 스타일, 결과 카드)
- `styles/footer.css` - 다크 푸터 스타일
- `styles/dark-mode.css` - `[data-theme="dark"]` CSS 변수 오버라이드
- `styles/responsive.css` - 1024px, 768px, 480px 브레이크포인트

**Context Providers:**
- `contexts/ThemeContext.tsx` - 다크/라이트 테마 전환, localStorage 저장
- `contexts/ProgressContext.tsx` - 학습 진행 상태 관리
  - `markStudied(categoryId)`: 학습 완료 표시
  - `saveQuizResult(categoryId, score, total)`: 퀴즈 결과 저장
  - `isCleared(categoryId)`: 70% 이상 정답 시 도장 획득
  - `getCompletionRate()`: 전체 진행률 (0-100%)
  - `resetProgress()`: 초기화

**공유 컴포넌트:**
- `components/Quiz.tsx` - 퀴즈 컴포넌트
  - 문제별 4지선다 선택
  - 즉시 정답/오답 확인 + 해설 표시
  - 진행 바 표시
  - 70% 이상 시 "도장 획득!" 결과 화면
  - ProgressContext 연동으로 자동 저장
- `components/GuideLayout.tsx` - 학습 페이지 레이아웃
  - 히어로 섹션 (타이틀, 설명, 배지)
  - IntersectionObserver 기반 사이드바 활성 섹션 추적
  - 2칼럼: sticky 사이드바 + 본문
- `components/TipBox.tsx` - 팁/경고 알림 박스 (info, warning, important, danger)
- `components/ToggleSection.tsx` - 펼침/접기 토글 섹션
- `components/layout/Navbar.tsx` - 상단 네비게이션
  - 카테고리 링크 가로 스크롤
  - 다크/라이트 테마 토글 버튼
  - 모바일 햄버거 메뉴
- `components/layout/Footer.tsx` - 카테고리 링크 포함 다크 푸터
- `layouts/PublicLayout.tsx` - Navbar + main + Footer 래퍼

**라우팅 & 엔트리:**
- `App.tsx` - React.lazy 코드 스플리팅, 전체 라우트 설정
- `main.tsx` - BrowserRouter, StrictMode 엔트리포인트
- `lib/categories.ts` - 8개 카테고리 정보 상수 (id, title, icon, path, questions, weight)

**8개 학습 페이지 (각 카테고리별):**

| 파일 | 카테고리 | 출제비율 | 퀴즈 |
|------|---------|---------|------|
| `pages/AiMlBasics.tsx` | AI와 ML의 기초 | 17.6% | 10문제 |
| `pages/MlDevelopment.tsx` | ML 개발 | 14.1% | 10문제 |
| `pages/SageMaker.tsx` | Amazon SageMaker | 11.9% | 10문제 |
| `pages/GenAiBasics.tsx` | 생성형 AI 기초 | 22.7% | 10문제 |
| `pages/PromptEngineering.tsx` | FM 활용과 프롬프트 엔지니어링 | 24.2% | 10문제 |
| `pages/FmEvaluation.tsx` | FM 성능 평가 방법 | 21.3% | 10문제 |
| `pages/ResponsibleAi.tsx` | Responsible AI | 8.7% | 10문제 |
| `pages/SecurityGovernance.tsx` | 보안, 규정 준수, 거버넌스 | 10.4% | 10문제 |

- 각 페이지는 `data/` 디렉토리의 Notion export 마크다운을 참고하여 작성
- 구성: 표(info-table), 팁박스(TipBox), 토글섹션(ToggleSection), 퀴즈(Quiz)
- 페이지 진입 시 `markStudied()` 자동 호출

**유틸리티 페이지:**
- `pages/Home.tsx` - 히어로 + 카테고리 그리드 + 진행률 바 + 학습 팁
- `pages/NotFound.tsx` - 404 페이지

#### 학습 데이터 원본
`data/` 디렉토리에 Notion에서 export한 9개 마크다운 파일:
- AI/ML 기초, ML 개발, SageMaker, 생성형 AI 기초
- 프롬프트 엔지니어링, FM 성능 평가, Responsible AI, 보안/거버넌스
- AIF-C01 핵심 정리 (출제비율 계산 참고)

---

### Phase 3: CI/CD 설정

**커밋**: `0421ab2` - ci: Add GitHub Pages deployment workflow

- `.github/workflows/deploy.yml` 생성
- main 브랜치 push 시 자동 빌드 & 배포
- Node.js 20, npm ci → npm run build
- `dist/index.html` → `dist/404.html` 복사 (SPA 라우팅 지원)
- GitHub Pages artifact 업로드 & 배포

---

### Phase 4: 메뉴 개선 및 도장깨기/문제풀이 페이지

**커밋**: `f9c923f` - feat: Add stamp progress and practice quiz pages with nav menu updates

#### 변경 사항

**Navbar 수정** (`components/layout/Navbar.tsx`):
- 카테고리 링크에서 이모지 제거
- 도장깨기(`/stamp`)와 문제풀이(`/practice`) 메뉴 추가
- `nav-link-accent` 클래스로 강조 스타일 적용
- 모바일 메뉴에도 동일하게 반영

**도장깨기 대시보드** (`pages/StampBreaking.tsx`):
- 전체 진행률 표시 (퍼센트 + 프로그레스바)
- 획득 도장 수 / 전체 카테고리 수 표시
- 8개 카테고리 카드 그리드
  - 상태별 아이콘: 획득(O), 학습중(책), 미시작(빈칸)
  - 출제비율, 문제 수 배지
  - 퀴즈 결과 표시 (점수/백분율)
- 진행 상황 초기화 버튼 (confirm 확인)
- 카드 클릭 시 해당 카테고리 페이지로 이동

**문제풀이 페이지** (`pages/Practice.tsx`):
- 카테고리 선택 UI (8개 버튼 그리드, 다중 선택 가능)
- 전체/선택 카테고리에서 랜덤 20문제 출제
- 자체 PracticeQuiz 컴포넌트 (정답/오답 확인, 해설)
- 결과 화면 (점수, 백분율, 다시 풀기)

**통합 퀴즈 데이터** (`data/quizData.ts`):
- 8개 카테고리 총 80문제를 `categoryId`와 함께 통합
- `PracticeQuestion` 타입 (QuizQuestion + categoryId)
- Practice 페이지에서 카테고리 필터링에 활용

**라우트 추가** (`App.tsx`):
- `/stamp` → StampBreaking (lazy)
- `/practice` → Practice (lazy)

**CSS 추가:**
- `navbar.css`: `nav-link-accent` 스타일 (AWS Orange 강조)
- `home.css`: stamp-page, practice-page 전체 스타일
- `responsive.css`: 768px 이하 stamp-grid, practice-cat-grid 1열 그리드

---

## 아키텍처 결정 사항

### 1. Pure CSS over Tailwind
- AWS 브랜드 가이드라인에 맞는 커스텀 디자인 필요
- CSS 변수로 테마 시스템 구현 (다크/라이트 전환)
- 프로젝트 규모 대비 Tailwind 오버헤드 불필요

### 2. localStorage 기반 상태 관리
- 서버리스 정적 사이트이므로 서버 DB 없음
- 학습 진행률은 개인 디바이스에서만 필요
- ProgressContext로 중앙 관리, localStorage 자동 동기화

### 3. React.lazy 코드 스플리팅
- 8개 학습 페이지를 lazy loading으로 초기 로드 최소화
- 각 페이지 10-13KB 수준으로 분리

### 4. IntersectionObserver 사이드바
- 스크롤 이벤트 대신 IntersectionObserver API 사용
- 성능 최적화 (throttle/debounce 불필요)
- 현재 읽고 있는 섹션 자동 하이라이트

### 5. 퀴즈 데이터 이중 구조
- 각 카테고리 페이지에 10문제 인라인 (해당 페이지 도장깨기용)
- `data/quizData.ts`에 80문제 통합 (문제풀이 페이지용)
- 카테고리 페이지는 독립적으로 동작, 문제풀이는 통합 데이터 활용

---

## 빌드 & 배포 정보

### 빌드 출력
```
65 modules → dist/
- index.html (0.86 KB)
- CSS: 17.45 KB (gzip: 3.98 KB)
- JS main: 238.52 KB (gzip: 76.69 KB)
- JS pages: 각 10-13 KB
- JS practice: 32.19 KB (80문제 데이터 포함)
```

### 배포 파이프라인
```
git push origin main
  → GitHub Actions 트리거
  → ubuntu-latest, Node.js 20
  → npm ci → npm run build
  → cp dist/index.html dist/404.html
  → upload-pages-artifact → deploy-pages
  → https://aws.dreamitbiz.com 배포 완료
```

---

## 파일별 상세 정보

### 전체 파일 목록 (35파일)

**Config (5):**
| 파일 | 설명 |
|------|------|
| `package.json` | React 19, Vite 7, React Router DOM v7 |
| `tsconfig.json` | ES2020, strict, react-jsx |
| `vite.config.ts` | base: '/', port: 5182, emptyOutDir |
| `index.html` | Noto Sans KR, SEO meta |
| `.github/workflows/deploy.yml` | GitHub Pages 자동 배포 |

**Source (30):**
| 파일 | 라인 수 (약) | 설명 |
|------|------------|------|
| `src/main.tsx` | 13 | BrowserRouter 엔트리 |
| `src/App.tsx` | 46 | lazy routes, Provider 래핑 |
| `src/index.css` | 8 | CSS import 통합 |
| `src/lib/categories.ts` | 20 | 8개 카테고리 상수 |
| `src/data/quizData.ts` | ~200 | 80문제 통합 퀴즈 데이터 |
| `src/contexts/ThemeContext.tsx` | 40 | 다크/라이트 테마 |
| `src/contexts/ProgressContext.tsx` | 95 | 도장깨기 진행률 |
| `src/layouts/PublicLayout.tsx` | 15 | Navbar+main+Footer |
| `src/components/layout/Navbar.tsx` | 79 | 네비게이션 |
| `src/components/layout/Footer.tsx` | ~50 | 푸터 |
| `src/components/GuideLayout.tsx` | ~70 | 학습 페이지 레이아웃 |
| `src/components/Quiz.tsx` | 123 | 퀴즈 컴포넌트 |
| `src/components/TipBox.tsx` | ~15 | 팁 박스 |
| `src/components/ToggleSection.tsx` | ~20 | 토글 섹션 |
| `src/pages/Home.tsx` | ~90 | 메인 페이지 |
| `src/pages/StampBreaking.tsx` | 67 | 도장깨기 대시보드 |
| `src/pages/Practice.tsx` | ~130 | 문제풀이 |
| `src/pages/AiMlBasics.tsx` | 96 | AI/ML 기초 |
| `src/pages/MlDevelopment.tsx` | 109 | ML 개발 |
| `src/pages/SageMaker.tsx` | 95 | SageMaker |
| `src/pages/GenAiBasics.tsx` | 115 | 생성형 AI 기초 |
| `src/pages/PromptEngineering.tsx` | 91 | 프롬프트 엔지니어링 |
| `src/pages/FmEvaluation.tsx` | 99 | FM 성능 평가 |
| `src/pages/ResponsibleAi.tsx` | 94 | Responsible AI |
| `src/pages/SecurityGovernance.tsx` | 97 | 보안/거버넌스 |
| `src/pages/NotFound.tsx` | ~20 | 404 페이지 |
| `src/styles/base.css` | 114 | 기본 스타일 |
| `src/styles/navbar.css` | 37 | 네비게이션 |
| `src/styles/home.css` | 96 | 홈/도장/문제풀이 |
| `src/styles/guide-pages.css` | ~50 | 학습 페이지 |
| `src/styles/quiz.css` | 41 | 퀴즈 |
| `src/styles/footer.css` | ~30 | 푸터 |
| `src/styles/dark-mode.css` | ~20 | 다크 모드 |
| `src/styles/responsive.css` | 32 | 반응형 |
