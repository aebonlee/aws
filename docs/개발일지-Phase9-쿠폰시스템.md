# Phase 9: 쿠폰 발행/사용 시스템

## 개발일: 2026-04-14

---

## 개요

관리자가 할인 쿠폰(30%/50%)과 기간 이용권(1일/3일/7일)을 발행하고, 유저가 코드를 입력하여 사용할 수 있는 쿠폰 시스템을 구현했습니다.

## 기능 요약

### 할인 쿠폰 (discount)
- 관리자가 30% 또는 50% 할인 쿠폰 코드 생성
- 유저가 Pricing 페이지에서 코드 입력 → 할인가 표시
- 결제 시 할인된 금액으로 PortOne 결제 → 성공 후 사용 기록 DB 저장

### 기간 이용권 (period)
- 관리자가 1일/3일/7일 이용권 코드 생성
- 유저가 Dashboard 또는 Pricing에서 코드 입력 → 즉시 활성화
- 활성 기간 동안 FreeTrialGuard 5페이지 제한 우회
- 만료 시 자동으로 제한 복귀

---

## 신규 파일

### `sql/coupons.sql`
- `coupons` 테이블: code, type, value, max_uses, used_count, is_active, expires_at, created_by
- `coupon_redemptions` 테이블: coupon_id, user_id, period_expires_at, applied_plan_id, applied_discount_percent
- RLS 정책: 인증유저 SELECT, 관리자 INSERT/UPDATE/DELETE, 본인 redemption만 SELECT/INSERT
- 트리거: redemption INSERT 시 used_count 자동 증가

### `src/lib/coupon.ts`
- **타입 정의**: `Coupon`, `CouponRedemption`
- **validateCouponCode(code, userId)**: 코드 검증 (존재/활성/만료/한도/중복)
- **redeemPeriodCoupon(couponId, userId, days)**: 기간 이용권 즉시 활성화
- **redeemDiscountCoupon(couponId, userId, planId, percent)**: 결제 후 할인 사용 기록
- **getActivePeriodPass(userId)**: 현재 활성 이용권 조회
- **createCoupon(), listCoupons(), toggleCouponActive()**: 관리자 CRUD
- **generateCouponCode(prefix)**: `AWS-K7MF-R3PN` 형식 (모호 문자 제외)
- **formatRemainingTime(expiresAt)**: "2일 3시간 남음" 형식

### `src/contexts/CouponContext.tsx`
- AuthContext 패턴 따라 `CouponProvider` + `useCoupon()` 훅
- 상태: activePeriodPass, appliedDiscount, hasActiveAccess, remainingTime
- **applyCoupon(code)**: 할인→상태 저장, 기간→즉시 DB INSERT
- **confirmDiscountUsed(planId)**: 결제 성공 후 DB INSERT
- 1분 간격 만료 시간 갱신 + visibilitychange 이벤트로 탭 복귀 시 재확인

### `src/components/CouponInput.tsx`
- 코드 입력 필드 + "적용" 버튼
- 성공(초록)/에러(빨강) 메시지 표시
- uppercase 자동 변환

### `src/pages/AdminCoupons.tsx`
- isAdmin 체크 (비관리자 → "권한 없음")
- **생성 폼**: 타입 선택 → 값 선택 → 코드 자동생성/직접입력 → 사용횟수 → 만료일
- **목록 테이블**: 코드, 타입, 값, 사용/한도, 만료일, 생성일, 활성/비활성 토글

### `src/styles/coupon.css`
- 입력 폼, 할인 가격 표시(취소선+강조), 관리자 테이블, 이용권 배너
- 반응형 대응

---

## 수정 파일

### `src/pages/Pricing.tsx`
- CouponInput 컴포넌트 추가 (로그인 시)
- 할인 적용 시: 원래가 취소선 + 할인가 강조 + "N% 할인 적용" 뱃지
- handlePayment: `Math.round(price * (1 - percent/100))` → PortOne 전달
- 결제 성공 → confirmDiscountUsed() 호출
- 기간 이용권 활성 시: "이용권 사용 중" 배너 표시

### `src/components/FreeTrialGuard.tsx`
- useCoupon()에서 hasActiveAccess 확인
- hasActiveAccess === true → admin과 동일하게 5페이지 제한 우회
- "이용권 사용 중 | 만료: N일 N시간 남음" 배너 (기존 free trial 배너 대체)

### `src/App.tsx`
- CouponProvider 추가 (AuthProvider 안, ThemeProvider 밖)
- AdminCoupons lazy import + `/admin/coupons` 라우트 (ProtectedRoute)

### `src/components/layout/Navbar.tsx`
- isAdmin import 추가
- 관리자 유저 드롭다운에 "쿠폰 관리" 링크 추가 (데스크톱 + 모바일)

### `src/pages/Dashboard.tsx`
- 활성 이용권 → "이용권 사용 중" + 만료 시간 카드 표시
- 비활성 → CouponInput으로 대시보드에서 쿠폰 입력 가능

### `src/styles/dark-mode.css`
- 쿠폰 관련 컴포넌트 다크모드 스타일 추가

---

## 데이터 흐름

### 할인 쿠폰 (30%/50%)
```
Pricing 코드입력 → validateCouponCode() → 상태에 저장(appliedDiscount) →
할인가 표시 → 결제(할인가 PortOne) → 성공 → redeemDiscountCoupon() DB INSERT →
트리거: used_count++ → appliedDiscount 초기화
```

### 기간 이용권 (1/3/7일)
```
Dashboard/Pricing 코드입력 → validateCouponCode() →
redeemPeriodCoupon() 즉시 DB INSERT(period_expires_at) →
트리거: used_count++ → CouponContext refresh() →
hasActiveAccess=true → FreeTrialGuard 우회 →
만료 시 → hasActiveAccess=false → 5페이지 제한 복귀
```

---

## DB 스키마

### coupons 테이블
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | 자동 생성 |
| code | TEXT (UNIQUE) | 쿠폰 코드 |
| type | TEXT | 'discount' 또는 'period' |
| value | INTEGER | 할인: 30,50 / 기간: 1,3,7 |
| max_uses | INTEGER | 최대 사용 횟수 |
| used_count | INTEGER | 현재 사용 횟수 |
| is_active | BOOLEAN | 활성 여부 |
| expires_at | TIMESTAMPTZ | 만료일 (선택) |
| created_by | UUID (FK) | 생성자 |
| created_at | TIMESTAMPTZ | 생성일 |

### coupon_redemptions 테이블
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID (PK) | 자동 생성 |
| coupon_id | UUID (FK) | 쿠폰 참조 |
| user_id | UUID (FK) | 사용자 참조 |
| redeemed_at | TIMESTAMPTZ | 사용 시점 |
| period_expires_at | TIMESTAMPTZ | 기간 이용권 만료일 |
| applied_plan_id | TEXT | 적용된 요금제 |
| applied_discount_percent | INTEGER | 적용된 할인율 |
| UNIQUE(coupon_id, user_id) | | 중복 사용 방지 |

---

## 배포 전 필수 작업

1. **Supabase SQL Editor**에서 `sql/coupons.sql` 실행
2. `npm run build` 확인 (완료)
3. 배포 후 관리자 계정으로 쿠폰 생성 테스트

---

## 기술 스택

- React + TypeScript + Vite
- Supabase (PostgreSQL + RLS + Triggers)
- PortOne 결제 연동
- CSS (다크모드 + 반응형)
