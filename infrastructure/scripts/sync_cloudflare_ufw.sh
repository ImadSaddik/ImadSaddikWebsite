#!/usr/bin/env bash
set -euo pipefail

APPLY=false
PRUNE_ANYWHERE=false

for arg in "$@"; do
  case "$arg" in
    --apply)
      APPLY=true
      ;;
    --prune-anywhere)
      PRUNE_ANYWHERE=true
      ;;
    -h|--help)
      cat <<'EOF'
Usage: sync_cloudflare_ufw.sh [--apply] [--prune-anywhere]

Restricts ports 80 and 443 in UFW to official Cloudflare IPv4 and IPv6 ranges.
Runs in dry-run mode by default unless --apply is passed.

Options:
  --apply           Apply the UFW rules (requires root).
  --prune-anywhere  Remove broad "Nginx Full" ALLOW Anywhere rules after adding Cloudflare CIDRs.
EOF
      exit 0
      ;;
    *)
      echo "Unknown option: $arg" >&2
      exit 1
      ;;
  esac
done

if [ "$APPLY" = true ] && [ "$EUID" -ne 0 ]; then
  echo "Error: --apply must be run as root (for example with sudo)." >&2
  exit 1
fi

fetch_cidrs() {
  local url="$1"
  local output
  output=$(curl -fsSL "$url")
  if [ -z "$output" ]; then
    echo "Error: received empty CIDR list from $url" >&2
    exit 1
  fi
  printf '%s\n' "$output" | grep -E '^[0-9a-fA-F.:]+/[0-9]+$'
}

IPV4_CIDRS=$(fetch_cidrs "https://www.cloudflare.com/ips-v4")
IPV6_CIDRS=$(fetch_cidrs "https://www.cloudflare.com/ips-v6")

if [ -z "$IPV4_CIDRS" ] || [ -z "$IPV6_CIDRS" ]; then
  echo "Error: failed to parse Cloudflare IPv4 or IPv6 CIDR ranges." >&2
  exit 1
fi

if [ "$APPLY" = true ]; then
  if ! ufw status | grep -qE '(OpenSSH|22/tcp)[[:space:]]+ALLOW'; then
    echo "Error: no active SSH allow rule found in UFW. Refusing to modify firewall rules." >&2
    exit 1
  fi
fi

for cidr in $IPV4_CIDRS $IPV6_CIDRS; do
  if [ "$APPLY" = true ]; then
    ufw allow proto tcp from "$cidr" to any port 80,443 comment "Cloudflare" >/dev/null
  else
    echo "[dry-run] ufw allow proto tcp from $cidr to any port 80,443 comment 'Cloudflare'"
  fi
done

if [ "$PRUNE_ANYWHERE" = true ]; then
  if [ "$APPLY" = true ]; then
    ufw delete allow "Nginx Full" || true
  else
    echo "[dry-run] ufw delete allow 'Nginx Full'"
  fi
fi

if [ "$APPLY" = true ]; then
  ufw reload >/dev/null
  echo "Applied Cloudflare UFW rules for ports 80 and 443."
  ufw status numbered
else
  echo "Dry run complete. Re-run with --apply (and optionally --prune-anywhere) as root to update UFW."
fi
