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
        google_maps_url?: string | null;
    };
}

const contactItems = [
    { key: "phone",    icon: Phone,   label: "Phone",    href: (v: string) => `tel:${v}` },
    { key: "email",    icon: Mail,    label: "Email",    href: (v: string) => `mailto:${v}` },
    { key: "whatsapp", icon: MessageCircle, label: "WhatsApp", href: (v: string) => `https://wa.me/${v.replace(/\D/g,"")}` },
    { key: "address",  icon: MapPin,  label: "Address",  href: null },
];

export function ContactSection({ business }: ContactSectionProps) {
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
        <section id="contact" className="py-24 bg-[#0A0A0F] relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative">
                {/* Header */}
                <div className="mb-14">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">
                        <span className="w-4 h-px bg-emerald-400" />
                        Get in Touch
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Contact Us</h2>
                    <p className="text-zinc-500 text-sm max-w-md">We'd love to hear from you. Fill out the form or reach us directly.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* Info panel */}
                    <div className="lg:col-span-2 space-y-3">
                        {contactItems.map(({ key, icon: Icon, label, href }) => {
                            const value = (business as any)[key] as string | null | undefined;
                            if (!value) return null;
                            const content = (
                                <div className="flex items-center gap-3.5 px-5 py-4 rounded-xl border border-[#27272A] bg-[#13131A] hover:border-zinc-600 transition-colors group">
                                    <div className="w-9 h-9 rounded-lg bg-[#0A0A0F] border border-[#27272A] flex items-center justify-center flex-shrink-0 group-hover:border-indigo-500/30 transition-colors">
                                        <Icon className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">{label}</p>
                                        <p className="text-sm text-zinc-300 truncate">{value}</p>
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
                            <div className="px-5 py-4 rounded-xl border border-[#27272A] bg-[#13131A]">
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock className="w-3.5 h-3.5 text-zinc-600" />
                                    <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">Business Hours</p>
                                </div>
                                <div className="space-y-1.5">
                                    {Object.entries(business.hours).map(([day, time]: [string, any]) => (
                                        <div key={day} className="flex justify-between text-xs">
                                            <span className="text-zinc-500 capitalize">{day}</span>
                                            <span className="text-zinc-400 font-medium">
                                                {time.closed ? "Closed" : `${time.open} – ${time.close}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-3 rounded-2xl border border-[#27272A] bg-[#13131A] p-8">
                        {success ? (
                            <div className="py-12 text-center space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Message sent!</h3>
                                    <p className="text-zinc-500 text-sm mt-1">We'll get back to you within 24 hours.</p>
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
                                            <label htmlFor={f.id} className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{f.label}</label>
                                            <input
                                                id={f.id} type={f.type} required
                                                value={f.value} onChange={e => f.set(e.target.value)}
                                                placeholder={f.placeholder}
                                                className="w-full h-11 px-4 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="phone" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Phone</label>
                                    <input
                                        id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                                        placeholder="+91 98765 43210"
                                        className="w-full h-11 px-4 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="message" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Message *</label>
                                    <textarea
                                        id="message" required value={message} onChange={e => setMessage(e.target.value)}
                                        placeholder="How can we help you?"
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/25 px-4 py-3 rounded-xl">{error}</p>
                                )}

                                <button
                                    type="submit" disabled={submitting}
                                    className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20 disabled:opacity-50"
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
