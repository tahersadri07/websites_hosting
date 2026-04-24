"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Clock, ArrowRight, ArrowUpRight, Tag, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Service {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    price: number | null;
    duration_minutes: number | null;
    thumbnail_url: string | null;
    item_number?: string | number | null;
    category_id?: string | null;
    business_id?: string;
}

interface ServicesGridProps {
    services: Service[];
    categories?: Category[];
    limit?: number;
    currencySymbol?: string | null;
    siteSlug?: string | null;
}

export function ServicesGrid({ services, categories = [], limit, currencySymbol = "₹", siteSlug }: ServicesGridProps) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [hovered, setHovered] = useState<string | null>(null);

    const filteredServices = useMemo(() => {
        if (!selectedCategoryId) return services;
        return services.filter(s => s.category_id === selectedCategoryId);
    }, [services, selectedCategoryId]);

    const display = limit ? filteredServices.slice(0, limit) : filteredServices;
    const serviceBase = siteSlug ? `/sites/${siteSlug}/services` : "/services";

    if (services.length === 0) return null;

    return (
        <section className="py-12 relative overflow-hidden">
            <div className="container mx-auto relative space-y-8">
                {/* Categories Bar */}
                {!limit && categories.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        <button
                            onClick={() => setSelectedCategoryId(null)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs font-semibold transition-all border",
                                selectedCategoryId === null
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                    : "bg-background text-muted-foreground border-border hover:border-primary/50"
                            )}
                        >
                            All Items
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategoryId(cat.id)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-xs font-semibold transition-all border",
                                    selectedCategoryId === cat.id
                                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                        : "bg-background text-muted-foreground border-border hover:border-primary/50"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {display.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-3xl">
                            <LayoutGrid className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No items found in this category.</p>
                        </div>
                    ) : (
                        display.map((service, i) => (
                            <a
                                key={service.id}
                                href={`${serviceBase}/${service.slug}`}
                                onMouseEnter={() => setHovered(service.id)}
                                onMouseLeave={() => setHovered(null)}
                                className="group relative rounded-2xl border bg-card overflow-hidden flex flex-col hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5"
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                    {service.thumbnail_url ? (
                                        <Image
                                            src={service.thumbnail_url} alt={service.title} fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                            <span className="text-5xl font-black text-primary/5 select-none">
                                                {service.title.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    {/* Price badge */}
                                    {service.price != null && (
                                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold bg-background/90 text-foreground border backdrop-blur-sm shadow-sm">
                                            {currencySymbol}{service.price.toLocaleString("en-IN")}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex-1 min-w-0">
                                            {service.item_number != null && (
                                                <div className="flex items-center gap-1 mb-1">
                                                    <Tag className="w-2.5 h-2.5 text-primary" />
                                                    <span className="text-[10px] font-bold text-primary">
                                                        Item #{String(service.item_number)}
                                                    </span>
                                                </div>
                                            )}
                                            <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
                                                {service.title}
                                            </h3>
                                        </div>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                                    </div>

                                    {service.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-grow">
                                            {service.description}
                                        </p>
                                    )}

                                    {service.duration_minutes && (
                                        <div className="flex items-center gap-1.5 mt-3 text-[11px] text-muted-foreground border-t pt-3">
                                            <Clock className="w-3 h-3" />
                                            {service.duration_minutes} mins
                                        </div>
                                    )}
                                </div>
                            </a>
                        ))
                    )}
                </div>

                {/* View all CTA at bottom */}
                {limit && services.length > limit && (
                    <div className="text-center pt-4">
                        <a href={serviceBase} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                            View All Products
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}

