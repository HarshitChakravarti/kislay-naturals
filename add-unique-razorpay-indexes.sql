-- Enforce idempotency for Razorpay identifiers on orders
-- These are partial unique indexes to allow NULLs

CREATE UNIQUE INDEX IF NOT EXISTS uniq_orders_razorpay_payment_id ON orders(razorpay_payment_id) WHERE razorpay_payment_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_orders_razorpay_order_id ON orders(razorpay_order_id) WHERE razorpay_order_id IS NOT NULL;
