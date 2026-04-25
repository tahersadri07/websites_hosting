"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
    id: string;
    url: string;
    caption: string | null;
    alt_text: string | null;
}

export function GallerySection({ images, limit, template }: { images: GalleryImage[]; limit?: number; template?: any }) {
    const colors = template?.colors || { bg: "#0A0A0F", border: "#27272A", text: "#FFFFFF", textMuted: "#A1A1AA", primary: "#6366F1", surface: "#13131A" };

    const display = limit ? images.slice(0, limit) : images;
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

    if (display.length === 0) return null;

    const prev = () => setLightboxIdx(i => i !== null ? (i - 1 + display.length) % display.length : null);
    const next = () => setLightboxIdx(i => i !== null ? (i + 1) % display.length : null);

    return (
        <section style={{ background: colors.bg }} className="py-24 relative overflow-hidden">
            {/* Glow */}
            <div style={{ background: colors.primary }} className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full blur-[80px] pointer-events-none opacity-5" />

            <div className="container mx-auto px-6 max-w-7xl relative">
                {/* Header */}
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <div style={{ color: colors.primary }} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3">
                            <span style={{ background: colors.primary }} className="w-4 h-px" />
                            Our Work
                        </div>
                        <h2 style={{ color: colors.text }} className="text-3xl md:text-4xl font-bold tracking-tight">Gallery</h2>
                    </div>
                    {limit && images.length > limit && (
                        <span style={{ color: colors.textMuted }} className="text-xs">{images.length} photos</span>
                    )}
                </div>

                {/* Masonry-style grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {display.map((img, i) => (
                        <button
                            key={img.id}
                            onClick={() => setLightboxIdx(i)}
                            style={{ borderColor: colors.border, borderRadius: template?.style.cardRadius === 'rounded-none' ? '0' : '12px' }}
                            className={`group relative overflow-hidden border transition-all duration-300 cursor-zoom-in
                                ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}
                        >
                            <Image
                                src={img.url} alt={img.alt_text ?? img.caption ?? "Gallery"}
                                fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                unoptimized
                            />
                            {/* Hover overlay */}
                            <div style={{ backgroundColor: `${colors.bg}66` }} className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <ZoomIn style={{ color: colors.text }} className="w-6 h-6" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxIdx !== null && (
                <div
                    style={{ backgroundColor: `${colors.bg}F2` }}
                    className="fixed inset-0 z-50 backdrop-blur-xl flex items-center justify-center p-4"
                    onClick={() => setLightboxIdx(null)}
                >
                    <button
                        onClick={e => { e.stopPropagation(); setLightboxIdx(null); }}
                        style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.textMuted, borderRadius: template?.style.heroRadius === 'rounded-none' ? '0' : '8px' }}
                        className="absolute top-5 right-5 w-9 h-9 border flex items-center justify-center hover:opacity-80 transition-all z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); prev(); }}
                        style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.textMuted }}
                        className="absolute left-5 w-9 h-9 rounded-xl border flex items-center justify-center hover:opacity-80 transition-all z-10"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); next(); }}
                        style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.textMuted }}
                        className="absolute right-5 w-9 h-9 rounded-xl border flex items-center justify-center hover:opacity-80 transition-all z-10"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="relative max-w-4xl max-h-[80vh] w-full h-full" onClick={e => e.stopPropagation()}>
                        <Image
                            src={display[lightboxIdx].url}
                            alt={display[lightboxIdx].alt_text ?? ""}
                            fill className="object-contain rounded-xl"
                            unoptimized
                        />
                    </div>
                    {display[lightboxIdx].caption && (
                        <p style={{ backgroundColor: colors.surface, borderColor: colors.border, color: colors.textMuted }}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm border px-4 py-2 rounded-xl max-w-md text-center">
                            {display[lightboxIdx].caption}
                        </p>
                    )}
                    <p style={{ color: colors.textMuted }} className="absolute bottom-6 right-6 text-[10px] font-bold tracking-widest uppercase opacity-40">
                        {lightboxIdx + 1} / {display.length}
                    </p>
                </div>
            )}
        </section>
    );
}
