import { MetadataRoute } from "next";
import { createServiceClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const slug = process.env.NEXT_PUBLIC_BUSINESS_SLUG;
    const domain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "localhost:3000";
    const base = `https://${domain}`;

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
        { url: `${base}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
        { url: `${base}/gallery`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${base}/about`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
        { url: `${base}/contact`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ];

    if (!slug) return staticRoutes;

    try {
        const db = createServiceClient();
        const { data: services } = await (db as any)
            .from("services").select("slug, updated_at")
            .eq("is_active", true).limit(100);

        const serviceRoutes: MetadataRoute.Sitemap = (services ?? []).map((s: any) => ({
            url: `${base}/services/${s.slug}`,
            lastModified: new Date(s.updated_at),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));

        return [...staticRoutes, ...serviceRoutes];
    } catch {
        return staticRoutes;
    }
}
