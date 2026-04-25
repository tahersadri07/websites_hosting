"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingWhatsAppProps {
    phone: string;
    message?: string;
    template?: any;
}

export function FloatingWhatsApp({ phone, message = "Hello! I'd like to inquire about your services.", template }: FloatingWhatsAppProps) {
    const colors = template?.colors || { text: "#000000" };

    const handleClick = () => {
        const url = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative group"
            >
                <div style={{ color: colors.text }} className="absolute -top-12 right-0 bg-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border">
                    Chat with us!
                    <div className="absolute top-full right-4 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
                </div>

                <Button
                    onClick={handleClick}
                    className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-2xl p-0 flex items-center justify-center animate-bounce duration-[3000ms]"
                    aria-label="Chat on WhatsApp"
                >
                    <MessageCircle className="w-8 h-8 text-white fill-current" />
                </Button>
            </motion.div>
        </div>
    );
}
