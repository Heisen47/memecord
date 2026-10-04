#!/usr/bin/env bash
set -e

mkdir -p public/icons /tmp/mememeet-icons

for size in 16 48 128; do
  radius=$((size / 5))
  fsize=$((size * 55 / 100))
  cy=$((size * 68 / 100))
  cx=$((size / 2))
  
  cat <<SVG > /tmp/mememeet-icons/icon-${size}.svg
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#grad)" />
  <text x="${cx}" y="${cy}" font-family="system-ui, -apple-system, sans-serif" font-size="${fsize}" font-weight="900" text-anchor="middle" fill="#ffffff">M</text>
</svg>
SVG

  sips -s format png /tmp/mememeet-icons/icon-${size}.svg --out public/icons/icon-${size}.png
done

echo "Icons generated successfully:"
file public/icons/*.png
