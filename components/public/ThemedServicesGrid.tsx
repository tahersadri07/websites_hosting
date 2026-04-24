"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Clock, ArrowUpRight, Tag, LayoutGrid } from "lucide-react";
import type { TemplateConfig } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Service {
    id: string; slug: string; title: string;
    description: string | null; price: number | null;
    duration_minutes: number | null; thumbnail_url: string | null;
    item_number?: string | number | null;
    category_id?: string | null;
    manage_inventory?: boolean;
    stock_quantity?: number;
}
interface Props {
    services: Service[];
    categories?: Category[];
    limit?: number;
    currencySymbol?: string | null;
    siteSlug?: string | null;
    template: TemplateConfig;
}

export function ThemedServicesGrid({ services, categories = [], limit, currencySymbol = "₹", siteSlug, template }: Props) {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categoryParam);
    const [hovered, setHovered] = useState<string | null>(null);

    // Update selected category when URL param changes
    useEffect(() => {
        if (categoryParam) {
            setSelectedCategoryId(categoryParam);
        }
    }, [categoryParam]);

    const filteredServices = useMemo(() => {
        if (!selectedCategoryId) return services;
        return services.filter(s => s.category_id === selectedCategoryId);
    }, [services, selectedCategoryId]);

    const display = limit ? filteredServices.slice(0, limit) : filteredServices;
    const base = siteSlug ? `/sites/${siteSlug}` : "";
    const serviceBase = `${base}/services`;

    const { colors, style } = template;

    if (services.length === 0) return null;

    return (
        <section style={{ background: colors.bg }} className="py-24 relative overflow-hidden">
            {/* Section accent line */}
            <div style={{ background: `linear-gradient(to right, transparent, ${colors.primary}40, transparent)` }}
                className="absolute top-0 left-0 right-0 h-px" />

            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                    <div>
                        <div style={{ color: colors.primary }}
                            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3">
                            <span style={{ background: colors.primary }} className="w-4 h-px inline-block" />
                            {template.key === "luxury-fashion" ? "The Collection" : "What We Offer"}
                        </div>
                        <h2 style={{ color: colors.text, fontFamily: `'${template.fonts.heading}', sans-serif` }}
                            className="text-3xl md:text-4xl font-bold tracking-tight">
                            {template.key === "luxury-fashion" ? "Our Products" :
                             template.key === "warm-salon"     ? "Our Services" :
                             template.key === "corporate-pro"  ? "Our Solutions" : "Products & Services"}
                        </h2>
                    </div>
                    {limit && services.length > limit && (
                        <a href={serviceBase}
                            style={{ color: colors.textMuted }}
                            className="text-sm hover:opacity-80 transition-opacity flex items-center gap-1 group">
                            View all {services.length}
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                    )}
                </div>

                {/* Categories Bar */}
                {!limit && categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-12">
                        <button
                            onClick={() => setSelectedCategoryId(null)}
                            style={{
                                background: selectedCategoryId === null ? colors.primary : colors.surface,
                                color: selectedCategoryId === null ? "#FFFFFF" : colors.textMuted,
                                borderColor: selectedCategoryId === null ? colors.primary : colors.border
                            }}
                            className={cn(
                                "px-5 py-2 rounded-full text-xs font-semibold transition-all border",
                                selectedCategoryId === null ? "shadow-lg" : "hover:border-primary/50"
                            )}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategoryId(cat.id)}
                                style={{
                                    background: selectedCategoryId === cat.id ? colors.primary : colors.surface,
                                    color: selectedCategoryId === cat.id ? "#FFFFFF" : colors.textMuted,
                                    borderColor: selectedCategoryId === cat.id ? colors.primary : colors.border
                                }}
                                className={cn(
                                    "px-5 py-2 rounded-full text-xs font-semibold transition-all border",
                                    selectedCategoryId === cat.id ? "shadow-lg" : "hover:border-primary/50"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {display.length === 0 ? (
                        <div style={{ borderColor: colors.border, color: colors.textMuted }}
                            className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl">
                            <LayoutGrid className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No items found in this category.</p>
                        </div>
                    ) : (
                        display.map((service, i) => {
                            const isHovered = hovered === service.id;
                            return (
                                <a key={service.id}
                                    href={`${serviceBase}/${service.slug}`}
                                    onMouseEnter={() => setHovered(service.id)}
                                    onMouseLeave={() => setHovered(null)}
                                    style={{
                                        background: colors.surface,
                                        borderColor: isHovered ? colors.primary + "60" : colors.border,
                                        boxShadow: isHovered ? `0 0 30px ${colors.primary}18` : "none",
                                    }}
                                    className={`group flex flex-col ${style.cardRadius} border overflow-hidden transition-all duration-300`}
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        {service.thumbnail_url ? (
                                            <Image src={service.thumbnail_url} alt={service.title} fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" unoptimized />
                                        ) : (
                                            <div style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}15)` }}
                                                className="w-full h-full flex items-center justify-center">
                                                <span style={{ color: colors.primary + "30" }}
                                                    className="text-6xl font-black select-none">
                                                    {service.title.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        {/* Price badge */}
                                        {service.price != null && (
                                            <div style={{ background: colors.bg + "E6", color: colors.text, borderColor: colors.border }}
                                                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold border backdrop-blur-sm">
                                                {currencySymbol}{service.price.toLocaleString("en-IN")}
                                            </div>
                                        )}
                                        {/* Out of Stock Overlay */}
                                        {service.manage_inventory && (service.stock_quantity ?? 0) <= 0 && (
                                            <div style={{ background: "#000000CC", color: "#FFFFFF" }}
                                                className="absolute inset-0 flex items-center justify-center font-bold text-sm tracking-widest uppercase z-10">
                                                Out of Stock
                                            </div>
                                        )}
                                        {/* Hover tint */}
                                        <div style={{ background: colors.primary + "18" }}
                                            className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-grow">
                                        {/* Item number */}
                                        {(service.item_number != null) && (
                                            <div className="flex items-center gap-1 mb-2">
                                                <Tag className="w-2.5 h-2.5" style={{ color: colors.primary }} />
                                                <span className="text-[10px] font-bold" style={{ color: colors.primary }}>
                                                    Item #{String(service.item_number)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 style={{ color: isHovered ? colors.primary : colors.text, fontFamily: `'${template.fonts.heading}', sans-serif` }}
                                                className="font-semibold text-sm leading-snug transition-colors">
                                                {service.title}
                                            </h3>
                                            <ArrowUpRight style={{ color: isHovered ? colors.primary : colors.border }}
                                                className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 transition-colors" />
                                        </div>
                                        {service.description && (
                                            <p style={{ color: colors.textMuted }}
                                                className="text-xs line-clamp-2 leading-relaxed flex-grow">
                                                {service.description}
                                            </p>
                                        )}
                                        {service.duration_minutes && (
                                            <div style={{ color: colors.textMuted + "90", borderColor: colors.border }}
                                                className="flex items-center gap-1.5 mt-3 text-[11px] border-t pt-3">
                                                <Clock className="w-3 h-3" /> {service.duration_minutes} mins
                                            </div>
                                        )}
                                    </div>
                                </a>
                            );
                        })
                    )}
                </div>

                {/* View all CTA at bottom */}
                {limit && services.length > limit && (
                    <div className="text-center mt-10">
                        <a href={serviceBase}
                            style={{ borderColor: colors.primary + "50", color: colors.primary, background: colors.primary + "10" }}
                            className={`inline-flex items-center gap-2 px-6 py-2.5 ${style.heroRadius} border text-sm font-medium hover:opacity-80 transition-opacity`}>
                            View all {services.length} products <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}

