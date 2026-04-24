"use client";

import { useCart } from "@/context/CartContext";
import { 
    ShoppingCart, ShoppingBag, X, Plus, Minus, Send, User, MapPin, Phone, 
    Heart, ArrowRight, Trash2 
} from "lucide-react";
import { useState, useEffect } from "react";
import { 
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, 
    SheetFooter, SheetDescription 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Script from "next/script";

interface Props {
    businessId?: string;
    businessName: string;
    whatsappNumber: string | null;
    currencySymbol: string;
    upiId?: string | null;
}

export function FloatingCart({ businessId, businessName, whatsappNumber, currencySymbol, upiId }: Props) {
    const { 
        items, wishlist, itemCount, wishlistCount, totalPrice, 
        updateQuantity, removeFromCart, clearCart, 
        removeFromWishlist, addToCart,
        isDrawerOpen, setIsDrawerOpen, activeTab, setActiveTab
    } = useCart();
    
    const [step, setStep] = useState<"review" | "details" | "payment">("review");
    const [details, setDetails] = useState({ name: "", phone: "", address: "" });
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi">("cash");
    const [transactionId, setTransactionId] = useState("");
    const [loading, setLoading] = useState(false);

    // Reset step when tab changes or drawer closes
    useEffect(() => {
        if (!isDrawerOpen) setStep("review");
    }, [isDrawerOpen, activeTab]);

    const handleRazorpayCheckout = async () => {
        if (!businessId) return;
        setLoading(true);

        try {
            // 1. Create Razorpay Order
            const res = await fetch("/api/payments/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ businessId, amount: totalPrice, currency: "INR" })
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || "Failed to create order");

            // 2. Initialize Razorpay options
            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: businessName,
                description: "Order Payment",
                order_id: data.orderId,
                handler: async function (response: any) {
                    try {
                        // 3. Verify Payment and Create DB Order
                        const verifyRes = await fetch("/api/payments/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                businessId,
                                items,
                                details,
                                totalAmount: totalPrice,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            })
                        });
                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok) {
                            alert("Payment Successful! Order Number: " + verifyData.orderNumber);
                            
                            // Optional: Send WhatsApp confirmation
                            const itemsList = items.map(i => `- ${i.title} (x${i.quantity})`).join("\n");
                            const message = `*Paid Order via Razorpay*\nOrder: ${verifyData.orderNumber}\n\n*Items:*\n${itemsList}\n\n*Amount Paid:* ${currencySymbol}${totalPrice}\n\n*Customer:*\n${details.name}\n${details.phone}\n${details.address}`;
                            if (whatsappNumber) {
                                window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`, "_blank");
                            }

                            clearCart();
                            setIsDrawerOpen(false);
                        } else {
                            alert("Payment verification failed. Please contact support.");
                        }
                    } catch (err) {
                        console.error(err);
                        alert("An error occurred during verification.");
                    }
                },
                prefill: {
                    name: details.name,
                    contact: details.phone,
                },
                theme: { color: "#7c3aed" } // Using primary color theme
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp.open();

        } catch (err: any) {
            console.error(err);
            alert(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async () => {
        if (!whatsappNumber) return;
        setLoading(true);

        const itemsList = items.map(i => `- ${i.title} (x${i.quantity}) - ${currencySymbol}${(i.price || 0) * i.quantity}`).join("\n");
        let orderNumber = "";
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessId,
                    items,
                    details,
                    totalAmount: totalPrice,
                    paymentMethod,
                    transactionId
                })
            });
            const data = await res.json();
            if (data.orderNumber) {
                orderNumber = data.orderNumber;
            }
        } catch (e) { console.error(e); }

        const message = [
            `*New Order from ${businessName} website*`,
            orderNumber ? `*Order Number:* ${orderNumber}` : ``,
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
            `💳 *Payment Method:* ${paymentMethod === 'upi' ? 'Paid via UPI/GPay' : 'Cash / Pay Later'}`,
            transactionId ? `*Transaction ID:* ${transactionId}` : ``,
            ``,
            `Please confirm my order. Thank you!`,
        ].filter(Boolean).join("\n");

        const waUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, "_blank");
        clearCart();
        setIsDrawerOpen(false);
        setLoading(false);
    };

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            
            {/* Floating Toggle (Visible when items > 0) */}
            {(itemCount > 0 || wishlistCount > 0) && !isDrawerOpen && (
                <button 
                    onClick={() => setIsDrawerOpen(true)}
                    className="fixed bottom-24 right-6 z-50 group flex flex-col gap-2"
                >
                    {wishlistCount > 0 && (
                        <div className="relative">
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                {wishlistCount}
                            </div>
                            <div className="w-12 h-12 bg-white text-red-500 rounded-2xl flex items-center justify-center shadow-2xl transition-all group-hover:scale-110 border border-zinc-200">
                                <Heart className="w-5 h-5 fill-current" />
                            </div>
                        </div>
                    )}
                    {itemCount > 0 && (
                        <div className="relative">
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-business-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                                {itemCount}
                            </div>
                            <div className="w-14 h-14 bg-business-primary text-white rounded-2xl flex items-center justify-center shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-6">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                        </div>
                    )}
                </button>
            )}

            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetContent className="w-full sm:max-w-md p-0 flex flex-col border-none shadow-2xl">
                    <SheetHeader className="p-6 bg-zinc-900 text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <button 
                                onClick={() => setActiveTab("cart")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all",
                                    activeTab === "cart" ? "bg-business-primary text-white" : "bg-white/5 text-zinc-400 hover:bg-white/10"
                                )}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Cart ({itemCount})
                            </button>
                            <button 
                                onClick={() => setActiveTab("wishlist")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all",
                                    activeTab === "wishlist" ? "bg-red-500 text-white" : "bg-white/5 text-zinc-400 hover:bg-white/10"
                                )}
                            >
                                <Heart className="w-4 h-4" />
                                Wishlist ({wishlistCount})
                            </button>
                        </div>
                        <SheetTitle className="text-white text-xl">
                            {activeTab === "cart" ? (
                                step === "review" ? "Shopping Cart" : 
                                step === "details" ? "Checkout Details" : 
                                "Payment"
                            ) : "Your Wishlist"}
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-grow overflow-y-auto p-6">
                        {activeTab === "cart" ? (
                            step === "review" ? (
                                items.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                                            <ShoppingBag className="w-10 h-10 text-zinc-300" />
                                        </div>
                                        <p className="text-sm text-zinc-500">Your cart is empty.</p>
                                        <Button variant="link" onClick={() => setIsDrawerOpen(false)} className="text-business-primary mt-2">Start Shopping</Button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-4 group">
                                                <div className="relative w-20 h-20 rounded-xl overflow-hidden border bg-muted flex-shrink-0">
                                                    {item.thumbnail_url ? (
                                                        <Image src={item.thumbnail_url} alt={item.title} fill className="object-cover" unoptimized />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center opacity-20"><ShoppingBag className="w-8 h-8" /></div>
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
                                                        <button onClick={() => removeFromCart(item.id)} className="text-zinc-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : step === "details" ? (
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Full Name</Label>
                                        <Input value={details.name} onChange={(e) => setDetails({...details, name: e.target.value})} placeholder="Your Name" className="h-12 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Phone Number</Label>
                                        <Input value={details.phone} onChange={(e) => setDetails({...details, phone: e.target.value})} placeholder="+91 ..." className="h-12 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Delivery Address</Label>
                                        <Input value={details.address} onChange={(e) => setDetails({...details, address: e.target.value})} placeholder="Address" className="h-12 rounded-xl" />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-muted/50 p-4 rounded-2xl border border-border">
                                        <h4 className="font-bold mb-4">Select Payment Method</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                onClick={() => setPaymentMethod("cash")}
                                                className={cn(
                                                    "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center",
                                                    paymentMethod === "cash" ? "border-business-primary bg-business-primary/5 text-business-primary" : "border-transparent bg-background text-zinc-500 hover:bg-muted"
                                                )}
                                            >
                                                <span className="font-bold text-sm">Pay Later</span>
                                                <span className="text-[10px]">Cash or Transfer later</span>
                                            </button>
                                            
                                            <button 
                                                onClick={() => setPaymentMethod("upi")}
                                                className={cn(
                                                    "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center",
                                                    paymentMethod === "upi" ? "border-business-primary bg-business-primary/5 text-business-primary" : "border-transparent bg-background text-zinc-500 hover:bg-muted"
                                                )}
                                            >
                                                <span className="font-bold text-sm">Pay Online</span>
                                                <span className="text-[10px]">Cards, UPI, Wallets</span>
                                            </button>
                                        </div>
                                    </div>

                                    {paymentMethod === "upi" && (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                                            <div className="p-5 rounded-2xl bg-[#0A0A0F] border border-[#27272A] text-center flex flex-col items-center">
                                                <p className="text-sm text-zinc-400 mb-4">Pay securely with Credit/Debit Card, UPI, Netbanking, or Wallets.</p>
                                                
                                                <Button 
                                                    onClick={handleRazorpayCheckout}
                                                    disabled={loading}
                                                    className="inline-flex items-center justify-center w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold shadow-lg shadow-indigo-500/20 mb-2"
                                                >
                                                    {loading ? "Processing..." : `Pay ${currencySymbol}${totalPrice} Now`}
                                                </Button>
                                                <p className="text-[10px] text-zinc-500">Secured by Razorpay</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        ) : (
                            wishlist.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                                        <Heart className="w-10 h-10 text-zinc-300" />
                                    </div>
                                    <p className="text-sm text-zinc-500">Your wishlist is empty.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {wishlist.map((item) => (
                                        <div key={item.id} className="flex gap-4 group items-center">
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden border bg-muted flex-shrink-0">
                                                {item.thumbnail_url ? <Image src={item.thumbnail_url} alt={item.title} fill className="object-cover" unoptimized /> : <div className="w-full h-full flex items-center justify-center opacity-20"><ShoppingBag className="w-6 h-6" /></div>}
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-bold text-sm text-zinc-900">{item.title}</h4>
                                                <p className="text-xs text-zinc-500">{currencySymbol}{item.price?.toLocaleString()}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="h-8 w-8 rounded-lg text-zinc-400 hover:text-red-500"
                                                    onClick={() => removeFromWishlist(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    className="h-8 rounded-lg bg-business-primary text-[10px]"
                                                    onClick={() => {
                                                        addToCart({...item, quantity: 1});
                                                        removeFromWishlist(item.id);
                                                        setActiveTab("cart");
                                                    }}
                                                >
                                                    Move to Cart
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </div>

                    {activeTab === "cart" && items.length > 0 && (
                        <SheetFooter className="p-6 border-t bg-muted/20">
                            <div className="w-full space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm text-zinc-500">Total Amount</span>
                                    <span className="text-2xl font-black text-business-primary">{currencySymbol}{totalPrice.toLocaleString()}</span>
                                </div>
                                {step === "review" ? (
                                    <Button onClick={() => setStep("details")} className="w-full py-7 rounded-2xl text-base font-bold bg-zinc-900 hover:bg-zinc-800 shadow-xl">
                                        Proceed to Checkout
                                    </Button>
                                ) : step === "details" ? (
                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={() => setStep("review")} className="h-14 rounded-2xl px-6">Back</Button>
                                        <Button 
                                            disabled={!details.name || !details.phone || !details.address}
                                            onClick={() => setStep("payment")}
                                            className="flex-grow h-14 rounded-2xl text-base font-bold bg-business-primary hover:bg-business-primary/90 text-white"
                                        >
                                            Continue to Payment
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={() => setStep("details")} className="h-14 rounded-2xl px-6">Back</Button>
                                        {paymentMethod === "cash" ? (
                                            <Button 
                                                disabled={loading}
                                                onClick={handleCheckout}
                                                className="flex-grow h-14 rounded-2xl text-base font-bold bg-[#25D366] hover:bg-[#20bd5c] text-white shadow-lg shadow-[#25D366]/20"
                                            >
                                                <Send className="w-5 h-5 mr-2" />
                                                {loading ? "Ordering..." : "Confirm Pay Later"}
                                            </Button>
                                        ) : (
                                            <Button 
                                                disabled={loading}
                                                onClick={handleRazorpayCheckout}
                                                className="flex-grow h-14 rounded-2xl text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                                            >
                                                {loading ? "Processing..." : "Pay Now"}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </SheetFooter>
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
}
