"use server";

import { getAdminBusinessSlug } from "@/lib/admin-context";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function upsertCategory(formData: FormData) {
    const db = await createClient();
    const slug = await getAdminBusinessSlug();
    
    const { data: business } = await db.from("businesses").select("id").eq("slug", slug).single();
    if (!business) throw new Error("Business not found");

    const id = formData.get("id") as string | null;
    const name = formData.get("name") as string;
    const catSlug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const payload = {
        business_id: business.id,
        name,
        slug: catSlug,
        sort_order: parseInt(formData.get("sort_order") as string || "0"),
    };

    if (id) {
        await db.from("categories").update(payload).eq("id", id);
    } else {
        await db.from("categories").insert(payload);
    }

    revalidatePath(`/admin/categories`);
}

export async function deleteCategory(id: string) {
    const db = await createClient();
    await db.from("categories").delete().eq("id", id);
    revalidatePath(`/admin/categories`);
}
