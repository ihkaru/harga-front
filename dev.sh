#!/usr/bin/env bash

# Exit on error in subshells
set -e

# Port configuration (default 9100)
PORT="${PORT:-9100}"
HOST="${HOST:-0.0.0.0}"

echo "=================================================="
echo " 🚀 Starting KOPI DEWA Frontend Development Server"
echo "=================================================="

# Step 1: Ensure .env exists
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
  else
    echo "❌ Error: Neither .env nor .env.example found!"
    exit 1
  fi
fi

# Step 2: Ensure node_modules exists
if [ ! -d node_modules ]; then
  echo "📦 node_modules not found. Running npm install..."
  npm install
fi

# Step 3: Check & terminate orphan processes on target port
echo "🔍 Checking port $PORT for existing/orphan processes..."
ORPHAN_PIDS=$(lsof -ti:"$PORT" 2>/dev/null || true)

if [ -n "$ORPHAN_PIDS" ]; then
  echo "⚠️  Port $PORT is currently occupied by process(es): $ORPHAN_PIDS"
  echo "🧹 Cleaning up orphan process(es)..."
  for PID in $ORPHAN_PIDS; do
    kill -15 "$PID" 2>/dev/null || true
  done
  sleep 1
  # Force kill if still alive
  STILL_ALIVE=$(lsof -ti:"$PORT" 2>/dev/null || true)
  if [ -n "$STILL_ALIVE" ]; then
    echo "⚡ Force killing remaining process(es): $STILL_ALIVE..."
    for PID in $STILL_ALIVE; do
      kill -9 "$PID" 2>/dev/null || true
    done
    sleep 1
  fi
  echo "✅ Port $PORT is now free."
else
  echo "✅ Port $PORT is clear."
fi

# Step 4: Signal Trapping for Clean Shutdown (No Orphan Processes)
DEV_PID=""

cleanup() {
  trap - SIGINT SIGTERM EXIT # Prevent recursive trap execution
  echo ""
  echo "🛑 Received termination signal. Cleaning up background processes..."
  if [ -n "$DEV_PID" ] && kill -0 "$DEV_PID" 2>/dev/null; then
    kill -15 "$DEV_PID" 2>/dev/null || true
    wait "$DEV_PID" 2>/dev/null || true
  fi

  # Final check to ensure port is freed
  REMAINING=$(lsof -ti:"$PORT" 2>/dev/null || true)
  if [ -n "$REMAINING" ]; then
    kill -9 $REMAINING 2>/dev/null || true
  fi

  echo "✅ Dev server stopped cleanly. No orphan processes left."
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Step 5: Launch Dev Server
echo "🌐 Starting Quasar dev server on http://localhost:$PORT (Host: $HOST)..."
echo "--------------------------------------------------"

# Run quasar dev via local node_modules binary
./node_modules/.bin/quasar dev -H "$HOST" -p "$PORT" &
DEV_PID=$!

# Wait for dev server background process
wait "$DEV_PID"
