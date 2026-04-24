import { addTestimonial } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";

export default function NewTestimonialPage() {
    return (
        <div className="max-w-2xl space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/admin/testimonials">
                    <Button variant="outline" size="icon" className="rounded-xl h-9 w-9">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold">Add Testimonial</h2>
                    <p className="text-muted-foreground text-sm">Manually add a customer review.</p>
                </div>
            </div>

            <div className="bg-background rounded-2xl border p-8">
                <form action={addTestimonial} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="author_name">Customer Name *</Label>
                        <Input
                            id="author_name"
                            name="author_name"
                            placeholder="e.g., Ananya Sharma"
                            required
                            className="h-11 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="author_role">Customer Role / Label</Label>
                        <Input
                            id="author_role"
                            name="author_role"
                            placeholder="e.g., Regular Customer"
                            className="h-11 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="body">Review Text *</Label>
                        <Textarea
                            id="body"
                            name="body"
                            placeholder="What did the customer say..."
                            required
                            rows={5}
                            className="rounded-xl resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rating">Rating (1–5)</Label>
                        <div className="flex items-center space-x-3">
                            <Input
                                id="rating"
                                name="rating"
                                type="number"
                                min="1"
                                max="5"
                                defaultValue="5"
                                className="h-11 rounded-xl w-24"
                            />
                            <div className="flex items-center space-x-1 text-yellow-400">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="is_published"
                            name="is_published"
                            defaultChecked
                            className="w-4 h-4 rounded accent-business-primary cursor-pointer"
                        />
                        <Label htmlFor="is_published" className="cursor-pointer">
                            Publish immediately (visible on public site)
                        </Label>
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-2">
                        <Link href="/admin/testimonials">
                            <Button type="button" variant="outline" className="rounded-xl">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            className="bg-business-primary hover:bg-business-primary/90 rounded-xl px-8"
                        >
                            Add Testimonial
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
