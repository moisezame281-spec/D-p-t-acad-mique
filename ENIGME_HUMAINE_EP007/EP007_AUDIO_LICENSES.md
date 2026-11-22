# EP007 : licences audio et éléments utilisés

**Épisode :** L'Énigme humaine, épisode 007
**Principe :** aucun élément sonore ou visuel tiers sous licence restrictive. Tout est **créé pour l'épisode**, sauf une image du domaine public (le portrait de Locke).

## 1. Musique : composition originale

| Élément | Origine | Droits |
|---|---|---|
| Toute la musique : **une seule musique de fond continue** (nappe de cordes, basse, arpège de piano, pulsation douce, en mi mineur à 78 battements/min, avec une boîte à musique sur la photographie d'enfance, puis le thème de fin de la série) | **Synthétisée note par note** par le script `motion/projects/enigme-ep007/score.py`. Aucun échantillon, aucune boucle, aucune banque de sons. | Œuvre originale du producteur. Aucun tiers à rémunérer ni à créditer. |

- Il n'y a **aucun chant religieux, aucune récitation et aucun appel à la prière**.
- **Diffusion couverte :** TikTok, YouTube (Shorts et vidéos), Instagram, Facebook, autres réseaux, diffusion organique **et** campagnes publicitaires.
- **Content ID / Copyright Match :** aucun risque de réclamation, puisque l'œuvre n'est déposée nulle part.

## 2. Design sonore : original

Tous les effets (déclic d'appareil photo, papier, scintillement du miroir, bougie, fil de lumière, tuiles de verre qui se défont et se recomposent, eau du lac, poussière, vent, pierre qui se fend, souffles doux des transitions, carillons) sont **synthétisés par le même script** à partir de bruit et d'oscillateurs.

## 3. Voix off : version C de la série (expressive)

| Élément | Origine | Licence |
|---|---|---|
| Moteur expressif | **Chatterbox Multilingual** (Resemble AI) | MIT (usage commercial autorisé) |
| Référence de timbre | `series/enigme-humaine/voix_reference.flac`, générée avec **Kokoro-82M** (voix `ff_siwis`) | Apache-2.0 selon la fiche du modèle |
| Intonation des questions (montée de la voix sur le mot interrogé) | `pyworld` (analyse/resynthèse WORLD) | MIT (pyworld) et BSD modifiée (WORLD) |
| Ralentissement léger de la question d'ouverture (−10 %, hauteur conservée) | filtre `atempo` de FFmpeg | LGPL 2.1 (outil de traitement, aucun contenu tiers) |
| Contrôle de la transcription (sans effet sur le son) | `faster-whisper`, modèles « small » et « medium » | MIT |

- **Filigrane :** Chatterbox ajoute à chaque fichier généré un filigrane inaudible (« Perth ») qui permet d'identifier un contenu de synthèse. Il n'a aucun effet audible et ne gêne pas la diffusion.
- ⚠️ **À vérifier avant une campagne publicitaire payante :** le timbre de référence vient de la voix `ff_siwis`, entraînée sur le corpus vocal français SIWIS. La licence de ce corpus est annoncée comme CC BY 4.0, mais je ne l'ai pas confirmée sur la source d'origine. Garde une trace de la fiche du modèle Kokoro-82M.

## 4. Polices de caractères

Toutes sont sous **SIL Open Font License 1.1** (usage commercial autorisé, y compris en vidéo) et proviennent des paquets Fontsource :

| Police | Rôle |
|---|---|
| Instrument Serif | Titre de la série, citations, signature |
| Bodoni Moda | Grands titres |
| Fraunces | Références, sources, petits textes |
| Inter | Sous-titres incrustés |

## 5. Images

| Élément | Origine | Droits |
|---|---|---|
| Décors, personnages, schémas (vieille photographie et portraits dessinés, miroir ancien, fil des souvenirs, mémoire en mosaïque et réseau de neurones, lac à l'aube, statue dans la brume, galerie des trois cadres) | **Dessinés par code** (`motion/lib/cine.js` et `motion/projects/enigme-ep007/scene.js`) | Originaux |
| Portrait de John Locke (scène 3) | Godfrey Kneller, 1697, musée de l'Ermitage ; fichier Wikimedia Commons « Godfrey Kneller - Portrait of John Locke (Hermitage).jpg » (`motion/projects/enigme-ep007/assets/locke.jpg`) | **Domaine public** (PD-Art / PD-old-100-expired). Crédit affiché à l'écran. |

Les « photographies » d'enfant et d'adulte sont des **dessins** et ne représentent personne de réel. Il n'y a aucune photo, aucune vidéo de banque d'images et aucune image générée par IA.

## Justificatifs conservés

- Le code source complet de la musique, du design sonore et des images (dépôt GitHub, dossier `motion/`).
- La présente fiche.
