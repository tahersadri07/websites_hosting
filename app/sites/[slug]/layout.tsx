import { createServiceClient } from "@/lib/supabase/server";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FloatingWhatsApp } from "@/components/public/FloatingWhatsApp";
import { ThemeProvider } from "@/components/public/ThemeProvider";
import { getTemplate, getTemplateFontUrl } from "@/lib/templates";
import { Construction } from "lucide-react";
import { headers } from "next/headers";
import { CartProvider } from "@/context/CartContext";
import { FloatingCart } from "@/components/public/FloatingCart";

interface Props {
    children: React.ReactNode;
    params: { slug: string };
}

function MaintenancePage({ name, message, status }: { name: string; message?: string | null; status: string }) {
    return (
        <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-6 text-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/8 rounded-full blur-[100px]" />
            </div>
            <div className="relative space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-[#13131A] border border-[#27272A] flex items-center justify-center mx-auto">
                    <Construction className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">{name}</h1>
                    <p className="text-zinc-400 text-sm mt-2 max-w-xs mx-auto">
                        {message ?? (status === "paused"
                            ? "This website is temporarily paused. We'll be back soon."
                            : "We're performing scheduled maintenance. Please check back shortly.")}
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/25 bg-amber-500/8 text-amber-400 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {status === "paused" ? "Temporarily Paused" : "Under Maintenance"}
                </div>
            </div>
        </div>
    );
}

export default async function SiteLayout({ children, params }: Props) {
    const { slug } = params;
    const db = createServiceClient();

    const [{ data: business, error }, { data: categories }] = await Promise.all([
        db.from("businesses").select("*").eq("slug", slug).single(),
        db.from("categories").select("id, name, slug").eq("business_id", (await db.from("businesses").select("id").eq("slug", slug).single()).data?.id).order("sort_order")
    ]);

    const headerList = headers();
    const host = headerList.get("host") || "";
    const platformHost = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "localhost:3000";
    const isCustomDomain = host !== platformHost && !host.endsWith(`.${platformHost}`) && !host.includes("localhost");

    if (error || !business) notFound();

    if (business.status && business.status !== "active") {
        return (
            <MaintenancePage
                name={business.name}
                message={business.status_message}
                status={business.status}
            />
        );
    }

    const [locale, messages] = await Promise.all([getLocale(), getMessages()]);

    // Resolve template — falls back to "dark-minimal" if not set
    const template = getTemplate((business as any).template ?? null);
    const fontUrl  = getTemplateFontUrl(template);

    const socials = {
        facebook:  business.facebook_url  ?? null,
        instagram: business.instagram_url ?? null,
        youtube:   business.youtube_url   ?? null,
    };

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {/* Template fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href={fontUrl} rel="stylesheet" />

            <CartProvider>
                <ThemeProvider template={template}>
                    <div style={{ background: template.colors.bg }} className="flex min-h-screen flex-col">
                        <Navbar
                            businessName={business.name}
                            logoUrl={business.logo_url ?? null}
                            whatsappNumber={business.whatsapp}
                            servicesLabel={business.services_label}
                            siteSlug={isCustomDomain ? null : slug}
                            template={template}
                            categories={categories ?? []}
                        />
                        <main className="flex-grow">{children}</main>
                        <Footer
                            businessName={business.name}
                            phone={business.phone}
                            email={business.email}
                            address={business.address}
                            whatsapp={business.whatsapp}
                            socials={socials}
                            template={template}
                            siteSlug={isCustomDomain ? null : slug}
                        />
                        {business.whatsapp && <FloatingWhatsApp phone={business.whatsapp} />}
                        <FloatingCart 
                            businessName={business.name} 
                            whatsappNumber={business.whatsapp}
                            currencySymbol={(business as any).currency_symbol ?? "₹"}
                        />
                    </div>
                </ThemeProvider>
            </CartProvider>
        </NextIntlClientProvider>
    );
}
