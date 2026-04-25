-- ============================================================
-- Migration 013: Business Type Segregation
-- ============================================================

-- Update existing rows to 'product' if they are null or invalid
UPDATE businesses 
SET business_type = 'product' 
WHERE business_type IS NULL OR business_type NOT IN ('product', 'service');

-- Alter the existing business_type column to enforce product/service
-- We drop the constraint first to make it re-runnable
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS business_type_check;

ALTER TABLE businesses 
    ALTER COLUMN business_type SET NOT NULL,
    ALTER COLUMN business_type SET DEFAULT 'product',
    ADD CONSTRAINT business_type_check CHECK (business_type IN ('product', 'service'));
