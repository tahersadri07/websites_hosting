"use server";

import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";

// ─── Password strength checker ────────────────────────────────────────────────
function validatePassword(password: string): string | null {
    if (password.length < 8)
        return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password))
        return "Password must contain at least one uppercase letter.";
    if (!/[0-9]/.test(password))
        return "Password must contain at least one number.";
    if (!/[^A-Za-z0-9]/.test(password))
        return "Password must contain at least one special character (e.g. @, #, !).";
    return null;
}

// ─── Max admins per business ──────────────────────────────────────────────────
const MAX_ADMINS = 5;

export async function signup(formData: FormData) {
    const email       = ((formData.get("email")       ?? "") as string).trim().toLowerCase();
    const password    =  (formData.get("password")    ?? "") as string;
    const name        = ((formData.get("name")         ?? "") as string).trim();
    const inviteCode  = ((formData.get("invite_code") ?? "") as string).trim();

    // ── 1. Basic field validation ─────────────────────────────────────────────
    if (!email || !password || !name || !inviteCode) {
        return { error: "All fields are required." };
    }

    // ── 2. Invite code check (server-side, never exposed to client) ───────────
    const expectedCode = process.env.ADMIN_INVITE_CODE;
    if (!expectedCode) {
        return { error: "Signup is not configured. Please contact the site owner." };
    }
    if (inviteCode !== expectedCode) {
        return { error: "Invalid invite code. Contact your site owner for access." };
    }

    // ── 3. Password strength validation ───────────────────────────────────────
    const passwordError = validatePassword(password);
    if (passwordError) return { error: passwordError };

    // ── 4. Email format sanity check ──────────────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: "Please enter a valid email address." };
    }

    const serviceClient = createServiceClient();
    const slug = process.env.NEXT_PUBLIC_BUSINESS_SLUG ?? "";

    // ── 5. Get the business ───────────────────────────────────────────────────
    const { data: business } = await serviceClient
        .from("businesses")
        .select("id")
        .eq("slug", slug)
        .single();

    if (!business) {
        return { error: "Business not found. Check your configuration." };
    }

    // ── 6. Admin cap — prevent more than MAX_ADMINS per business ──────────────
    const { count: adminCount } = await serviceClient
        .from("memberships")
        .select("id", { count: "exact", head: true })
        .eq("business_id", business.id);

    if ((adminCount ?? 0) >= MAX_ADMINS) {
        return {
            error: `Maximum of ${MAX_ADMINS} admins allowed. Contact an existing admin to gain access.`,
        };
    }

    // ── 7. Create the user via Admin API (no email sent, no rate limit) ───────
    const { data: adminData, error: adminError } =
        await serviceClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: name },
        });

    if (adminError) {
        if (
            adminError.message.toLowerCase().includes("already registered") ||
            adminError.message.toLowerCase().includes("already exists")
        ) {
            return { error: "An account with that email already exists. Please sign in." };
        }
        return { error: adminError.message };
    }

    const userId = adminData.user?.id;
    if (!userId) {
        return { error: "Account creation failed. Please try again." };
    }

    // ── 8. Link the new user to the business as 'owner' ──────────────────────
    await serviceClient.from("memberships").upsert(
        { user_id: userId, business_id: business.id, role: "owner" },
        { onConflict: "user_id,business_id" }
    );

    // ── 9. Auto sign-in with regular client ───────────────────────────────────
    const supabase = await createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (signInError) {
        // Account was created but auto-login failed — send to login with success notice
        redirect("/login?created=1");
    }

    redirect("/admin");
}
