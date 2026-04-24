"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, ArrowUpRight, Tag } from "lucide-react";
import type { TemplateConfig } from "@/lib/templates";

interface Service {
    id: string; slug: string; title: string;
    description: string | null; price: number | null;
    duration_minutes: number | null; thumbnail_url: string | null;
    item_number?: string | number | null;
}
interface Props {
    services: Service[];
    limit?: number;
    currencySymbol?: string | null;
    siteSlug?: string | null;
    template: TemplateConfig;
}

export function ThemedServicesGrid({ services, limit, currencySymbol = "₹", siteSlug, template }: Props) {
    const display = limit ? services.slice(0, limit) : services;
    const base = siteSlug ? `/sites/${siteSlug}` : "";
    const serviceBase = `${base}/services`;
    const [hovered, setHovered] = useState<string | null>(null);
    if (display.length === 0) return null;

    const { colors, style } = template;

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

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {display.map((service, i) => {
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
                    })}
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
