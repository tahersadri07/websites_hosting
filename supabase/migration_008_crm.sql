-- ============================================================
-- Migration 008: CRM (Customer Relationship Management)
-- ============================================================

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id       UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  phone             TEXT NOT NULL,
  email             TEXT,
  notes             TEXT,
  tags              TEXT[] DEFAULT '{}',
  total_spend       NUMERIC(10,2) DEFAULT 0,
  last_contacted_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(business_id, phone)
);

-- RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customers_member_read" ON customers FOR SELECT USING (is_member(business_id));
CREATE POLICY "customers_member_insert" ON customers FOR INSERT WITH CHECK (is_member(business_id));
CREATE POLICY "customers_member_update" ON customers FOR UPDATE USING (is_member(business_id));
CREATE POLICY "customers_member_delete" ON customers FOR DELETE USING (is_member(business_id));

-- Trigger for updated_at
CREATE TRIGGER set_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Indexing
CREATE INDEX IF NOT EXISTS idx_customers_business_id ON customers(business_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
