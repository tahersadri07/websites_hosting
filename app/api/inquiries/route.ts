import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { contactInquirySchema } from "@/lib/schemas";
import type { ContactInquiryInsert } from "@/types/database";

/**
 * POST /api/inquiries
 * Accepts a contact form submission and inserts it into contact_inquiries.
 * RLS allows anon inserts — no auth required.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = contactInquirySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.flatten() },
                { status: 422 }
            );
        }

        const slug = process.env.NEXT_PUBLIC_BUSINESS_SLUG;
        if (!slug) {
            return NextResponse.json(
                { error: "Business not configured" },
                { status: 500 }
            );
        }

        const supabase = await createClient();

        // Resolve business id from slug
        const { data: business } = await supabase
            .from("businesses")
            .select("id")
            .eq("slug", slug)
            .single();

        if (!business) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 });
        }

        // Cast through unknown → ContactInquiryInsert because supabase-js v2.104
        // generic resolution requires explicit typing for Insert operations.
        const bizId = (business as unknown as { id: string }).id;

        const payload: ContactInquiryInsert = {
            business_id: bizId,
            name: parsed.data.name,
            phone: parsed.data.phone,
            email: parsed.data.email || null,
            message: parsed.data.message,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("contact_inquiries")
            .insert(payload);

        if (error) throw error;

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (err) {
        console.error("[POST /api/inquiries]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
