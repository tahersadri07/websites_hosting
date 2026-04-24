import { getAdminBusinessSlug } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Megaphone, Save, Info, MessageCircle, Instagram } from "lucide-react";
import { updateMarketingTemplates } from "./actions";

export default async function MarketingAdminPage() {
    const slug = await getAdminBusinessSlug();
    const supabase = await createClient();

    const { data: business } = await (supabase as any)
        .from("businesses")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!business) return <div>Business not found</div>;

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Megaphone className="w-6 h-6 text-business-primary" />
                    Marketing Tools
                </h2>
                <p className="text-muted-foreground text-sm">Draft and customize messages for social media marketing.</p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-sm text-blue-700">
                <Info className="w-5 h-5 flex-shrink-0" />
                <div className="space-y-1">
                    <p className="font-bold">Template Variables</p>
                    <p>Use these placeholders in your messages to automatically include product details:</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 font-mono text-[11px] bg-white/50 p-2 rounded-lg">
                        <span>{"{{name}}"} - Product Title</span>
                        <span>{"{{price}}"} - Product Price</span>
                        <span>{"{{link}}"} - Product Page Link</span>
                        <span>{"{{description}}"} - Short Description</span>
                    </div>
                </div>
            </div>

            <form action={updateMarketingTemplates} className="space-y-6">
                <input type="hidden" name="id" value={business.id} />

                {/* WhatsApp */}
                <div className="space-y-4 bg-background border rounded-2xl p-6">
                    <div className="flex items-center gap-2 text-green-600 font-bold">
                        <MessageCircle className="w-5 h-5" />
                        WhatsApp Marketing Template
                    </div>
                    <Textarea 
                        name="marketing_whatsapp_template"
                        defaultValue={business.marketing_whatsapp_template}
                        placeholder="Draft your WhatsApp message here..."
                        className="min-h-[120px] font-mono text-sm rounded-xl"
                    />
                </div>

                {/* Instagram Post */}
                <div className="space-y-4 bg-background border rounded-2xl p-6">
                    <div className="flex items-center gap-2 text-pink-600 font-bold">
                        <Instagram className="w-5 h-5" />
                        Instagram Post Template
                    </div>
                    <Textarea 
                        name="marketing_insta_post_template"
                        defaultValue={business.marketing_insta_post_template}
                        placeholder="Draft your Instagram post caption here..."
                        className="min-h-[120px] font-mono text-sm rounded-xl"
                    />
                </div>

                {/* Instagram Story */}
                <div className="space-y-4 bg-background border rounded-2xl p-6">
                    <div className="flex items-center gap-2 text-purple-600 font-bold">
                        <Instagram className="w-5 h-5" />
                        Instagram Story / Quick Share Template
                    </div>
                    <Textarea 
                        name="marketing_insta_story_template"
                        defaultValue={business.marketing_insta_story_template}
                        placeholder="Draft your Story text here..."
                        className="min-h-[100px] font-mono text-sm rounded-xl"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" className="bg-business-primary hover:bg-business-primary/90 rounded-xl px-8">
                        <Save className="w-4 h-4 mr-2" /> Save Templates
                    </Button>
                </div>
            </form>
        </div>
    );
}
