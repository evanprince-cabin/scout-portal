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
  (portal)/                      # All gated routes — Clerk auth required
    layout.tsx                   # Sidebar + topnav shell
    dashboard/page.tsx
    reports/page.tsx + [slug]/page.tsx
    articles/page.tsx + [slug]/page.tsx
    playbook/page.tsx + [slug]/page.tsx
    assets/page.tsx
    events/page.tsx + [slug]/page.tsx
    referrals/page.tsx
    case-studies/page.tsx        # Client component — multi-select filters, card grid
  api/
    referrals/route.ts           # POST — create referral
    referrals/[id]/route.ts      # GET — fetch scout's referrals
    favorites/route.ts           # GET — fetch bookmarks; POST — add bookmark
    favorites/[id]/route.ts      # DELETE — remove bookmark
components/
  layout/                        # Sidebar, TopNav, MobileNav
  ui/                            # Badge, Button, Card, Skeleton, Toast, EmptyState, CopyButton, ShareButton, EventModal, AssetModal
  dashboard/                     # FavoritesSection, FavoriteCard, AddFavoritesDrawer, EventCardActions, QuickActions
  content/                       # ArticleCard, ReportCard, EventCard, PlaybookSidebar, AssetCard, CaseStudyCard, CaseStudyFilters
  referrals/                     # ReferralForm, ReferralTable
lib/
  sanity/                        # Sanity client + GROQ queries
  supabase/                      # Supabase client + referral helpers + favorites helpers
sanity/schemas/                  # report, article, playbookPage, asset, event, caseStudy
middleware.ts                    # Clerk auth guard
```

---

## Navigation Structure

Defined in `components/layout/Sidebar.tsx` as `navSections`. Both desktop sidebar and mobile drawer render from this same data structure via `SidebarContent`.

```
OVERVIEW
  Home               /dashboard       LayoutDashboard

RESOURCES
  Reports            /reports         FileText
  Case Studies       /case-studies    BookMarked
  Playbook           /playbook        Map
  Assets             /assets          FolderOpen

COMMUNITY
  Events             /events          Calendar

MY SCOUT
  Referrals          /referrals       Send
```

**Articles has been removed from the sidebar nav.** The articles route (`/articles`) still exists but is no longer linked in navigation.

---

## Design System

### Color Palette (Tailwind config)
- `cabin-charcoal` — primary dark text, headings
- `cabin-stone` — secondary text, muted labels
- `cabin-linen` — sidebar background, warm off-white
- `cabin-mauve` — hover states, subtle backgrounds
- `cabin-maroon` — primary CTA, active nav item background
- `cabin-flame` — accent color (underlines, icon highlights)
- `cabin-sky` / `cabin-indigo` — report/blue accent
- `cabin-gold` — asset/download accent

### Layout
- **Sidebar**: `w-60`, `bg-cabin-linen`, fixed left, hidden on mobile. Active nav item: `bg-cabin-maroon text-white rounded-full`.
- **Mobile**: Top bar with hamburger, slides in `w-72` drawer overlay with close button.
- **Content panel**: Inset from sidebar (`lg:pl-60`), padded content area.
- **Page wrapper**: `space-y-8 page-enter` on the root div of each page.

### Typography
- Headings: `font-geist font-bold`
- Body / labels: `font-inter`
- Section labels: `text-xs font-semibold uppercase tracking-widest text-cabin-stone`
- Page titles: `font-geist font-bold text-3xl tracking-tight text-cabin-charcoal` (most pages) or `text-4xl lg:text-5xl` (dashboard)

### Badge Variants
Defined in `components/ui/Badge.tsx`:
- Referral status: `submitted` = gray, `contacted` = blue, `in_conversations` = yellow, `proposal_sent` = purple, `closed_won` = green, `closed_lost` = red
- Article category: `strategy`, `engineering`, `design`, `ai`, `salesforce`
- Event type: `webinar`, `in-person`, `workshop`, `conference`
- Fallback: `stone`

### Cards
- Standard card: `bg-[#FDFDFD] border border-cabin-stone/20 rounded-2xl`
- Hover: `hover:shadow-md hover:border-cabin-stone/40 transition-all duration-150`

---

## Page Specs

### Dashboard (`force-dynamic`, SSR)

**Header:**
- Top row: `FIELD STATUS • Q1 2026` label (left, `text-xs font-semibold uppercase tracking-widest`) + `Send a Referral →` pill button linking to `/referrals` (right, `bg-cabin-maroon rounded-full`)
- Title: `Welcome back [First Name].` — `text-4xl lg:text-5xl font-bold font-geist` — first name from Clerk `currentUser()`, no emoji
- Accent underline: `border-b-2 border-cabin-flame` — `inline-block` wrapper so the underline hugs the text width

**Page spacing** (explicit margins, not `space-y`):
- Header → Quick Actions: `mt-8` (2rem)
- Quick Actions → Bookmarks: `mt-16` (4rem)
- Bookmarks → content sections: `mt-16` (4rem)
- Between content sections (Upcoming Events / Recently Added / Dive Deeper): `space-y-14` (3.5rem)

**Quick Actions** (3 cards, `grid-cols-1 sm:grid-cols-3 gap-4`):
- Each card: `py-3 px-3 rounded-2xl` — icon container `p-3.5 rounded-lg`, icon `w-5 h-5`

**Bookmarks section** (below Quick Actions):
- Labeled **Bookmarks** (`text-xs font-semibold uppercase tracking-widest text-cabin-stone`)
- Grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3` (max 6 bookmarks)
- "Add bookmark" card renders as the last grid item when fewer than 6 bookmarks exist — dashed border (`border-dashed border-cabin-stone/30`), `BookmarkPlus` icon + "Add bookmark" label centered, `hover:bg-cabin-mauve/40`. Disappears at cap.
- Each `FavoriteCard`: grey icon + type label inline on top row, title below, optional "Popular with teammates" tag (`Users` icon) if `popular === true`; X remove button `absolute top-2 right-2`
- **Default bookmark for new users**: `getFavoritesWithDefaults()` seeds the "Cabin Capabilities Overview" playbook page on first login. Returning users unaffected.
- **AddFavoritesDrawer**: slides in from right (`w-96`), tabs for Assets / Reports / Case Studies / Playbook. Already-bookmarked items show filled Bookmark icon. Items with `popular: true` show Users icon + "Popular" label. Cap at 6: shows warning, disables adding.
- `popular` field: Sanity editors toggle per content item; flows through GROQ → drawer → API → Supabase `favorites.popular` column → card display.

**Single-column content sections** (full width, in order):
- **Upcoming Events** — up to 2 featured upcoming events (`featured == true && date > now()`). Each card uses `absolute inset-0 z-0` Link to detail page. Layout: date block (large day number + month abbr in `bg-cabin-mauve rounded-xl`) on left; event type badge + location pill + title + time/location + summary on right; `EventCardActions` client component on right (handles `stopPropagation`). "View all events →" link in section header.
- **Recently Added** — (formerly "Activity Feed") card (`p-4`). Merges top 3 most recently created items across all 5 Sanity types (`report`, `article`, `playbookPage`, `asset`, `event`), sorted by `_createdAt` desc in JS. Each row is a `<Link>` routing to the item's detail page. Row: colored dot + `text-xs` type label + `text-base font-semibold` title + "Added • [date]". Dot colors: report=`bg-cabin-indigo`, article=`bg-emerald-400`, playbookPage=`bg-purple-400`, asset=`bg-amber-400`, event=`bg-amber-400`. Row hover: `hover:bg-cabin-mauve/30 rounded-xl`.
- **Dive Deeper** — two cards side by side (`grid-cols-1 sm:grid-cols-2 gap-3`): "Recorded Tech Talks" (PlayCircle icon → `https://www.youtube.com/@cabinco`, `target="_blank"`), "Study the Playbook" (BookOpen icon → `/playbook`). Both use dot-pattern hover overlay.

### Reports (`'use client'`, client-side fetch)
- Fetches all reports from Sanity via `getReports()` in a `useEffect`
- Reports grouped by year into collapsible accordion sections, sorted by year descending
- Most recent year open by default; `Record<number, boolean>` state tracks open/closed per year
- Clicking the year header row toggles the section; smooth expand/collapse via CSS `grid-template-rows` transition
- Each year section: `bg-[#F6F6F7] rounded-2xl`, header shows year label (`font-geist font-bold text-2xl text-cabin-maroon`) + `ChevronUp`/`ChevronDown` icon
- Cards grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4` — only renders cards that exist (no empty placeholders)
- Each card: `bg-white rounded-[14px] border border-cabin-stone/20 border-l-2 border-l-cabin-flame p-5 flex flex-col gap-2 min-h-[140px]` — entire card is a `<Link>` to `/reports/[slug]`
- Card layout: quarter label (`font-geist font-bold text-[32px] text-cabin-flame`), title (`font-inter text-sm font-medium text-cabin-charcoal line-clamp-2`), bottom row with publish date (`text-[11px] text-[#B0ABA6]`) and PDF download link (`<a target="_blank">` with Lucide `Download` icon, `stopPropagation` so it doesn't trigger card navigation)
- Hover: `hover:border-cabin-maroon/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`
- Individual page: rich text + optional PDF download

### Articles (ISR 60s)
- Filterable grid by category; featured article shown as hero
- Individual page: rich text + copy-URL share button
- **Not in sidebar nav** — accessible directly by URL only

### Playbook (SSG + on-demand revalidation)
- Left sidebar nav by section; rich text content per page
- Sidebar collapses to dropdown on mobile

### Assets (ISR 60s)
- Filterable grid by category: All, Email Template, Message, One-Pager, Video, Brand
- Cards use `components/content/AssetCard.tsx` — custom SVG icon per category, type badge (`#F0EBE3` pill, 10px Inter 700 uppercase `#4B0214`), title, description, date, action button. Card is fully clickable (opens `AssetModal`); action button click is wrapped in `stopPropagation`.
- Action logic: Email Template + Message → Copy to Clipboard (copies `copyableText`, shows "Copied!" 2s); One-Pager + Brand + Video → Download (links to `file.asset.url` with `download` attribute)
- Video no longer uses inline embed — treated as a downloadable file
- Clicking any card opens `AssetModal` (see below)
- `AssetModal` (`components/ui/AssetModal.tsx`): renders via `createPortal` at `document.body`, `z-[100]`. Props: `isOpen`, `onClose`, `title`, `description?`, `category`, `date?`, `fileUrl`, `videoUrl`, `copyableText`, `thumbnail?`. Enter animation: backdrop fades in, panel slides up (`translate-y-8 opacity-0 → translate-y-0 opacity-100`) over 300ms. Exit plays in reverse before unmounting. Escape key + backdrop click + X button close the modal. Preview section: Email Template/Message → `copyableText` in a scrollable `bg-cabin-linen` block; Video → `<iframe src={videoUrl}>` (only if `videoUrl` exists); One-Pager/Brand → `<Image>` from `thumbnail` via `urlFor` (fallback to "No preview available" if no thumbnail). Bottom bar: Copy to Clipboard or Download button styled as `bg-cabin-maroon` pill.

### Events (`'use client'`, client-side fetch)
- Fetches all events from Sanity via `getAllEvents()` in a `useEffect` (same pattern as Case Studies)
- Upcoming first (asc), past events collapsed under toggle; filter by event type
- Clicking a card opens `EventModal` — does **not** navigate to the detail page
- Card style matches dashboard event cards exactly: date block (`bg-cabin-mauve rounded-xl`, large day + month abbr), event type Badge + location pill, title, time · location, summary (`line-clamp-2`); `EventCardActions` on the right ("View on Meetup" button with `ExternalLink` icon + `stopPropagation`)
- Cards have `max-w-7xl` to prevent excessive stretching on wide viewports
- Individual detail page still exists at `/events/[slug]` (ISR 60s) — accessible via "View Full Details →" in the modal or direct URL
- `EventModal` (`components/ui/EventModal.tsx`): renders via `createPortal` at `document.body`, `z-[100]`. Props: `isOpen`, `onClose`, `title`, `slug`, `eventType`, `date`, `endDate?`, `location?`, `summary?`, `coverImage?`, `registrationUrl?`. Enter animation: backdrop fades in (`opacity-0 → opacity-100`), panel slides up (`translate-y-8 opacity-0 → translate-y-0 opacity-100`) over 300ms. Exit plays in reverse before unmounting. Escape key + backdrop click close the modal.

### Referrals (SSR)
- Form: Prospect Name, Company, Email, Phone (optional), Service Interest (dropdown), Notes (optional)
- On submit: success toast + form reset + new row in table below
- Table: Prospect Name, Company, Service Interest, Date Submitted, Status badge

### Case Studies (client component)
- `'use client'` page — filter state managed client-side with `useState`
- Fetches all case studies from Sanity via `getCaseStudies()` in a `useEffect`
- Industry and Service Type filters — multi-select `<select>` dropdowns in `CaseStudyFilters`; filters use `.includes()` since both fields are arrays on each document
- Unique filter options derived via `.flatMap()` + `Array.from(new Set(...))`
- Card grid: `grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl`
- If no results after filtering: `EmptyState` component
- `CaseStudyCard`: cover image (or `bg-cabin-mauve` placeholder), client label, title, description (`line-clamp-3`), industry + serviceType badges (renders defensively for both string and array), "View Case Study" `<a>` linking to `slideUrl` in new tab, "Download PDF" `<a>` (derives URL via `extractSlideUrls()` — replaces `/presentation/d/{id}` path with `/export/pdf`; hidden if ID can't be extracted)

---

## Authentication — Clerk

- All portal routes protected via `middleware.ts`
- Unauthenticated users redirect to `/sign-in`
- Access is invite-only — Cabin admin sends invite links via Clerk dashboard
- Scout's Clerk `user.id` is used as `scout_id` in all Supabase queries
- Clerk JWT authenticates Supabase queries via RLS
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPortalRoute = createRouteMatcher([
  '/dashboard(.*)', '/reports(.*)', '/articles(.*)',
  '/playbook(.*)', '/assets(.*)', '/events(.*)', '/referrals(.*)',
  '/case-studies(.*)'
])

export default clerkMiddleware((auth, req) => {
  if (isPortalRoute(req)) auth().protect()
})
```

---

## CMS — Sanity

Sanity Studio is embedded at `/studio`. Content managed by Brad (Head of Marketing). A revalidation webhook on publish hits `/api/revalidate` to clear ISR cache.

### Schemas

- **report**: `title, slug, publishedDate, quarter (Q1|Q2|Q3|Q4 — radio, required), year (number, required), coverImage, summary, body, pdfDownload, popular`
- **article**: `title, slug, publishedDate, category (Strategy|Engineering|Design|AI|Salesforce), coverImage, summary, body, featured`
- **playbookPage**: `title, slug, section (Pitching|ICP|Objections|FAQ|Competitive), body, order, popular`
- **asset**: `title, description, category (Email Template|Message|One-Pager|Slide Deck|Video|Brand), file, videoUrl, thumbnail, copyableText, popular`
- **event**: `title, slug, eventType (Webinar|In-Person|Workshop|Conference), date, endDate, location, registrationUrl, coverImage, summary, body, featured`
- **caseStudy**: `title, slug, client, description, industry (array of string — Aviation|Healthcare|Non-Profit|Professional Services|Technology|Retail), serviceType (array of string — Strategy & Innovation|Product Design|Software Engineering|Salesforce & Business Systems), coverImage, slideUrl (Google Slides share URL), featured, popular`

`popular` (boolean, default `false`) — when `true`, shows a "Popular with teammates" tag on the bookmark card and a "Popular" indicator in the Add Bookmark drawer. Supported on: report, playbookPage, asset, caseStudy.

### Key GROQ Queries

```groq
// Dashboard (getDashboardData)
{
  "latestReport": *[_type == "report"] | order(publishedDate desc) [0] { title, slug, publishedDate, quarter, year, summary, coverImage },
  "upcomingEvents": *[_type == "event" && featured == true && date > now()] | order(date asc) [0..1] { title, slug, date, eventType, location, registrationUrl, summary },
  "activityFeed": {
    "reports":      *[_type == "report"]      | order(_createdAt desc) [0..2] { "contentType": "report",      title, _createdAt, slug },
    "articles":     *[_type == "article"]     | order(_createdAt desc) [0..2] { "contentType": "article",     title, _createdAt, slug },
    "playbookPages":*[_type == "playbookPage"]| order(_createdAt desc) [0..2] { "contentType": "playbookPage",title, _createdAt, slug },
    "assets":       *[_type == "asset"]       | order(_createdAt desc) [0..2] { "contentType": "asset",       title, _createdAt },
    "events":       *[_type == "event"]       | order(_createdAt desc) [0..2] { "contentType": "event",       title, _createdAt, slug }
  }
}

// Articles filtered by category
*[_type == "article" && category == $category] | order(publishedDate desc) { title, slug, publishedDate, category, summary, coverImage, featured }

// Playbook pages (getAllPlaybookPages)
*[_type == "playbookPage"] | order(section asc, order asc) { title, slug, section, order, popular }

// All case studies (getCaseStudies)
*[_type == "caseStudy"] | order(_createdAt desc) {
  _id, title, slug, client, description, industry, serviceType, coverImage, slideUrl, featured, popular
}

// Featured case studies (getFeaturedCaseStudies)
*[_type == "caseStudy" && featured == true] | order(_createdAt desc) {
  _id, title, slug, client, description, industry, serviceType, coverImage, slideUrl
}

// All reports for Reports page (getReports)
*[_type == "report"] | order(year desc, quarter desc) {
  _id, title, slug, publishedDate, quarter, year, summary, popular,
  pdfDownload { asset-> { url } }
}

// All assets (getAllAssets)
*[_type == "asset"] {
  _id, title, description, category, copyableText, _createdAt, popular,
  file { asset-> { url, originalFilename } }, thumbnail
}
```

---

## Database — Supabase

### `favorites` table

```sql
id            uuid primary key default gen_random_uuid()
scout_id      text not null           -- Clerk user.id
content_type  text not null           -- 'asset' | 'report' | 'case_study' | 'playbook'
content_id    text not null           -- Sanity _id (asset/report/caseStudy) or slug (playbook)
title         text not null
slug          text                    -- null for assets
url           text                    -- slideUrl for case studies, null otherwise
popular       boolean not null default false
created_at    timestamptz default now()
```

- Max 6 bookmarks per scout (enforced in API route)
- New users are seeded with "Cabin Capabilities Overview" playbook page via `getFavoritesWithDefaults()` in `lib/supabase/favorites.ts`
- Helpers: `getFavorites`, `getFavoritesWithDefaults`, `addFavorite`, `removeFavorite`

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

### Row Level Security
- Scouts can only read/insert their own rows (`scout_id = requesting_user_id()`)
- Cabin updates status via service role key (bypasses RLS)

---

## Rendering Strategy

| Route | Strategy |
|---|---|
| `/dashboard`, `/referrals` | SSR (`force-dynamic`) — live Supabase data per scout |
| `/reports` | Client component — client-side fetch + accordion state |
| `/articles`, `/assets` | ISR (60s) — CMS content |
| `/events` | Client component — client-side fetch + modal state |
| `/reports/[slug]`, `/articles/[slug]`, `/events/[slug]` | ISR (60s) |
| `/playbook/[slug]` | SSG + on-demand revalidation |
| `/case-studies` | Client component — client-side fetch + filter state |

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

- **Sanity only for CMS content** (articles, reports, playbook, assets, events, case studies). Never store this in Supabase.
- **Supabase only for referral data.** Clean separation of concerns.
- **Clerk is the single source of truth for identity.** `user.id` is `scout_id` everywhere.
- **No custom admin UI for MVP.** Cabin manages scouts in Clerk dashboard and referral statuses directly in Supabase.
- **No commission tracking or payment features** — off-platform.
- **No community message board** — post-MVP.
- Placeholder content at launch; real content migrated after project approval.

---

## Outstanding Work

- **`components/dashboard/`** — `EventCardActions` client component added (handles RSVP `window.open` + `stopPropagation` for the event card); `StatCard` and `QuickActions` files may be stale/unused after dashboard redesign
- **`components/content/ReportCard.tsx`** — deleted; Reports page was rewritten as a client component with inline card rendering, making this component unused

---

## Common Fixes

```bash
# Clear Next.js build cache (fixes stale module / hydration errors)
rm -rf .next && pnpm dev

# Kill ports if dev server hangs
lsof -ti:3000 | xargs kill -9

# Re-install deps after lockfile changes
pnpm install
```

---

## Post-MVP Roadmap

**Phase 2:** Commission tracker, scout leaderboard (opt-in), email digest on new content
**Phase 3:** Salesforce CRM sync for referral status, scout analytics for Cabin admins, personalized content recommendations
**Community board (evaluate post-launch):** Circle.so/Discord embed (~1d), lightweight announcements feed (~3-5d), or full custom Supabase Realtime build (~2-3w)
**Meetup → Sanity event sync (planned):** Zapier automation mapping Meetup event fields (`title`, `date`, `endDate`, `location`, `summary`, `registrationUrl`) to the Sanity `event` schema. Cover image not required — the modal and card render gracefully without it.
