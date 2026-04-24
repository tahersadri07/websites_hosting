import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ThemedHero } from "@/components/public/ThemedHero";
import { ThemedServicesGrid } from "@/components/public/ThemedServicesGrid";
import { TestimonialsCarousel } from "@/components/public/TestimonialsCarousel";
import { GallerySection } from "@/components/public/GallerySection";
import { ContactSection } from "@/components/public/ContactSection";
import { getTemplate } from "@/lib/templates";
import type { Metadata } from "next";
import { Suspense } from "react";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const db = createServiceClient();
    const { data: business } = await db
        .from("businesses").select("name, tagline").eq("slug", params.slug).single();
    return {
        title: business?.name ?? "Business",
        description: business?.tagline ?? `Welcome to ${business?.name}`,
    };
}

export default async function SiteHomePage({ params }: Props) {
    const { slug } = params;
    const db = createServiceClient();

    const { data: business } = await db.from("businesses").select("*").eq("slug", slug).single();
    if (!business) notFound();

    const template = getTemplate((business as any).template ?? null);

    const [{ data: bizServices }, { data: bizTestimonials }, { data: bizGallery }] = await Promise.all([
        (db as any).from("services").select("id, slug, title, description, price, duration_minutes, thumbnail_url, item_number, sort_order").eq("business_id", business.id).eq("is_active", true).order("sort_order"),
        (db as any).from("testimonials").select("*").eq("business_id", business.id).order("created_at", { ascending: false }),
        (db as any).from("gallery_images").select("*").eq("business_id", business.id).order("sort_order"),
    ]);

    return (
        <>
            <ThemedHero
                businessName={business.name}
                tagline={business.tagline}
                phone={business.phone}
                whatsapp={business.whatsapp}
                reviewCount={(bizTestimonials ?? []).length}
                coverImageUrl={(business as any).cover_image_url ?? null}
                template={template}
                siteSlug={slug}
            />

            <Suspense fallback={null}>
                <ThemedServicesGrid
                    services={bizServices ?? []}
                    limit={6}
                    currencySymbol={(business as any).currency_symbol ?? "₹"}
                    siteSlug={slug}
                    template={template}
                />
            </Suspense>

            {(bizTestimonials ?? []).length > 0 && (
                <TestimonialsCarousel testimonials={bizTestimonials} />
            )}

            {(bizGallery ?? []).length > 0 && (
                <GallerySection images={bizGallery} limit={8} />
            )}

            <ContactSection business={business} />
        </>
    );
}
