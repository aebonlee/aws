# Phase 9: 메인페이지 프로페셔널 리디자인

## 개요

AIF-C01 자격증 대비 사이트답게 메인 홈페이지를 세련되고 전문적인 디자인으로 전면 개편했습니다.
AWS Certified 브랜딩을 강화하고, 학습 현황을 직관적으로 보여주는 UI를 구현했습니다.

## 변경 내역

### 1. Hero 섹션 리디자인

**파일:** `src/pages/Home.tsx`, `src/styles/home.css`

**변경 전:** 단순 그라데이션 배경 + 제목 + 설명 + 숫자 3개
**변경 후:**
- 도트 패턴 배경 오버레이 (subtle radial-gradient)
- `AWS Certified` pill 뱃지 (상단 라벨)
- 큰 타이틀: "AI Practitioner / AIF-C01"
- 시험 정보 바: 65문제 · 90분 · 합격선 70% · 150 USD
- CTA 버튼 2개: "학습 시작하기" (primary) + "문제풀이" (ghost)
- 통계 카드: 유리 효과 배경에 구분선 포함 (8 학습 도메인 | 424 실전 문제 | 100% 해설 완비)

### 2. 학습 현황 카드 (Progress Section)

**변경 전:** 단순 프로그레스 바
**변경 후:**
- Hero와 겹치는 플로팅 카드 (negative margin)
- SVG 원형 프로그레스 링 (완료율 % 표시)
- 3개 메트릭 카드: 📖 학습 완료, 🏆 도장 획득, 📝 전체 문제
- 모든 도장 획득 시 성공 배너

### 3. 카테고리 그리드 개선

**변경 전:** 왼쪽 주황 보더 카드
**변경 후:**
- "Domain 1~8" 라벨 추가
- 상단 그라데이션 바 (hover: 주황, cleared: 초록)
- cleared 상태에서 초록 테두리
- stamp 아이콘을 헤더 우측에 배치 (🏆/📖/🔒)
- 하단에 태그 + 점수 표시

### 4. 학습 가이드 (Features Grid)

**변경 전:** 불릿 리스트 형태의 study-tip 박스
**변경 후:**
- 4-step 피처 카드 그리드
- 각 단계별 원형 번호 아이콘 (그라데이션)
- 단계: ① 도메인별 학습 → ② 도장깨기 퀴즈 → ③ 전체 문제 복습 → ④ 실전 모의고사
- 배경 구분 (bg-section)

### 5. 초기화 버튼 스타일링

- 기존 인라인 스타일 → `.btn-reset` 클래스
- hover 시 빨간 테두리/텍스트 변경

### 6. 다크 모드 지원

**파일:** `src/styles/dark-mode.css`

- `.progress-card`, `.progress-metric`, `.feature-card` 다크 테마 추가
- `.btn-ghost`, `.btn-reset` 다크 모드 호환

### 7. 반응형 대응

**파일:** `src/styles/responsive.css`

- 1024px: features-grid 2열
- 768px: hero 축소, stats 래핑, CTA 세로 배치, progress 세로 정렬, features 1열
- 480px: hero 패딩/폰트 축소, progress-card 패딩 축소

## 디자인 컨셉

- **색상:** AWS 공식 색상 (#232F3E 다크, #FF9900 주황) 기반
- **타이포그래피:** 계층적 폰트 사이즈 (2.8rem 타이틀 ~ 0.78rem 라벨)
- **레이아웃:** 카드 기반 UI, 플로팅 프로그레스 카드
- **인터랙션:** hover 시 translateY + shadow, 상단 바 페이드인
- **배경:** 도트 패턴 + 유리 효과(글래스모피즘) 통계 카드

## 수정 파일

| 파일 | 변경 |
|------|------|
| `src/pages/Home.tsx` | 전면 리디자인 |
| `src/styles/home.css` | Hero, Progress, Category, Features 스타일 |
| `src/styles/dark-mode.css` | 새 컴포넌트 다크 테마 |
| `src/styles/responsive.css` | 새 컴포넌트 반응형 |

## 빌드 검증

- `npm run build` 성공
- TypeScript 타입 체크 통과

## 날짜

2026-04-13
