-- ═══════════════════════════════════════════════════════════════
-- Platform Tools / Feature Flags Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. Add website status to businesses
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'maintenance')),
  ADD COLUMN IF NOT EXISTS status_message TEXT,
  ADD COLUMN IF NOT EXISTS paused_at TIMESTAMPTZ;

-- 2. Platform tools catalog (seeded by developer)
CREATE TABLE IF NOT EXISTS platform_tools (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT UNIQUE NOT NULL,          -- e.g. 'crm', 'inventory', 'booking'
  name        TEXT NOT NULL,                 -- e.g. 'CRM'
  description TEXT,
  icon        TEXT,                          -- lucide icon name
  category    TEXT NOT NULL DEFAULT 'core',  -- 'core' | 'marketing' | 'operations' | 'analytics'
  is_beta     BOOLEAN DEFAULT FALSE,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 3. Business tool assignments (which tools each client has enabled)
CREATE TABLE IF NOT EXISTS business_tools (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  tool_key     TEXT NOT NULL REFERENCES platform_tools(key) ON DELETE CASCADE,
  is_enabled   BOOLEAN DEFAULT TRUE,
  config       JSONB DEFAULT '{}',
  enabled_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(business_id, tool_key)
);

-- 4. Seed platform tools
INSERT INTO platform_tools (key, name, description, icon, category, sort_order) VALUES
  ('services',    'Services / Products',    'Manage your service or product catalog',               'Layers',         'core',        1),
  ('gallery',     'Gallery',                'Photo and media gallery for your website',             'Image',          'core',        2),
  ('testimonials','Testimonials',           'Customer reviews and social proof',                    'Star',           'core',        3),
  ('inquiries',   'Contact Inquiries',      'Manage inbound contact form submissions',              'MessageSquare',  'core',        4),
  ('crm',         'CRM',                    'Customer relationship management and pipeline',        'Users',          'operations',  10),
  ('inventory',   'Inventory Management',   'Stock tracking, alerts, and purchase orders',         'Package',        'operations',  11),
  ('booking',     'Booking & Appointments', 'Online scheduling and calendar management',           'Calendar',       'operations',  12),
  ('invoicing',   'Invoicing & Billing',    'Send invoices, track payments, manage subscriptions', 'Receipt',        'operations',  13),
  ('analytics',   'Analytics Dashboard',   'Traffic, conversion, and revenue analytics',          'BarChart3',      'analytics',   20),
  ('email',       'Email Marketing',        'Campaigns, automations, and audience management',     'Mail',           'marketing',   30),
  ('loyalty',     'Loyalty Program',        'Points, rewards, and customer retention tools',       'Gift',           'marketing',   31)
ON CONFLICT (key) DO NOTHING;

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_business_tools_business_id ON business_tools(business_id);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);

-- 6. Enable 4 core tools for ALL existing businesses automatically
INSERT INTO business_tools (business_id, tool_key, is_enabled)
SELECT b.id, t.key, TRUE
FROM businesses b
CROSS JOIN platform_tools t
WHERE t.category = 'core'
ON CONFLICT (business_id, tool_key) DO NOTHING;
