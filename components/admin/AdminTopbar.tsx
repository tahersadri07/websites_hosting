"use client";

import { Bell, ChevronDown } from "lucide-react";
import { logout } from "@/app/(auth)/login/actions";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminTopbarProps {
    userEmail?: string;
    businessName?: string;
}

export function AdminTopbar({ userEmail, businessName }: AdminTopbarProps) {
    const initials = (userEmail ?? "A").charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-40 h-14 border-b border-[#27272A] bg-[#0A0A0F]/80 backdrop-blur-md flex items-center px-6 gap-4">
            {/* Spacer for mobile menu button */}
            <div className="w-8 lg:hidden" />

            <div className="flex-grow" />

            <div className="flex items-center gap-3">
                {/* Notification bell */}
                <button className="w-8 h-8 rounded-lg border border-[#27272A] flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all relative">
                    <Bell className="w-3.5 h-3.5" />
                </button>

                {/* User menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl border border-[#27272A] hover:border-zinc-600 transition-all bg-[#13131A] group">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                {initials}
                            </div>
                            <span className="text-xs text-zinc-400 group-hover:text-white transition-colors hidden sm:block max-w-[120px] truncate">
                                {userEmail ?? "Admin"}
                            </span>
                            <ChevronDown className="w-3 h-3 text-zinc-600 hidden sm:block" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-52 rounded-xl bg-[#13131A] border-[#27272A] text-white"
                    >
                        <DropdownMenuLabel className="text-xs text-zinc-500 font-normal truncate px-3 py-2">
                            {userEmail ?? "Admin"}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-[#27272A]" />
                        <DropdownMenuItem asChild className="rounded-lg mx-1 my-0.5 focus:bg-white/5 focus:text-white cursor-pointer">
                            <form action={logout} className="w-full">
                                <button type="submit" className="w-full text-left text-sm text-red-400 hover:text-red-300 py-1.5 px-2">
                                    Sign out
                                </button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
