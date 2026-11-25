# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/) and this project adheres to
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.0.3] - 2026-11-25

### Changed
- CI is the fleet ci.yml (sdlc 0.15): one image build per release, published
  as `quay.io/crunchtools/spanish` (was `quay.io/crunchtools/mundo-de-palabras`).
- Promote signs the image with the fleet cosign key (`sign: true`), because
  bootc hosts are moving to trust only signed `quay.io/crunchtools` images
  (crunchtools/rhel10-bootc-server#47). Needs the repo's `cosign-signing`
  environment to hold `COSIGN_PRIVATE_KEY` and `COSIGN_PASSWORD`.
- Gatehouse triage now receives `review_result`, so a PR whose review job died before posting is held instead of passing.
- The container release runs constitution v1.51.0's `container-release.yml`
  (was v1.46.0) and grants it `issues: write`, so a failed scheduled rebuild
  opens an issue instead of only warning. A `v*` promote now also refuses an
  image whose `version` label names a different release of this repo.

### Security
- `npm audit fix` for the vite, postcss, nanoid and source-map-js advisories.

## [1.0.2] - 2026-11-13

### Security
- Rebuilt on ubi10-httpd with mod_http2 2.0.29-5.el10_3.1 (CVE-2026-119618).

## [1.0.1] - 2026-11-11

### Changed

- Constitution is now a v1.18.0 manifest: fleet and profile rules apply by
  reference, and the file keeps only what is specific to this repo.
- Constitution validation is pinned to the inherited release via
  `.github/workflows/constitution.yml`.
- Dependabot auto-merges GitHub Actions minor and patch updates.

## [1.0.0] - 2026-09-20

First tagged release. This image has been running in production since before
it had version control; this release marks the current state as the baseline
going forward.
