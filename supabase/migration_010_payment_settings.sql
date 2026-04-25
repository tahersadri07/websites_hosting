-- ============================================================
-- Migration 010: Payment Settings (UPI / GPay)
-- ============================================================

-- Add UPI ID to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS upi_id TEXT;

-- Add payment fields to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cash'; -- 'cash', 'upi'
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transaction_id TEXT;
