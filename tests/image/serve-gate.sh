#!/usr/bin/env bash
# Contract: the image carries the built game (index.html and its bundled
# assets) in the docroot the production vhost points at, not an empty one.
# The vhost itself is host config, so this checks the files, not a URL.
# Usage: IMAGE=<image> tests/image/serve-gate.sh
set -euo pipefail
: "${IMAGE:?set IMAGE}"
root=/var/www/html/spanish.crunchtools.com
podman run --rm --entrypoint /bin/sh "$IMAGE" -c "
  set -e
  grep -qi '<html' $root/index.html
  ls $root/assets/*.js >/dev/null
  ls $root/assets/*.css >/dev/null
"
echo "serve-gate: built game present in $root"
