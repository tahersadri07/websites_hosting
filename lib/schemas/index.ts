import { z } from "zod";

// ─── Business ────────────────────────────────────────────────────────────────

export const businessSchema = z.object({
    name: z.string().min(2, "Business name must be at least 2 characters"),
    tagline: z.string().max(160).optional().nullable(),
    logo_url: z.string().url().optional().nullable(),
    address: z.string().max(500).optional().nullable(),
    phone: z.string().max(20).optional().nullable(),
    whatsapp: z.string().max(20).optional().nullable(),
    email: z.string().email().optional().nullable(),
    google_maps_url: z.string().url().optional().nullable(),
    // Zod v4: z.record() requires explicit key + value schemas
    hours: z
        .record(
            z.string(),
            z.object({
                open: z.string(),
                close: z.string(),
                closed: z.boolean().optional(),
            })
        )
        .optional()
        .nullable(),
    primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a hex color"),
    secondary_color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a hex color"),
    facebook_url: z.string().url().optional().nullable(),
    instagram_url: z.string().url().optional().nullable(),
    youtube_url: z.string().url().optional().nullable(),
});

export type BusinessFormValues = z.infer<typeof businessSchema>;

// ─── Service ─────────────────────────────────────────────────────────────────

export const serviceSchema = z.object({
    title: z.string().min(2, "Title required"),
    slug: z
        .string()
        .regex(
            /^[a-z0-9-]+$/,
            "Slug: lowercase letters, numbers, hyphens only"
        ),
    description: z.string().max(2000).optional().nullable(),
    price: z.coerce.number().min(0).optional().nullable(),
    duration_minutes: z.coerce.number().min(1).optional().nullable(),
    thumbnail_url: z.string().url().optional().nullable(),
    is_active: z.boolean().default(true),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

// ─── Testimonial ─────────────────────────────────────────────────────────────

export const testimonialSchema = z.object({
    author_name: z.string().min(2, "Name required"),
    author_role: z.string().max(100).optional().nullable(),
    author_avatar_url: z.string().url().optional().nullable(),
    body: z
        .string()
        .min(10, "Review must be at least 10 characters")
        .max(1000),
    rating: z.number().int().min(1).max(5),
    is_published: z.boolean().default(true),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

// ─── Gallery Image ────────────────────────────────────────────────────────────

export const galleryImageSchema = z.object({
    url: z.string().url("Must be a valid URL"),
    caption: z.string().max(200).optional().nullable(),
});

export type GalleryImageFormValues = z.infer<typeof galleryImageSchema>;

// ─── Contact Inquiry ─────────────────────────────────────────────────────────

export const contactInquirySchema = z.object({
    name: z.string().min(2, "Name required"),
    phone: z.string().min(7, "Valid phone number required").max(20),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    message: z
        .string()
        .min(10, "Message must be at least 10 characters")
        .max(2000),
});

export type ContactInquiryFormValues = z.infer<typeof contactInquirySchema>;

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
    .object({
        password: z.string().min(8, "Minimum 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
