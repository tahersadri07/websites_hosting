"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Clock, ArrowLeft, MessageCircle, Hash,
    CheckCircle2, ShoppingBag, Share2, Star,
    Package, Sparkles, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TemplateConfig } from "@/lib/templates";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface Service {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    price: number | null;
    duration_minutes: number | null;
    thumbnail_url: string | null;
    image_urls?: string[] | null;
    is_active: boolean;
    item_number?: string | number | null;
    tags?: string[] | null;
    features?: string[] | null;
    manage_inventory?: boolean;
    stock_quantity?: number;
}

interface Props {
    service: Service;
    business: {
        id: string;
        name: string;
        whatsapp?: string | null;
        currency_symbol?: string | null;
        services_label?: string | null;
    };
    siteSlug: string;
    template: TemplateConfig;
    relatedServices?: Service[];
}

export function ProductDetailPage({ service, business, siteSlug, template, relatedServices = [] }: Props) {
    const [copied, setCopied] = useState(false);
    const [activeImage, setActiveImage] = useState<string | null>(service.image_urls?.[0] || service.thumbnail_url || null);
    const { colors, style } = template;

    const currency = business.currency_symbol ?? "₹";
    const itemLabel = business.services_label ?? "Products & Services";
    const backHref = `/sites/${siteSlug}/services`;

    const allImages = [
        ...(service.image_urls || []),
        ...(service.thumbnail_url && !(service.image_urls || []).includes(service.thumbnail_url) ? [service.thumbnail_url] : [])
    ].filter(Boolean).slice(0, 3);

    // Generate item number display — use stored item_number or derive from id
    const itemNum = service.item_number
        ? String(service.item_number)
        : `#${service.id.slice(0, 6).toUpperCase()}`;

    // WhatsApp message — pre-written order inquiry
    const whatsappMessage = [
        `Hello! 👋 I'm interested in ordering:`,
        ``,
        `📦 *${service.title}*`,
        `🔖 Item No: ${itemNum}`,
        service.price != null ? `💰 Price: ${currency}${service.price.toLocaleString("en-IN")}` : null,
        ``,
        `Please confirm availability. Thank you!`,
    ]
        .filter((l) => l !== null)
        .join("\n");

    const whatsappUrl = business.whatsapp
        ? `https://wa.me/${business.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`
        : null;

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* ignore */ }
    };

    // Default feature highlights if none set
    const features = service.features && service.features.length > 0
        ? service.features
        : ["Authentic Quality", "Fast Delivery Available", "Easy WhatsApp Order"];

    return (
        <div style={{ background: colors.bg }} className="min-h-screen pt-24 pb-20">
            {/* Ambient glow */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse 60% 40% at 70% 30%, ${colors.primary}10 0%, transparent 70%)`,
                }}
            />

            <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative">
                {/* Breadcrumb */}
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-2 text-sm font-medium mb-8 group transition-all"
                    style={{ color: colors.textMuted }}
                >
                    <ArrowLeft
                        className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                        style={{ color: colors.primary }}
                    />
                    <span className="group-hover:opacity-80 transition-opacity">
                        Back to {itemLabel}
                    </span>
                </Link>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">

                    {/* ── Left: Image Gallery ── */}
                    <div className="flex flex-col gap-4">
                        <div
                            className={`relative aspect-[4/3] ${style.cardRadius} overflow-hidden border shadow-2xl`}
                            style={{ borderColor: colors.border, background: colors.surface }}
                        >
                            {activeImage ? (
                                <Image
                                    src={activeImage}
                                    alt={service.title}
                                    fill
                                    className="object-cover animate-in fade-in duration-500"
                                    unoptimized
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex flex-col items-center justify-center gap-4"
                                    style={{ background: `linear-gradient(135deg, ${colors.primary}18, ${colors.secondary}12)` }}
                                >
                                    <Package className="w-20 h-20 opacity-20" style={{ color: colors.primary }} />
                                    <span className="text-5xl font-black select-none opacity-10" style={{ color: colors.primary }}>
                                        {service.title.charAt(0)}
                                    </span>
                                </div>
                            )}

                            {/* Share button overlay */}
                            <button
                                onClick={handleShare}
                                className="absolute top-4 right-4 p-2 rounded-xl border backdrop-blur-sm transition-all hover:opacity-80 z-10"
                                style={{ background: colors.bg + "CC", borderColor: colors.border, color: colors.textMuted }}
                                title="Copy link"
                            >
                                {copied ? (
                                    <CheckCircle2 className="w-4 h-4" style={{ color: colors.primary }} />
                                ) : (
                                    <Share2 className="w-4 h-4" />
                                )}
                            </button>

                            {/* Price badge overlay */}
                            {service.price != null && (
                                <div
                                    className="absolute bottom-4 left-4 px-4 py-2 rounded-xl text-sm font-bold shadow-lg backdrop-blur-sm z-10"
                                    style={{ background: colors.primary, color: "#fff" }}
                                >
                                    {currency}{service.price.toLocaleString("en-IN")}
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex items-center gap-4">
                                {allImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(img)}
                                        className={cn(
                                            "relative w-20 aspect-square rounded-xl border-2 overflow-hidden transition-all",
                                            activeImage === img ? "scale-105 border-primary shadow-lg shadow-primary/20" : "border-transparent opacity-60 hover:opacity-100"
                                        )}
                                        style={{ borderColor: activeImage === img ? colors.primary : "transparent" }}
                                    >
                                        <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" unoptimized />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right: Details ── */}
                    <div className="flex flex-col gap-6">

                        {/* Item number badge */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <span
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                                style={{ color: colors.primary, borderColor: colors.primary + "40", background: colors.primary + "12" }}
                            >
                                <Hash className="w-3 h-3" />
                                Item {itemNum}
                            </span>
                            {service.duration_minutes && (
                                <span
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                                    style={{ color: colors.textMuted, borderColor: colors.border, background: colors.surface }}
                                >
                                    <Clock className="w-3 h-3" />
                                    {service.duration_minutes} min
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1
                            className="text-3xl sm:text-4xl xl:text-5xl font-bold leading-tight"
                            style={{ color: colors.text, fontFamily: `'${template.fonts.heading}', sans-serif` }}
                        >
                            {service.title}
                        </h1>

                        {/* Price (large) */}
                        {service.price != null && (
                            <div className="flex items-baseline gap-2">
                                <span
                                    className="text-3xl font-black"
                                    style={{ color: colors.primary }}
                                >
                                    {currency}{service.price.toLocaleString("en-IN")}
                                </span>
                                <span className="text-sm" style={{ color: colors.textMuted }}>
                                    inclusive of all taxes
                                </span>
                            </div>
                        )}

                        {/* Description */}
                        <div
                            className="text-base leading-relaxed border-t pt-6"
                            style={{ color: colors.textMuted, borderColor: colors.border }}
                        >
                            {service.description ?? (
                                <span className="italic opacity-60">No description provided.</span>
                            )}
                        </div>

                        {/* Feature highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {features.map((f, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 p-3 rounded-xl border text-sm"
                                    style={{ background: colors.surface, borderColor: colors.border, color: colors.text }}
                                >
                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: colors.primary }} />
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>

                        {/* Inventory Status */}
                        {service.manage_inventory && (
                            <div className="flex items-center gap-2">
                                {service.stock_quantity! > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-600 border border-green-500/20">
                                        <CheckCircle2 className="w-3 h-3" />
                                        In Stock ({service.stock_quantity})
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-destructive/10 text-destructive border border-destructive/20">
                                        <Package className="w-3 h-3" />
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                        )}

                        {/* WhatsApp CTA */}
                        <div className="flex flex-col gap-3 pt-2">
                            {whatsappUrl ? (
                                (service.manage_inventory && service.stock_quantity! <= 0) ? (
                                    <div
                                        className={`w-full flex items-center justify-center gap-3 px-6 py-4 ${style.heroRadius} font-bold text-base opacity-50 cursor-not-allowed`}
                                        style={{
                                            background: colors.surface,
                                            color: colors.textMuted,
                                            border: `1px solid ${colors.border}`,
                                        }}
                                    >
                                        <Package className="w-5 h-5" />
                                        Currently Out of Stock
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button 
                                            onClick={() => addToCart({
                                                id: service.id,
                                                slug: service.slug,
                                                title: service.title,
                                                price: service.price,
                                                thumbnail_url: service.thumbnail_url,
                                                quantity: 1
                                            })}
                                            className={`flex-1 flex items-center justify-center gap-3 px-6 py-7 ${style.heroRadius} font-bold text-base transition-all hover:opacity-90 active:scale-[0.98] shadow-xl`}
                                            style={{
                                                background: colors.primary,
                                                color: "#fff",
                                                boxShadow: `0 8px 30px ${colors.primary}30`,
                                            }}
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                            Add to Cart
                                        </Button>
                                        <a
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex-1 flex items-center justify-center gap-3 px-6 py-7 ${style.heroRadius} font-bold text-base transition-all hover:opacity-90 active:scale-[0.98] border border-green-500/30`}
                                            style={{
                                                background: "#25D36610",
                                                color: "#16A34A",
                                            }}
                                        >
                                            <MessageCircle className="w-5 h-5 fill-current" />
                                            Direct WhatsApp
                                        </a>
                                    </div>
                                )
                            ) : (
                                <div
                                    className={`w-full flex items-center justify-center gap-3 px-6 py-4 ${style.heroRadius} font-bold text-base border`}
                                    style={{ borderColor: colors.border, color: colors.textMuted }}
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    WhatsApp not set up
                                </div>
                            )}
                        </div>

                        {/* WhatsApp preview */}
                        {whatsappUrl && (
                            <div
                                className="rounded-2xl border p-4 text-xs space-y-1"
                                style={{ background: colors.surface, borderColor: colors.border }}
                            >
                                <div className="flex items-center gap-2 mb-3" style={{ color: colors.textMuted }}>
                                    <MessageCircle className="w-3.5 h-3.5" style={{ color: "#22C55E" }} />
                                    <span className="font-semibold uppercase tracking-wider text-[10px]">
                                        Pre-written WhatsApp message
                                    </span>
                                </div>
                                <pre
                                    className="whitespace-pre-wrap font-mono leading-relaxed"
                                    style={{ color: colors.text, fontSize: "11px" }}
                                >
                                    {whatsappMessage}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Related Products ── */}
                {relatedServices.length > 0 && (
                    <div className="mt-24">
                        <div
                            className="flex items-center gap-3 mb-8 pb-4 border-b"
                            style={{ borderColor: colors.border }}
                        >
                            <Sparkles className="w-5 h-5" style={{ color: colors.primary }} />
                            <h2
                                className="text-xl font-bold"
                                style={{ color: colors.text, fontFamily: `'${template.fonts.heading}', sans-serif` }}
                            >
                                You may also like
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {relatedServices.map((rel) => {
                                const relItemNum = rel.item_number
                                    ? String(rel.item_number)
                                    : `#${rel.id.slice(0, 6).toUpperCase()}`;
                                return (
                                    <Link
                                        key={rel.id}
                                        href={`/sites/${siteSlug}/services/${rel.slug}`}
                                        className={`group ${style.cardRadius} border overflow-hidden flex flex-col transition-all duration-200 hover:opacity-90`}
                                        style={{
                                            background: colors.surface,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            {rel.thumbnail_url ? (
                                                <Image
                                                    src={rel.thumbnail_url}
                                                    alt={rel.title}
                                                    fill
                                                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div
                                                    className="w-full h-full flex items-center justify-center"
                                                    style={{ background: `linear-gradient(135deg, ${colors.primary}18, ${colors.secondary}12)` }}
                                                >
                                                    <span className="text-4xl font-black opacity-10" style={{ color: colors.primary }}>
                                                        {rel.title.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow gap-1">
                                            <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: colors.primary }}>
                                                <Tag className="w-3 h-3" /> {relItemNum}
                                            </span>
                                            <h3 className="text-sm font-semibold leading-snug" style={{ color: colors.text }}>
                                                {rel.title}
                                            </h3>
                                            {rel.price != null && (
                                                <span className="text-sm font-bold mt-auto" style={{ color: colors.primary }}>
                                                    {currency}{rel.price.toLocaleString("en-IN")}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
