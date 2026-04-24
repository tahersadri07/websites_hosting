import { getAdminBusinessSlug } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/server";
import { Package, AlertTriangle, ArrowUpRight, Search, Filter, Save, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { updateStock, toggleInventoryManagement } from "./actions";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function InventoryPage() {
    const slug = await getAdminBusinessSlug();
    const supabase = await createClient();

    const { data: business } = await (supabase as any)
        .from("businesses")
        .select("id, name")
        .eq("slug", slug)
        .single();

    const { data: products } = await (supabase as any)
        .from("services")
        .select("id, title, stock_quantity, manage_inventory, low_stock_threshold, thumbnail_url, price")
        .eq("business_id", business?.id)
        .order("title");

    const lowStockCount = products?.filter((p: any) => p.manage_inventory && p.stock_quantity <= (p.low_stock_threshold || 5) && p.stock_quantity > 0).length || 0;
    const outOfStockCount = products?.filter((p: any) => p.manage_inventory && p.stock_quantity <= 0).length || 0;

    return (
        <div className="max-w-6xl space-y-8 pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
                    <p className="text-muted-foreground mt-1">Monitor and manage stock levels for all your products.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl px-4 py-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-orange-600 font-bold leading-none">Low Stock</p>
                            <p className="text-xl font-black text-orange-700 leading-none mt-1">{lowStockCount}</p>
                        </div>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-2 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                            <Package className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-red-600 font-bold leading-none">Out of Stock</p>
                            <p className="text-xl font-black text-red-700 leading-none mt-1">{outOfStockCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Filters / Search (Placeholder for UI) */}
            <div className="flex items-center gap-4 bg-background border rounded-2xl p-2 px-4 shadow-sm">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input 
                    placeholder="Search products..." 
                    className="flex-grow bg-transparent border-none outline-none text-sm h-10"
                />
                <div className="h-4 w-px bg-border mx-2" />
                <Button variant="ghost" size="sm" className="rounded-xl text-xs gap-2">
                    <Filter className="w-3 h-3" />
                    All Items
                </Button>
            </div>

            {/* Inventory Table */}
            <div className="bg-background border rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-muted/30 border-b text-left">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Product</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">Tracking</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Current Stock</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products?.map((product: any) => {
                            const isLow = product.manage_inventory && product.stock_quantity <= (product.low_stock_threshold || 5) && product.stock_quantity > 0;
                            const isOut = product.manage_inventory && product.stock_quantity <= 0;
                            
                            return (
                                <tr key={product.id} className="group hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden border bg-muted flex-shrink-0">
                                                {product.thumbnail_url ? (
                                                    <img src={product.thumbnail_url} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center opacity-20">
                                                        <Package className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm leading-none">{product.title}</p>
                                                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight">₹{product.price?.toLocaleString() || "—"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <form action={toggleInventoryManagement}>
                                            <input type="hidden" name="id" value={product.id} />
                                            <input type="hidden" name="enabled" value={String(product.manage_inventory)} />
                                            <button type="submit" className={cn(
                                                "w-10 h-5 rounded-full transition-colors relative",
                                                product.manage_inventory ? "bg-business-primary" : "bg-muted"
                                            )}>
                                                <div className={cn(
                                                    "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                                                    product.manage_inventory ? "right-1" : "left-1"
                                                )} />
                                            </button>
                                        </form>
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.manage_inventory ? (
                                            <form action={updateStock} className="flex items-center gap-2 max-w-[120px]">
                                                <input type="hidden" name="id" value={product.id} />
                                                <Input 
                                                    name="quantity"
                                                    type="number" 
                                                    defaultValue={product.stock_quantity}
                                                    className="h-8 rounded-lg text-center font-bold px-1"
                                                />
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-business-primary hover:text-white">
                                                    <Save className="w-3.5 h-3.5" />
                                                </Button>
                                            </form>
                                        ) : (
                                            <span className="text-muted-foreground italic text-xs">Tracking Disabled</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {!product.manage_inventory ? (
                                            <Badge variant="outline" className="text-[10px] font-bold opacity-30">N/A</Badge>
                                        ) : isOut ? (
                                            <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-[10px] font-bold uppercase tracking-wider">Out of Stock</Badge>
                                        ) : isLow ? (
                                            <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-[10px] font-bold uppercase tracking-wider">Low Stock</Badge>
                                        ) : (
                                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] font-bold uppercase tracking-wider">Healthy</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/services/${product.id}/edit`}>
                                            <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Tips section */}
            <div className="bg-business-primary/5 rounded-3xl p-6 border border-business-primary/10 flex gap-4 items-center">
                <div className="w-12 h-12 rounded-2xl bg-business-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-business-primary" />
                </div>
                <div>
                    <h4 className="font-bold text-business-primary">Inventory Tip</h4>
                    <p className="text-sm text-muted-foreground max-w-xl">
                        Keep your stock levels updated to avoid customer disappointment. Items marked as "Out of Stock" will automatically show a badge on your website and disable the WhatsApp order button.
                    </p>
                </div>
            </div>
        </div>
    );
}
