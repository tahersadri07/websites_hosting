"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, Phone, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

interface HeroProps {
    businessName: string;
    tagline?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    rating?: number;
    reviewCount?: number;
}

export function Hero({ businessName, tagline, phone, whatsapp, rating = 5, reviewCount = 0 }: HeroProps) {
    const t = useTranslations("hero");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Animated grid dot background
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animFrame: number;
        let t = 0;

        const draw = () => {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;

            const spacing = 32;
            const cols = Math.ceil(canvas.width  / spacing) + 1;
            const rows = Math.ceil(canvas.height / spacing) + 1;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * spacing;
                    const y = j * spacing;
                    const dist = Math.sqrt(
                        Math.pow(x - canvas.width  / 2, 2) +
                        Math.pow(y - canvas.height / 2, 2)
                    );
                    const wave = Math.sin(dist / 60 - t) * 0.5 + 0.5;
                    const alpha = wave * 0.15;
                    ctx.beginPath();
                    ctx.arc(x, y, 1, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`;
                    ctx.fill();
                }
            }
            t += 0.015;
            animFrame = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animFrame);
    }, []);

    const handleWhatsApp = () => {
        if (whatsapp) window.open(`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello! I'd like to learn more about your services.")}`, "_blank");
    };
    const handleCall = () => {
        if (phone) window.location.href = `tel:${phone.replace(/\s/g, "")}`;
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0F] pt-20">
            {/* Animated dot grid */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ opacity: 0.7 }}
            />

            {/* Radial gradient overlays */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/12 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-purple-600/8 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
                {/* Social proof badge */}
                {reviewCount > 0 && (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#27272A] bg-[#13131A]/80 backdrop-blur-sm mb-8 animate-fade-in">
                        <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                        <span className="text-xs text-zinc-400">
                            <span className="text-white font-semibold">{rating}.0</span> · {reviewCount}+ happy customers
                        </span>
                    </div>
                )}

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-6 leading-[1.05] animate-slide-up">
                    {businessName}
                </h1>

                {/* Tagline */}
                <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "150ms" }}>
                    {tagline ?? t("subtitle")}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: "300ms" }}>
                    {whatsapp && (
                        <button
                            onClick={handleWhatsApp}
                            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all shadow-xl shadow-indigo-500/30 text-sm"
                        >
                            <MessageCircle className="w-4 h-4" />
                            {t("ctaWhatsapp")}
                        </button>
                    )}
                    {phone && (
                        <button
                            onClick={handleCall}
                            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl border border-[#27272A] bg-[#13131A]/80 text-zinc-300 font-medium hover:border-zinc-600 hover:text-white transition-all text-sm backdrop-blur-sm"
                        >
                            <Phone className="w-4 h-4" />
                            {t("ctaCall")}
                        </button>
                    )}
                    <Link
                        href="/services"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-zinc-500 hover:text-white text-sm font-medium transition-colors"
                    >
                        View Services <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Scroll hint */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: "800ms" }}>
                    <div className="w-5 h-8 border border-zinc-700 rounded-full flex justify-center pt-1.5">
                        <div className="w-0.5 h-2 bg-zinc-600 rounded-full animate-bounce" />
                    </div>
                </div>
            </div>
        </section>
    );
}
