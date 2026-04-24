import { upsertService } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";


export default function NewServicePage() {
    return (
        <div className="max-w-2xl space-y-6">
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
                    <div className="space-y-2">
                        <Label htmlFor="title">Service Title *</Label>
                        <Input id="title" name="title" placeholder="e.g., Bridal Makeup" required className="h-11 rounded-xl" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="item_number">Item Number / SKU <span className="text-xs text-muted-foreground">(optional)</span></Label>
                        <Input id="item_number" name="item_number" placeholder="e.g., SKU-001, A12, RIDA-05" className="h-11 rounded-xl" />
                        <p className="text-xs text-muted-foreground">This appears on the product page and in WhatsApp order messages.</p>
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

                    <div className="space-y-2">
                        <Label>Thumbnail Photo</Label>
                        <ImageUploader name="thumbnail_url" folder="services" aspectRatio="4/3" label="Service thumbnail" />
                    </div>

                    <div className="flex items-center space-x-3">
                        <input type="checkbox" id="is_active" name="is_active" defaultChecked className="w-4 h-4 rounded accent-business-primary cursor-pointer" />
                        <Label htmlFor="is_active" className="cursor-pointer">Mark as Active (visible on public site)</Label>
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-4">
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
