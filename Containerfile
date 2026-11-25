# Stage 1: Build with Hummingbird's Node.js 22 builder (Red Hat signed, so the
# image gate can verify it). It runs as 65532 in /app with HOME=/tmp, so the
# sources are copied in owned by that user for npm ci to write node_modules.
FROM registry.access.redhat.com/hi/nodejs:22-builder AS builder

WORKDIR /app

COPY --chown=65532:0 package.json package-lock.json ./
RUN npm ci

COPY --chown=65532:0 . .
RUN npm run build

# Stage 2: Serve with httpd
FROM quay.io/crunchtools/ubi10-httpd-php

LABEL maintainer="Scott McCarty <smccarty@redhat.com>"
LABEL license="AGPL-3.0-or-later"
LABEL description="Mundo de Palabras - 3D Spanish vocabulary game for kids"

# Copy built output to document root
COPY --from=builder --chown=0:0 /app/dist/ /var/www/html/spanish.crunchtools.com/

EXPOSE 80
