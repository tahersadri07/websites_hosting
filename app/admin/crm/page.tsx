import { getAdminBusinessSlug } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/server";
import { 
    Users, Search, UserPlus, Mail, Phone, Calendar, 
    MoreHorizontal, Filter, MessageSquare, Tag,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { deleteCustomer } from "./actions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";

export default async function CRMPage() {
    const slug = await getAdminBusinessSlug();
    const supabase = await createClient();

    const { data: business } = await (supabase as any)
        .from("businesses")
        .select("id, name")
        .eq("slug", slug)
        .single();

    const { data: customers } = await (supabase as any)
        .from("customers")
        .select("*")
        .eq("business_id", business?.id)
        .order("created_at", { ascending: false });

    return (
        <div className="max-w-6xl space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Customer CRM</h2>
                    <p className="text-muted-foreground mt-1">Manage your relationships and track customer history.</p>
                </div>
                <Button className="bg-business-primary hover:bg-business-primary/90 rounded-2xl gap-2">
                    <UserPlus className="w-4 h-4" />
                    Add Customer
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: "Total Customers", value: customers?.length || 0, icon: Users, color: "blue" },
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

            {/* Search & Filter */}
            <div className="flex items-center gap-4 bg-background border rounded-2xl p-2 px-4 shadow-sm">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input 
                    placeholder="Search by name, phone, or email..." 
                    className="flex-grow bg-transparent border-none outline-none text-sm h-10"
                />
                <Button variant="ghost" size="sm" className="rounded-xl text-xs gap-2">
                    <Filter className="w-3 h-3" />
                    Filters
                </Button>
            </div>

            {/* Table */}
            <div className="bg-background border rounded-3xl overflow-hidden shadow-sm">
                {(!customers || customers.length === 0) ? (
                    <div className="py-20 text-center text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-10" />
                        <p>No customers found. Start adding your clients!</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-muted/30 border-b text-left">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Contact Info</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Added On</th>
                                <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {customers.map((customer: any) => (
                                <tr key={customer.id} className="group hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-business-primary/10 flex items-center justify-center text-business-primary font-bold">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm leading-none">{customer.name}</p>
                                                <div className="flex gap-1 mt-1">
                                                    {customer.tags?.map((tag: string) => (
                                                        <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-medium uppercase tracking-tight">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Phone className="w-3 h-3" />
                                            {customer.phone}
                                        </div>
                                        {customer.email && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Mail className="w-3 h-3" />
                                                {customer.email}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="text-[10px] bg-green-500/5 text-green-600 border-green-500/20 font-bold uppercase">
                                            Active
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-muted-foreground">
                                        {format(new Date(customer.created_at), "MMM d, yyyy")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl hover:bg-green-500/10 hover:text-green-600">
                                                <MessageSquare className="w-3.5 h-3.5" />
                                            </Button>
                                            <form action={deleteCustomer}>
                                                <input type="hidden" name="id" value={customer.id} />
                                                <Button type="submit" size="icon" variant="ghost" className="h-8 w-8 rounded-xl hover:bg-red-500/10 hover:text-red-600">
                                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                                </Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

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
