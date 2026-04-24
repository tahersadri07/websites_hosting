import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
    Building2, Users, Wrench, Globe, Plus, ArrowRight,
    TrendingUp, Activity, Power, Pause, AlertTriangle
} from "lucide-react";
import { setBusinessStatus } from "@/app/superadmin/actions";

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; cls: string; dot: string }> = {
        active:      { label: "Live",        cls: "status-active",   dot: "dot-live" },
        paused:      { label: "Paused",      cls: "status-paused",   dot: "dot-paused" },
        maintenance: { label: "Maintenance", cls: "status-inactive",  dot: "dot-paused" },
    };
    const s = map[status] ?? map.active;
    return (
        <span className={`tool-pill border ${s.cls}`}>
            <span className={s.dot} />
            {s.label}
        </span>
    );
}

export default async function SuperAdminDashboard() {
    const db = createServiceClient();

    const [{ data: businesses }, { data: tools }] = await Promise.all([
        db.from("businesses").select("*, business_tools(count)").order("created_at", { ascending: false }),
        db.from("platform_tools").select("*").order("sort_order"),
    ]);

    const stats = [
        { label: "Total Clients",    value: businesses?.length ?? 0,                                                        icon: Building2,  color: "from-indigo-500 to-purple-600",  glow: "shadow-indigo-500/20" },
        { label: "Active Clients",   value: businesses?.filter((b: any) => b.status === "active").length ?? 0,              icon: Activity,   color: "from-emerald-500 to-teal-600",   glow: "shadow-emerald-500/20" },
        { label: "Paused Clients",   value: businesses?.filter((b: any) => b.status !== "active").length ?? 0,              icon: Pause,      color: "from-amber-500 to-orange-600",   glow: "shadow-amber-500/20" },
        { label: "Platform Tools",   value: tools?.length ?? 0,                                                             icon: Wrench,     color: "from-blue-500 to-cyan-600",      glow: "shadow-blue-500/20" },
    ];

    return (
        <div className="space-y-8 max-w-6xl animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Platform Dashboard</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">Manage clients, tools, and platform settings</p>
                </div>
                <Link href="/superadmin/clients/new"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25">
                    <Plus className="w-4 h-4" /> New Client
                </Link>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="kpi-card">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg ${stat.glow} flex items-center justify-center mb-3`}>
                            <stat.icon className="w-4.5 h-4.5 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-white tabular-nums">{stat.value}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Client List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white">All Clients</h2>
                    <Link href="/superadmin/clients"
                        className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors flex items-center gap-1">
                        View all <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                <div className="rounded-2xl border border-[#27272A] bg-[#13131A] overflow-hidden">
                    {(!businesses || businesses.length === 0) ? (
                        <div className="p-16 text-center">
                            <Building2 className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                            <p className="text-zinc-500 text-sm">No clients yet.</p>
                            <Link href="/superadmin/clients/new"
                                className="text-indigo-400 text-sm hover:underline mt-1 inline-block">
                                Create your first client →
                            </Link>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#27272A]">
                                    <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Business</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3.5 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1C1C24]">
                                {businesses.slice(0, 8).map((b: any) => (
                                    <tr key={b.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                                    style={{ background: b.primary_color ?? "#6366F1" }}
                                                >
                                                    {b.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{b.name}</p>
                                                    <p className="text-xs text-zinc-600 font-mono">{b.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <span className="text-xs text-zinc-400 capitalize">{b.business_type ?? "service"}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge status={b.status ?? "active"} />
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`/sites/${b.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-8 h-8 rounded-lg border border-zinc-700 text-zinc-400 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/8 flex items-center justify-center transition-all"
                                                    title="View site"
                                                >
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Platform Config */}
            <div className="rounded-2xl border border-[#27272A] bg-[#13131A] p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-semibold text-white">Platform Configuration</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        { key: "PLATFORM_DOMAIN",  val: process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "localhost:3000" },
                        { key: "INVITE_CODE",       val: process.env.ADMIN_INVITE_CODE ? "••••••••  Set ✓" : "not set" },
                        { key: "SUPERADMIN_SECRET", val: process.env.SUPERADMIN_SECRET ? "••••••••  Set ✓" : "not set" },
                    ].map(({ key, val }) => (
                        <div key={key} className="bg-[#0A0A0F] rounded-xl px-4 py-3 border border-[#27272A]">
                            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">{key}</p>
                            <p className="text-sm font-mono text-indigo-300 mt-1 truncate">{val}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
