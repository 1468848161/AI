#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"

if [[ ! -f .env ]]; then
  echo "Missing .env. Run scripts/deploy.sh first." >&2
  exit 1
fi

docker compose --env-file .env pull postgres redis new-api
docker compose --env-file .env build --pull ai-saas
docker compose --env-file .env up -d --remove-orphans
docker compose --env-file .env ps
