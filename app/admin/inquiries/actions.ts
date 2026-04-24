"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateInquiryStatus(formData: FormData) {
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    const supabase = await createClient();
    await (supabase as any).from("contact_inquiries").update({ status }).eq("id", id);
    revalidatePath("/admin/inquiries");
    revalidatePath("/admin");
}
