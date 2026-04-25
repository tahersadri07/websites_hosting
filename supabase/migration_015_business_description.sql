-- ============================================================
-- Migration 015: Add description to businesses table
-- ============================================================

ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS description TEXT;
