# VantaWebworks Website

Next.js + Tailwind CSS website, backed by Supabase (Postgres, Auth, Storage) and deployed via Vercel.

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Database/Auth/Storage:** Supabase
- **Hosting:** Vercel
- **Package manager:** npm

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See `.env.example` for the full list. Required for local dev:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

`.env.local` is git-ignored and must never be committed. Set the same variables
in your Vercel project settings for deployed environments.

## Database migrations (Supabase)

All schema changes live as SQL files in `supabase/migrations/`, version-controlled
alongside the app code.

### One-time setup

```bash
# Log in to Supabase (opens a browser)
npx supabase login

# Link this repo to your Supabase project (replace with your project ref,
# found in Dashboard > Project Settings > General > Reference ID)
npx supabase link --project-ref <your-project-ref>
```

### Creating a new migration

```bash
npx supabase migration new <short_description>
# edit the generated SQL file in supabase/migrations/
```

### Applying migrations

```bash
# Preview the SQL diff against the linked remote project first
npx supabase db diff --linked

# Apply pending migrations to the linked remote (hosted) project
npx supabase db push

# Or, for local development with Docker:
npx supabase start
npx supabase db reset
```

Never run `db push` against production without reviewing the generated SQL first.

## Deployment (Vercel)

1. Import this GitHub repository into Vercel.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as
   Environment Variables in the Vercel project settings (Production, Preview,
   and Development as needed).
3. Vercel auto-detects Next.js — no custom build settings required.
4. Every push to the connected branch triggers a deployment.
