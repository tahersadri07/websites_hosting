import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ContactSection } from "@/components/public/ContactSection";
import { getTemplate } from "@/lib/templates";

export default async function SiteContactPage({ params }: { params: { slug: string } }) {
    const db = createServiceClient();
    const { data: business } = await db.from("businesses").select("*").eq("slug", params.slug).single();
    if (!business) notFound();

    const template = getTemplate(business.template);

    return (
        <div style={{ background: template.colors.bg }} className="pt-20 min-h-screen">
            <ContactSection business={business} template={template} />
        </div>
    );
}
