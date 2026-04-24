/**
 * Seed script (ESM, no TypeScript) — runs with plain node.
 * Usage: node scripts/seed.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read .env.local manually
const envPath = join(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf8");
const env = {};
for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key) env[key.trim()] = rest.join("=").trim();
}

const SUPABASE_URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const SERVICE_KEY = env["SUPABASE_SERVICE_ROLE_KEY"];

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error("❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

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
                logo_url: null,
                address: "42, Linking Road, Bandra West, Mumbai, Maharashtra 400050",
                phone: "+91 98765 43210",
                whatsapp: "+919876543210",
                email: "hello@priyasbeauty.in",
                google_maps_url: "https://maps.google.com/?q=Priya+Beauty+Salon+Bandra+Mumbai",
                hours: {
                    Mon: { open: "10:00", close: "20:00" },
                    Tue: { open: "10:00", close: "20:00" },
                    Wed: { open: "10:00", close: "20:00" },
                    Thu: { open: "10:00", close: "20:00" },
                    Fri: { open: "10:00", close: "21:00" },
                    Sat: { open: "09:00", close: "21:00" },
                    Sun: { open: "11:00", close: "18:00", closed: false },
                },
                primary_color: "#EC4899",
                secondary_color: "#A855F7",
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
        { business_id: BIZ_ID, slug: "haircut-styling", title: "Haircut & Styling", description: "A personalised haircut and blowout by our expert stylists. Includes consultation, shampooing, conditioning, cut, and styling.", price: 800, duration_minutes: 60, thumbnail_url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600", sort_order: 1, is_active: true },
        { business_id: BIZ_ID, slug: "bridal-makeup", title: "Bridal Makeup", description: "Complete bridal makeup with premium products. Includes base, eye makeup, contouring, and final look. Pre-bridal consultation included.", price: 8500, duration_minutes: 180, thumbnail_url: "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=600", sort_order: 2, is_active: true },
        { business_id: BIZ_ID, slug: "facial-treatment", title: "Facial & Skin Treatment", description: "Deep cleansing facial with steam, exfoliation, extraction, and a customised mask. Leaves skin glowing and refreshed.", price: 1200, duration_minutes: 75, thumbnail_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600", sort_order: 3, is_active: true },
        { business_id: BIZ_ID, slug: "manicure-pedicure", title: "Manicure & Pedicure", description: "Relaxing hand and foot care session with soaking, shaping, cuticle care, scrub, massage, and gel or regular polish.", price: 1500, duration_minutes: 90, thumbnail_url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600", sort_order: 4, is_active: true },
        { business_id: BIZ_ID, slug: "henna-mehendi", title: "Henna / Mehendi", description: "Traditional and contemporary henna designs for weddings, festivals, and special occasions. Both hands or full arms available.", price: 600, duration_minutes: 45, thumbnail_url: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600", sort_order: 5, is_active: true },
    ];

    const { error: svcError } = await supabase.from("services").upsert(services, { onConflict: "business_id,slug" });
    if (svcError) { console.error("❌  Services upsert failed:", svcError.message); process.exit(1); }
    console.log(`✅  Services: ${services.length} inserted/updated`);

    // ─── 3. Testimonials ─────────────────────────────────────────────────────
    // Delete old ones first to avoid duplicates on re-run
    await supabase.from("testimonials").delete().eq("business_id", BIZ_ID);
    const testimonials = [
        { business_id: BIZ_ID, author_name: "Ananya Sharma", author_role: "Regular Customer", author_avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya", body: "Priya's team is absolutely amazing! I've been coming here for 2 years and every visit leaves me feeling like a queen. The bridal makeup they did for my sister's wedding got so many compliments. Highly recommend!", rating: 5, is_published: true },
        { business_id: BIZ_ID, author_name: "Meera Patel", author_role: "First-time Customer", author_avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=meera", body: "Visited for the first time last week for a facial. The ambiance is so relaxing and the staff is very professional. My skin felt amazing afterwards. Definitely coming back!", rating: 5, is_published: true },
        { business_id: BIZ_ID, author_name: "Ritu Kapoor", author_role: "Frequent Visitor", author_avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=ritu", body: "Best salon in Bandra, hands down. Reasonable prices, skilled artists, and they always remember my preferences. The mehendi for my niece's wedding was breathtaking!", rating: 5, is_published: true },
    ];
    const { error: testError } = await supabase.from("testimonials").insert(testimonials);
    if (testError) { console.error("❌  Testimonials insert failed:", testError.message); }
    else console.log(`✅  Testimonials: ${testimonials.length} inserted`);

    // ─── 4. Gallery Images ───────────────────────────────────────────────────
    await supabase.from("gallery_images").delete().eq("business_id", BIZ_ID);
    const galleryImages = [
        { business_id: BIZ_ID, url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800", caption: "Salon interior — relaxing and modern", sort_order: 1 },
        { business_id: BIZ_ID, url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800", caption: "Expert hair styling in progress", sort_order: 2 },
        { business_id: BIZ_ID, url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800", caption: "Beautiful bridal makeup", sort_order: 3 },
        { business_id: BIZ_ID, url: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800", caption: "Traditional mehendi artistry", sort_order: 4 },
    ];
    const { error: galError } = await supabase.from("gallery_images").insert(galleryImages);
    if (galError) { console.error("❌  Gallery images insert failed:", galError.message); }
    else console.log(`✅  Gallery images: ${galleryImages.length} inserted`);

    // ─── 5. Sample Contact Inquiries ─────────────────────────────────────────
    const { count: existingInq } = await supabase.from("contact_inquiries").select("id", { count: "exact", head: true }).eq("business_id", BIZ_ID);
    if (!existingInq || existingInq === 0) {
        const inquiries = [
            { business_id: BIZ_ID, name: "Sunita Verma", phone: "+91 99887 76655", email: "sunita.v@gmail.com", message: "Hi, I'd like to book bridal makeup for my wedding on 15th May. Please let me know your availability.", status: "new" },
            { business_id: BIZ_ID, name: "Kavita Nair", phone: "+91 90001 23456", email: null, message: "What is the price for a full arms mehendi? Is there a package for brides?", status: "replied" },
        ];
        const { error: inqError } = await supabase.from("contact_inquiries").insert(inquiries);
        if (inqError) { console.error("❌  Inquiries insert failed:", inqError.message); }
        else console.log(`✅  Inquiries: ${inquiries.length} inserted`);
    } else {
        console.log(`✅  Inquiries: ${existingInq} already exist, skipping`);
    }

    console.log("\n🎉  Seeding complete!\n");
    console.log("👉  Visit http://localhost:3000 to see the public site");
    console.log("👉  Visit http://localhost:3000/login to access the admin panel\n");
}

main().catch((err) => {
    console.error("Unexpected error:", err);
    process.exit(1);
});
