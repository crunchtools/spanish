# Mundo de Palabras — Constitution

> **Version:** 1.0.0
> **Ratified:** 2026-03-28
> **Status:** Active
> **Inherits:** [crunchtools/constitution](https://github.com/crunchtools/constitution) v1.0.0
> **Profile:** Web Application

3D Spanish vocabulary game for kids ages 5-8. Three.js first-person walkthrough with tap-to-move navigation, Kenney CC0 3D models, and 2D HTML overlay mini-games. Built with Vite, served as static files from httpd.

---

## License

AGPL-3.0-or-later

## Versioning

Follow Semantic Versioning 2.0.0. MAJOR/MINOR/PATCH.

## Technology Stack

- **Runtime:** Vite + vanilla JavaScript (ES modules)
- **3D Engine:** Three.js
- **Animation:** @tweenjs/tween.js
- **Assets:** Kenney.nl CC0 3D models (.glb)
- **Build Output:** Static files (HTML/JS/CSS/GLB)

## Base Image

- **Build stage:** docker.io/library/node:22-slim
- **Serve stage:** quay.io/crunchtools/ubi10-httpd-php

## Registry

quay.io/crunchtools/mundo-de-palabras

## Containerfile Conventions

- Multi-stage build: Node.js builds, httpd serves
- AGPL license label
- No secrets in build layers

## Host Layout & Deployment

Deployed on lotor at `/srv/spanish.crunchtools.com/` following the standard
`code/` (build output), `config/` (httpd vhost), `data/` (httpd logs) convention.
The container bind-mounts these directories and publishes `127.0.0.1:8091:80`
behind the crunchtools reverse proxy.

## Data Persistence

Stateless — no database and no persistent volumes. All content is static
(HTML/JS/CSS/GLB) served from `code/`; the only writable data is httpd logs
under `data/`.

## Monitoring

Monitored by Zabbix: a web scenario against `https://spanish.crunchtools.com`
plus a container-port check on `:8091`. There is no application-level state to
monitor.

## Testing

| Test | What it verifies |
|------|------------------|
| **Build test** | `npm run build` + `podman build` succeed in CI |
| **Smoke test** | Container starts and httpd serves `index.html` (health check on `:80`) |

## Cascade Rebuild

Rebuilds weekly and on `repository_dispatch` when the parent
`ubi10-httpd-php` image updates (parent-image-updated cascade), picking up
base-image security fixes.

## Quality Gates

1. `npm run build` — Vite production build succeeds
2. Container build — `podman build -f Containerfile .`
3. Manual iPad Safari testing for touch controls

## Design Principles

- Tap-to-move navigation (no dual-joystick)
- 2D HTML overlays for mini-games
- Guide characters as Twemoji sprites in 3D
- Kid-friendly: ages 5-8, large touch targets, simple navigation
