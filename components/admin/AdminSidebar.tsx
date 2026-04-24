"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Layers, Image, Star, MessageSquare,
    Settings, LogOut, Menu, X, ChevronRight, ExternalLink,
    Users, Package, Calendar, Receipt, BarChart3, Mail, Gift, Megaphone, ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/(auth)/login/actions";

// Core nav always shown
const coreLinks = [
    { href: "/admin",              label: "Dashboard",    icon: LayoutDashboard, exact: true },
    { href: "/admin/services",     label: "Products",     icon: Layers },
    { href: "/admin/orders",       label: "Orders",       icon: ShoppingBag },
    { href: "/admin/categories",   label: "Categories",   icon: Package },
    { href: "/admin/gallery",      label: "Gallery",      icon: Image },
    { href: "/admin/marketing",    label: "Marketing",    icon: Megaphone },
    { href: "/admin/testimonials", label: "Testimonials", icon: Star },
    { href: "/admin/inquiries",    label: "Inquiries",    icon: MessageSquare },
    { href: "/admin/settings",     label: "Settings",     icon: Settings },
];

// Tool-gated links (shown if that tool is enabled)
const toolLinks: Record<string, { href: string; label: string; icon: any }> = {
    crm:       { href: "/admin/crm",       label: "CRM",          icon: Users },
    inventory: { href: "/admin/inventory", label: "Inventory",    icon: Package },
    booking:   { href: "/admin/booking",   label: "Bookings",     icon: Calendar },
    invoicing: { href: "/admin/invoicing", label: "Invoicing",    icon: Receipt },
    analytics: { href: "/admin/analytics", label: "Analytics",    icon: BarChart3 },
    email:     { href: "/admin/email",     label: "Email",        icon: Mail },
    loyalty:   { href: "/admin/loyalty",   label: "Loyalty",      icon: Gift },
};

interface Props {
    businessName: string;
    businessSlug: string;
    enabledTools?: string[];
    primaryColor?: string;
}

function NavContent({ businessName, businessSlug, enabledTools = [], primaryColor, onClose }: Props & { onClose?: () => void }) {
    const pathname = usePathname();
    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    const activeToolLinks = (enabledTools ?? [])
        .filter(k => !["services","gallery","testimonials","inquiries"].includes(k))
        .map(k => toolLinks[k])
        .filter(Boolean);

    return (
        <div className="flex flex-col h-full bg-[#0A0A0F]">
            {/* Logo / Brand */}
            <div className="px-4 py-5 border-b border-[#27272A] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md"
                        style={{ background: `linear-gradient(135deg, ${primaryColor ?? "#6366F1"}, #8B5CF6)` }}
                    >
                        {businessName?.charAt(0) ?? "B"}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white truncate max-w-[130px]">{businessName}</p>
                        <p className="text-[10px] text-zinc-600">Admin Panel</p>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="text-zinc-600 hover:text-white lg:hidden">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-grow px-3 py-3 space-y-0.5 overflow-y-auto">
                {coreLinks.map(link => {
                    const active = isActive(link.href, link.exact);
                    return (
                        <Link key={link.href} href={link.href} onClick={onClose}
                            className={cn("sidebar-link", active && "active")}>
                            <link.icon className="w-4 h-4 flex-shrink-0" />
                            <span>{link.label}</span>
                            {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
                        </Link>
                    );
                })}

                {/* Tool-gated section */}
                {activeToolLinks.length > 0 && (
                    <>
                        <div className="px-3 pt-4 pb-1">
                            <p className="text-[9px] uppercase tracking-widest text-zinc-700 font-semibold">Add-ons</p>
                        </div>
                        {activeToolLinks.map(link => {
                            const active = isActive(link.href);
                            return (
                                <Link key={link.href} href={link.href} onClick={onClose}
                                    className={cn("sidebar-link", active && "active")}>
                                    <link.icon className="w-4 h-4 flex-shrink-0" />
                                    <span>{link.label}</span>
                                    {active && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
                                </Link>
                            );
                        })}
                    </>
                )}
            </nav>

            {/* Bottom actions */}
            <div className="px-3 py-3 border-t border-[#27272A] space-y-0.5">
                <a
                    href={`/sites/${businessSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sidebar-link"
                >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Website</span>
                </a>
                <form action={logout}>
                    <button type="submit" className="sidebar-link w-full hover:text-red-400 hover:bg-red-500/8">
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export function AdminSidebar({ businessName, businessSlug, enabledTools, primaryColor }: Props) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-[#13131A] border border-[#27272A] rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                aria-label="Open menu"
            >
                <Menu className="w-4 h-4" />
            </button>

            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-[220px] min-h-screen shrink-0 border-r border-[#27272A]">
                <div className="sticky top-0 h-screen overflow-y-auto">
                    <NavContent
                        businessName={businessName}
                        businessSlug={businessSlug}
                        enabledTools={enabledTools}
                        primaryColor={primaryColor}
                    />
                </div>
            </aside>

            {/* Mobile drawer */}
            {mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden shadow-2xl">
                        <NavContent
                            businessName={businessName}
                            businessSlug={businessSlug}
                            enabledTools={enabledTools}
                            primaryColor={primaryColor}
                            onClose={() => setMobileOpen(false)}
                        />
                    </aside>
                </>
            )}
        </>
    );
}
