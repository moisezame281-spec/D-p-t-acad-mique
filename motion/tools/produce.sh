#!/usr/bin/env bash
# =====================================================================
#  PRODUCTION EN UNE COMMANDE — un épisode de série (ex. L'Énigme humaine)
#  Usage : tools/produce.sh <projet> <dossier-livraison> <PREFIXE>
#     ex. tools/produce.sh enigme-ep002 ../ENIGME_HUMAINE_EP002 EP002
#  Le projet contient : narration.json, index.html, scene.js, score.py
#  Étapes : voix + minutage → rendu images → musique & mix → exports
#           → couverture → contrôles (durée, décodage, transcription)
# =====================================================================
set -euo pipefail
cd "$(dirname "$0")/.."
PROJ="$1"; OUT="$2"; PFX="$3"
P="projects/$PROJ"
CACHE="${GX_CACHE:-$HOME/.cache/gx-motion}"
WORK="${GX_WORK:-/tmp/gx-$PROJ}"
mkdir -p "$CACHE" "$WORK" "$OUT"
FF="${FFMPEG:-$(python3 -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())' 2>/dev/null || true)}"
[ -n "$FF" ] || { pip install -q imageio-ffmpeg scipy numpy pillow; FF=$(python3 -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())'); }
say() { printf '\n\033[1m▶ %s\033[0m\n' "$*"; }

# --- outils voix (installés une seule fois dans le cache) ---
VENV="$CACHE/venv"
if [ ! -x "$VENV/bin/python" ]; then
  say "Installation des outils voix (une seule fois)"
  PKGS="kokoro-onnx faster-whisper soundfile librosa chatterbox-tts setuptools<81"   # chatterbox = voix C expressive de la série
  if command -v uv >/dev/null; then uv venv -q -p python3 "$VENV" && VIRTUAL_ENV="$VENV" uv pip install -q $PKGS
  else python3 -m venv "$VENV" && "$VENV/bin/pip" install -q $PKGS; fi
fi
KOK="$CACHE/kokoro"
if [ ! -f "$KOK/kokoro-v1.0.onnx" ]; then
  say "Téléchargement du modèle de voix Kokoro (une seule fois)"
  mkdir -p "$KOK"
  curl -sSL -o "$KOK/kokoro-v1.0.onnx" https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
  curl -sSL -o "$KOK/voices-v1.0.bin" https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
fi
[ -d node_modules ] || npm install --no-audit --no-fund

# 1. voix + minutage mot à mot (seulement si le texte a changé)
if [ ! -f "$P/timeline.json" ] || [ "$P/narration.json" -nt "$P/timeline.json" ] || [ ! -f "$WORK/voice.wav" ]; then
  say "1/6 Narration et minutage"
  "$VENV/bin/python" tools/narrate.py "$P/narration.json" "$KOK" "$WORK"
  cp "$WORK/timeline.json" "$P/timeline.json"
else say "1/6 Narration inchangée (réutilisée)"; fi

# 2. images
if [ "${GX_SKIP_RENDER:-0}" = "1" ] && [ -f "$WORK/render/segments.txt" ]; then say "2/6 Images déjà rendues (réutilisées)"
else say "2/6 Rendu des images"; node tools/render.js "$PROJ" "$WORK/render" 4 30; fi

# 3. musique + design sonore + mixage
say "3/6 Musique et mixage"
python3 "$P/score.py" "$WORK/render/sfx.json" "$WORK/voice.wav" "$WORK/render/audio.wav"

# 4. exports
say "4/6 Exports"
X264="-c:v libx264 -preset slow -b:v 9500k -pix_fmt yuv420p -profile:v high -level 4.2 -r 30 -g 60"
"$FF" -loglevel error -y -f concat -safe 0 -i "$WORK/render/segments.txt" -an $X264 -pass 1 -passlogfile "$WORK/pass" -f mp4 /dev/null
"$FF" -loglevel error -y -f concat -safe 0 -i "$WORK/render/segments.txt" -i "$WORK/render/audio.wav" -map 0:v -map 1:a $X264 -maxrate 16000k -bufsize 24000k \
  -pass 2 -passlogfile "$WORK/pass" -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart -shortest "$OUT/${PFX}_MASTER_9x16.mp4"
cp "$OUT/${PFX}_MASTER_9x16.mp4" "$OUT/${PFX}_TIKTOK.mp4"
cp "$OUT/${PFX}_MASTER_9x16.mp4" "$OUT/${PFX}_YOUTUBE_SHORTS.mp4"
cp "$WORK/render/audio.wav" "$OUT/${PFX}_AUDIO.wav"; cp "$WORK/subtitles.srt" "$OUT/${PFX}_SUBTITLES.srt"
# extrait promo ≈ 15 s : l'accroche (scène 1) + la question finale et le titre
read A B C E < <(python3 - "$P/timeline.json" <<'PY'
import json, sys
t = json.load(open(sys.argv[1])); S = t['sentences']; D = t['duration']
hook = max(s['end'] for s in S if s['scene'] == 1) + .35
tail = 15.3 - hook
print(0, round(hook, 2), round(max(hook + 1, D - tail), 2), round(D, 2))
PY
)
"$FF" -loglevel error -y -i "$OUT/${PFX}_MASTER_9x16.mp4" -filter_complex \
 "[0:v]trim=$A:$B,setpts=PTS-STARTPTS[v1];[0:v]trim=$C:$E,setpts=PTS-STARTPTS[v2];[v1][v2]xfade=transition=fade:duration=0.3:offset=$(python3 -c "print($B-$A-0.3)")[v];[0:a]atrim=$A:$B,asetpts=PTS-STARTPTS[a1];[0:a]atrim=$C:$E,asetpts=PTS-STARTPTS[a2];[a1][a2]acrossfade=d=0.3[a]" \
 -map "[v]" -map "[a]" -c:v libx264 -preset slow -b:v 9500k -maxrate 16000k -bufsize 24000k -pix_fmt yuv420p -r 30 -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$OUT/${PFX}_PROMO_15s.mp4"

# 5. couverture
say "5/6 Couverture"
(curl -s -o /dev/null http://localhost:8765/ || (python3 -m http.server 8765 >/dev/null 2>&1 &)); sleep 1
node tools/cover.js "$PROJ" "$OUT/${PFX}_COVER.png"

# 6. contrôles
say "6/6 Contrôles"
"$FF" -v error -i "$OUT/${PFX}_MASTER_9x16.mp4" -f null - && echo "✔ décodage intégral sans erreur"
"$FF" -i "$OUT/${PFX}_MASTER_9x16.mp4" 2>&1 | grep -E "Duration|Stream" || true
"$FF" -loglevel error -y -i "$OUT/${PFX}_MASTER_9x16.mp4" -ac 1 -ar 16000 "$WORK/qa16.wav"
"$VENV/bin/python" - "$WORK/qa16.wav" "$P/narration.json" <<'PY'
import json, re, sys, unicodedata, soundfile as sf
from faster_whisper import WhisperModel
w, _ = sf.read(sys.argv[1], dtype='float32')
segs, _ = WhisperModel('small', device='cpu', compute_type='int8').transcribe(w, language='fr', beam_size=5, temperature=0.0)
heard = ' '.join(s.text.strip() for s in segs)
ref = ' '.join(c[1] if len(c) > 1 and c[1] else c[0] for s in json.load(open(sys.argv[2], encoding='utf-8'))['sentences'] for c in s['chunks'])
def n(s):
    s = unicodedata.normalize('NFD', s.lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9 ]+', ' ', re.sub(r"[’'«»“”-]", ' ', s)).split()
r, h = n(ref), n(heard); d = list(range(len(h) + 1))
for i, a in enumerate(r, 1):
    p, d[0] = d[0], i
    for j, b in enumerate(h, 1): p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (a != b))
print(f'✔ transcription du master : {d[len(h)] / len(r):.1%} d’écart avec le texte prononcé')
PY
ls -la "$OUT"
say "Terminé → $OUT"
