import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { GallerySection } from "@/components/public/GallerySection";
import { getTemplate } from "@/lib/templates";

export default async function SiteGalleryPage({ params }: { params: { slug: string } }) {
    const db = createServiceClient();
    const { data: business } = await db.from("businesses").select("id, name, template").eq("slug", params.slug).single();
    if (!business) notFound();

    const template = getTemplate(business.template);
    const colors = template.colors;

    const { data: images } = await (db as any)
        .from("gallery_images").select("*")
        .eq("business_id", business.id)
        .order("sort_order");

    return (
        <div style={{ backgroundColor: colors.bg, color: colors.text }} className="pt-32 pb-20 min-h-screen">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="mb-16 text-center">
                    <div style={{ color: colors.primary }} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3">
                        <span style={{ backgroundColor: colors.primary }} className="w-6 h-px" />
                        Our Collection
                        <span style={{ backgroundColor: colors.primary }} className="w-6 h-px" />
                    </div>
                    <h1 style={{ fontFamily: `'${template.fonts.heading}', serif` }} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                        Visual Gallery
                    </h1>
                    <p style={{ color: colors.textMuted }} className="mt-4 max-w-md mx-auto italic font-light">
                        A showcase of {business.name}'s craftsmanship and signature pieces.
                    </p>
                </div>
                <GallerySection images={images ?? []} template={template} />
            </div>
        </div>
    );
}
