import { getAdminBusinessSlug } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteGalleryImage } from "./actions";
import Link from "next/link";

export default async function GalleryAdminPage() {
    const slug = await getAdminBusinessSlug();
    const supabase = await createClient();

    const { data: business } = await (supabase as any)
        .from("businesses").select("id").eq("slug", slug).single();

    const { data: images } = await (supabase as any)
        .from("gallery_images")
        .select("*")
        .eq("business_id", business?.id)
        .order("sort_order");

    return (
        <div className="max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Gallery</h2>
                    <p className="text-muted-foreground text-sm">Manage the images shown in your gallery.</p>
                </div>
                <Link href="/admin/gallery/new">
                    <Button className="bg-business-primary hover:bg-business-primary/90 rounded-xl">
                        <Plus className="w-4 h-4 mr-2" /> Add Image
                    </Button>
                </Link>
            </div>

            {(!images || images.length === 0) ? (
                <div className="bg-background border rounded-2xl p-16 text-center text-muted-foreground">
                    No images yet. Add your first gallery image!
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img: any) => (
                        <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden border bg-muted">
                            <Image src={img.url} alt={img.caption ?? "Gallery"} fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 gap-2">
                                {img.caption && (
                                    <p className="text-white text-xs text-center leading-relaxed line-clamp-2">{img.caption}</p>
                                )}
                                <form action={deleteGalleryImage}>
                                    <input type="hidden" name="id" value={img.id} />
                                    <Button type="submit" size="sm" variant="destructive" className="rounded-lg h-8 text-xs">
                                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
