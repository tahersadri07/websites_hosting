"use client";

import type { TemplateConfig } from "@/lib/templates";


import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X, MessageCircle, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface NavbarProps {
    businessName: string;
    logoUrl?: string | null;
    whatsappNumber?: string | null;
    servicesLabel?: string | null;
    siteSlug?: string | null;
    template?: TemplateConfig | null;
    categories?: Category[];
}

export function Navbar({ businessName, logoUrl, whatsappNumber, servicesLabel, siteSlug, template, categories = [] }: NavbarProps) {
    const { itemCount, wishlistCount, setIsDrawerOpen, setActiveTab } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showServicesDropdown, setShowServicesDropdown] = useState(false);
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
        { 
            href: `${base}/services`, 
            label: servicesLabel || t("services"),
            hasDropdown: categories.length > 0,
            categories: categories
        },
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
                <Link href={base || "/"} className="flex items-center gap-2.5">
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
                        <div 
                            key={link.href} 
                            className="relative group"
                            onMouseEnter={() => link.hasDropdown && setShowServicesDropdown(true)}
                            onMouseLeave={() => link.hasDropdown && setShowServicesDropdown(false)}
                        >
                            <Link href={link.href}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1",
                                    pathname === link.href
                                        ? "text-white bg-white/8"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                )}>
                                {link.label}
                                {link.hasDropdown && (
                                    <svg className={cn("w-3.5 h-3.5 transition-transform duration-200", showServicesDropdown && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </Link>

                            {/* Dropdown menu */}
                            {link.hasDropdown && (
                                <div className={cn(
                                    "absolute top-full left-0 mt-1 w-56 rounded-xl bg-[#13131A] border border-[#27272A] shadow-2xl p-2 transition-all duration-200 origin-top-left z-50",
                                    showServicesDropdown ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                                )}>
                                    <Link 
                                        href={link.href} 
                                        className="block px-3 py-2 rounded-lg text-xs font-semibold text-zinc-500 hover:text-white hover:bg-white/5 mb-1"
                                    >
                                        View All
                                    </Link>
                                    <div className="h-px bg-[#27272A] mx-2 mb-1" />
                                    {link.categories?.map(cat => (
                                        <Link 
                                            key={cat.id} 
                                            href={`${link.href}?category=${cat.id}`}
                                            className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* CTA + Language */}
                <div className="hidden md:flex items-center gap-3">
                    <div className="flex items-center gap-1.5 mr-2">
                        <button 
                            onClick={() => { setActiveTab("wishlist"); setIsDrawerOpen(true); }}
                            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 relative group transition-all"
                            title="Wishlist"
                        >
                            <Heart className="w-5 h-5" />
                            {wishlistCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-[#0A0A0F]">
                                    {wishlistCount}
                                </span>
                            )}
                        </button>
                        <button 
                            onClick={() => { setActiveTab("cart"); setIsDrawerOpen(true); }}
                            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 relative group transition-all"
                            title="Cart"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-business-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-[#0A0A0F]">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>
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
                "fixed inset-0 top-[56px] z-40 bg-[#0A0A0F]/95 backdrop-blur-xl md:hidden transition-transform duration-300 overflow-y-auto",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <nav className="flex flex-col gap-1 p-6 pt-8">
                    {navLinks.map(link => (
                        <div key={link.href} className="flex flex-col gap-1">
                            <Link href={link.href} onClick={() => !link.hasDropdown && setIsOpen(false)}
                                className={cn(
                                    "px-4 py-3 rounded-xl text-base font-medium transition-all flex items-center justify-between",
                                    pathname === link.href
                                        ? "text-white bg-white/8"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                )}>
                                {link.label}
                                {link.hasDropdown && (
                                    <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </Link>
                            
                            {link.hasDropdown && (
                                <div className="pl-4 flex flex-col gap-1 mt-1 border-l border-[#27272A] ml-4">
                                    <Link 
                                        href={link.href} 
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 rounded-lg text-sm text-zinc-500 hover:text-white"
                                    >
                                        All {link.label}
                                    </Link>
                                    {link.categories?.map(cat => (
                                        <Link 
                                            key={cat.id} 
                                            href={`${link.href}?category=${cat.id}`}
                                            onClick={() => setIsOpen(false)}
                                            className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
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

