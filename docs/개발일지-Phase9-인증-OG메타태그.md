# 개발일지 - Phase 9: Supabase 인증(Google/Kakao) + OG 메타태그

**날짜**: 2026-04-12
**Phase**: 9

---

## 1. Supabase 인증 시스템

### 개요
비활성 플레이스홀더였던 로그인 페이지를 Supabase 기반 소셜 로그인(Google, Kakao)으로 교체.

### 새로 생성한 파일

| 파일 | 설명 |
|------|------|
| `.env` | Supabase URL + Anon Key (VITE_ 접두사) |
| `.env.example` | 키 없는 템플릿 (커밋용) |
| `src/lib/supabase.ts` | Supabase 클라이언트 (createClient) |
| `src/contexts/AuthContext.tsx` | 인증 컨텍스트 (session, user, loading, signIn/signOut) |
| `src/pages/AuthCallback.tsx` | OAuth 콜백 처리 페이지 |

### 수정한 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/App.tsx` | AuthProvider 추가, /auth/callback 라우트 추가 |
| `src/pages/Login.tsx` | 비활성 폼 -> Google/Kakao 소셜 로그인 버튼 |
| `src/components/layout/Navbar.tsx` | 로그인 상태에 따라 아바타+이름+로그아웃 표시 |
| `src/styles/community.css` | 소셜 로그인 버튼 CSS (.login-social-btn, .login-google, .login-kakao) |
| `src/styles/navbar.css` | 유저 정보 CSS (.nav-user-info, .nav-user-avatar, .nav-logout-btn) |

### 구현 상세

#### AuthContext (`src/contexts/AuthContext.tsx`)
- ThemeContext 패턴과 동일 (createContext + useAuth hook)
- 상태: `session`, `user` (session?.user), `loading`
- 메서드: `signInWithGoogle()`, `signInWithKakao()`, `signOut()`
- `onAuthStateChange` 리스너로 세션 자동 관리
- OAuth redirectTo: `${window.location.origin}/auth/callback`

#### Login.tsx
- Google 버튼: 흰색 배경 + Google 로고 SVG
- Kakao 버튼: #FEE500 노란색 + Kakao 로고 SVG
- 이미 로그인된 경우 홈으로 자동 리다이렉트

#### Navbar.tsx
- 데스크톱: `user ? (아바타 + 이름 + 로그아웃 버튼) : (로그인 링크)`
- 모바일: 동일 패턴, `.nav-mobile-user` 클래스

#### Provider 구조
```
AuthProvider > ThemeProvider > ProgressProvider > PublicLayout > Routes
```

### 주의사항
- `sbp_` 키(Service Role Key)는 `.env`에 포함하지 않음 (서버 전용)
- Supabase 대시보드에서 Google/Kakao OAuth 프로바이더 활성화 필요
- Site URL: `https://aws.dreamitbiz.com`
- Redirect URL에 `http://localhost:5182` 추가 필요

---

## 2. OG(Open Graph) 메타태그

### 수정 파일
- `index.html` — OG 메타태그 추가

### 추가된 메타태그
```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://aws.dreamitbiz.com/" />
<meta property="og:title" content="AWS Certification Study - 자격증 학습 가이드" />
<meta property="og:description" content="AWS 자격증 핵심 정리, 도장깨기, 문제풀이까지..." />
<meta property="og:image" content="https://aws.dreamitbiz.com/og-image.png" />
<meta property="og:site_name" content="AWS Certification Study" />
<meta property="og:locale" content="ko_KR" />
```

### OG 이미지
- `scripts/generate-og-image.js` — 순수 Node.js로 1200x630 PNG 생성
- `public/og-image.png` — AWS 컬러(#232F3E + #FF9900) 그라디언트 배경 + "AWS" 텍스트

---

## 3. 의존성 추가

```
@supabase/supabase-js — Supabase 클라이언트 라이브러리
```

---

## 4. 빌드 확인

- `npm run build` 성공 (tsc + vite build)
- 126 modules transformed
- 모든 TypeScript 타입 체크 통과
