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

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
    const [paused, setPaused] = useState(false);
    const doubled = [...testimonials, ...testimonials];

    if (testimonials.length === 0) return null;

    return (
        <section className="py-24 bg-[#0A0A0F] overflow-hidden relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 w-32 h-full z-10 pointer-events-none"
                style={{ background: "linear-gradient(to right, #0A0A0F, transparent)" }} />
            <div className="absolute right-0 top-0 w-32 h-full z-10 pointer-events-none"
                style={{ background: "linear-gradient(to left, #0A0A0F, transparent)" }} />

            <div className="container mx-auto px-6 max-w-7xl mb-12">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">
                        <span className="w-4 h-px bg-amber-400" />
                        Customer Stories
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                        What Our Customers Say
                    </h2>
                    <div className="flex items-center justify-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-zinc-500 text-sm ml-2">5.0 · {testimonials.length} reviews</span>
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
                            <div className="h-full rounded-2xl border border-[#27272A] bg-[#13131A] p-6 flex flex-col gap-4 hover:border-indigo-500/30 transition-colors">
                                {/* Stars + Quote */}
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={cn("w-3.5 h-3.5",
                                                    i < item.rating
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-zinc-700"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <Quote className="w-5 h-5 text-zinc-800" />
                                </div>

                                {/* Body */}
                                <blockquote className="text-zinc-400 text-sm leading-relaxed flex-grow line-clamp-4">
                                    &ldquo;{item.body}&rdquo;
                                </blockquote>

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-3 border-t border-[#27272A]">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {item.author_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white leading-none mb-0.5">{item.author_name}</p>
                                        {item.author_role && (
                                            <p className="text-[11px] text-zinc-600">{item.author_role}</p>
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
