# Stage 1: Build with Node.js
FROM registry.redhat.io/ubi10/nodejs-22 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with httpd
FROM quay.io/crunchtools/ubi10-httpd-php

LABEL maintainer="Scott McCarty <smccarty@redhat.com>"
LABEL license="AGPL-3.0-or-later"
LABEL description="Mundo de Palabras - 3D Spanish vocabulary game for kids"

# Copy built output to document root
COPY --from=builder /app/dist/ /var/www/html/spanish.crunchtools.com/

EXPOSE 80
