"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateSettings(formData: FormData) {
    const id = formData.get("id") as string;
    const supabase = await createClient();

    const payload = {
        name: formData.get("name"),
        tagline: formData.get("tagline") || null,
        phone: formData.get("phone") || null,
        whatsapp: formData.get("whatsapp") || null,
        email: formData.get("email") || null,
        address: formData.get("address") || null,
        google_maps_url: formData.get("google_maps_url") || null,
        logo_url: formData.get("logo_url") || null,
        cover_image_url: formData.get("cover_image_url") || null,
        primary_color: formData.get("primary_color") || null,
        secondary_color: formData.get("secondary_color") || null,
        instagram_url: formData.get("instagram_url") || null,
        facebook_url: formData.get("facebook_url") || null,
        youtube_url: formData.get("youtube_url") || null,
        business_type: formData.get("business_type") || "service",
        currency_symbol: formData.get("currency_symbol") || "₹",
        custom_domain: ((formData.get("custom_domain") as string) || "").trim().toLowerCase() || null,
        upi_id: formData.get("upi_id") || null,
        razorpay_key_id: formData.get("razorpay_key_id") || null,
        razorpay_key_secret: formData.get("razorpay_key_secret") || null,
    };

    await (supabase as any).from("businesses").update(payload).eq("id", id);

    // Revalidate all public routes since name/tagline/colors affect them
    revalidatePath("/", "layout");
    redirect("/admin/settings");
}
