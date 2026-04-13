import { supabase } from './supabase'

// ── Types ──

export interface Coupon {
  id: string
  code: string
  type: 'discount' | 'period'
  value: number // discount: 30,50 (%)  |  period: 1,3,7 (days)
  max_uses: number
  used_count: number
  is_active: boolean
  expires_at: string | null
  created_by: string | null
  created_at: string
}

export interface CouponRedemption {
  id: string
  coupon_id: string
  user_id: string
  redeemed_at: string
  period_expires_at: string | null
  applied_plan_id: string | null
  applied_discount_percent: number | null
}

// ── Validation ──

export async function validateCouponCode(
  code: string,
  userId: string
): Promise<{ ok: true; coupon: Coupon } | { ok: false; error: string }> {
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .single()

  if (error || !coupon) return { ok: false, error: '존재하지 않는 쿠폰 코드입니다.' }
  if (!coupon.is_active) return { ok: false, error: '비활성화된 쿠폰입니다.' }
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
    return { ok: false, error: '만료된 쿠폰입니다.' }
  if (coupon.used_count >= coupon.max_uses)
    return { ok: false, error: '사용 한도를 초과한 쿠폰입니다.' }

  // Check duplicate use
  const { data: existing } = await supabase
    .from('coupon_redemptions')
    .select('id')
    .eq('coupon_id', coupon.id)
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) return { ok: false, error: '이미 사용한 쿠폰입니다.' }

  return { ok: true, coupon: coupon as Coupon }
}

// ── Redemption ──

export async function redeemPeriodCoupon(couponId: string, userId: string, days: number) {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + days)

  const { error } = await supabase.from('coupon_redemptions').insert({
    coupon_id: couponId,
    user_id: userId,
    period_expires_at: expiresAt.toISOString(),
  })

  if (error) throw new Error(error.message)
  return expiresAt
}

export async function redeemDiscountCoupon(
  couponId: string,
  userId: string,
  planId: string,
  percent: number
) {
  const { error } = await supabase.from('coupon_redemptions').insert({
    coupon_id: couponId,
    user_id: userId,
    applied_plan_id: planId,
    applied_discount_percent: percent,
  })

  if (error) throw new Error(error.message)
}

// ── Query ──

export async function getActivePeriodPass(userId: string): Promise<CouponRedemption | null> {
  const { data } = await supabase
    .from('coupon_redemptions')
    .select('*')
    .eq('user_id', userId)
    .not('period_expires_at', 'is', null)
    .gt('period_expires_at', new Date().toISOString())
    .order('period_expires_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data as CouponRedemption | null
}

// ── Admin ──

export async function createCoupon(params: {
  code: string
  type: 'discount' | 'period'
  value: number
  max_uses: number
  expires_at?: string | null
  created_by: string
}) {
  const { error } = await supabase.from('coupons').insert({
    code: params.code.toUpperCase().trim(),
    type: params.type,
    value: params.value,
    max_uses: params.max_uses,
    expires_at: params.expires_at || null,
    created_by: params.created_by,
  })
  if (error) throw new Error(error.message)
}

export async function listCoupons(): Promise<Coupon[]> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data || []) as Coupon[]
}

export async function toggleCouponActive(id: string, isActive: boolean) {
  const { error } = await supabase
    .from('coupons')
    .update({ is_active: isActive })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

// ── Helpers ──

const SAFE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // exclude O,0,I,1,L

export function generateCouponCode(prefix = 'AWS'): string {
  const seg = (len: number) =>
    Array.from({ length: len }, () => SAFE_CHARS[Math.floor(Math.random() * SAFE_CHARS.length)]).join('')
  return `${prefix}-${seg(4)}-${seg(4)}`
}

export function formatRemainingTime(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return '만료됨'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (days > 0) return `${days}일 ${hours}시간 남음`
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) return `${hours}시간 ${minutes}분 남음`
  return `${minutes}분 남음`
}
