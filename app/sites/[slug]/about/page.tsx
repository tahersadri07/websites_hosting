import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getTemplate } from "@/lib/templates";

export default async function SiteAboutPage({ params }: { params: { slug: string } }) {
    const db = createServiceClient();
    const { data: business } = await db.from("businesses").select("*").eq("slug", params.slug).single();
    if (!business) notFound();

    const template = getTemplate((business as any).template ?? null);
    const { colors } = template;

    return (
        <div style={{ background: colors.bg }} className="pt-32 pb-24 min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl relative">
                {/* Glow */}
                <div style={{ background: colors.primary + "10" }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none" />

                <div className="relative space-y-12">
                    {/* Header */}
                    <div className="text-center">
                        <div style={{ color: colors.primary }}
                            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-4">
                            <span style={{ background: colors.primary }} className="w-6 h-px" />
                            Our Story
                            <span style={{ background: colors.primary }} className="w-6 h-px" />
                        </div>
                        <h1 style={{ color: colors.text, fontFamily: `'${template.fonts.heading}', sans-serif` }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            About {business.name}
                        </h1>
                        {business.tagline && (
                            <p style={{ color: colors.textMuted }} className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                {business.tagline}
                            </p>
                        )}
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start border-t border-b py-16"
                        style={{ borderColor: colors.border }}>
                        <div className="space-y-6">
                            <h2 style={{ color: colors.text }} className="text-2xl font-bold">Our Mission</h2>
                            <p style={{ color: colors.textMuted }} className="leading-relaxed">
                                At {business.name}, we are dedicated to providing the highest quality services to our community. 
                                Our team of professionals is committed to excellence and ensuring every customer has a premium experience.
                            </p>
                            <p style={{ color: colors.textMuted }} className="leading-relaxed">
                                Established with a vision to bring world-class standards locally, we've grown to become a trusted name in the industry.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h2 style={{ color: colors.text }} className="text-2xl font-bold">Why Choose Us?</h2>
                            <ul className="space-y-4">
                                {[
                                    "Professional and experienced team",
                                    "Premium quality products and solutions",
                                    "Customer-centric approach",
                                    "State-of-the-art facilities",
                                    "Competitive and transparent pricing"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div style={{ background: colors.primary + "20", color: colors.primary }}
                                            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">
                                            ✓
                                        </div>
                                        <span style={{ color: colors.text }}>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact CTA */}
                    <div style={{ background: colors.surface, borderColor: colors.border }}
                        className="p-10 rounded-3xl border text-center space-y-6">
                        <h3 style={{ color: colors.text }} className="text-2xl font-bold">Ready to experience the best?</h3>
                        <p style={{ color: colors.textMuted }} className="max-w-md mx-auto">
                            Visit us or get in touch today to learn more about our services and how we can help you.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href={`/sites/${params.slug}/contact`}
                                style={{ background: colors.primary, color: "#fff" }}
                                className="px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                                Contact Us
                            </a>
                            {business.phone && (
                                <a href={`tel:${business.phone}`}
                                    style={{ borderColor: colors.border, color: colors.text }}
                                    className="px-8 py-3 rounded-xl font-bold text-sm border hover:bg-white/5 transition-all">
                                    Call {business.phone}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
