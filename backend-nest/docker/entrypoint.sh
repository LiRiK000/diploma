#!/bin/sh
set -e

if [ "${MIGRATE_ON_START:-true}" = "true" ]; then
  echo "Applying Prisma migrations..."
  npx prisma migrate deploy
fi

echo "Starting backend..."
exec node dist/src/main.js
