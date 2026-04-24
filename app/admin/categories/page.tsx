import { createClient } from "@/lib/supabase/server";
import { getAdminBusinessSlug } from "@/lib/admin-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, LayoutGrid } from "lucide-react";
import { upsertCategory, deleteCategory } from "./actions";

export default async function CategoriesPage() {
    const db = await createClient();
    const slug = await getAdminBusinessSlug();
    
    const { data: business } = await db.from("businesses").select("id").eq("slug", slug).single();
    if (!business) return <div>Business not found</div>;

    const { data: categories } = await db
        .from("categories")
        .select("*")
        .eq("business_id", business.id)
        .order("sort_order", { ascending: true });

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">Manage product/service categories.</p>
                </div>
            </div>

            <div className="grid gap-8">
                {/* Add New Category */}
                <form action={upsertCategory} className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" /> Add New Category
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Category Name</Label>
                            <Input id="name" name="name" placeholder="e.g. Bridal Wear, Skincare" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sort_order">Sort Order</Label>
                            <Input id="sort_order" name="sort_order" type="number" defaultValue="0" />
                        </div>
                    </div>
                    <Button type="submit" className="w-full md:w-auto">Create Category</Button>
                </form>

                {/* Categories List */}
                <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b bg-muted/50">
                        <h2 className="font-semibold">Existing Categories</h2>
                    </div>
                    <div className="divide-y">
                        {categories?.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground">
                                <LayoutGrid className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No categories yet. Create your first one above!</p>
                            </div>
                        ) : (
                            categories?.map((cat) => (
                                <div key={cat.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                            {cat.sort_order}
                                        </div>
                                        <div>
                                            <p className="font-medium">{cat.name}</p>
                                            <p className="text-xs text-muted-foreground">slug: {cat.slug}</p>
                                        </div>
                                    </div>
                                    <form action={async (formData) => {
                                        "use server";
                                        await deleteCategory(cat.id);
                                    }}>
                                        <Button type="submit" variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
