#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$(readlink -f "$0" 2>/dev/null || realpath "$0" 2>/dev/null || echo "$0")")" && pwd)"

# ── ANSI helpers ────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; MAGENTA='\033[0;35m'; WHITE='\033[1;37m'
BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'
die()  { echo -e "${RED}error:${NC} $*" >&2; exit 1; }
info() { echo -e "${CYAN}::${NC} $*"; }
ok()   { echo -e "${GREEN}✓${NC} $*"; }
warn() { echo -e "${YELLOW}!${NC} $*"; }

# ── Load .env ───────────────────────────────────────────────────────────────
# Project-local .env takes precedence, then ~/.config/claude-local/.env
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/claude-local"
if [[ -f "$SCRIPT_DIR/.env" ]]; then
  set -a; source "$SCRIPT_DIR/.env"; set +a
elif [[ -f "$CONFIG_DIR/.env" ]]; then
  set -a; source "$CONFIG_DIR/.env"; set +a
fi

# ── Defaults ────────────────────────────────────────────────────────────────
OLLAMA_HOST="${OLLAMA_HOST:-https://ollama.lefv.info}"
LITELLM_HOST="${LITELLM_HOST:-https://litellm.lefv.info}"
OLLAMA_API_KEY="${OLLAMA_API_KEY:-}"
OLLAMA_DEFAULT_MODEL="${OLLAMA_DEFAULT_MODEL:-ministral-3-8b-instruct-4bit}"
CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="${CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC:-1}"

# ── Curl with auth ──────────────────────────────────────────────────────────
_curl() {
  local -a headers=()
  [[ -n "$OLLAMA_API_KEY" ]] && headers+=(-H "Authorization: Bearer $OLLAMA_API_KEY")
  curl -sf --connect-timeout 5 --max-time 10 "${headers[@]}" "$@"
}

# ── API helpers ─────────────────────────────────────────────────────────────
ollama_health()  { _curl "${OLLAMA_HOST}/" >/dev/null 2>&1; }
litellm_health() { _curl "${LITELLM_HOST}/v1/models" >/dev/null 2>&1; }

ollama_models() {
  # Try LiteLLM /v1/models first (OpenAI format), fall back to Ollama /api/tags
  local litellm_models
  litellm_models=$(_curl "${LITELLM_HOST}/v1/models" 2>/dev/null || true)
  if [[ -n "$litellm_models" ]] && echo "$litellm_models" | jq -e '.data' &>/dev/null; then
    echo "$litellm_models" | jq '{models: [.data[] | {name: .id, model: .id, size: 0}]}'
    return
  fi
  _curl "${OLLAMA_HOST}/api/tags" 2>/dev/null
}

# ── Interactive model picker ────────────────────────────────────────────────
pick_model() {
  local model_json count
  model_json=$(ollama_models) || die "Failed to fetch models from ${OLLAMA_HOST}"
  count=$(echo "$model_json" | jq '.models | length')
  [[ "$count" -eq 0 ]] && die "No models available on ${OLLAMA_HOST}"

  local -a models=()
  while IFS= read -r line; do models+=("$line"); done < <(echo "$model_json" | jq -r '.models[].name')

  if [[ "$count" -eq 1 ]]; then
    echo -e "${CYAN}Auto-selecting${NC} ${BOLD}${models[0]}${NC}"
    SELECTED_MODEL="${models[0]}"
    return
  fi

  echo -e "${BOLD}Select a model:${NC}"
  echo ""
  for i in "${!models[@]}"; do
    printf "  ${WHITE}%2d)${NC} %s\n" "$((i + 1))" "${models[$i]}"
  done
  echo ""

  while true; do
    read -rp "$(echo -e "${CYAN}Enter number${NC} [1-${count}] or model name: ")" choice
    if [[ "$choice" =~ ^[0-9]+$ ]] && (( choice >= 1 && choice <= count )); then
      SELECTED_MODEL="${models[$((choice - 1))]}"
      return
    fi
    for m in "${models[@]}"; do
      [[ "$m" == "$choice" ]] && { SELECTED_MODEL="$m"; return; }
    done
    echo -e "${RED}Invalid selection${NC}"
  done
}

# ── Connectivity test ───────────────────────────────────────────────────────
run_test() {
  echo -e "${BOLD}ollama.sh${NC} — connectivity test"
  echo -e "${DIM}Ollama:  ${OLLAMA_HOST}${NC}"
  echo -e "${DIM}LiteLLM: ${LITELLM_HOST}${NC}"
  [[ -n "$OLLAMA_API_KEY" ]] && echo -e "${DIM}Auth:    API key (${OLLAMA_API_KEY:0:8}...)${NC}"
  echo ""

  echo -e "${WHITE}Ollama (${OLLAMA_HOST})${NC}"
  if ollama_health; then
    ok "Reachable"
  else
    warn "Cannot reach Ollama at ${OLLAMA_HOST}"
  fi

  local model_json
  model_json=$(_curl "${OLLAMA_HOST}/api/tags" 2>/dev/null || true)
  if [[ -n "$model_json" ]]; then
    local count
    count=$(echo "$model_json" | jq '.models | length' 2>/dev/null || echo 0)
    ok "${count} model(s) available"
    echo "$model_json" | jq -r '.models[].name' 2>/dev/null | while read -r m; do
      echo -e "  ${MAGENTA}•${NC} $m"
    done
  fi

  echo ""
  echo -e "${WHITE}LiteLLM (${LITELLM_HOST})${NC}"
  if litellm_health; then
    ok "Reachable"
  else
    warn "Cannot reach LiteLLM at ${LITELLM_HOST}"
  fi

  local -a auth_h=()
  [[ -n "$OLLAMA_API_KEY" ]] && auth_h=(-H "Authorization: Bearer $OLLAMA_API_KEY")

  info "Checking /v1/messages (Anthropic format)..."
  local status_code
  status_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 \
    -X POST "${auth_h[@]}" \
    -H "Content-Type: application/json" \
    -d '{"model":"test","max_tokens":1,"messages":[{"role":"user","content":"hi"}]}' \
    "${LITELLM_HOST}/v1/messages" 2>/dev/null) || true

  if [[ "$status_code" =~ ^(200|400|401|422)$ ]]; then
    ok "/v1/messages responds (HTTP ${status_code}) — Claude Code compatible"
  else
    warn "/v1/messages returned HTTP ${status_code:-000}"
  fi

  echo ""
  ok "Test complete"
}

# ── List models ─────────────────────────────────────────────────────────────
run_list_models() {
  local model_json count
  model_json=$(ollama_models) || die "Failed to fetch models"
  count=$(echo "$model_json" | jq '.models | length')

  echo -e "${BOLD}Models on ${CYAN}${OLLAMA_HOST}${NC}  ${DIM}(${count})${NC}"
  echo ""
  [[ "$count" -eq 0 ]] && { warn "No models found."; exit 0; }

  echo "$model_json" | jq -r '.models[].name' | while read -r name; do
    echo -e "  ${MAGENTA}•${NC} $name"
  done
}

# ── Launch CLI ──────────────────────────────────────────────────────────────
launch() {
  local model="$1"; shift

  echo -e "${GREEN}Launching${NC} ${BOLD}Claude Code CLI${NC} → ${CYAN}${LITELLM_HOST}${NC} / ${MAGENTA}${BOLD}${model}${NC}"
  echo ""

  # Clear any OpenAI provider env vars so the CLI uses firstParty (Anthropic) path
  unset OPENAI_BASE_URL OPENAI_API_KEY CLAUDE_CODE_USE_OPENAI
  unset OLLAMA_BASE_URL CLAUDE_CODE_USE_OLLAMA

  # Point at LiteLLM proxy (Anthropic Messages API compatible)
  export ANTHROPIC_BASE_URL="${LITELLM_HOST}"
  export ANTHROPIC_API_KEY="${OLLAMA_API_KEY:-not-needed}"
  export ANTHROPIC_MODEL="${model}"
  export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="${CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC}"

  # Local models can't handle Claude-specific features
  export CLAUDE_CODE_DISABLE_THINKING=1

  cd "$SCRIPT_DIR"
  exec bun --preload="$SCRIPT_DIR/preload.ts" "$SCRIPT_DIR/entrypoints/cli.tsx" "$@"
}

# ── Parse args ──────────────────────────────────────────────────────────────
case "${1:-}" in
  --test|-t)     run_test ;;
  --models|--list|-l) run_list_models ;;
  --pick)        pick_model; launch "$SELECTED_MODEL" ;;
  --help|-h)
    cat <<USAGE
Usage: ollama.sh [OPTIONS] [MODEL] [-- CLI_ARGS...]

Launch Claude Code CLI against Ollama via LiteLLM proxy.

Commands:
  (no args)             Launch with default model ($OLLAMA_DEFAULT_MODEL)
  MODEL [args...]       Launch with specific model
  --pick                Interactive model picker
  --test, -t            Test connectivity to Ollama & LiteLLM
  --models, -l          List available models
  --help, -h            Show this help

Environment:
  OLLAMA_HOST           Ollama server  (default: https://ollama.lefv.info)
  LITELLM_HOST          LiteLLM proxy  (default: https://litellm.lefv.info)
  OLLAMA_API_KEY        Bearer token for auth proxy
  OLLAMA_DEFAULT_MODEL  Model to use   (default: ministral-3-8b-instruct-4bit)

Examples:
  ./ollama.sh                              # default model
  ./ollama.sh qwen3:8b                     # specific model
  ./ollama.sh --pick                       # interactive picker
  ./ollama.sh --test                       # check connectivity
  ./ollama.sh qwen3:8b -- -p "explain X"  # pass args to CLI
USAGE
    exit 0
    ;;
  --)
    shift
    launch "$OLLAMA_DEFAULT_MODEL" "$@"
    ;;
  --*)
    die "Unknown flag: $1  (try --help)"
    ;;
  "")
    launch "$OLLAMA_DEFAULT_MODEL"
    ;;
  *)
    model="$1"; shift
    launch "$model" "$@"
    ;;
esac
