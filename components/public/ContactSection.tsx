"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageCircle, Loader2 } from "lucide-react";

interface ContactSectionProps {
    business: {
        id?: string;
        slug?: string;
        phone?: string | null;
        email?: string | null;
        address?: string | null;
        whatsapp?: string | null;
        hours?: any | null;
    };
    template?: any;
}

const contactItems = [
    { key: "phone",    icon: Phone,   label: "Phone",    href: (v: string) => `tel:${v}` },
    { key: "email",    icon: Mail,    label: "Email",    href: (v: string) => `mailto:${v}` },
    { key: "whatsapp", icon: MessageCircle, label: "WhatsApp", href: (v: string) => `https://wa.me/${v.replace(/\D/g,"")}` },
    { key: "address",  icon: MapPin,  label: "Address",  href: null },
];

export function ContactSection({ business, template }: ContactSectionProps) {
    const colors = template?.colors || { bg: "#0A0A0F", border: "#27272A", text: "#FFFFFF", textMuted: "#A1A1AA", primary: "#6366F1", surface: "#13131A" };

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            const res = await fetch("/api/inquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, message, business_id: business.id }),
            });
            if (!res.ok) throw new Error("Failed");
            setSuccess(true);
            setName(""); setEmail(""); setPhone(""); setMessage("");
        } catch {
            setError("Something went wrong. Please try again or contact us directly.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section id="contact" style={{ background: colors.bg }} className="py-24 relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20"
                style={{ background: colors.primary }} />

            <div className="container mx-auto px-6 max-w-7xl relative">
                {/* Header */}
                <div className="mb-14">
                    <div style={{ color: colors.primary }} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3">
                        <span style={{ background: colors.primary }} className="w-4 h-px" />
                        Get in Touch
                    </div>
                    <h2 style={{ color: colors.text }} className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Contact Us</h2>
                    <p style={{ color: colors.textMuted }} className="text-sm max-w-md">We'd love to hear from you. Fill out the form or reach us directly.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* Info panel */}
                    <div className="lg:col-span-2 space-y-3">
                        {contactItems.map(({ key, icon: Icon, label, href }) => {
                            const value = (business as any)[key] as string | null | undefined;
                            if (!value) return null;
                            const content = (
                                <div style={{ borderColor: colors.border, background: colors.surface, borderRadius: template?.style.heroRadius === 'rounded-none' ? '0' : '12px' }} 
                                    className="flex items-center gap-3.5 px-5 py-4 border hover:opacity-80 transition-all group">
                                    <div style={{ background: colors.bg, borderColor: colors.border }} 
                                        className="w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors">
                                        <Icon style={{ color: colors.textMuted }} className="w-4 h-4 transition-colors" />
                                    </div>
                                    <div className="min-w-0">
                                        <p style={{ color: colors.textMuted }} className="text-[10px] font-medium uppercase tracking-wider">{label}</p>
                                        <p style={{ color: colors.text }} className="text-sm truncate">{value}</p>
                                    </div>
                                </div>
                            );
                            return href ? (
                                <a key={key} href={href(value)} target={key === "whatsapp" ? "_blank" : undefined} rel="noopener noreferrer">
                                    {content}
                                </a>
                            ) : (
                                <div key={key}>{content}</div>
                            );
                        })}

                        {/* Hours */}
                        {business.hours && typeof business.hours === "object" && (
                            <div style={{ borderColor: colors.border, background: colors.surface, borderRadius: template?.style.heroRadius === 'rounded-none' ? '0' : '12px' }} className="px-5 py-4 border">
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock style={{ color: colors.textMuted }} className="w-3.5 h-3.5" />
                                    <p style={{ color: colors.textMuted }} className="text-[10px] font-medium uppercase tracking-wider">Business Hours</p>
                                </div>
                                <div className="space-y-1.5">
                                    {Object.entries(business.hours).map(([day, time]: [string, any]) => (
                                        <div key={day} className="flex justify-between text-xs">
                                            <span style={{ color: colors.textMuted }} className="capitalize">{day}</span>
                                            <span style={{ color: colors.text }} className="font-medium">
                                                {time.closed ? "Closed" : `${time.open} – ${time.close}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form */}
                    <div style={{ borderColor: colors.border, background: colors.surface, borderRadius: template?.style.heroRadius === 'rounded-none' ? '0' : '16px' }} className="lg:col-span-3 border p-8">
                        {success ? (
                            <div className="py-12 text-center space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 style={{ color: colors.text }} className="text-lg font-bold">Message sent!</h3>
                                    <p style={{ color: colors.textMuted }} className="text-sm mt-1">We'll get back to you within 24 hours.</p>
                                </div>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { id: "name",  label: "Full Name",    type: "text",  placeholder: "Your name",     value: name,  set: setName },
                                        { id: "email", label: "Email",        type: "email", placeholder: "your@email.com", value: email, set: setEmail },
                                    ].map(f => (
                                        <div key={f.id} className="space-y-1.5">
                                            <label htmlFor={f.id} style={{ color: colors.textMuted }} className="text-xs font-medium uppercase tracking-wider">{f.label}</label>
                                            <input
                                                id={f.id} type={f.type} required
                                                value={f.value} onChange={e => f.set(e.target.value)}
                                                placeholder={f.placeholder}
                                                style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text, borderRadius: template?.style.heroRadius === 'rounded-none' ? '0' : '12px' }}
                                                className="w-full h-11 px-4 border text-sm focus:outline-none transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="phone" style={{ color: colors.textMuted }} className="text-xs font-medium uppercase tracking-wider">Phone</label>
                                    <input
                                        id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                                        placeholder="+91 98765 43210"
                                        style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text, borderRadius: template?.style.heroRadius === 'rounded-none' ? '0' : '12px' }}
                                        className="w-full h-11 px-4 border text-sm focus:outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="message" style={{ color: colors.textMuted }} className="text-xs font-medium uppercase tracking-wider">Message *</label>
                                    <textarea
                                        id="message" required value={message} onChange={e => setMessage(e.target.value)}
                                        placeholder="How can we help you?"
                                        rows={4}
                                        style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text, borderRadius: template?.style.heroRadius === 'rounded-none' ? '0' : '12px' }}
                                        className="w-full px-4 py-3 border text-sm focus:outline-none transition-all resize-none"
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/25 px-4 py-3 rounded-xl">{error}</p>
                                )}

                                <button
                                    type="submit" disabled={submitting}
                                    style={{ 
                                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                                        borderRadius: template?.style.heroRadius === 'rounded-none' ? '0' : '12px'
                                    }}
                                    className="w-full h-11 flex items-center justify-center gap-2 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    {submitting ? "Sending…" : "Send Message"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
