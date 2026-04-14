# Phase: 관리자 쿠폰 대시보드 (사용 현황 + 회원 명단)

**날짜**: 2026-04-14

---

## 개요

관리자가 각 쿠폰의 사용 현황과 사용한 회원 명단을 확인할 수 있는 대시보드를 구현했습니다. `coupon_redemptions` 테이블의 `user_id`와 `auth.users`를 JOIN하여 이메일/이름을 표시합니다.

---

## 변경 파일

| 파일 | 상태 | 설명 |
|------|------|------|
| `sql/coupon_dashboard.sql` | 신규 | `get_coupon_redemptions_with_users()` DB 함수 |
| `src/lib/coupon.ts` | 수정 | `CouponRedemptionWithUser` 타입, `getRedemptionsForAdmin()`, `getCouponStats()` 추가 |
| `src/pages/AdminCoupons.tsx` | 수정 | 통계 카드, 아코디언 사용자 목록, 전체 사용 내역 탭 추가 |
| `src/styles/coupon.css` | 수정 | 통계 그리드, 탭, 아코디언, 히스토리 테이블 스타일 |
| `src/styles/dark-mode.css` | 수정 | 새 요소 다크모드 지원 |

---

## 구현 상세

### 1. Supabase DB 함수 (`sql/coupon_dashboard.sql`)

- `get_coupon_redemptions_with_users()`: `coupon_redemptions` + `coupons` + `auth.users` JOIN
- `SECURITY DEFINER`로 `auth.users` 접근 가능
- 내부에서 호출자 이메일을 확인하여 관리자만 사용 가능
- 반환: 쿠폰코드, 타입, 값, 유저 이메일, 유저 이름, 사용일시, 만료일, 할인율

### 2. coupon.ts 확장

- `CouponRedemptionWithUser` 인터페이스: DB 함수 반환값 타입
- `CouponStats` 인터페이스: 요약 통계 타입
- `getRedemptionsForAdmin()`: `.rpc('get_coupon_redemptions_with_users')` 호출
- `getCouponStats()`: 쿠폰 배열로부터 총 수, 활성 수, 사용 횟수, 사용률 계산

### 3. AdminCoupons.tsx 대시보드 UI

- **요약 통계 카드**: 총 쿠폰 수 | 활성 쿠폰 | 총 사용 횟수 | 사용률 (4열 그리드)
- **탭 네비게이션**: 쿠폰 목록 / 전체 사용 내역
- **쿠폰별 아코디언**: 쿠폰 행 클릭 시 해당 쿠폰 사용자 목록 펼침
  - 사용자 이메일, 이름, 사용일시, 이용권 만료일/할인율 표시
- **전체 사용 내역 탭**: 시간순 정렬된 전체 redemption 기록

### 4. CSS 스타일

- `.coupon-stats-grid`: 4열 통계 카드 그리드 (모바일 2열)
- `.coupon-dashboard-tabs`: 밑줄 탭 네비게이션
- `.coupon-row-clickable`: 클릭 가능한 행 + 호버 효과
- `.coupon-accordion-content`: 사용자 목록 아코디언 패널
- `.coupon-users-table`: 서브 테이블 스타일
- `.coupon-history-table`: 전체 내역 테이블
- 다크모드 대응 완료

---

## 배포 전 필수 작업

Supabase SQL Editor에서 `sql/coupon_dashboard.sql` 실행 필요

---

## 검증 체크리스트

- [x] `npm run build` 성공
- [ ] Supabase SQL Editor에서 DB 함수 실행
- [ ] `/admin/coupons`에서 요약 통계 카드 표시
- [ ] 쿠폰 행 클릭 시 아코디언 펼침/접힘
- [ ] 전체 사용 내역 탭 정상 표시
- [ ] 다크모드 정상 동작
