# Cabin Scout Portal — Claude Code Context

A gated web portal for Cabin's external referral partners ("scouts"). Scouts submit and track referrals, access sales enablement content, and view company events. Live at `scout.cabinco.com`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | Clerk |
| CMS | Sanity v3 |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel (auto-deploys from `main`) |
| Package Manager | pnpm |

---

## Project Structure

```
app/
  (auth)/sign-in, sign-up
  (portal)/                   # All gated routes — Clerk auth required
    layout.tsx                # Sidebar + topnav shell
    dashboard/page.tsx
    reports/page.tsx + [slug]/page.tsx
    articles/page.tsx + [slug]/page.tsx
    playbook/page.tsx + [slug]/page.tsx
    assets/page.tsx
    events/page.tsx + [slug]/page.tsx
    referrals/page.tsx
  api/
    referrals/route.ts        # POST — create referral
    referrals/[id]/route.ts   # GET — fetch scout's referrals
components/
  layout/                     # Sidebar, TopNav, MobileNav
  ui/                         # Badge, Button, Card, Skeleton, Toast, EmptyState, CopyButton
  dashboard/                  # StatCard, QuickActions
  content/                    # ArticleCard, ReportCard, EventCard, PlaybookSidebar, AssetCard
  referrals/                  # ReferralForm, ReferralTable
lib/
  sanity/                     # Sanity client + GROQ queries
  supabase/                   # Supabase client + referral helpers
sanity/schemas/               # report, article, playbookPage, asset, event
middleware.ts                 # Clerk auth guard
```

---

## Authentication — Clerk

- All `/dashboard`, `/reports`, `/articles`, `/playbook`, `/assets`, `/events`, `/referrals` routes protected via `middleware.ts`
- Unauthenticated users redirect to `/sign-in`
- Access is invite-only — Cabin admin sends invite links via Clerk dashboard
- Scout's Clerk `user.id` is used as `scout_id` in all Supabase queries
- Clerk JWT authenticates Supabase queries via RLS

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPortalRoute = createRouteMatcher([
  '/dashboard(.*)', '/reports(.*)', '/articles(.*)',
  '/playbook(.*)', '/assets(.*)', '/events(.*)', '/referrals(.*)'
])

export default clerkMiddleware((auth, req) => {
  if (isPortalRoute(req)) auth().protect()
})
```

---

## CMS — Sanity

Sanity Studio is embedded at `/studio`. Content managed by Brad (Head of Marketing). A revalidation webhook on publish hits `/api/revalidate` to clear ISR cache.

### Schemas

- **report**: `title, slug, publishedDate, coverImage, summary, body, pdfDownload`
- **article**: `title, slug, publishedDate, category (Strategy|Engineering|Design|AI|Salesforce), coverImage, summary, body, featured`
- **playbookPage**: `title, slug, section (Pitching|ICP|Objections|FAQ|Competitive), body, order`
- **asset**: `title, description, category (One-Pager|Email Template|Case Study|Video|Brand), file, videoUrl, thumbnail, copyableText`
- **event**: `title, slug, eventType (Webinar|In-Person|Workshop|Conference), date, endDate, location, registrationUrl, coverImage, summary, body, featured`

### Key GROQ Queries

```groq
// Dashboard
{
  "latestReport": *[_type == "report"] | order(publishedDate desc) [0] { title, slug, publishedDate, summary, coverImage },
  "recentArticles": *[_type == "article"] | order(publishedDate desc) [0..2] { title, slug, publishedDate, category, summary, coverImage },
  "upcomingEvents": *[_type == "event" && featured == true && date > now()] | order(date asc) [0..1] { title, slug, date, eventType, location, registrationUrl, summary }
}

// Articles filtered by category
*[_type == "article" && category == $category] | order(publishedDate desc) { title, slug, publishedDate, category, summary, coverImage, featured }

// Playbook pages
*[_type == "playbookPage"] | order(section asc, order asc) { title, slug, section, order }
```

---

## Database — Supabase

### `referrals` table

```sql
id                uuid primary key default gen_random_uuid()
scout_id          text not null           -- Clerk user.id
prospect_name     text not null
company           text not null
email             text not null
phone             text
service_interest  text                    -- Strategy & Innovation | Product Design | Software Engineering | Salesforce & Business Systems | Not Sure
notes             text
status            text not null default 'submitted'
created_at        timestamptz default now()
updated_at        timestamptz default now()
```

### Status flow (Cabin manages internally)
`submitted` → `contacted` → `in_conversations` → `proposal_sent` → `closed_won` → `closed_lost`

### Status badge colors
- `submitted` = gray, `contacted` = blue, `in_conversations` = yellow
- `proposal_sent` = purple, `closed_won` = green, `closed_lost` = red

### Row Level Security
- Scouts can only read/insert their own rows (`scout_id = requesting_user_id()`)
- Cabin updates status via service role key (bypasses RLS)

---

## Rendering Strategy

| Route | Strategy |
|---|---|
| `/dashboard`, `/referrals` | SSR — live Supabase data per scout |
| `/reports`, `/articles`, `/events`, `/assets` | ISR (60s) — CMS content |
| `/reports/[slug]`, `/articles/[slug]`, `/events/[slug]` | ISR (60s) |
| `/playbook/[slug]` | SSG + on-demand revalidation |

---

## Page Specs

### Dashboard
- Greeting: "Hey [First Name] 👋"
- 3 stat cards: Referrals Submitted, Active, Closed Won (from Supabase)
- Latest report card, 3 recent article cards, upcoming featured event callout (from Sanity)
- Quick actions: Submit a Referral, Browse Assets, Read the Playbook
- Loading skeletons on all async components; empty state for new scouts

### Reports
- Grid sorted newest first; card: cover image, month/year, summary, "Read Report" CTA
- Individual page: rich text + optional PDF download

### Articles
- Filterable grid by category; featured article shown as hero
- Individual page: rich text + copy-URL share button

### Playbook
- Left sidebar nav by section; rich text content per page
- Sidebar collapses to dropdown on mobile

### Assets
- Filterable grid by category
- PDFs → Download; Email/LinkedIn templates → Copy to Clipboard + success toast; Videos → inline embed

### Events
- Upcoming first (asc), past events collapsed under toggle; filter by type
- Card: cover image, event type badge, date, location, summary, Register button
- Individual page: full details + registration CTA + share link

### Referrals
- Form: Prospect Name, Company, Email, Phone (optional), Service Interest (dropdown), Notes (optional)
- On submit: success toast + form reset + new row in table below
- Table: Prospect Name, Company, Service Interest, Date Submitted, Status badge

---

## Environment Variables

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
SANITY_REVALIDATE_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## Key Architectural Rules

- **Sanity only for CMS content** (articles, reports, playbook, assets, events). Never store this in Supabase.
- **Supabase only for referral data.** Clean separation of concerns.
- **Clerk is the single source of truth for identity.** `user.id` is `scout_id` everywhere.
- **No custom admin UI for MVP.** Cabin manages scouts in Clerk dashboard and referral statuses directly in Supabase.
- **No commission tracking or payment features** — off-platform.
- **No community message board** — post-MVP.
- Placeholder content at launch; real content migrated after project approval.

---

## Post-MVP Roadmap

**Phase 2:** Commission tracker, scout leaderboard (opt-in), email digest on new content
**Phase 3:** Salesforce CRM sync for referral status, scout analytics for Cabin admins, personalized content recommendations
**Community board (evaluate post-launch):** Circle.so/Discord embed (~1d), lightweight announcements feed (~3-5d), or full custom Supabase Realtime build (~2-3w)
