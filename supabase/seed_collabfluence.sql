-- ============================================================
-- COLLABFLUENCE: PREMIUM SEED DATA (INFLUENCER PORTAL)
-- ============================================================

-- 1. CLEANUP (Optional: Remove existing CollabFluence data to start fresh)
-- DELETE FROM services WHERE business_id IN (SELECT id FROM businesses WHERE slug = 'collabfluence');
-- DELETE FROM categories WHERE business_id IN (SELECT id FROM businesses WHERE slug = 'collabfluence');

-- 2. UPDATE BUSINESS SETTINGS
UPDATE businesses SET 
    name = 'CollabFluence',
    tagline = 'The Elite Influencer & Creator Network',
    description = 'CollabFluence connects world-class brands with premium content creators across Tech, Fashion, Travel, and Lifestyle niches. Our mission is to facilitate authentic collaborations that drive real impact.',
    business_type = 'service',
    services_label = 'Creators',
    primary_color = '#EC4899', -- Vibrant Pink
    secondary_color = '#8B5CF6', -- Violet
    template = 'influencer-vibe',
    currency_symbol = '$'
WHERE slug = 'collabfluence';

-- 3. CREATE NICHE CATEGORIES
INSERT INTO categories (business_id, name, slug, sort_order)
SELECT id, 'Tech & Innovation', 'tech', 1 FROM businesses WHERE slug = 'collabfluence' ON CONFLICT DO NOTHING;
INSERT INTO categories (business_id, name, slug, sort_order)
SELECT id, 'Fashion & Lifestyle', 'fashion', 2 FROM businesses WHERE slug = 'collabfluence' ON CONFLICT DO NOTHING;
INSERT INTO categories (business_id, name, slug, sort_order)
SELECT id, 'Travel & Adventure', 'travel', 3 FROM businesses WHERE slug = 'collabfluence' ON CONFLICT DO NOTHING;
INSERT INTO categories (business_id, name, slug, sort_order)
SELECT id, 'Fitness & Wellness', 'fitness', 4 FROM businesses WHERE slug = 'collabfluence' ON CONFLICT DO NOTHING;
INSERT INTO categories (business_id, name, slug, sort_order)
SELECT id, 'Food & Culinary', 'food', 5 FROM businesses WHERE slug = 'collabfluence' ON CONFLICT DO NOTHING;

-- 4. INSERT INFLUENCERS (SERVICES)

-- Tech Influencers
INSERT INTO services (business_id, title, slug, description, price, thumbnail_url, tags, features, category_id, sort_order)
SELECT 
    b.id, 'Marcus Byte', 'marcus-byte', 
    'Leading authority on consumer tech and gadget reviews. Specialized in high-production unboxing and long-form analysis.',
    1200, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop',
    ARRAY['Tech', 'Macro', '450k+ Followers'],
    ARRAY['Full Review Video (10m+)', 'Social Media Shoutout', 'Brand Sponsorship'],
    c.id, 1
FROM businesses b, categories c WHERE b.slug = 'collabfluence' AND c.slug = 'tech' AND c.business_id = b.id;

INSERT INTO services (business_id, title, slug, description, price, thumbnail_url, tags, features, category_id, sort_order)
SELECT 
    b.id, 'Aria Code', 'aria-code', 
    'Software engineer turned creator. Sharing the latest in SaaS, AI tools, and developer lifestyle.',
    800, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop',
    ARRAY['Tech', 'Mid-Tier', '85k+ Followers'],
    ARRAY['Tool Demo Reel', 'Twitter Thread Promotion', 'Live Q&A Session'],
    c.id, 2
FROM businesses b, categories c WHERE b.slug = 'collabfluence' AND c.slug = 'tech' AND c.business_id = b.id;

-- Fashion Influencers
INSERT INTO services (business_id, title, slug, description, price, thumbnail_url, tags, features, category_id, sort_order)
SELECT 
    b.id, 'Elena Vogue', 'elena-vogue', 
    'High-fashion model and stylist. Bringing Parisian elegance to the digital world.',
    2500, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop',
    ARRAY['Fashion', 'Elite', '1.2M+ Followers'],
    ARRAY['Professional Photoshoot', 'Instagram Takeover', 'Exclusive Collection Launch'],
    c.id, 3
FROM businesses b, categories c WHERE b.slug = 'collabfluence' AND c.slug = 'fashion' AND c.business_id = b.id;

INSERT INTO services (business_id, title, slug, description, price, thumbnail_url, tags, features, category_id, sort_order)
SELECT 
    b.id, 'Leo Trend', 'leo-trend', 
    'Streetwear enthusiast and sneakerhead. Focused on the latest urban fashion and underground culture.',
    600, 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&auto=format&fit=crop',
    ARRAY['Fashion', 'Micro', '25k+ Followers'],
    ARRAY['OOTD Story Set', 'Brand Mention in Reel', 'Event Appearance'],
    c.id, 4
FROM businesses b, categories c WHERE b.slug = 'collabfluence' AND c.slug = 'fashion' AND c.business_id = b.id;

-- Travel Influencers
INSERT INTO services (business_id, title, slug, description, price, thumbnail_url, tags, features, category_id, sort_order)
SELECT 
    b.id, 'Wanderer Will', 'wanderer-will', 
    'Adventure travel photographer. Capturing the world''s most remote and beautiful locations.',
    1500, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop',
    ARRAY['Travel', 'Mid-Tier', '120k+ Followers'],
    ARRAY['Cinematic Destination Video', '10x High-Res Images', 'Travel Blog Feature'],
    c.id, 5
FROM businesses b, categories c WHERE b.slug = 'collabfluence' AND c.slug = 'travel' AND c.business_id = b.id;

INSERT INTO services (business_id, title, slug, description, price, thumbnail_url, tags, features, category_id, sort_order)
SELECT 
    b.id, 'Luna Journeys', 'luna-journeys', 
    'Luxury travel and hotel reviewer. Focused on premium experiences and boutique stays.',
    3000, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
    ARRAY['Travel', 'Elite', '800k+ Followers'],
    ARRAY['Hotel/Resort Review Video', 'Story Highlight Feature', 'Press Trip Coverage'],
    c.id, 6
FROM businesses b, categories c WHERE b.slug = 'collabfluence' AND c.slug = 'travel' AND c.business_id = b.id;

-- Fitness Influencers
INSERT INTO services (business_id, title, slug, description, price, thumbnail_url, tags, features, category_id, sort_order)
SELECT 
    b.id, 'Jax Fit', 'jax-fit', 
    'Certified trainer and bodybuilding enthusiast. Motivational content for elite athletes.',
    1000, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop',
    ARRAY['Fitness', 'Macro', '250k+ Followers'],
    ARRAY['Workout Routine Feature', 'Supplement Promotion', 'Gym Brand Ambassador'],
    c.id, 7
FROM businesses b, categories c WHERE b.slug = 'collabfluence' AND c.slug = 'fitness' AND c.business_id = b.id;

-- Food Influencers
INSERT INTO services (business_id, title, slug, description, price, thumbnail_url, tags, features, category_id, sort_order)
SELECT 
    b.id, 'Chef Maya', 'chef-maya', 
    'Home cook sharing easy and delicious recipes for the modern family.',
    500, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop',
    ARRAY['Food', 'Micro', '35k+ Followers'],
    ARRAY['Recipe Tutorial Video', 'Product Cooking Demo', 'Food Photography'],
    c.id, 8
FROM businesses b, categories c WHERE b.slug = 'collabfluence' AND c.slug = 'food' AND c.business_id = b.id;

-- 5. TESTIMONIALS
INSERT INTO testimonials (business_id, author_name, author_role, body, rating)
SELECT id, 'Nike Global', 'Marketing Director', 'CollabFluence helped us reach our target audience with authentic creator partnerships. Highly recommend!', 5 FROM businesses WHERE slug = 'collabfluence' ON CONFLICT DO NOTHING;
INSERT INTO testimonials (business_id, author_name, author_role, body, rating)
SELECT id, 'Adobe Inc.', 'Creative Lead', 'The creators we found through this portal were professional and delivered exceptional content.', 5 FROM businesses WHERE slug = 'collabfluence' ON CONFLICT DO NOTHING;
