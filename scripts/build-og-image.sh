#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cache="$HOME/Library/Caches/ms-playwright"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

chrome=""
if [[ -d "$cache" ]]; then
  chrome="$(find "$cache" -path '*chromium-*' -type f -perm +111 -name 'Google Chrome for Testing' | sort -V | tail -n 1)"
fi
if [[ -z "$chrome" ]]; then
  echo "Playwright Chromium not found under $cache. Run: npx playwright install chromium" >&2
  exit 1
fi

"$chrome" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --allow-file-access-from-files --virtual-time-budget=2000 \
  --window-size=1200,630 --screenshot="$tmp/og-image.png" \
  "file://$root/scripts/og-image.html" >/dev/null

if [[ ! -s "$tmp/og-image.png" ]]; then
  echo "Chromium did not write a screenshot" >&2
  exit 1
fi

sips -s format jpeg -s formatOptions 88 "$tmp/og-image.png" --out "$root/public/og-image.jpg" >/dev/null
sips -g pixelWidth -g pixelHeight "$root/public/og-image.jpg"
