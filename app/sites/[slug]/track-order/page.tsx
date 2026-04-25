import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { TrackOrderClient } from "@/components/public/TrackOrderClient";
import { getTemplate } from "@/lib/templates";

interface Props {
    params: { slug: string };
}

export default async function TrackOrderPage({ params }: Props) {
    const { slug } = params;
    const db = createServiceClient();
    const { data: business } = await db.from("businesses").select("*").eq("slug", slug).single();

    if (!business) notFound();
    const template = getTemplate(business.template);

    return (
        <TrackOrderClient 
            businessId={business.id} 
            currencySymbol={(business as any).currency_symbol ?? "₹"} 
            template={template}
        />
    );
}
