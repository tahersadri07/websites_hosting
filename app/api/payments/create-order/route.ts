import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
    try {
        const { businessId, amount, currency = "INR" } = await request.json();

        if (!businessId || !amount) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = await createClient();

        // Fetch business razorpay keys
        const { data: business, error } = await (supabase as any)
            .from("businesses")
            .select("razorpay_key_id, razorpay_key_secret")
            .eq("id", businessId)
            .single();

        if (error || !business || !business.razorpay_key_id || !business.razorpay_key_secret) {
            return NextResponse.json({ error: "Payment Gateway not configured for this business." }, { status: 400 });
        }

        // Initialize Razorpay
        const razorpay = new Razorpay({
            key_id: business.razorpay_key_id,
            key_secret: business.razorpay_key_secret,
        });

        // Create Razorpay Order (amount is in smallest currency unit, e.g., paise)
        const options = {
            amount: Math.round(amount * 100), // convert to paise
            currency,
            receipt: `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return NextResponse.json({ error: "Failed to create Razorpay order" }, { status: 500 });
        }

        return NextResponse.json({ 
            orderId: order.id, 
            amount: order.amount, 
            currency: order.currency,
            keyId: business.razorpay_key_id // Need to send to frontend to initialize checkout
        }, { status: 200 });

    } catch (err: any) {
        console.error("[POST /api/payments/create-order]", err);
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
    }
}
