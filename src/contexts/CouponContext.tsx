import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import {
  validateCouponCode,
  redeemPeriodCoupon,
  redeemDiscountCoupon,
  getActivePeriodPass,
  formatRemainingTime,
  type Coupon,
  type CouponRedemption,
} from '../lib/coupon'

interface AppliedDiscount {
  coupon: Coupon
  percent: number
}

interface CouponContextType {
  activePeriodPass: CouponRedemption | null
  appliedDiscount: AppliedDiscount | null
  hasActiveAccess: boolean
  loading: boolean
  remainingTime: string | null
  applyCoupon: (code: string) => Promise<{ ok: true; message: string } | { ok: false; error: string }>
  confirmDiscountUsed: (planId: string) => Promise<void>
  clearDiscount: () => void
  refresh: () => Promise<void>
}

const CouponContext = createContext<CouponContextType | undefined>(undefined)

export function CouponProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [activePeriodPass, setActivePeriodPass] = useState<CouponRedemption | null>(null)
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null)
  const [loading, setLoading] = useState(false)
  const [remainingTime, setRemainingTime] = useState<string | null>(null)

  const hasActiveAccess = !!activePeriodPass

  const refresh = useCallback(async () => {
    if (!user) {
      setActivePeriodPass(null)
      return
    }
    setLoading(true)
    try {
      const pass = await getActivePeriodPass(user.id)
      setActivePeriodPass(pass)
    } catch {
      // Table may not exist yet — silently ignore
    } finally {
      setLoading(false)
    }
  }, [user])

  // Initial load
  useEffect(() => {
    refresh()
  }, [refresh])

  // Update remaining time every minute
  useEffect(() => {
    if (!activePeriodPass?.period_expires_at) {
      setRemainingTime(null)
      return
    }
    const update = () => {
      const time = formatRemainingTime(activePeriodPass.period_expires_at!)
      setRemainingTime(time)
      if (time === '만료됨') {
        setActivePeriodPass(null)
      }
    }
    update()
    const interval = setInterval(update, 60_000)
    return () => clearInterval(interval)
  }, [activePeriodPass])

  // Re-check on tab visibility change
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [refresh])

  const applyCoupon = async (code: string) => {
    if (!user) return { ok: false as const, error: '로그인이 필요합니다.' }

    const result = await validateCouponCode(code, user.id)
    if (!result.ok) return { ok: false as const, error: result.error }

    const coupon = result.coupon
    if (coupon.type === 'period') {
      try {
        await redeemPeriodCoupon(coupon.id, user.id, coupon.value)
        await refresh()
        return { ok: true as const, message: `${coupon.value}일 이용권이 활성화되었습니다!` }
      } catch {
        return { ok: false as const, error: '이용권 적용에 실패했습니다.' }
      }
    }

    // Discount coupon: store in state only, DB insert after payment
    setAppliedDiscount({ coupon, percent: coupon.value })
    return { ok: true as const, message: `${coupon.value}% 할인이 적용되었습니다!` }
  }

  const confirmDiscountUsed = async (planId: string) => {
    if (!user || !appliedDiscount) return
    try {
      await redeemDiscountCoupon(
        appliedDiscount.coupon.id,
        user.id,
        planId,
        appliedDiscount.percent
      )
    } finally {
      setAppliedDiscount(null)
    }
  }

  const clearDiscount = () => setAppliedDiscount(null)

  return (
    <CouponContext.Provider value={{
      activePeriodPass,
      appliedDiscount,
      hasActiveAccess,
      loading,
      remainingTime,
      applyCoupon,
      confirmDiscountUsed,
      clearDiscount,
      refresh,
    }}>
      {children}
    </CouponContext.Provider>
  )
}

export function useCoupon() {
  const context = useContext(CouponContext)
  if (!context) throw new Error('useCoupon must be used within CouponProvider')
  return context
}
