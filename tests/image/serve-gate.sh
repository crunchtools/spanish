#!/bin/sh
# Contract: the image carries the built game (index.html and its bundled
# assets) in the docroot the production vhost points at, not an empty one.
# The vhost itself is host config, so this checks the files, not a URL.
# Runs inside the built image: sdlc's `contract` check in sdlc.toml.
set -e
root=/var/www/html/spanish.crunchtools.com
grep -qi '<html' "$root/index.html"
ls "$root"/assets/*.js >/dev/null
ls "$root"/assets/*.css >/dev/null
echo "serve-gate: built game present in $root"
