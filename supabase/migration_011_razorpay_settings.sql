-- ============================================================
-- Migration 011: Razorpay Payment Gateway Integration
-- ============================================================

-- Add Razorpay settings to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS razorpay_key_id TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS razorpay_key_secret TEXT;

-- Add gateway tracking fields to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gateway_order_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gateway_payment_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gateway_signature TEXT;
