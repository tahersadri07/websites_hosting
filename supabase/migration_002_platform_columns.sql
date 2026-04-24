-- ============================================================
-- Migration: Add platform columns & business_tools table
-- Run this in the Supabase SQL editor on your project.
-- Safe to run multiple times (uses IF NOT EXISTS / IF NOT EXISTS).
-- ============================================================

-- ─── 1. New columns on businesses ────────────────────────────────────────────

ALTER TABLE businesses
    ADD COLUMN IF NOT EXISTS status          TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active','paused','maintenance')),
    ADD COLUMN IF NOT EXISTS status_message  TEXT,
    ADD COLUMN IF NOT EXISTS business_type   TEXT,
    ADD COLUMN IF NOT EXISTS services_label  TEXT,
    ADD COLUMN IF NOT EXISTS currency_symbol TEXT DEFAULT '₹',
    ADD COLUMN IF NOT EXISTS custom_domain   TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS template        TEXT DEFAULT 'dark-minimal';

-- ─── 2. business_tools table ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS business_tools (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    tool_key    TEXT NOT NULL,
    is_enabled  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(business_id, tool_key)
);

ALTER TABLE business_tools ENABLE ROW LEVEL SECURITY;

-- SuperAdmin (service role) manages tools; business members can read
CREATE POLICY "tools_public_read"
    ON business_tools FOR SELECT
    USING (true);

CREATE POLICY "tools_service_write"
    ON business_tools FOR ALL
    USING (false)
    WITH CHECK (false);

-- ─── 3. Index for fast domain lookup ─────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_businesses_custom_domain ON businesses(custom_domain)
    WHERE custom_domain IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_business_tools_business_id ON business_tools(business_id);
