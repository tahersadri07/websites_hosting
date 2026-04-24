import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OrdersList } from "@/components/admin/OrdersList";
import { getAdminBusinessSlug } from "@/lib/admin-context";

export default async function OrdersPage() {
    const slug = await getAdminBusinessSlug();
    const supabase = await createClient();
    
    // Get business mapping
    const { data: business } = await (supabase as any)
        .from("businesses")
        .select("id")
        .eq("slug", slug)
        .single();

    if (!business) redirect("/admin/setup");

    // Fetch initial orders
    const { data: orders, error } = await (supabase as any)
        .from("orders")
        .select("*")
        .eq("business_id", business.id)
        .order("created_at", { ascending: false });

    // Fallback if the migration hasn't been run yet to avoid hard crash
    if (error && error.code === "42P01") {
        return (
            <div className="max-w-4xl mx-auto py-12">
                <div className="bg-red-50 text-red-500 p-6 rounded-xl border border-red-100 flex flex-col items-center text-center">
                    <h2 className="text-xl font-bold mb-2">Orders Table Missing</h2>
                    <p>The orders table has not been created yet. Please ensure you have run the latest database migrations (009_order_management.sql) in your Supabase project.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Orders</h1>
                <p className="text-zinc-400">Manage customer orders and track their delivery status.</p>
            </div>
            
            <OrdersList initialOrders={orders || []} businessId={business.id} />
        </div>
    );
}
