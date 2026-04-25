import { getAdminBusinessSlug } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { getBusinessConfig } from "@/lib/business-config";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const slug = await getAdminBusinessSlug();
    console.log(`[AdminLayout] Derived slug: "${slug}"`);

    const { data: business, error: bizError } = await (supabase as any)
        .from("businesses")
        .select("id, name, slug, primary_color, status, business_type")
        .eq("slug", slug)
        .maybeSingle();

    if (bizError) {
        console.error("[AdminLayout] Business fetch error:", bizError);
    }
        
    if (!business) {
        console.warn(`[AdminLayout] No business found for slug: "${slug}"`);
    }
        
    const config = getBusinessConfig(business?.business_type);

    // Fetch enabled tools for this business (gracefully if table doesn't exist yet)
    let enabledTools: string[] = [];
    try {
        const { data: tools } = await (supabase as any)
            .from("business_tools")
            .select("tool_key")
            .eq("business_id", business?.id)
            .eq("is_enabled", true);
        enabledTools = (tools ?? []).map((t: any) => t.tool_key);
    } catch { /* table not yet migrated — show core tools only */ }

    // Default core tools if none configured yet
    if (enabledTools.length === 0) {
        enabledTools = ["services", "gallery", "testimonials", "inquiries"];
    }

    return (
        <div className="flex min-h-screen bg-[#0A0A0F]">
            <AdminSidebar
                businessName={business?.name ?? "Business"}
                businessSlug={business?.slug ?? slug}
                enabledTools={enabledTools}
                primaryColor={business?.primary_color ?? "#6366F1"}
                businessConfig={config}
            />
            <div className="flex flex-col flex-grow min-w-0">
                <AdminTopbar userEmail={user.email} businessName={business?.name} />
                <main className="flex-grow p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
