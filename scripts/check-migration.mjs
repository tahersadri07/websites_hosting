import { createClient } from "@supabase/supabase-js";

const db = createClient(
    "https://qgxcepopufzpmdtxffzt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFneGNlcG9wdWZ6cG1kdHhmZnp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg4MDc1MywiZXhwIjoyMDkyNDU2NzUzfQ.aFtMIM0ccEKKiC8W-3PPQF_uW_PrvSXtHDH2QGZTXJA"
);

// Check existing state
const { data: biz, error: bizErr } = await db.from("businesses").select("status").limit(1);
console.log("status column:", bizErr?.message?.includes("status") ? "MISSING – run SQL in Supabase dashboard" : "EXISTS ✅");

const { data: tools, error: toolsErr } = await db.from("platform_tools").select("key").limit(1);
console.log("platform_tools table:", toolsErr ? "MISSING – run SQL in Supabase dashboard" : "EXISTS ✅");

const { data: bt, error: btErr } = await db.from("business_tools").select("id").limit(1);
console.log("business_tools table:", btErr ? "MISSING – run SQL in Supabase dashboard" : "EXISTS ✅");

if (bizErr || toolsErr || btErr) {
    console.log("\n⚠️  Please run the SQL in:\n   supabase/migrations/004_platform_tools.sql\n   in your Supabase SQL Editor → then re-run this script.\n");
} else {
    // Seed tools if empty
    const { count } = await db.from("platform_tools").select("*", { count: "exact", head: true });
    if (!count || count === 0) {
        const tools = [
            { key: "services",     name: "Services / Products",    description: "Manage your service or product catalog",             icon: "Layers",        category: "core",       sort_order: 1 },
            { key: "gallery",      name: "Gallery",                 description: "Photo and media gallery for your website",           icon: "Image",         category: "core",       sort_order: 2 },
            { key: "testimonials", name: "Testimonials",            description: "Customer reviews and social proof",                  icon: "Star",          category: "core",       sort_order: 3 },
            { key: "inquiries",    name: "Contact Inquiries",       description: "Manage inbound contact form submissions",            icon: "MessageSquare", category: "core",       sort_order: 4 },
            { key: "crm",          name: "CRM",                     description: "Customer relationship management and pipeline",      icon: "Users",         category: "operations", sort_order: 10 },
            { key: "inventory",    name: "Inventory Management",    description: "Stock tracking, alerts, and purchase orders",        icon: "Package",       category: "operations", sort_order: 11 },
            { key: "booking",      name: "Booking & Appointments",  description: "Online scheduling and calendar management",          icon: "Calendar",      category: "operations", sort_order: 12 },
            { key: "invoicing",    name: "Invoicing & Billing",     description: "Send invoices, track payments, manage subs",        icon: "Receipt",       category: "operations", sort_order: 13 },
            { key: "analytics",    name: "Analytics Dashboard",     description: "Traffic, conversion, and revenue analytics",        icon: "BarChart3",     category: "analytics",  sort_order: 20 },
            { key: "email",        name: "Email Marketing",         description: "Campaigns, automations, and audience management",   icon: "Mail",          category: "marketing",  sort_order: 30 },
            { key: "loyalty",      name: "Loyalty Program",         description: "Points, rewards, and customer retention tools",     icon: "Gift",          category: "marketing",  sort_order: 31 },
        ];
        const { error } = await db.from("platform_tools").insert(tools);
        console.log("Seeded tools:", error ? error.message : "✅ Done");
    } else {
        console.log("Tools already seeded:", count, "tools ✅");
    }
}
