import { createClient } from "@/lib/supabase/server";
import { ServicesGrid } from "@/components/public/ServicesGrid";
import { notFound } from "next/navigation";

export default async function ServicesPage() {
    const slug = process.env.NEXT_PUBLIC_BUSINESS_SLUG;
    if (!slug) return notFound();

    const supabase = await createClient();
    const { data: services } = await (supabase as any)
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

    return (
        <div className="pt-24 min-h-screen">
            <div className="container mx-auto px-4 pt-12 text-center mb-0">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Services</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Explore our full range of premium services designed to cater to your every need.
                </p>
            </div>
            <ServicesGrid services={services || []} />
        </div>
    );
}
