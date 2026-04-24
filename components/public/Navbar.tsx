"use client";

import type { TemplateConfig } from "@/lib/templates";


import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface NavbarProps {
    businessName: string;
    logoUrl?: string | null;
    whatsappNumber?: string | null;
    servicesLabel?: string | null;
    siteSlug?: string | null;
    template?: TemplateConfig | null;
}

export function Navbar({ businessName, logoUrl, whatsappNumber, servicesLabel, siteSlug, template }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const t = useTranslations("nav");
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const base = siteSlug ? `/sites/${siteSlug}` : "";
    const navLinks = [
        { href: `${base}/`,         label: t("home") },
        { href: `${base}/about`,    label: t("about") },
        { href: `${base}/services`, label: servicesLabel || t("services") },
        { href: `${base}/gallery`,  label: t("gallery") },
        { href: `${base}/contact`,  label: t("contact") },
    ];

    const toggleLocale = () => {
        const next = locale === "en" ? "hi" : "en";
        document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`;
        router.refresh();
    };

    const handleWhatsApp = () => {
        if (whatsappNumber) window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`, "_blank");
    };

    return (
        <header className={cn(
            "fixed top-0 z-50 w-full transition-all duration-300",
            scrolled
                ? "bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-[#27272A] py-3"
                : "bg-transparent py-5"
        )}>
            <div className="container mx-auto px-6 flex items-center justify-between max-w-7xl">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5">
                    {logoUrl ? (
                        <Image src={logoUrl} alt={businessName} width={140} height={40}
                            className="h-9 w-auto object-contain" unoptimized />
                    ) : (
                        <span className="text-lg font-bold text-white tracking-tight">
                            {businessName}
                        </span>
                    )}
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href}
                            className={cn(
                                "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                pathname === link.href
                                    ? "text-white bg-white/8"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* CTA + Language */}
                <div className="hidden md:flex items-center gap-3">
                    <button onClick={toggleLocale}
                        className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
                        {t("language")}
                    </button>
                    {whatsappNumber && (
                        <button onClick={handleWhatsApp}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25">
                            <MessageCircle className="w-4 h-4" />
                            {t("bookNow")}
                        </button>
                    )}
                </div>

                {/* Mobile toggle */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-zinc-400 hover:text-white transition-colors" aria-label="Menu">
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile drawer */}
            <div className={cn(
                "fixed inset-0 top-[56px] z-40 bg-[#0A0A0F]/95 backdrop-blur-xl md:hidden transition-transform duration-300",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <nav className="flex flex-col gap-1 p-6 pt-8">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                            className={cn(
                                "px-4 py-3 rounded-xl text-base font-medium transition-all",
                                pathname === link.href
                                    ? "text-white bg-white/8"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}>
                            {link.label}
                        </Link>
                    ))}
                    <div className="border-t border-[#27272A] mt-4 pt-4 space-y-2">
                        <button onClick={toggleLocale}
                            className="w-full px-4 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-white hover:bg-white/5 transition-all text-left">
                            {t("language")}
                        </button>
                        {whatsappNumber && (
                            <button onClick={() => { handleWhatsApp(); setIsOpen(false); }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold">
                                <MessageCircle className="w-4 h-4" />
                                {t("bookNow")}
                            </button>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
