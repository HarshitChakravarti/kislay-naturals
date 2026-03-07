-- Add coupon_code and coupon_discount columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50) DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_discount DECIMAL(10, 2) DEFAULT 0;

-- Backfill existing orders from payload JSONB
UPDATE orders
SET coupon_code = payload->>'couponCode',
    coupon_discount = COALESCE((payload->>'couponDiscount')::DECIMAL, 0)
WHERE payload IS NOT NULL
  AND payload->>'couponCode' IS NOT NULL
  AND coupon_code IS NULL;
