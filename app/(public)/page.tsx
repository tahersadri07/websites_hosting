import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/public/Hero";
import { ServicesGrid } from "@/components/public/ServicesGrid";
import { TestimonialsCarousel } from "@/components/public/TestimonialsCarousel";
import { GallerySection } from "@/components/public/GallerySection";
import { ContactSection } from "@/components/public/ContactSection";
import { notFound } from "next/navigation";

export default async function HomePage() {
    const slug = process.env.NEXT_PUBLIC_BUSINESS_SLUG;
    if (!slug) return notFound();

    const supabase = await createClient();

    // Fetch everything in parallel
    const [businessRes, servicesRes, testimonialsRes, galleryRes] = await Promise.all([
        (supabase as any).from("businesses").select("*").eq("slug", slug).single(),
        (supabase as any).from("services").select("*").eq("is_active", true).order("sort_order"),
        (supabase as any).from("testimonials").select("*").eq("is_published", true).order("created_at", { ascending: false }),
        (supabase as any).from("gallery_images").select("*").order("sort_order")
    ]);

    const business = businessRes.data;
    if (!business) return notFound();

    return (
        <>
            <Hero
                businessName={business.name}
                tagline={business.tagline}
                phone={business.phone}
                whatsapp={business.whatsapp}
            />

            <ServicesGrid
                services={servicesRes.data || []}
                limit={6}
            />

            {testimonialsRes.data && testimonialsRes.data.length > 0 && (
                <TestimonialsCarousel testimonials={testimonialsRes.data} />
            )}

            {galleryRes.data && galleryRes.data.length > 0 && (
                <GallerySection images={galleryRes.data} limit={8} />
            )}

            <ContactSection business={business} />
        </>
    );
}
