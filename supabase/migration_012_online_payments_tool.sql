-- ============================================================
-- Migration 012: Online Payments Platform Tool
-- ============================================================

-- Insert the 'online_payments' tool into the platform_tools table
INSERT INTO platform_tools (key, name, description, icon, category, sort_order)
VALUES
    ('online_payments', 'Online Payments', 'Enable UPI and automated card payments for your store.', 'CreditCard', 'operations', 11)
ON CONFLICT (key) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    category = EXCLUDED.category,
    sort_order = EXCLUDED.sort_order;
