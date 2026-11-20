#!/usr/bin/env bash
# Crée un nouvel épisode à partir du modèle de série (copie du dernier épisode validé).
# Usage : tools/new_episode.sh <modele> <nouveau>   ex. tools/new_episode.sh enigme-ep001 enigme-ep002
set -euo pipefail
cd "$(dirname "$0")/.."
SRC="projects/$1"; DST="projects/$2"
[ -d "$DST" ] && { echo "$DST existe déjà"; exit 1; }
mkdir -p "$DST"
cp "$SRC/index.html" "$SRC/scene.js" "$SRC/score.py" "$SRC/narration.json" "$DST/"
rm -f "$DST/timeline.json"
echo "→ $DST créé. À adapter : narration.json (texte), scene.js (textes à l'écran, décors), puis :"
echo "   tools/produce.sh $2 ../$(echo "$2" | tr 'a-z-' 'A-Z_') EPxxx"
