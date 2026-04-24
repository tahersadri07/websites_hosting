import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, ArrowRight, Power, Pause, Building2 } from "lucide-react";
import { setBusinessStatus } from "@/app/superadmin/actions";

function StatusDot({ status }: { status: string }) {
    const map: Record<string, string> = {
        active:      "bg-emerald-400 shadow-emerald-400/40",
        paused:      "bg-amber-400 shadow-amber-400/40",
        maintenance: "bg-zinc-500",
    };
    return (
        <span className={`inline-block w-2 h-2 rounded-full shadow-md ${map[status] ?? map.active}`} />
    );
}

export default async function ClientsPage() {
    const db = createServiceClient();
    const { data: businesses } = await db
        .from("businesses")
        .select("*, business_tools(count)")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6 max-w-5xl animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Clients</h1>
                    <p className="text-sm text-zinc-500 mt-0.5">{businesses?.length ?? 0} businesses on the platform</p>
                </div>
                <Link
                    href="/superadmin/clients/new"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
                >
                    <Plus className="w-4 h-4" /> New Client
                </Link>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-[#27272A] bg-[#13131A] overflow-hidden">
                {(!businesses || businesses.length === 0) ? (
                    <div className="py-20 text-center">
                        <Building2 className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                        <p className="text-zinc-500 text-sm">No clients yet</p>
                        <Link href="/superadmin/clients/new" className="text-indigo-400 text-sm hover:underline mt-1 inline-block">
                            Create your first client →
                        </Link>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#27272A]">
                                {["Business", "Slug", "Type", "Status", "Tools", "Actions"].map((h, i) => (
                                    <th key={h} className={`px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600 ${i > 2 && i < 5 ? "hidden md:table-cell" : ""}`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1C1C24]">
                            {businesses.map((b: any) => {
                                const toolCount = b.business_tools?.[0]?.count ?? 0;
                                return (
                                    <tr key={b.id} className="group hover:bg-white/[0.015] transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
                                                    style={{ background: `linear-gradient(135deg, ${b.primary_color ?? "#6366F1"}, ${b.secondary_color ?? "#8B5CF6"})` }}
                                                >
                                                    {b.name?.charAt(0)}
                                                </div>
                                                <span className="font-medium text-white">{b.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <code className="text-xs font-mono text-zinc-500 bg-[#0A0A0F] border border-[#27272A] px-2 py-1 rounded-lg">
                                                {b.slug}
                                            </code>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-xs text-zinc-500 capitalize">{b.business_type ?? "service"}</span>
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <StatusDot status={b.status ?? "active"} />
                                                <span className="text-xs text-zinc-400 capitalize">{b.status ?? "active"}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <span className="text-xs text-zinc-600">{toolCount} enabled</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1.5 justify-end">
                                                <form action={setBusinessStatus}>
                                                    <input type="hidden" name="id" value={b.id} />
                                                    <input type="hidden" name="status" value={b.status === "active" ? "paused" : "active"} />
                                                    <button
                                                        type="submit"
                                                        title={b.status === "active" ? "Pause" : "Resume"}
                                                        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all text-xs ${
                                                            b.status === "active"
                                                                ? "border-zinc-700 text-zinc-500 hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/8"
                                                                : "border-zinc-700 text-zinc-500 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/8"
                                                        }`}
                                                    >
                                                        {b.status === "active"
                                                            ? <Pause className="w-3.5 h-3.5" />
                                                            : <Power className="w-3.5 h-3.5" />
                                                        }
                                                    </button>
                                                </form>
                                                <Link
                                                    href={`/superadmin/clients/${b.id}`}
                                                    className="w-8 h-8 rounded-lg border border-zinc-700 text-zinc-500 hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-indigo-500/8 flex items-center justify-center transition-all"
                                                >
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
