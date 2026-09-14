# Munaffa — Zero Rebuild Blueprint

Status: clean-slate rebuild. No code, layout, scenes, copy architecture, or visual system from the previous Munaffa branches is reused.

## 1. Product truth

Munaffa is a Restaurant Profit & Operations OS.

It is not primarily a QR menu, POS, restaurant marketplace, hotel PMS, generic dashboard, or AI analytics wrapper.

Its core promise is:

> Know where every rupee goes — from the guest's order to the kitchen, ingredients, stock, payment, repeat visit, and contribution.

The product must connect one restaurant event through every operational layer.

Canonical chain:

Guest → Table → Order → Waiter/POS → Kitchen → Recipe → Stock movement → Supplier cost → Payment → Feedback → CRM → Profit/Leakage → Owner action.

## 2. Canonical demo: Table 12

The entire prototype is judged on whether this works as one connected simulation.

1. Guest at Table 12 browses without mandatory login.
2. Guest places 2× Paneer Tikka + 1× Butter Chicken, or waiter enters the same order.
3. Order appears instantly for waiter/manager.
4. Same order creates station-routed KDS tickets.
5. Chef moves tickets New → Preparing → Ready.
6. Recipe engine calculates theoretical ingredient consumption.
7. Stock ledger records those expected movements.
8. Physical count / receiving / waste later determines actual consumption.
9. Ideal vs actual variance is calculated.
10. Bill and payment update sales and contribution.
11. Guest visit and consent-based profile update CRM.
12. Feedback updates service and guest insight.
13. Owner dashboard changes from the same transaction.
14. Leak Engine ranks the rupee impact of variance, waste, discount, void and supplier-price changes.

If step 2 does not cause steps 3–14, the prototype is not considered connected.

## 3. Public website — cinematic narrative

The public website is one continuous authored film controlled by scroll. It is not a set of sections with a 3D background.

### Master film: "Follow the Order"

#### Chapter 0 — Street / Arrival
- Night/evening exterior of an original Munaffa restaurant environment.
- Camera approaches entrance.
- Realistic reflections, signage, guests, subtle ambient motion.
- Copy is minimal: "A restaurant is a living system."
- Scroll physically controls the camera rail.

#### Chapter 1 — Table 12
- Camera enters restaurant and approaches a real table.
- Table marker 12 is visible physically in scene.
- Guest phone becomes a spatial interface only when relevant.
- QR is present but not mandatory; waiter and counter paths are visually represented too.
- Guest sends an order.

#### Chapter 2 — Order in motion
- Instead of cutting to another page, the order itself becomes the transition.
- Camera follows a visual order pulse/ticket through the restaurant.
- Waiter ownership and manager state appear as spatial overlays anchored to real objects.

#### Chapter 3 — Kitchen
- Camera moves through the service pass into a full commercial kitchen.
- Ticket lands on a KDS station.
- Tandoor / Curry / Bar / Dessert routing is visible.
- Chef progression changes the exact same order state.
- No floating generic cards; UI is attached to equipment/screens/physical context.

#### Chapter 4 — Ingredient / Recipe
- Paneer Tikka becomes the narrative object.
- Dish separates into recipe ingredients with photoreal meshes/materials.
- Amounts are functional data from the recipe engine, not decorative labels.

#### Chapter 5 — Stock / Receiving
- Camera travels into storeroom/cold room.
- Paneer stock changes based on the same order.
- Supplier delivery, goods receipt and shortage are shown in context.
- Ideal vs actual splits into two measurable paths.

#### Chapter 6 — Money
- Camera follows the plated dish back to the table.
- ₹349 sale decomposes into ingredient cost, fees, discount allocation and contribution.
- Waste/variance visually leaves the value stream as "leakage" only if actual data supports it.
- No claim of exact operating profit unless overhead inputs exist.

#### Chapter 7 — Owner
- Camera pulls upward from the real restaurant into a spatial operational model.
- Physical restaurant resolves into the Owner Command Center.
- The story ends on actions, not charts: "Fix ₹2,130 now" / "Paneer variance +₹816" / "Supplier price +8%."

#### Chapter 8 — Loop
- Payment → guest profile → feedback → repeat visit → forecast → better purchase → improved contribution.
- Returns visually to the front door, closing the loop.

## 4. Public routes — every route gets a different visual grammar

Do not reuse one hero model or one scene across tabs.

### /story
Continuous "Follow the Order" film above.

### /profit
Visual grammar: macro food + cost decomposition + evidence graph.
No dining-room hero.
Narrative: Dish price → recipe → purchase price → theoretical/actual → leak → action.

### /operations
Visual grammar: live service choreography.
Top-down floor transitions into waiter path, kitchen stations, expo, service timing.
No food-cost hero.

### /inventory
Visual grammar: receiving dock → dry store → cold room → prep → counts.
Focus on immutable stock movement ledger.

### /guest
Visual grammar: table-level human experience.
Restaurant-branded menu, waiter requests, optional QR, pay-at-table, feedback.

### /discover
Visual grammar: city/neighborhood discovery, map and venue stories.
Only a secondary product route. It must never dominate Munaffa's positioning.

### /restaurants
Operational story for independent restaurants and small groups.

### /cafes
Counter/pickup/repeat-guest story with its own café environment and pacing.

### /hotel-fb
Hotel F&B outlets only: restaurant, café, bar, banquet roll-up. Do not market Munaffa as a full PMS.

### /pricing
Conversion-first, low-3D, fast page. Clear tiers and ROI calculator.

## 5. Non-negotiable visual constraints

Never use these as primary visual language:
- primitive boxes/cubes/spheres/cylinders as fake architecture
- low-poly restaurant mockups
- random floating furniture on black backgrounds
- blurred full-page imagery
- backdrop-blur/glassmorphism as a substitute for hierarchy
- one fixed 3D object behind standard sections
- one identical scene reused across tabs
- giant decorative particles with no product meaning
- fake AI graphs or fake "live" metrics

Required launch-quality visual direction:
- original or properly licensed environment assets
- Blender-authored restaurant, café, kitchen, stock room and hotel F&B scenes
- physically based materials
- baked/global illumination where appropriate
- realistic scale
- authored camera splines
- KTX2 textures + Meshopt/Draco compression
- LOD/adaptive quality
- crisp UI compositing
- deliberate depth rather than blur

## 6. Brand system

### Public site
- cinematic, editorial, confident
- charcoal/ink + warm ivory + Munaffa green + material-specific warm accents
- serif only for large editorial storytelling moments
- sans-serif for all product/data copy
- typography animates through masks, spatial occlusion, perspective and tracking — not blur

### Restaurant OS
- warm-light operational SaaS
- information dense but calm
- no decorative 3D
- role-first navigation
- desktop/tablet optimized

### Staff apps
- one-hand operation
- large targets
- minimal text
- strong state colors
- offline resilient

### Guest app/PWA
- venue branding first
- no required account for browsing/ordering where restaurant policy allows
- QR optional
- guest can always request a person

## 7. Shared event engine

All apps consume the same domain events.

Core event examples:
- TABLE_OPENED
- GUEST_SEATED
- ORDER_CREATED
- ORDER_ITEM_ADDED
- ORDER_SUBMITTED
- ORDER_ACCEPTED
- KITCHEN_TICKET_STARTED
- KITCHEN_ITEM_READY
- ORDER_SERVED
- RECIPE_EXPECTED_CONSUMPTION_RECORDED
- STOCK_RECEIVED
- STOCK_COUNTED
- WASTE_RECORDED
- STOCK_TRANSFERRED
- BILL_CREATED
- DISCOUNT_APPLIED
- PAYMENT_CAPTURED
- REFUND_ISSUED
- FEEDBACK_RECEIVED
- SUPPLIER_PRICE_CHANGED

Read models/projections:
- table state
- waiter queue
- KDS lanes
- theoretical inventory
- actual inventory
- variance
- bill
- guest profile
- contribution
- leakage candidates
- owner alerts

## 8. Financial definitions

Revenue = captured sales before costs.
Gross margin = revenue − ingredient/COGS cost.
Contribution = revenue − ingredients − packaging − payment fees − aggregator/variable channel costs − variable promotions.
Estimated operating profit is only displayed when labor, rent, utilities and other overhead inputs are configured.

Every estimated number gets a confidence/source badge:
- Recorded
- Calculated
- Estimated
- Forecast

## 9. Profit Leak Engine

Leak candidates must be evidence backed.

Examples:
- theoretical vs actual ingredient variance
- recorded waste
- supplier unit-price increases
- unusual discounts
- void/refund patterns
- unprofitable promotions
- portion/yield variance
- stock adjustments

Output is ranked by estimated rupee impact and confidence.

Never accuse an employee of theft. Flag anomalous events for review.

## 10. MVP priority

P0 — must truly work
- restaurant/outlet/table setup
- customer menu
- waiter/POS order entry
- shared order engine
- KDS
- recipes
- theoretical inventory
- receiving
- stock count
- waste
- stock ledger
- bill/payment simulation
- contribution
- ideal vs actual
- Profit Leak Engine
- owner command center

P1
- suppliers and POs
- menu engineering
- feedback/CRM
- consent-based loyalty
- direct bookings
- WhatsApp receipt/campaign hooks
- offline queue and sync

P2
- broader discovery marketplace
- multi-outlet rollups
- invoice OCR
- forecasting
- deeper accounting integrations
- hotel F&B specialization

## 11. Technical architecture

Monorepo:
- apps/web-marketing — cinematic website
- apps/web-ops — owner/manager/POS/KDS/stock web app
- apps/mobile — Expo/React Native staff + owner + guest app
- packages/domain — types, events, money/recipe/inventory logic
- packages/ui — shared design system
- packages/simulation — deterministic demo restaurant event engine
- supabase — schema, migrations, seed and RLS

Recommended stack:
- TypeScript
- React
- React Three Fiber / Three.js for owned 3D assets
- GSAP ScrollTrigger for scrubbed camera/story timelines
- Lenis only where it improves desktop cinematic feel
- Zustand or XState for local orchestration; shared domain state still derives from events
- Supabase/PostgreSQL for auth, relational data, realtime and RLS
- Expo/React Native for mobile
- Playwright for browser E2E
- Vitest for domain logic

## 12. Acceptance tests

The rebuild is not considered successful unless automated tests prove:

1. Guest order at Table 12 appears in waiter/POS and KDS.
2. Kitchen readiness updates waiter and table state.
3. Order updates theoretical ingredient usage.
4. Receiving/count/waste updates actual stock independently.
5. Variance changes Leak Engine output.
6. Payment changes owner revenue/contribution.
7. Feedback updates guest record.
8. Role permissions prevent waiter from opening owner finance controls.
9. Marketing routes are visually distinct.
10. No primitive 3D architecture / blur regressions are present.
11. Mobile and desktop flows both pass.

This document is the new source of truth for Munaffa. Any future implementation should be rejected if it violates these rules.
