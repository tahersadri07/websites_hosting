import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ContactSection } from "@/components/public/ContactSection";

export default async function SiteContactPage({ params }: { params: { slug: string } }) {
    const db = createServiceClient();
    const { data: business } = await db.from("businesses").select("*").eq("slug", params.slug).single();
    if (!business) notFound();

    return (
        <div className="pt-20 min-h-screen bg-[#0A0A0F]">
            <ContactSection business={business} />
        </div>
    );
}
