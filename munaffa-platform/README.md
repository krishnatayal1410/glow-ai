# Munaffa — Official v1

**Munaffa is the Profit & Operations OS for restaurants.**

The prototype connects the restaurant lifecycle from guest order to kitchen execution, inventory usage, purchasing, payment, feedback and owner-level profit intelligence.

## Repository layout

```text
munaffa-platform/
├── apps/
│   ├── web/                 # cinematic public website + browser operating product
│   │   ├── src/v2/          # current immersive site and operating OS
│   │   └── vite.config.js
│   └── mobile/              # Expo / React Native iOS + Android app
├── supabase/
│   ├── schema.sql           # PostgreSQL schema + RLS
│   └── seed.sql             # demo restaurant data
├── .env.example
└── README.md
```

## Technology

### Public website

- React 19
- Vite
- Three.js
- React Three Fiber
- Drei
- GSAP + ScrollTrigger
- Lenis
- Lucide

The public site is not a collection of static landing sections. A persistent 3D restaurant world responds to scroll and pointer movement. Each route has a separate camera path and six scroll-controlled narrative chapters.

### Restaurant operating product

The same web app contains interactive role workspaces for:

- Owner
- Outlet Manager
- Cashier / POS
- Waiter
- Kitchen / KDS
- Inventory / Stock
- Munaffa HQ internal admin
- Guest / QR ordering

### Mobile

- Expo SDK 57
- React Native 0.86
- React 19.2
- Expo SQLite-backed local auth persistence
- Supabase JS client
- EAS build configuration

The native app deliberately focuses on mobile-suitable roles: Owner, Manager, Waiter, Kitchen, Stock and Guest. Cashier/POS and HQ administration remain optimized for tablet/desktop web.

### Backend

- Supabase
- PostgreSQL
- Supabase Auth
- Row Level Security
- role memberships
- relational restaurant data model

Core entities include restaurants, outlets, tables, staff memberships, menu items, ingredients, recipes, recipe components, orders, order items, KDS tickets, suppliers, purchase orders, inventory movements, waste, customers, visits, feedback, expenses and audit events.

## Public website routes

```text
#home
#platform
#profit
#operations
#inventory
#guest
#ai
#integrations
#customers
#resources
#pricing
#about
#contact
```

Each route uses a route-specific camera profile instead of replaying one generic 3D animation.

## Operating product routes

```text
#app/owner
#app/manager
#app/cashier
#app/waiter
#app/kitchen
#app/stock
#app/admin
#app/guest
```

## Run the cinematic web app

```bash
cd munaffa-platform/apps/web
npm install
cp ../../.env.example .env
npm run dev
```

Open the Vite URL printed in the terminal.

The browser prototype works in demo mode even when Supabase variables are empty.

## Configure Supabase

Create a Supabase project and run:

```text
munaffa-platform/supabase/schema.sql
munaffa-platform/supabase/seed.sql
```

Then create `munaffa-platform/apps/web/.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

For mobile use:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Never ship the Supabase service-role key in a browser or mobile build.

## Run the iOS / Android app

```bash
cd munaffa-platform/apps/mobile
npm install
npx expo start
```

Then open it with Expo Go where supported, an Android emulator, or an iOS simulator/development build.

Native development commands:

```bash
npm run android
npm run ios
```

## Prepare App Store / Play Store builds

The project already contains `app.json` and `eas.json` with bundle/package identifier `com.munaffa.app`.

Before signed store builds:

1. Create/link an Expo EAS project and replace `REPLACE_WITH_EAS_PROJECT_ID`.
2. Sign in to EAS.
3. Configure Apple Developer and Google Play credentials.
4. Add production Supabase environment variables/secrets.
5. Build with EAS production profile.

Example after account setup:

```bash
npx eas-cli build --platform ios --profile production
npx eas-cli build --platform android --profile production
```

Store submission still requires the startup's actual Apple Developer and Google Play Console accounts.

## Cinematic experience architecture

The web experience uses one persistent restaurant universe containing multiple moving systems rather than one decorative 3D object:

```text
receipt / sales
      ↓
table + guest phone
      ↓
order ticket
      ↓
kitchen / KDS
      ↓
ingredients + pantry
      ↓
inventory / variance
      ↓
financial particle flow
      ↓
profit / leakage core
      ↓
owner command center
```

Scroll scrubs camera travel and scene state. Pointer movement adds depth. Opening the navigation changes the camera to a restaurant-map view. Route changes use a transition curtain, and route-specific 3D systems become dominant depending on the story being shown.

## Prototype interactions already implemented

Web browser verification covers:

- 3D canvas rendering
- adaptive DPR budget
- full-screen navigation
- all 13 public routes
- six cinematic chapters per route
- all eight operating roles
- POS item entry
- kitchen ticket progression
- customer cart interaction

The Owner workspace also includes Command Center, Live Restaurant, Profit/Leakage, Inventory, CRM and Reports views. Manager includes Today, Floor, Approvals and Shift. Stock includes inventory, receiving, counts, waste and purchasing.

## Automated verification

GitHub Actions runs three independent jobs on the `munaffa-official-v1` branch:

```text
verify-web
verify-mobile
verify-database
```

The web job performs a production Vite build and Chromium interaction test. Mobile runs Expo Doctor. Database checks verify the migration/RLS files.

## Production boundary

This repository is a **working full product prototype**, not a claim that every external production service is already live.

A hosted Supabase project has not been provisioned from this repository because database account credentials are intentionally not committed. The browser and mobile apps therefore include demo data/state and the Supabase connection path. Real payments, Swiggy/Zomato, WhatsApp, accounting integrations, transactional email/SMS, production AI inference, signed app-store binaries and restaurant hardware connections require the corresponding provider accounts, APIs and secrets.

Those external credentials should be connected after the product direction and first restaurant pilot are validated.
