import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { GallerySection } from "@/components/public/GallerySection";

export default async function SiteGalleryPage({ params }: { params: { slug: string } }) {
    const db = createServiceClient();
    const { data: business } = await db.from("businesses").select("id, name").eq("slug", params.slug).single();
    if (!business) notFound();

    const { data: images } = await (db as any)
        .from("gallery_images").select("*")
        .eq("business_id", business.id)
        .order("sort_order");

    return (
        <div className="pt-24 pb-20 min-h-screen">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight">Gallery</h1>
                    <p className="opacity-50 mt-2">A showcase of {business.name}'s work</p>
                </div>
                <GallerySection images={images ?? []} />
            </div>
        </div>
    );
}
