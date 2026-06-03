#!/bin/sh
set -eu

node /app/server.mjs &
api_pid="$!"

nginx -g 'daemon off;' &
nginx_pid="$!"

term() {
  kill "$api_pid" "$nginx_pid" 2>/dev/null || true
  wait "$api_pid" "$nginx_pid" 2>/dev/null || true
}

trap term INT TERM

while true; do
  if ! kill -0 "$api_pid" 2>/dev/null; then
    echo "Node API process stopped"
    term
    exit 1
  fi

  if ! kill -0 "$nginx_pid" 2>/dev/null; then
    echo "Nginx process stopped"
    term
    exit 1
  fi

  sleep 2
done