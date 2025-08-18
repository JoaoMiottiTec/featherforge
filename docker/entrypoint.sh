#!/bin/sh
set -e

log() { echo "[entrypoint] $*"; }

log "NODE_ENV=${NODE_ENV:-unset}"

if [ "${NODE_ENV}" = "production" ]; then
  log "Applying Prisma migrations (deploy)..."
  npx prisma migrate deploy
else
  log "Dev mode: running 'prisma migrate dev' (idempotent)..."
  npx prisma migrate dev --name init || true
fi

log "Starting app: $@"
exec "$@"
