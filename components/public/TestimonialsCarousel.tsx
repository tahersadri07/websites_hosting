"use client";

import { useState } from "react";
import { Star, Quote } from "lucide-react";

interface Testimonial {
    id: string;
    author_name: string;
    author_role: string | null;
    author_avatar_url: string | null;
    body: string;
    rating: number;
}

function cn(...c: any[]) { return c.filter(Boolean).join(" "); }

export function TestimonialsCarousel({ testimonials, template }: { testimonials: Testimonial[]; template?: any }) {
    const colors = template?.colors || { bg: "#0A0A0F", border: "#27272A", text: "#FFFFFF", textMuted: "#A1A1AA", primary: "#6366F1", surface: "#13131A" };
    const isJewelry = template?.key === "rose-gold-jewelry";
    const [paused, setPaused] = useState(false);

    // For jewelry, we want a more static, elegant grid if there are few testimonials
    // If none, we'll show a "Requesting reviews" or just a beautiful empty state
    const displayItems = testimonials.length > 0 ? testimonials : [
        { id: '1', author_name: 'Evelyn W.', author_role: 'Private Collector', body: 'The attention to detail in the Signature Series is truly breathtaking. Every piece feels like a fragment of history.', rating: 5, author_avatar_url: null },
        { id: '2', author_name: 'Julian M.', author_role: 'Boutique Client', body: 'Exceptional craftsmanship and a seamless experience. The rose gold finish has a glow unlike any other.', rating: 5, author_avatar_url: null }
    ];

    const doubled = [...displayItems, ...displayItems];

    if (isJewelry) {
        return (
            <section style={{ background: colors.bg }} className="py-32 relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        {/* Title Column */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="space-y-4">
                                <div style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-[0.4em]">
                                    Client Philosophy
                                </div>
                                <h2 style={{ color: colors.text, fontFamily: `'${template?.fonts.heading}', serif` }} 
                                    className="text-5xl md:text-6xl font-medium leading-[1.1] italic">
                                    Trusted by the most discerning collectors.
                                </h2>
                            </div>
                            <p style={{ color: colors.textMuted }} className="text-lg leading-relaxed font-light italic opacity-80">
                                Our commitment to excellence is reflected in the words of those who wear our creations. Each testimony is a shared moment of timeless elegance.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {[1,2,3].map(i => (
                                        <div key={i} style={{ background: colors.surface, borderColor: colors.bg }} 
                                             className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-[10px] font-bold">
                                             {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ color: colors.textMuted }} className="text-xs font-bold uppercase tracking-widest opacity-60">
                                    Join our community
                                </div>
                            </div>
                        </div>

                        {/* Testimonials Grid */}
                        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {displayItems.slice(0, 4).map((item, idx) => (
                                <div 
                                    key={item.id} 
                                    style={{ 
                                        background: colors.surface, 
                                        borderColor: colors.border,
                                        borderRadius: template?.style.cardRadius,
                                        boxShadow: template?.style.cardShadow
                                    }} 
                                    className={cn(
                                        "p-10 border flex flex-col gap-8 transition-all duration-700 hover:-translate-y-2",
                                        idx === 1 && "md:mt-12"
                                    )}
                                >
                                    <div className="flex gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} style={{ color: colors.primary }} className="w-3 h-3 fill-current" />
                                        ))}
                                    </div>
                                    <blockquote style={{ color: colors.text, fontFamily: `'${template?.fonts.heading}', serif` }} 
                                                className="text-xl leading-relaxed italic">
                                        &ldquo;{item.body}&rdquo;
                                    </blockquote>
                                    <div className="space-y-1">
                                        <p style={{ color: colors.text }} className="text-sm font-bold uppercase tracking-widest">{item.author_name}</p>
                                        <p style={{ color: colors.textMuted }} className="text-[10px] font-medium opacity-60">{item.author_role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Default Marquee for other templates
    return (
        <section style={{ background: colors.bg }} className="py-24 overflow-hidden relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 w-32 h-full z-10 pointer-events-none"
                style={{ background: `linear-gradient(to right, ${colors.bg}, transparent)` }} />
            <div className="absolute right-0 top-0 w-32 h-full z-10 pointer-events-none"
                style={{ background: `linear-gradient(to left, ${colors.bg}, transparent)` }} />

            <div className="container mx-auto px-6 max-w-7xl mb-12">
                <div className="text-center">
                    <div style={{ color: colors.primary }} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] mb-4">
                        <span style={{ background: colors.primary }} className="w-8 h-[1px]" />
                        Kind Words
                    </div>
                    <h2 style={{ color: colors.text, fontFamily: `'${template?.fonts.heading}', serif` }} 
                        className="text-4xl md:text-5xl font-medium tracking-tight mb-6 italic">
                        Voices of Our Clients
                    </h2>
                    <div className="flex items-center justify-center gap-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} style={{ color: colors.primary }} className="w-4 h-4 fill-current" />
                        ))}
                        <span style={{ color: colors.textMuted }} className="text-xs font-bold uppercase tracking-widest ml-3 opacity-60">
                            {testimonials.length} Handcrafted Reviews
                        </span>
                    </div>
                </div>
            </div>

            {/* Marquee */}
            <div
                className="flex"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <div
                    className="flex gap-4 py-2"
                    style={{
                        animation: `marquee 45s linear infinite`,
                        animationPlayState: paused ? "paused" : "running",
                        width: "max-content",
                    }}
                >
                    {doubled.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="w-[340px] flex-shrink-0">
                            <div style={{ background: colors.surface, borderColor: colors.border }} 
                                className="h-full rounded-2xl border p-6 flex flex-col gap-4 transition-colors">
                                {/* Stars + Quote */}
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                             <Star
                                                 key={i}
                                                 style={{ color: i < item.rating ? colors.primary : colors.border }}
                                                 className={cn("w-3.5 h-3.5", i < item.rating && "fill-current")}
                                             />
                                         ))}
                                    </div>
                                    <Quote className="w-5 h-5" style={{ color: colors.border }} />
                                </div>

                                {/* Body */}
                                <blockquote style={{ color: colors.textMuted }} className="text-sm leading-relaxed flex-grow line-clamp-4 italic">
                                    &ldquo;{item.body}&rdquo;
                                </blockquote>

                                {/* Author */}
                                <div style={{ borderColor: colors.border }} className="flex items-center gap-3 pt-3 border-t">
                                    <div style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }} 
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {item.author_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p style={{ color: colors.text }} className="text-sm font-semibold leading-none mb-0.5">{item.author_name}</p>
                                        {item.author_role && (
                                            <p style={{ color: colors.textMuted }} className="text-[11px] opacity-70">{item.author_role}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    );
}
