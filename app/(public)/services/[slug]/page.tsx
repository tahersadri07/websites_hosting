import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default async function ServiceDetailPage({
    params,
}: {
    params: { slug: string };
}) {
    const businessSlug = process.env.NEXT_PUBLIC_BUSINESS_SLUG;
    if (!businessSlug) return notFound();

    const supabase = await createClient();

    // Fetch service and business info
    const [serviceRes, businessRes] = await Promise.all([
        (supabase as any).from("services").select("*").eq("slug", params.slug).single(),
        (supabase as any).from("businesses").select("whatsapp").eq("slug", businessSlug).single()
    ]);

    const service = serviceRes.data;
    const business = businessRes.data;

    if (!service) return notFound();

    const handleWhatsapp = `https://wa.me/${business?.whatsapp?.replace(/\D/g, "")}?text=Hi, I'm interested in ${service.title}.`;

    return (
        <div className="pt-32 pb-24">
            <div className="container mx-auto px-4">
                <Link href="/services" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-business-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to all services
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-xl">
                        <Image
                            src={service.thumbnail_url ?? "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop"}
                            alt={service.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                            {service.price && (
                                <Badge className="bg-business-primary text-white text-lg px-4 py-1 font-bold">
                                    {formatCurrency(service.price)}
                                </Badge>
                            )}
                            {service.duration_minutes && (
                                <div className="flex items-center text-muted-foreground font-medium">
                                    <Clock className="w-5 h-5 mr-1" />
                                    {service.duration_minutes} mins
                                </div>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6">{service.title}</h1>

                        <div className="prose prose-lg max-w-none text-muted-foreground mb-10 leading-relaxed">
                            {service.description ?? "Experience a premium service tailored to your specific requirements. Our experts ensure you receive the best care and results."}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            <div className="flex items-center space-x-3 text-sm text-foreground bg-muted/30 p-4 rounded-xl">
                                <CheckCircle2 className="w-5 h-5 text-business-primary flex-shrink-0" />
                                <span>Expert Consultation Included</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-foreground bg-muted/30 p-4 rounded-xl">
                                <CheckCircle2 className="w-5 h-5 text-business-primary flex-shrink-0" />
                                <span>Premium Products Used</span>
                            </div>
                        </div>

                        <a href={handleWhatsapp} target="_blank" rel="noopener noreferrer">
                            <Button size="lg" className="w-full sm:w-auto h-14 px-10 rounded-full bg-green-600 hover:bg-green-700 text-lg font-bold shadow-lg">
                                <MessageCircle className="w-6 h-6 mr-3" />
                                Book via WhatsApp
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
