# QuickSpend AI

A dark, minimal, premium dashboard for tracking quick-commerce spend across
**Blinkit, Zepto, Instamart, and BigBasket** — impulse tax, price creep, time
patterns, and recurring baskets, all in one place.

This is an MVP: the frontend is fully functional against seeded mock data out
of the box, and wires up to Supabase + Vercel Blob for real persistence when
configured.

## Stack

- **Next.js 14 (App Router)** + **TypeScript**
- **Tailwind CSS** — dark, glassy, purple/lime accent design system
- **Supabase** — Postgres schema + API routes (falls back to mock data if unset)
- **Vercel Blob** — stores uploaded screenshots / PDF invoices
- **Recharts** — spend trend, platform breakdown, hourly/day-of-week charts

## Pages

| Route | Purpose |
|---|---|
| `/dashboard` | Total spend, impulse tax, late-night orders, trend, breakdowns, alerts |
| `/import` | Drag-and-drop upload → mock OCR extraction → editable review → save |
| `/orders` | Searchable, filterable list of all orders with item-level detail |
| `/insights/impulse-tax` | Impulse spend by category, platform, and item |
| `/insights/price-creep` | Items that have quietly gotten more expensive over time |
| `/insights/time-patterns` | Spend by hour of day / day of week, late-night orders |
| `/recurring` | Detected recurring staples with next-expected-order date |
| `/settings` | Profile, connected platforms, preferences, upcoming integrations |

## Data model

Defined in [`supabase/schema.sql`](./supabase/schema.sql):

- `users` — mirrors `auth.users`, extended with profile fields
- `platforms` — Blinkit / Zepto / Instamart / BigBasket
- `categories` — grocery/snack/household taxonomy
- `orders` — one row per placed order
- `order_items` — line items with a `classification` label
- `recurring_items` — detected repeat-purchase patterns
- `import_jobs` — upload → extraction lifecycle

Classification labels (`classification_label` enum): `Planned Grocery`,
`Impulse Buy`, `Junk/Snack`, `Recurring Staple`, `Household Need`, `Unclear`.

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in Supabase/Blob keys, or leave blank for mock mode
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to
`/dashboard`.

**Mock mode**: if `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
are not set, every page and API route transparently falls back to the seed
data in `lib/mock-data.ts`. The entire product is explorable with zero backend
setup.

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run [`supabase/schema.sql`](./supabase/schema.sql).
3. Copy your Project URL, anon key, and service role key into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
4. API routes (`app/api/**`) use the service-role key server-side to read and
   write `orders` / `order_items` / `import_jobs`. RLS policies are already
   defined in the schema for when you add real end-user auth (Supabase Auth) —
   they're scoped to `auth.uid()` on every user-owned table.

## Connecting Vercel Blob

1. In your Vercel project, go to **Storage → Create Database → Blob**.
2. Copy the `BLOB_READ_WRITE_TOKEN` into `.env.local` / your Vercel project's
   environment variables.
3. Uploaded screenshots/invoices from `/import` are stored there; if the token
   is absent, the import flow still works end-to-end (it just skips the
   upload step and runs mock extraction directly on the file name).

## Deploying to Vercel

```bash
npm install -g vercel   # if you don't already have it
vercel
```

Or via the dashboard:

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables from `.env.example` in **Project Settings →
   Environment Variables** (Supabase + Blob keys — safe to leave blank to
   ship in mock mode first).
4. Deploy. Framework preset is auto-detected as Next.js.

## What's mocked (by design, for this MVP)

Search the codebase for `TODO(` to find every seam:

- **`TODO(real-ocr)`** — `/import` uses `mockParseReceipt()` in
  `lib/mock-data.ts` instead of real OCR. Swap in Google Vision / AWS Textract
  for screenshots and `pdf-parse` + an LLM extraction pass for PDF invoices.
- **`TODO(gmail-import)`** — no Gmail OAuth/ingestion yet; see `/settings` for
  the planned entry point.
- **`TODO(native-share)`** — no native share-sheet target yet, so you can't
  share a receipt directly from the Blinkit/Zepto/Instamart/BigBasket apps.
  See `/recurring` and `/settings` for the planned entry points.

All analytics (impulse tax %, price creep, recurring detection, time
patterns) are computed live from order data in `lib/mock-data.ts` — they are
real aggregation logic running over seed data, not hardcoded numbers, so they
keep working unchanged once real orders replace the seed set.

## Project structure

```
app/                    Routes (App Router) + API handlers
  api/                  REST endpoints: orders, import, recurring, insights
  dashboard/ import/ orders/ insights/ recurring/ settings/
components/
  ui/                   Card, StatCard, Badge, Button, Toggle
  layout/               Sidebar, MobileNav, PageHeader
  charts/               Recharts wrappers (trend, breakdown, sparkline, etc.)
  dashboard/ import/ orders/ settings/   Feature-specific components
lib/
  types.ts              Shared domain types
  mock-data.ts           Seed data + all analytics computation functions
  data.ts                Data-access layer (Supabase, with mock fallback)
  supabase/              Browser/server/service-role Supabase clients
supabase/schema.sql      Full Postgres schema, RLS policies, seed data
```
