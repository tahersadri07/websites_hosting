export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type BusinessHours = {
    [day: string]: { open: string; close: string; closed?: boolean };
};

export interface Database {
    public: {
        PostgrestVersion: "12";
        Tables: {
            businesses: {
                Row: BusinessRow;
                Insert: BusinessInsert;
                Update: BusinessUpdate;
                Relationships: [];
            };
            memberships: {
                Row: MembershipRow;
                Insert: MembershipInsert;
                Update: MembershipUpdate;
                Relationships: [];
            };
            business_tools: {
                Row: BusinessToolRow;
                Insert: BusinessToolInsert;
                Update: BusinessToolUpdate;
                Relationships: [];
            };
            services: {
                Row: ServiceRow;
                Insert: ServiceInsert;
                Update: ServiceUpdate;
                Relationships: [];
            };
            testimonials: {
                Row: TestimonialRow;
                Insert: TestimonialInsert;
                Update: TestimonialUpdate;
                Relationships: [];
            };
            gallery_images: {
                Row: GalleryImageRow;
                Insert: GalleryImageInsert;
                Update: GalleryImageUpdate;
                Relationships: [];
            };
            contact_inquiries: {
                Row: ContactInquiryRow;
                Insert: ContactInquiryInsert;
                Update: ContactInquiryUpdate;
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
}

// ─── businesses ──────────────────────────────────────────────────────────────

export interface BusinessRow {
    id: string;
    slug: string;
    name: string;
    tagline: string | null;
    logo_url: string | null;
    address: string | null;
    phone: string | null;
    business_type: "product" | "service";
    whatsapp: string | null;
    email: string | null;
    google_maps_url: string | null;
    hours: BusinessHours | null;
    primary_color: string;
    secondary_color: string;
    facebook_url: string | null;
    instagram_url: string | null;
    youtube_url: string | null;
    // ── Platform fields ──────────────────────────────────────────────────────
    status: "active" | "paused" | "maintenance" | null;
    status_message: string | null;
    services_label: string | null;
    currency_symbol: string | null;
    custom_domain: string | null;
    template: string | null;
    created_at: string;
    updated_at: string;
}

export interface BusinessInsert {
    id?: string;
    slug: string;
    name: string;
    tagline?: string | null;
    logo_url?: string | null;
    address?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    google_maps_url?: string | null;
    hours?: BusinessHours | null;
    primary_color?: string;
    secondary_color?: string;
    facebook_url?: string | null;
    instagram_url?: string | null;
    youtube_url?: string | null;
    status?: "active" | "paused" | "maintenance" | null;
    status_message?: string | null;
    business_type?: "product" | "service";
    services_label?: string | null;
    currency_symbol?: string | null;
    custom_domain?: string | null;
    template?: string | null;
    created_at?: string;
    updated_at?: string;
}

export type BusinessUpdate = Partial<BusinessInsert>;

// ─── memberships ─────────────────────────────────────────────────────────────

export interface MembershipRow {
    id: string;
    user_id: string;
    business_id: string;
    role: "owner" | "editor";
    created_at: string;
}

export interface MembershipInsert {
    id?: string;
    user_id: string;
    business_id: string;
    role?: "owner" | "editor";
    created_at?: string;
}

export type MembershipUpdate = Partial<MembershipInsert>;

// ─── business_tools ──────────────────────────────────────────────────────────

export interface BusinessToolRow {
    id: string;
    business_id: string;
    tool_key: string;
    is_enabled: boolean;
    created_at: string;
}

export interface BusinessToolInsert {
    id?: string;
    business_id: string;
    tool_key: string;
    is_enabled?: boolean;
    created_at?: string;
}

export type BusinessToolUpdate = Partial<BusinessToolInsert>;

// ─── services ────────────────────────────────────────────────────────────────

export interface ServiceRow {
    id: string;
    business_id: string;
    slug: string;
    title: string;
    description: string | null;
    price: number | null;
    duration_minutes: number | null;
    thumbnail_url: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ServiceInsert {
    id?: string;
    business_id: string;
    slug: string;
    title: string;
    description?: string | null;
    price?: number | null;
    duration_minutes?: number | null;
    thumbnail_url?: string | null;
    sort_order?: number;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

export type ServiceUpdate = Partial<ServiceInsert>;

// ─── testimonials ─────────────────────────────────────────────────────────────

export interface TestimonialRow {
    id: string;
    business_id: string;
    author_name: string;
    author_role: string | null;
    author_avatar_url: string | null;
    body: string;
    rating: number;
    is_published: boolean;
    created_at: string;
}

export interface TestimonialInsert {
    id?: string;
    business_id: string;
    author_name: string;
    author_role?: string | null;
    author_avatar_url?: string | null;
    body: string;
    rating?: number;
    is_published?: boolean;
    created_at?: string;
}

export type TestimonialUpdate = Partial<TestimonialInsert>;

// ─── gallery_images ───────────────────────────────────────────────────────────

export interface GalleryImageRow {
    id: string;
    business_id: string;
    url: string;
    caption: string | null;
    sort_order: number;
    created_at: string;
}

export interface GalleryImageInsert {
    id?: string;
    business_id: string;
    url: string;
    caption?: string | null;
    sort_order?: number;
    created_at?: string;
}

export type GalleryImageUpdate = Partial<GalleryImageInsert>;

// ─── contact_inquiries ────────────────────────────────────────────────────────

export interface ContactInquiryRow {
    id: string;
    business_id: string;
    name: string;
    phone: string;
    email: string | null;
    message: string;
    status: "new" | "replied" | "spam";
    created_at: string;
}

export interface ContactInquiryInsert {
    id?: string;
    business_id: string;
    name: string;
    phone: string;
    email?: string | null;
    message: string;
    status?: "new" | "replied" | "spam";
    created_at?: string;
}

export type ContactInquiryUpdate = Partial<ContactInquiryInsert>;

// ─── Convenience aliases ──────────────────────────────────────────────────────
export type Business      = BusinessRow;
export type Membership    = MembershipRow;
export type BusinessTool  = BusinessToolRow;
export type Service       = ServiceRow;
export type Testimonial   = TestimonialRow;
export type GalleryImage  = GalleryImageRow;
export type ContactInquiry = ContactInquiryRow;
