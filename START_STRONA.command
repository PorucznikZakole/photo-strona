#!/bin/zsh
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
HOST="127.0.0.1"
PORT="8080"
URL="http://${HOST}:${PORT}/index.html"

cd "$PROJECT_DIR"

echo "Uruchamiam stronę z: $PROJECT_DIR"
echo "Adres: $URL"

if lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $PORT jest już zajęty. Otwieram stronę na istniejącym serwerze."
  open "$URL"
  exit 0
fi

python3 server.py --host "$HOST" --port "$PORT" &
SERVER_PID=$!

cleanup() {
  if kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT INT TERM

sleep 1
open "$URL"

wait "$SERVER_PID"
