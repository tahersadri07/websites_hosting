import { upsertService } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAdminBusinessSlug } from "@/lib/admin-context";

export default async function NewServicePage() {
    const db = await createClient();
    const slug = await getAdminBusinessSlug();
    const { data: business } = await db.from("businesses").select("id").eq("slug", slug).single();
    const { data: categories } = await db
        .from("categories")
        .select("id, name")
        .eq("business_id", business?.id)
        .order("sort_order", { ascending: true });

    return (
        <div className="max-w-2xl space-y-6 pb-12">
            <div className="flex items-center space-x-4">
                <Link href="/admin/services">
                    <Button variant="outline" size="icon" className="rounded-xl h-9 w-9">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold">New Service</h2>
                    <p className="text-muted-foreground text-sm">Add a new service to your menu.</p>
                </div>
            </div>

            <div className="bg-background rounded-2xl border p-8">
                <form action={upsertService} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Service Title *</Label>
                            <Input id="title" name="title" placeholder="e.g., Bridal Makeup" required className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category_id">Category</Label>
                            <select 
                                id="category_id" 
                                name="category_id" 
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
                        <Input id="item_number" name="item_number" placeholder="e.g., SKU-001, A12, RIDA-05" className="h-11 rounded-xl" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="Describe the service..." rows={4} className="rounded-xl resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input id="price" name="price" type="number" min="0" placeholder="e.g., 1500" className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                            <Input id="duration_minutes" name="duration_minutes" type="number" min="0" placeholder="e.g., 60" className="h-11 rounded-xl" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> Product Photos (Up to 3)
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <ImageUploader name="image_url_0" folder="services" aspectRatio="4/3" label="Main Photo" />
                            <ImageUploader name="image_url_1" folder="services" aspectRatio="4/3" label="Photo 2" />
                            <ImageUploader name="image_url_2" folder="services" aspectRatio="4/3" label="Photo 3" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <input type="checkbox" id="is_active" name="is_active" defaultChecked className="w-4 h-4 rounded accent-business-primary cursor-pointer" />
                        <Label htmlFor="is_active" className="cursor-pointer">Mark as Active (visible on public site)</Label>
                    </div>

                    <div className="space-y-6 pt-6 border-t">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-semibold">Inventory Management</Label>
                                <p className="text-muted-foreground text-xs">Track stock levels and get low-stock alerts.</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <input type="checkbox" id="manage_inventory" name="manage_inventory" className="w-4 h-4 rounded accent-business-primary cursor-pointer" />
                                <Label htmlFor="manage_inventory" className="cursor-pointer">Enable</Label>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 opacity-50 pointer-events-none has-[:checked]:opacity-100 has-[:checked]:pointer-events-auto transition-opacity" id="inventory-fields">
                            <div className="space-y-2">
                                <Label htmlFor="stock_quantity">Current Stock Quantity</Label>
                                <Input id="stock_quantity" name="stock_quantity" type="number" min="0" defaultValue="0" className="h-11 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                                <Input id="low_stock_threshold" name="low_stock_threshold" type="number" min="0" defaultValue="5" className="h-11 rounded-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                        <Link href="/admin/services">
                            <Button type="button" variant="outline" className="rounded-xl">Cancel</Button>
                        </Link>
                        <Button type="submit" className="bg-business-primary hover:bg-business-primary/90 rounded-xl px-8">
                            Create Service
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

