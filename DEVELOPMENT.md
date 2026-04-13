# Development Log - AWS Certification Study Site

## 프로젝트 개요

- **프로젝트명**: AWS Certification Study Site
- **목적**: AWS 자격증 학습 사이트 (12개 자격증 학습 콘텐츠 제공)
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

### Phase 5: 자격증 체계 메뉴 및 About 페이지

**커밋**: `e2b548a` - feat: Add certification-based nav with dropdowns and About page

#### 변경 사항

**자격증 데이터 모델** (`lib/certifications.ts`):
- `CertInfo` / `CertLevel` 타입 정의
- 4개 레벨: Foundational, Associate, Professional, Specialty
- 12개 자격증 정보 (code, title, titleKo, path, available, description)
- AIF-C01만 `available: true`, 나머지는 `available: false` (준비 중)

**About 페이지** (`pages/About.tsx`):
- AWS 자격증 선택 방법 (IT 초보 / 비즈니스 직무 / IT 경력자 3가지 경로)
- 자격증 레벨별 구분 (Foundational, Associate, Professional, Specialty)
- 각 자격증 카드 (코드, 영문/한글 명칭, 설명, 학습 가능 여부)
- 직무별 추천 자격증 경로 (8개 직무 카테고리, 15+ 직무)
- 시험 준비 4단계 가이드
- 자격증 취득 후기 (Igor Soroka, Rola Dali)
- PDF 원본 데이터 기반 (`data/AWS_certification_paths.pdf`)

**Navbar 드롭다운 재구성** (`components/layout/Navbar.tsx`):
- 로고: "AWS AIF-C01" → "AWS Certification"
- 메뉴 구조: About | Foundational ▾ | Associate ▾ | Professional ▾ | Specialty ▾ | 도장깨기 | 문제풀이
- 데스크톱: hover 기반 드롭다운 메뉴 (150ms 딜레이로 안정적 동작)
- 모바일: 아코디언 방식 접기/펼치기 메뉴
- 비활성 자격증은 "준비 중" 표시 + 클릭 방지
- 자격증 코드 배지 (CLF-C02, AIF-C01 등) 표시

**CSS 추가/수정:**
- `styles/about.css` (신규): About 페이지 전용 스타일
  - Hero 섹션, 자격증 카드 그리드, 직무별 경로, 준비 단계, 후기
  - 레벨별 컬러 코딩 (Foundational: green, Associate: blue, Professional: purple, Specialty: red)
- `styles/navbar.css` (전면 재작성): 드롭다운 메뉴 스타일
  - `.nav-dropdown`, `.nav-dropdown-menu`, `.nav-dropdown-item`
  - 모바일 아코디언: `.nav-mobile-group`, `.nav-mobile-group-header`
  - 구분선: `.nav-divider`, `.nav-mobile-divider`
- `styles/dark-mode.css`: 드롭다운, About 카드 다크 모드
- `styles/responsive.css`: About 페이지 반응형 (1024px, 768px, 480px)
- `index.css`: `about.css` import 추가

---

### Phase 6: 10개 추가 자격증 학습 페이지

**커밋**: (현재 작업)

#### 개요
AIF-C01 외 나머지 10개 AWS 자격증의 학습 콘텐츠를 일괄 생성.
AWS 공식 시험 가이드 기반으로 각 자격증별 도메인 핵심 내용과 10문제 퀴즈를 구성.

#### 생성된 10개 자격증 페이지

| 파일 | 자격증 | 레벨 | 아이콘 | 섹션 수 | 퀴즈 |
|------|--------|------|--------|---------|------|
| `pages/ClfC02.tsx` | Cloud Practitioner (CLF-C02) | Foundational | ☁️ | 6 | 10문제 |
| `pages/SaaC03.tsx` | Solutions Architect Associate (SAA-C03) | Associate | 🏗️ | 6 | 10문제 |
| `pages/DvaC02.tsx` | Developer Associate (DVA-C02) | Associate | 💻 | 6 | 10문제 |
| `pages/SoaC02.tsx` | SysOps Administrator Associate (SOA-C02) | Associate | 🔧 | 8 | 10문제 |
| `pages/DeaC01.tsx` | Data Engineer Associate (DEA-C01) | Associate | 📊 | 6 | 10문제 |
| `pages/MlaC01.tsx` | ML Engineer Associate (MLA-C01) | Associate | 🧠 | 6 | 10문제 |
| `pages/SapC02.tsx` | Solutions Architect Professional (SAP-C02) | Professional | 🏛️ | 6 | 10문제 |
| `pages/DopC02.tsx` | DevOps Engineer Professional (DOP-C02) | Professional | 🔄 | 8 | 10문제 |
| `pages/ScsC02.tsx` | Security Specialty (SCS-C02) | Specialty | 🔐 | 8 | 10문제 |
| `pages/AnsC01.tsx` | Advanced Networking Specialty (ANS-C01) | Specialty | 🌐 | 6 | 10문제 |

#### 각 페이지 구성 패턴
- **시험 개요:** 시험 코드, 문항 수, 시간, 합격 점수, 비용, 권장 경험
- **도메인별 핵심 내용:** 표(info-table), 목록, TipBox, ToggleSection 활용
- **실력 점검 퀴즈:** 10문제 4지선다, 70% 이상 도장 획득
- **GuideLayout:** 사이드바 네비게이션, IntersectionObserver 연동
- **ProgressContext 연동:** `markStudied(categoryId)` + 퀴즈 결과 저장

#### 각 자격증 도메인 구성

**CLF-C02 Cloud Practitioner (65문제/90분/$100):**
- 클라우드 개념 (24%), 보안 및 규정 준수 (30%), 클라우드 기술 및 서비스 (34%), 결제/요금/지원 (12%)

**SAA-C03 Solutions Architect Associate (65문제/130분/$150):**
- 안전한 아키텍처 (30%), 탄력적 아키텍처 (26%), 고성능 아키텍처 (24%), 비용 최적화 (20%)

**DVA-C02 Developer Associate (65문제/130분/$150):**
- AWS 서비스 개발 (32%), 보안 (26%), 배포 (24%), 문제 해결 및 최적화 (18%)

**SOA-C02 SysOps Administrator Associate (65문제/130분/$150):**
- 모니터링 (20%), 안정성 (16%), 배포/자동화 (18%), 보안 (16%), 네트워킹 (18%), 비용/성능 (12%)

**DEA-C01 Data Engineer Associate (65문제/130분/$150):**
- 데이터 수집/변환 (34%), 데이터 저장소 (26%), 데이터 운영 (22%), 보안/거버넌스 (18%)

**MLA-C01 ML Engineer Associate (65문제/130분/$150):**
- ML 데이터 준비 (28%), 모델 개발 (26%), 배포/오케스트레이션 (22%), 모니터링/보안 (24%)

**SAP-C02 Solutions Architect Professional (75문제/180분/$300):**
- 조직 복잡성 (26%), 새 솔루션 설계 (29%), 기존 솔루션 개선 (25%), 마이그레이션 (20%)

**DOP-C02 DevOps Engineer Professional (75문제/180분/$300):**
- SDLC 자동화 (22%), 구성/IaC (17%), 탄력적 솔루션 (15%), 모니터링 (15%), 인시던트 (14%), 보안 (17%)

**SCS-C02 Security Specialty (65문제/170분/$300):**
- 위협 탐지 (14%), 로깅/모니터링 (18%), 인프라 보안 (20%), IAM (16%), 데이터 보호 (18%), 거버넌스 (14%)

**ANS-C01 Advanced Networking Specialty (65문제/170분/$300):**
- 네트워크 설계 (30%), 구현 (26%), 관리/운영 (20%), 보안/규정 준수 (24%)

#### 수정된 기존 파일

**`App.tsx`:**
- 10개 lazy import 추가 (ClfC02, SaaC03, DvaC02, SoaC02, DeaC01, MlaC01, SapC02, DopC02, ScsC02, AnsC01)
- 10개 Route 추가 (/clf-c02, /saa-c03, /dva-c02, /soa-c02, /dea-c01, /mla-c01, /sap-c02, /dop-c02, /scs-c02, /ans-c01)

**`lib/certifications.ts`:**
- 전체 10개 자격증 `available: false` → `available: true` 변경
- 드롭다운 메뉴에서 "준비 중" 표시 제거, 모든 자격증 클릭 가능

#### 빌드 결과
```
77 modules → dist/
- JS pages: 각 11-20 KB (기존 10-13 KB 대비 증가)
- ClfC02: 19.80 KB (도메인 범위가 가장 넓음)
- ScsC02: 15.93 KB
- DopC02: 15.03 KB
- AnsC01: 14.66 KB
- SoaC02: 14.60 KB
- SapC02: 13.87 KB
- SaaC03: 13.99 KB
- DvaC02: 13.54 KB
- MlaC01: 12.05 KB
- DeaC01: 11.19 KB
```

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
77 modules → dist/
- index.html (0.86 KB)
- CSS: 24.33 KB (gzip: 4.96 KB)
- JS main: 244.74 KB (gzip: 78.48 KB)
- JS About: 9.34 KB (gzip: 2.97 KB)
- JS AIF-C01 pages: 각 10-13 KB (8개)
- JS 추가 자격증 pages: 각 11-20 KB (10개)
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

### 전체 파일 목록 (49파일)

**Config (5):**
| 파일 | 설명 |
|------|------|
| `package.json` | React 19, Vite 7, React Router DOM v7 |
| `tsconfig.json` | ES2020, strict, react-jsx |
| `vite.config.ts` | base: '/', port: 5182, emptyOutDir |
| `index.html` | Noto Sans KR, SEO meta |
| `.github/workflows/deploy.yml` | GitHub Pages 자동 배포 |

**Source (40):**
| 파일 | 라인 수 (약) | 설명 |
|------|------------|------|
| `src/main.tsx` | 13 | BrowserRouter 엔트리 |
| `src/App.tsx` | 50 | lazy routes, Provider 래핑 |
| `src/index.css` | 9 | CSS import 통합 |
| `src/lib/categories.ts` | 20 | 8개 카테고리 상수 |
| `src/lib/certifications.ts` | ~120 | 12개 자격증 정보 (4레벨) |
| `src/data/quizData.ts` | ~200 | 80문제 통합 퀴즈 데이터 |
| `src/contexts/ThemeContext.tsx` | 40 | 다크/라이트 테마 |
| `src/contexts/ProgressContext.tsx` | 95 | 도장깨기 진행률 |
| `src/layouts/PublicLayout.tsx` | 15 | Navbar+main+Footer |
| `src/components/layout/Navbar.tsx` | ~140 | 드롭다운 네비게이션 |
| `src/components/layout/Footer.tsx` | ~50 | 푸터 |
| `src/components/GuideLayout.tsx` | ~70 | 학습 페이지 레이아웃 |
| `src/components/Quiz.tsx` | 123 | 퀴즈 컴포넌트 |
| `src/components/TipBox.tsx` | ~15 | 팁 박스 |
| `src/components/ToggleSection.tsx` | ~20 | 토글 섹션 |
| `src/pages/About.tsx` | ~150 | AWS 자격증 소개 |
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
| `src/pages/ClfC02.tsx` | ~200 | Cloud Practitioner (CLF-C02) |
| `src/pages/SaaC03.tsx` | ~148 | Solutions Architect Associate (SAA-C03) |
| `src/pages/DvaC02.tsx` | ~148 | Developer Associate (DVA-C02) |
| `src/pages/SoaC02.tsx` | ~162 | SysOps Administrator (SOA-C02) |
| `src/pages/DeaC01.tsx` | ~143 | Data Engineer Associate (DEA-C01) |
| `src/pages/MlaC01.tsx` | ~145 | ML Engineer Associate (MLA-C01) |
| `src/pages/SapC02.tsx` | ~168 | Solutions Architect Pro (SAP-C02) |
| `src/pages/DopC02.tsx` | ~190 | DevOps Engineer Pro (DOP-C02) |
| `src/pages/ScsC02.tsx` | ~185 | Security Specialty (SCS-C02) |
| `src/pages/AnsC01.tsx` | ~175 | Advanced Networking (ANS-C01) |
| `src/pages/NotFound.tsx` | ~20 | 404 페이지 |
| `src/styles/base.css` | 114 | 기본 스타일 |
| `src/styles/navbar.css` | ~90 | 네비게이션 + 드롭다운 |
| `src/styles/home.css` | 96 | 홈/도장/문제풀이 |
| `src/styles/about.css` | ~110 | About 페이지 |
| `src/styles/guide-pages.css` | ~50 | 학습 페이지 |
| `src/styles/quiz.css` | 41 | 퀴즈 |
| `src/styles/footer.css` | ~30 | 푸터 |
| `src/styles/dark-mode.css` | ~28 | 다크 모드 |
| `src/styles/responsive.css` | 32 | 반응형 |

---

### Phase 7: Supabase 인증 + 커뮤니티 + EmailJS 연동

*(Phase 3-6 이후, Phase 7은 별도 커밋으로 진행됨)*

---

### Phase 10: 대시보드 + 3단계 도장 + 섹션별 학습추적 + 요금제 결제

#### 개요
- **3단계 도장 시스템**: 단일 합격→ Bronze/Silver/Gold 3티어
- **섹션별 학습 추적**: 각 학습 섹션 완료/재복습 상태 관리
- **개인 대시보드**: 로그인 후 종합 학습 현황 페이지
- **요금제 + PortOne 결제**: 1개월/3개월 요금제 + 카드 결제

#### ProgressContext 확장 (`src/contexts/ProgressContext.tsx`)
- **스키마 마이그레이션**: v1 → v2 자동 변환 (`_schemaVersion` 체크)
- **새 타입**: `SectionProgress`, `QuizAttempt`, `StampTier`, `OverallStats`
- **StampTier 계산**: Bronze(70%+), Silver(85%+), Gold(100% 또는 90%+ 3회 연속)
- **새 메서드 7개**: `markSectionComplete`, `markSectionNeedsReview`, `getSectionProgress`, `getStampTier`, `getQuizHistory`, `getOverallStats`, `recordStudyVisit`
- **퀴즈 히스토리**: `quizHistory` 배열 (최대 20건), 자동 티어 재계산

#### categories.ts 섹션 추가 (`src/lib/categories.ts`)
- `SectionInfo` 인터페이스 + 각 카테고리에 `sections: SectionInfo[]` 추가
- 8개 카테고리 × 4~5섹션 = 총 35개 학습 섹션

#### 신규 컴포넌트
| 파일 | 설명 |
|------|------|
| `src/components/SectionStatusBar.tsx` | 섹션 학습완료/재복습 토글 바 |
| `src/components/StampTierBadge.tsx` | Gold/Silver/Bronze/None 도장 뱃지 (sm/md/lg) |

#### 수정된 컴포넌트
| 파일 | 변경 내용 |
|------|----------|
| `src/components/GuideLayout.tsx` | 사이드바 섹션 상태 아이콘 (✅/🔄) + 미니 진행률 바 |
| `src/components/Quiz.tsx` | 결과에 StampTierBadge + 다음 티어 안내 + 히스토리 dots |
| `src/pages/StampBreaking.tsx` | 3단계 도장 + 히어로 통계 + 티어 가이드 + 히스토리 dots |

#### 8개 학습 페이지 수정
모든 학습 페이지에 `<SectionStatusBar>` 추가 (퀴즈 섹션 제외):
- AiMlBasics, MlDevelopment, SageMaker, GenAiBasics
- PromptEngineering, FmEvaluation, ResponsibleAi, SecurityGovernance

#### 신규 페이지
| 파일 | 설명 |
|------|------|
| `src/pages/Dashboard.tsx` | 개인 대시보드 (프로그레스 링, 도장 컬렉션, 카테고리 상세, 퀴즈 타임라인, 취약 영역) |
| `src/pages/Pricing.tsx` | 요금제 (1개월 9,900원 / 3개월 19,900원) + PortOne 결제 |
| `src/lib/portone.ts` | PortOne(아임포트) SDK 래퍼 (`requestPayment()`) |

#### 신규 CSS
| 파일 | 설명 |
|------|------|
| `src/styles/dashboard.css` | 대시보드 전체 스타일 |
| `src/styles/pricing.css` | 요금제 카드, FAQ 스타일 |

#### 수정된 CSS/설정
| 파일 | 변경 내용 |
|------|----------|
| `src/styles/guide-pages.css` | SectionStatusBar, StampTierBadge, 퀴즈 히스토리 dots, 티어 가이드 스타일 |
| `src/styles/dark-mode.css` | Dashboard, Pricing, SectionStatusBar, StampTierBadge 다크 모드 |
| `src/styles/responsive.css` | Dashboard(768px/480px), Pricing(768px), SectionStatusBar(768px) 반응형 |
| `src/index.css` | dashboard.css, pricing.css import 추가 |
| `src/App.tsx` | /dashboard (ProtectedRoute), /pricing 라우트 추가 |
| `src/components/layout/Navbar.tsx` | 대시보드(로그인시)/요금제 메뉴 추가 |
| `index.html` | PortOne SDK 스크립트 추가 |

#### 빌드 결과
```
134 modules → dist/
빌드 성공
```

---

### Phase 11: 네비게이션 메뉴 재구조화 + 유저 툴팁

#### 개요
상단 메뉴가 4개 레벨 드롭다운(Foundational/Associate/Professional/Specialty)으로 복잡했던 구조를 단순화.
유저 아바타에 풍선도움말(대시보드/개인정보/로그아웃) 추가.

#### 메뉴 구조 변경

**Before (Phase 10):**
```
About | Foundational ▾ | Associate ▾ | Professional ▾ | Specialty ▾ | 도장깨기 | 문제풀이 | 대시보드 | 요금제 | 커뮤니티 ▾
```

**After (Phase 11):**
```
About | AWS Certification ▾ | AIF-C01 AI Practitioner ▾ | 도장깨기 | 문제풀이 | 커뮤니티 ▾ | 요금제
```

#### AWS Certification 메가 드롭다운
- 4개 레벨 드롭다운 → 1개 **"AWS Certification" 메가 메뉴**로 통합
- 레벨별 섹션 헤더 (Foundational 기초 / Associate 어소시에이트 / Professional 프로페셔널 / Specialty 전문 분야)
- 각 섹션 아래에 해당 자격증 항목 배치 (2차→3차 메뉴 구조)

#### AIF-C01 AI Practitioner 드롭다운
- AIF-C01 학습 콘텐츠 전용 드롭다운 신설
- 8개 학습 카테고리 표시 (아이콘 + 제목 + 출제비율 weight 뱃지)

#### 유저 툴팁 (풍선도움말)
- 로그인 유저 아바타/이름 hover 시 드롭다운 표시
- **대시보드** → `/dashboard` 링크
- **개인정보** → `/profile` 링크
- **로그아웃** 버튼
- 대시보드 메뉴를 메인 네비에서 제거, 유저 툴팁으로 이동

#### 수정된 파일
| 파일 | 변경 내용 |
|------|----------|
| `src/components/layout/Navbar.tsx` | 메가 메뉴 구조, AIF-C01 드롭다운, 유저 툴팁 |
| `src/styles/navbar.css` | `.nav-mega-menu`, `.nav-mega-group`, `.nav-mega-header`, `.nav-dropdown-weight`, `.nav-user-tooltip`, `.nav-mobile-level-header` 추가 |

#### 모바일 네비도 동일 구조 반영
- **AWS Certification** 아코디언 (내부에 레벨별 헤더 + 자격증 목록)
- **AIF-C01 AI Practitioner** 아코디언 (8개 학습 카테고리)

#### 빌드 결과
```
134 modules → dist/
빌드 성공
```

---

### Phase 12: 빈 페이지 수정 + About 사이드바 + PDF 뷰어 + PortOne 실정보

#### 커밋 목록
- `8cc39e9` — fix: Supabase 빈 페이지 수정 (fallback 크리덴셜)
- `0cf0e00` — fix: AIF-C01 드롭다운 이모지 제거
- `95a455b` — feat: About 사이드바 + PDF 뷰어 + PortOne 실정보

#### 빈 페이지 수정 (`src/lib/supabase.ts`)
- **원인**: GitHub Actions 빌드 시 `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` 환경변수 부재
- `createClient(undefined, undefined)` 호출로 전체 React 앱 크래시
- **수정**: Supabase anon key(공개키)를 fallback 값으로 하드코딩
- `.github/workflows/deploy.yml`에 `${{ secrets.VITE_SUPABASE_* }}` env 전달 추가

#### About 페이지 사이드바 레이아웃 (`src/pages/About.tsx`)
- **Before**: 단일 컬럼 긴 페이지
- **After**: 왼쪽 sticky 사이드바 + 오른쪽 콘텐츠 2칼럼
- IntersectionObserver로 스크롤 시 현재 섹션 자동 하이라이트
- 6개 섹션: 자격증 선택 방법 / 레벨별 구분 / 직무별 추천 경로 / 시험 준비 4단계 / 취득 후기 / 자격증 경로 PDF
- 1024px 이하에서 사이드바 → 상단 가로 탭 변환

#### PDF 미리보기 (`public/AWS_certification_paths.pdf`)
- `data/AWS_certification_paths.pdf` → `public/` 복사 (static asset)
- iframe 기반 PDF 임베딩 (700px 높이)
- "PDF 새 탭에서 열기" 버튼

#### PortOne 실제 가맹점 정보 (`src/lib/portone.ts`)
- 가맹점 코드: `imp61949262` (환경변수 `VITE_IMP_CODE`)
- PG 제공자: `html5_inicis.MOIkorcom1` (환경변수 `VITE_PG_PROVIDER`)
- `.env`에 `VITE_IMP_CODE`, `VITE_PG_PROVIDER`, `VITE_SITE_URL` 추가

#### AIF-C01 드롭다운 이모지 제거 (`src/components/layout/Navbar.tsx`)
- 데스크톱/모바일 AIF-C01 메뉴 항목에서 `cat.icon` 이모지 삭제

#### 수정된 파일
| 파일 | 변경 내용 |
|------|----------|
| `src/lib/supabase.ts` | Supabase fallback 크리덴셜 추가 |
| `.github/workflows/deploy.yml` | VITE_SUPABASE 환경변수 전달 |
| `src/pages/About.tsx` | 사이드바 레이아웃 + PDF 뷰어 + IntersectionObserver |
| `src/styles/about.css` | `.about-layout`, `.about-sidebar`, `.about-pdf-viewer` 등 |
| `src/styles/responsive.css` | About 사이드바 반응형 (1024px) |
| `src/styles/dark-mode.css` | About 사이드바/PDF 다크 모드 |
| `src/lib/portone.ts` | 실제 가맹점 코드 + PG 제공자 |
| `src/components/layout/Navbar.tsx` | AIF-C01 이모지 제거 |
| `public/AWS_certification_paths.pdf` | PDF static asset (신규) |

#### 빌드 결과
```
134 modules → dist/
빌드 성공
```

---

### Phase 13: 홈페이지 진행률 링 수정 + 커뮤니티 DB 스키마

#### 홈페이지 진행률 계산 수정 (`src/pages/Home.tsx`)
- **문제**: `getCompletionRate()`가 퀴즈 합격(completedAt)만 카운트 → 학습 완료 6/8인데 0% 표시
- **수정**: 학습(studied) 50% + 퀴즈합격(cleared) 50% 가중 진행률
- `completionRate = Math.round(((studiedCount * 50 + clearedCount * 50) / (8 * 100)) * 100)`
- 예: 6/8 학습 + 0/8 합격 → 38%, 8/8 학습 + 8/8 합격 → 100%

#### 커뮤니티 SQL 스크립트 (`sql/community.sql`)
Supabase에서 실행할 커뮤니티 테이블 생성 SQL (신규 파일):

**테이블 8개:**
| 테이블 | 용도 |
|--------|------|
| `profiles` | 사용자 프로필 (auth.users 1:1, 자동 생성 트리거) |
| `notices` | 공지사항 (관리자 전용 작성) |
| `posts` | 게시판 (general/question/discussion/study-group) |
| `success_stories` | 시험합격수기 (점수, 학습기간, 난이도 포함) |
| `tips` | 시험팁공유 (study-method/exam-strategy/resource 등) |
| `comments` | 댓글 (polymorphic, 대댓글 지원) |
| `likes` | 좋아요 (유저당 1회, UNIQUE 제약) |
| `reports` | 신고 (spam/abuse/inappropriate 등) |

**자동화:** 프로필 자동생성 트리거, updated_at 갱신, comment_count/like_count 자동 카운트

**보안:** 전체 RLS 활성화, SELECT 모두 허용, INSERT 본인만, DELETE 본인+관리자, notices 관리자 전용

**뷰 5개:** `*_with_author` (작성자 정보 조인)

#### 수정/추가 파일
| 파일 | 변경 내용 |
|------|----------|
| `src/pages/Home.tsx` | 진행률 가중 계산 (studied 50% + cleared 50%) |
| `sql/community.sql` | 커뮤니티 8테이블 + 트리거 + RLS + 뷰 (신규) |

#### 빌드 결과
```
134 modules → dist/
빌드 성공
```
