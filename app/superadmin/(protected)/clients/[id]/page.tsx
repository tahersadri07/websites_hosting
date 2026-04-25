import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, Power, Pause, AlertTriangle, Globe, Wrench,
    Layers, Image, Star, MessageSquare, Users, Package,
    Calendar, Receipt, BarChart3, Mail, Gift, Check, X,
    UserPlus, ExternalLink, ShieldCheck, Trash2,
} from "lucide-react";
import {
    setBusinessStatus, toggleBusinessTool,
    inviteAdminUser, removeAdminUser, setBusinessTemplate,
} from "@/app/superadmin/actions";
import { TEMPLATES } from "@/lib/templates";
import { EditClientForm } from "@/components/superadmin/EditClientForm";

const IconMap: Record<string, any> = {
    Layers, Image, Star, MessageSquare, Users, Package,
    Calendar, Receipt, BarChart3, Mail, Gift, Wrench,
};

const categoryLabels: Record<string, string> = {
    core:       "Core Features",
    operations: "Operations",
    analytics:  "Analytics",
    marketing:  "Marketing",
};

function StatusIcon({ status }: { status: string }) {
    if (status === "active")  return <Power     className="w-3.5 h-3.5 text-emerald-400" />;
    if (status === "paused")  return <Pause     className="w-3.5 h-3.5 text-amber-400"   />;
    return                           <AlertTriangle className="w-3.5 h-3.5 text-zinc-400" />;
}

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
    const db = createServiceClient();

    const [{ data: biz }, { data: allTools }, { data: enabledTools }, { data: memberships }] =
        await Promise.all([
            db.from("businesses").select("*").eq("id", params.id).single(),
            db.from("platform_tools").select("*").order("sort_order"),
            db.from("business_tools").select("*").eq("business_id", params.id),
            db.from("memberships").select("id, role, user_id").eq("business_id", params.id),
        ]);

    if (!biz) notFound();

    const currentTemplate = (biz as any).template ?? "dark-minimal";

    // Fetch auth user emails for each membership
    const memberDetails: { id: string; user_id: string; role: string; email: string }[] = [];
    for (const m of memberships ?? []) {
        const { data: { user } } = await db.auth.admin.getUserById(m.user_id);
        memberDetails.push({ id: m.id, user_id: m.user_id, role: m.role, email: user?.email ?? "unknown" });
    }

    // Group tools
    const toolMap = new Map((enabledTools ?? []).map((t: any) => [t.tool_key, t]));
    const grouped = (allTools ?? []).reduce((acc: any, tool: any) => {
        if (!acc[tool.category]) acc[tool.category] = [];
        acc[tool.category].push({ ...tool, enabled: toolMap.get(tool.key)?.is_enabled ?? false });
        return acc;
    }, {});

    const statusOptions = [
        { value: "active",      label: "Live",        color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
        { value: "paused",      label: "Paused",      color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/30"   },
        { value: "maintenance", label: "Maintenance", color: "text-zinc-400",    bg: "bg-zinc-500/10 border-zinc-500/30"     },
    ];
    const currentStatus = statusOptions.find(s => s.value === (biz.status ?? "active")) ?? statusOptions[0];

    return (
        <div className="space-y-8 max-w-4xl animate-fade-in">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
                <Link href="/superadmin" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
                    <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
                </Link>
                <span className="text-zinc-700">/</span>
                <span className="text-white text-sm font-medium">{biz.name}</span>
            </div>

            {/* Client header */}
            <div className="rounded-2xl border border-[#27272A] bg-[#13131A] p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-4 flex-grow">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg"
                            style={{ background: `linear-gradient(135deg, ${biz.primary_color ?? "#6366F1"}, ${biz.secondary_color ?? "#8B5CF6"})` }}
                        >
                            {biz.name?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">{biz.name}</h1>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <code className="text-xs font-mono text-zinc-500 bg-[#0A0A0F] px-2 py-0.5 rounded border border-[#27272A]">{biz.slug}</code>
                                {biz.custom_domain && (
                                    <code className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> {biz.custom_domain}
                                    </code>
                                )}
                                <span className={`tool-pill border ${currentStatus.bg} ${currentStatus.color} flex items-center gap-1.5`}>
                                    <StatusIcon status={biz.status ?? "active"} />
                                    {currentStatus.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status + View Site */}
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                        <EditClientForm biz={biz} />
                        <a href={`/sites/${biz.slug}`} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-[#27272A] text-zinc-400 hover:border-zinc-600 hover:text-white transition-all">
                            <ExternalLink className="w-3 h-3" /> View Site
                        </a>
                        {statusOptions.filter(s => s.value !== (biz.status ?? "active")).map(opt => (
                            <form key={opt.value} action={setBusinessStatus}>
                                <input type="hidden" name="id" value={biz.id} />
                                <input type="hidden" name="status" value={opt.value} />
                                <button type="submit"
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${opt.bg} ${opt.color} hover:opacity-80`}>
                                    Set {opt.label}
                                </button>
                            </form>
                        ))}
                    </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-[#27272A]">
                    {[
                        { label: "Business Type",  value: biz.business_type   ?? "service" },
                        { label: "Products Label", value: biz.services_label  ?? "Services" },
                        { label: "Currency",       value: biz.currency_symbol ?? "₹" },
                        { label: "Primary Color",  value: biz.primary_color   ?? "#6366F1" },
                    ].map(({ label, value }) => (
                        <div key={label}>
                            <p className="text-[10px] uppercase tracking-wider text-zinc-600">{label}</p>
                            <p className="text-sm font-mono text-zinc-300 mt-0.5 truncate">{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── TEMPLATE PICKER ──────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-[#27272A] bg-[#13131A] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A]">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0" />
                        <h2 className="text-base font-semibold text-white">Website Template</h2>
                        <span className="text-xs text-zinc-600">— visual design for the public site</span>
                    </div>
                    <span className="text-[11px] text-zinc-600 font-mono px-2 py-0.5 rounded bg-[#0A0A0F] border border-[#27272A]">
                        active: {currentTemplate}
                    </span>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {Object.values(TEMPLATES).map(tpl => {
                        const isActive = currentTemplate === tpl.key;
                        return (
                            <form key={tpl.key} action={setBusinessTemplate}>
                                <input type="hidden" name="id"       value={biz.id} />
                                <input type="hidden" name="template" value={tpl.key} />
                                <button type="submit" disabled={isActive}
                                    className={`w-full text-left rounded-xl border overflow-hidden transition-all duration-200 ${
                                        isActive
                                            ? "border-indigo-500/60 ring-2 ring-indigo-500/30 cursor-default"
                                            : "border-[#27272A] hover:border-zinc-500 cursor-pointer"
                                    }`}
                                >
                                    {/* Gradient preview strip */}
                                    <div className="h-24 w-full relative" style={{ background: tpl.preview }}>
                                        {isActive && (
                                            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500 text-white">
                                                ACTIVE
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 bg-[#0A0A0F]">
                                        <p className="text-xs font-semibold text-white mb-0.5">{tpl.name}</p>
                                        <p className="text-[10px] text-zinc-600 leading-snug line-clamp-2">{tpl.description}</p>
                                    </div>
                                </button>
                            </form>
                        );
                    })}
                </div>
                <p className="px-6 pb-5 text-[11px] text-zinc-700">Changes apply immediately — client's site updates on next page load.</p>
            </div>

            {/* ── ADMIN USERS SECTION ──────────────────────────────────────────── */}
            <div className="rounded-2xl border border-[#27272A] bg-[#13131A] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A]">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-zinc-500" />
                        <h2 className="text-base font-semibold text-white">Admin Users</h2>
                        <span className="text-xs text-zinc-600">— who can log in to manage this business</span>
                    </div>
                </div>

                {/* Existing users list */}
                {memberDetails.length > 0 ? (
                    <div className="divide-y divide-[#1C1C24]">
                        {memberDetails.map(m => (
                            <div key={m.id} className="flex items-center gap-3 px-6 py-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {m.email.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{m.email}</p>
                                    <p className="text-xs text-zinc-600 capitalize">{m.role}</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                                        <ShieldCheck className="w-3 h-3" /> Active
                                    </span>
                                    <form action={removeAdminUser}>
                                        <input type="hidden" name="membership_id" value={m.id} />
                                        <input type="hidden" name="business_id" value={biz.id} />
                                        <button type="submit" title="Remove admin access"
                                            className="w-7 h-7 rounded-lg border border-[#27272A] text-zinc-600 hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/8 flex items-center justify-center transition-all">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-6 py-8 text-center">
                        <Users className="w-8 h-8 text-zinc-800 mx-auto mb-2" />
                        <p className="text-sm text-zinc-600">No admin users yet</p>
                        <p className="text-xs text-zinc-700 mt-1">Add one below so this client can log in</p>
                    </div>
                )}

                {/* Invite form */}
                <form action={inviteAdminUser}
                    className="px-6 py-5 bg-[#0A0A0F]/60 border-t border-[#27272A] space-y-3">
                    <input type="hidden" name="business_id" value={biz.id} />
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                        <UserPlus className="w-3.5 h-3.5" /> Create New Admin Login
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                            type="email" name="email" required
                            placeholder="admin@clientbusiness.com"
                            className="sm:col-span-2 h-9 px-3 rounded-xl bg-[#13131A] border border-[#27272A] text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                        />
                        <input
                            type="password" name="password" required minLength={8}
                            placeholder="Password (8+ chars)"
                            className="h-9 px-3 rounded-xl bg-[#13131A] border border-[#27272A] text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-indigo-500/60 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <select name="role"
                            className="h-9 px-3 rounded-xl bg-[#13131A] border border-[#27272A] text-sm text-zinc-300 focus:outline-none focus:border-indigo-500/60 transition-all">
                            <option value="owner">Owner</option>
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                        </select>
                        <button type="submit"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20">
                            <UserPlus className="w-3.5 h-3.5" /> Create & Assign
                        </button>
                        <p className="text-[11px] text-zinc-700">They can log in immediately at <code className="text-zinc-500">/login</code></p>
                    </div>
                </form>
            </div>

            {/* ── TOOL TOGGLES ─────────────────────────────────────────────────── */}
            <div className="space-y-5">
                <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-zinc-500" />
                    <h2 className="text-base font-semibold text-white">Enabled Tools</h2>
                    <span className="text-xs text-zinc-600 ml-1">Toggle features for this client</span>
                </div>

                {Object.entries(categoryLabels).map(([cat, catLabel]) => {
                    const catTools = grouped[cat] ?? [];
                    if (catTools.length === 0) return null;
                    return (
                        <div key={cat}>
                            <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2 px-1">{catLabel}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {catTools.map((tool: any) => {
                                    const IconComp = IconMap[tool.icon] ?? Wrench;
                                    return (
                                        <form key={tool.key} action={toggleBusinessTool}>
                                            <input type="hidden" name="business_id" value={biz.id} />
                                            <input type="hidden" name="tool_key"    value={tool.key} />
                                            <input type="hidden" name="is_enabled"  value={String(tool.enabled)} />
                                            <button type="submit"
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                                                    tool.enabled
                                                        ? "bg-indigo-500/8 border-indigo-500/25 hover:border-indigo-500/50"
                                                        : "bg-[#13131A] border-[#27272A] hover:border-zinc-600"
                                                }`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                    tool.enabled ? "bg-indigo-500/15 text-indigo-400" : "bg-zinc-800 text-zinc-600"
                                                }`}>
                                                    <IconComp className="w-4 h-4" />
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <p className={`text-sm font-medium truncate ${tool.enabled ? "text-white" : "text-zinc-500"}`}>
                                                        {tool.name}
                                                    </p>
                                                    <p className="text-[11px] text-zinc-600 truncate">{tool.description}</p>
                                                </div>
                                                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                                    tool.enabled ? "bg-indigo-500 text-white" : "bg-zinc-800"
                                                }`}>
                                                    {tool.enabled
                                                        ? <Check className="w-3 h-3" />
                                                        : <X className="w-3 h-3 text-zinc-600" />
                                                    }
                                                </div>
                                            </button>
                                        </form>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
