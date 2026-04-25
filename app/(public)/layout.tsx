import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { FloatingWhatsApp } from "@/components/public/FloatingWhatsApp";
import { Construction } from "lucide-react";
import { CartProvider } from "@/context/CartContext";
import { FloatingCart } from "@/components/public/FloatingCart";

const FALLBACK_BUSINESS = {
    name: "My Business",
    whatsapp: null as string | null,
    phone: null as string | null,
    email: null as string | null,
    address: null as string | null,
    status: "active",
    status_message: null as string | null,
    socials: {},
};

async function getBusinessData() {
    const slug = process.env.NEXT_PUBLIC_BUSINESS_SLUG;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!slug || !supabaseUrl || !supabaseKey || supabaseUrl.includes("your-")) {
        return { business: FALLBACK_BUSINESS, connected: false };
    }

    try {
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();
        const { data: business, error } = await (supabase as any)
            .from("businesses")
            .select("*, business_tools(tool_key, is_enabled)")
            .eq("slug", slug)
            .single();

        if (error || !business) return { business: FALLBACK_BUSINESS, connected: false };
        return { business, connected: true };
    } catch {
        return { business: FALLBACK_BUSINESS, connected: false };
    }
}

/** Full-screen branded maintenance page */
function MaintenancePage({ name, message, status }: { name: string; message?: string | null; status: string }) {
    const isPaused = status === "paused";
    return (
        <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-6 text-center mesh-bg">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-600/8 rounded-full blur-[100px]" />
            </div>
            <div className="relative space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-[#13131A] border border-[#27272A] flex items-center justify-center mx-auto shadow-lg">
                    <Construction className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">{name}</h1>
                    <p className="text-zinc-400 text-sm mt-2 max-w-xs mx-auto">
                        {message ?? (isPaused
                            ? "This website is temporarily paused. We'll be back soon."
                            : "We're performing scheduled maintenance. Please check back in a few minutes."
                        )}
                    </p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/25 bg-amber-500/8 text-amber-400 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {isPaused ? "Temporarily Paused" : "Under Maintenance"}
                </div>
            </div>
        </div>
    );
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const [{ business }, locale, messages] = await Promise.all([
        getBusinessData(),
        getLocale(),
        getMessages(),
    ]);

    // Block public access if paused or in maintenance
    const isBlocked = business.status && business.status !== "active";
    if (isBlocked) {
        return (
            <MaintenancePage
                name={business.name}
                message={(business as any).status_message}
                status={business.status}
            />
        );
    }

    const socials = {
        facebook:  (business as any).facebook_url  ?? null,
        instagram: (business as any).instagram_url ?? null,
        youtube:   (business as any).youtube_url   ?? null,
    };

    const onlinePaymentsEnabled = business.business_tools?.some((t: any) => t.tool_key === 'online_payments' && t.is_enabled) ?? false;

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <CartProvider>
                <div className="flex min-h-screen flex-col">
                    <Navbar
                        businessName={business.name}
                        logoUrl={(business as any).logo_url ?? null}
                        whatsappNumber={business.whatsapp}
                    />
                    <main className="flex-grow">{children}</main>
                    <Footer
                        businessName={business.name}
                        phone={business.phone}
                        email={business.email}
                        address={business.address}
                        socials={socials}
                    />
                    {business.whatsapp && <FloatingWhatsApp phone={business.whatsapp} />}
                    <FloatingCart 
                        businessId={(business as any).id}
                        businessName={business.name} 
                        whatsappNumber={business.whatsapp}
                        currencySymbol={(business as any).currency_symbol ?? "₹"}
                        upiId={(business as any).upi_id ?? null}
                        onlinePaymentsEnabled={onlinePaymentsEnabled}
                    />
                </div>
            </CartProvider>
        </NextIntlClientProvider>
    );
}
