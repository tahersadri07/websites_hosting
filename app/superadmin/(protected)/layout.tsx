import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SuperAdminSidebar } from "@/components/superadmin/SuperAdminSidebar";

async function verifySuperAdmin() {
    const cookieStore = await cookies();
    // Must match the cookie name set by loginSuperAdmin() in actions.ts
    const token = cookieStore.get("superadmin_token")?.value;
    const expected = process.env.SUPERADMIN_SECRET;
    if (!expected || token !== expected) redirect("/superadmin/login");
}

export default async function SuperAdminProtectedLayout({ children }: { children: React.ReactNode }) {
    await verifySuperAdmin();

    return (
        <div className="flex min-h-screen bg-[#0A0A0F]">
            <SuperAdminSidebar />
            <div className="flex flex-col flex-grow min-w-0">
                <header className="sticky top-0 z-40 h-14 border-b border-[#27272A] bg-[#0A0A0F]/80 backdrop-blur-md flex items-center px-6 gap-4">
                    <div className="flex-grow" />
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-zinc-500 font-mono">Platform Live</span>
                    </div>
                    <div className="h-4 w-px bg-zinc-800" />
                    <span className="text-xs text-zinc-500 font-mono">
                        {process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "localhost:3000"}
                    </span>
                </header>
                <main className="flex-grow p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
