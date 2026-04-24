import { getAdminBusinessSlug } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteService, toggleServiceActive } from "./actions";
import { formatCurrency } from "@/lib/utils";
import { ShareServiceButton } from "@/components/admin/ShareServiceButton";

export default async function ServicesAdminPage() {
    const slug = await getAdminBusinessSlug();
    const supabase = await createClient();

    const { data: business } = await (supabase as any)
        .from("businesses").select("id, slug, marketing_whatsapp_template, marketing_insta_post_template, marketing_insta_story_template").eq("slug", slug).single();

    const { data: services } = await (supabase as any)
        .from("services")
        .select("*")
        .eq("business_id", business?.id)
        .order("sort_order");

    const siteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/sites/${slug}`;

    return (
        <div className="max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Services</h2>
                    <p className="text-muted-foreground text-sm">Manage all your service offerings.</p>
                </div>
                <Link href="/admin/services/new">
                    <Button className="bg-business-primary hover:bg-business-primary/90 rounded-xl">
                        <Plus className="w-4 h-4 mr-2" /> Add Service
                    </Button>
                </Link>
            </div>

            {(!services || services.length === 0) ? (
                <div className="bg-background border rounded-2xl p-16 text-center text-muted-foreground">
                    <Scissors className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No services yet. Add your first one!</p>
                </div>
            ) : (
                <div className="rounded-2xl border overflow-hidden bg-background">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Title</th>
                                <th className="px-6 py-4 font-semibold hidden md:table-cell">Price</th>
                                <th className="px-6 py-4 font-semibold hidden md:table-cell">Duration</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {services.map((svc: any) => (
                                <tr key={svc.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 font-medium">{svc.title}</td>
                                    <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                                        {svc.price ? formatCurrency(svc.price) : "—"}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                                        {svc.duration_minutes ? `${svc.duration_minutes} mins` : "—"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <form action={toggleServiceActive}>
                                            <input type="hidden" name="id" value={svc.id} />
                                            <input type="hidden" name="is_active" value={String(svc.is_active)} />
                                            <button type="submit" title="Toggle Active">
                                                {svc.is_active ? (
                                                    <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30 cursor-pointer">Active</Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="cursor-pointer">Inactive</Badge>
                                                )}
                                            </button>
                                        </form>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end space-x-2">
                                            <ShareServiceButton product={svc} business={business} siteUrl={siteUrl} />
                                            <Link href={`/admin/services/${svc.id}/edit`}>
                                                <Button size="sm" variant="outline" className="rounded-lg h-8 w-8 p-0">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Button>
                                            </Link>
                                            <form action={deleteService}>
                                                <input type="hidden" name="id" value={svc.id} />
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    variant="outline"
                                                    className="rounded-lg h-8 w-8 p-0 hover:border-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// Local import for missing icon
function Scissors({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
        </svg>
    );
}
