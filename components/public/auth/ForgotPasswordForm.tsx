"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { TemplateConfig } from "@/lib/templates";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

interface ForgotPasswordFormProps {
    business: any;
    template: TemplateConfig;
    slug: string;
    nextUrl: string;
}

export function ForgotPasswordForm({ business, template, slug, nextUrl }: ForgotPasswordFormProps) {
    const [step, setStep] = useState<"email" | "otp" | "password">("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();
    const supabase = createClient();
    const colors = template.colors;

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);

        if (resetError) {
            setError(resetError.message);
            setLoading(false);
            return;
        }

        setStep("otp");
        setError("We've sent a recovery code to your email. Please enter it below.");
        setLoading(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: verifyError } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'recovery'
        });

        if (verifyError) {
            setError(verifyError.message);
            setLoading(false);
            return;
        }

        setStep("password");
        setError(null);
        setLoading(false);
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data: authData, error: updateError } = await supabase.auth.updateUser({
            password: password
        });

        if (updateError) {
            setError(updateError.message);
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
                        name: authData.user.user_metadata?.full_name || authData.user.user_metadata?.name || authData.user.email?.split('@')[0],
                        email: authData.user.email,
                    });
                    if (insertError) throw insertError;
                }
            } catch (err: any) {
                console.error("Failed to sync customer profile:", err);
            }
        }

        // Successfully updated password and logged in
        window.location.href = nextUrl;
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
                    {step === "email" ? "Reset Password" : step === "otp" ? "Verify Email" : "New Password"}
                </h1>
                <p style={{ color: colors.textMuted }} className="text-sm">
                    {step === "email" ? `Enter your email to receive a recovery code` : step === "otp" ? `Enter the code sent to ${email}` : `Create a new password for your account`}
                </p>
            </div>

            {error && (
                <div className={error.includes("sent a recovery code") ? "mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm" : "mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm"}>
                    {error}
                </div>
            )}

            {step === "email" && (
                <form onSubmit={handleSendCode} className="space-y-4">
                    <div className="space-y-1.5">
                        <label style={{ color: colors.text }} className="text-xs font-semibold uppercase tracking-wider ml-1">Email</label>
                        <div className="relative">
                            <Mail style={{ color: colors.textMuted }} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                            <input 
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text, borderRadius: template.style.heroRadius === 'rounded-none' ? '0' : '8px' }}
                                className="w-full pl-10 pr-4 py-2.5 border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-sm"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        style={{ backgroundColor: colors.primary, borderRadius: template.style.heroRadius === 'rounded-none' ? '0' : '8px' }}
                        className="w-full py-3 flex items-center justify-center gap-2 text-white font-semibold mt-6 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <>Send Recovery Code <ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                    
                    <Link href={`/sites/${slug}/login${nextUrl.includes('checkout') ? '?checkout=true' : ''}`} style={{ color: colors.textMuted }} className="w-full text-xs font-medium hover:underline mt-4 flex justify-center">
                        Back to Sign in
                    </Link>
                </form>
            )}

            {step === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="space-y-1.5">
                        <label style={{ color: colors.text }} className="text-xs font-semibold uppercase tracking-wider ml-1">Recovery Code</label>
                        <input 
                            type="text"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text, borderRadius: template.style.heroRadius === 'rounded-none' ? '0' : '8px', letterSpacing: '0.25em' }}
                            className="w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-center text-xl font-bold"
                            placeholder="123456"
                            maxLength={6}
                            inputMode="numeric"
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        disabled={loading || otp.length < 6}
                        style={{ backgroundColor: colors.primary, borderRadius: template.style.heroRadius === 'rounded-none' ? '0' : '8px' }}
                        className="w-full py-3 flex items-center justify-center gap-2 text-white font-semibold mt-6 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Code"}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => {
                            setStep("email");
                            setError(null);
                        }}
                        style={{ color: colors.textMuted }}
                        className="w-full text-xs font-medium hover:underline mt-4 flex justify-center"
                    >
                        Use a different email
                    </button>
                </form>
            )}

            {step === "password" && (
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-1.5">
                        <label style={{ color: colors.text }} className="text-xs font-semibold uppercase tracking-wider ml-1">New Password</label>
                        <div className="relative">
                            <Lock style={{ color: colors.textMuted }} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                            <input 
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text, borderRadius: template.style.heroRadius === 'rounded-none' ? '0' : '8px' }}
                                className="w-full pl-10 pr-4 py-2.5 border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading || password.length < 6}
                        style={{ backgroundColor: colors.primary, borderRadius: template.style.heroRadius === 'rounded-none' ? '0' : '8px' }}
                        className="w-full py-3 flex items-center justify-center gap-2 text-white font-semibold mt-6 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                    </button>
                </form>
            )}
        </div>
    );
}
