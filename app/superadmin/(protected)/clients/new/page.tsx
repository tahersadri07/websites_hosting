"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Loader2, AlertCircle } from "lucide-react";
import { createBusiness } from "@/app/superadmin/actions";

const BUSINESS_TYPES = ["service", "retail", "garment", "food", "salon", "clinic", "education", "tech", "other"];
const CURRENCIES = [
    { symbol: "₹", label: "INR (₹)" },
    { symbol: "$", label: "USD ($)" },
    { symbol: "€", label: "EUR (€)" },
    { symbol: "£", label: "GBP (£)" },
    { symbol: "AED", label: "AED" },
];

function slugify(str: string) {
    return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function NewClientPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [autoSlug, setAutoSlug] = useState(true);
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    function handleNameChange(v: string) {
        setName(v);
        if (autoSlug) setSlug(slugify(v));
    }
    function handleSlugChange(v: string) {
        setAutoSlug(false);
        setSlug(slugify(v));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setPending(true);
        try {
            const fd = new FormData(e.currentTarget);
            const result = await createBusiness(fd) as any;
            if (result?.error) setError(result.error);
        } catch {
            /* redirect on success */
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="max-w-2xl animate-fade-in">
            {/* Back */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-sm mb-6"
            >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white tracking-tight">New Client</h1>
                <p className="text-zinc-500 text-sm mt-1">Create a new business on the platform</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Basic Info */}
                <div className="rounded-2xl border border-[#27272A] bg-[#13131A] p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-white mb-1">Business Details</h2>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Business Name *</label>
                        <input
                            name="name" required value={name} onChange={e => handleNameChange(e.target.value)}
                            placeholder="e.g. Al-Noor Rida Collection"
                            className="w-full h-11 px-4 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Slug *</label>
                        <div className="flex gap-2 items-center">
                            <span className="text-zinc-700 text-sm font-mono flex-shrink-0">site.com/</span>
                            <input
                                name="slug" required value={slug} onChange={e => handleSlugChange(e.target.value)}
                                placeholder="al-noor-rida"
                                className="flex-grow h-11 px-4 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-white text-sm font-mono placeholder-zinc-700 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                            />
                        </div>
                        <p className="text-[11px] text-zinc-700">Used for admin access and internal routing</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Business Type</label>
                            <select
                                name="business_type"
                                className="w-full h-11 px-4 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all appearance-none"
                            >
                                {BUSINESS_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Currency</label>
                            <select
                                name="currency_symbol"
                                className="w-full h-11 px-4 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-white text-sm focus:outline-none focus:border-indigo-500/60 transition-all appearance-none"
                            >
                                {CURRENCIES.map(c => <option key={c.symbol} value={c.symbol}>{c.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Products/Services Label</label>
                        <input
                            name="services_label" defaultValue="Services"
                            placeholder="e.g. Products, Treatments, Courses"
                            className="w-full h-11 px-4 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-indigo-500/60 transition-all"
                        />
                    </div>
                </div>

                {/* Branding */}
                <div className="rounded-2xl border border-[#27272A] bg-[#13131A] p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-white mb-1">Brand Colors</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { name: "primary_color",   label: "Primary",   default: "#6366F1" },
                            { name: "secondary_color", label: "Secondary", default: "#8B5CF6" },
                        ].map(c => (
                            <div key={c.name} className="space-y-1.5">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{c.label}</label>
                                <div className="flex gap-2 items-center">
                                    <input type="color" name={c.name} defaultValue={c.default}
                                        className="w-11 h-11 rounded-xl border border-[#27272A] bg-[#0A0A0F] cursor-pointer p-1.5" />
                                    <input type="text" defaultValue={c.default} readOnly
                                        className="flex-grow h-11 px-4 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-zinc-500 text-sm font-mono" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="button" onClick={() => router.back()}
                        className="px-5 py-2.5 rounded-xl border border-[#27272A] text-zinc-400 hover:text-white hover:border-zinc-600 text-sm transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit" disabled={pending}
                        className="flex-grow flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25 disabled:opacity-50"
                    >
                        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        {pending ? "Creating…" : "Create Client"}
                    </button>
                </div>
            </form>
        </div>
    );
}
