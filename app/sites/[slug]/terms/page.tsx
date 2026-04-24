import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getTemplate } from "@/lib/templates";

export default async function SiteTermsPage({ params }: { params: { slug: string } }) {
    const db = createServiceClient();
    const { data: business } = await db.from("businesses").select("*").eq("slug", params.slug).single();
    if (!business) notFound();

    const template = getTemplate((business as any).template ?? null);
    const { colors } = template;

    return (
        <div style={{ background: colors.bg }} className="pt-32 pb-24 min-h-screen">
            <div className="container mx-auto px-6 max-w-3xl">
                <h1 style={{ color: colors.text, fontFamily: `'${template.fonts.heading}', sans-serif` }}
                    className="text-4xl font-bold mb-8">Terms of Service</h1>
                
                <div style={{ color: colors.textMuted }} className="space-y-6 leading-relaxed">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <section className="space-y-4">
                        <h2 style={{ color: colors.text }} className="text-xl font-bold">1. Acceptance of Terms</h2>
                        <p>By accessing or using the services provided by {business.name}, you agree to be bound by these Terms of Service.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 style={{ color: colors.text }} className="text-xl font-bold">2. Services</h2>
                        <p>We provide various products and services as described on this website. We reserve the right to modify or discontinue any service at any time without notice.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 style={{ color: colors.text }} className="text-xl font-bold">3. Pricing and Payment</h2>
                        <p>Prices for our services are subject to change. Payment terms will be discussed and agreed upon at the time of booking or purchase.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 style={{ color: colors.text }} className="text-xl font-bold">4. Limitation of Liability</h2>
                        <p>{business.name} shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
