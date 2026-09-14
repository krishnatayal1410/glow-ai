# Munaffa Rebuild — Prototype 3D Asset Provenance

The cinematic rebuild uses replaceable staging assets while the final Munaffa-owned environments are produced.

All assets below are loaded from 3DAssets.dev and are listed by that library as CC0 1.0 assets suitable for commercial use.

| Role | Asset URL | Prototype use |
| --- | --- | --- |
| Restaurant dining room | https://cdn.3dassets.dev/assets/16545/v1/model.glb | Main restaurant and restaurant-specific story |
| Cafe / bakery | https://cdn.3dassets.dev/assets/22245/v1/model.glb | Cafe-specific story |
| Hotel / resort | https://cdn.3dassets.dev/assets/25950/v1/model.glb | Hotel F&B story |
| QSR / drive-through | https://cdn.3dassets.dev/assets/16228/v1/model.glb | QSR story |
| Kitchen hot pass | https://cdn.3dassets.dev/assets/16478/v1/model.glb | Kitchen production story |
| Service station | https://cdn.3dassets.dev/assets/16513/v1/model.glb | Service and stock-context story |
| Payment terminal | https://cdn.3dassets.dev/assets/16521/v1/model.glb | Payment and contribution story |

## Product representation rule
These environments are visual prototype assets. They are not Munaffa customers, partner restaurants, partner hotels, or partner cafes.

## Launch replacement plan
The public launch should replace staging scenes with Munaffa-owned or explicitly commissioned assets using this pipeline:

1. authored restaurant / cafe / hotel F&B floor plan
2. Blender environment build or photogrammetry / Gaussian-splat capture
3. PBR cleanup and real-world scale normalization
4. optimized GLB / KTX2 / Meshopt production export
5. authored camera rails
6. device-specific LOD and mobile fallback
7. ownership / license record stored with every production asset

The cinematic code is intentionally asset-manifest driven so replacing a staging environment does not require rewriting the product engine or route architecture.
