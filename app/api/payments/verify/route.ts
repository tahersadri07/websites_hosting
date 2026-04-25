import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { 
            businessId, items, details, totalAmount, 
            razorpay_order_id, razorpay_payment_id, razorpay_signature 
        } = body;

        if (!businessId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = await createClient();

        // 1. Fetch the business secret key
        const { data: business, error: bError } = await (supabase as any)
            .from("businesses")
            .select("razorpay_key_secret")
            .eq("id", businessId)
            .single();

        if (bError || !business || !business.razorpay_key_secret) {
            return NextResponse.json({ error: "Business payment configuration not found" }, { status: 400 });
        }

        // 2. Verify Signature
        const generated_signature = crypto
            .createHmac("sha256", business.razorpay_key_secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
        }

        // 3. Create the Order
        const orderNumber = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        const { error: insertError } = await (supabase as any)
            .from("orders")
            .insert({
                business_id: businessId,
                order_number: orderNumber,
                status: 'processing', // Automatically marked as processing since paid
                total_amount: totalAmount,
                items: items,
                customer_details: details,
                payment_method: 'razorpay',
                gateway_order_id: razorpay_order_id,
                gateway_payment_id: razorpay_payment_id,
                gateway_signature: razorpay_signature,
            });

        if (insertError) throw insertError;

        // CRM Integration
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                // Update the logged-in user's customer record with their latest details
                await (supabase as any)
                    .from("customers")
                    .update({
                        name: details.name,
                        phone: details.phone,
                        address: details.address || null,
                        last_contacted_at: new Date().toISOString(),
                    })
                    .eq("auth_user_id", user.id)
                    .eq("business_id", businessId);
            } else {
                // Upsert by phone for guests
                await (supabase as any)
                    .from("customers")
                    .upsert({
                        business_id: businessId,
                        name: details.name,
                        phone: details.phone,
                        address: details.address || null,
                        last_contacted_at: new Date().toISOString(),
                    }, {
                        onConflict: 'business_id,phone'
                    });
            }
        } catch (crmErr) {
            console.error("Failed to sync to CRM", crmErr);
        }

        return NextResponse.json({ success: true, orderNumber }, { status: 201 });
    } catch (err: any) {
        console.error("[POST /api/payments/verify]", err);
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
    }
}
