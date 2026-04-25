"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { TemplateConfig } from "@/lib/templates";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

interface LoginFormProps {
    business: any;
    template: TemplateConfig;
    slug: string;
    nextUrl: string;
}

export function LoginForm({ business, template, slug, nextUrl }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const colors = template.colors;

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        if (authData.user) {
            try {
                const { data: existingCustomer, error: checkError } = await supabase
                    .from('customers')
                    .select('id')
                    .eq('business_id', business.id)
                    .eq('auth_user_id', authData.user.id)
                    .maybeSingle();

                if (checkError) throw checkError;

                if (!existingCustomer) {
                    const { error: insertError } = await supabase.from('customers').insert({
                        business_id: business.id,
                        auth_user_id: authData.user.id,
                        name: authData.user.user_metadata?.full_name || authData.user.user_metadata?.name || email.split('@')[0],
                        email: email,
                    });
                    if (insertError) throw insertError;
                }
            } catch (err: any) {
                console.error("Failed to sync customer profile:", err);
                // We don't block login if profile sync fails, but we should log it
            }
        }

        // Successfully logged in
        window.location.href = nextUrl;
    };

    const handleGoogleLogin = async () => {
        setError(null);
        const { error: authError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/sites/${slug}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
            }
        });

        if (authError) {
            setError(authError.message);
        }
    };

    return (
        <div 
            style={{ 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: template.style.cardRadius
            }} 
            className="w-full max-w-md p-8 border shadow-xl relative overflow-hidden"
        >
            <div className="mb-8 text-center">
                <h1 style={{ color: colors.text, fontFamily: template.fonts.heading }} className="text-3xl font-bold mb-2">
                    Welcome Back
                </h1>
                <p style={{ color: colors.textMuted }} className="text-sm">
                    Sign in to your {business.name} account
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-1.5">
                    <label style={{ color: colors.text }} className="text-xs font-semibold uppercase tracking-wider ml-1">Email</label>
                    <div className="relative">
                        <Mail style={{ color: colors.textMuted }} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                        <input 
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ 
                                backgroundColor: colors.bg, 
                                borderColor: colors.border, 
                                color: colors.text,
                                borderRadius: template.style.heroRadius === 'rounded-none' ? '0' : '8px'
                            }}
                            className="w-full pl-10 pr-4 py-2.5 border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-sm"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between ml-1">
                        <label style={{ color: colors.text }} className="text-xs font-semibold uppercase tracking-wider">Password</label>
                        <Link href={`/sites/${slug}/forgot-password${nextUrl.includes('checkout') ? '?checkout=true' : ''}`} style={{ color: colors.primary }} className="text-[10px] hover:underline">Forgot?</Link>
                    </div>
                    <div className="relative">
                        <Lock style={{ color: colors.textMuted }} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                        <input 
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ 
                                backgroundColor: colors.bg, 
                                borderColor: colors.border, 
                                color: colors.text,
                                borderRadius: template.style.heroRadius === 'rounded-none' ? '0' : '8px'
                            }}
                            className="w-full pl-10 pr-4 py-2.5 border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-sm"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    style={{ 
                        backgroundColor: colors.primary, 
                        borderRadius: template.style.heroRadius === 'rounded-none' ? '0' : '8px'
                    }}
                    className="w-full py-3 flex items-center justify-center gap-2 text-white font-semibold mt-6 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        <>Sign In <ArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </form>

            <div className="my-6 flex items-center gap-4">
                <div style={{ backgroundColor: colors.border }} className="h-px flex-1"></div>
                <span style={{ color: colors.textMuted }} className="text-xs uppercase tracking-wider font-semibold">Or</span>
                <div style={{ backgroundColor: colors.border }} className="h-px flex-1"></div>
            </div>

            <button 
                onClick={handleGoogleLogin}
                type="button"
                style={{ 
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    color: colors.text,
                    borderRadius: template.style.heroRadius === 'rounded-none' ? '0' : '8px'
                }}
                className="w-full py-2.5 flex items-center justify-center gap-3 border hover:opacity-80 transition-all text-sm font-medium"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
            </button>

            <p style={{ color: colors.textMuted }} className="text-center text-xs mt-8">
                Don't have an account?{' '}
                <Link href={`/sites/${slug}/signup${nextUrl.includes('checkout') ? '?checkout=true' : ''}`} style={{ color: colors.primary }} className="font-semibold hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    );
}
