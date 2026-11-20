#!/usr/bin/env bash
# Builds the upload package for the cPanel Node.js host.
# Usage: SITE_URL=https://example.com scripts/package-cpanel.sh [--with-data]
#   --with-data  also exports the current database (DATABASE_URL from .env.local) for one-time import.
# Output: dist-cpanel/forest-app.tar.gz — upload to the home directory, extract, restart the app.
set -euo pipefail
cd "$(dirname "$0")/.."
: "${SITE_URL:?Set SITE_URL, e.g. SITE_URL=https://nexcentgroupbd.com}"

OUT=dist-cpanel
STAGE="$OUT/forest-app"
rm -rf "$OUT" && mkdir -p "$STAGE"

# NEXT_PUBLIC_* values are baked into the browser bundle at build time.
NEXT_PUBLIC_SITE_URL="$SITE_URL" pnpm build

cp -a .next/standalone "$STAGE/app"
cp -a .next/static "$STAGE/app/.next/static"
cp -a public "$STAGE/app/public"
rm -f "$STAGE/app/.env"* # secrets are set in cPanel, never shipped
cp deploy/cpanel/server.js deploy/cpanel/setup-db.js "$STAGE/"

# Next's file tracing misses Prisma's generated client assets (query_compiler_bg.wasm etc.), so copy the whole folder.
GEN_SRC=$(find node_modules/.pnpm -type d -path '*/node_modules/.prisma/client' | head -1)
cp -a "$GEN_SRC"/. "$STAGE/app/$GEN_SRC"/
rm -f "$STAGE/app/$GEN_SRC"/libquery_engine-*.so.node "$STAGE/app/$GEN_SRC"/query_engine_bg.* # native/legacy engines are unused (engineType = "client")

if [[ "${1:-}" == "--with-data" ]]; then
  mkdir -p "$STAGE/import"
  cp -a prisma/migrations "$STAGE/import/migrations"
  (set -a; . ./.env.local; set +a; pnpm exec tsx scripts/export-db.ts "$STAGE/import/forest-data.json.gz")
fi

tar -C "$OUT" -czf "$OUT/forest-app.tar.gz" forest-app
ls -lh "$OUT/forest-app.tar.gz"
