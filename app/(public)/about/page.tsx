"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function AboutPage() {
    const t = useTranslations("footer"); // Reusing for now or can add new 'about' section

    return (
        <div className="pt-32 pb-24">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-8">
                            Our Story & <span className="text-business-primary">Mission</span>
                        </h1>
                        <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                            <p>
                                Founded in 2018, we have been dedicated to providing exceptional services to our community.
                                Our journey started with a simple vision: to make premium beauty and wellness services
                                accessible to everyone.
                            </p>
                            <p>
                                We believe that everyone deserves to look and feel their best. Our team of
                                highly skilled professionals is committed to delivering personalized
                                experiences that exceed your expectations.
                            </p>
                            <p>
                                From hair styling to skin treatments, we use only the finest products and
                                the latest techniques to ensure you receive the best results every time.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1000&auto=format&fit=crop"
                            alt="About Us"
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
