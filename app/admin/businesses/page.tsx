import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Building2, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { switchBusiness } from "./actions";
import { getAdminBusinessSlug } from "@/lib/admin-context";

export default async function BusinessesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const activeSLug = await getAdminBusinessSlug();

    // Get all businesses this user is a member of
    const { data: memberships } = await (supabase as any)
        .from("memberships")
        .select("role, businesses(*)")
        .eq("user_id", user.id);

    const businesses = (memberships ?? []).map((m: any) => ({
        ...m.businesses,
        role: m.role,
    }));

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">My Businesses</h2>
                    <p className="text-muted-foreground text-sm">
                        Switch context or create a new business to manage.
                    </p>
                </div>
                <Link href="/admin/businesses/new">
                    <Button className="bg-business-primary hover:bg-business-primary/90 rounded-xl">
                        <Plus className="w-4 h-4 mr-2" /> New Business
                    </Button>
                </Link>
            </div>

            {businesses.length === 0 ? (
                <div className="bg-background border rounded-2xl p-16 text-center text-muted-foreground">
                    <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No businesses yet. Create your first one!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {businesses.map((b: any) => {
                        const isActive = b.slug === activeSLug;
                        return (
                            <div
                                key={b.id}
                                className={`bg-background border rounded-2xl p-6 flex items-center justify-between gap-4 transition-shadow hover:shadow-md
                                    ${isActive ? "border-business-primary/50 shadow-sm" : ""}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0"
                                        style={{ background: b.primary_color ?? "#7C3AED" }}
                                    >
                                        {b.name?.charAt(0) ?? "B"}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold">{b.name}</p>
                                            {isActive && (
                                                <CheckCircle2 className="w-4 h-4 text-business-primary" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{b.slug}</code>
                                            <Badge variant="secondary" className="text-xs capitalize">{b.role}</Badge>
                                            <Badge variant="outline" className="text-xs capitalize">{b.business_type ?? "service"}</Badge>
                                        </div>
                                    </div>
                                </div>

                                {isActive ? (
                                    <span className="text-xs text-business-primary font-semibold flex items-center gap-1">
                                        Active <ChevronRight className="w-3 h-3" />
                                    </span>
                                ) : (
                                    <form action={switchBusiness}>
                                        <input type="hidden" name="slug" value={b.slug} />
                                        <Button type="submit" size="sm" variant="outline" className="rounded-xl text-xs">
                                            Switch
                                        </Button>
                                    </form>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
