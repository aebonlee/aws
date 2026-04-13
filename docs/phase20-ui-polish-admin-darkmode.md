# Phase 20: UI 정리, 관리자 권한 분리, 다크모드 퀴즈 수정

## 개요

Phase 19 이후 사용자 피드백 기반으로 UI 개선, 관리자 기능 분리, 다크모드 가독성 수정을 진행했습니다.

1. **푸터 리디자인**: 3열 그리드 레이아웃, 그라데이션 배경, Family Site 드롭다운
2. **관리자 권한 분리**: 초기화 버튼 관리자 전용, FreeTrialGuard 관리자 우회
3. **PDF 뷰어 제거**: iframe 뷰어/자료실 메뉴 제거, 다운로드 카드로 복원
4. **다크모드 퀴즈 가독성**: 25개 CSS 규칙 추가로 모바일 다크모드 텍스트 가독성 해결

---

## 1. 푸터 리디자인

**파일:** `src/components/layout/Footer.tsx`, `src/styles/footer.css`, `src/styles/responsive.css`

### 변경 내용
- **3열 그리드**: 브랜드 + 학습 카테고리 + 연락처
- **그라데이션 배경**: `linear-gradient(180deg, #232F3E 0%, #191f2b 100%)`
- **브랜드 로고**: Dream(주황) + IT(흰색) + Biz(주황) 컬러 분리
- **Family Site 드롭다운**: www, allthat, books 사이트 연결
- **학습 카테고리**: 2열 columns 배치
- **연락처**: 이메일(파란색 링크), 전화, 카카오톡, 영업시간
- **하단**: 저작권 + 사업자정보 1행 표시
- **반응형**: 768px 이하에서 1열 스택

---

## 2. 관리자 권한 분리

**관련 파일:**
- `src/pages/Home.tsx`
- `src/pages/StampBreaking.tsx`
- `src/components/FreeTrialGuard.tsx`
- `src/lib/community.ts` (기존 `isAdmin()` 함수 활용)

### 초기화 버튼 관리자 전용
- **배경**: 환불 규정상 일반 사용자가 직접 진행 상황을 초기화하면 안 됨
- **변경**: `Home.tsx`, `StampBreaking.tsx`에서 초기화 버튼을 `admin && ...` 조건으로 감쌈
- **관리자 계정**: `aebon@kakao.com` (`ADMIN_EMAILS` in `community.ts`)

### FreeTrialGuard 관리자 우회
- 관리자는 5페이지 무료 체험 제한 우회
- 페이지 뷰 카운트 추적 안 함
- "무료 체험" 배너 표시 안 함

---

## 3. PDF 뷰어 제거 → 다운로드 카드 복원

**파일:**
- `src/pages/AifC01.tsx` — iframe 뷰어 → `.exam-resource-card` 다운로드 카드
- `src/components/layout/Navbar.tsx` — "자료실" 드롭다운 메뉴 제거
- `src/App.tsx` — `/pdf/:docId` 라우트 제거
- `src/pages/PdfViewer.tsx` — 파일 삭제
- `src/styles/guide-pages.css` — `.exam-resource-card` 스타일 추가

### 최종 구현
```tsx
<a href="/ai-practitioner-01.pdf" download className="exam-resource-card">
  <span className="exam-resource-icon">&#128196;</span>
  <div>
    <div className="exam-resource-title">AIF-C01 시험 가이드</div>
    <div className="exam-resource-desc">AWS 공식 시험 안내 문서 (PDF)</div>
  </div>
</a>
```

---

## 4. 다크모드 퀴즈 가독성 수정

**파일:** `src/styles/dark-mode.css`

### 문제
- 모바일 다크모드에서 퀴즈 보기(option) 텍스트가 검정색으로 거의 안 보임
- 기존에는 `quiz-option` background만 1줄 정의되어 있었음

### 해결
25개 CSS 규칙 추가:

| 셀렉터 | 핵심 변경 |
|--------|----------|
| `.quiz-container` | 배경 + 테두리 색상 |
| `.quiz-option` | 배경 + 텍스트 색상 + 테두리 |
| `.quiz-option:hover` | 주황 반투명 hover |
| `.quiz-option.selected` | 주황 15% 배경 |
| `.quiz-option.correct` | 초록 15% 배경 + #6ee7b7 텍스트 |
| `.quiz-option.wrong` | 빨강 15% 배경 + #fca5a5 텍스트 |
| `.quiz-option-letter` | 다크 배경 + 밝은 텍스트 |
| `.quiz-q-text` | var(--text) |
| `.quiz-explanation.*` | 색상별 반투명 배경 + 테두리 |
| `.quiz-result-card.*` | 그라데이션 배경 |
| `.quiz-lang-toggle` | 다크 배경 + 테두리 |
| `.quiz-browse-*` | 목록/옵션/해설 다크 스타일 |
| `.quiz-mode-tabs/tab` | 탭 배경 + 텍스트 |

---

## 관련 커밋

| 커밋 | 메시지 |
|------|--------|
| `9c8586b` | style: Redesign footer to match www site quality |
| `d0e51a6` | fix: Hide reset button from regular users, admin bypasses all limits |
| `2cef08d` | refactor: Remove PDF viewer pages and nav menu, use download cards |
| `e9a3fd9` | fix: Improve quiz dark mode readability on mobile |

---

## 검증

1. `npm run build` 성공
2. 푸터 3열 레이아웃 + Family Site 드롭다운 정상
3. 초기화 버튼: 일반 사용자 미노출, 관리자(`aebon@kakao.com`) 노출
4. FreeTrialGuard: 관리자 5페이지 제한 우회 확인
5. AIF-C01 PDF 다운로드 카드 정상 동작
6. 자료실 메뉴 완전 제거 확인
7. 다크모드 퀴즈: 모바일에서 보기/해설/결과 텍스트 가독성 정상
8. 한/영 토글 + 해설보기 버튼 정상 동작
