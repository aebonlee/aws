# Phase 18: 커뮤니티 DB 스키마 수정 + 문제풀이 버튼 개선

## 개요

1. **커뮤니티 DB 스키마 불일치 해결**: 기존 DB 스키마와 프론트엔드 코드의 불일치 발견 및 수정
2. **문제풀이 버튼 개선**: 한/영 전환 + 해설 보기 버튼을 나란히 배치
3. **에러 핸들링 추가**: 커뮤니티 CRUD 실패 시 사용자에게 에러 메시지 표시

---

## 1. DB 스키마 불일치 문제 (핵심)

### 발견된 문제

| 항목 | 기존 DB (community.sql) | 프론트엔드 코드 |
|------|------------------------|----------------|
| 게시글 테이블 | `posts`, `success_stories`, `tips` 별도 | 통합 `posts` + `type` 필드 |
| `posts.type` 컬럼 | 없음 | `'board'`/`'tip'`/`'success_story'`/`'inquiry'` |
| `posts.tags` 컬럼 | 없음 | JSONB 배열 |
| 카테고리 값 | 영어 `'general'` | 한국어 `'일반'` |
| 댓글 테이블 | 통합 `comments` + `target_type` | `post_comments`/`notice_comments` 분리 |
| 댓글 뷰 | `comments_with_author` | `post_comments_with_author`/`notice_comments_with_author` |
| 관리자 role | `profiles.role = 'user'` (기본값) | `isAdmin()`: 이메일 체크만 |
| 공지 RLS | `profiles.role = 'admin'` 필요 | role 미설정 → INSERT 차단됨 |

### 해결: community-v2.sql

**파일:** `sql/community-v2.sql`

#### 주요 변경
- **통합 `posts` 테이블**: `type`, `category`, `tags`(JSONB), `is_pinned`, 합격수기 필드 포함
- **`post_comments` / `notice_comments`**: 분리된 댓글 테이블 (프론트엔드 CommentSection과 일치)
- **뷰**: `posts_with_author`, `notices_with_author`, `post_comments_with_author`, `notice_comments_with_author`
- **관리자 설정**: `aebon@kakao.com` → `profiles.role = 'admin'` 자동 UPDATE
- **RLS**: notices INSERT는 `profiles.role IN ('admin', 'moderator')` 체크

#### 실행 방법
Supabase Dashboard > SQL Editor > community-v2.sql 전체 복사 & 실행

---

## 2. 문제풀이 버튼 개선

**파일:** `src/pages/Practice.tsx`

### 변경 전
- 한/영 토글: 퀴즈 헤더 우측 (작은 버튼)
- 해설 보기: 선택지 아래 별도 영역

### 변경 후
- **두 버튼을 같은 행에 나란히 배치** (`quiz-action-row`)
- 한/영 버튼: "영어로 보기" / "한국어로 보기" (명확한 텍스트)
- 해설 보기: 답변 전에만 표시, 답변 후 자동 숨김
- 언어 전환 시 문제, 선택지, 해설 모두 영어/한국어로 변경

---

## 3. 에러 핸들링 추가

### Notices.tsx
- `handleSubmit`: 에러 시 `alert()` 메시지 표시

### WriteForm.tsx (게시판/팁/합격수기/문의)
- INSERT 실패: `alert('작성 실패: ${error.message}')`
- UPDATE 실패: `alert('수정 실패: ${error.message}')`

---

## 수정 파일 요약

| 파일 | 변경 | 내용 |
|------|------|------|
| `sql/community-v2.sql` | 신규 | 프론트엔드에 맞는 DB 스키마 (전체 재구성) |
| `src/pages/Practice.tsx` | 수정 | 한/영 + 해설 보기 버튼 나란히 배치 |
| `src/pages/community/Notices.tsx` | 수정 | 에러 핸들링 추가 |
| `src/components/community/WriteForm.tsx` | 수정 | INSERT/UPDATE 에러 핸들링 추가 |
| `src/styles/quiz.css` | 수정 (이전) | 관련 CSS |

---

## 검증

1. `npm run build` 성공
2. SQL을 Supabase에서 실행 후 모든 커뮤니티 CRUD 정상 동작 확인 필요
3. 문제풀이에서 "영어로 보기" 클릭 시 문제/선택지/해설 영어 전환 확인
4. "해설 보기" 클릭 시 답변 전 해설 표시 확인
