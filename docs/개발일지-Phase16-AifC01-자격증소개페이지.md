# 개발일지 - Phase 16: AIF-C01 자격증 소개 페이지 분리

**날짜**: 2026-04-14
**Phase**: 16

---

## 1. 개요

AWS Certification 드롭다운 메뉴에서 AIF-C01이 다른 자격증과 달리 카테고리 목록을
직접 보여주던 구조를 개선. AIF-C01도 다른 자격증(CLF-C02, SAA-C03 등)과 동일하게
자격증 소개 페이지(`/aif-c01`)를 갖도록 분리.

### 변경 전
- AWS Certification 드롭다운: AIF-C01 클릭 → `/` (홈페이지)로 이동
- AIF-C01 전용 드롭다운: 항상 `active` 강제, 8개 카테고리 직접 나열

### 변경 후
- AWS Certification 드롭다운: AIF-C01 클릭 → `/aif-c01` (자격증 소개 페이지)
- AIF-C01 학습 드롭다운: 현재 학습 페이지일 때만 `active`, 메뉴명 "AIF-C01 학습"

---

## 2. 수정/생성 파일 (5개)

| 파일 | 변경 내용 |
|------|----------|
| `src/pages/AifC01.tsx` | **신규** — 자격증 소개 페이지 (시험 개요, 출제 도메인, 학습 가이드, 퀴즈) |
| `src/lib/certifications.ts` | AIF-C01 path: `/` → `/aif-c01` |
| `src/App.tsx` | `/aif-c01` 라우트 추가 (public) |
| `src/components/layout/Navbar.tsx` | AIF-C01 특별 처리 제거, 학습 메뉴명 변경 |
| `docs/개발일지-Phase16-...md` | 본 문서 |

---

## 3. AifC01.tsx 페이지 구조

ClfC02.tsx 등 다른 자격증 페이지와 동일한 패턴:

```
GuideLayout
├── 시험 개요 (코드, 문항 수, 시간, 합격 점수, 비용, 유효 기간, 형식, 언어)
├── 출제 도메인 (5개 도메인 비중 + 주요 내용 테이블)
├── 학습 가이드 (8개 카테고리 카드 그리드 → 각 학습 페이지 링크)
└── 실력 점검 퀴즈 (5문제)
```

---

## 4. Navbar 변경 상세

### Desktop
- AWS Certification 드롭다운: `isAif` 특별 처리 제거, `location.pathname === cert.path`로 통일
- AIF-C01 학습 메뉴: `active` 강제 → `isAifPage` 조건부, 제목 "AIF-C01 학습"

### Mobile
- 동일하게 `isPublic` 로직으로 통일
- 학습 아코디온 제목 "AIF-C01 학습"

---

## 5. 빌드 확인

- `npx tsc --noEmit` 통과
- `npm run build` 성공 (149 modules, 6.48s)
