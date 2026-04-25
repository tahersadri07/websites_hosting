import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getTemplate } from "@/lib/templates";
import { ProductDetailPage } from "@/components/public/ProductDetailPage";
import type { Metadata } from "next";
import { getBusinessConfig } from "@/lib/business-config";

interface Props {
    params: { slug: string; catalogType: string; serviceSlug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const db = createServiceClient();
    const { data: service } = await (db as any)
        .from("services")
        .select("title, description, thumbnail_url, tags")
        .eq("slug", params.serviceSlug)
        .single();
 
    if (!service) return { title: "Creator" };

    const niche = service.tags?.[0] ? ` — ${service.tags[0]} Creator` : '';
    const title = `${service.title}${niche} | CollabFluence`;

    return {
        title,
        description: service.description ?? `Collaborate with ${service.title} on CollabFluence.`,
        openGraph: service.thumbnail_url
            ? { 
                title,
                description: service.description,
                images: [{ url: service.thumbnail_url }] 
              }
            : undefined,
    };
}

export default async function SiteServiceDetailPage({ params }: Props) {
    const db = createServiceClient();

    // Fetch business
    const { data: business } = await db
        .from("businesses")
        .select("id, name, whatsapp, currency_symbol, services_label, template, business_type")
        .eq("slug", params.slug)
        .single();

    if (!business) notFound();

    const config = getBusinessConfig(business.business_type);
    
    // Strict enforcement: if URL doesn't match business type, 404
    if (params.catalogType !== config.urlPath) {
        notFound();
    }

    const template = getTemplate((business as any).template ?? null);

    // Fetch this product/service
    const { data: service } = await (db as any)
        .from("services")
        .select("*")
        .eq("slug", params.serviceSlug)
        .eq("business_id", business.id)
        .eq("is_active", true)
        .single();

    if (!service) notFound();

    // Fetch related (other active services from same business, excluding current)
    const { data: related } = await (db as any)
        .from("services")
        .select("id, slug, title, price, thumbnail_url, item_number")
        .eq("business_id", business.id)
        .eq("is_active", true)
        .neq("id", service.id)
        .order("sort_order")
        .limit(4);

    return (
        <ProductDetailPage
            service={service}
            business={business}
            siteSlug={params.slug}
            catalogType={config.urlPath}
            template={template}
            relatedServices={related ?? []}
        />
    );
}
