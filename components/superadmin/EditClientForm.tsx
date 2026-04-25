"use client";

import { useState } from "react";
import { Wrench, Check, X, Loader2 } from "lucide-react";
import { updateBusiness } from "@/app/superadmin/actions";

interface Props {
    biz: any;
}

const BUSINESS_TYPES = ["product", "service"];
const CURRENCIES = [
    { symbol: "₹", label: "INR (₹)" },
    { symbol: "$", label: "USD ($)" },
    { symbol: "€", label: "EUR (€)" },
    { symbol: "£", label: "GBP (£)" },
    { symbol: "AED", label: "AED" },
];

export function EditClientForm({ biz }: Props) {
    const [editing, setEditing] = useState(false);
    const [pending, setPending] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setPending(true);
        try {
            const fd = new FormData(e.currentTarget);
            await updateBusiness(fd);
            setEditing(false);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setPending(false);
        }
    }

    if (!editing) {
        return (
            <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-[#27272A] text-zinc-400 hover:border-zinc-600 hover:text-white transition-all"
            >
                <Wrench className="w-3 h-3" /> Edit Details
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-[#13131A] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-[#27272A] flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Edit Client Details</h2>
                    <button onClick={() => setEditing(false)} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input type="hidden" name="id" value={biz.id} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Business Name</label>
                            <input name="name" defaultValue={biz.name} required
                                className="w-full h-10 px-3 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-white text-sm focus:outline-none focus:border-indigo-500/60" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Slug</label>
                            <input name="slug" defaultValue={biz.slug} required
                                className="w-full h-10 px-3 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-white text-sm font-mono focus:outline-none focus:border-indigo-500/60" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Business Type</label>
                            <select name="business_type" defaultValue={biz.business_type}
                                className="w-full h-10 px-3 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-white text-sm focus:outline-none focus:border-indigo-500/60">
                                {BUSINESS_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Currency</label>
                            <select name="currency_symbol" defaultValue={biz.currency_symbol}
                                className="w-full h-10 px-3 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-white text-sm focus:outline-none focus:border-indigo-500/60">
                                {CURRENCIES.map(c => <option key={c.symbol} value={c.symbol}>{c.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-zinc-500">Business Tagline</label>
                        <input name="tagline" defaultValue={biz.tagline}
                            placeholder="e.g. Premium Content Creator Portal"
                            className="w-full h-10 px-3 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-white text-sm focus:outline-none focus:border-indigo-500/60" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-zinc-500">Catalog Label (e.g. Products, Services)</label>
                        <input name="services_label" defaultValue={biz.services_label}
                            className="w-full h-10 px-3 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-white text-sm focus:outline-none focus:border-indigo-500/60" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-zinc-500">Business Description (SEO)</label>
                        <textarea name="description" defaultValue={biz.description}
                            rows={3}
                            placeholder="Detailed bio or business overview..."
                            className="w-full px-3 py-2 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-white text-sm focus:outline-none focus:border-indigo-500/60 resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Primary Color</label>
                            <div className="flex gap-2">
                                <input type="color" name="primary_color" defaultValue={biz.primary_color || "#6366F1"}
                                    className="w-10 h-10 rounded-lg border border-[#27272A] bg-transparent cursor-pointer" />
                                <input type="text" defaultValue={biz.primary_color || "#6366F1"} readOnly
                                    className="flex-grow h-10 px-3 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-zinc-500 text-xs font-mono" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Secondary Color</label>
                            <div className="flex gap-2">
                                <input type="color" name="secondary_color" defaultValue={biz.secondary_color || "#8B5CF6"}
                                    className="w-10 h-10 rounded-lg border border-[#27272A] bg-transparent cursor-pointer" />
                                <input type="text" defaultValue={biz.secondary_color || "#8B5CF6"} readOnly
                                    className="flex-grow h-10 px-3 rounded-xl bg-[#0A0A0F] border border-[#27272A] text-zinc-500 text-xs font-mono" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setEditing(false)}
                            className="px-4 py-2 rounded-xl border border-[#27272A] text-zinc-400 hover:text-white transition-all text-sm font-medium">
                            Cancel
                        </button>
                        <button type="submit" disabled={pending}
                            className="flex-grow flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-600 transition-all disabled:opacity-50">
                            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            {pending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
