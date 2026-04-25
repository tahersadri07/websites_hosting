import { createServiceClient } from "./lib/supabase/server";

async function debug() {
    const db = createServiceClient();
    
    // Check memberships for a specific email (the one the user likely used)
    const email = "tahirsadri07@gmail.com"; // Let's try to find this user
    
    const { data: { users } } = await db.auth.admin.listUsers();
    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (!user) {
        console.log("User not found in Auth");
        return;
    }
    
    console.log("Found User:", user.id);
    
    const { data: memberships, error } = await db
        .from("memberships")
        .select(`
            id,
            business_id,
            role,
            businesses (
                id,
                slug,
                name
            )
        `)
        .eq("user_id", user.id);
        
    if (error) {
        console.error("Membership lookup error:", error);
    } else {
        console.log("Memberships found:", JSON.stringify(memberships, null, 2));
    }
}

debug();
