"use client";

import { useEffect, useRef } from "react";
import { MessageCircle, Phone, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { TemplateConfig } from "@/lib/templates";

interface HeroProps {
    businessName:  string;
    tagline?:      string | null;
    phone?:        string | null;
    whatsapp?:     string | null;
    coverImageUrl?: string | null;
    logoUrl?:      string | null;
    template:      TemplateConfig;
    siteSlug?:     string | null;
    catalogType?:  string;
}

/* ── Shared CTA buttons ─────────────────────────────────────────────────── */
function HeroCTAs({ whatsapp, phone, template, siteSlug, catalogType = "services" }: Pick<HeroProps, "whatsapp" | "phone" | "template" | "siteSlug" | "catalogType">) {
    const r = template.style.heroRadius;
    const grad = `linear-gradient(135deg, ${template.colors.primary}, ${template.colors.secondary})`;
    return (
        <div className="flex flex-wrap gap-3">
            {whatsapp && (
                <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello! I'd like to know more.")}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ background: grad }}
                    className={`flex items-center gap-2 px-6 py-3 ${r} text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg`}>
                    <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                </a>
            )}
            {phone && (
                <a href={`tel:${phone.replace(/\s/g, "")}`}
                    style={{ borderColor: template.colors.border, color: template.colors.textMuted, background: template.colors.surface }}
                    className={`flex items-center gap-2 px-6 py-3 ${r} border text-sm font-medium hover:opacity-80 transition-all`}>
                    <Phone className="w-4 h-4" /> Call Now
                </a>
            )}
            <Link href={siteSlug ? `/sites/${siteSlug}/${catalogType}` : `/${catalogType}`}
                style={{ color: template.colors.textMuted }}
                className="flex items-center gap-1.5 px-3 py-3 text-sm font-medium hover:opacity-80 transition-colors">
                View {catalogType.charAt(0).toUpperCase() + catalogType.slice(1)} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
        </div>
    );
}

/* ── Rating badge ───────────────────────────────────────────────────────── */
function RatingBadge({ count, template }: { count: number; template: TemplateConfig }) {
    if (count === 0) return null;
    return (
        <div style={{ borderColor: template.colors.primary + "30", color: template.colors.textMuted, borderRadius: template.style.heroRadius === 'rounded-none' ? '0' : '99px' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 border mb-6">
            <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} style={{ color: template.colors.primary }} className="w-2.5 h-2.5 fill-current" />
                ))}
            </div>
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-80">
                {count}+ Reviews
            </span>
        </div>
    );
}

/* ── Dot-grid canvas (dark-minimal) ─────────────────────────────────────── */
function DotGrid({ color }: { color: string }) {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = ref.current; if (!canvas) return;
        const ctx = canvas.getContext("2d"); if (!ctx) return;
        let frame: number, t = 0;
        const draw = () => {
            canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
            const sp = 32, cols = Math.ceil(canvas.width / sp) + 1, rows = Math.ceil(canvas.height / sp) + 1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
                const x = i * sp, y = j * sp;
                const d = Math.sqrt((x - canvas.width/2)**2 + (y - canvas.height/2)**2);
                const a = (Math.sin(d/60 - t) * 0.5 + 0.5) * 0.18;
                ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fillStyle = color + Math.round(a * 255).toString(16).padStart(2, "0");
                ctx.fill();
            }
            t += 0.015; frame = requestAnimationFrame(draw);
        };
        draw(); return () => cancelAnimationFrame(frame);
    }, [color]);
    return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

/* ════════════════════════════════════════════════════════════════════════════
   HERO LAYOUT VARIANTS
══════════════════════════════════════════════════════════════════════════════ */

/** centered — dark-minimal & warm-salon */
function HeroCentered({ businessName, tagline, whatsapp, phone, reviewCount = 0, template, siteSlug, catalogType }: HeroProps) {
    const isDark = template.key === "dark-minimal";
    return (
        <section style={{ background: template.colors.bg }} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {isDark && <DotGrid color={template.colors.primary} />}
            {/* Gradient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div style={{ background: template.colors.primary + "18" }}
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[120px]" />
            </div>
            <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
                <RatingBadge count={reviewCount} template={template} />
                <h1 style={{ color: template.colors.text, fontFamily: template.fonts.heading + ", sans-serif" }}
                    className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-5 leading-[1.05]">
                    {businessName}
                </h1>
                <p style={{ color: template.colors.textMuted }}
                    className="text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
                    {tagline ?? "Quality services tailored for your needs."}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <HeroCTAs whatsapp={whatsapp} phone={phone} template={template} siteSlug={siteSlug} catalogType={catalogType} />
                </div>
                {/* Scroll hint */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                    <div style={{ borderColor: template.colors.border }}
                        className="w-5 h-8 border rounded-full flex justify-center pt-1.5">
                        <div style={{ background: template.colors.border }} className="w-0.5 h-2 rounded-full animate-bounce" />
                    </div>
                </div>
            </div>
        </section>
    );
}

/** split-right — luxury-fashion: text left, decorative right */
function HeroSplitRight({ businessName, tagline, whatsapp, phone, reviewCount = 0, template, coverImageUrl, siteSlug, catalogType, logoUrl }: HeroProps) {
    const { colors } = template;
    return (
        <section style={{ background: colors.bg }} className="relative min-h-screen flex items-center overflow-hidden pt-20">
            {/* Silk Texture / Ambient Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/silk.png")` }} />
            <div 
                style={{ background: `radial-gradient(circle at 70% 50%, ${colors.primary}18, transparent 60%)` }}
                className="absolute inset-0 pointer-events-none" 
            />
            
            <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center min-h-[85vh] relative z-10">
                {/* Left — Elegant Typography */}
                <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="space-y-6">
                        {logoUrl && (
                            <div className="mb-4">
                                <Image src={logoUrl} alt={businessName} width={120} height={120} className="object-contain" />
                            </div>
                        )}
                        <div style={{ color: colors.primary }}
                            className="inline-flex items-center gap-4 text-[10px] font-bold tracking-[0.5em] uppercase">
                            <span style={{ background: colors.primary }} className="w-16 h-[2px]" />
                            The 2024 Signature Series
                        </div>
                        
                        <h1 style={{ color: colors.text, fontFamily: `'${template.fonts.heading}', serif`, letterSpacing: "-0.03em" }}
                            className="text-4xl md:text-5xl lg:text-7xl font-medium leading-[0.95]">
                            {businessName.split(' ').map((word, i) => (
                                <span key={i} className="block first:ml-0 last:ml-12 last:italic last:font-light last:opacity-80">
                                    {word}
                                    {i === 0 && <span style={{ background: colors.primary }} className="inline-block w-3 h-3 rounded-full ml-4 opacity-40 animate-pulse" />}
                                </span>
                            ))}
                        </h1>
                    </div>

                    <p style={{ color: colors.textMuted, fontFamily: `'${template.fonts.body}', sans-serif`, borderLeftColor: colors.primary + "30" }} 
                        className="text-lg md:text-xl leading-relaxed max-w-sm italic font-light border-l-2 pl-6">
                        {tagline ?? "Experience the intersection of heritage craftsmanship and contemporary luxury."}
                    </p>

                    <div className="pt-4 flex flex-col sm:flex-row items-center gap-8">
                        <HeroCTAs whatsapp={whatsapp} phone={phone} template={template} siteSlug={siteSlug} catalogType={catalogType} />
                        {reviewCount > 0 && (
                            <div className="hidden sm:block">
                                <RatingBadge count={reviewCount} template={template} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right — Layered Boutique Collage */}
                <div className="relative h-[500px] lg:h-[700px] w-full flex items-center justify-center">
                    {/* Decorative Background Rings */}
                    <div style={{ borderColor: colors.primary + "15" }} className="absolute w-[130%] h-[130%] rounded-full border border-dashed animate-[spin_120s_linear_infinite]" />
                    <div style={{ borderColor: colors.primary + "10" }} className="absolute w-[150%] h-[150%] rounded-full border" />
                                        {/* Floating Testimonial (Top Right) */}
                    <div 
                        style={{ 
                            background: colors.surface, 
                            borderColor: colors.border,
                            borderRadius: template.style.cardRadius
                        }}
                        className="absolute -top-10 -right-10 p-6 border shadow-2xl z-20 hidden xl:flex flex-col gap-3 max-w-[220px] animate-bounce-slow"
                    >
                        <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => (
                                <Star key={i} style={{ color: colors.primary }} className="w-2.5 h-2.5 fill-current" />
                            ))}
                        </div>
                        <p style={{ color: colors.text }} className="text-[10px] leading-relaxed italic opacity-80">
                            "The craftsmanship is truly timeless. A masterpiece in every detail."
                        </p>
                        <p style={{ color: colors.textMuted }} className="text-[8px] font-bold uppercase tracking-widest">— Sophia R.</p>
                    </div>                    {/* Main Showcase Image */}
                    <div 
                        style={{ 
                            borderColor: colors.border, 
                            background: colors.surface, 
                            borderRadius: template.style.heroRadius 
                        }} 
                        className="relative w-full h-full overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border-8 z-10 group"
                    >
                        {coverImageUrl ? (
                            <Image 
                                src={coverImageUrl} 
                                alt={businessName} 
                                fill 
                                className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                                priority 
                                unoptimized 
                            />
                        ) : (
                            <div style={{ background: `linear-gradient(135deg, ${colors.surface}, ${colors.bg})` }} 
                                className="w-full h-full flex items-center justify-center p-20">
                                <div style={{ borderColor: colors.primary + "40" }} className="w-full h-full border-2 border-dashed flex items-center justify-center">
                                    <p className="text-[10px] uppercase tracking-[0.8em] font-bold opacity-30">The Showcase</p>
                                </div>
                            </div>
                        )}
                        <div style={{ background: colors.primary }} className="absolute bottom-0 left-0 w-[1px] h-24" />
                    </div>
                </div>
            </div>
        </section>
    );
}

/** split-left — corporate-pro: big stat/badge left, text right */
function HeroSplitLeft({ businessName, tagline, whatsapp, phone, reviewCount = 0, template, siteSlug, catalogType }: HeroProps) {
    return (
        <section style={{ background: template.colors.bg }} className="relative min-h-screen flex items-center overflow-hidden pt-20">
            {/* Background lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ backgroundImage: `linear-gradient(${template.colors.primary} 1px, transparent 1px), linear-gradient(90deg, ${template.colors.primary} 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
            <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none"
                style={{ background: `radial-gradient(ellipse at right, ${template.colors.primary}12, transparent 60%)` }} />

            <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
                {/* Left — big decorative element */}
                <div className="hidden lg:flex flex-col items-start gap-6">
                    <div style={{ color: template.colors.primary + "15", fontFamily: "Inter, sans-serif" }}
                        className="text-[200px] font-black leading-none select-none tracking-tight">
                        {businessName.charAt(0)}
                    </div>
                    <div style={{ borderColor: template.colors.border }} className="border-t w-full pt-5 flex items-center gap-8">
                        {[["10+", "Years Experience"], ["500+", "Happy Clients"], ["99%", "Satisfaction"]].map(([num, label]) => (
                            <div key={label}>
                                <p style={{ color: template.colors.primary }} className="text-2xl font-bold">{num}</p>
                                <p style={{ color: template.colors.textMuted }} className="text-xs">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — text */}
                <div className="space-y-7">
                    <div style={{ color: template.colors.primary }} className="text-xs font-semibold tracking-widest uppercase flex items-center gap-2">
                        <div style={{ background: template.colors.primary }} className="w-8 h-px" /> Professional Services
                    </div>
                    <h1 style={{ color: template.colors.text, fontFamily: `'${template.fonts.heading}', sans-serif` }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                        {businessName}
                    </h1>
                    <p style={{ color: template.colors.textMuted }} className="text-base leading-relaxed">
                        {tagline ?? "Trusted expertise delivering measurable results for your business."}
                    </p>
                    <HeroCTAs whatsapp={whatsapp} phone={phone} template={template} siteSlug={siteSlug} catalogType={catalogType} />
                </div>
            </div>
        </section>
    );
}

/* ── Main export — picks the right variant ──────────────────────────────── */
export function ThemedHero(props: HeroProps) {
    const layout = props.template.style.heroLayout;
    if (layout === "split-right")  return <HeroSplitRight {...props} />;
    if (layout === "split-left")   return <HeroSplitLeft  {...props} />;
    return                                <HeroCentered   {...props} />;
}
