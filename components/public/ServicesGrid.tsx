"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, ArrowRight, ArrowUpRight, Tag } from "lucide-react";

interface Service {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    price: number | null;
    duration_minutes: number | null;
    thumbnail_url: string | null;
    item_number?: string | number | null;
    business_id?: string;
}

interface ServicesGridProps {
    services: Service[];
    limit?: number;
    currencySymbol?: string | null;
    siteSlug?: string | null;
}

export function ServicesGrid({ services, limit, currencySymbol = "₹", siteSlug }: ServicesGridProps) {
    const display = limit ? services.slice(0, limit) : services;
    const serviceBase = siteSlug ? `/sites/${siteSlug}/services` : "/services";
    const [hovered, setHovered] = useState<string | null>(null);

    if (display.length === 0) return null;

    return (
        <section className="py-24 bg-[#0A0A0F] relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

            <div className="container mx-auto px-6 max-w-7xl relative">
                {/* Section header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">
                            <span className="w-4 h-px bg-indigo-400" />
                            What We Offer
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            Our Products & Services
                        </h2>
                    </div>
                    {limit && services.length > limit && (
                        <a href={serviceBase} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-indigo-400 transition-colors group whitespace-nowrap">
                            View all {services.length}
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                    )}
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {display.map((service, i) => (
                        <a
                            key={service.id}
                            href={`${serviceBase}/${service.slug}`}
                            onMouseEnter={() => setHovered(service.id)}
                            onMouseLeave={() => setHovered(null)}
                            className="group relative rounded-2xl border border-[#27272A] bg-[#13131A] overflow-hidden flex flex-col hover:border-indigo-500/40 transition-all duration-300"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            {/* Image */}
                            <div className="relative aspect-[16/9] overflow-hidden">
                                {service.thumbnail_url ? (
                                    <Image
                                        src={service.thumbnail_url} alt={service.title} fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-900/30 to-purple-900/20 flex items-center justify-center">
                                        <span className="text-5xl font-black text-white/5 select-none">
                                            {service.title.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                {/* Price badge */}
                                {service.price != null && (
                                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0A0A0F]/90 text-white border border-[#27272A] backdrop-blur-sm">
                                        {currencySymbol}{service.price.toLocaleString("en-IN")}
                                    </div>
                                )}
                                {/* Overlay on hover */}
                                <div className={`absolute inset-0 bg-indigo-600/10 transition-opacity duration-300 ${hovered === service.id ? "opacity-100" : "opacity-0"}`} />
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex-1 min-w-0">
                                        {service.item_number != null && (
                                            <div className="flex items-center gap-1 mb-1">
                                                <Tag className="w-2.5 h-2.5 text-indigo-400" />
                                                <span className="text-[10px] font-bold text-indigo-400">
                                                    Item #{String(service.item_number)}
                                                </span>
                                            </div>
                                        )}
                                        <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-indigo-300 transition-colors">
                                            {service.title}
                                        </h3>
                                    </div>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-indigo-400 transition-colors flex-shrink-0 mt-0.5" />
                                </div>

                                {service.description && (
                                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed flex-grow">
                                        {service.description}
                                    </p>
                                )}

                                {service.duration_minutes && (
                                    <div className="flex items-center gap-1.5 mt-3 text-[11px] text-zinc-600 border-t border-[#27272A] pt-3">
                                        <Clock className="w-3 h-3" />
                                        {service.duration_minutes} mins
                                    </div>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
