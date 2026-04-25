import { createServiceClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { getTemplate } from "@/lib/templates";
import { SignupForm } from "@/components/public/auth/SignupForm";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage({ params, searchParams }: { params: { slug: string }, searchParams: { checkout?: string } }) {
    const db = createServiceClient();
    
    // Check if customer_login tool is enabled
    const { data: business } = await db
        .from("businesses")
        .select("*, business_tools(tool_key, is_enabled)")
        .eq("slug", params.slug)
        .single();
        
    if (!business) notFound();
    
    const customerLoginEnabled = business.business_tools?.some((t: any) => t.tool_key === 'customer_login' && t.is_enabled) ?? false;
    if (!customerLoginEnabled) notFound();

    const template = getTemplate(business.template);

    const nextUrl = searchParams.checkout === 'true' 
        ? `/sites/${params.slug}?checkout=true` 
        : `/sites/${params.slug}/account`;

    // If user is already a customer of this store, redirect to nextUrl
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: existingCustomer } = await db
            .from("customers")
            .select("id")
            .eq("business_id", business.id)
            .eq("auth_user_id", user.id)
            .single();
        if (existingCustomer) {
            redirect(nextUrl);
        }
    }

    return (
        <div style={{ background: template.colors.bg }} className="pt-24 min-h-screen flex items-center justify-center p-6">
            <SignupForm business={business} template={template} slug={params.slug} nextUrl={nextUrl} />
        </div>
    );
}
