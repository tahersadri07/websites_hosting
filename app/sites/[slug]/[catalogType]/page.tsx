import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ThemedServicesGrid } from "@/components/public/ThemedServicesGrid";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getBusinessConfig } from "@/lib/business-config";
import { getTemplate } from "@/lib/templates";

export async function generateMetadata({ params }: { params: { slug: string; catalogType: string } }): Promise<Metadata> {
    const db = createServiceClient();
    const { data: business } = await db
        .from("businesses")
        .select("name, services_label, business_type")
        .eq("slug", params.slug)
        .single();
    
    if (!business) return {};
    
    const config = getBusinessConfig(business.business_type);
    const label = business.services_label || config.plural;
    
    return {
        title: `${label} — ${business.name}`,
        description: `Browse all ${label.toLowerCase()} offered by ${business.name}.`,
    };
}

export default async function SiteServicesPage({ params }: { params: { slug: string; catalogType: string } }) {
    const db = createServiceClient();
    const { data: business } = await db
        .from("businesses")
        .select("id, name, services_label, currency_symbol, whatsapp, business_type, template")
        .eq("slug", params.slug)
        .single();
        
    if (!business) notFound();

    const config = getBusinessConfig(business.business_type);
    const template = getTemplate(business.template);
    const colors = template.colors;
    
    // Strict enforcement: if URL doesn't match business type, 404
    if (params.catalogType !== config.urlPath) {
        notFound();
    }

    const [{ data: services }, { data: categories }] = await Promise.all([
        (db as any)
            .from("services")
            .select("id, slug, title, description, price, duration_minutes, thumbnail_url, item_number, category_id, sort_order, tags")
            .eq("business_id", business.id)
            .eq("is_active", true)
            .order("sort_order"),
        db
            .from("categories")
            .select("id, name, slug")
            .eq("business_id", business.id)
            .order("sort_order")
    ]);

    const label = business.services_label || config.plural;

    return (
        <div style={{ backgroundColor: colors.bg, color: colors.text }} className="pt-24 pb-20 min-h-screen">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="mb-12 text-center">
                    <div style={{ color: colors.primary }} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3">
                        <span style={{ backgroundColor: colors.primary }} className="w-4 h-px" />
                        What We Offer
                        <span style={{ backgroundColor: colors.primary }} className="w-4 h-px" />
                    </div>
                    <h1 style={{ fontFamily: `'${template.fonts.heading}', serif` }} className="text-4xl md:text-5xl font-bold tracking-tight">
                        {label}
                    </h1>
                    <p style={{ color: colors.textMuted }} className="mt-3 max-w-md mx-auto">
                        Browse everything {business.name} has to offer — click any item to view details &amp; order via WhatsApp.
                    </p>
                </div>
                <Suspense fallback={<div className="py-20 text-center opacity-50">Loading services...</div>}>
                    <ThemedServicesGrid
                        services={(services as any[]) ?? []}
                        categories={(categories as any[]) ?? []}
                        currencySymbol={(business as any).currency_symbol}
                        siteSlug={params.slug}
                        catalogType={config.urlPath}
                        template={template}
                    />
                </Suspense>
            </div>
        </div>
    );
}
