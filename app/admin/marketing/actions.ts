"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateMarketingTemplates(formData: FormData) {
    const id = formData.get("id") as string;
    const supabase = await createClient();

    const payload = {
        marketing_whatsapp_template: formData.get("marketing_whatsapp_template"),
        marketing_insta_post_template: formData.get("marketing_insta_post_template"),
        marketing_insta_story_template: formData.get("marketing_insta_story_template"),
    };

    await (supabase as any).from("businesses").update(payload).eq("id", id);

    revalidatePath("/admin/marketing");
    return { success: true };
}
