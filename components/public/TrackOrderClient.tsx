"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

interface Props {
    businessId: string;
    currencySymbol: string;
    template?: any;
}

export function TrackOrderClient({ businessId, currencySymbol, template }: Props) {
    const colors = template?.colors || { bg: "#FFFFFF", text: "#000000", border: "#E5E7EB", primary: "#6366F1", textMuted: "#6B7280", surface: "#F9FAFB" };

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
        <div style={{ backgroundColor: colors.bg, color: colors.text }} className="pt-32 pb-24 min-h-screen">
            <div className="max-w-2xl mx-auto px-6">
                <div className="text-center mb-10">
                    <h1 style={{ fontFamily: `'${template?.fonts?.heading}', serif` }} className="text-4xl font-bold mb-4 tracking-tight">Track Your Order</h1>
                    <p style={{ color: colors.textMuted }} className="text-sm">Enter your Order Number to check the current status of your delivery.</p>
                </div>

                <form onSubmit={handleTrack} className="flex gap-3 mb-10">
                    <div className="relative flex-grow">
                        <Search style={{ color: colors.textMuted }} className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                        <input 
                            placeholder="e.g. ORD-A8F9K" 
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            style={{ background: colors.surface, borderColor: colors.border, color: colors.text, borderRadius: template?.style.heroRadius === 'rounded-none' ? '0' : '12px' }}
                            className="w-full h-14 pl-12 border outline-none focus:opacity-80 transition-all text-sm"
                        />
                    </div>
                    <button type="submit" disabled={!orderNumber || loading}
                        style={{ backgroundColor: colors.primary, borderRadius: template?.style.heroRadius === 'rounded-none' ? '0' : '12px' }}
                        className="h-14 px-10 text-white font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all shadow-md disabled:opacity-50"
                    >
                        {loading ? "Tracking..." : "Track"}
                    </button>
                </form>

            {error && (
                <div className="p-4 rounded-xl bg-red-50 text-red-500 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            {order && (
                <div style={{ backgroundColor: colors.surface, borderColor: colors.border, borderRadius: template?.style.cardRadius === 'rounded-none' ? '0' : '24px' }} className="p-8 border shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                        <div>
                            <p style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase tracking-widest mb-1">Order Summary</p>
                            <h2 style={{ color: colors.text, fontFamily: `'${template?.fonts?.heading}', serif` }} className="text-2xl font-bold">{order.order_number}</h2>
                            <p style={{ color: colors.textMuted }} className="text-xs mt-1">
                                Placed on {new Date(order.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="sm:text-right">
                            <p style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase tracking-widest mb-1">Total Amount</p>
                            <p style={{ color: colors.primary }} className="text-2xl font-bold">{currencySymbol}{order.total_amount.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="py-10 relative">
                        {order.status === 'cancelled' ? (
                            <div className="text-center text-red-500 font-bold p-6 bg-red-500/5 rounded-xl border border-red-500/20">
                                This order has been cancelled.
                            </div>
                        ) : (
                            <div className="flex items-center justify-between relative px-2">
                                {/* Track Line */}
                                <div style={{ backgroundColor: colors.border }} className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5" />
                                <div 
                                    className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 transition-all duration-700" 
                                    style={{ 
                                        backgroundColor: colors.primary,
                                        width: `calc(${(currentStatusIndex / (statuses.length - 1)) * 100}% - 48px)` 
                                    }}
                                />

                                {statuses.map((status, idx) => {
                                    const Icon = status.icon;
                                    const isActive = idx <= currentStatusIndex;
                                    const isCurrent = idx === currentStatusIndex;

                                    return (
                                        <div key={status.id} className="relative z-10 flex flex-col items-center gap-3">
                                            <div 
                                                style={{ 
                                                    backgroundColor: isActive ? colors.primary : colors.surface,
                                                    borderColor: isActive ? colors.primary : colors.border,
                                                    color: isActive ? '#FFFFFF' : colors.textMuted
                                                }}
                                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                                                    isCurrent ? "scale-110 shadow-lg" : ""
                                                }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span style={{ color: isActive ? colors.text : colors.textMuted }} className="text-[10px] font-bold uppercase tracking-wider">
                                                {status.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div style={{ borderColor: colors.border }} className="mt-8 border-t pt-8">
                        <h3 style={{ color: colors.text }} className="font-bold text-sm uppercase tracking-widest mb-6 text-center">Items Ordered</h3>
                        <div className="space-y-3">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} style={{ backgroundColor: colors.bg, borderColor: colors.border, borderRadius: template?.style.cardRadius === 'rounded-none' ? '0' : '12px' }} className="flex justify-between items-center p-4 border">
                                    <div className="flex items-center gap-4">
                                        <div style={{ backgroundColor: colors.surface, color: colors.textMuted }} className="w-10 h-10 rounded flex items-center justify-center">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p style={{ color: colors.text }} className="font-bold text-sm">{item.title}</p>
                                            <p style={{ color: colors.textMuted }} className="text-xs">Quantity: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p style={{ color: colors.text }} className="font-bold text-sm">{currencySymbol}{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
    );
}
