"use server";
import { getAdminBusinessSlug } from "@/lib/admin-context";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function deleteTestimonial(formData: FormData) {
    const id = formData.get("id") as string;
    const supabase = await createClient();
    await (supabase as any).from("testimonials").delete().eq("id", id);
    revalidatePath("/admin/testimonials");
}

export async function toggleTestimonialPublished(formData: FormData) {
    const id = formData.get("id") as string;
    const isPublished = formData.get("is_published") === "true";
    const supabase = await createClient();
    await (supabase as any).from("testimonials").update({ is_published: !isPublished }).eq("id", id);
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
}

export async function addTestimonial(formData: FormData) {
    const slug = await getAdminBusinessSlug();
    const supabase = await createClient();

    const { data: business } = await (supabase as any)
        .from("businesses").select("id").eq("slug", slug).single();

    const rating = Number(formData.get("rating") ?? 5);

    const payload = {
        business_id: business?.id,
        author_name: formData.get("author_name") as string,
        author_role: (formData.get("author_role") as string) || null,
        body: formData.get("body") as string,
        rating: Math.min(5, Math.max(1, rating)),
        is_published: formData.get("is_published") === "on",
    };

    await (supabase as any).from("testimonials").insert(payload);
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    redirect("/admin/testimonials");
}
