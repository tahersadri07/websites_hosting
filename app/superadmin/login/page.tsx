"use client";

import { useState, useTransition } from "react";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { loginSuperAdmin } from "../actions";

export default function SuperAdminLogin() {
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
            const result = await loginSuperAdmin(fd);
            if (result?.error) setError(result.error);
        });
    }

    return (
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 mesh-bg">
            {/* Ambient glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative w-full max-w-sm animate-slide-up">
                {/* Card */}
                <div className="rounded-2xl border border-[#27272A] bg-[#13131A] p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-4">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Super Admin</h1>
                        <p className="text-sm text-zinc-500 mt-1">Developer access only</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                Admin Secret
                            </label>
                            <div className="relative">
                                <input
                                    name="secret"
                                    type={show ? "text" : "password"}
                                    required
                                    autoComplete="off"
                                    placeholder="Enter your secret key"
                                    className="w-full h-11 px-4 pr-11 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShow(!show)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                                >
                                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/25">
                                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                <p className="text-xs text-red-400">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Verifying…" : "Access Platform"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-zinc-700 mt-5">
                    Restricted access · All activity is logged
                </p>
            </div>
        </div>
    );
}
