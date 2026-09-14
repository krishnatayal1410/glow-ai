# Munaffa Clean Rebuild

This directory is a complete reset of the Munaffa implementation.

Nothing from the previous Munaffa V2, V3, V4, or V5 public-site implementations is reused here.

## Product thesis
Munaffa is a Profit and Operations OS for restaurants and hospitality food-and-beverage teams.

Core loop:
Guest -> Table -> Order -> Staff -> Kitchen -> Recipe -> Inventory -> Supplier -> Payment -> Feedback -> Repeat Guest -> Profit Intelligence

Every role must read and write to the same restaurant state.

## Canonical working story
1. Guest sits at Table 12.
2. Guest or waiter adds 2 Paneer Tikka.
3. The order enters one shared order engine.
4. Kitchen receives the same ticket.
5. KDS moves New -> Preparing -> Ready -> Served.
6. Recipe consumption creates stock-ledger movements.
7. Bill and payment update sales and contribution.
8. Guest visit and feedback update CRM.
9. Owner metrics recalculate.
10. Profit Leak Engine explains the rupee impact and evidence behind alerts.

## Product surfaces
- Cinematic public website
- Customer / Guest PWA
- Owner Command Center
- Manager Control Center
- Cashier / POS
- Waiter / Serve
- Kitchen / KDS
- Stock / Inventory
- Munaffa HQ Admin
- Native iOS / Android app

## Technical direction
- Next.js / React / TypeScript
- React Three Fiber + Three.js
- Blender-authored production assets
- GSAP ScrollTrigger
- Lenis only where appropriate
- PostgreSQL via Supabase
- Supabase Auth and Realtime
- Offline-capable local queue for restaurant operations
- Expo / React Native
- Shared event-driven restaurant state

## Visual rules
- no decorative primitive cubes, spheres, cylinders, or floating boxes
- no blurred-glass visual language
- no photo-stack pretending to be 3D
- no repeated hero scene across routes
- no generic dark-neon SaaS style
- crisp materials and physically plausible lighting
- real-world scale
- authored cinematic camera paths
- scroll-scrubbed reversible motion
- text integrated into spatial storytelling
- operational product UI stays fast and task-oriented

## Status
Fresh rebuild initialized on branch `munaffa-rebuild-v1` from repository `main`.
