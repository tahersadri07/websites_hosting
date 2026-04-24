"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";
import { MarketingModal } from "./MarketingModal";

interface Props {
    product: any;
    business: any;
    siteUrl: string;
}

export function ShareServiceButton({ product, business, siteUrl }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const templates = {
        whatsapp: business.marketing_whatsapp_template,
        instaPost: business.marketing_insta_post_template,
        instaStory: business.marketing_insta_story_template,
    };

    return (
        <>
            <Button 
                onClick={() => setIsOpen(true)}
                size="sm" 
                variant="outline" 
                className="rounded-lg h-8 w-8 p-0 hover:border-business-primary hover:text-business-primary"
                title="Marketing / Share"
            >
                <Megaphone className="w-3.5 h-3.5" />
            </Button>

            <MarketingModal 
                product={product}
                templates={templates}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                siteUrl={siteUrl}
            />
        </>
    );
}
