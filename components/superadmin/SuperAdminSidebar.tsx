"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Wrench, BarChart3, Settings, Shield, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutSuperAdmin } from "@/app/superadmin/actions";

const navItems = [
    { href: "/superadmin",           label: "Dashboard",   icon: LayoutDashboard, exact: true },
    { href: "/superadmin/clients",   label: "Clients",     icon: Building2 },
    { href: "/superadmin/tools",     label: "Tools",       icon: Wrench },
    { href: "/superadmin/analytics", label: "Analytics",   icon: BarChart3 },
    { href: "/superadmin/settings",  label: "Settings",    icon: Settings },
];

export function SuperAdminSidebar() {
    const pathname = usePathname();
    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    return (
        <aside className="hidden lg:flex flex-col w-[220px] min-h-screen shrink-0 border-r border-[#27272A] bg-[#0A0A0F]">
            {/* Logo */}
            <div className="px-5 py-6 border-b border-[#27272A]">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white tracking-tight">SuperAdmin</p>
                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Dev Console</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-grow px-3 py-4 space-y-0.5">
                {navItems.map((item) => {
                    const active = isActive(item.href, item.exact);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "sidebar-link group",
                                active && "active"
                            )}
                        >
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-grow text-sm">{item.label}</span>
                            {active && <ChevronRight className="w-3 h-3 opacity-60" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-4 border-t border-[#27272A]">
                <form action={logoutSuperAdmin}>
                    <button
                        type="submit"
                        className="sidebar-link w-full hover:text-red-400 hover:bg-red-500/8"
                    >
                        <LogOut className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">Sign Out</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}
