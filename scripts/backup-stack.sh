#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"

if [[ ! -f .env ]]; then
  echo "Missing .env. Run scripts/deploy.sh first." >&2
  exit 1
fi

backup_dir="$project_dir/backups"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$backup_dir"
umask 077

docker compose --env-file .env exec -T postgres \
  sh -c 'pg_dump --clean --if-exists --no-owner -U "$POSTGRES_USER" "$POSTGRES_DB"' \
  | gzip > "$backup_dir/new-api-$timestamp.sql.gz"

commerce_snapshot="/app/data/commerce-backup-$timestamp.sqlite"
docker compose --env-file .env exec -T \
  -e COMMERCE_BACKUP_PATH="$commerce_snapshot" \
  ai-saas node scripts/backup-commerce.mjs
docker compose --env-file .env cp \
  "ai-saas:$commerce_snapshot" \
  "$backup_dir/ai-saas-commerce-$timestamp.sqlite"
docker compose --env-file .env exec -T ai-saas \
  node -e 'require("node:fs").unlinkSync(process.argv[1])' "$commerce_snapshot"

echo "Database backups created:"
echo "  backups/new-api-$timestamp.sql.gz"
echo "  backups/ai-saas-commerce-$timestamp.sqlite"
