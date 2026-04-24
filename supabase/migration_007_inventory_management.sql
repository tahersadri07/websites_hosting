-- ============================================================
-- Migration 007: Inventory Management
-- ============================================================

-- Add inventory columns to services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS manage_inventory BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5;

-- Update existing services to NOT manage inventory by default
UPDATE services SET manage_inventory = FALSE WHERE manage_inventory IS NULL;
