import { createClient } from "@supabase/supabase-js";

const db = createClient(
    "https://qgxcepopufzpmdtxffzt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFneGNlcG9wdWZ6cG1kdHhmZnp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg4MDc1MywiZXhwIjoyMDkyNDU2NzUzfQ.aFtMIM0ccEKKiC8W-3PPQF_uW_PrvSXtHDH2QGZTXJA"
);

// Step 1 — Add status columns to businesses (via REST PATCH trick)
// We attempt an update with the new fields; if they don't exist Supabase will error
console.log("🔍 Checking schema...");

const { data: biz, error: e1 } = await db.from("businesses").select("status").limit(1);
const hasStatus = !e1;
console.log("  businesses.status:", hasStatus ? "EXISTS ✅" : "MISSING (add via SQL editor)");

const { data: pt, error: e2 } = await db.from("platform_tools").select("key").limit(1);
const hasPlatformTools = !e2;
console.log("  platform_tools:", hasPlatformTools ? "EXISTS ✅" : "MISSING (add via SQL editor)");

const { data: bt, error: e3 } = await db.from("business_tools").select("id").limit(1);
const hasBusinessTools = !e3;
console.log("  business_tools:", hasBusinessTools ? "EXISTS ✅" : "MISSING (add via SQL editor)");

if (!hasStatus || !hasPlatformTools || !hasBusinessTools) {
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  MANUAL STEP REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please run the SQL in the Supabase SQL Editor:
  https://supabase.com/dashboard/project/qgxcepopufzpmdtxffzt/editor

File: supabase/migrations/004_platform_tools.sql
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
    process.exit(0);
}

// Step 2 — Seed platform_tools if empty
const { count: toolCount } = await db.from("platform_tools").select("*", { count: "exact", head: true });
if (!toolCount || toolCount === 0) {
    console.log("\n🌱 Seeding platform_tools...");
    const { error } = await db.from("platform_tools").insert([
        { key: "services",     name: "Services / Products",    description: "Manage your service or product catalog",             icon: "Layers",        category: "core",       sort_order: 1 },
        { key: "gallery",      name: "Gallery",                 description: "Photo and media gallery for your website",           icon: "Image",         category: "core",       sort_order: 2 },
        { key: "testimonials", name: "Testimonials",            description: "Customer reviews and social proof",                  icon: "Star",          category: "core",       sort_order: 3 },
        { key: "inquiries",    name: "Contact Inquiries",       description: "Manage inbound contact form submissions",            icon: "MessageSquare", category: "core",       sort_order: 4 },
        { key: "crm",          name: "CRM",                     description: "Customer relationship management and pipeline",      icon: "Users",         category: "operations", sort_order: 10 },
        { key: "inventory",    name: "Inventory Management",    description: "Stock tracking, alerts, and purchase orders",        icon: "Package",       category: "operations", sort_order: 11 },
        { key: "booking",      name: "Booking & Appointments",  description: "Online scheduling and calendar management",          icon: "Calendar",      category: "operations", sort_order: 12 },
        { key: "invoicing",    name: "Invoicing & Billing",     description: "Send invoices, track payments",                     icon: "Receipt",       category: "operations", sort_order: 13 },
        { key: "analytics",    name: "Analytics Dashboard",     description: "Traffic, conversion, and revenue analytics",        icon: "BarChart3",     category: "analytics",  sort_order: 20 },
        { key: "email",        name: "Email Marketing",         description: "Campaigns, automations, and audience management",   icon: "Mail",          category: "marketing",  sort_order: 30 },
        { key: "loyalty",      name: "Loyalty Program",         description: "Points, rewards, and customer retention tools",     icon: "Gift",          category: "marketing",  sort_order: 31 },
    ]);
    console.log("  platform_tools:", error ? `ERROR: ${error.message}` : "Seeded ✅");
} else {
    console.log("\n  platform_tools already seeded:", toolCount, "tools ✅");
}

// Step 3 — Enable 4 core tools for each business
const { data: allBiz } = await db.from("businesses").select("id");
const coreTools = ["services", "gallery", "testimonials", "inquiries"];

for (const b of (allBiz ?? [])) {
    const rows = coreTools.map(k => ({ business_id: b.id, tool_key: k, is_enabled: true }));
    const { error } = await db.from("business_tools").upsert(rows, { onConflict: "business_id,tool_key" });
    if (error) console.log(`  Error seeding tools for ${b.id}:`, error.message);
}
console.log("  Core tools enabled for all businesses ✅");

console.log("\n✅ Migration complete! Re-run to verify.");
