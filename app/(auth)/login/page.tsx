"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { login } from "./actions";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const justCreated = searchParams.get("created") === "1";

    const [showPw, setShowPw] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setServerError(null);
        const fd = new FormData(e.currentTarget);
        const result = await login(fd);
        if (result?.error) {
            setServerError(result.error);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0A0A0F] flex mesh-bg">
            {/* Left — Artwork panel */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#13131A] border-r border-[#27272A] p-12 relative overflow-hidden">
                {/* Glow orbs */}
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

                {/* Brand mark */}
                <div className="relative flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <span className="text-white font-black text-sm">A</span>
                    </div>
                    <span className="text-white font-bold text-sm tracking-tight">Admin Panel</span>
                </div>

                {/* Feature list */}
                <div className="relative space-y-4">
                    <p className="text-2xl font-bold text-white leading-tight">
                        Manage your business<br />
                        <span className="gradient-text">from one place.</span>
                    </p>
                    <div className="space-y-2.5 pt-2">
                        {[
                            "Products & services catalog",
                            "Photo gallery management",
                            "Customer inquiries & reviews",
                            "Real-time website control",
                        ].map((f) => (
                            <div key={f} className="flex items-center gap-2.5 text-sm text-zinc-400">
                                <div className="w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center flex-shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                </div>
                                {f}
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative text-xs text-zinc-700">© 2026 Platform. All rights reserved.</p>
            </div>

            {/* Right — Form panel */}
            <div className="flex-grow flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm animate-slide-up">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
                        <p className="text-zinc-500 text-sm mt-1">Sign in to your admin panel</p>
                    </div>

                    {/* Success banner */}
                    {justCreated && (
                        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 mb-5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <p className="text-sm text-emerald-400">Account created! Sign in with your credentials.</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                Email
                            </label>
                            <input
                                id="email" name="email" type="email" required autoComplete="email"
                                placeholder="you@business.com"
                                className="w-full h-11 px-4 rounded-xl bg-[#13131A] border border-[#27272A] text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-xs text-zinc-600 hover:text-indigo-400 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password" name="password" type={showPw ? "text" : "password"}
                                    required autoComplete="current-password" placeholder="••••••••"
                                    className="w-full h-11 px-4 pr-11 rounded-xl bg-[#13131A] border border-[#27272A] text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                                />
                                <button
                                    type="button" onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                                >
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {serverError && (
                            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25">
                                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                <p className="text-sm text-red-400">{serverError}</p>
                            </div>
                        )}

                        <button
                            type="submit" disabled={isLoading}
                            className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isLoading ? "Signing in…" : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-zinc-600 mt-6">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
