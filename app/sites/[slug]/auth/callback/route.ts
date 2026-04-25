import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? `/sites/${params.slug}/account`;

  if (code) {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && authData.session) {
        // Now ensure the customer record exists for this business
        const db = createServiceClient();
        
        // Get the business id
        const { data: business } = await db.from("businesses").select("id").eq("slug", params.slug).single();
        
        if (business) {
            try {
                // Check if customer exists
                const { data: existingCustomer, error: checkError } = await db
                    .from('customers')
                    .select('id')
                    .eq('business_id', business.id)
                    .eq('auth_user_id', authData.user.id)
                    .maybeSingle();

                if (checkError) throw checkError;

                if (!existingCustomer) {
                    // Get name from user metadata
                    const fullName = authData.user.user_metadata?.full_name || authData.user.user_metadata?.name || '';
                    
                    const { error: insertError } = await db.from('customers').insert({
                        business_id: business.id,
                        auth_user_id: authData.user.id,
                        name: fullName || 'Valued Customer',
                        email: authData.user.email,
                    });
                    
                    if (insertError) throw insertError;
                }
            } catch (err) {
                console.error("Callback: Failed to sync customer profile:", err);
            }
        }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, request.url));
}
