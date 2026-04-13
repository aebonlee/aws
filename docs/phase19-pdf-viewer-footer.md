# Phase 19: PDF 뷰어 페이지 + 푸터 회사 정보

## 개요

1. **AIF-C01 페이지 PDF 임베드**: 시험 참고 자료 섹션에 2개 PDF를 iframe 뷰어로 직접 표시
2. **PDF 뷰어 전용 페이지**: `/pdf/exam-guide`, `/pdf/summary` 별도 라우트 생성
3. **자료실 네비게이션 메뉴**: 데스크톱/모바일 모두 "자료실" 드롭다운 추가
4. **푸터 회사 정보 표기**: www 사이트와 동일한 DreamIT Biz 회사 정보 반영

---

## 1. AIF-C01 페이지 PDF 임베드

**파일:** `src/pages/AifC01.tsx`

### 변경 전
- PDF 링크 카드 2개 (클릭 시 새 탭에서 열림)

### 변경 후
- iframe 기반 PDF 뷰어 2개 (페이지 내에서 직접 열람 가능)
- 각 뷰어 하단에 "새 탭에서 열기" 링크 포함
- 뷰어 높이: 600px

---

## 2. PDF 뷰어 전용 페이지

**파일:** `src/pages/PdfViewer.tsx` (신규)

- URL 파라미터 `docId`로 PDF 선택: `exam-guide` / `summary`
- 전체 화면 뷰어 (화면 높이 - 헤더 만큼)
- AIF-C01 페이지로 돌아가기 버튼
- 하단에 "새 탭에서 열기" 링크

### 라우트
- `/pdf/exam-guide` → AIF-C01 시험 가이드
- `/pdf/summary` → AIF-C01 핵심 정리

---

## 3. 자료실 네비게이션 메뉴

**파일:** `src/components/layout/Navbar.tsx`

- 데스크톱: "자료실" 드롭다운 메뉴 (AIF-C01 학습과 도장깨기 사이)
- 모바일: "자료실" 아코디언 메뉴
- 메뉴 항목: 시험 가이드, 핵심 정리

---

## 4. 푸터 회사 정보

**파일:** `src/components/layout/Footer.tsx`

### 변경 전
- "AWS AIF-C01 학습" 브랜드
- 학습 카테고리 링크만 표시
- 저작권: "AWS AIF-C01 Study"

### 변경 후
- **브랜드**: DreamIT Biz (www 사이트와 통일)
- **연락처 섹션 추가**: 이메일, 전화번호, 카카오톡, 영업시간
- **회사 정보**: 대표이사, 사업자등록번호, 통신판매신고번호, 출판사 신고번호
- **저작권**: 드림아이티비즈(DreamIT Biz)

---

## 수정 파일 요약

| 파일 | 변경 | 내용 |
|------|------|------|
| `src/pages/PdfViewer.tsx` | 신규 | PDF 뷰어 전용 페이지 |
| `src/pages/AifC01.tsx` | 수정 | PDF 링크 카드 → iframe 뷰어 |
| `src/App.tsx` | 수정 | `/pdf/:docId` 라우트 추가 |
| `src/components/layout/Navbar.tsx` | 수정 | "자료실" 드롭다운 메뉴 추가 |
| `src/components/layout/Footer.tsx` | 수정 | DreamIT Biz 회사 정보 표기 |

---

## 검증

1. `npm run build` 성공
2. AIF-C01 페이지에서 PDF 2개 직접 열람 가능
3. `/pdf/exam-guide`, `/pdf/summary` 전용 뷰어 동작
4. 네비게이션 "자료실" 메뉴에서 각 PDF 뷰어로 이동
5. 푸터에 DreamIT Biz 회사 정보 정상 표시
