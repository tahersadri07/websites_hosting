import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
            return NextResponse.json({ error: "Auth Error", details: authError }, { status: 401 });
        }

        if (!user) {
            return NextResponse.json({ message: "No user logged in" });
        }

        // Check memberships
        const { data: memberships, error: memberError } = await supabase
            .from("memberships")
            .select("*, businesses(*)");

        // Check customers (to see if they are logged in as a customer instead)
        const { data: customerProfiles } = await supabase
            .from("customers")
            .select("*, businesses(*)");

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                metadata: user.user_metadata
            },
            memberships: memberships || [],
            membershipError: memberError,
            customerProfiles: customerProfiles || []
        });
    } catch (err: any) {
        return NextResponse.json({ error: "System Error", message: err.message }, { status: 500 });
    }
}
