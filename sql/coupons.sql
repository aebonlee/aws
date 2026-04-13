-- ============================================
-- Coupon System Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('discount', 'period')),
  value INTEGER NOT NULL,
  -- discount: 30, 50 (percent)  |  period: 1, 3, 7 (days)
  max_uses INTEGER NOT NULL DEFAULT 1,
  used_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Coupon redemptions table
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ DEFAULT now(),
  period_expires_at TIMESTAMPTZ,
  applied_plan_id TEXT,
  applied_discount_percent INTEGER,
  UNIQUE(coupon_id, user_id)
);

-- 3. Trigger: auto-increment used_count on redemption
CREATE OR REPLACE FUNCTION increment_coupon_used_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE coupons SET used_count = used_count + 1 WHERE id = NEW.coupon_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_increment_used_count ON coupon_redemptions;
CREATE TRIGGER trg_increment_used_count
  AFTER INSERT ON coupon_redemptions
  FOR EACH ROW
  EXECUTE FUNCTION increment_coupon_used_count();

-- 4. RLS Policies
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;

-- Coupons: authenticated users can SELECT
CREATE POLICY "Authenticated users can view coupons"
  ON coupons FOR SELECT
  TO authenticated
  USING (true);

-- Coupons: only admin can INSERT/UPDATE/DELETE
-- (Admin check via email — matches app-level isAdmin)
CREATE POLICY "Admin can insert coupons"
  ON coupons FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' = 'aebon@kakao.com');

CREATE POLICY "Admin can update coupons"
  ON coupons FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'aebon@kakao.com');

CREATE POLICY "Admin can delete coupons"
  ON coupons FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'aebon@kakao.com');

-- Redemptions: user can INSERT their own
CREATE POLICY "Users can redeem coupons"
  ON coupon_redemptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Redemptions: user can SELECT their own
CREATE POLICY "Users can view own redemptions"
  ON coupon_redemptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Redemptions: admin can SELECT all
CREATE POLICY "Admin can view all redemptions"
  ON coupon_redemptions FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'aebon@kakao.com');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_redemptions_user ON coupon_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_coupon ON coupon_redemptions(coupon_id);
