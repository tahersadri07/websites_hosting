import { addGalleryImage } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/admin/ImageUploader";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewGalleryImagePage() {
    return (
        <div className="max-w-xl space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/admin/gallery">
                    <Button variant="outline" size="icon" className="rounded-xl h-9 w-9">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold">Add Gallery Photo</h2>
                    <p className="text-muted-foreground text-sm">Upload directly from your device.</p>
                </div>
            </div>

            <div className="bg-background rounded-2xl border p-8">
                <form action={addGalleryImage} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Photo *</Label>
                        <ImageUploader
                            name="url"
                            folder="gallery"
                            aspectRatio="4/3"
                            label="Gallery photo"
                        />
                        <p className="text-xs text-muted-foreground">
                            Max 5 MB · JPEG, PNG or WebP
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="caption">Caption (optional)</Label>
                        <Input id="caption" name="caption" placeholder="Describe the photo…" className="h-11 rounded-xl" />
                    </div>

                    <div className="flex justify-end space-x-4 pt-2">
                        <Link href="/admin/gallery">
                            <Button type="button" variant="outline" className="rounded-xl">Cancel</Button>
                        </Link>
                        <Button type="submit" className="bg-business-primary hover:bg-business-primary/90 rounded-xl px-8">
                            Add to Gallery
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
