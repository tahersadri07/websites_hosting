"use client";

import { useEffect, useRef } from "react";
import { MessageCircle, Phone, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import type { TemplateConfig } from "@/lib/templates";

interface HeroProps {
    businessName:  string;
    tagline?:      string | null;
    phone?:        string | null;
    whatsapp?:     string | null;
    reviewCount?:  number;
    coverImageUrl?: string | null;
    template:      TemplateConfig;
    siteSlug?:     string | null;
}

/* ── Shared CTA buttons ─────────────────────────────────────────────────── */
function HeroCTAs({ whatsapp, phone, template, siteSlug }: Pick<HeroProps, "whatsapp" | "phone" | "template" | "siteSlug">) {
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
            <Link href={siteSlug ? `/sites/${siteSlug}/services` : "/services"}
                style={{ color: template.colors.textMuted }}
                className="flex items-center gap-1.5 px-3 py-3 text-sm font-medium hover:opacity-80 transition-colors">
                View Services <ArrowRight className="w-3.5 h-3.5" />
            </Link>
        </div>
    );
}

/* ── Rating badge ───────────────────────────────────────────────────────── */
function RatingBadge({ count, template }: { count: number; template: TemplateConfig }) {
    if (count === 0) return null;
    return (
        <div style={{ borderColor: template.colors.border, background: template.colors.surface + "CC", color: template.colors.textMuted }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-sm mb-6">
            <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
            </div>
            <span className="text-xs">
                <span style={{ color: template.colors.text }} className="font-semibold">5.0</span> · {count}+ happy customers
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
function HeroCentered({ businessName, tagline, whatsapp, phone, reviewCount = 0, template, siteSlug }: HeroProps) {
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
                    <HeroCTAs whatsapp={whatsapp} phone={phone} template={template} siteSlug={siteSlug} />
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
function HeroSplitRight({ businessName, tagline, whatsapp, phone, reviewCount = 0, template, coverImageUrl, siteSlug }: HeroProps) {
    return (
        <section style={{ background: template.colors.bg }} className="relative min-h-screen flex items-center overflow-hidden pt-20">
            <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
                {/* Left — text */}
                <div className="relative z-10 space-y-8">
                    <div style={{ borderColor: template.colors.primary + "40", color: template.colors.primary, background: template.colors.primary + "15" }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm border text-xs font-semibold tracking-widest uppercase">
                        ✦ Premium Collection
                    </div>
                    <h1 style={{ color: template.colors.text, fontFamily: `'${template.fonts.heading}', Georgia, serif`, letterSpacing: "-0.03em" }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
                        {businessName}
                    </h1>
                    <p style={{ color: template.colors.textMuted }} className="text-base leading-relaxed max-w-md">
                        {tagline ?? "Timeless elegance crafted for the discerning taste."}
                    </p>
                    <HeroCTAs whatsapp={whatsapp} phone={phone} template={template} siteSlug={siteSlug} />
                    {reviewCount > 0 && <RatingBadge count={reviewCount} template={template} />}
                </div>

                {/* Right — image/decoration */}
                <div className="relative hidden lg:flex items-center justify-center">
                    <div style={{ borderColor: template.colors.primary + "30", background: template.colors.surface }}
                        className="relative w-[420px] h-[520px] rounded-lg border overflow-hidden">
                        {coverImageUrl ? (
                            <img src={coverImageUrl} alt={businessName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                                <div style={{ color: template.colors.primary + "30" }}
                                    className="text-9xl font-bold select-none" aria-hidden>
                                    {businessName.charAt(0)}
                                </div>
                                <div style={{ color: template.colors.primary, borderColor: template.colors.primary + "30" }}
                                    className="px-5 py-2 border text-xs tracking-widest uppercase font-medium">
                                    {template.name}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Gold corner accents */}
                    {["-top-2 -right-2", "-bottom-2 -left-2"].map((pos) => (
                        <div key={pos} style={{ background: template.colors.primary }}
                            className={`absolute ${pos} w-8 h-8 opacity-60`} />
                    ))}
                    {/* Ambient glow */}
                    <div style={{ background: template.colors.primary + "20" }}
                        className="absolute inset-0 rounded-full blur-[80px] scale-50" />
                </div>
            </div>
        </section>
    );
}

/** split-left — corporate-pro: big stat/badge left, text right */
function HeroSplitLeft({ businessName, tagline, whatsapp, phone, reviewCount = 0, template, siteSlug }: HeroProps) {
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
                    <HeroCTAs whatsapp={whatsapp} phone={phone} template={template} siteSlug={siteSlug} />
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
