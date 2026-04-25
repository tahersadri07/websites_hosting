import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ThemedHero } from "@/components/public/ThemedHero";
import { ThemedServicesGrid } from "@/components/public/ThemedServicesGrid";
import { TestimonialsCarousel } from "@/components/public/TestimonialsCarousel";
import { GallerySection } from "@/components/public/GallerySection";
import { ContactSection } from "@/components/public/ContactSection";
import { NewsletterSection } from "@/components/public/NewsletterSection";
import { getTemplate } from "@/lib/templates";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getBusinessConfig } from "@/lib/business-config";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const db = createServiceClient();
    const { data: business } = await db
        .from("businesses").select("name, tagline, description, business_type").eq("slug", params.slug).single();
    
    if (!business) return { title: "Business" };

    const title = business.business_type === 'service' 
        ? `${business.name} — ${business.tagline || 'Influencer Portal'}`
        : `${business.name} | ${business.tagline || 'Online Store'}`;

    return {
        title,
        description: business.description || business.tagline || `Welcome to ${business.name}`,
    };
}

export default async function SiteHomePage({ params }: Props) {
    const { slug } = params;
    const db = createServiceClient();

    const { data: business } = await db.from("businesses").select("*").eq("slug", slug).single();
    if (!business) notFound();

    const template = getTemplate((business as any).template ?? null);
    const config = getBusinessConfig(business.business_type);

    const [{ data: bizServices }, { data: bizTestimonials }, { data: bizGallery }] = await Promise.all([
        (db as any).from("services").select("id, slug, title, description, price, duration_minutes, thumbnail_url, item_number, category_id, manage_inventory, stock_quantity, sort_order, tags").eq("business_id", business.id).eq("is_active", true).order("sort_order"),
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
                logoUrl={(business as any).logo_url ?? null}
                template={template}
                siteSlug={slug}
                catalogType={config.urlPath}
            />

            <Suspense fallback={null}>
                <ThemedServicesGrid
                    services={bizServices ?? []}
                    limit={6}
                    currencySymbol={(business as any).currency_symbol ?? "₹"}
                    siteSlug={slug}
                    catalogType={config.urlPath}
                    template={template}
                />
            </Suspense>

            {(bizTestimonials ?? []).length > 0 && (
                <TestimonialsCarousel testimonials={bizTestimonials} template={template} />
            )}

            {(bizGallery ?? []).length > 0 && (
                <GallerySection images={bizGallery} limit={8} template={template} />
            )}

            <NewsletterSection template={template} />

            <ContactSection business={business} template={template} />
        </>
    );
}
