-- Migration: Add template column to businesses table
-- Run this in Supabase SQL Editor

ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS template TEXT DEFAULT 'dark-minimal';

-- Optional: verify
-- SELECT id, name, slug, template FROM businesses;
