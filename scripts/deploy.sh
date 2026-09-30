#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"

mode="${1:-deploy}"
if [[ "$mode" != "deploy" && "$mode" != "--init-only" ]]; then
  echo "Usage: scripts/deploy.sh [--init-only]" >&2
  exit 64
fi

env_file="${AI_SAAS_ENV_FILE:-$project_dir/.env}"
if [[ "$env_file" != /* ]]; then
  env_file="$project_dir/$env_file"
fi

if ! command -v openssl >/dev/null 2>&1; then
  echo "Missing required command: openssl" >&2
  exit 1
fi

if [[ ! -f "$env_file" ]]; then
  umask 077
  cp .env.example "$env_file"
  postgres_password="$(openssl rand -hex 24)"
  redis_password="$(openssl rand -hex 24)"
  session_secret="$(openssl rand -hex 32)"
  crypto_secret="$(openssl rand -hex 32)"
  sed -i \
    -e "s/CHANGE_ME_POSTGRES_PASSWORD/$postgres_password/g" \
    -e "s/CHANGE_ME_REDIS_PASSWORD/$redis_password/g" \
    -e "s/CHANGE_ME_NEW_API_SESSION_SECRET/$session_secret/g" \
    -e "s/CHANGE_ME_NEW_API_CRYPTO_SECRET/$crypto_secret/g" \
    "$env_file"
  chmod 600 "$env_file"
  echo "Created environment file with random database, Redis, and session secrets."
else
  echo "Using existing environment file; no secrets were changed."
fi

if [[ "$mode" == "--init-only" ]]; then
  echo "Environment initialization completed."
  exit 0
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Missing required command: docker" >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose v2 is required." >&2
  exit 1
fi

docker compose --env-file "$env_file" config --quiet
docker compose --env-file "$env_file" up -d --build
docker compose --env-file "$env_file" ps

echo
echo "AI SaaS: http://127.0.0.1:3000"
echo "New API: http://127.0.0.1:3001"
echo "Next: initialize the New API administrator, create a token, and set NEW_API_ADMIN_TOKEN in .env."
