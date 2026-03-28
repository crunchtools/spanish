# Mundo de Palabras — Constitution

**Version:** 1.0.0
**Ratified:** 2026-03-28
**Status:** Active
**Inherits:** crunchtools/constitution v1.0.0
**Profile:** Web Application (Static Build)

## License
AGPL-3.0-or-later

## Versioning
Semantic Versioning 2.0.0 (MAJOR.MINOR.PATCH)

## Technology Stack
- **Runtime:** Vite + vanilla JavaScript (ES modules)
- **3D Engine:** Three.js
- **Animation:** @tweenjs/tween.js
- **Assets:** Kenney.nl CC0 3D models (.glb)
- **Build Output:** Static files (HTML/JS/CSS/GLB)

## Base Image
- **Build stage:** registry.redhat.io/ubi10/nodejs-22
- **Serve stage:** quay.io/crunchtools/ubi10-httpd-php

## Registry
quay.io/crunchtools/mundo-de-palabras

## Containerfile Conventions
- Multi-stage build: Node.js builds, httpd serves
- AGPL license label
- No secrets in build layers

## Quality Gates
1. `npm run build` — Vite production build succeeds
2. Container build — `podman build -f Containerfile .`
3. Manual iPad Safari testing for touch controls

## Design Principles
- Tap-to-move navigation (no dual-joystick)
- 2D HTML overlays for mini-games
- Guide characters as Twemoji sprites in 3D
- Kid-friendly: ages 5-8, large touch targets, simple navigation
