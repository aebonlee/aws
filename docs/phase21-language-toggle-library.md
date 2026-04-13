# Phase 21: 사이트 전체 한/영 토글 + 자료실 페이지 + 영어 퀴즈 데이터 수정

## 개발 일자
2026-04-14

## 개요
1. 퀴즈 영어 번역 데이터 누락 수정 (424문제 전체)
2. 사이트 전체 한/영 언어 토글 기능
3. 자료실(Library) 페이지 신규 생성

---

## 1. 퀴즈 영어 번역 데이터 수정

### 문제
- "영어로 보기" 버튼 클릭 시 해설만 영어로 전환되고 문제/선택지는 한국어 유지
- 원인: TypeScript 변환 시 424개 문제 중 59개만 `questionEn`/`optionsEn` 포함, 338개는 `explanationEn`만 포함
- JSON 소스 파일에는 모든 영어 데이터가 존재했으나 변환 과정에서 누락

### 해결
- `scripts/patch-english.cjs` 스크립트 작성
- `data/quiz/` 디렉토리의 20+ JSON 소스 파일에서 영어 데이터 추출
- 한국어 문제 텍스트 매칭 (정확 매칭 → 50자 부분 매칭 → 30자 부분 매칭)
- 1차: 377/424 패치, 2차: 423/424 패치, 마지막 1개 수동 추가
- **최종: 424/424 문제 영어 번역 완료**

### 수정 파일
- `src/data/practice/aifC01.ts` — 365개 문제에 `questionEn`, `optionsEn` 추가
- `scripts/patch-english.cjs` — 패치 유틸리티 스크립트 (신규)

---

## 2. 사이트 전체 한/영 언어 토글

### 기능
- 네비게이션 바에 EN/KO 토글 버튼 추가 (테마 토글 옆)
- `localStorage('aws-lang')`에 언어 설정 저장
- 전역 `LanguageContext`로 모든 컴포넌트에서 `useLang()` 훅 사용
- 퀴즈 페이지의 로컬 언어 상태를 전역으로 통합

### 적용 범위
- Navbar: 메뉴 항목 (자료실/Library, 요금제/Pricing)
- Quiz.tsx: 문제, 선택지, 해설, UI 레이블
- Practice.tsx: 카테고리 선택, 결과, 버튼 텍스트
- Library.tsx: 문서 제목, 설명, 버튼 텍스트

### 신규/수정 파일
- `src/contexts/LanguageContext.tsx` — 신규 (LanguageProvider, useLang 훅)
- `src/App.tsx` — LanguageProvider 래핑 추가
- `src/components/layout/Navbar.tsx` — EN/KO 토글 버튼 추가
- `src/components/Quiz.tsx` — useLang() 사용, getDisplayTexts() 헬퍼
- `src/pages/Practice.tsx` — useLang() 사용, 로컬 lang 제거
- `src/styles/navbar.css` — 언어 토글 스타일

### 기술 구현
```typescript
// LanguageContext 패턴
export type Lang = 'ko' | 'en'
const [lang, setLang] = useState<Lang>(() => {
  const saved = localStorage.getItem('aws-lang')
  return (saved === 'en' || saved === 'ko') ? saved : 'ko'
})
const toggleLang = () => setLang(prev => prev === 'ko' ? 'en' : 'ko')
```

---

## 3. 자료실(Library) 페이지

### 기능
- 왼쪽 사이드바에 3개 PDF 문서 목록
- 오른쪽에 선택한 PDF의 iframe 뷰어
- 다운로드 / 새 탭에서 열기 버튼
- 한/영 언어 지원
- 다크모드 지원
- 모바일 반응형 (사이드바 → 가로 스크롤)

### PDF 문서 목록
| ID | 한국어 제목 | 파일 |
|---|---|---|
| exam-guide | AIF-C01 시험 가이드 | /ai-practitioner-01.pdf |
| summary | AIF-C01 핵심 정리 | /c.pdf |
| cert-paths | AWS 인증 경로 | /AWS_certification_paths.pdf |

### 신규/수정 파일
- `src/pages/Library.tsx` — 신규 페이지 컴포넌트
- `src/App.tsx` — `/library` 라우트 추가
- `src/components/layout/Navbar.tsx` — "자료실" 메뉴 추가 (데스크톱 + 모바일)
- `src/styles/guide-pages.css` — library 레이아웃 CSS 추가
- `src/styles/dark-mode.css` — library 다크모드 추가

### 레이아웃 구조
```
┌─────────────────────────────────────────────┐
│ Navbar                                       │
├──────────┬──────────────────────────────────┤
│ Sidebar  │ Viewer Header (제목 + 버튼)       │
│ 280px    │──────────────────────────────────│
│          │                                   │
│ [Doc 1]  │  iframe PDF Viewer               │
│ [Doc 2]  │  (calc(100vh - nav - 140px))     │
│ [Doc 3]  │                                   │
│          │                                   │
└──────────┴──────────────────────────────────┘
```

---

## 커밋 히스토리
- `df391e6` — feat: Add site-wide language toggle and fix English quiz translations
- `a3d6f0e` — feat: Add Library page with PDF viewer and sidebar navigation

## 배포
- GitHub Pages: `cp CNAME dist/CNAME && npx gh-pages -d dist --no-history`
