"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateStock(formData: FormData) {
    const id = formData.get("id") as string;
    const quantity = Number(formData.get("quantity"));
    const supabase = await createClient();

    const { error } = await (supabase as any)
        .from("services")
        .update({ stock_quantity: quantity })
        .eq("id", id);

    if (error) {
        console.error("Failed to update stock:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/services");
    return { success: true };
}

export async function toggleInventoryManagement(formData: FormData) {
    const id = formData.get("id") as string;
    const enabled = formData.get("enabled") === "true";
    const supabase = await createClient();

    await (supabase as any)
        .from("services")
        .update({ manage_inventory: !enabled })
        .eq("id", id);

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/services");
}
