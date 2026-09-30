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

echo "Database backup created: backups/new-api-$timestamp.sql.gz"
