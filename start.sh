#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

export OPENAI_BASE_URL="${OPENAI_BASE_URL:-http://localhost:8080/v1}"
export OPENAI_API_KEY="${OPENAI_API_KEY:-dummy}"
export ANTHROPIC_MODEL="${ANTHROPIC_MODEL:-mlx-community/Mistral-7B-Instruct-v0.3-4bit}"

exec bun --preload="$SCRIPT_DIR/preload.ts" "$SCRIPT_DIR/entrypoints/cli.tsx" "$@"
