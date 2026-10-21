#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
chrome="$(find "$HOME/Library/Caches/ms-playwright" -path '*chromium-*' -type f -perm +111 -name 'Google Chrome for Testing' | sort | tail -n 1)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

if [[ -z "$chrome" ]]; then
  echo "Playwright Chromium not found under ~/Library/Caches/ms-playwright" >&2
  exit 1
fi

"$chrome" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --allow-file-access-from-files --virtual-time-budget=2000 \
  --window-size=1200,630 --screenshot="$tmp/og-image.png" \
  "file://$root/scripts/og-image.html" >/dev/null 2>&1

sips -s format jpeg -s formatOptions 88 "$tmp/og-image.png" --out "$root/public/og-image.jpg" >/dev/null
sips -g pixelWidth -g pixelHeight "$root/public/og-image.jpg"
