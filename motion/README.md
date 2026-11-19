# GEXAA Motion : studio de vidéos animées

Vidéos marketing en motion design pour GEXAA, produites avec Claude depuis un téléphone.
L'identité visuelle complète est décrite dans [`brand/CHARTE.md`](brand/CHARTE.md).

## Productions

| Date | Projet | Format | Fichier |
|---|---|---|---|
| 19/11/2026 | Journée mondiale de la philosophie : « La foi s'oppose-t-elle à la raison ? » | 60 s · 1080×1920 · 30 i/s | [`exports/gexaa-philo-2026-9x16.mp4`](exports/gexaa-philo-2026-9x16.mp4) |

---

## Commander une vidéo depuis ton téléphone (5 étapes)

### Étape 1 : envoie le brief (copie-colle et remplis)

```
BRIEF GEXAA
1. Sujet / occasion :
2. Format : 9:16 (Reels/TikTok/Statut) · 16:9 (présentation/YouTube) · 1:1 (post)
3. Durée : 15 s · 30 s · 60 s
4. Message principal (1 phrase) :
5. Appel à l'action + contact (WhatsApp, adresse, date d'inscription) :
6. À éviter / obligatoire :
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
# assemblage final : voir tools/encode.sh
```

- `lib/engine.js` : moteur d'animation image par image (écriture à la plume, encre, poussière d'or).
- `projects/<nom>/` : une vidéo = un dossier (`index.html` + `scene.js`).
- Aperçu rapide d'images clés : `python3 -m http.server 8765` puis `node tools/preview.js philo-2026 <dossier> 3.4 13.5 29.6`.
