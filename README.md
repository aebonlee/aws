# AWS Certification Study Site

AWS 자격증 학습 사이트 - 12개 자격증 학습 콘텐츠 제공 (AIF-C01 + 10개 추가 자격증)

**Live**: [https://aws.dreamitbiz.com](https://aws.dreamitbiz.com)

## Overview

AWS 자격증 체계(Foundational, Associate, Professional, Specialty) 12개 자격증의
핵심 내용을 정리한 학습 사이트입니다.
도장깨기 시스템으로 학습 진행률을 추적하고, 퀴즈로 실력을 점검할 수 있습니다.

## Tech Stack

| 항목 | 기술 |
|------|------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Routing | React Router DOM v7 |
| Styling | Pure CSS (CSS Variables, No Tailwind) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |
| Font | Noto Sans KR (Google Fonts) |

## Project Structure

```
aws/
├── .github/workflows/deploy.yml   # GitHub Pages 자동 배포
├── data/                           # 학습 원본 데이터 (Notion export)
├── public/favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # 자격증 레벨별 드롭다운 네비게이션
│   │   │   └── Footer.tsx          # 하단 푸터
│   │   ├── GuideLayout.tsx         # 학습 페이지 레이아웃 (사이드바 + 본문)
│   │   ├── Quiz.tsx                # 퀴즈 컴포넌트 (정답 확인, 도장깨기 연동)
│   │   ├── TipBox.tsx              # 팁/경고/중요 알림 박스
│   │   └── ToggleSection.tsx       # 펼침/접기 토글 섹션
│   ├── contexts/
│   │   ├── ThemeContext.tsx         # 다크/라이트 테마 (localStorage 저장)
│   │   └── ProgressContext.tsx      # 도장깨기 진행률 (localStorage 저장)
│   ├── data/
│   │   └── quizData.ts             # 전체 80문제 통합 퀴즈 데이터
│   ├── layouts/
│   │   └── PublicLayout.tsx         # Navbar + main + Footer 래퍼
│   ├── lib/
│   │   ├── categories.ts           # 8개 카테고리 정보 상수
│   │   └── certifications.ts       # 12개 자격증 정보 (4레벨)
│   ├── pages/
│   │   ├── About.tsx               # AWS 자격증 종합 소개
│   │   ├── Home.tsx                # 메인 페이지 (카테고리 그리드, 진행률)
│   │   ├── StampBreaking.tsx       # 도장깨기 현황 대시보드
│   │   ├── Practice.tsx            # 문제풀이 (랜덤 출제, 카테고리 필터)
│   │   ├── AiMlBasics.tsx          # AI/ML 기초 (AIF-C01)
│   │   ├── MlDevelopment.tsx       # ML 개발 (AIF-C01)
│   │   ├── SageMaker.tsx           # Amazon SageMaker (AIF-C01)
│   │   ├── GenAiBasics.tsx         # 생성형 AI 기초 (AIF-C01)
│   │   ├── PromptEngineering.tsx   # 프롬프트 엔지니어링 (AIF-C01)
│   │   ├── FmEvaluation.tsx        # FM 성능 평가 (AIF-C01)
│   │   ├── ResponsibleAi.tsx       # Responsible AI (AIF-C01)
│   │   ├── SecurityGovernance.tsx  # 보안/거버넌스 (AIF-C01)
│   │   ├── ClfC02.tsx              # Cloud Practitioner (CLF-C02)
│   │   ├── SaaC03.tsx              # Solutions Architect Associate (SAA-C03)
│   │   ├── DvaC02.tsx              # Developer Associate (DVA-C02)
│   │   ├── SoaC02.tsx              # SysOps Administrator (SOA-C02)
│   │   ├── DeaC01.tsx              # Data Engineer Associate (DEA-C01)
│   │   ├── MlaC01.tsx              # ML Engineer Associate (MLA-C01)
│   │   ├── SapC02.tsx              # Solutions Architect Pro (SAP-C02)
│   │   ├── DopC02.tsx              # DevOps Engineer Pro (DOP-C02)
│   │   ├── ScsC02.tsx              # Security Specialty (SCS-C02)
│   │   ├── AnsC01.tsx              # Advanced Networking (ANS-C01)
│   │   └── NotFound.tsx            # 404 페이지
│   ├── styles/
│   │   ├── base.css                # CSS 변수, 기본 스타일
│   │   ├── navbar.css              # 네비게이션 스타일
│   │   ├── home.css                # 홈/도장깨기/문제풀이 스타일
│   │   ├── about.css               # About 페이지 스타일
│   │   ├── guide-pages.css         # 학습 페이지 레이아웃 스타일
│   │   ├── quiz.css                # 퀴즈 컴포넌트 스타일
│   │   ├── footer.css              # 푸터 스타일
│   │   ├── dark-mode.css           # 다크 모드 변수 오버라이드
│   │   └── responsive.css          # 반응형 미디어 쿼리
│   ├── App.tsx                     # 라우트 설정 (lazy loading)
│   ├── main.tsx                    # 엔트리포인트
│   └── index.css                   # CSS 파일 통합 import
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── CNAME                           # aws.dreamitbiz.com
└── DEVELOPMENT.md                  # 개발 내역 상세 문서
```

## Features

### 0. AWS 자격증 종합 안내 (About)
- 자격증 레벨별 구분: Foundational / Associate / Professional / Specialty
- 12개 AWS 자격증 상세 소개
- 직무별 추천 자격증 경로 (8개 직무 카테고리, 15+ 직무)
- 시험 준비 4단계 가이드
- 자격증 취득 후기

### 1. AIF-C01 학습 가이드 (8개 카테고리)
- AI/ML 기초 (17.6%, 60문제)
- ML 개발 (14.1%, 46문제)
- Amazon SageMaker (11.9%, 38문제)
- 생성형 AI 기초 (22.7%, 66문제)
- FM 활용과 프롬프트 엔지니어링 (24.2%, 72문제)
- FM 성능 평가 방법 (21.3%, 61문제)
- Responsible AI (8.7%, 37문제)
- 보안, 규정 준수, 거버넌스 (10.4%, 44문제)

### 1-1. 10개 추가 자격증 학습 가이드
각 자격증별 시험 개요, 도메인별 핵심 내용 정리, 10문제 실력 점검 퀴즈 제공:

| 레벨 | 자격증 | 코드 | 경로 |
|------|--------|------|------|
| Foundational | Cloud Practitioner | CLF-C02 | `/clf-c02` |
| Associate | Solutions Architect | SAA-C03 | `/saa-c03` |
| Associate | Developer | DVA-C02 | `/dva-c02` |
| Associate | SysOps Administrator | SOA-C02 | `/soa-c02` |
| Associate | Data Engineer | DEA-C01 | `/dea-c01` |
| Associate | Machine Learning Engineer | MLA-C01 | `/mla-c01` |
| Professional | Solutions Architect | SAP-C02 | `/sap-c02` |
| Professional | DevOps Engineer | DOP-C02 | `/dop-c02` |
| Specialty | Security | SCS-C02 | `/scs-c02` |
| Specialty | Advanced Networking | ANS-C01 | `/ans-c01` |

### 2. 도장깨기 시스템
- 각 카테고리별 10문제 퀴즈
- 70% 이상 정답 시 도장 획득
- 진행률 localStorage 자동 저장
- 도장깨기 현황 대시보드 (`/stamp`)

### 3. 문제풀이 모드
- 전체 80문제 풀에서 랜덤 20문제 출제
- 카테고리 필터링 가능
- 정답/오답 즉시 확인 및 해설 제공

### 4. UI/UX
- 자격증 레벨별 드롭다운 네비게이션 (Foundational/Associate/Professional/Specialty)
- 다크/라이트 테마 전환
- 반응형 디자인 (모바일 아코디언 메뉴)
- IntersectionObserver 기반 사이드바 활성 섹션 추적
- 코드 스플리팅 (React.lazy)

## Development

```bash
# Install dependencies
npm install

# Dev server (http://localhost:5182)
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

## Deployment

GitHub Pages 자동 배포 (main 브랜치 push 시 GitHub Actions 실행):

1. `npm ci` → `npm run build`
2. `dist/index.html` → `dist/404.html` 복사 (SPA 라우팅)
3. GitHub Pages에 `dist/` 폴더 배포

## Design System

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary` | `#FF9900` | AWS Orange - 주요 강조색 |
| `--primary-dark` | `#EC7211` | 호버/액티브 상태 |
| `--accent` | `#232F3E` | AWS Dark - 헤더/로고 |
| `--success` | `#10b981` | 도장 획득, 정답 |
| `--danger` | `#ef4444` | 오답, 위험 경고 |
| `--info` | `#3b82f6` | 정보 팁 |
