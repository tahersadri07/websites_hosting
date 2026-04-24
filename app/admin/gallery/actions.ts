"use server";
import { getAdminBusinessSlug } from "@/lib/admin-context";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function deleteGalleryImage(formData: FormData) {
    const id = formData.get("id") as string;
    const supabase = await createClient();
    await (supabase as any).from("gallery_images").delete().eq("id", id);
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
}

export async function addGalleryImage(formData: FormData) {
    const slug = await getAdminBusinessSlug();
    const supabase = await createClient();

    const { data: business } = await (supabase as any)
        .from("businesses").select("id").eq("slug", slug).single();

    const payload = {
        business_id: business?.id,
        url: formData.get("url"),
        caption: formData.get("caption") || null,
        sort_order: 99,
    };

    await (supabase as any).from("gallery_images").insert(payload);
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    redirect("/admin/gallery");
}
