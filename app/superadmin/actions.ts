"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function logoutSuperAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete("superadmin_token");
    redirect("/superadmin/login");
}

export async function loginSuperAdmin(formData: FormData) {
    const secret = formData.get("secret") as string;
    const validSecret = process.env.SUPERADMIN_SECRET ?? "superdev2024";
    if (secret !== validSecret) {
        return { error: "Invalid secret key" };
    }
    const cookieStore = await cookies();
    cookieStore.set("superadmin_token", validSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
    redirect("/superadmin");
}

export async function setBusinessStatus(formData: FormData) {
    const id     = formData.get("id")     as string;
    const status = formData.get("status") as string;
    const db = createServiceClient();
    const { data: business } = await db.from("businesses").select("slug").eq("id", id).single();
    await db.from("businesses").update({ status }).eq("id", id);
    revalidatePath("/superadmin");
    revalidatePath(`/superadmin/clients/${id}`);
    if (business?.slug) revalidatePath(`/sites/${business.slug}`, "layout");
}

export async function setBusinessTemplate(formData: FormData) {
    const id       = formData.get("id")       as string;
    const template = formData.get("template") as string;
    const db = createServiceClient();
    const { data: business } = await db.from("businesses").select("slug").eq("id", id).single();
    await (db as any).from("businesses").update({ template }).eq("id", id);
    revalidatePath("/superadmin");
    revalidatePath(`/superadmin/clients/${id}`);
    if (business?.slug) revalidatePath(`/sites/${business.slug}`, "layout");
}

export async function toggleBusinessTool(formData: FormData) {
    const business_id = formData.get("business_id") as string;
    const tool_key    = formData.get("tool_key")    as string;
    const current     = formData.get("is_enabled") === "true";
    const db = createServiceClient();

    const { data: existing } = await db
        .from("business_tools")
        .select("id")
        .eq("business_id", business_id)
        .eq("tool_key", tool_key)
        .single();

    if (existing) {
        await db.from("business_tools")
            .update({ is_enabled: !current })
            .eq("id", existing.id);
    } else {
        await db.from("business_tools")
            .insert({ business_id, tool_key, is_enabled: true });
    }

    revalidatePath(`/superadmin/clients/${business_id}`);
}

export async function createBusiness(formData: FormData) {
    const db = createServiceClient();
    const name            = formData.get("name")           as string;
    const slug            = formData.get("slug")           as string;
    const business_type   = formData.get("business_type")  as string;
    const currency_symbol = formData.get("currency_symbol") as string;
    const primary_color   = formData.get("primary_color")  as string;
    const secondary_color = formData.get("secondary_color") as string;

    const { error } = await db.from("businesses").insert({
        name, slug, business_type, currency_symbol, primary_color, secondary_color, status: "active",
    });

    if (error) throw new Error(error.message);

    revalidatePath("/superadmin");
    redirect("/superadmin/clients");
}

/**
 * Creates a Supabase Auth user + membership for a given business.
 * Called from the SuperAdmin client detail page.
 */
export async function inviteAdminUser(formData: FormData) {
    const business_id = formData.get("business_id") as string;
    const email       = formData.get("email")       as string;
    const password    = formData.get("password")    as string;
    const role        = (formData.get("role") as string) || "owner";

    const db = createServiceClient();

    // 1. Create auth user (service role can do this)
    let userId: string | undefined;
    const { data: authData, error: authError } = await db.auth.admin.createUser({
        email,
        password,
        email_confirm: true,   // auto-confirm so they can login immediately
    });

    if (authError) {
        // If user already exists, we find them and just re-link
        if (authError.message.includes("already been registered") || authError.message.includes("already exists")) {
            // Fetch all users to find the one with this email (Supabase admin list is the only way without a custom index)
            // But we'll try to use the search parameter if available in newer Supabase versions
            const { data: { users }, error: listError } = await db.auth.admin.listUsers({
                perPage: 1000 // Increase limit to find them
            });
            const existingUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
            if (!existingUser) throw new Error("User exists in Auth but could not be found. Please contact support.");
            userId = existingUser.id;
        } else {
            throw new Error(`Auth error: ${authError.message}`);
        }
    } else {
        userId = authData.user?.id;
    }

    if (!userId) throw new Error("No user ID returned");

    // 2. Remove any existing memberships for this user (avoid duplicates)
    await db.from("memberships")
        .delete()
        .eq("user_id", userId);

    // 3. Create membership linking user → business
    const { error: memberError } = await db.from("memberships").insert({
        user_id: userId,
        business_id,
        role,
    });

    if (memberError) throw new Error(`Membership error: ${memberError.message}`);

    revalidatePath(`/superadmin/clients/${business_id}`);
}

/**
 * Reassigns an existing Supabase Auth user to a different business.
 * Useful when a user's email already exists.
 */
export async function reassignAdminUser(formData: FormData) {
    const business_id = formData.get("business_id") as string;
    const user_id     = formData.get("user_id")     as string;
    const role        = (formData.get("role") as string) || "owner";

    const db = createServiceClient();

    // Delete ALL memberships for this user first (one business per admin)
    await db.from("memberships").delete().eq("user_id", user_id);

    // Insert new membership
    const { error } = await db.from("memberships").insert({ user_id, business_id, role });
    if (error) throw new Error(error.message);

    revalidatePath(`/superadmin/clients/${business_id}`);
}

/**
 * Removes an admin user from a business and PERMANENTLY deletes their auth account.
 */
export async function removeAdminUser(formData: FormData) {
    const membership_id = formData.get("membership_id") as string;
    const business_id   = formData.get("business_id")   as string;

    const db = createServiceClient();

    // 1. Find the user ID from the membership first
    const { data: membership } = await db
        .from("memberships")
        .select("user_id")
        .eq("id", membership_id)
        .single();

    if (membership?.user_id) {
        // 2. Delete the user from Auth (this will cascade delete memberships via DB foreign key)
        const { error: deleteError } = await db.auth.admin.deleteUser(membership.user_id);
        if (deleteError) {
            // If auth delete fails (e.g. user already gone), at least remove the membership
            await db.from("memberships").delete().eq("id", membership_id);
        }
    } else {
        // If no user found, just cleanup the membership record
        await db.from("memberships").delete().eq("id", membership_id);
    }

    revalidatePath(`/superadmin/clients/${business_id}`);
}

export async function updateBusiness(formData: FormData) {
    const db = createServiceClient();
    const id              = formData.get("id")              as string;
    const name            = formData.get("name")            as string;
    const slug            = formData.get("slug")            as string;
    const business_type   = formData.get("business_type")   as string;
    const services_label  = formData.get("services_label")  as string;
    const currency_symbol = formData.get("currency_symbol") as string;
    const primary_color   = formData.get("primary_color")   as string;
    const secondary_color = formData.get("secondary_color") as string;

    const tagline         = formData.get("tagline")         as string;
    const description     = formData.get("description")     as string;
    
    // Add missing contact fields
    const phone           = formData.get("phone")           as string;
    const whatsapp        = formData.get("whatsapp")        as string;
    const email           = formData.get("email")           as string;
 
    const { error } = await db.from("businesses").update({
        name, slug, tagline, description, business_type, services_label, currency_symbol, primary_color, secondary_color,
        phone, whatsapp, email
    }).eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath(`/superadmin/clients/${id}`);
    revalidatePath("/superadmin");
    revalidatePath(`/sites/${slug}`, "layout");
}
