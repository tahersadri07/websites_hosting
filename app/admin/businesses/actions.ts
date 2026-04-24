"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";

/** Switch the active business context for the current admin session */
export async function switchBusiness(formData: FormData) {
    const slug = formData.get("slug") as string;
    if (!slug) return;
    const cookieStore = await cookies();
    cookieStore.set("admin_active_biz", slug, {
        path: "/admin",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        sameSite: "lax",
    });
    revalidatePath("/admin", "layout");
    redirect("/admin");
}

/** Create a brand-new business and link the current user as owner */
export async function createBusiness(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const name   = (formData.get("name")   as string).trim();
    const slug   = (formData.get("slug")   as string).trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const btype  = (formData.get("business_type") as string) || "service";
    const label  = (formData.get("services_label") as string) || "Services";
    const curr   = (formData.get("currency_symbol") as string) || "₹";

    if (!name || !slug) return { error: "Name and slug are required." };

    const serviceClient = createServiceClient();

    // Check slug uniqueness
    const { data: existing } = await serviceClient
        .from("businesses").select("id").eq("slug", slug).single();
    if (existing) return { error: `Slug "${slug}" is already taken. Choose another.` };

    // Create business
    const { data: biz, error: bizErr } = await serviceClient
        .from("businesses")
        .insert({
            name,
            slug,
            business_type: btype,
            services_label: label,
            currency_symbol: curr,
            primary_color: "#7C3AED",
            secondary_color: "#F59E0B",
        })
        .select("id")
        .single();

    if (bizErr) return { error: bizErr.message };

    // Link the creating user as owner
    await serviceClient.from("memberships").insert({
        user_id: user.id,
        business_id: biz.id,
        role: "owner",
    });

    // Switch context to the new business
    const cookieStore = await cookies();
    cookieStore.set("admin_active_biz", slug, { path: "/admin", maxAge: 60 * 60 * 24 * 30, httpOnly: true, sameSite: "lax" });

    revalidatePath("/admin", "layout");
    redirect("/admin");
}
