# 개발일지 - Phase 13: 커뮤니티 5개 페이지 CRUD + 관리자 시스템

**날짜**: 2026-04-13
**Phase**: 13

---

## 1. 개요

"서비스 준비 중" 플레이스홀더 상태였던 커뮤니티 4개 페이지(공지사항, 게시판, 합격수기, 팁공유)를
Supabase DB 연동 기반의 완전한 CRUD 기능으로 구현 완료.

### 전제 조건 (이전 Phase에서 완료)
- Supabase DB 테이블 8개 생성 완료 (posts, notices, post_comments, notice_comments, likes + 뷰 3개)
- RLS(Row Level Security) 정책 적용 완료
- 트리거 (like_count, comment_count 자동 집계) 설정 완료

---

## 2. 신규 파일 (13개)

### 타입 & 유틸리티

| 파일 | 설명 |
|------|------|
| `src/lib/community.ts` | Post, Notice, SuccessStory, Comment, Like 타입 정의 + BOARD_CATEGORIES, TIP_TAGS 상수 + PAGE_SIZE + getAvatarUrl 헬퍼 |
| `src/lib/timeago.ts` | 상대시간 변환 (방금 전, N분 전, N시간 전, N일 전, N개월 전, N년 전) |

### 공용 컴포넌트 (6개)

| 파일 | 설명 |
|------|------|
| `src/components/community/FilterTabs.tsx` | 카테고리/태그 필터 탭 (pill 버튼) |
| `src/components/community/PostCard.tsx` | 게시글 목록 카드 (아바타, 제목, 미리보기, 뱃지, 조회/좋아요/댓글 수) |
| `src/components/community/PostList.tsx` | 카드 목록 + 빈 상태 + "더 보기" 버튼 |
| `src/components/community/LikeButton.tsx` | 좋아요 토글 (Optimistic UI, Supabase likes 테이블 연동) |
| `src/components/community/CommentSection.tsx` | 댓글 목록 + 입력 + 대댓글(1단계) + 수정/삭제 |
| `src/components/community/WriteForm.tsx` | 글쓰기/수정 폼 (type별 필드 분기: board/tip/success_story) |

### 상세 페이지 (4개)

| 파일 | 설명 |
|------|------|
| `src/pages/community/NoticeDetail.tsx` | 공지 상세 (내용 + 조회수, 댓글/좋아요 없음) |
| `src/pages/community/BoardDetail.tsx` | 게시판 상세 (댓글 + 좋아요 + 수정/삭제) |
| `src/pages/community/TipDetail.tsx` | 팁 상세 (태그 뱃지 + 댓글 + 좋아요 + 수정/삭제) |
| `src/pages/community/SuccessStoryDetail.tsx` | 합격수기 상세 (메타 패널 + 댓글 + 좋아요 + 수정/삭제) |

### 문서

| 파일 | 설명 |
|------|------|
| `docs/개발일지-Phase13-커뮤니티-CRUD-구현.md` | 본 문서 |

---

## 3. 수정 파일 (8개)

| 파일 | 변경 내용 |
|------|----------|
| `src/App.tsx` | 4개 상세 라우트 lazy import + Route 추가 (`/community/{notices\|board\|success-stories\|tips}/:id`) |
| `src/pages/community/Notices.tsx` | 플레이스홀더 → Supabase `notices_with_author` 목록 조회 (pinned 상단, 페이지네이션) |
| `src/pages/community/Board.tsx` | 플레이스홀더 → CRUD + 카테고리 필터 (전체/일반/질문/토론/스터디그룹) |
| `src/pages/community/Tips.tsx` | 플레이스홀더 → CRUD + 태그 필터 (학습방법/시험전략/자료공유/시간관리/기타) |
| `src/pages/community/SuccessStories.tsx` | 플레이스홀더 → 2열 카드 그리드 (시험명, 점수, 학습기간, 난이도 별점) |
| `src/styles/community.css` | 전체 커뮤니티 CSS 확장 (toolbar, filter, card, detail, like, comment, write-form, stories-grid, stars, meta-panel 등) |
| `src/styles/dark-mode.css` | 커뮤니티 다크모드 오버라이드 17개 추가 |
| `src/styles/responsive.css` | 커뮤니티 반응형 (768px: 그리드→1열, 폼→1열, 480px: 카드 세로 전환) |

### 진행률 원형 차트 버그 수정

| 파일 | 변경 내용 |
|------|----------|
| `src/pages/Home.tsx` | 진행률 링 + 퍼센트 텍스트 + "진행률" 라벨을 하나의 SVG 안에 `<text>` 요소로 통합. CSS transform 대신 SVG `transform="rotate(-90 40 40)"` 사용 |
| `src/styles/home.css` | `.progress-ring-wrap` 제거, `.progress-ring-pct` / `.progress-ring-label` SVG 텍스트 스타일 추가, 링 크기 72px |

---

## 4. 핵심 구현 패턴

### Supabase 쿼리 패턴

```typescript
// 목록 조회 (뷰 사용)
supabase.from('posts_with_author').select('*')
  .eq('type', 'board')
  .order('is_pinned', { ascending: false })
  .order('created_at', { ascending: false })
  .range(page * 20, (page + 1) * 20 - 1)

// 상세 조회
supabase.from('posts_with_author').select('*').eq('id', id).single()

// 글 작성
supabase.from('posts').insert({ author_id: user.id, title, content, type, category })

// 좋아요 토글 (Optimistic UI)
supabase.from('likes').insert({ user_id, target_type: 'post', target_id })
supabase.from('likes').delete().eq('user_id', ...).eq('target_id', ...)
```

### 조회수 중복 방지 (sessionStorage)

```typescript
const viewKey = `viewed-post-${id}`
if (!sessionStorage.getItem(viewKey)) {
  await supabase.from('posts').update({ view_count: current + 1 }).eq('id', id)
  sessionStorage.setItem(viewKey, '1')
}
```

### 댓글 트리 구조

```typescript
// flat 조회 후 클라이언트에서 트리 빌드
const top: Comment[] = []
const replyMap = new Map<string, Comment[]>()
for (const c of data) {
  if (c.parent_id) replyMap.get(c.parent_id)?.push(c) ?? replyMap.set(c.parent_id, [c])
  else top.push(c)
}
for (const c of top) c.replies = replyMap.get(c.id) || []
```

### 아바타 Fallback

```typescript
function getAvatarUrl(name?: string, avatarUrl?: string): string {
  if (avatarUrl) return avatarUrl
  return `https://ui-avatars.com/api/?name=${name}&background=FF9900&color=fff&size=32`
}
```

---

## 5. 페이지별 기능 명세

### 공지사항 (관리자 전용 CRUD)
- 목록: `notices_with_author` 뷰, pinned 상단 고정, 20개 페이지네이션
- 관리자(`aebon@kakao.com`): 글쓰기 버튼 표시, 상단 고정 옵션
- 상세: 내용 표시 + 조회수 + 관리자만 수정/삭제 버튼
- 권한: `isAdmin(user)` 프론트 체크 + DB RLS

### 게시판 (Full CRUD)
- 목록: 카테고리 필터 (전체/일반/질문/토론/스터디그룹), 글쓰기 버튼
- 상세: 본문 + 카테고리 뱃지 + 댓글 + 좋아요 + 수정/삭제
- 권한: 로그인 시 글쓰기, 본인 글만 수정/삭제

### 시험팁공유 (CRUD + 태그 필터)
- 목록: 태그 필터 (학습방법/시험전략/자료공유/시간관리/기타), 글쓰기 버튼
- 상세: 본문 + 태그 뱃지 + 댓글 + 좋아요 + 수정/삭제
- 필터: `supabase.contains('tags', [selectedTag])`

### 시험합격수기 (가장 복잡)
- 목록: 2열 카드 그리드 (시험명, 점수, 학습기간, 난이도 별점 표시)
- 작성 폼 추가 필드: 시험이름, 점수(0~1000), 시험날짜, 학습기간, 난이도(1~5 별점)
- 상세: 메타데이터 패널 (시험/점수/시험일/학습기간/난이도) + 본문 + 댓글 + 좋아요

---

## 6. CSS 구조

### 신규 클래스 (community.css)
```
.community-toolbar          — 필터 + 글쓰기 버튼 행
.community-filter-tabs/tab  — 필터 pill 탭
.community-card             — 목록 카드 (pinned 변형 포함)
.community-detail           — 상세 페이지 레이아웃
.community-like-btn         — 좋아요 버튼 (liked 변형)
.community-comments         — 댓글 섹션
.community-comment          — 개별 댓글 (reply 변형)
.community-comment-input    — 댓글 입력
.community-write-form       — 글쓰기 폼
.community-stories-grid     — 합격수기 2열 그리드
.community-story-card       — 합격수기 카드
.community-detail-meta-panel — 합격수기 메타 패널
.community-stars            — 난이도 별점
.community-empty            — 빈 상태
.community-load-more        — 더 보기 버튼
```

### 다크모드 (dark-mode.css)
- community-card, filter-tab, like-btn, comment-input, form inputs, story-card, meta-panel, load-more button 등 17개 다크모드 오버라이드

### 반응형 (responsive.css)
- 768px: stories-grid 1열, toolbar 세로, detail-info 세로, form-row 1열, reply 들여쓰기 축소
- 480px: hero 제목 축소, card 세로 전환, meta-panel 2열

---

## 7. 라우트 구조

```
/community/notices              → Notices (목록)
/community/notices/:id          → NoticeDetail (상세)
/community/board                → Board (목록 + 필터 + 글쓰기)
/community/board/:id            → BoardDetail (상세 + 댓글 + 좋아요)
/community/success-stories      → SuccessStories (2열 그리드 + 글쓰기)
/community/success-stories/:id  → SuccessStoryDetail (메타 패널 + 상세)
/community/tips                 → Tips (목록 + 태그 필터 + 글쓰기)
/community/tips/:id             → TipDetail (상세 + 댓글 + 좋아요)
/community/inquiry              → Inquiry (문의 목록 + 글쓰기)
/community/inquiry/:id          → InquiryDetail (상세 + 댓글)
```

모든 라우트는 `<ProtectedRoute>` 감싸기 (로그인 필수).

---

## 8. 진행률 원형 차트 버그 수정

### 문제
홈페이지 "나의 학습 현황" 카드의 진행률 원형 차트에서 퍼센트 텍스트("38%")와 원형 링, "진행률" 라벨이 각각 별도 요소(SVG + HTML span + HTML div)로 분리되어 좌표계가 달라 위치가 어긋남.

### 해결
퍼센트 텍스트와 "진행률" 라벨을 SVG `<text>` 요소로 변경하여 링과 함께 하나의 SVG viewBox(`0 0 80 80`) 안에서 관리.

```jsx
<svg viewBox="0 0 80 80">
  <circle className="progress-ring-bg" ... />
  <circle className="progress-ring-fill" ... transform="rotate(-90 40 40)" />
  <text x="40" y="37" className="progress-ring-pct">{rate}%</text>
  <text x="40" y="54" className="progress-ring-label">진행률</text>
</svg>
```

---

## 9. 관리자 시스템 + 문의하기

### 관리자 판별 (`src/lib/community.ts`)
```typescript
const ADMIN_EMAILS = ['aebon@kakao.com'] as const

export function isAdmin(user: User | null): boolean {
  if (!user) return false
  return ADMIN_EMAILS.includes(user.email as typeof ADMIN_EMAILS[number])
}
```

### 적용 범위
| 기능 | 일반 사용자 | 관리자 (aebon@kakao.com) |
|------|------------|------------------------|
| 공지사항 읽기 | O | O |
| 공지사항 작성/수정/삭제 | X | O |
| 게시판/팁/합격수기 CRUD | 본인 글만 | 본인 글만 |
| 문의하기 작성 | O | O |
| 문의하기 목록 조회 | 본인 문의만 | 전체 문의 |
| 문의 상세 열람 | 본인 문의만 | 전체 문의 |
| 문의 답변 (댓글) | 본인 문의에만 | 모든 문의에 |
| 문의 삭제 | 본인 문의만 | 모든 문의 |

### 문의하기 페이지
- 일반 사용자: 본인이 작성한 문의만 목록에 표시 (`author_id` 필터)
- 관리자: 전체 문의 조회 가능, 댓글로 답변
- 라우트: `/community/inquiry`, `/community/inquiry/:id`

---

## 10. 상단 메뉴(Navbar) 레이아웃 수정

### 문제
상단 네비게이션 메뉴 항목들이 왼쪽으로 치우쳐 배치되어 비율적으로 불균형한 레이아웃 발생.

### 원인
`.nav-links`가 `flex: 1`로 남은 공간을 차지하지만, `justify-content`가 기본값(`flex-start`)이어서 메뉴 항목들이 로고 바로 오른쪽에 몰려 있고 우측 액션 영역과의 사이에 빈 공간이 과도하게 발생.

### 해결

| 파일 | 변경 내용 |
|------|----------|
| `src/styles/navbar.css` | `.nav-links`에 `justify-content: center` 추가 |

```css
/* Before */
.nav-links {
  display: flex; align-items: center; gap: 2px; flex: 1;
}

/* After */
.nav-links {
  display: flex; align-items: center; gap: 2px; flex: 1; justify-content: center;
}
```

이로써 메뉴 항목들이 로고와 우측 액션(테마 토글, 사용자 정보) 사이에서 중앙 배치되어 균형 잡힌 레이아웃 구현.

---

## 11. 빌드 확인

- `npm run build` 성공 (tsc + vite build)
- 148 modules transformed
- 모든 TypeScript 타입 체크 통과
