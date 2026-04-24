-- ============================================================
-- Migration 006: Marketing Tools & Templates
-- ============================================================

-- Add marketing template columns to businesses
ALTER TABLE businesses 
ADD COLUMN IF NOT EXISTS marketing_whatsapp_template TEXT DEFAULT 'Check out our latest product: *{{name}}*! \n\n💰 Price: {{price}}\n📝 Details: {{description}}\n\n🔗 View more: {{link}}',
ADD COLUMN IF NOT EXISTS marketing_insta_post_template TEXT DEFAULT 'New Arrival: {{name}} ✨\n\n{{description}}\n\nPrice: {{price}}\nTap the link in our bio to order! 🛍️\n\n#{{name}} #BusinessUpdate #NewProduct',
ADD COLUMN IF NOT EXISTS marketing_insta_story_template TEXT DEFAULT '✨ NEW: {{name}} ✨ \nNow available for {{price}}! \n\nClick the link in bio to shop now 📲';
