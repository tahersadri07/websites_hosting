# 🎨 Utility Management Platform — Master UI/UX Design Prompt

> A production-ready, reusable prompt for building a premium, sellable, enterprise-grade utility management SaaS platform. Use this document as-is with AI design tools (v0, Lovable, Cursor, Framer AI, Midjourney), or hand it to designers and developers.

---

## 📌 How to Use This Document

1. **For AI builders (v0, Lovable, Bolt, Cursor):** Copy the entire prompt from the "Master Prompt" section below into the input field.
2. **For designers (Figma, Webflow, etc.):** Share this file directly as the creative brief.
3. **For developers:** Use the Design System and Components sections as implementation specs.
4. **For investors/clients:** The Success Criteria and Visual Direction sections double as a pitch document.

---

## 🧠 Master Prompt

**Role:** You are a Senior UI/UX Design Engineer with 10+ years of experience crafting award-winning SaaS platforms (think Linear, Stripe, Vercel, Notion, and Framer-level quality). Your design philosophy balances bold visual identity with surgical functional clarity.

**Project Brief:**
Design a premium, enterprise-grade **Utility Management Platform** — a multi-tenant SaaS product that allows businesses and clients to manage, monitor, automate, and resell digital utilities (tools, integrations, dashboards, subscriptions, APIs, services) through a single unified interface. The platform must feel *sellable* — meaning it should project trust, sophistication, and ROI at first glance.

---

## 🎯 Core Design Objectives

1. **First-Impression Wow Factor** — A hero experience that converts visitors into paying clients within 8 seconds.
2. **Enterprise Credibility** — Visuals that justify premium pricing tiers ($500–$5000/month).
3. **Operational Clarity** — Dense utility data presented without overwhelm.
4. **White-Label Ready** — Modular theming so resellers can rebrand seamlessly.
5. **Scalable Architecture** — Component-based design that grows with the product.

---

## 🖌️ Visual Design System

### Aesthetic Direction
Modern minimalism meets futuristic utility — glassmorphism accents, subtle 3D depth, micro-interactions, and bento-grid compositions. Avoid generic "AI startup" templates.

### Color Palette

**Dark Mode (Primary)**
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#0A0A0F` | Main background |
| `--bg-surface` | `#13131A` | Cards, panels |
| `--bg-elevated` | `#1C1C24` | Modals, popovers |
| `--accent-primary` | `#6366F1` | Primary buttons, links |
| `--accent-gradient` | `linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)` | CTAs, highlights |
| `--text-primary` | `#FAFAFA` | Headings, body |
| `--text-secondary` | `#A1A1AA` | Subtext, captions |
| `--border-subtle` | `#27272A` | Dividers |

**Light Mode**
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#FAFAFA` | Main background |
| `--bg-surface` | `#FFFFFF` | Cards, panels |
| `--text-primary` | `#0A0A0F` | Headings, body |
| `--text-secondary` | `#52525B` | Subtext |
| `--border-subtle` | `#E4E4E7` | Dividers |

### Typography

- **Display / Headings:** Inter Display or Satoshi — tight tracking (-0.02em), weights 600–800
- **Body:** Inter or Geist — weights 400–500, line-height 1.6
- **Monospace (data/code):** JetBrains Mono or Geist Mono
- **Scale:** 12 / 14 / 16 / 18 / 20 / 24 / 32 / 48 / 64 / 80 px

### Spacing & Grid

- 8pt grid system (spacing multiples of 8)
- 12-column responsive layout
- Max content width: 1440px
- Section padding: 96–128px vertical on desktop, 48–64px on mobile
- Generous whitespace — never crowd elements

### Iconography

- Library: **Lucide** or **Phosphor**
- Stroke: 1.5px consistent
- Size: 20×20 default, 16×16 for inline, 24×24 for nav

### Elevation & Depth

- Subtle shadows with colored ambient glow on primary elements
- Glassmorphism for overlays: `backdrop-filter: blur(20px)` + 10% opacity background
- Border radius scale: 6 / 8 / 12 / 16 / 24 px

---

## 🏗️ Required Pages & Components

### 1. Landing Page (Marketing)
- Hero with animated utility dashboard mockup (parallax or Lottie)
- Social proof bar ("Trusted by 2,000+ businesses" with client logos)
- Feature bento grid (6 modules with hover states)
- Interactive pricing calculator
- Testimonial carousel with video thumbnails
- ROI/stats section with animated counters
- FAQ accordion
- CTA sections with gradient glow buttons
- Sticky navigation with blur backdrop on scroll
- Footer with sitemap, social, newsletter

### 2. Authentication Flow
- Split-screen login/signup — ambient gradient artwork on one side
- SSO options (Google, Microsoft, GitHub, Apple)
- Multi-step onboarding with progress indicator
- Email verification screen with animated illustration
- Password reset flow

### 3. Main Dashboard
- Collapsible sidebar with nested utility categories
- Top-level KPI cards (revenue, active utilities, client count, uptime)
- Real-time usage chart (area chart with gradient fill)
- Recent activity feed with avatars and timestamps
- Quick-action command palette (⌘K)
- Notification center with unread badge

### 4. Utility Management Module
- Grid/list toggle view of all utilities
- Advanced filters (category, status, client, pricing tier)
- Search with instant results
- Utility detail page with tabs: Overview · Configuration · Analytics · Billing · Permissions
- Drag-and-drop utility bundling for client packages
- Bulk actions toolbar

### 5. Client & Reseller Portal
- Client roster table with inline actions and status pills
- Per-client usage analytics with date range picker
- White-label customization panel (logo upload, brand colors, custom domain)
- Invoice and subscription management
- Contract and document vault

### 6. Billing & Revenue
- Revenue dashboard with MRR/ARR breakdowns
- Subscription management table
- Payment method management
- Invoice history with download actions
- Tax and compliance settings

### 7. Settings & Admin
- Team management with role-based access (Owner, Admin, Member, Viewer)
- API key generator with copy-to-clipboard and revoke
- Webhook configuration and testing
- Audit log viewer with filters
- Integration marketplace
- Security settings (2FA, session management, IP allowlist)

---

## ✨ Signature Interactions & Micro-Animations

- Smooth page transitions (Framer Motion style, 200–300ms easing)
- Hover elevations on cards (subtle scale 1.02 + shadow lift)
- Skeleton loaders instead of spinners
- Toast notifications sliding in from top-right
- Animated number counters on KPIs (count-up on scroll into view)
- Cursor-follow gradient glow on hero CTA
- Tooltips with 150ms delay, arrow pointers
- Sidebar collapse animation (250ms cubic-bezier)
- Tab underline slide transitions
- Modal fade + scale entrance

---

## 🎨 Graphics & Illustrations

- Custom isometric illustrations for empty states (no generic Undraw)
- Abstract 3D renders for feature sections (Spline or Blender aesthetic)
- Data visualization using Recharts, D3, or Tremor with custom styling
- Subtle grain/noise texture on backgrounds for depth
- Animated SVG patterns in hero (grid, dots, or mesh gradient)
- Gradient mesh backgrounds for section dividers
- Custom animated logo mark

---

## 📱 Responsive & Accessibility Requirements

### Breakpoints
- Mobile: 375px
- Tablet: 768px
- Laptop: 1024px
- Desktop: 1440px
- Wide: 1920px+

### Accessibility
- WCAG 2.1 AA compliance minimum
- Contrast ratios: 4.5:1 body, 3:1 large text
- Full keyboard navigation with visible focus states
- ARIA labels on all interactive elements
- Screen reader-friendly semantic HTML
- Reduced-motion support via `prefers-reduced-motion`
- RTL language support ready

---

## 🧩 Component Library Checklist

- [ ] Buttons (primary, secondary, ghost, destructive, icon-only) with 5 sizes
- [ ] Input fields (text, email, password, search, textarea) with validation states
- [ ] Dropdowns and combo boxes with keyboard nav
- [ ] Checkboxes, radios, switches, and sliders
- [ ] Cards (default, interactive, stat, feature)
- [ ] Tables with sorting, pagination, and row selection
- [ ] Modals, drawers, and sheets
- [ ] Tabs (horizontal and vertical)
- [ ] Breadcrumbs and pagination
- [ ] Avatars (with status indicators) and avatar groups
- [ ] Badges, chips, and status pills
- [ ] Progress bars and circular progress
- [ ] Tooltips and popovers
- [ ] Alerts and banners
- [ ] Command palette (⌘K)
- [ ] Date and range pickers
- [ ] File upload with drag-and-drop
- [ ] Empty states with illustrations
- [ ] Loading skeletons
- [ ] Toast notifications

---

## 📦 Deliverables

1. **Figma file** with organized pages, components, and auto-layout
2. **Design tokens** (colors, typography, spacing) exported as JSON
3. **Component library** with variants and interactive prototypes
4. **Mobile and desktop mockups** for all core screens
5. **Brand style guide** PDF
6. **Exportable assets** (SVGs, PNGs @2x, favicon set, OG images)
7. **Motion spec doc** detailing all animations and transitions
8. **Handoff documentation** for developers

---

## 🚀 Success Criteria

The final design should feel like it belongs next to **Linear, Vercel, Stripe Dashboard, and Notion** in a showcase — not like a template. Every pixel should justify the product's premium positioning.

When a business owner sees the demo, they should think:
> *"I need this, and I trust this team to handle my operations."*

### Tone
Confident · Modern · Trustworthy · Slightly futuristic · Never playful or childish.

### Inspiration Benchmarks
- **Linear.app** — for clarity and keyboard-first UX
- **Vercel.com** — for dark mode polish and typography
- **Stripe.com/dashboard** — for dense data UX
- **Raycast.com** — for product storytelling
- **Arc.net** — for bold brand expression
- **Framer.com** — for marketing page flow
- **Attio.com** — for enterprise SaaS feel

---

## 🛠️ Recommended Tech Stack (Optional Dev Reference)

- **Framework:** Next.js 14+ (App Router) or Remix
- **Styling:** Tailwind CSS + CSS variables for theming
- **Components:** shadcn/ui + Radix primitives
- **Animation:** Framer Motion
- **Charts:** Recharts or Tremor
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **State:** Zustand or TanStack Query
- **Auth:** Clerk, Auth.js, or Supabase Auth
- **Database:** PostgreSQL + Prisma / Drizzle
- **Deployment:** Vercel or Railway

---

## 📝 Customization Notes

Replace the following placeholders when adapting this prompt for a specific vertical:

- **Utility type** → e.g., "API management," "IoT device management," "billing automation"
- **Target buyer** → e.g., "agencies," "enterprise IT," "fintech operators"
- **Primary CTA** → e.g., "Start Free Trial," "Request Demo," "Get a Quote"
- **Pricing tiers** → customize based on your commercial strategy

---

## 📄 License & Usage

This prompt document is yours to reuse, modify, and distribute across your projects. Keep a version history as you refine it — great briefs evolve with each build.

**Version:** 1.0
**Last updated:** 2026
