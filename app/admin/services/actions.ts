"use server";
import { getAdminBusinessSlug } from "@/lib/admin-context";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function deleteService(formData: FormData) {
    const id = formData.get("id") as string;
    const supabase = await createClient();
    await (supabase as any).from("services").delete().eq("id", id);
    revalidatePath("/admin/services");
}

export async function toggleServiceActive(formData: FormData) {
    const id = formData.get("id") as string;
    const isActive = formData.get("is_active") === "true";
    const supabase = await createClient();
    await (supabase as any).from("services").update({ is_active: !isActive }).eq("id", id);
    revalidatePath("/admin/services");
}

export async function upsertService(formData: FormData) {
    const id = formData.get("id") as string | null;
    const slug = await getAdminBusinessSlug();
    const supabase = await createClient();

    const { data: business } = await (supabase as any)
        .from("businesses").select("id").eq("slug", slug).single();

    const imageUrls = [
        formData.get("image_url_0"),
        formData.get("image_url_1"),
        formData.get("image_url_2"),
    ].filter(Boolean) as string[];

    const payload = {
        business_id: business?.id,
        category_id: formData.get("category_id") || null,
        title: formData.get("title"),
        slug: (formData.get("title") as string).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        description: formData.get("description"),
        price: formData.get("price") ? Number(formData.get("price")) : null,
        duration_minutes: formData.get("duration_minutes") ? Number(formData.get("duration_minutes")) : null,
        thumbnail_url: imageUrls[0] || formData.get("thumbnail_url") || null,
        image_urls: imageUrls,
        item_number: (formData.get("item_number") as string)?.trim() || null,
        is_active: formData.get("is_active") === "on",
    };

    if (id) {
        await (supabase as any).from("services").update(payload).eq("id", id);
    } else {
        await (supabase as any).from("services").insert(payload);
    }

    revalidatePath("/admin/services");
    revalidatePath("/services");
    redirect("/admin/services");
}
