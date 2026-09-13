# Munaffa — Official v1

Munaffa is a profit and operations OS for restaurants. This repository contains:

- `apps/web`: immersive 3D marketing website plus the multi-role restaurant operating prototype.
- `apps/mobile`: Expo/React Native app for owner, manager, waiter, kitchen, stock and guest workflows.
- `supabase`: PostgreSQL schema, row-level security policies and demo seed data.

## Web

```bash
cd apps/web
npm install
cp ../../.env.example .env
npm run dev
```

The web app works in demo mode without Supabase. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to activate hosted auth/data.

## Mobile

```bash
cd apps/mobile
npm install
cp ../../.env.example .env
npx expo start
```

For production binaries use EAS after replacing `extra.eas.projectId` and configuring Apple/Google signing credentials.

## Database

Create a Supabase project, run `supabase/schema.sql`, then `supabase/seed.sql`. Keep RLS enabled. Never expose a service-role key in web or mobile clients.

## Product surfaces

Public: Home, Product, Profit OS, Operations, Inventory, Guest Experience, AI, Pricing, About/Trust.

Operations: Owner Command Center, Outlet Manager, Waiter, Kitchen Display, Stock/Receiving, Munaffa HQ admin, Customer QR ordering.

## Important prototype boundary

The repository is a working product prototype with a real Supabase data model and live-client integration path. Store publishing and a hosted Supabase project require external accounts, signing credentials and environment variables that are intentionally not committed.
