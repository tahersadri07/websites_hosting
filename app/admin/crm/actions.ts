"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getAdminBusinessSlug } from "@/lib/admin-context";

export async function upsertCustomer(formData: FormData) {
    const id = formData.get("id") as string | null;
    const slug = await getAdminBusinessSlug();
    const supabase = await createClient();

    const { data: business } = await (supabase as any)
        .from("businesses").select("id").eq("slug", slug).single();

    const payload = {
        business_id: business?.id,
        name: formData.get("name"),
        phone: formData.get("phone"),
        whatsapp: formData.get("whatsapp") || formData.get("phone"),
        email: formData.get("email") || null,
        address: formData.get("address") || null,
        notes: formData.get("notes") || null,
        tags: (formData.get("tags") as string)?.split(",").map(t => t.trim()).filter(Boolean) || [],
    };

    if (id) {
        await (supabase as any).from("customers").update(payload).eq("id", id);
    } else {
        await (supabase as any).from("customers").insert(payload);
    }

    revalidatePath("/admin/crm");
}

export async function deleteCustomer(formData: FormData) {
    const id = formData.get("id") as string;
    const supabase = await createClient();
    await (supabase as any).from("customers").delete().eq("id", id);
    revalidatePath("/admin/crm");
}
