"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart, ShoppingBag, X, Plus, Minus, Send, User, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { 
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, 
    SheetFooter, SheetDescription 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

interface Props {
    businessName: string;
    whatsappNumber: string | null;
    currencySymbol: string;
}

export function FloatingCart({ businessName, whatsappNumber, currencySymbol }: Props) {
    const { items, itemCount, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
    const [step, setStep] = useState<"review" | "details">("review");
    const [details, setDetails] = useState({ name: "", phone: "", address: "" });
    const [loading, setLoading] = useState(false);

    if (itemCount === 0) return null;

    const handleCheckout = async () => {
        if (!whatsappNumber) return;
        setLoading(true);

        // 1. Build WhatsApp Message
        const itemsList = items.map(i => `- ${i.title} (x${i.quantity}) - ${currencySymbol}${(i.price || 0) * i.quantity}`).join("\n");
        const message = [
            `*New Order from ${businessName} website*`,
            ``,
            `🛒 *Order Summary:*`,
            itemsList,
            `---`,
            `💰 *Total: ${currencySymbol}${totalPrice.toLocaleString()}*`,
            ``,
            `👤 *Customer Details:*`,
            `Name: ${details.name}`,
            `Phone: ${details.phone}`,
            `Address: ${details.address}`,
            ``,
            `Please confirm my order. Thank you!`,
        ].join("\n");

        // 2. Sync with CRM (Internal API call)
        try {
            await fetch("/api/inquiries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: details.name,
                    phone: details.phone,
                    email: "",
                    message: `[CART ORDER] \n${itemsList} \n\nAddress: ${details.address}`,
                })
            });
        } catch (e) {
            console.error("CRM sync failed", e);
        }

        // 3. Open WhatsApp
        const waUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, "_blank");
        
        setLoading(false);
        // Optional: clearCart();
    };

    return (
        <Sheet onOpenChange={(open) => !open && setStep("review")}>
            <SheetTrigger asChild>
                <button className="fixed bottom-24 right-6 z-50 group">
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                        {itemCount}
                    </div>
                    <div className="w-14 h-14 bg-business-primary text-white rounded-2xl flex items-center justify-center shadow-2xl transition-all group-hover:scale-110 active:scale-95 group-hover:rotate-6">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md p-0 flex flex-col border-none shadow-2xl">
                <SheetHeader className="p-6 bg-business-primary text-white">
                    <SheetTitle className="text-white flex items-center gap-3">
                        <ShoppingCart className="w-5 h-5" />
                        {step === "review" ? "Your Shopping Cart" : "Checkout Details"}
                    </SheetTitle>
                    <SheetDescription className="text-white/70">
                        {step === "review" ? `You have ${itemCount} items in your bag.` : "Please provide your info to complete the order."}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-grow overflow-y-auto p-6">
                    {step === "review" ? (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 group">
                                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border bg-muted flex-shrink-0">
                                        {item.thumbnail_url ? (
                                            <Image src={item.thumbnail_url} alt={item.title} fill className="object-cover" unoptimized />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-20">
                                                <ShoppingBag className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between py-1">
                                        <div>
                                            <h4 className="font-bold text-sm leading-tight text-zinc-900">{item.title}</h4>
                                            <p className="text-xs text-zinc-500 mt-1">{currencySymbol}{item.price?.toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 bg-zinc-100 rounded-lg p-1">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center hover:text-business-primary"><Minus className="w-3 h-3" /></button>
                                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center hover:text-business-primary"><Plus className="w-3 h-3" /></button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-red-500 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-5 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <User className="w-3.5 h-3.5 text-zinc-400" /> Full Name
                                </Label>
                                <Input 
                                    id="name" 
                                    placeholder="Enter your name" 
                                    className="h-12 rounded-xl"
                                    value={details.name}
                                    onChange={(e) => setDetails({...details, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-zinc-400" /> Phone Number
                                </Label>
                                <Input 
                                    id="phone" 
                                    placeholder="e.g. +91 98765 43210" 
                                    className="h-12 rounded-xl"
                                    value={details.phone}
                                    onChange={(e) => setDetails({...details, phone: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address" className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-zinc-400" /> Delivery Address
                                </Label>
                                <Input 
                                    id="address" 
                                    placeholder="House No, Area, City" 
                                    className="h-12 rounded-xl"
                                    value={details.address}
                                    onChange={(e) => setDetails({...details, address: e.target.value})}
                                />
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mt-8">
                                <p className="text-[11px] text-blue-700 leading-relaxed">
                                    <b>Note:</b> Your order details will be sent via WhatsApp. The business owner will contact you on this number for payment and confirmation.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <SheetFooter className="p-6 border-t bg-muted/20">
                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-sm text-zinc-500">Estimated Total</span>
                            <span className="text-2xl font-black text-business-primary">{currencySymbol}{totalPrice.toLocaleString()}</span>
                        </div>
                        {step === "review" ? (
                            <Button onClick={() => setStep("details")} className="w-full py-7 rounded-2xl text-base font-bold bg-zinc-900 hover:bg-zinc-800 shadow-xl">
                                Checkout Now
                            </Button>
                        ) : (
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setStep("review")} className="h-14 rounded-2xl px-6">
                                    Back
                                </Button>
                                <Button 
                                    disabled={!details.name || !details.phone || !details.address || loading}
                                    onClick={handleCheckout}
                                    className="flex-grow h-14 rounded-2xl text-base font-bold bg-[#25D366] hover:bg-[#20bd5c] text-white shadow-lg shadow-[#25D366]/20"
                                >
                                    <Send className="w-5 h-5 mr-2" />
                                    {loading ? "Processing..." : "Send via WhatsApp"}
                                </Button>
                            </div>
                        )}
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
