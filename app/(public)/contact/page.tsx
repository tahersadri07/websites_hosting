import { createClient } from "@/lib/supabase/server";
import { ContactSection } from "@/components/public/ContactSection";
import { notFound } from "next/navigation";

export default async function ContactPage() {
    const slug = process.env.NEXT_PUBLIC_BUSINESS_SLUG;
    if (!slug) return notFound();

    const supabase = await createClient();
    const { data: business } = await (supabase as any)
        .from("businesses")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!business) return notFound();

    return (
        <div className="pt-24 min-h-screen">
            <div className="container mx-auto px-4 pt-12 text-center mb-0">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Contact Us</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    We're here to help! Reach out to us via the form or through our direct contact information.
                </p>
            </div>
            <ContactSection business={business} />

            {/* Map Embed (Optional but highly recommended for local business) */}
            {business.google_maps_url && (
                <div className="container mx-auto px-4 pb-24">
                    <div className="w-full h-[450px] rounded-3xl overflow-hidden shadow-inner border bg-muted/20">
                        <iframe
                            title="Google Maps Location"
                            src={business.google_maps_url}
                            className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
