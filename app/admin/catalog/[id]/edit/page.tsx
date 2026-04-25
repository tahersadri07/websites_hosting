import { createClient } from "@/lib/supabase/server";
import { upsertService } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Tag, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { getAdminBusinessSlug } from "@/lib/admin-context";
import { getBusinessConfig } from "@/lib/business-config";

export default async function EditServicePage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const slug = await getAdminBusinessSlug();
    const { data: business } = await supabase.from("businesses").select("id, business_type, services_label").eq("slug", slug).single();
    
    const config = getBusinessConfig(business?.business_type);
    const catalogLabel = business?.services_label || config.plural;
    
    const [{ data: svc }, { data: categories }] = await Promise.all([
        (supabase as any).from("services").select("*").eq("id", params.id).single(),
        supabase.from("categories").select("id, name").eq("business_id", business?.id).order("sort_order", { ascending: true })
    ]);

    if (!svc) return notFound();

    const imageUrls = svc.image_urls || [];

    return (
        <div className="max-w-2xl space-y-6 pb-12">
            <div className="flex items-center space-x-4">
                <Link href="/admin/catalog">
                    <Button variant="outline" size="icon" className="rounded-xl h-9 w-9">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold">Edit {config.singular}</h2>
                    <p className="text-muted-foreground text-sm">Update &quot;{svc.title}&quot;</p>
                </div>
            </div>

            <div className="bg-background rounded-2xl border p-8">
                <form action={upsertService} className="space-y-6">
                    <input type="hidden" name="id" value={svc.id} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">{config.singular} Title *</Label>
                            <Input id="title" name="title" defaultValue={svc.title} required className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category_id">Category</Label>
                            <select 
                                id="category_id" 
                                name="category_id" 
                                defaultValue={svc.category_id || ""}
                                className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Select a category</option>
                                {categories?.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="item_number">Item Number / SKU <span className="text-xs text-muted-foreground">(optional)</span></Label>
                        <Input id="item_number" name="item_number" defaultValue={svc.item_number ?? ""} placeholder="e.g., SKU-001, A12, RIDA-05" className="h-11 rounded-xl" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="tags" className="flex items-center gap-2">
                                <Tag className="w-4 h-4" /> Attributes / Tags
                            </Label>
                            <Input id="tags" name="tags" defaultValue={svc.tags?.join(", ") ?? ""} placeholder="e.g. Micro, Tech, 100k+ Followers" className="h-11 rounded-xl" />
                            <p className="text-[10px] text-muted-foreground italic">Separate with commas</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="features" className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Key Features / Highlights
                            </Label>
                            <Input id="features" name="features" defaultValue={svc.features?.join(", ") ?? ""} placeholder="e.g. 1x Reel, 2x Stories" className="h-11 rounded-xl" />
                            <p className="text-[10px] text-muted-foreground italic">Separate with commas</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" defaultValue={svc.description ?? ""} rows={4} className="rounded-xl resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input id="price" name="price" type="number" min="0" defaultValue={svc.price ?? ""} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                            <Input id="duration_minutes" name="duration_minutes" type="number" min="0" defaultValue={svc.duration_minutes ?? ""} className="h-11 rounded-xl" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> Product Photos (Up to 3)
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <ImageUploader name="image_url_0" defaultUrl={imageUrls[0] || svc.thumbnail_url || ""} folder="services" aspectRatio="4/3" label="Main Photo" />
                            <ImageUploader name="image_url_1" defaultUrl={imageUrls[1] || ""} folder="services" aspectRatio="4/3" label="Photo 2" />
                            <ImageUploader name="image_url_2" defaultUrl={imageUrls[2] || ""} folder="services" aspectRatio="4/3" label="Photo 3" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <input type="checkbox" id="is_active" name="is_active" defaultChecked={svc.is_active} className="w-4 h-4 rounded accent-business-primary cursor-pointer" />
                        <Label htmlFor="is_active" className="cursor-pointer">Active (visible to public)</Label>
                    </div>

                    <div className="space-y-6 pt-6 border-t">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-semibold">Inventory Management</Label>
                                <p className="text-muted-foreground text-xs">Track stock levels and get low-stock alerts.</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <input type="checkbox" id="manage_inventory" name="manage_inventory" defaultChecked={svc.manage_inventory} className="w-4 h-4 rounded accent-business-primary cursor-pointer" />
                                <Label htmlFor="manage_inventory" className="cursor-pointer">Enable</Label>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 opacity-50 pointer-events-none has-[:checked]:opacity-100 has-[:checked]:pointer-events-auto transition-opacity" id="inventory-fields">
                            <div className="space-y-2">
                                <Label htmlFor="stock_quantity">Current Stock Quantity</Label>
                                <Input id="stock_quantity" name="stock_quantity" type="number" min="0" defaultValue={svc.stock_quantity ?? 0} className="h-11 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                                <Input id="low_stock_threshold" name="low_stock_threshold" type="number" min="0" defaultValue={svc.low_stock_threshold ?? 5} className="h-11 rounded-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                        <Link href="/admin/catalog">
                            <Button type="button" variant="outline" className="rounded-xl">Cancel</Button>
                        </Link>
                        <Button type="submit" className="bg-business-primary hover:bg-business-primary/90 rounded-xl px-8">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

