/**
 * Template Registry
 * Each template defines a full visual identity for a client's public website.
 * The `key` matches the `template` column in the `businesses` table.
 */

export interface TemplateConfig {
    key:         string;
    name:        string;
    description: string;
    category:    string;        // e.g. "Fashion", "Services", "Food & Beverage"
    preview:     string;        // CSS gradient for the preview card
    colors: {
        primary:    string;
        secondary:  string;
        accent:     string;
        bg:         string;
        surface:    string;
        border:     string;
        text:       string;
        textMuted:  string;
    };
    fonts: {
        heading: string;        // Google Font name
        body:    string;
    };
    style: {
        heroLayout:  "centered" | "split-left" | "split-right" | "fullbleed";
        heroRadius:  string;    // border-radius token for CTA buttons
        cardRadius:  string;
        cardShadow:  string;
        navStyle:    "glass" | "solid" | "minimal";
    };
}

export const TEMPLATES: Record<string, TemplateConfig> = {
    // ── 1. Dark Minimal ────────────────────────────────────────────────────────
    "dark-minimal": {
        key: "dark-minimal",
        name: "Dark Minimal",
        description: "Clean, dark aesthetic — Linear/Vercel inspired. Best for tech, agencies, and professional services.",
        category: "Technology & Services",
        preview: "linear-gradient(135deg, #0A0A0F 0%, #1C1C24 50%, #6366F1 100%)",
        colors: {
            primary:   "#6366F1",
            secondary: "#8B5CF6",
            accent:    "#A78BFA",
            bg:        "#0A0A0F",
            surface:   "#13131A",
            border:    "#27272A",
            text:      "#FAFAFA",
            textMuted: "#A1A1AA",
        },
        fonts: { heading: "Inter", body: "Inter" },
        style: {
            heroLayout:  "centered",
            heroRadius:  "rounded-xl",
            cardRadius:  "rounded-2xl",
            cardShadow:  "shadow-indigo-500/15",
            navStyle:    "glass",
        },
    },

    // ── 2. Luxury Fashion ──────────────────────────────────────────────────────
    "luxury-fashion": {
        key: "luxury-fashion",
        name: "Luxury Fashion",
        description: "Elegant and premium — gold accents on deep black. Perfect for clothing, rida, jewellery, and lifestyle brands.",
        category: "Fashion & Lifestyle",
        preview: "linear-gradient(135deg, #0D0D08 0%, #1A1500 50%, #D4AF37 100%)",
        colors: {
            primary:   "#D4AF37",
            secondary: "#B8860B",
            accent:    "#F5D87A",
            bg:        "#0D0D08",
            surface:   "#151208",
            border:    "#2A2410",
            text:      "#F5F0E8",
            textMuted: "#A89870",
        },
        fonts: { heading: "Playfair Display", body: "Inter" },
        style: {
            heroLayout:  "split-right",
            heroRadius:  "rounded-none",
            cardRadius:  "rounded-lg",
            cardShadow:  "shadow-yellow-500/10",
            navStyle:    "solid",
        },
    },

    // ── 3. Warm Salon ──────────────────────────────────────────────────────────
    "warm-salon": {
        key: "warm-salon",
        name: "Warm Salon",
        description: "Warm, inviting, and friendly — rose & amber palette. Ideal for salons, spas, cafes, and food businesses.",
        category: "Beauty & Hospitality",
        preview: "linear-gradient(135deg, #0F0609 0%, #1A0A0E 50%, #F43F5E 100%)",
        colors: {
            primary:   "#F43F5E",
            secondary: "#FB7185",
            accent:    "#FDE68A",
            bg:        "#0F0609",
            surface:   "#180A0E",
            border:    "#2D1520",
            text:      "#FDF2F4",
            textMuted: "#C084A0",
        },
        fonts: { heading: "DM Sans", body: "DM Sans" },
        style: {
            heroLayout:  "centered",
            heroRadius:  "rounded-full",
            cardRadius:  "rounded-3xl",
            cardShadow:  "shadow-rose-500/15",
            navStyle:    "glass",
        },
    },

    // ── 4. Corporate Pro ───────────────────────────────────────────────────────
    "corporate-pro": {
        key: "corporate-pro",
        name: "Corporate Pro",
        description: "Professional, structured, and trustworthy — blue palette. Built for consulting, finance, law, and B2B.",
        category: "Business & Finance",
        preview: "linear-gradient(135deg, #060A18 0%, #0D1530 50%, #3B82F6 100%)",
        colors: {
            primary:   "#3B82F6",
            secondary: "#2563EB",
            accent:    "#60A5FA",
            bg:        "#060A18",
            surface:   "#0D1530",
            border:    "#1E2D50",
            text:      "#F0F4FF",
            textMuted: "#8BA3CC",
        },
        fonts: { heading: "Inter", body: "Inter" },
        style: {
            heroLayout:  "split-left",
            heroRadius:  "rounded-lg",
            cardRadius:  "rounded-xl",
            cardShadow:  "shadow-blue-500/15",
            navStyle:    "solid",
        },
    },

    // ── 5. Light Elegant ────────────────────────────────────────────────────────
    "light-elegant": {
        key: "light-elegant",
        name: "Light Elegant",
        description: "Sophisticated light theme with soft shadows and refined typography. Perfect for boutique shops and personal brands.",
        category: "Boutique & Professional",
        preview: "linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 50%, #111827 100%)",
        colors: {
            primary:   "#111827",
            secondary: "#4B5563",
            accent:    "#6366F1",
            bg:        "#FFFFFF",
            surface:   "#F9FAFB",
            border:    "#E5E7EB",
            text:      "#111827",
            textMuted: "#6B7280",
        },
        fonts: { heading: "Playfair Display", body: "Inter" },
        style: {
            heroLayout:  "centered",
            heroRadius:  "rounded-2xl",
            cardRadius:  "rounded-3xl",
            cardShadow:  "shadow-lg shadow-black/5",
            navStyle:    "glass",
        },
    },

    // ── 6. Influencer Vibe ──────────────────────────────────────────────────────
    "influencer-vibe": {
        key: "influencer-vibe",
        name: "Influencer Vibe",
        description: "Vibrant, high-energy, and modern — perfect for creators, agencies, and social media platforms. Featuring neon gradients and soft glassmorphism.",
        category: "Creative & Digital",
        preview: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #EC4899 100%)",
        colors: {
            primary:   "#EC4899", // Vibrant Pink
            secondary: "#8B5CF6", // Violet
            accent:    "#06B6D4", // Cyan
            bg:        "#0F172A", // Deep Navy
            surface:   "#1E293B", // Slate
            border:    "#334155",
            text:      "#F8FAFC",
            textMuted: "#94A3B8",
        },
        fonts: { heading: "Outfit", body: "Inter" },
        style: {
            heroLayout:  "split-left",
            heroRadius:  "rounded-2xl",
            cardRadius:  "rounded-[2rem]",
            cardShadow:  "shadow-pink-500/10",
            navStyle:    "glass",
        },
    },
    // ── 7. Rose Gold Jewelry ────────────────────────────────────────────────────
    "rose-gold-jewelry": {
        key: "rose-gold-jewelry",
        name: "Rose Gold Jewelry",
        description: "Boutique luxury — blush pink, pure white, and gold accents. Feminine, romantic, and premium.",
        category: "Luxury & Fashion",
        preview: "linear-gradient(135deg, #FFFFFF 0%, #f8d7e3 50%, #D4AF37 100%)",
        colors: {
            primary:   "#D4AF37", // Subtle Gold Accent
            secondary: "#f8d7e3", // Blush Pink
            accent:    "#C5A059", // Deep Gold
            bg:        "#FFFFFF", // Clean, minimal white space
            surface:   "#FFF9FA", // Soft Ethereal Blush Surface
            border:    "#f8d7e3", 
            text:      "#4A3B3D", // Charcoal Rose (Premium contrast)
            textMuted: "#8E7A7D",
        },
        fonts: { heading: "Cormorant Garamond", body: "Montserrat" },
        style: {
            heroLayout:  "split-right",
            heroRadius:  "rounded-3xl", // Smooth curves as requested
            cardRadius:  "rounded-[2.5rem]", // Very smooth, high-end
            cardShadow:  "0 20px 40px -15px rgba(248, 215, 227, 0.3)",
            navStyle:    "glass",
        },
    },
    // ── 8. Blush Jewelry Reverse ───────────────────────────────────────────────
    "blush-jewelry-reverse": {
        key: "blush-jewelry-reverse",
        name: "Blush Jewelry (Reverse)",
        description: "Bold & Boutique — pink background with pure white typography. High-contrast luxury.",
        category: "Luxury & Fashion",
        preview: "linear-gradient(135deg, #f8d7e3 0%, #FFFFFF 100%)",
        colors: {
            primary:   "#D4AF37", // Gold for buttons
            secondary: "#3D2B2D", // Deep Rosewood for contrast
            accent:    "#D4AF37",
            bg:        "#f8d7e3", // Pink background
            surface:   "#fae1ea", // Slightly darker pink for surfaces
            border:    "#3d2b2d20", 
            text:      "#3D2B2D", // Deep Rosewood (High contrast)
            textMuted: "#6B5356",
        },
        fonts: { heading: "Cormorant Garamond", body: "Montserrat" },
        style: {
            heroLayout:  "split-right",
            heroRadius:  "rounded-3xl",
            cardRadius:  "rounded-[2.5rem]",
            cardShadow:  "0 20px 40px -15px rgba(0, 0, 0, 0.1)",
            navStyle:    "glass",
        },
    },
};

export const DEFAULT_TEMPLATE = "dark-minimal";

export function getTemplate(key?: string | null): TemplateConfig {
    return TEMPLATES[key ?? DEFAULT_TEMPLATE] ?? TEMPLATES[DEFAULT_TEMPLATE];
}

/** Google Fonts URL for a template */
export function getTemplateFontUrl(t: TemplateConfig): string {
    const fonts = [...new Set([t.fonts.heading, t.fonts.body])];
    const query = fonts.map(f => `family=${f.replace(/ /g, "+")}:wght@300;400;500;600;700;800`).join("&");
    return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}
