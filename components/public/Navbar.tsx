"use client";

import type { TemplateConfig } from "@/lib/templates";
import type { BusinessConfig } from "@/lib/business-config";


import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
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
    businessConfig?: BusinessConfig;
}

export function Navbar({ businessName, logoUrl, whatsappNumber, servicesLabel, siteSlug, template, categories = [], businessConfig }: NavbarProps) {
    const { itemCount, wishlistCount, setIsDrawerOpen, setActiveTab } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showServicesDropdown, setShowServicesDropdown] = useState(false);
    const t = useTranslations("nav");
    const pathname = usePathname();
    const router = useRouter();
    const colors = template?.colors || { bg: "#0A0A0F", border: "#27272A", text: "#FAFAFA", textMuted: "#A1A1AA", primary: "#6366F1", surface: "#13131A" };


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
            href: `${base}/${businessConfig?.urlPath ?? 'services'}`, 
            label: servicesLabel || (template?.key === 'influencer-vibe' ? 'Creators' : businessConfig?.plural) || t("services"),
            hasDropdown: categories.length > 0,
            categories: categories
        },
        { href: `${base}/gallery`,  label: t("gallery") },
        { href: `${base}/track-order`, label: "Track Order" },
        { href: `${base}/contact`,  label: t("contact") },
    ];


    const handleWhatsApp = () => {
        if (whatsappNumber) window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`, "_blank");
    };

    return (
        <>
            <header 
                style={{ 
                    backgroundColor: scrolled ? `${colors.bg}${template?.style.navStyle === 'glass' ? 'CC' : ''}` : 'transparent',
                    borderBottomColor: scrolled ? colors.border : 'transparent'
                }}
                className={cn(
                    "fixed top-0 z-50 w-full transition-all duration-300 border-b",
                    template?.style.navStyle === 'glass' && "backdrop-blur-xl",
                    scrolled ? "py-3 shadow-lg" : "py-5 border-transparent"
                )}
            >
                <div className="container mx-auto px-6 flex items-center justify-between max-w-7xl">
                    {/* Logo */}
                    <Link href={base || "/"} className="flex items-center gap-2.5">
                        {logoUrl ? (
                            <Image src={logoUrl} alt={businessName} width={140} height={40}
                                className="h-9 w-auto object-contain" unoptimized />
                        ) : (
                            <span style={{ color: colors.text }} className="text-lg font-bold tracking-tight">
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
                                    style={{ 
                                        color: pathname === link.href ? colors.text : colors.textMuted,
                                        backgroundColor: pathname === link.href ? `${colors.primary}15` : 'transparent'
                                    }}
                                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 hover:opacity-80"
                                >
                                    {link.label}
                                    {link.hasDropdown && (
                                        <svg className={cn("w-3.5 h-3.5 transition-transform duration-200", showServicesDropdown && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </Link>

                                {/* Dropdown menu */}
                                {link.hasDropdown && (
                                    <div 
                                        style={{ 
                                            backgroundColor: colors.surface, 
                                            borderColor: colors.border,
                                            borderRadius: template?.style.heroRadius === 'rounded-none' ? '0' : '12px'
                                        }}
                                        className={cn(
                                            "absolute top-full left-0 mt-1 w-56 border shadow-2xl p-2 transition-all duration-200 origin-top-left z-50",
                                            showServicesDropdown ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                                        )}
                                    >
                                        <Link 
                                            href={link.href} 
                                            style={{ color: colors.textMuted }}
                                            className="block px-3 py-2 text-[10px] font-bold uppercase tracking-wider hover:opacity-80 transition-all mb-1"
                                        >
                                            View All
                                        </Link>
                                        <div style={{ backgroundColor: colors.border }} className="h-px mx-2 mb-1" />
                                        {link.categories?.map(cat => (
                                            <Link 
                                                key={cat.id} 
                                                href={`${link.href}?category=${cat.id}`}
                                                style={{ color: colors.text }}
                                                className="block px-3 py-2 text-sm font-medium hover:opacity-70 transition-colors"
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
                                style={{ color: colors.textMuted }}
                                className="p-2 rounded-xl hover:bg-black/5 relative group transition-all"
                                title="Wishlist"
                            >
                                <Heart className="w-5 h-5" />
                                {wishlistCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                        {wishlistCount}
                                    </span>
                                )}
                            </button>
                            <button 
                                onClick={() => { setActiveTab("cart"); setIsDrawerOpen(true); }}
                                style={{ color: colors.textMuted }}
                                className="p-2 rounded-xl hover:bg-black/5 relative group transition-all"
                                title="Cart"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {itemCount > 0 && (
                                    <span style={{ backgroundColor: colors.primary }} className="absolute top-1 right-1 w-4 h-4 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                        {itemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                        {whatsappNumber && (
                            <button onClick={handleWhatsApp}
                                style={{ backgroundColor: colors.primary, borderRadius: template?.style.heroRadius === 'rounded-none' ? '0' : '8px' }}
                                className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
                                <MessageCircle className="w-4 h-4" />
                                {t("bookNow")}
                            </button>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button onClick={() => setIsOpen(!isOpen)} style={{ color: colors.textMuted }} className="md:hidden transition-colors" aria-label="Menu">
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            {/* Mobile drawer */}
            <div 
                style={{ backgroundColor: colors.surface }}
                className={cn(
                    "fixed inset-0 top-[76px] z-40 md:hidden transition-transform duration-300 overflow-y-auto",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <nav className="flex flex-col gap-1 p-6 pt-8">
                    {navLinks.map(link => (
                        <div key={link.href} className="flex flex-col gap-1">
                            <Link href={link.href} onClick={() => !link.hasDropdown && setIsOpen(false)}
                                style={{ 
                                    color: pathname === link.href ? colors.text : colors.textMuted,
                                    backgroundColor: pathname === link.href ? `${colors.primary}10` : 'transparent',
                                    borderRadius: template?.style.heroRadius === 'rounded-none' ? '0' : '12px'
                                }}
                                className="px-4 py-3 text-base font-medium transition-all flex items-center justify-between"
                            >
                                {link.label}
                                {link.hasDropdown && (
                                    <svg className="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </Link>
                            
                            {link.hasDropdown && (
                                <div style={{ borderColor: colors.border }} className="pl-4 flex flex-col gap-1 mt-1 border-l ml-4">
                                    <Link 
                                        href={link.href} 
                                        onClick={() => setIsOpen(false)}
                                        style={{ color: colors.textMuted }}
                                        className="px-4 py-2 rounded-lg text-sm"
                                    >
                                        All {link.label}
                                    </Link>
                                    {link.categories?.map(cat => (
                                        <Link 
                                            key={cat.id} 
                                            href={`${link.href}?category=${cat.id}`}
                                            onClick={() => setIsOpen(false)}
                                            style={{ color: colors.textMuted }}
                                            className="px-4 py-2 rounded-lg text-sm"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <div style={{ borderColor: colors.border }} className="border-t mt-4 pt-4 space-y-2">
                        {whatsappNumber && (
                            <button onClick={() => { handleWhatsApp(); setIsOpen(false); }}
                                style={{ backgroundColor: colors.primary }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-semibold"
                            >
                                <MessageCircle className="w-4 h-4" />
                                {t("bookNow")}
                            </button>
                        )}
                    </div>
                </nav>
            </div>
        </>
    );
}

