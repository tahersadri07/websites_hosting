import { createBusiness } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const BUSINESS_TYPES = [
    { value: "service",   label: "Service Provider (Salon, Spa, Clinic…)" },
    { value: "retail",    label: "Retail Shop (Electronics, Clothing…)" },
    { value: "garment",   label: "Garment / Fashion" },
    { value: "restaurant",label: "Restaurant / Cafe / Food" },
    { value: "education", label: "Education / Coaching" },
    { value: "other",     label: "Other" },
];

export default function NewBusinessPage() {
    return (
        <div className="max-w-xl space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/admin/businesses">
                    <Button variant="outline" size="icon" className="rounded-xl h-9 w-9">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold">Create New Business</h2>
                    <p className="text-muted-foreground text-sm">Set up a new business on this platform.</p>
                </div>
            </div>

            <div className="bg-background rounded-2xl border p-8">
                <form action={createBusiness} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="biz-name">Business Name *</Label>
                        <Input id="biz-name" name="name" placeholder="e.g. Rahul Electronics" required className="h-11 rounded-xl" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="biz-slug">URL Slug * <span className="text-muted-foreground font-normal">(lowercase, no spaces)</span></Label>
                        <Input id="biz-slug" name="slug" placeholder="e.g. rahul-electronics" required className="h-11 rounded-xl font-mono" />
                        <p className="text-xs text-muted-foreground">This is the unique identifier for the business. Cannot be changed later.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="biz-type">Business Type</Label>
                        <select
                            id="biz-type"
                            name="business_type"
                            className="w-full h-11 rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-business-primary/30"
                        >
                            {BUSINESS_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="svc-label">Items Label</Label>
                            <Input id="svc-label" name="services_label" defaultValue="Services" placeholder="Services / Products / Menu" className="h-11 rounded-xl" />
                            <p className="text-xs text-muted-foreground">What you call your offerings</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency Symbol</Label>
                            <Input id="currency" name="currency_symbol" defaultValue="₹" placeholder="₹ / $ / €" className="h-11 rounded-xl" />
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-2">
                        <Link href="/admin/businesses">
                            <Button type="button" variant="outline" className="rounded-xl">Cancel</Button>
                        </Link>
                        <Button type="submit" className="bg-business-primary hover:bg-business-primary/90 rounded-xl px-8">
                            Create Business
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
