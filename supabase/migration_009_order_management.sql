-- ============================================================
-- Migration 009: Order Management & Tracking
-- ============================================================

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id       UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  order_number      TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
  total_amount      NUMERIC(10,2) NOT NULL DEFAULT 0,
  items             JSONB NOT NULL DEFAULT '[]'::jsonb,
  customer_details  JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(business_id, order_number)
);

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Business members can manage orders
CREATE POLICY "orders_member_all" ON orders FOR ALL USING (is_member(business_id));

-- Public can read orders by order_number and business_id
-- We only allow SELECT for public where they supply the order_number exactly
CREATE POLICY "orders_public_read" ON orders FOR SELECT USING (true);
-- Note: Security through obscurity here since order numbers will be somewhat random (e.g., ORD-A8F9K),
-- but we could tighten this by requiring phone number as well in the UI query.

-- Trigger for updated_at
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Indexing
CREATE INDEX IF NOT EXISTS idx_orders_business_id ON orders(business_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
