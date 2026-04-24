-- ============================================================
-- Indian Small-Business Website Platform — Supabase Schema
-- Run this in the Supabase SQL editor after creating a new project.
-- ============================================================

-- Enable UUID extension (already enabled in Supabase by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── TABLES ──────────────────────────────────────────────────────────────────

-- businesses: one row per client
CREATE TABLE IF NOT EXISTS businesses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  tagline         TEXT,
  logo_url        TEXT,
  address         TEXT,
  phone           TEXT,
  whatsapp        TEXT,
  email           TEXT,
  google_maps_url TEXT,
  hours           JSONB,  -- { "Mon": { "open": "09:00", "close": "18:00" }, ... }
  primary_color   TEXT NOT NULL DEFAULT '#7C3AED',
  secondary_color TEXT NOT NULL DEFAULT '#F59E0B',
  facebook_url    TEXT,
  instagram_url   TEXT,
  youtube_url     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- memberships: links auth users to businesses with a role
CREATE TABLE IF NOT EXISTS memberships (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'editor')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, business_id)
);

-- services offered by the business
CREATE TABLE IF NOT EXISTS services (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id      UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  slug             TEXT NOT NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  price            NUMERIC(10,2),
  duration_minutes INTEGER,
  thumbnail_url    TEXT,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(business_id, slug)
);

-- customer testimonials / reviews
CREATE TABLE IF NOT EXISTS testimonials (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id      UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  author_name      TEXT NOT NULL,
  author_role      TEXT,
  author_avatar_url TEXT,
  body             TEXT NOT NULL,
  rating           INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_published     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- gallery images
CREATE TABLE IF NOT EXISTS gallery_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  caption     TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- contact form submissions from website visitors
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,
  message     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'replied', 'spam')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── UPDATED_AT TRIGGER ──────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

ALTER TABLE businesses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships       ENABLE ROW LEVEL SECURITY;
ALTER TABLE services          ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials      ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images    ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Helper: returns true if the authenticated user has a membership for the given business
CREATE OR REPLACE FUNCTION is_member(business_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM memberships m
    WHERE m.user_id = auth.uid()
    AND m.business_id = $1
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── businesses ──────────────────────────────────────────────────────────────

-- Anyone can read businesses (used by public website)
CREATE POLICY "businesses_public_read"
  ON businesses FOR SELECT
  USING (true);

-- Only members can update their own business
CREATE POLICY "businesses_member_update"
  ON businesses FOR UPDATE
  USING (is_member(id))
  WITH CHECK (is_member(id));

-- Only service role (server-side) can insert/delete businesses
-- (You'll create businesses via the Supabase dashboard or a trusted backend)
CREATE POLICY "businesses_service_insert"
  ON businesses FOR INSERT
  WITH CHECK (false);  -- Blocked for client; use service role key

CREATE POLICY "businesses_service_delete"
  ON businesses FOR DELETE
  USING (false);  -- Blocked for client; use service role key

-- ─── memberships ─────────────────────────────────────────────────────────────

-- Users can read their own memberships
CREATE POLICY "memberships_own_read"
  ON memberships FOR SELECT
  USING (user_id = auth.uid());

-- Only service role can insert/update/delete memberships
CREATE POLICY "memberships_service_insert"
  ON memberships FOR INSERT
  WITH CHECK (false);

CREATE POLICY "memberships_service_delete"
  ON memberships FOR DELETE
  USING (false);

-- ─── services ────────────────────────────────────────────────────────────────

-- Public can read active services
CREATE POLICY "services_public_read"
  ON services FOR SELECT
  USING (is_active = true);

-- Members can read all services for their business (including inactive)
CREATE POLICY "services_member_read_all"
  ON services FOR SELECT
  USING (is_member(business_id));

-- Members can insert/update/delete their own business's services
CREATE POLICY "services_member_insert"
  ON services FOR INSERT
  WITH CHECK (is_member(business_id));

CREATE POLICY "services_member_update"
  ON services FOR UPDATE
  USING (is_member(business_id))
  WITH CHECK (is_member(business_id));

CREATE POLICY "services_member_delete"
  ON services FOR DELETE
  USING (is_member(business_id));

-- ─── testimonials ─────────────────────────────────────────────────────────────

-- Public can read published testimonials
CREATE POLICY "testimonials_public_read"
  ON testimonials FOR SELECT
  USING (is_published = true);

-- Members can read all testimonials for their business
CREATE POLICY "testimonials_member_read_all"
  ON testimonials FOR SELECT
  USING (is_member(business_id));

-- Members can insert/update/delete
CREATE POLICY "testimonials_member_insert"
  ON testimonials FOR INSERT
  WITH CHECK (is_member(business_id));

CREATE POLICY "testimonials_member_update"
  ON testimonials FOR UPDATE
  USING (is_member(business_id))
  WITH CHECK (is_member(business_id));

CREATE POLICY "testimonials_member_delete"
  ON testimonials FOR DELETE
  USING (is_member(business_id));

-- ─── gallery_images ───────────────────────────────────────────────────────────

CREATE POLICY "gallery_public_read"
  ON gallery_images FOR SELECT
  USING (true);

CREATE POLICY "gallery_member_insert"
  ON gallery_images FOR INSERT
  WITH CHECK (is_member(business_id));

CREATE POLICY "gallery_member_update"
  ON gallery_images FOR UPDATE
  USING (is_member(business_id))
  WITH CHECK (is_member(business_id));

CREATE POLICY "gallery_member_delete"
  ON gallery_images FOR DELETE
  USING (is_member(business_id));

-- ─── contact_inquiries ────────────────────────────────────────────────────────

-- Public (anon) can INSERT inquiries (contact form)
CREATE POLICY "inquiries_public_insert"
  ON contact_inquiries FOR INSERT
  WITH CHECK (true);

-- Members can read inquiries for their business
CREATE POLICY "inquiries_member_read"
  ON contact_inquiries FOR SELECT
  USING (is_member(business_id));

-- Members can update status
CREATE POLICY "inquiries_member_update"
  ON contact_inquiries FOR UPDATE
  USING (is_member(business_id))
  WITH CHECK (is_member(business_id));

-- Members can delete (mark as spam etc.)
CREATE POLICY "inquiries_member_delete"
  ON contact_inquiries FOR DELETE
  USING (is_member(business_id));

-- ─── STORAGE BUCKET ──────────────────────────────────────────────────────────

-- Create a public storage bucket for business assets (logos, gallery images, etc.)
-- Run AFTER creating the bucket in Supabase Storage dashboard:
-- Bucket name: "business-assets", Public: true

-- Storage policy: only members can upload
CREATE POLICY "storage_member_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'business-assets');

-- Public read for all objects in the bucket
CREATE POLICY "storage_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'business-assets');

-- Members can delete their own uploads
CREATE POLICY "storage_member_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'business-assets');

-- ─── INDEXES ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_business_id ON memberships(business_id);
CREATE INDEX IF NOT EXISTS idx_services_business_id ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_business_id ON testimonials(business_id);
CREATE INDEX IF NOT EXISTS idx_gallery_business_id ON gallery_images(business_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_business_id ON contact_inquiries(business_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON contact_inquiries(status);
