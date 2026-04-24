-- ============================================================
-- Migration 004: Platform Tools & Seed Data
-- Run this in the Supabase SQL editor.
-- ============================================================

-- ─── 1. Create platform_tools table ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS platform_tools (
    key          TEXT PRIMARY KEY,
    name         TEXT NOT NULL,
    description  TEXT,
    icon         TEXT,            -- Lucide icon name
    category     TEXT NOT NULL DEFAULT 'core', -- 'core', 'operations', 'marketing', etc.
    sort_order   INTEGER NOT NULL DEFAULT 0,
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 2. Enable RLS and Policies ──────────────────────────────────────────────

ALTER TABLE platform_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "platform_tools_read_all"
    ON platform_tools FOR SELECT
    USING (true);

-- ─── 3. Seed Default Tools ───────────────────────────────────────────────────

INSERT INTO platform_tools (key, name, description, icon, category, sort_order)
VALUES
    ('services',     'Services Catalog',   'Showcase your services/products with pricing and item numbers.', 'Package',       'core',       1),
    ('gallery',      'Photo Gallery',      'A beautiful masonry gallery to showcase your work.',           'Image',         'core',       2),
    ('testimonials', 'Testimonials',       'Build trust by displaying customer reviews.',                   'Star',          'core',       3),
    ('contact',      'Inquiry Management', 'Manage contact form submissions from your customers.',         'MessageSquare', 'core',       4),
    ('staff',        'Staff Profiles',     'Introduce your team members to your customers.',               'Users',         'operations', 5),
    ('bookings',     'Online Bookings',    'Allow customers to book appointments online.',                  'Calendar',      'operations', 6),
    ('invoicing',    'Basic Invoicing',    'Generate simple invoices for your services.',                   'Receipt',       'operations', 7),
    ('analytics',    'Traffic Analytics',  'View visitor counts and popular pages.',                        'BarChart3',     'analytics',  8),
    ('newsletter',   'Email Newsletter',   'Collect emails and send updates to your customers.',            'Mail',          'marketing',  9),
    ('promotions',   'Coupons & Deals',    'Create promotional offers and discount codes.',                 'Gift',          'marketing',  10)
ON CONFLICT (key) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    category = EXCLUDED.category,
    sort_order = EXCLUDED.sort_order;
