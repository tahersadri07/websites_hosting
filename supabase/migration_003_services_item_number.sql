-- ============================================================
-- Migration 003: Add item_number & features to services table
-- Run this in the Supabase SQL editor.
-- Safe to run multiple times (uses IF NOT EXISTS).
-- ============================================================

-- Add item_number column — a user-defined short reference like "SKU-001", "A12", etc.
ALTER TABLE services
    ADD COLUMN IF NOT EXISTS item_number TEXT,
    ADD COLUMN IF NOT EXISTS features    TEXT[];  -- Array of short feature highlights

-- Optional: index item_number for fast lookups
CREATE INDEX IF NOT EXISTS idx_services_item_number
    ON services(item_number)
    WHERE item_number IS NOT NULL;

-- Example: update existing rows with auto-generated item numbers
-- (run this once if you want to backfill — comment out on repeated runs)
-- UPDATE services
--     SET item_number = UPPER(SUBSTRING(id::TEXT, 1, 6))
--     WHERE item_number IS NULL;
