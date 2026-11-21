#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

export PORT="${PORT:-8080}"
export APP_TIMEZONE="${APP_TIMEZONE:-Asia/Novosibirsk}"
export APP_BASE_PATH="${APP_BASE_PATH:-/}"
export DATA_DIR="${DATA_DIR:-$(pwd)/data}"

mkdir -p "$DATA_DIR"

echo "Starting uchet-mastermitsu"
echo "  PORT=$PORT"
echo "  APP_BASE_PATH=$APP_BASE_PATH"
echo "  DATA_DIR=$DATA_DIR"
echo "  APP_TIMEZONE=$APP_TIMEZONE"
echo "Open http://localhost:$PORT"

exec node runtime/server.js
