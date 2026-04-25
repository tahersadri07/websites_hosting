-- ============================================================
-- Migration 017: Customer Accounts (Multi-Tenant Auth)
-- ============================================================

-- ─── 1. Add auth_user_id to customers table ──────────────────────────────────
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create an index for quick lookup by auth user
CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON customers(auth_user_id);

-- Make phone column optional (NULLable) to support email-only signups
ALTER TABLE customers ALTER COLUMN phone DROP NOT NULL;

-- Ensure a single user can't have multiple customer records for the same business
-- Note: A customer might already be identified by phone, but now also by auth_user_id.
-- We can enforce uniqueness for (business_id, auth_user_id) if it is not null.
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_business_auth ON customers (business_id, auth_user_id) WHERE auth_user_id IS NOT NULL;

-- ─── 2. Add new tool to platform_tools ───────────────────────────────────────
INSERT INTO platform_tools (key, name, description, icon, category, sort_order)
VALUES (
    'customer_login',
    'Customer Accounts',
    'Allow customers to create accounts, log in, and view their orders or profile.',
    'UserPlus',
    'core',
    11
) ON CONFLICT (key) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    category = EXCLUDED.category,
    sort_order = EXCLUDED.sort_order;

-- ─── 3. Add Row Level Security for Authenticated Customers ───────────────────

DROP POLICY IF EXISTS "customers_self_read" ON customers;
DROP POLICY IF EXISTS "customers_self_update" ON customers;
DROP POLICY IF EXISTS "customers_self_insert" ON customers;

-- Customers can view their own record across any business
CREATE POLICY "customers_self_read"
  ON customers FOR SELECT
  USING (auth_user_id = auth.uid());

-- Customers can update their own record
CREATE POLICY "customers_self_update"
  ON customers FOR UPDATE
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Customers can insert a record for themselves (e.g. during signup flow)
-- They can only insert if they match their own auth.uid()
CREATE POLICY "customers_self_insert"
  ON customers FOR INSERT
  WITH CHECK (auth_user_id = auth.uid());
