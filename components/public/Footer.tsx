"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Phone, Mail, MapPin, MessageCircle, ExternalLink } from "lucide-react";
import type { TemplateConfig } from "@/lib/templates";
import type { BusinessConfig } from "@/lib/business-config";

interface FooterProps {
    businessName: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    whatsapp?: string | null;
    socials?: { facebook?: string | null; instagram?: string | null; youtube?: string | null; };
    template?: TemplateConfig | null;
    siteSlug?: string | null;
    businessConfig?: BusinessConfig;
    servicesLabel?: string | null;
}



export function Footer({ businessName, phone, email, address, whatsapp, socials, template, siteSlug, businessConfig, servicesLabel }: FooterProps) {
    const year = new Date().getFullYear();
    const bg      = template?.colors.bg      ?? "#0A0A0F";
    const surface  = template?.colors.surface  ?? "#13131A";
    const border   = template?.colors.border   ?? "#27272A";
    const primary  = template?.colors.primary  ?? "#6366F1";
    const text     = template?.colors.text     ?? "#FAFAFA";
    const textMuted = template?.colors.textMuted ?? "#A1A1AA";
    const base = siteSlug ? `/sites/${siteSlug}` : "";

    return (
        <footer style={{ background: template?.colors.surface, borderColor: template?.colors.border }} className="border-t">
            <div className="container mx-auto px-6 max-w-7xl py-14">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href={base || "/"}>
                            <h3 style={{ color: text, fontFamily: `'${template?.fonts.heading}', serif` }} className="text-xl font-bold hover:opacity-80 transition-opacity">{businessName}</h3>
                        </Link>
                        <p style={{ color: textMuted }} className="text-sm leading-relaxed max-w-xs italic opacity-80">
                            Crafting timeless elegance and boutique luxury for our valued clientele.
                        </p>
                        {/* Social links */}
                        {(socials?.instagram || socials?.facebook || socials?.youtube) && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {socials?.instagram && (
                                    <a href={socials.instagram} target="_blank" rel="noopener noreferrer"
                                        style={{ borderColor: border, color: textMuted }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80">
                                        <ExternalLink className="w-3 h-3" /> Instagram
                                    </a>
                                )}
                                {socials?.facebook && (
                                    <a href={socials.facebook} target="_blank" rel="noopener noreferrer"
                                        style={{ borderColor: border, color: textMuted }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80">
                                        <ExternalLink className="w-3 h-3" /> Facebook
                                    </a>
                                )}
                                {socials?.youtube && (
                                    <a href={socials.youtube} target="_blank" rel="noopener noreferrer"
                                        style={{ borderColor: border, color: textMuted }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80">
                                        <ExternalLink className="w-3 h-3" /> YouTube
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Nav */}
                    <div className="space-y-3">
                        <h4 style={{ color: textMuted }} className="text-xs font-semibold uppercase tracking-widest">Navigation</h4>
                        <div className="grid grid-cols-2 gap-1">
                            {[
                                [`${base}/`, "Home"], 
                                [`${base}/${businessConfig?.urlPath ?? 'services'}`, servicesLabel || businessConfig?.plural || "Services"], 
                                [`${base}/gallery`, "Gallery"], 
                                [`${base}/about`, "About"], 
                                [`${base}/contact`, "Contact"]
                            ].map(([href, label]) => (
                                <Link key={href} href={href}
                                    style={{ color: textMuted }}
                                    className="text-sm hover:opacity-80 transition-opacity py-1">
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-3">
                        <h4 style={{ color: textMuted }} className="text-xs font-semibold uppercase tracking-widest">Contact</h4>
                        <div className="space-y-2.5">
                            {phone && (
                                <a href={`tel:${phone}`} style={{ color: textMuted }} className="flex items-center gap-2.5 text-sm hover:opacity-80 transition-opacity">
                                    <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: primary }} /> {phone}
                                </a>
                            )}
                            {whatsapp && (
                                <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                                    style={{ color: textMuted }} className="flex items-center gap-2.5 text-sm hover:opacity-80 transition-opacity">
                                    <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: primary }} /> WhatsApp
                                </a>
                            )}
                            {email && (
                                <a href={`mailto:${email}`} style={{ color: textMuted }} className="flex items-center gap-2.5 text-sm hover:opacity-80 transition-opacity">
                                    <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: primary }} /> {email}
                                </a>
                            )}
                            {address && (
                                <p style={{ color: textMuted }} className="flex items-start gap-2.5 text-sm">
                                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: primary }} /> {address}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{ borderColor: border }} className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p style={{ color: textMuted }} className="text-xs">© {year} {businessName}. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href={`${base}/privacy`} style={{ color: textMuted }} className="text-xs hover:opacity-80 transition-opacity">Privacy</Link>
                        <Link href={`${base}/terms`}   style={{ color: textMuted }} className="text-xs hover:opacity-80 transition-opacity">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
