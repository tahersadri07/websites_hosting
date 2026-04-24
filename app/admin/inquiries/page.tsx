import { getAdminBusinessSlug } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateInquiryStatus } from "./actions";

export default async function InquiriesAdminPage() {
    const slug = await getAdminBusinessSlug();
    const supabase = await createClient();

    const { data: business } = await (supabase as any)
        .from("businesses").select("id").eq("slug", slug).single();

    const { data: inquiries } = await (supabase as any)
        .from("contact_inquiries")
        .select("*")
        .eq("business_id", business?.id)
        .order("created_at", { ascending: false });

    return (
        <div className="max-w-5xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Inquiries</h2>
                <p className="text-muted-foreground text-sm">Customer messages submitted via your contact form.</p>
            </div>

            {(!inquiries || inquiries.length === 0) ? (
                <div className="bg-background border rounded-2xl p-16 text-center text-muted-foreground">
                    No inquiries yet. They'll appear here when customers contact you.
                </div>
            ) : (
                <div className="space-y-4">
                    {inquiries.map((inq: any) => (
                        <div key={inq.id} className={`bg-background border rounded-2xl p-6 transition-shadow hover:shadow-md ${inq.status === "new" ? "border-business-primary/30" : ""}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <p className="font-bold">{inq.name}</p>
                                        <Badge variant={inq.status === "new" ? "default" : "secondary"} className={inq.status === "new" ? "bg-green-500/20 text-green-700" : ""}>
                                            {inq.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground flex-wrap">
                                        {inq.phone && <span>📞 {inq.phone}</span>}
                                        {inq.email && <span>✉️ {inq.email}</span>}
                                        <span>{new Date(inq.created_at).toLocaleString("en-IN")}</span>
                                    </div>
                                </div>
                                {inq.status === "new" && (
                                    <form action={updateInquiryStatus} className="flex-shrink-0">
                                        <input type="hidden" name="id" value={inq.id} />
                                        <input type="hidden" name="status" value="replied" />
                                        <Button type="submit" size="sm" variant="outline" className="rounded-xl text-xs">
                                            Mark Replied
                                        </Button>
                                    </form>
                                )}
                            </div>
                            <p className="mt-4 text-foreground/80 text-sm leading-relaxed bg-muted/30 rounded-xl p-4">
                                {inq.message}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
