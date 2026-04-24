import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const platformHost = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "localhost:3000";
    const pathname     = request.nextUrl.pathname;

    // ── 1. Resolve business slug from host ────────────────────────────────────
    const host = request.headers.get("host") ?? "";
    let businessSlug = process.env.NEXT_PUBLIC_BUSINESS_SLUG ?? "";

    if (host !== platformHost && host !== `www.${platformHost}`) {
        if (host.endsWith(`.${platformHost}`)) {
            businessSlug = host.replace(`.${platformHost}`, "").split(".")[0];
        } else if (!host.includes("localhost")) {
            businessSlug = "__custom__";
        }
    }

    // ── 2. Build a mutated request with extra headers ─────────────────────────
    // NextResponse.next({ request: { headers } }) injects headers that
    // next/headers() can read in server components.
    const requestWithSlug = NextResponse.next({
        request: {
            headers: new Headers({
                ...Object.fromEntries(request.headers.entries()),
                "x-business-slug": businessSlug,
                "x-host": host,
            }),
        },
    });

    // ── 3. Super-admin: skip Supabase auth ────────────────────────────────────
    if (pathname.startsWith("/superadmin")) {
        return requestWithSlug;
    }

    // ── 4. Guard /admin without Supabase config ───────────────────────────────
    if (!supabaseUrl || !supabaseKey || supabaseUrl === "your-supabase-url") {
        if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return requestWithSlug;
    }

    // ── 5. Supabase session refresh — preserving our extra headers ────────────
    // We clone the request headers including our new ones, then pass to updateSession.
    const augmentedHeaders = new Headers(request.headers);
    augmentedHeaders.set("x-business-slug", businessSlug);
    augmentedHeaders.set("x-host", host);

    // Rebuild a minimal NextRequest-compatible object
    const { NextRequest: NR } = await import("next/server");
    const augmented = new NR(request.url, {
        headers: augmentedHeaders,
        method: request.method,
    });

    return await updateSession(augmented);
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
