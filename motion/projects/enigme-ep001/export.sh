#!/usr/bin/env bash
# Exports de l'épisode 001 à partir du rendu (segments + audio.wav).
# Usage : export.sh <dossier-rendu> <dossier-sortie> <subtitles.srt>
set -euo pipefail
R="$1"; O="$2"; SRT="$3"
FF="${FFMPEG:-$(python3 -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())')}"
mkdir -p "$O"
X264="-c:v libx264 -preset slow -b:v 9500k -pix_fmt yuv420p -profile:v high -level 4.2 -r 30 -g 60"
"$FF" -loglevel error -y -f concat -safe 0 -i "$R/segments.txt" -an $X264 -pass 1 -passlogfile "$R/pass" -f mp4 /dev/null
"$FF" -loglevel error -y -f concat -safe 0 -i "$R/segments.txt" -i "$R/audio.wav" -map 0:v -map 1:a $X264 -maxrate 16000k -bufsize 24000k \
  -pass 2 -passlogfile "$R/pass" -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart -shortest "$O/EP001_MASTER_9x16.mp4"
cp "$O/EP001_MASTER_9x16.mp4" "$O/EP001_TIKTOK.mp4"          # mêmes exigences : même rendu
cp "$O/EP001_MASTER_9x16.mp4" "$O/EP001_YOUTUBE_SHORTS.mp4"
cp "$R/audio.wav" "$O/EP001_AUDIO.wav"; cp "$SRT" "$O/EP001_SUBTITLES.srt"
# extrait promo 15 s : accroche (0–8,35 s) + question finale et titre (52,45–59,45 s), fondu de 0,3 s
"$FF" -loglevel error -y -i "$O/EP001_MASTER_9x16.mp4" -filter_complex \
 "[0:v]trim=0:8.35,setpts=PTS-STARTPTS[v1];[0:v]trim=52.45:59.45,setpts=PTS-STARTPTS[v2];[v1][v2]xfade=transition=fade:duration=0.3:offset=8.05[v];[0:a]atrim=0:8.35,asetpts=PTS-STARTPTS[a1];[0:a]atrim=52.45:59.45,asetpts=PTS-STARTPTS[a2];[a1][a2]acrossfade=d=0.3[a]" \
 -map "[v]" -map "[a]" -c:v libx264 -preset slow -b:v 9500k -maxrate 16000k -bufsize 24000k -pix_fmt yuv420p -r 30 -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$O/EP001_PROMO_15s.mp4"
"$FF" -v error -i "$O/EP001_MASTER_9x16.mp4" -f null - && echo "décodage intégral OK"
