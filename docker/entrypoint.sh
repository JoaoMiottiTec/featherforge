#!/bin/sh
set -e

log() { echo "[entrypoint] $*"; }

log "NODE_ENV=${NODE_ENV:-unset}"

if [ "${NODE_ENV}" = "production" ]; then
  log "Production mode: skipping migrations (handled in CI/CD)"
else
  log "Dev mode: syncing schema..."
  npx prisma db push
fi

log "Starting app: $@"
exec "$@"
