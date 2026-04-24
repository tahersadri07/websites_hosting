"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Phone, Mail, MapPin, MessageCircle, ExternalLink } from "lucide-react";
import type { TemplateConfig } from "@/lib/templates";

interface FooterProps {
    businessName: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    whatsapp?: string | null;
    socials?: { facebook?: string | null; instagram?: string | null; youtube?: string | null; };
    template?: TemplateConfig | null;
    siteSlug?: string | null;
}

const navLinks = [
    { href: "/",         label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/gallery",  label: "Gallery" },
    { href: "/about",    label: "About" },
    { href: "/contact",  label: "Contact" },
];

export function Footer({ businessName, phone, email, address, whatsapp, socials, template, siteSlug }: FooterProps) {
    const year = new Date().getFullYear();
    const bg      = template?.colors.bg      ?? "#0A0A0F";
    const surface  = template?.colors.surface  ?? "#13131A";
    const border   = template?.colors.border   ?? "#27272A";
    const primary  = template?.colors.primary  ?? "#6366F1";
    const text     = template?.colors.text     ?? "#FAFAFA";
    const textMuted = template?.colors.textMuted ?? "#A1A1AA";
    const base = siteSlug ? `/sites/${siteSlug}` : "";

    return (
        <footer style={{ background: bg, borderColor: border }} className="border-t">
            <div className="container mx-auto px-6 max-w-7xl py-14">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 style={{ color: text }} className="text-base font-bold">{businessName}</h3>
                        <p style={{ color: textMuted }} className="text-sm leading-relaxed max-w-xs">
                            Providing quality services to our valued customers.
                        </p>
                        {/* Social links */}
                        {(socials?.instagram || socials?.facebook || socials?.youtube) && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {socials?.instagram && (
                                    <a href={socials.instagram} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#27272A] text-zinc-600 hover:text-white hover:border-zinc-600 text-xs transition-all">
                                        <ExternalLink className="w-3 h-3" /> Instagram
                                    </a>
                                )}
                                {socials?.facebook && (
                                    <a href={socials.facebook} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#27272A] text-zinc-600 hover:text-white hover:border-zinc-600 text-xs transition-all">
                                        <ExternalLink className="w-3 h-3" /> Facebook
                                    </a>
                                )}
                                {socials?.youtube && (
                                    <a href={socials.youtube} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#27272A] text-zinc-600 hover:text-white hover:border-zinc-600 text-xs transition-all">
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
                            {[[`${base}/`, "Home"], [`${base}/services`, "Services"], [`${base}/gallery`, "Gallery"], [`${base}/about`, "About"], [`${base}/contact`, "Contact"]].map(([href, label]) => (
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
                        <Link href="/privacy" style={{ color: textMuted }} className="text-xs hover:opacity-80 transition-opacity">Privacy</Link>
                        <Link href="/terms"   style={{ color: textMuted }} className="text-xs hover:opacity-80 transition-opacity">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
