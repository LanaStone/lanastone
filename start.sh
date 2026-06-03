#!/bin/sh
set -eu

export HOST="${HOST:-0.0.0.0}"
export PORT="${PORT:-3000}"
export NITRO_HOST="${NITRO_HOST:-$HOST}"
export NITRO_PORT="${NITRO_PORT:-$PORT}"

if [ ! -f .output/server/index.mjs ]; then
  echo "ERROR: .output/server/index.mjs not found. Run npm run build before starting." >&2
  exit 1
fi

echo "Starting LanaStone on ${NITRO_HOST}:${NITRO_PORT}"
exec node .output/server/index.mjs