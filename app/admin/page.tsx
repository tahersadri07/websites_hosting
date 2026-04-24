import { createClient } from "@/lib/supabase/server";
import { getAdminBusinessSlug } from "@/lib/admin-context";
import { Layers, Image as ImageIcon, Star, MessageSquare, TrendingUp, Clock, ArrowUpRight } from "lucide-react";

const statConfig = [
    { key: "serviceCount",     label: "Products",    icon: Layers,        gradient: "from-indigo-500 to-purple-600",  glow: "shadow-indigo-500/25" },
    { key: "galleryCount",     label: "Gallery",     icon: ImageIcon,     gradient: "from-blue-500 to-cyan-600",      glow: "shadow-blue-500/25" },
    { key: "testimonialCount", label: "Reviews",     icon: Star,          gradient: "from-amber-500 to-orange-500",   glow: "shadow-amber-500/25" },
    { key: "newInquiryCount",  label: "New Inquiries",icon: MessageSquare, gradient: "from-emerald-500 to-teal-600",  glow: "shadow-emerald-500/25" },
];

export default async function AdminDashboard() {
    const supabase = await createClient();
    const slug = await getAdminBusinessSlug();

    const { data: business } = await (supabase as any)
        .from("businesses").select("id, name, status").eq("slug", slug).single();

    if (!business) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-zinc-500 text-sm">Business not found. Please contact your administrator.</p>
            </div>
        );
    }

    const [services, gallery, testimonials, inquiries] = await Promise.all([
        (supabase as any).from("services").select("id", { count: "exact" }).eq("business_id", business.id),
        (supabase as any).from("gallery_images").select("id", { count: "exact" }).eq("business_id", business.id),
        (supabase as any).from("testimonials").select("id", { count: "exact" }).eq("business_id", business.id),
        (supabase as any).from("contact_inquiries").select("id, name, message, status, created_at").eq("business_id", business.id).order("created_at", { ascending: false }).limit(10),
    ]);

    const stats = {
        serviceCount:     services.count ?? 0,
        galleryCount:     gallery.count ?? 0,
        testimonialCount: testimonials.count ?? 0,
        newInquiryCount:  (inquiries.data ?? []).filter((i: any) => i.status === "new").length,
    };

    const recentInquiries = inquiries.data ?? [];

    // Website paused banner
    const isPaused = business.status && business.status !== "active";

    return (
        <div className="space-y-8 max-w-5xl animate-fade-in">
            {/* Paused Banner */}
            {isPaused && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/8 px-5 py-4 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-amber-400">Website is {business.status}</p>
                        <p className="text-xs text-amber-400/60 mt-0.5">Your website is currently not visible to the public. Contact your platform admin to reactivate.</p>
                    </div>
                </div>
            )}

            {/* Greeting */}
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"} 👋
                </h1>
                <p className="text-zinc-500 text-sm mt-0.5">
                    Here&apos;s what&apos;s happening with <span className="text-zinc-300 font-medium">{business.name}</span> today.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statConfig.map((cfg) => (
                    <div key={cfg.key} className="kpi-card group cursor-default">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cfg.gradient} shadow-lg ${cfg.glow} flex items-center justify-center mb-4`}>
                            <cfg.icon className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-white tabular-nums tracking-tight">
                            {(stats as any)[cfg.key]}
                        </p>
                        <p className="text-xs text-zinc-600 mt-1 font-medium">{cfg.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Inquiries */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-white">Recent Inquiries</h2>
                        {stats.newInquiryCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                                {stats.newInquiryCount} new
                            </span>
                        )}
                    </div>
                    <a href="/admin/inquiries" className="text-xs text-zinc-600 hover:text-indigo-400 transition-colors flex items-center gap-1">
                        View all <ArrowUpRight className="w-3 h-3" />
                    </a>
                </div>

                <div className="rounded-2xl border border-[#27272A] bg-[#13131A] overflow-hidden">
                    {recentInquiries.length === 0 ? (
                        <div className="py-16 text-center">
                            <MessageSquare className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                            <p className="text-zinc-600 text-sm">No inquiries yet.</p>
                            <p className="text-zinc-700 text-xs mt-1">They&apos;ll appear here when customers contact you.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#27272A]">
                                    {["Customer", "Message", "Status", "Date"].map((h, i) => (
                                        <th key={h} className={`px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-600 ${i > 1 ? "hidden md:table-cell" : ""}`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1C1C24]">
                                {recentInquiries.map((inq: any) => (
                                    <tr key={inq.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {inq.name?.charAt(0) ?? "?"}
                                                </div>
                                                <span className="font-medium text-zinc-200 truncate max-w-[100px]">{inq.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 hidden md:table-cell">
                                            <p className="text-zinc-500 truncate max-w-xs text-xs">{inq.message}</p>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`tool-pill border text-xs ${inq.status === "new"
                                                ? "status-active"
                                                : "status-inactive"
                                            }`}>
                                                <span className={inq.status === "new" ? "dot-live" : "w-1.5 h-1.5 rounded-full bg-zinc-600"} />
                                                {inq.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 hidden md:table-cell">
                                            <div className="flex items-center gap-1 text-zinc-600 text-xs">
                                                <Clock className="w-3 h-3" />
                                                {new Date(inq.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Quick tips */}
            <div className="rounded-2xl border border-[#27272A] bg-[#13131A] p-5">
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                        { label: "Add Product",     href: "/admin/services/new" },
                        { label: "Upload Photo",    href: "/admin/gallery" },
                        { label: "Add Review",      href: "/admin/testimonials" },
                        { label: "View Settings",   href: "/admin/settings" },
                    ].map(({ label, href }) => (
                        <a
                            key={href}
                            href={href}
                            className="px-3 py-2.5 rounded-xl border border-[#27272A] text-xs font-medium text-zinc-400 hover:border-indigo-500/30 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all text-center"
                        >
                            {label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
