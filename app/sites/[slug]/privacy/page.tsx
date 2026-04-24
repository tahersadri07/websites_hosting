import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getTemplate } from "@/lib/templates";

export default async function SitePrivacyPage({ params }: { params: { slug: string } }) {
    const db = createServiceClient();
    const { data: business } = await db.from("businesses").select("*").eq("slug", params.slug).single();
    if (!business) notFound();

    const template = getTemplate((business as any).template ?? null);
    const { colors } = template;

    return (
        <div style={{ background: colors.bg }} className="pt-32 pb-24 min-h-screen">
            <div className="container mx-auto px-6 max-w-3xl">
                <h1 style={{ color: colors.text, fontFamily: `'${template.fonts.heading}', sans-serif` }}
                    className="text-4xl font-bold mb-8">Privacy Policy</h1>
                
                <div style={{ color: colors.textMuted }} className="space-y-6 leading-relaxed">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <section className="space-y-4">
                        <h2 style={{ color: colors.text }} className="text-xl font-bold">1. Information We Collect</h2>
                        <p>We collect information that you provide directly to us, such as when you submit a contact inquiry or book a service. This may include your name, email address, phone number, and any other details you provide.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 style={{ color: colors.text }} className="text-xl font-bold">2. How We Use Your Information</h2>
                        <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to respond to your inquiries.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 style={{ color: colors.text }} className="text-xl font-bold">3. Data Security</h2>
                        <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 style={{ color: colors.text }} className="text-xl font-bold">4. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at {business.email || business.phone}.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
