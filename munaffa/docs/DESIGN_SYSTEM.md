# Munaffa Rebuild — Visual and UX System

## 1. Brand character
Munaffa should feel like premium hospitality + operational precision + financial clarity.

Not sci-fi. Not gaming UI. Not generic SaaS blue. Not dark-neon AI.

## 2. Public cinematic site
The public site is one continuous spatial narrative built around a single restaurant shift.

### Opening
A real restaurant entrance at evening service. No floating logo object. The camera crosses the threshold as the first line appears in architecture-aligned typography.

### Chapter 1 — The guest
Camera enters dining room and settles near Table 12. Guest-side interaction appears only when relevant: menu, waiter request, optional QR, booking, loyalty.

### Chapter 2 — The order
A real order is placed. The same order object becomes the visual thread that moves to service and kitchen.

### Chapter 3 — The kitchen
Camera travels through the pass into an authored commercial kitchen. KDS state appears on actual screens and surfaces, not floating cards in empty space.

### Chapter 4 — The recipe
The order resolves into recipe components and portion assumptions. Ingredient data is anchored to physical prep and storage locations.

### Chapter 5 — Inventory
Camera moves to cold storage / dry storage. Stock quantities, expected consumption, received stock and waste are represented in context.

### Chapter 6 — Money
The plated dish returns to the dining room. Selling price decomposes into ingredient cost, fees, wastage allocation and contribution.

### Chapter 7 — Leakage
Potential leakage is visualized as explainable differences between expected and actual events, not as decorative particles.

### Chapter 8 — Owner
The physical restaurant transitions into the Owner Command Center. The interface shows what changed, why, rupee impact and recommended action.

### Closing
Return to the restaurant as a healthy operating system. Final line: Know where every rupee goes.

## 3. Camera rules
- Every major movement is authored, not random orbiting.
- Forward scroll advances camera along the rail.
- Reverse scroll reverses exactly.
- Camera stops when scrolling stops.
- No endless idle rotations.
- No object spinning for decoration.
- No excessive depth of field.
- No artificial blur transitions.
- Use lighting and occlusion for scene changes.

## 4. Typography
Primary UI: Manrope or Geist.
Editorial display: a restrained high-contrast serif only in marketing moments.
Operational numbers: tabular numerals.

Typography animation:
- masked line reveals
- per-word perspective travel
- path-following labels when tied to physical objects
- large architectural type used sparingly
- no random fade-up on every section

## 5. Color system
Backgrounds use warm natural hospitality tones rather than pure black by default.

Brand green: #176B45
Profit healthy: #14804A
Attention amber: #F2A23A
Critical red: #D94B42
Warm ivory: #F7F5F0
Charcoal: #171915
Soft border: #E6E2DA

3D scenes should derive color from physically plausible materials and venue lighting rather than forcing brand green over everything.

## 6. Product application
The operating product is not a 3D interface.

Owner: strategic, financial, multi-outlet context.
Manager: live operating cockpit.
Cashier: fast billing and payment.
Waiter: mobile-first tables and requests.
Kitchen: large-touch production interface.
Stock: receiving, count, waste and purchase flow.
Guest: restaurant-branded menu and service experience.
HQ Admin: network, onboarding, billing, support, systems.

## 7. Shared event model
All roles observe the same underlying entities and events.

OrderPlaced
OrderAccepted
ItemStarted
ItemReady
ItemServed
StockConsumed
WasteLogged
PurchaseReceived
BillIssued
PaymentCaptured
FeedbackSubmitted
GuestReturned

The prototype must demonstrate these events changing multiple surfaces in real time.

## 8. Route structure
Public:
/
/product
/profit
/operations
/inventory
/guest
/restaurants
/cafes
/hotel-fb
/pricing
/about
/contact

Application:
/app/owner
/app/manager
/app/pos
/app/waiter
/app/kitchen
/app/stock
/app/guest
/app/hq

## 9. Non-negotiable visual exclusions
Do not use:
- primitive cube/sphere worlds
- floating random furniture
- repeated hero 3D scene across every route
- generic glass cards over a WebGL canvas
- blurry backgrounds
- heavy bloom
- fake hologram grids
- neon cyan/purple AI palette
- low-resolution public 3D assets
- image-only parallax sold as 3D

## 10. Quality bar
The final marketing experience must look intentional frame-by-frame at desktop and mobile sizes. Every 3D asset needs an explicit role in the Munaffa story. If an object does not explain the product, it should not be present.
