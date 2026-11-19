#!/usr/bin/env bash
# Assemble les segments vidéo + la bande-son en MP4 final (H.264 / AAC, compatible WhatsApp, Instagram, TikTok).
# Usage : tools/encode.sh <dossier-rendu> <sortie.mp4>
set -euo pipefail
DIR="$1"; OUT="$2"
FF="${FFMPEG:-$(python3 -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())')}"
"$FF" -y -loglevel error -f concat -safe 0 -i "$DIR/segments.txt" -i "$DIR/audio.wav" \
  -map 0:v -map 1:a -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -profile:v high -level 4.2 \
  -r 30 -g 60 -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest "$OUT"
echo "→ $OUT"
