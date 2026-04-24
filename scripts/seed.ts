/**
 * Seed script: inserts demo data for "Priya's Beauty Salon" (Mumbai)
 *
 * Usage:
 *   1. Copy .env.example to .env.local and fill in your Supabase credentials
 *   2. Run: npx ts-node --project tsconfig.seed.json scripts/seed.ts
 *
 * The script is idempotent — it uses upsert and skip-if-exists logic.
 * The service-role key is required to bypass RLS.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

// Load env manually if not using dotenv
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error(
        "❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment."
    );
    process.exit(1);
}

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_KEY);

async function main() {
    console.log("🌱  Seeding demo data for Priya's Beauty Salon...\n");

    // ─── 1. Business ──────────────────────────────────────────────────────────
    const { data: business, error: bizError } = await supabase
        .from("businesses")
        .upsert(
            {
                slug: "priyas-beauty-salon",
                name: "Priya's Beauty Salon",
                tagline: "Look good, feel great — Mumbai's trusted beauty destination",
                logo_url: null, // upload manually later
                address: "42, Linking Road, Bandra West, Mumbai, Maharashtra 400050",
                phone: "+91 98765 43210",
                whatsapp: "+919876543210",
                email: "hello@priyasbeauty.in",
                google_maps_url:
                    "https://maps.google.com/?q=Priya+Beauty+Salon+Bandra+Mumbai",
                hours: {
                    Mon: { open: "10:00", close: "20:00" },
                    Tue: { open: "10:00", close: "20:00" },
                    Wed: { open: "10:00", close: "20:00" },
                    Thu: { open: "10:00", close: "20:00" },
                    Fri: { open: "10:00", close: "21:00" },
                    Sat: { open: "09:00", close: "21:00" },
                    Sun: { open: "11:00", close: "18:00", closed: false },
                },
                primary_color: "#EC4899",   // pink-500
                secondary_color: "#A855F7", // purple-500
                instagram_url: "https://instagram.com/priyasbeautymumbai",
                facebook_url: "https://facebook.com/priyasbeautysalon",
                youtube_url: null,
            },
            { onConflict: "slug" }
        )
        .select()
        .single();

    if (bizError) {
        console.error("❌  Business upsert failed:", bizError.message);
        process.exit(1);
    }
    console.log(`✅  Business: ${business.name} (id: ${business.id})`);

    const BIZ_ID = business.id;

    // ─── 2. Services ─────────────────────────────────────────────────────────
    const services = [
        {
            business_id: BIZ_ID,
            slug: "haircut-styling",
            title: "Haircut & Styling",
            description:
                "A personalised haircut and blowout by our expert stylists. Includes consultation, shampooing, conditioning, cut, and styling.",
            price: 800,
            duration_minutes: 60,
            thumbnail_url:
                "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600",
            sort_order: 1,
            is_active: true,
        },
        {
            business_id: BIZ_ID,
            slug: "bridal-makeup",
            title: "Bridal Makeup",
            description:
                "Complete bridal makeup with premium products. Includes base, eye makeup, contouring, and final look. Pre-bridal consultation included.",
            price: 8500,
            duration_minutes: 180,
            thumbnail_url:
                "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=600",
            sort_order: 2,
            is_active: true,
        },
        {
            business_id: BIZ_ID,
            slug: "facial-treatment",
            title: "Facial & Skin Treatment",
            description:
                "Deep cleansing facial with steam, exfoliation, extraction, and a customised mask. Leaves skin glowing and refreshed.",
            price: 1200,
            duration_minutes: 75,
            thumbnail_url:
                "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600",
            sort_order: 3,
            is_active: true,
        },
        {
            business_id: BIZ_ID,
            slug: "manicure-pedicure",
            title: "Manicure & Pedicure",
            description:
                "Relaxing hand and foot care session with soaking, shaping, cuticle care, scrub, massage, and gel or regular polish.",
            price: 1500,
            duration_minutes: 90,
            thumbnail_url:
                "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600",
            sort_order: 4,
            is_active: true,
        },
        {
            business_id: BIZ_ID,
            slug: "henna-mehendi",
            title: "Henna / Mehendi",
            description:
                "Traditional and contemporary henna designs for weddings, festivals, and special occasions. Both hands or full arms available.",
            price: 600,
            duration_minutes: 45,
            thumbnail_url:
                "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600",
            sort_order: 5,
            is_active: true,
        },
    ];

    const { error: svcError } = await supabase
        .from("services")
        .upsert(services, { onConflict: "business_id,slug" });

    if (svcError) {
        console.error("❌  Services upsert failed:", svcError.message);
        process.exit(1);
    }
    console.log(`✅  Services: ${services.length} inserted/updated`);

    // ─── 3. Testimonials ─────────────────────────────────────────────────────
    const testimonials = [
        {
            business_id: BIZ_ID,
            author_name: "Ananya Sharma",
            author_role: "Regular Customer",
            author_avatar_url:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya",
            body: "Priya's team is absolutely amazing! I've been coming here for 2 years and every visit leaves me feeling like a queen. The bridal makeup they did for my sister's wedding got so many compliments. Highly recommend!",
            rating: 5,
            is_published: true,
        },
        {
            business_id: BIZ_ID,
            author_name: "Meera Patel",
            author_role: "First-time Customer",
            author_avatar_url:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=meera",
            body: "Visited for the first time last week for a facial. The ambiance is so relaxing and the staff is very professional. My skin felt amazing afterwards. Definitely coming back!",
            rating: 5,
            is_published: true,
        },
        {
            business_id: BIZ_ID,
            author_name: "Ritu Kapoor",
            author_role: "Frequent Visitor",
            author_avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=ritu",
            body: "Best salon in Bandra, hands down. Reasonable prices, skilled artists, and they always remember my preferences. The mehendi for my niece's wedding was breathtaking!",
            rating: 5,
            is_published: true,
        },
    ];

    const { error: testError } = await supabase
        .from("testimonials")
        .insert(testimonials);

    if (testError && !testError.message.includes("duplicate")) {
        console.error("❌  Testimonials insert failed:", testError.message);
        process.exit(1);
    }
    console.log(`✅  Testimonials: ${testimonials.length} inserted`);

    // ─── 4. Gallery Images ───────────────────────────────────────────────────
    const galleryImages = [
        {
            business_id: BIZ_ID,
            url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
            caption: "Salon interior — relaxing and modern",
            sort_order: 1,
        },
        {
            business_id: BIZ_ID,
            url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800",
            caption: "Expert hair styling in progress",
            sort_order: 2,
        },
        {
            business_id: BIZ_ID,
            url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800",
            caption: "Beautiful bridal makeup",
            sort_order: 3,
        },
        {
            business_id: BIZ_ID,
            url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800",
            caption: "Traditional mehendi artistry",
            sort_order: 4,
        },
    ];

    const { error: galError } = await supabase
        .from("gallery_images")
        .insert(galleryImages);

    if (galError && !galError.message.includes("duplicate")) {
        console.error("❌  Gallery images insert failed:", galError.message);
        process.exit(1);
    }
    console.log(`✅  Gallery images: ${galleryImages.length} inserted`);

    // ─── 5. Contact Inquiries ─────────────────────────────────────────────────
    const inquiries = [
        {
            business_id: BIZ_ID,
            name: "Sunita Verma",
            phone: "+91 99887 76655",
            email: "sunita.v@gmail.com",
            message:
                "Hi, I'd like to book bridal makeup for my wedding on 15th May. Please let me know your availability.",
            status: "new" as const,
        },
        {
            business_id: BIZ_ID,
            name: "Kavita Nair",
            phone: "+91 90001 23456",
            email: null,
            message:
                "What is the price for a full arms mehendi? Is there a package for brides?",
            status: "replied" as const,
        },
    ];

    const { error: inqError } = await supabase
        .from("contact_inquiries")
        .insert(inquiries);

    if (inqError && !inqError.message.includes("duplicate")) {
        console.error("❌  Inquiries insert failed:", inqError.message);
        process.exit(1);
    }
    console.log(`✅  Inquiries: ${inquiries.length} inserted`);

    console.log("\n🎉  Seeding complete! Business slug: priyas-beauty-salon\n");
    console.log(
        "👉  Set NEXT_PUBLIC_BUSINESS_SLUG=priyas-beauty-salon in .env.local to use this demo data."
    );
}

main().catch((err) => {
    console.error("Unexpected error:", err);
    process.exit(1);
});
