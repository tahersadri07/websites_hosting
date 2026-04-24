import { createClient } from "@/lib/supabase/server";

export async function JsonLd() {
    const slug = process.env.NEXT_PUBLIC_BUSINESS_SLUG;
    if (!slug) return null;

    const supabase = await createClient();
    const { data: business } = await (supabase as any)
        .from("businesses")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!business) return null;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": business.name,
        "image": business.logo_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
        "@id": `https://${slug}.com`,
        "url": `https://${slug}.com`,
        "telephone": business.phone,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": business.address,
            "addressLocality": "Mumbai", // Example, should be dynamic if possible
            "addressRegion": "MH",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 19.0760, // Placeholder
            "longitude": 72.8777 // Placeholder
        },
        "openingHoursSpecification": Object.entries(business.hours || {}).map(([day, time]: [string, any]) => ({
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": day,
            "opens": time.open,
            "closes": time.close
        })).filter(h => h.opens && h.closes)
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
