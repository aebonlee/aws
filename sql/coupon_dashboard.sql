-- ============================================
-- Coupon Dashboard: Redemptions with User Info
-- Run this in Supabase SQL Editor
-- ============================================

-- Function: get_coupon_redemptions_with_users
-- Returns coupon redemption records joined with user email/name and coupon details
-- SECURITY DEFINER allows access to auth.users (not accessible from client)
-- Admin-only: checks caller email internally

CREATE OR REPLACE FUNCTION get_coupon_redemptions_with_users()
RETURNS TABLE (
  redemption_id UUID,
  coupon_id UUID,
  coupon_code TEXT,
  coupon_type TEXT,
  coupon_value INTEGER,
  user_id UUID,
  user_email TEXT,
  user_name TEXT,
  redeemed_at TIMESTAMPTZ,
  period_expires_at TIMESTAMPTZ,
  applied_discount_percent INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admin check: only allow admin email
  IF (SELECT email FROM auth.users WHERE id = auth.uid()) != 'aebon@kakao.com' THEN
    RAISE EXCEPTION 'Unauthorized: admin access required';
  END IF;

  RETURN QUERY
  SELECT
    cr.id AS redemption_id,
    cr.coupon_id,
    c.code AS coupon_code,
    c.type AS coupon_type,
    c.value AS coupon_value,
    cr.user_id,
    u.email AS user_email,
    COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', '') AS user_name,
    cr.redeemed_at,
    cr.period_expires_at,
    cr.applied_discount_percent
  FROM coupon_redemptions cr
  JOIN coupons c ON c.id = cr.coupon_id
  JOIN auth.users u ON u.id = cr.user_id
  ORDER BY cr.redeemed_at DESC;
END;
$$;
