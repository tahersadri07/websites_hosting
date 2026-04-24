"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import type { TemplateConfig } from "@/lib/templates";

const ThemeContext = createContext<TemplateConfig | null>(null);

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
    return ctx;
}

export function ThemeProvider({ template, children }: { template: TemplateConfig; children: ReactNode }) {
    // Inject CSS custom properties so all components can use var(--t-primary) etc.
    useEffect(() => {
        const { colors, style } = template;
        const root = document.documentElement;
        root.style.setProperty("--t-primary",    colors.primary);
        root.style.setProperty("--t-secondary",  colors.secondary);
        root.style.setProperty("--t-accent",     colors.accent);
        root.style.setProperty("--t-bg",         colors.bg);
        root.style.setProperty("--t-surface",    colors.surface);
        root.style.setProperty("--t-border",     colors.border);
        root.style.setProperty("--t-text",       colors.text);
        root.style.setProperty("--t-textMuted",  colors.textMuted);
        // Font
        document.body.style.fontFamily = `'${template.fonts.body}', sans-serif`;
    }, [template]);

    return (
        <ThemeContext.Provider value={template}>
            {children}
        </ThemeContext.Provider>
    );
}
