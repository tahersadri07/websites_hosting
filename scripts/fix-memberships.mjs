/**
 * Fix memberships — ensure each business has its own admin users.
 * Run: node scripts/fix-memberships.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Load env
const env = readFileSync(".env.local", "utf-8");
const getEnv = (key) => env.match(new RegExp(`^${key}=(.+)$`, "m"))?.[1]?.trim();

const db = createClient(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("SUPABASE_SERVICE_ROLE_KEY")
);

async function main() {
    // 1. List all businesses
    const { data: businesses } = await db.from("businesses").select("id, name, slug").order("created_at");
    console.log("\n📦 Businesses:");
    businesses.forEach(b => console.log(`  ${b.slug.padEnd(30)} ${b.id}  "${b.name}"`));

    // 2. List memberships with user emails
    const { data: memberships } = await db.from("memberships").select("id, user_id, business_id, role");
    console.log("\n👥 Current Memberships:");
    for (const m of memberships) {
        const { data: { user } } = await db.auth.admin.getUserById(m.user_id);
        const biz = businesses.find(b => b.id === m.business_id);
        console.log(`  ${(user?.email ?? "?").padEnd(35)} → ${biz?.slug ?? "unknown"} (${m.role})`);
    }

    // 3. List businesses with NO admins
    const assignedBizIds = new Set(memberships.map(m => m.business_id));
    const orphaned = businesses.filter(b => !assignedBizIds.has(b.id));
    if (orphaned.length === 0) {
        console.log("\n✅ All businesses have at least one admin.");
    } else {
        console.log("\n⚠️  Businesses with NO admin users:");
        orphaned.forEach(b => console.log(`  • ${b.slug} — "${b.name}" (id: ${b.id})`));
        console.log('\nTo add an admin, go to: /superadmin/clients/<id> and use the "Create Admin Login" form.');
    }
}

main().catch(console.error);
