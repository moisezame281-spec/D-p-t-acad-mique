# Logo de « L'Énigme humaine » (retenu le 23/11/2026)

**Le logo B, « la serrure humaine » :**
- une silhouette en trou de serrure (une tête, des épaules), traversée par une lumière dorée, dans un anneau d'or ;
- l'humain est une énigme qu'on ouvre ;
- dessiné par code (`motion/lib/enigme.js`), sans aucune image ni police tierce hors licence OFL.

| Fichier | Usage |
|---|---|
| `EH_photo_profil.png` | **Photo de profil** TikTok, YouTube et Instagram (1080 × 1080). Le cercle est centré, donc le recadrage rond des réseaux ne coupe rien. |
| `EH_logo.png` | Le logo rond seul, sur fond transparent (1080 × 1080) : incrustations, miniatures, documents |
| `EH_logo_nom.png` | Le logo, le nom et la devise, sur fond charbon (1080 × 1080) : publications, carrousels |
| `EH_logo_nom_fond_clair.png` | La même chose sur fond ivoire (impression, documents clairs) |
| `EH_banniere_1920x1080.png` | Bannière horizontale (YouTube, présentation, en-tête) |
| `EH_signature_sonore.wav` | **Signature sonore** (3,2 s) : deux notes qui montent comme une question, la puis mi |
| `EH_habillage_apercu.mp4` | **Aperçu** de l'habillage sur le début et la fin de l'épisode 008, en 14 s. L'épisode 008 publié n'est pas modifié. |

## Dans les vidéos (à partir de l'EP009)
1. **Ouverture :**
   - l'image et la question arrivent dès la première image ;
   - le logo s'allume en haut à gauche en 0,45 s, avec la signature sonore ;
   - le nom glisse à côté, puis se replie au bout de 3,4 s : il ne reste que le logo rond.
2. **Pendant toute la vidéo :** le logo reste discret en haut à gauche, sous le bouton LIVE de TikTok.
3. **Fin :** le carton de fin, avec le logo qui s'allume au centre (même signature), le nom, la devise et « Suis la série / une nouvelle question chaque semaine ».

Le détail technique est dans `series/enigme-humaine/FORMAT.md`, § 2 bis.

## Couleurs et polices
- **Couleurs :**
  - charbon `#111216` ;
  - bordeaux `#541D2A` (fond du disque) ;
  - or `#C0A16A` et `#F3DFA8` (lumière et anneau) ;
  - rose `#E8949A` (nom) ;
  - ivoire `#F2EFE8`.
- **Polices :**
  - nom en Instrument Serif italique ;
  - devise « FAIS TA PROPRE RÉFLEXION » en Fraunces.
  - Les deux sont sous licence OFL : usage commercial autorisé.

## Pour regénérer les fichiers
1. Lance le serveur d'aperçu : `cd motion && python3 -m http.server 8765`.
2. Ouvre `http://localhost:8765/brand/enigme/logo.html`.
3. Dans la console, appelle `draw('profile')`, `draw('icon','B')`, `draw('lockup','B')`, `draw('lockup-light')` ou `draw('wide')`.
4. Exporte le canevas.
5. Pour la signature sonore : `python3 motion/tools/brand_audio.py sortie.wav`.

## Droits
- Le logo et la signature sonore sont des créations originales de la série, sans image, son ni modèle tiers.
- L'aperçu reprend la voix, la musique et les décors de l'épisode 008, avec les mêmes droits (voir `ENIGME_HUMAINE_EP008/EP008_AUDIO_LICENSES.md`).
- Aucune recherche d'antériorité n'a été faite. Avant de déposer le nom ou le logo comme marque, une recherche auprès de l'INPI est conseillée.
