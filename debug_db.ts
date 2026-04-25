import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing environment variables.");
    process.exit(1);
}

const db = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data: businesses, error } = await db
        .from("businesses")
        .select("slug, name, business_tools(tool_key, is_enabled)");
        
    if (error) {
        console.error("Error fetching businesses:", error);
        return;
    }
    
    console.log("Businesses and their tools:");
    console.log(JSON.stringify(businesses, null, 2));
}

check();
