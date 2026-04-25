import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { businessId, items, details, totalAmount, paymentMethod, transactionId } = body;

        if (!businessId || !items || !details) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = await createClient();

        // Generate a random order number: ORD-XXXXXX
        const orderNumber = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Insert into orders table
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("orders")
            .insert({
                business_id: businessId,
                order_number: orderNumber,
                status: 'pending',
                total_amount: totalAmount,
                items: items,
                customer_details: details,
                payment_method: paymentMethod || 'cash',
                transaction_id: transactionId || null,
            });

        if (error) throw error;

        // CRM Integration: Automatically add/update customer
        try {
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
        } catch (crmErr) {
            console.error("Failed to sync to CRM", crmErr);
        }

        return NextResponse.json({ success: true, orderNumber }, { status: 201 });
    } catch (err) {
        console.error("[POST /api/orders]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
