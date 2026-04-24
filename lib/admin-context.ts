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
    // This ensures admin@salon.com sees salon data, admin@rida.com sees rida data.
    try {
        const { createClient } = await import("./supabase/server");
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: membership } = await (supabase as any)
                .from("memberships")
                .select("businesses(slug)")
                .eq("user_id", user.id)
                .limit(1)
                .single();

            const memberSlug = membership?.businesses?.slug;
            if (memberSlug) return memberSlug;
        }
    } catch { /* fall through */ }

    // ── Final fallback ────────────────────────────────────────────────────────
    return process.env.NEXT_PUBLIC_BUSINESS_SLUG ?? "";
}
