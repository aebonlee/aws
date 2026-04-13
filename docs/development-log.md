# AWS AIF-C01 Study Platform - 개발 로그

## 프로젝트 개요

AWS Certified AI Practitioner (AIF-C01) 자격증 시험 대비 학습 플랫폼

- **URL:** https://aws.dreamitbiz.com
- **GitHub:** https://github.com/aebonlee/aws
- **기술 스택:** React 19 + TypeScript + Vite 7
- **배포:** GitHub Pages (gh-pages)
- **인증:** Supabase (Google/Kakao OAuth)

---

## Phase 1~4: 기초 구축

### 프로젝트 초기 설정
- React 19 + TypeScript + Vite 7 프로젝트 생성
- CSS 커스텀 프로퍼티 기반 테마 시스템 (라이트/다크)
- Noto Sans KR 폰트, AWS 공식 색상 (#232F3E, #FF9900)

### 학습 페이지 8개 생성
1. AI와 ML의 기초 (AiMlBasics)
2. ML 개발 (MlDevelopment)
3. Amazon SageMaker (SageMaker)
4. 생성형 AI 기초 (GenAiBasics)
5. FM 활용과 프롬프트 엔지니어링 (PromptEngineering)
6. FM 성능 평가 방법 (FmEvaluation)
7. Responsible AI (ResponsibleAi)
8. 보안, 규정 준수, 거버넌스 (SecurityGovernance)

### 공통 컴포넌트
- `GuideLayout`: 사이드바 + 메인 콘텐츠 레이아웃
- `Quiz`: 도장깨기 퀴즈 컴포넌트
- `TipBox`: 팁/경고 박스
- `ToggleSection`: 접기/펼치기 섹션
- `Navbar`: 네비게이션 바 (드롭다운, 모바일 햄버거)
- `Footer`: 푸터

### GitHub Pages 배포
- `gh-pages` 브랜치 자동 배포
- CNAME: aws.dreamitbiz.com
- SPA 라우팅을 위한 404.html

---

## Phase 5: 문제 데이터 수집

### 스크래퍼 개발
- `scraper/scrape-console.js`: 브라우저 콘솔 자동 추출기 (v6)
  - 한/영 문제, 선지, 정답, 해설 자동 추출
  - 실제 마우스 이벤트 시뮬레이션 (React 앱 호환)
  - localStorage 자동 백업
- `scraper/scrape-single.js`: 개별 누락 문제 추출기
  - 특정 문제 번호로 이동 후 추출

### 데이터 구조
- 8개 카테고리 × JSON 파일
- `data/quiz/` 디렉터리에 31개 JSON 파일 저장
- 총 424문제 수집 완료

---

## Phase 6: 인증 시스템

### Supabase 연동
- Google OAuth 로그인
- Kakao OAuth 로그인
- `ProgressContext`: localStorage 기반 학습 진행률 추적
- 로그인 필요 라우트 보호

---

## Phase 7: 커뮤니티 페이지

### 부가 페이지
- 공지사항 (Notices)
- 합격 후기 (SuccessStories)
- 학습 팁 (Tips)
- 자유 게시판 (Board)
- About 페이지 (AWS 자격증 소개)

---

## Phase 8: 424문제 전체 해설 통합 + 문제 뷰어

**커밋:** `1d316f4`
**상세 문서:** [phase8-quiz-integration.md](./phase8-quiz-integration.md)

### 핵심 변경
- `scripts/merge-quiz-data.cjs` 병합 스크립트로 339개 빈 해설 채움 (100%)
- 8개 학습 페이지에서 인라인 10문제 → 전체 문제 로드
- Quiz 컴포넌트에 도장깨기 + 전체보기 듀얼 모드 추가
- Practice 페이지 10/20/전체 문제 수 선택
- 한/영 토글 해설 지원

---

## Phase 9: 메인페이지 프로페셔널 리디자인

**커밋:** `02b7760`
**상세 문서:** [phase9-homepage-redesign.md](./phase9-homepage-redesign.md)

### 핵심 변경
- Hero: AWS Certified 뱃지, 시험 정보 바, CTA 버튼, 도트 패턴 배경
- 플로팅 프로그레스 카드 (SVG 원형 링 + 메트릭 카드)
- 카테고리 카드: Domain 번호, 상단 그라데이션 바
- 4-step 학습 가이드 피처 그리드
- 다크 모드 + 반응형 완전 대응

---

## 프로젝트 구조

```
aws/
├── public/                    # 정적 파일
├── src/
│   ├── components/
│   │   ├── layout/            # Navbar, Footer
│   │   ├── Quiz.tsx           # 퀴즈 컴포넌트 (듀얼 모드)
│   │   ├── GuideLayout.tsx    # 학습 페이지 레이아웃
│   │   ├── TipBox.tsx         # 팁 박스
│   │   └── ToggleSection.tsx  # 접기/펼치기
│   ├── contexts/
│   │   └── ProgressContext.tsx # 진행률 상태 관리
│   ├── data/
│   │   ├── practice/
│   │   │   └── aifC01.ts      # 424문제 데이터 (해설 완비)
│   │   └── quizData.ts        # 퀴즈 데이터 유틸리티
│   ├── lib/
│   │   ├── categories.ts      # 8개 카테고리 정의
│   │   └── supabase.ts        # Supabase 클라이언트
│   ├── pages/
│   │   ├── Home.tsx           # 메인페이지
│   │   ├── Practice.tsx       # 문제풀이
│   │   ├── StampBreaking.tsx  # 도장깨기
│   │   ├── AiMlBasics.tsx     # 학습 페이지 (8개)
│   │   └── ...
│   └── styles/
│       ├── base.css           # CSS 변수, 기본 스타일
│       ├── home.css           # 홈페이지 스타일
│       ├── quiz.css           # 퀴즈 스타일
│       ├── dark-mode.css      # 다크 모드
│       └── responsive.css     # 반응형
├── scraper/                   # 문제 스크래핑 도구
├── scripts/                   # 데이터 처리 스크립트
├── data/                      # 원본 데이터
│   └── quiz/                  # 스크랩 JSON 파일
└── docs/                      # 개발 문서
```

## 카테고리별 문제 현황

| # | 카테고리 | 출제비율 | 문제 수 | 해설 |
|---|---------|---------|---------|------|
| 1 | AI와 ML의 기초 | 15.6% | 60 | 100% |
| 2 | ML 개발 | 12.2% | 46 | 100% |
| 3 | Amazon SageMaker | 10.4% | 38 | 100% |
| 4 | 생성형 AI 기초 | 15.6% | 66 | 100% |
| 5 | FM 활용과 프롬프트 엔지니어링 | 17.4% | 72 | 100% |
| 6 | FM 성능 평가 방법 | 10.4% | 61 | 100% |
| 7 | Responsible AI | 8.7% | 37 | 100% |
| 8 | 보안, 규정 준수, 거버넌스 | 10.4% | 44 | 100% |
| | **합계** | **100%** | **424** | **100%** |

## 날짜

- 마지막 업데이트: 2026-04-13
