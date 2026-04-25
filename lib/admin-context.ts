import { headers } from "next/headers";

/**
 * Returns the active business slug for PUBLIC pages.
 * Priority:
 *  1. Subdomain from middleware (production)
 *  2. Custom domain DB lookup (production custom domains)
 *  3. NEXT_PUBLIC_BUSINESS_SLUG env var (dev fallback)
 */
export async function getBusinessSlug(): Promise<string> {
    const h = await headers();
    const slug = h.get("x-business-slug");
    const host = h.get("x-host") ?? "";

    if (slug === "__custom__" && host) {
        try {
            const { createServiceClient } = await import("./supabase/server");
            const db = createServiceClient();
            const { data } = await db
                .from("businesses")
                .select("slug")
                .eq("custom_domain", host)
                .single();
            if (data?.slug) return data.slug;
        } catch { /* fallback */ }
    }

    if (slug && slug !== "__custom__") return slug;
    return process.env.NEXT_PUBLIC_BUSINESS_SLUG ?? "";
}

/**
 * Returns the active business slug for ADMIN pages.
 *
 * On localhost (one domain), every admin user might be a different business.
 * So we derive the business from the logged-in user's Supabase membership,
 * NOT from the env var. This ensures each client sees ONLY their own data.
 *
 * In production with subdomains, the subdomain takes priority.
 */
export async function getAdminBusinessSlug(): Promise<string> {
    const h = await headers();
    const slug = h.get("x-business-slug");
    const host = h.get("x-host") ?? "";
    const platformHost = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "localhost:3000";

    // ── Production subdomain: trust the middleware ────────────────────────────
    const isSubdomain =
        slug &&
        slug !== "__custom__" &&
        host !== platformHost &&
        !host.includes("localhost") &&
        !host.startsWith("www.");

    if (isSubdomain) return slug!;

    // ── Custom domain ─────────────────────────────────────────────────────────
    if (slug === "__custom__" && host) {
        try {
            const { createServiceClient } = await import("./supabase/server");
            const db = createServiceClient();
            const { data } = await db
                .from("businesses")
                .select("slug")
                .eq("custom_domain", host)
                .single();
            if (data?.slug) return data.slug;
        } catch { /* fallback */ }
    }

    // ── Localhost / same domain: derive from the logged-in user's membership ──
    try {
        const { createClient } = await import("./supabase/server");
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            console.log(`[AdminContext] User logged in: ${user.email} (${user.id})`);
            
            // Simplified query: first get the business_id
            const { data: memberships, error: memberError } = await supabase
                .from("memberships")
                .select("business_id, businesses(slug)")
                .eq("user_id", user.id);

            if (memberError) {
                console.error("[AdminContext] Membership query error:", memberError);
            }

            const membership = memberships?.[0];
            const memberSlug = membership?.businesses?.slug;
            
            if (memberSlug) {
                console.log(`[AdminContext] Found membership slug: ${memberSlug}`);
                return memberSlug;
            } else {
                console.log("[AdminContext] No membership found for this user.");
            }
        } else {
            console.log("[AdminContext] No user session found.");
        }
    } catch (err) { 
        console.error("[AdminContext] Exception in getAdminBusinessSlug:", err);
    }

    // ── Final fallback ────────────────────────────────────────────────────────
    // If we're on the root domain and the user is NOT logged in, we can show the fallback.
    // If the user IS logged in but has no membership, we return empty so they get Access Denied.
    const isRootDomain = host === platformHost || host === `www.${platformHost}` || host.includes("localhost");
    
    // Only return the environment fallback if we are on the root domain AND the user is not logged in
    // (This supports local development while preventing production security leaks)
    if (isRootDomain) {
        try {
            const { createClient } = await import("./supabase/server");
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) return ""; // Logged in but no membership? Return empty.
        } catch { /* ignore */ }
    }

    return process.env.NEXT_PUBLIC_BUSINESS_SLUG ?? "";
}
