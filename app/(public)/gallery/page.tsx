import { createClient } from "@/lib/supabase/server";
import { GallerySection } from "@/components/public/GallerySection";
import { notFound } from "next/navigation";

export default async function GalleryPage() {
    const slug = process.env.NEXT_PUBLIC_BUSINESS_SLUG;
    if (!slug) return notFound();

    const supabase = await createClient();
    const { data: images } = await (supabase as any)
        .from("gallery_images")
        .select("*")
        .order("sort_order");

    return (
        <div className="pt-24 min-h-screen">
            <div className="container mx-auto px-4 pt-12 text-center mb-0">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Gallery</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Take a look at our recent work and the transformation of our clients.
                </p>
            </div>
            <GallerySection images={images || []} />
        </div>
    );
}
