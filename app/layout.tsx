import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Business Website",
    default: "Business Website",
  },
  description: "Welcome to our business",
};

/** Root layout — injects runtime business theme colors as CSS vars */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Default theme colors — overridden by DB values when Supabase is connected
  let primaryColor = "#7C3AED";
  let secondaryColor = "#F59E0B";

  const slug = process.env.NEXT_PUBLIC_BUSINESS_SLUG;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Only fetch colors if Supabase is actually configured
  if (slug && supabaseUrl && supabaseKey && !supabaseUrl.includes("your-")) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { data } = await (supabase as any)
        .from("businesses")
        .select("primary_color, secondary_color")
        .eq("slug", slug)
        .single();
      if (data?.primary_color) primaryColor = data.primary_color;
      if (data?.secondary_color) secondaryColor = data.secondary_color;
    } catch {
      // Silently fall back to defaults — don't block rendering
    }
  }

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { --color-primary: ${primaryColor}; --color-secondary: ${secondaryColor}; }`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
