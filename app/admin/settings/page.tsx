import { createClient } from "@/lib/supabase/server";
import { updateSettings } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorPickerField } from "@/components/admin/ColorPickerField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { getAdminBusinessSlug } from "@/lib/admin-context";

const BUSINESS_TYPES = [
    { value: "service",    label: "Service Provider (Salon, Spa, Clinic…)" },
    { value: "retail",     label: "Retail Shop" },
    { value: "garment",    label: "Garment / Fashion" },
    { value: "restaurant", label: "Restaurant / Cafe / Food" },
    { value: "education",  label: "Education / Coaching" },
    { value: "other",      label: "Other" },
];

export default async function SettingsPage() {
    const slug = await getAdminBusinessSlug();
    const supabase = await createClient();
    const { data: b } = await (supabase as any).from("businesses").select("*").eq("slug", slug).single();
    if (!b) return <p>Business not found.</p>;

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="text-muted-foreground text-sm">Update your business profile, branding and preferences.</p>
            </div>

            <form action={updateSettings} className="space-y-8">
                <input type="hidden" name="id" value={b.id} />

                {/* Logo Upload */}
                <div className="bg-background rounded-2xl border p-8 space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-4">Business Logo</h3>
                    <ImageUploader name="logo_url" defaultUrl={b.logo_url ?? ""} folder="logos" aspectRatio="3/1" label="Business Logo" />
                    <p className="text-xs text-muted-foreground">Recommended: 600×200 px, PNG or SVG with transparent background.</p>
                </div>

                {/* Business Info */}
                <div className="bg-background rounded-2xl border p-8 space-y-6">
                    <h3 className="font-semibold text-lg border-b pb-4">Business Information</h3>
                    <div className="space-y-2">
                        <Label htmlFor="name">Business Name</Label>
                        <Input id="name" name="name" defaultValue={b.name} className="h-11 rounded-xl" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input id="tagline" name="tagline" defaultValue={b.tagline ?? ""} placeholder="Your catchy tagline..." className="h-11 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" defaultValue={b.phone ?? ""} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp Number</Label>
                            <Input id="whatsapp" name="whatsapp" defaultValue={b.whatsapp ?? ""} className="h-11 rounded-xl" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="upi_id">UPI ID (for payments)</Label>
                        <Input id="upi_id" name="upi_id" defaultValue={(b as any).upi_id ?? ""} placeholder="e.g. yourname@okicici" className="h-11 rounded-xl" />
                    </div>

                    {/* Payment Gateways */}
                    <div className="bg-muted/30 p-5 rounded-2xl border border-border mt-6 space-y-4">
                        <h4 className="font-bold text-sm mb-2">Automated Payment Gateway (Razorpay)</h4>
                        <p className="text-xs text-muted-foreground mb-4">Enter your Razorpay API keys to automatically accept and verify GPay, PhonePe, Cards, and more.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="razorpay_key_id">Razorpay Key ID</Label>
                                <Input id="razorpay_key_id" name="razorpay_key_id" defaultValue={(b as any).razorpay_key_id ?? ""} placeholder="rzp_test_..." className="h-11 rounded-xl bg-background" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="razorpay_key_secret">Razorpay Key Secret</Label>
                                <Input id="razorpay_key_secret" name="razorpay_key_secret" type="password" defaultValue={(b as any).razorpay_key_secret ?? ""} placeholder="Secret key..." className="h-11 rounded-xl bg-background" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" defaultValue={b.email ?? ""} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" defaultValue={b.address ?? ""} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="google_maps_url">Google Maps URL</Label>
                        <Input id="google_maps_url" name="google_maps_url" defaultValue={b.google_maps_url ?? ""} placeholder="https://maps.google.com/..." className="h-11 rounded-xl" />
                    </div>
                </div>

                {/* Business Type & Labels */}
                <div className="bg-background rounded-2xl border p-8 space-y-6">
                    <h3 className="font-semibold text-lg border-b pb-4">Business Type & Labels</h3>
                    <div className="space-y-2">
                        <Label htmlFor="business_type">Business Type</Label>
                        <select id="business_type" name="business_type"
                            defaultValue={b.business_type ?? "service"}
                            className="w-full h-11 rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-business-primary/30">
                            {BUSINESS_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="services_label">Items Label</Label>
                            <Input id="services_label" name="services_label" defaultValue={b.services_label ?? "Services"} placeholder="Services / Products / Menu" className="h-11 rounded-xl" />
                            <p className="text-xs text-muted-foreground">Shown on public site (e.g. "Our Products")</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency_symbol">Currency Symbol</Label>
                            <Input id="currency_symbol" name="currency_symbol" defaultValue={b.currency_symbol ?? "₹"} placeholder="₹ / $ / €" className="h-11 rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Brand Colors */}
                <div className="bg-background rounded-2xl border p-8 space-y-6">
                    <h3 className="font-semibold text-lg border-b pb-4">Brand Colors</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <ColorPickerField id="primary_color" name="primary_color" label="Primary Color" defaultValue={b.primary_color ?? "#7c3aed"} />
                        <ColorPickerField id="secondary_color" name="secondary_color" label="Secondary Color" defaultValue={b.secondary_color ?? "#f59e0b"} />
                    </div>
                    <p className="text-xs text-muted-foreground">Colors update the public site immediately after saving.</p>
                </div>

                {/* Social Links */}
                <div className="bg-background rounded-2xl border p-8 space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-4">Social Links</h3>
                    <div className="space-y-2">
                        <Label htmlFor="instagram_url">Instagram</Label>
                        <Input id="instagram_url" name="instagram_url" defaultValue={b.instagram_url ?? ""} placeholder="https://instagram.com/..." className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="facebook_url">Facebook</Label>
                        <Input id="facebook_url" name="facebook_url" defaultValue={b.facebook_url ?? ""} placeholder="https://facebook.com/..." className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="youtube_url">YouTube</Label>
                        <Input id="youtube_url" name="youtube_url" defaultValue={b.youtube_url ?? ""} placeholder="https://youtube.com/..." className="h-11 rounded-xl" />
                    </div>
                </div>

                {/* Custom Domain */}
                <div className="bg-background rounded-2xl border p-8 space-y-6">
                    <h3 className="font-semibold text-lg border-b pb-4">Custom Domain</h3>
                    <div className="space-y-2">
                        <Label htmlFor="custom_domain">Your Domain</Label>
                        <Input
                            id="custom_domain"
                            name="custom_domain"
                            defaultValue={(b as any).custom_domain ?? ""}
                            placeholder="www.mybusiness.com"
                            className="h-11 rounded-xl font-mono"
                        />
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4 space-y-3 text-sm">
                        <p className="font-semibold text-foreground">DNS Setup Instructions</p>
                        <p className="text-muted-foreground">To connect your domain, add this CNAME record with your domain registrar:</p>
                        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                            <div className="bg-background rounded-lg p-2 border">
                                <p className="text-muted-foreground mb-1">Type</p>
                                <p className="font-semibold">CNAME</p>
                            </div>
                            <div className="bg-background rounded-lg p-2 border">
                                <p className="text-muted-foreground mb-1">Name</p>
                                <p className="font-semibold">www</p>
                            </div>
                            <div className="bg-background rounded-lg p-2 border">
                                <p className="text-muted-foreground mb-1">Value</p>
                                <p className="font-semibold truncate">{process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "your-platform.com"}</p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">DNS changes can take up to 48 hours to propagate.</p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" className="bg-business-primary hover:bg-business-primary/90 rounded-xl px-10 h-12 font-bold shadow-lg">
                        Save All Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
