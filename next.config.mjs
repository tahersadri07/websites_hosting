import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "*.supabase.co" },
            { protocol: "https", hostname: "*.supabase.in" },
            { protocol: "https", hostname: "**" },
        ],
    },
};

export default withNextIntl(nextConfig);
