import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ServicesGrid } from "@/components/public/ServicesGrid";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const db = createServiceClient();
    const { data: business } = await db
        .from("businesses")
        .select("name, services_label")
        .eq("slug", params.slug)
        .single();
    const label = (business as any)?.services_label ?? "Products & Services";
    return {
        title: `${label} — ${business?.name ?? ""}`,
        description: `Browse all ${label.toLowerCase()} offered by ${business?.name ?? "us"}.`,
    };
}

export default async function SiteServicesPage({ params }: { params: { slug: string } }) {
    const db = createServiceClient();
    const { data: business } = await db
        .from("businesses")
        .select("id, name, services_label, currency_symbol, whatsapp")
        .eq("slug", params.slug)
        .single();
    if (!business) notFound();

    const { data: services } = await (db as any)
        .from("services")
        .select("id, slug, title, description, price, duration_minutes, thumbnail_url, item_number, sort_order")
        .eq("business_id", business.id)
        .eq("is_active", true)
        .order("sort_order");

    const label = (business as any).services_label ?? "Products & Services";

    return (
        <div className="pt-24 pb-20 min-h-screen bg-[#0A0A0F]">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
                        <span className="w-4 h-px bg-indigo-400" />
                        What We Offer
                        <span className="w-4 h-px bg-indigo-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        {label}
                    </h1>
                    <p className="text-zinc-500 mt-3 max-w-md mx-auto">
                        Browse everything {business.name} has to offer — click any item to view details &amp; order via WhatsApp.
                    </p>
                </div>
                <ServicesGrid
                    services={services ?? []}
                    currencySymbol={(business as any).currency_symbol}
                    siteSlug={params.slug}
                />
            </div>
        </div>
    );
}
