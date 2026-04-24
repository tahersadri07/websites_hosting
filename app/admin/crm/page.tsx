import { getAdminBusinessSlug } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/server";
import { 
    Users, Search, UserPlus, Mail, Phone, Calendar, 
    MoreHorizontal, Filter, MessageSquare, Tag,
    MapPin, Smartphone, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteCustomer } from "./actions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CRMList } from "@/components/admin/CRMList";

export default async function CRMPage() {
    const slug = await getAdminBusinessSlug();
    const supabase = await createClient();

    const { data: business } = await (supabase as any)
        .from("businesses")
        .select("id, name")
        .eq("slug", slug)
        .single();

    const { data: customers, error: crmError } = await (supabase as any)
        .from("customers")
        .select("*")
        .eq("business_id", business?.id)
        .order("created_at", { ascending: false });

    // Handle missing table gracefully (if migration not run yet)
    const safeCustomers = (crmError && crmError.code === "42P01") ? [] : (customers || []);

    return (
        <div className="max-w-6xl space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Customer CRM</h2>
                    <p className="text-muted-foreground mt-1">Manage your relationships and track customer history.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: "Total Customers", value: safeCustomers.length, icon: Users, color: "blue" },
                    { label: "Active This Month", value: 0, icon: Calendar, color: "green" },
                    { label: "New Leads", value: 0, icon: Star, color: "orange" },
                ].map((stat, i) => (
                    <div key={i} className="bg-background border rounded-3xl p-6 shadow-sm flex items-center gap-4">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center",
                            stat.color === "blue" ? "bg-blue-500/10 text-blue-600" :
                            stat.color === "green" ? "bg-green-500/10 text-green-600" :
                            "bg-orange-500/10 text-orange-600"
                        )}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <CRMList initialCustomers={safeCustomers} />

            {/* Migration Warning if needed */}
            {crmError && crmError.code === "42P01" && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 text-sm flex gap-3 items-center">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p>
                        <b>Action Required:</b> Please run the <code>migration_008_crm.sql</code> in your Supabase SQL editor to enable the CRM features.
                    </p>
                </div>
            )}

            {/* CRM Tip */}
            <div className="bg-blue-500/5 rounded-3xl p-6 border border-blue-500/10 flex gap-4 items-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Tag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h4 className="font-bold text-blue-600 text-sm">Grow your business with CRM</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
                        Track customer preferences and purchase history to provide personalized service. Tag your best customers as "VIP" to keep them coming back with special offers.
                    </p>
                </div>
            </div>
        </div>
    );
}

function Star({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
