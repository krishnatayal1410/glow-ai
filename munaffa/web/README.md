# Munaffa Immersive Web — V1

Branch: `munaffa-immersive-v1`

This is the first executable public-site implementation built on the clean Munaffa rebuild direction.

## Story

One continuous Table 12 transaction:

1. Enter the restaurant.
2. Approach Table 12.
3. Create one shared order: `2 × Paneer Tikka`.
4. Follow that same order into Kitchen / KDS.
5. Apply recipe consumption to inventory.
6. Update the payment and contribution calculation.
7. Reveal a ₹37 profit leak with operational evidence.
8. End at Owner Intelligence: what changed → rupee impact → next action.

The on-page state panel is intentionally synchronized to the same scroll/story state rather than presenting unrelated demo numbers.

## Stack

- React 19
- Vite
- Three.js
- React Three Fiber
- Drei
- Scroll-scrubbed custom camera rail

## 3D asset layer

Temporary prototype assets are loaded directly from 3DAssets.dev and are CC0 1.0 Universal:

- Dressed 40-cover restaurant dining room — `https://cdn.3dassets.dev/assets/16545/v1/model.glb`
- Six-grid commercial combi oven — `https://cdn.3dassets.dev/assets/16412/v1/model.glb`
- Three-well bain-marie — `https://cdn.3dassets.dev/assets/16416/v1/model.glb`
- Card terminal — `https://cdn.3dassets.dev/assets/16521/v1/model.glb`

These are prototype visualization assets, not Munaffa customers or claimed proprietary environments.

Final launch target remains an original Munaffa-owned environment authored/captured specifically for the brand.

## Local run

```bash
cd munaffa/web
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Rejected visual patterns

Do not add:

- primitive decorative cube/sphere/cylinder scenes
- blurred backgrounds or blur-led glassmorphism
- generic dark-neon AI styling
- random floating furniture
- photo parallax pretending to be 3D
- unrelated 3D hero scenes for every route
- disconnected dashboard demo numbers

## Current verification status

Repository files are created and internally reviewed for structure. A production `npm run build` has **not** been executed from this ChatGPT session because the available automated CI write was blocked. Do not label this branch production-ready until the build and browser path have been executed successfully.
