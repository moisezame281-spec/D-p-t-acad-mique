# EP001 : licences audio et éléments utilisés

**Épisode :** L'Énigme humaine, épisode pilote 001
**Principe :** aucun élément sonore ou visuel tiers sous licence restrictive. Tout ce qui peut l'être est **créé pour l'épisode**.

## 1. Musique : composition originale

| Élément | Origine | Droits |
|---|---|---|
| Toute la musique (nappe de tension, cordes, texture épurée, pizzicati, arpèges, piano, résolution) | **Synthétisée note par note** par le script `motion/projects/enigme-ep001/score.py`. Aucun échantillon, aucune boucle, aucune banque de sons. | Œuvre originale du producteur. Aucun tiers à rémunérer ni à créditer. |

- Aucun extrait de chant religieux. Aucune imitation volontaire d'une bande originale existante (progressions d'accords courantes en ré mineur et ré majeur).
- **Diffusion couverte :** TikTok, YouTube (Shorts et vidéos), Instagram, Facebook, autres réseaux, diffusion organique **et** campagnes publicitaires. Aucune licence de plateforme n'est nécessaire, puisque la musique n'appartient à aucune bibliothèque.
- **Content ID / Copyright Match :** aucun risque de réclamation, puisque l'œuvre n'est déposée nulle part. Si tu la déposes un jour dans un système d'identification, pense à mettre ta propre chaîne en liste blanche.

## 2. Design sonore : original

Tous les effets (tic-tac, vibration du téléphone, impacts, souffles, papier, pas, « pop » des déclencheurs, reflets lumineux) sont **synthétisés par le même script** à partir de bruit et d'oscillateurs. Aucun effet de banque de sons n'est utilisé.

## 3. Voix off : synthèse vocale

| Élément | Origine | Licence |
|---|---|---|
| Modèle de voix | **Kokoro-82M** (hexgrad), voix française `ff_siwis` | Apache-2.0 selon la fiche du modèle (usage commercial autorisé) |
| Moteur d'exécution | `kokoro-onnx` | MIT |
| Contrôle de la transcription (sans effet sur le son) | `faster-whisper`, modèle « small » | MIT |

⚠️ **À vérifier avant une campagne publicitaire payante :** la voix `ff_siwis` a été entraînée sur le corpus vocal français SIWIS. La licence de ce corpus est annoncée comme CC BY 4.0, mais je n'ai pas pu la confirmer sur la source d'origine pendant la production. Pour une publicité payante, vérifie-la ou garde une trace de la fiche du modèle Kokoro-82M.

## 4. Polices de caractères (affichage à l'écran)

Toutes sont sous **SIL Open Font License 1.1** (usage commercial autorisé, y compris en vidéo) et proviennent des paquets Fontsource :

| Police | Rôle |
|---|---|
| Bodoni Moda | Titres éditoriaux |
| Inter | Sous-titres et explications |
| IBM Plex Mono | Références (Romains 7:19-21, 91:7-10…) |
| EB Garamond | Mots conceptuels grecs (ΑΚΡΑΣΙΑ, ΑΡΙΣΤΟΤΕΛΗΣ) |
| Amiri | Nom de la sourate en arabe (الشمس) |
| Caveat | Écriture manuscrite du post-it |

## 5. Images

Tous les décors, personnages et illustrations sont **dessinés par code** (`motion/lib/cine.js` et `motion/projects/enigme-ep001/scene.js`). Aucune photo, aucune vidéo de banque d'images, aucun extrait de film ou de documentaire, aucune image générée par IA.

## Justificatifs conservés

- Le code source complet de la musique, du design sonore et des images (dépôt GitHub, dossier `motion/`).
- Les licences des paquets (`motion/node_modules/@fontsource/*/LICENSE` après `npm install`).
- La présente fiche.
