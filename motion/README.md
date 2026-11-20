# GEXAA Motion : studio de vidéos animées

Vidéos marketing en motion design pour GEXAA, produites avec Claude depuis un téléphone.
L'identité visuelle complète est décrite dans [`brand/CHARTE.md`](brand/CHARTE.md).

## Productions

| Date | Projet | Format | Fichier |
|---|---|---|---|
| 19/11/2026 | Journée mondiale de la philosophie : « La foi s’oppose-t-elle à la raison ? » | 60 s · 1080×1920 · 30 i/s | [HD](exports/gexaa-philo-2026-9x16.mp4) · [WhatsApp](exports/gexaa-philo-2026-9x16-whatsapp.mp4) · [couverture](exports/gexaa-philo-2026-couverture.png) |
| 20/11/2026 | ✅ **Version retenue** : même vidéo **avec voix off** (voix de synthèse française, « Gé-ksa ») | 60 s · 1080×1920 · 30 i/s | [HD](exports/gexaa-philo-2026-9x16-voix-off.mp4) · [WhatsApp](exports/gexaa-philo-2026-9x16-whatsapp-voix-off.mp4) · texte : [`voix-off.json`](projects/philo-2026/voix-off.json) |
| 20/11/2026 | **Version finale avec la voix de GEXAA** (copie de voix), vidéo adaptée au débit de la voix | 65,6 s · 1080×1920 · 30 i/s | [HD](exports/gexaa-philo-2026-9x16-ma-voix.mp4) · [WhatsApp](exports/gexaa-philo-2026-9x16-whatsapp-ma-voix.mp4) · texte : [`voix-off-clone.json`](projects/philo-2026/voix-off-clone.json) |
| 20/11/2026 | **L’Énigme humaine — EP001** « Tu sais. Tu recommences. Pourquoi ? » (documentaire graphique) | 59,5 s · 1080×1920 · 30 i/s | dossier [`ENIGME_HUMAINE_EP001/`](../ENIGME_HUMAINE_EP001/) · source [`projects/enigme-ep001/`](projects/enigme-ep001/) |
| 20/11/2026 | **L’Énigme humaine — EP002** « Si Dieu est bon, pourquoi les innocents souffrent-ils ? » | 65,8 s · 1080×1920 · 30 i/s | dossier [`ENIGME_HUMAINE_EP002/`](../ENIGME_HUMAINE_EP002/) · source [`projects/enigme-ep002/`](projects/enigme-ep002/) |

---

## Commander une vidéo depuis ton téléphone (5 étapes)

### Étape 1 : envoie le brief (copie-colle et remplis)

Chaque vidéo a son propre univers visuel (voir la section 8 de la charte) : deux vidéos GEXAA ne se ressemblent jamais.

```
BRIEF GEXAA
1. Sujet / occasion :
2. Format : 9:16 (Reels/TikTok/Statut) · 16:9 (présentation/YouTube) · 1:1 (post)
3. Durée : 15 s · 30 s · 60 s
4. Message principal (1 phrase) :
5. Appel à l'action + contact (WhatsApp, adresse, date d'inscription) :
6. Ambiance souhaitée (ou « au choix ») : voir les univers dans brand/CHARTE.md
7. À éviter / obligatoire :
```

Joins les images utiles (logo, photo de l'équipe, affiche) directement dans le message.

### Étape 2 : valide le script
Je te renvoie le **texte écran, scène par scène, avec le minutage**. Tu réponds « OK » ou tu corriges directement dans le texte. Corriger à ce stade ne coûte presque rien.

### Étape 3 : reçois la V1
Je rends la vidéo MP4 (avec musique et effets) et je te l'envoie ici.

### Étape 4 : retours par minutage
Un seul message, une ligne par correction :
```
0:12 → remplacer « copie » par « dissertation »
0:40 → plus lent
0:58 → ajouter notre numéro WhatsApp
```

### Étape 5 : la version finale + les déclinaisons
V2 finale, et sur demande : version 16:9, 1:1, sans musique (pour ajouter un son tendance dans TikTok ou Instagram), miniature.

---

## Partie technique (pour reproduire un rendu)

```bash
cd motion
npm install
pip install imageio-ffmpeg scipy numpy pillow
python3 tools/logo_layers.py assets/logo-source.png assets/logo   # découpe du logo en calques
node tools/render.js philo-2026 /tmp/render 4 30                   # images → segments vidéo + sfx.json
python3 tools/audio.py /tmp/render/sfx.json /tmp/render/audio.wav  # bande-son synthétisée
# voix off (modèle Kokoro : github.com/thewh1teagle/kokoro-onnx, release model-files-v1.0)
pip install kokoro-onnx soundfile
python3 tools/voiceover.py projects/philo-2026/voix-off.json <dossier-modele> /tmp/render/voice.wav
python3 tools/audio.py /tmp/render/sfx.json /tmp/render/audio.wav /tmp/render/voice.wav  # musique baissée sous la voix
# copie de voix (Chatterbox multilingue, MIT) : référence de 10 à 60 s enregistrée au calme
uv venv -p python3.13 venv-voice && VIRTUAL_ENV=venv-voice uv pip install chatterbox-tts soundfile "setuptools<81"
venv-voice/bin/python tools/clone_voice.py projects/philo-2026/voix-off-clone.json <ma-voix.wav> /tmp/render/voice.wav 60 /tmp/clone-cache
# avec "warp": true, une carte temporelle est écrite à côté : la vidéo et la musique la suivent
node tools/render.js philo-2026 /tmp/render 4 30 /tmp/render/voice.wav.warp.json
python3 tools/audio.py /tmp/render/sfx.json /tmp/render/audio.wav /tmp/render/voice.wav /tmp/render/voice.wav.warp.json
# assemblage final : voir tools/encode.sh
```

- `lib/engine.js` : moteur d'animation image par image (écriture à la plume, encre, poussière d'or).
- `projects/<nom>/` : une vidéo = un dossier (`index.html` + `scene.js`).
- Aperçu rapide d'images clés : `python3 -m http.server 8765` puis `node tools/preview.js philo-2026 <dossier> 3.4 13.5 29.6`.
