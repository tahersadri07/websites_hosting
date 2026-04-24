import { getAdminBusinessSlug } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { deleteTestimonial, toggleTestimonialPublished } from "./actions";

export default async function TestimonialsAdminPage() {
    const slug = await getAdminBusinessSlug();
    const supabase = await createClient();

    const { data: business } = await (supabase as any)
        .from("businesses").select("id").eq("slug", slug).single();

    const { data: testimonials } = await (supabase as any)
        .from("testimonials")
        .select("*")
        .eq("business_id", business?.id)
        .order("created_at", { ascending: false });

    return (
        <div className="max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold">Testimonials</h2>
                <p className="text-muted-foreground text-sm">Review and publish customer testimonials.</p>
            </div>
            <Link href="/admin/testimonials/new">
                <Button className="bg-business-primary hover:bg-business-primary/90 rounded-xl">
                    <Plus className="w-4 h-4 mr-2" /> Add Testimonial
                </Button>
            </Link>
        </div>

            {(!testimonials || testimonials.length === 0) ? (
                <div className="bg-background border rounded-2xl p-16 text-center text-muted-foreground">
                    No testimonials yet. They'll appear here when customers submit reviews.
                </div>
            ) : (
                <div className="space-y-4">
                    {testimonials.map((t: any) => (
                        <div key={t.id} className="bg-background border rounded-2xl p-6 flex items-start gap-6 hover:shadow-md transition-shadow">
                            <Avatar className="w-12 h-12 flex-shrink-0 border-2 border-business-primary/20">
                                <AvatarFallback className="bg-business-primary text-white font-bold">
                                    {t.author_name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-grow min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-bold">{t.author_name}</p>
                                        {t.author_role && <p className="text-xs text-muted-foreground">{t.author_role}</p>}
                                        <div className="flex items-center space-x-0.5 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                        <form action={toggleTestimonialPublished}>
                                            <input type="hidden" name="id" value={t.id} />
                                            <input type="hidden" name="is_published" value={String(t.is_published)} />
                                            <button type="submit">
                                                <Badge variant={t.is_published ? "default" : "secondary"} className={`cursor-pointer ${t.is_published ? "bg-green-500/20 text-green-700" : ""}`}>
                                                    {t.is_published ? "Published" : "Hidden"}
                                                </Badge>
                                            </button>
                                        </form>
                                        <form action={deleteTestimonial}>
                                            <input type="hidden" name="id" value={t.id} />
                                            <Button type="submit" size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg hover:border-destructive hover:text-destructive">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-sm mt-3 leading-relaxed">&ldquo;{t.body}&rdquo;</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
