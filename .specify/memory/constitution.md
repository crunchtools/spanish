# Mundo de Palabras — Constitution

> **Version:** 1.1.0
> **Ratified:** 2026-03-28
> **Amended:** 2026-10-02
> **Status:** Active
> **Inherits:** [crunchtools/constitution](https://github.com/crunchtools/constitution) v1.20.0
> **Profile:** Web Application

A 3D Spanish vocabulary game for kids aged 5 to 8: a Three.js first-person
walkthrough with tap-to-move navigation, Kenney CC0 3D models, and 2D HTML
overlay mini-games. Built with Vite and served as static files from httpd.

This file holds what is specific to Mundo de Palabras. The fleet rules and the
Web Application profile apply at the inherited version and are checked against
this repo's files by `constitution.yml`. They are not restated here.

## Stack

- **Runtime:** Vite + vanilla JavaScript (ES modules).
- **3D engine:** Three.js; **animation:** `@tweenjs/tween.js`.
- **Assets:** Kenney.nl CC0 3D models (`.glb`).
- **Build output:** static HTML/JS/CSS/GLB.

## Image and Parent

- **Build stage:** `docker.io/library/node:22-slim` runs the Vite build.
- **Serve stage:** `quay.io/crunchtools/ubi10-httpd-php`, which is also the
  **parent image for cascade**; the build listens for `parent-image-updated`.
- **Published as:** `quay.io/crunchtools/mundo-de-palabras` (the image name
  differs from the repo name).

## Host Layout and Storage

Deployed at `/srv/spanish.crunchtools.com/` with `code/` (build output),
`config/` (httpd vhost) and `data/` (httpd logs), published on
`127.0.0.1:8091:80` behind the crunchtools reverse proxy.

Stateless: no database and no persistent volume. All content is static and
served from `code/`; the only writable data is httpd logs under `data/`.

## Monitoring Coverage

Nagios: an HTTP check against `https://spanish.crunchtools.com` and a container-port
check on `:8091`. There is no application state to monitor.

## Smoke Tests

`npm run build` and `podman build` succeed in CI; the container starts and
httpd serves `index.html` on `:80`. Touch controls are tested by hand on iPad
Safari.

## Design Principles

- Tap-to-move navigation (no dual joystick).
- 2D HTML overlays for mini-games.
- Guide characters as Twemoji sprites in 3D.
- Kid-friendly: ages 5 to 8, large touch targets, simple navigation.

## History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-28 | Initial constitution |
| 1.1.0 | 2026-10-02 | Manifest under constitution v1.18.0: fleet and profile restatement removed, game specifics kept; monitoring renamed from Zabbix to Nagios (RT #1478), host name dropped (XVII) |
