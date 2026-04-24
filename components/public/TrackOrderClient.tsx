"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

interface Props {
    businessId: string;
    currencySymbol: string;
}

export function TrackOrderClient({ businessId, currencySymbol }: Props) {
    const [orderNumber, setOrderNumber] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber) return;
        setLoading(true);
        setError("");
        setOrder(null);

        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("business_id", businessId)
                .ilike("order_number", orderNumber.trim())
                .single();

            if (error || !data) {
                setError("Order not found. Please check the order number and try again.");
            } else {
                setOrder(data);
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    const statuses = [
        { id: "pending", label: "Pending", icon: Package },
        { id: "processing", label: "Processing", icon: Package },
        { id: "shipped", label: "Shipped", icon: Truck },
        { id: "delivered", label: "Delivered", icon: CheckCircle2 },
    ];

    const currentStatusIndex = statuses.findIndex(s => s.id === order?.status) || 0;

    return (
        <div className="max-w-2xl mx-auto py-12 px-6 min-h-[60vh]">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-4">Track Your Order</h1>
                <p className="text-muted-foreground">Enter your Order Number to check the current status of your delivery.</p>
            </div>

            <form onSubmit={handleTrack} className="flex gap-3 mb-10">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                        placeholder="e.g. ORD-A8F9K" 
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="h-14 pl-12 rounded-2xl bg-muted/50 border-transparent focus:bg-background"
                    />
                </div>
                <Button type="submit" disabled={!orderNumber || loading} className="h-14 px-8 rounded-2xl bg-business-primary text-white font-bold">
                    {loading ? "Tracking..." : "Track"}
                </Button>
            </form>

            {error && (
                <div className="p-4 rounded-xl bg-red-50 text-red-500 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            {order && (
                <div className="bg-muted/30 rounded-3xl p-8 border">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-1">Order Summary</p>
                            <h2 className="text-2xl font-black">{order.order_number}</h2>
                            <p className="text-sm text-muted-foreground mt-2">
                                Placed on {new Date(order.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-1">Total</p>
                            <p className="text-2xl font-black text-business-primary">{currencySymbol}{order.total_amount.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="py-8 relative">
                        {order.status === 'cancelled' ? (
                            <div className="text-center text-red-500 font-bold p-4 bg-red-50 rounded-xl border border-red-100">
                                This order has been cancelled.
                            </div>
                        ) : (
                            <div className="flex items-center justify-between relative">
                                {/* Track Line */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full" />
                                <div 
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-business-primary rounded-full transition-all duration-500" 
                                    style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                                />

                                {statuses.map((status, idx) => {
                                    const Icon = status.icon;
                                    const isActive = idx <= currentStatusIndex;
                                    const isCurrent = idx === currentStatusIndex;

                                    return (
                                        <div key={status.id} className="relative z-10 flex flex-col items-center gap-3">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                                                isActive ? "bg-business-primary text-white shadow-lg shadow-business-primary/30" : "bg-muted text-muted-foreground border-4 border-background"
                                            } ${isCurrent ? "scale-110 ring-4 ring-business-primary/20" : ""}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                                                {status.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 border-t pt-8">
                        <h3 className="font-bold mb-4">Items Ordered</h3>
                        <div className="space-y-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center bg-background p-4 rounded-xl border">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{item.title}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-sm">{currencySymbol}{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
