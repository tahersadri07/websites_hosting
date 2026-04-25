"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface Props {
    template?: any;
}

export function NewsletterSection({ template }: Props) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const colors = template?.colors || { bg: "#FFFFFF", text: "#000000", primary: "#6366F1", border: "#E5E7EB", surface: "#F9FAFB" };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        setTimeout(() => setStatus('success'), 1500);
    };

    return (
        <section style={{ backgroundColor: colors.bg }} className="py-24 relative overflow-hidden">
            {/* Soft decorative blur */}
            <div 
                style={{ background: colors.secondary + "20" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none" 
            />

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <div 
                    style={{ 
                        backgroundColor: colors.surface, 
                        borderColor: colors.border,
                        borderRadius: template?.style.cardRadius === 'rounded-none' ? '0' : '40px',
                        boxShadow: template?.style.cardShadow
                    }}
                    className="p-12 md:p-20 text-center border relative overflow-hidden"
                >
                    <div className="max-w-xl mx-auto space-y-8">
                        <div className="space-y-4">
                            <h2 
                                style={{ color: colors.text, fontFamily: `'${template?.fonts.heading}', serif` }}
                                className="text-3xl md:text-5xl font-bold tracking-tight"
                            >
                                Join the Inner Circle
                            </h2>
                            <p style={{ color: colors.textMuted }} className="text-sm md:text-base leading-relaxed italic opacity-80">
                                Be the first to receive exclusive previews of our new collections, private event invitations, and timeless style inspiration.
                            </p>
                        </div>

                        {status === 'success' ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <p style={{ color: colors.primary }} className="text-lg font-serif italic">Thank you for joining our journey.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="relative max-w-md mx-auto group">
                                <input 
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ 
                                        backgroundColor: colors.bg, 
                                        borderColor: colors.border,
                                        color: colors.text,
                                        borderRadius: template?.style.heroRadius === 'rounded-none' ? '0' : '99px'
                                    }}
                                    className="w-full pl-8 pr-16 py-5 border-2 outline-none focus:opacity-90 transition-all text-sm font-medium"
                                />
                                <button 
                                    type="submit"
                                    disabled={status === 'loading'}
                                    style={{ 
                                        backgroundColor: colors.primary,
                                        color: '#FFFFFF'
                                    }}
                                    className="absolute right-2 top-2 bottom-2 aspect-square rounded-full flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        )}

                        <div className="pt-4 flex items-center justify-center gap-6 opacity-30">
                            <span style={{ backgroundColor: colors.border }} className="h-px w-12" />
                            <span style={{ color: colors.text }} className="text-[10px] font-bold uppercase tracking-[0.3em]">Boutique Experience</span>
                            <span style={{ backgroundColor: colors.border }} className="h-px w-12" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
