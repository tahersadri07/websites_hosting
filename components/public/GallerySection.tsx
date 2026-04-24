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

export function GallerySection({ images, limit }: { images: GalleryImage[]; limit?: number }) {
    const display = limit ? images.slice(0, limit) : images;
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

    if (display.length === 0) return null;

    const prev = () => setLightboxIdx(i => i !== null ? (i - 1 + display.length) % display.length : null);
    const next = () => setLightboxIdx(i => i !== null ? (i + 1) % display.length : null);

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-600/6 rounded-full blur-[80px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative">
                {/* Header */}
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">
                            <span className="w-4 h-px bg-blue-400" />
                            Our Work
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Gallery</h2>
                    </div>
                    {limit && images.length > limit && (
                        <span className="text-xs text-zinc-600">{images.length} photos</span>
                    )}
                </div>

                {/* Masonry-style grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {display.map((img, i) => (
                        <button
                            key={img.id}
                            onClick={() => setLightboxIdx(i)}
                            className={`group relative overflow-hidden rounded-xl border border-[#27272A] hover:border-indigo-500/40 transition-all duration-300 cursor-zoom-in
                                ${i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}
                        >
                            <Image
                                src={img.url} alt={img.alt_text ?? img.caption ?? "Gallery"}
                                fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                unoptimized
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-[#0A0A0F]/0 group-hover:bg-[#0A0A0F]/40 transition-colors duration-300 flex items-center justify-center">
                                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxIdx !== null && (
                <div
                    className="fixed inset-0 z-50 bg-[#0A0A0F]/95 backdrop-blur-xl flex items-center justify-center p-4"
                    onClick={() => setLightboxIdx(null)}
                >
                    <button
                        onClick={e => { e.stopPropagation(); setLightboxIdx(null); }}
                        className="absolute top-5 right-5 w-9 h-9 rounded-xl border border-[#27272A] bg-[#13131A] flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-all z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); prev(); }}
                        className="absolute left-5 w-9 h-9 rounded-xl border border-[#27272A] bg-[#13131A] flex items-center justify-center text-zinc-400 hover:text-white transition-all z-10"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); next(); }}
                        className="absolute right-5 w-9 h-9 rounded-xl border border-[#27272A] bg-[#13131A] flex items-center justify-center text-zinc-400 hover:text-white transition-all z-10"
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
                        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-zinc-400 bg-[#13131A] border border-[#27272A] px-4 py-2 rounded-xl max-w-md text-center">
                            {display[lightboxIdx].caption}
                        </p>
                    )}
                    <p className="absolute bottom-6 right-6 text-xs text-zinc-700 font-mono">
                        {lightboxIdx + 1} / {display.length}
                    </p>
                </div>
            )}
        </section>
    );
}
