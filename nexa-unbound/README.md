# NEXA UNBOUND

Independent cinematic 3D automotive concept experience.

## Live production
https://nexa-unbound.vercel.app

## Experience
- Scroll-controlled, reversible 3D camera choreography
- Procedural concept vehicle built entirely in Three.js
- Exploded vehicle architecture with body, cabin, wheels, lighting and battery layer
- Electric energy tunnel and acceleration streak geometry
- 3D multi-vehicle model universe
- Interactive exterior finish configurator
- Clickable chapter navigation and keyboard chapter controls
- Desktop pointer-parallax camera micro-motion
- Mobile-specific camera FOV, distances and scene scaling
- Adaptive rendering quality based on measured early-session FPS
- Reduced-motion handling and WebGL/no-JavaScript fallback
- Accessible HTML copy outside the WebGL canvas

## Stack
- Three.js
- GSAP + ScrollTrigger
- Lenis
- Vanilla HTML/CSS/ES modules

## Source layout
The project lives in the `nexa-unbound` branch of this repository under the `nexa-unbound/` folder. It is kept separate from the repository's main branch so the existing project remains untouched.

The source intentionally avoids proprietary vehicle models and official brand assets. This is an independent design/engineering concept and not an official NEXA website.

## Run locally
Serve this folder over HTTP, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.
