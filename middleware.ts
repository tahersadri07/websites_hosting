import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const platformHost = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "localhost:3000";
    const { pathname } = request.nextUrl;
    const host = request.headers.get("host") ?? "";

    // ── 1. Resolve business slug ─────────────────────────────────────────────
    let businessSlug = "";

    // Skip internal paths
    if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
        return NextResponse.next();
    }

    if (host === platformHost || host === `www.${platformHost}` || host.includes("localhost")) {
        // Main platform - no slug resolution needed for root paths
        businessSlug = "";
    } else if (host.endsWith(`.${platformHost}`)) {
        // Subdomain resolution (tenant.platform.com)
        businessSlug = host.replace(`.${platformHost}`, "").split(".")[0];
    } else {
        // Potential Custom Domain resolution (clientdomain.com)
        // Note: For production, consider using Edge Config or a cache to avoid DB hits
        try {
            const res = await fetch(
                `${supabaseUrl}/rest/v1/businesses?custom_domain=eq.${host}&select=slug`,
                {
                    headers: {
                        apikey: supabaseKey!,
                        Authorization: `Bearer ${supabaseKey}`,
                    },
                }
            );
            const data = await res.json();
            if (data && data.length > 0) {
                businessSlug = data[0].slug;
            }
        } catch (e) {
            console.error("Domain resolution error:", e);
        }
    }

    // ── 2. Handle Rewriting for Custom Domains/Subdomains ────────────────────
    // If we have a businessSlug and we aren't already in the /sites/[slug] or /admin paths
    if (businessSlug && !pathname.startsWith("/sites") && !pathname.startsWith("/admin") && !pathname.startsWith("/superadmin") && !pathname.startsWith("/login")) {
        return NextResponse.rewrite(new URL(`/sites/${businessSlug}${pathname}`, request.url));
    }

    // ── 3. Build response with metadata headers ──────────────────────────────
    const response = NextResponse.next();
    if (businessSlug) response.headers.set("x-business-slug", businessSlug);
    response.headers.set("x-host", host);

    // ── 4. Supabase session refresh (for admin paths) ────────────────────────
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
        return await updateSession(request);
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
