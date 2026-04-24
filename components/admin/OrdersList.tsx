"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Package, Clock, Truck, CheckCircle2, XCircle, MoreVertical, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Order {
    id: string;
    order_number: string;
    status: string;
    total_amount: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customer_details: any;
    payment_method: string;
    transaction_id: string | null;
    created_at: string;
}

interface Props {
    initialOrders: Order[];
    businessId: string;
}

export function OrdersList({ initialOrders, businessId }: Props) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [updating, setUpdating] = useState<string | null>(null);

    const supabase = createClient();

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        setUpdating(id);
        try {
            const { error } = await supabase
                .from("orders")
                .update({ status: newStatus })
                .eq("id", id)
                .eq("business_id", businessId);

            if (!error) {
                setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
            }
        } catch (e) {
            console.error(e);
        }
        setUpdating(null);
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = 
            o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customer_details?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customer_details?.phone?.includes(searchQuery);
        
        const matchesStatus = statusFilter === "all" || o.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "pending": return { color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Clock };
            case "processing": return { color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Package };
            case "shipped": return { color: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: Truck };
            case "delivered": return { color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: CheckCircle2 };
            case "cancelled": return { color: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle };
            default: return { color: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20", icon: Clock };
        }
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-[#13131A] p-4 rounded-2xl border border-[#27272A]">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input 
                        placeholder="Search by Order ID, Name, or Phone..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-[#0A0A0F] border-[#27272A] focus:border-indigo-500"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                    {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                                statusFilter === status 
                                    ? "bg-white text-black" 
                                    : "bg-[#0A0A0F] text-zinc-400 hover:text-white border border-[#27272A]"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-[#13131A] rounded-2xl border border-[#27272A]">
                        <Package className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                        <h3 className="text-zinc-400 font-medium">No orders found</h3>
                    </div>
                ) : (
                    filteredOrders.map(order => {
                        const StatusIcon = getStatusConfig(order.status).icon;
                        const itemsCount = order.items?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

                        return (
                            <div key={order.id} className="bg-[#13131A] rounded-2xl border border-[#27272A] p-5 flex flex-col md:flex-row gap-6 md:items-center">
                                {/* Core Info */}
                                <div className="flex-grow flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="w-14 h-14 bg-[#0A0A0F] rounded-xl flex items-center justify-center border border-[#27272A] shrink-0">
                                        <Package className="w-6 h-6 text-zinc-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-white text-lg">{order.order_number}</h3>
                                            <Badge variant="outline" className={`${getStatusConfig(order.status).color} flex items-center gap-1.5`}>
                                                <StatusIcon className="w-3 h-3" />
                                                <span className="capitalize">{order.status}</span>
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-zinc-400">
                                            {new Date(order.created_at).toLocaleString()} • {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                                        </p>
                                    </div>
                                </div>

                                {/* Customer & Amount */}
                                <div className="flex flex-col md:items-end gap-1">
                                    <p className="text-white font-medium">{order.customer_details?.name}</p>
                                    <p className="text-xs text-zinc-500">{order.customer_details?.phone}</p>
                                    <p className="text-lg font-black text-indigo-400 mt-2">₹{order.total_amount.toLocaleString()}</p>
                                    <div className="flex flex-col items-end mt-1 text-xs">
                                        <Badge variant="outline" className={cn(
                                            "mb-1",
                                            order.payment_method === 'upi' ? "border-blue-500/30 text-blue-400 bg-blue-500/5" : "border-zinc-700 text-zinc-400 bg-zinc-800"
                                        )}>
                                            {order.payment_method === 'upi' ? 'Paid via UPI' : 'Cash / Pay Later'}
                                        </Badge>
                                        {order.transaction_id && (
                                            <span className="text-[10px] text-zinc-500 font-mono">TXN: {order.transaction_id}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-2 pt-4 md:pt-0 border-t border-[#27272A] md:border-none">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="bg-[#0A0A0F] border-[#27272A] text-zinc-300 hover:text-white" disabled={updating === order.id}>
                                                {updating === order.id ? "Updating..." : "Update Status"}
                                                <ChevronDown className="w-4 h-4 ml-2" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-[#13131A] border-[#27272A] text-zinc-300">
                                            {["pending", "processing", "shipped", "delivered", "cancelled"].map(s => (
                                                <DropdownMenuItem 
                                                    key={s} 
                                                    disabled={order.status === s}
                                                    onClick={() => handleUpdateStatus(order.id, s)}
                                                    className="capitalize cursor-pointer focus:bg-[#27272A] focus:text-white"
                                                >
                                                    Mark as {s}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
