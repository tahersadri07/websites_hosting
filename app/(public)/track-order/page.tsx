import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { TrackOrderClient } from "@/components/public/TrackOrderClient";

export default async function TrackOrderPage() {
    const slug = process.env.NEXT_PUBLIC_BUSINESS_SLUG;
    if (!slug) notFound();

    const db = createServiceClient();
    const { data: business } = await db.from("businesses").select("*").eq("slug", slug).single();

    if (!business) notFound();

    return (
        <TrackOrderClient 
            businessId={business.id} 
            currencySymbol={(business as any).currency_symbol ?? "₹"} 
        />
    );
}
