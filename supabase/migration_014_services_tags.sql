-- ============================================================
-- Migration 014: Add tags to services table
-- ============================================================

ALTER TABLE services
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Indexing tags for potential search/filter
CREATE INDEX IF NOT EXISTS idx_services_tags ON services USING GIN (tags);
