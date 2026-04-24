-- ============================================================
-- Migration 005: Add Categories and Multiple Images
-- ============================================================

-- ─── 1. Create categories table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name         TEXT NOT NULL,
    slug         TEXT NOT NULL,
    sort_order   INTEGER NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(business_id, slug)
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "categories_read_all" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_all" ON categories FOR ALL 
    USING (is_member(business_id))
    WITH CHECK (is_member(business_id));

-- ─── 2. Update services table ───────────────────────────────────────────────
-- Add category_id
ALTER TABLE services ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Add image_urls array (to support up to 3 images)
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';

-- ─── 3. Seed some default categories (optional example) ─────────────────────
-- This can be done via the Admin UI, but we ensure the columns exist.
