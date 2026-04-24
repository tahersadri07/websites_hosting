"use client";

import { useState } from "react";
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Camera, Copy, Check, Megaphone, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
    product: any;
    templates: {
        whatsapp: string;
        instaPost: string;
        instaStory: string;
    };
    isOpen: boolean;
    onClose: () => void;
    siteUrl: string;
}

export function MarketingModal({ product, templates, isOpen, onClose, siteUrl }: Props) {
    const [copied, setCopied] = useState<string | null>(null);

    const productUrl = `${siteUrl}/services/${product.slug}`;
    
    const replaceVars = (template: string | null | undefined) => {
        if (!template) return "";
        return template
            .replace(/{{name}}/g, product.title || "")
            .replace(/{{price}}/g, product.price ? `₹${product.price.toLocaleString("en-IN")}` : "N/A")
            .replace(/{{description}}/g, product.description || "")
            .replace(/{{link}}/g, productUrl);
    };

    const whatsappMsg = replaceVars(templates.whatsapp);
    const instaPostMsg = replaceVars(templates.instaPost);
    const instaStoryMsg = replaceVars(templates.instaStory);

    const handleCopy = async (text: string, type: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleWhatsAppShare = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`;
        window.open(url, "_blank");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-2xl rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-business-primary" />
                        Share "{product.title}"
                    </DialogTitle>
                    <DialogDescription>
                        Use these pre-written messages to promote your product on social media.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4">
                    {/* Image Preview & Actions */}
                    <div className="md:col-span-4 space-y-4">
                        <div className="aspect-square rounded-2xl overflow-hidden border bg-muted flex items-center justify-center relative group">
                            {product.thumbnail_url ? (
                                <img 
                                    src={product.thumbnail_url} 
                                    alt={product.title} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Camera className="w-12 h-12 text-muted-foreground/20" />
                            )}
                        </div>
                        <Button 
                            variant="outline" 
                            className="w-full rounded-xl text-xs h-10"
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = product.thumbnail_url;
                                link.download = `${product.slug}.jpg`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            disabled={!product.thumbnail_url}
                        >
                            Download Image
                        </Button>
                        <p className="text-[10px] text-muted-foreground text-center">
                            Download this photo to upload it manually on Instagram.
                        </p>
                    </div>

                    <div className="md:col-span-8 space-y-6 overflow-y-auto max-h-[60vh] pr-2">
                    {/* WhatsApp */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-green-600 flex items-center gap-1.5 uppercase tracking-wider">
                                <MessageCircle className="w-3.5 h-3.5" />
                                WhatsApp Message
                            </label>
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" onClick={() => handleCopy(whatsappMsg, "wa")} className="h-7 text-[10px] rounded-lg">
                                    {copied === "wa" ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                                    {copied === "wa" ? "Copied" : "Copy"}
                                </Button>
                                <Button size="sm" onClick={handleWhatsAppShare} className="h-7 text-[10px] bg-green-600 hover:bg-green-700 text-white rounded-lg">
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    Share to WhatsApp
                                </Button>
                            </div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-2xl text-sm font-mono whitespace-pre-wrap border border-muted">
                            {whatsappMsg}
                        </div>
                    </div>

                    {/* Insta Post */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-pink-600 flex items-center gap-1.5 uppercase tracking-wider">
                                <Camera className="w-3.5 h-3.5" />
                                Instagram Post Caption
                            </label>
                            <Button size="sm" variant="ghost" onClick={() => handleCopy(instaPostMsg, "post")} className="h-7 text-[10px] rounded-lg">
                                {copied === "post" ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                                {copied === "post" ? "Copied" : "Copy Caption"}
                            </Button>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-2xl text-sm font-mono whitespace-pre-wrap border border-muted">
                            {instaPostMsg}
                        </div>
                    </div>

                    {/* Insta Story */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-purple-600 flex items-center gap-1.5 uppercase tracking-wider">
                                <Camera className="w-3.5 h-3.5" />
                                Instagram Story Text
                            </label>
                            <Button size="sm" variant="ghost" onClick={() => handleCopy(instaStoryMsg, "story")} className="h-7 text-[10px] rounded-lg">
                                {copied === "story" ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                                {copied === "story" ? "Copied" : "Copy Text"}
                            </Button>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-2xl text-sm font-mono whitespace-pre-wrap border border-muted">
                            {instaStoryMsg}
                        </div>
                    </div>
                    </div>
                </div>

                <div className="flex justify-center pt-2">
                    <p className="text-[10px] text-muted-foreground text-center max-w-[300px]">
                        Tip: You can customize these templates globally from the 
                        <span className="font-bold"> Marketing Tools</span> section in the sidebar.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
