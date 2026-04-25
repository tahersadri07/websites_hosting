import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { getTemplate } from "@/lib/templates";
import { LogOut, Package, User as UserIcon, MapPin, Calendar, Phone } from "lucide-react";
import Link from "next/link";

export default async function CustomerAccountPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const db = createServiceClient();
    
    // Check if customer_login tool is enabled and get business info
    const { data: business } = await db
        .from("businesses")
        .select("*, business_tools(tool_key, is_enabled)")
        .eq("slug", params.slug)
        .single();
        
    if (!business) notFound();

    let validCustomerUser = null;
    if (user) {
        const { data: existingCustomer } = await db
            .from("customers")
            .select("id")
            .eq("business_id", business.id)
            .eq("auth_user_id", user.id)
            .single();
        if (existingCustomer) {
            validCustomerUser = user;
        }
    }

    if (!validCustomerUser) {
        redirect(`/sites/${params.slug}/login`);
    }
    
    const customerLoginEnabled = business.business_tools?.some((t: any) => t.tool_key === 'customer_login' && t.is_enabled) ?? false;
    if (!customerLoginEnabled) notFound();

    const template = getTemplate(business.template);
    const colors = template.colors;

    // Fetch customer details
    const { data: customer } = await db
        .from("customers")
        .select("*")
        .eq("business_id", business.id)
        .eq("auth_user_id", user.id)
        .single();

    const customerName = customer?.name || user.user_metadata?.full_name || "Valued Customer";
    const customerEmail = customer?.email || user.email;
    const customerPhone = customer?.phone || user.user_metadata?.phone || "";

    // Fetch customer's orders based on their phone number (from customer_details JSONB)
    let orders: any[] = [];
    if (customerPhone) {
        const { data } = await db
            .from("orders")
            .select("*")
            .eq("business_id", business.id)
            .filter("customer_details->>phone", "eq", customerPhone)
            .order("created_at", { ascending: false });
        
        if (data) orders = data;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'processing': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        }
    };

    return (
        <div style={{ background: colors.bg, minHeight: 'calc(100vh - 76px)' }} className="pt-32 pb-20 px-6">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 style={{ color: colors.text, fontFamily: template.fonts.heading }} className="text-3xl font-bold">
                            My Account
                        </h1>
                        <p style={{ color: colors.textMuted }} className="mt-1">
                            Welcome back, {customerName}
                        </p>
                    </div>
                    
                    <form action="/auth/signout" method="post">
                        <Link 
                            href={`/sites/${params.slug}/logout`}
                            style={{ 
                                color: colors.text, 
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                                borderRadius: template.style.heroRadius === 'rounded-none' ? '0' : '8px' 
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 border text-sm font-medium hover:opacity-80 transition-opacity"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Link>
                    </form>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Summary Card */}
                    <div 
                        style={{ backgroundColor: colors.surface, borderColor: colors.border, borderRadius: template.style.cardRadius }} 
                        className="lg:col-span-1 border shadow-sm p-6 space-y-6 h-fit"
                    >
                        <div className="flex items-center gap-4">
                            <div style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }} className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold uppercase">
                                {customerName.charAt(0)}
                            </div>
                            <div>
                                <h3 style={{ color: colors.text }} className="font-semibold">{customerName}</h3>
                                <p style={{ color: colors.textMuted }} className="text-xs">{customerEmail}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t" style={{ borderColor: colors.border }}>
                            <div className="flex items-center gap-3">
                                <Phone style={{ color: colors.textMuted }} className="w-4 h-4" />
                                <span style={{ color: colors.text }} className="text-sm">{customerPhone || "No phone added"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin style={{ color: colors.textMuted }} className="w-4 h-4" />
                                <span style={{ color: colors.text }} className="text-sm">{customer?.address || "No address added"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar style={{ color: colors.textMuted }} className="w-4 h-4" />
                                <span style={{ color: colors.text }} className="text-sm">Member since {new Date(customer?.created_at || user.created_at).getFullYear()}</span>
                            </div>
                        </div>

                        <button 
                            style={{ color: colors.primary }} 
                            className="text-sm font-medium hover:underline w-full text-left pt-2"
                        >
                            Edit Profile
                        </button>
                    </div>

                    {/* Main Content Area (Orders, etc.) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div 
                            style={{ backgroundColor: colors.surface, borderColor: colors.border, borderRadius: template.style.cardRadius }} 
                            className="border shadow-sm p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 style={{ color: colors.text, fontFamily: template.fonts.heading }} className="text-xl font-bold flex items-center gap-2">
                                    <Package className="w-5 h-5" style={{ color: colors.primary }} />
                                    Recent Orders
                                </h2>
                            </div>

                            {orders.length === 0 ? (
                                <div style={{ backgroundColor: colors.bg, borderColor: colors.border }} className="rounded-xl border p-8 text-center">
                                    <Package style={{ color: colors.textMuted }} className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <h3 style={{ color: colors.text }} className="font-medium mb-1">No orders yet</h3>
                                    <p style={{ color: colors.textMuted }} className="text-sm max-w-sm mx-auto mb-4">
                                        When you place an order with {business.name}, it will appear here.
                                    </p>
                                    <Link 
                                        href={`/sites/${params.slug}`}
                                        style={{ backgroundColor: colors.primary, borderRadius: template.style.heroRadius === 'rounded-none' ? '0' : '8px' }}
                                        className="inline-block px-5 py-2.5 text-sm text-white font-medium hover:opacity-90 transition-opacity"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.id} style={{ borderColor: colors.border, backgroundColor: colors.bg }} className="border rounded-xl p-5 hover:shadow-md transition-shadow">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span style={{ color: colors.text }} className="font-bold text-lg">{order.order_number}</span>
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p style={{ color: colors.textMuted }} className="text-xs">
                                                        {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <p style={{ color: colors.textMuted }} className="text-xs uppercase tracking-wider font-semibold mb-1">Total</p>
                                                    <p style={{ color: colors.primary }} className="font-bold text-lg">
                                                        {(business as any).currency_symbol || '₹'}{Number(order.total_amount).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div style={{ borderColor: colors.border }} className="border-t pt-4">
                                                <p style={{ color: colors.textMuted }} className="text-xs uppercase tracking-wider font-semibold mb-3">Items</p>
                                                <div className="space-y-2">
                                                    {(order.items as any[])?.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm">
                                                            <div className="flex items-center gap-3">
                                                                <span style={{ color: colors.textMuted }} className="font-medium">{item.quantity}x</span>
                                                                <span style={{ color: colors.text }}>{item.title}</span>
                                                            </div>
                                                            <span style={{ color: colors.textMuted }}>
                                                                {(business as any).currency_symbol || '₹'}{(item.price * item.quantity).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
