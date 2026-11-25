# EP010 : licences audio et éléments utilisés

**Épisode :** L'Énigme humaine, épisode 010
**Principe :** aucun élément sonore ou visuel tiers sous licence restrictive. Tout est **créé pour l'épisode** ou pour l'identité de la série, et il n'y a aucune image tierce.

## 1. Musique : composition originale

| Élément | Origine | Droits |
|---|---|---|
| Toute la musique : **une seule musique de fond continue** (nappe de cordes, basse, arpège de piano, pulsation douce, en si mineur à 70 battements/min, puis le thème de fin de la série en ré majeur) | **Synthétisée note par note** par le script `motion/projects/enigme-ep010/score.py`. Aucun échantillon, aucune boucle, aucune banque de sons. | Œuvre originale du producteur. Aucun tiers à rémunérer ni à créditer. |
| **Signature sonore de la série** (deux notes qui montent, la puis mi, à l'ouverture et au carton de fin) | Synthétisée par `motion/tools/brand_audio.py` | Création originale de la série |

- **Contenu religieux :** il n'y a aucun chant religieux, aucune récitation et aucun appel à la prière.
- **Diffusion couverte :** TikTok, YouTube (Shorts et vidéos), Instagram, Facebook, autres réseaux, diffusion organique **et** campagnes publicitaires.
- **Content ID / Copyright Match :** l'œuvre n'est déposée nulle part, elle ne peut donc pas déclencher de réclamation.

## 2. Design sonore : original

Tous les effets sont **synthétisés par le même script** à partir de bruit et d'oscillateurs :
- l'air de la salle de lecture et la page qui se tourne ;
- les pas de celui qui s'éloigne et le livre qui se ferme ;
- le vase qui se fêle ;
- la porte qui s'ouvre et la cale posée au sol ;
- le bol qui se brise et la réparation d'or (petites cloches) ;
- les traits qui barrent les quatre objets ;
- la tension des ombres qui exigent ;
- le vent léger derrière la porte ouverte ;
- les souffles doux des transitions.

## 3. Voix off : version C de la série, voix d'homme (timbre B)

| Élément | Origine | Licence |
|---|---|---|
| Moteur expressif | **Chatterbox Multilingual** (Resemble AI) | MIT (usage commercial autorisé) |
| Référence de timbre | `series/enigme-humaine/voix_homme/Voix_homme_B_reference.wav` : **timbre synthétique**, obtenu en abaissant la hauteur et les formants de la référence de la série (`motion/tools/male_ref.py`, analyse/resynthèse WORLD). Il n'imite aucune personne réelle. | Dérivée de `voix_reference.flac` (Kokoro-82M, voix `ff_siwis`, Apache-2.0 selon la fiche du modèle) |
| Intonation des questions (montée de la voix sur le mot interrogé) | `pyworld` (analyse/resynthèse WORLD) | MIT (pyworld) et BSD modifiée (WORLD) |
| Ralentissement léger de l'ouverture et des questions (hauteur conservée) | filtre `atempo` de FFmpeg | LGPL 2.1 (outil de traitement, aucun contenu tiers) |
| Contrôle de la transcription (sans effet sur le son) | `faster-whisper`, modèles « small » et « medium » | MIT |

- **Filigrane :** Chatterbox ajoute un filigrane inaudible (« Perth ») qui identifie un contenu de synthèse.
- ⚠️ **À vérifier avant une campagne publicitaire payante :** le timbre de départ vient de la voix `ff_siwis`, entraînée sur le corpus vocal français SIWIS. La licence de ce corpus est annoncée comme CC BY 4.0, mais elle n'a pas été confirmée sur la source d'origine.

## 4. Polices de caractères

Toutes sont sous **SIL Open Font License 1.1** (usage commercial autorisé, y compris en vidéo) et proviennent des paquets Fontsource :

| Police | Rôle |
|---|---|
| Instrument Serif | Nom de la série, citations, questions écrites mot à mot |
| Bodoni Moda | Grands titres |
| Fraunces | Références, sources, petits textes |
| Amiri | Nom arabe de la sourate (copié de la fiche officielle de Quran.com) |
| Inter | Sous-titres incrustés |

## 5. Images

| Élément | Origine | Droits |
|---|---|---|
| Décors, personnages, objets | **Dessinés par code** (`motion/lib/cine.js` et `motion/projects/enigme-ep010/scene.js`) | Originaux |
| Logo de la série (la serrure humaine) | Dessiné par code (`motion/lib/enigme.js`) | Création originale de la série |

**Liste des décors :**
- le livre dont on tourne la page ;
- les deux silhouettes séparées ;
- le vase qui se fêle et la porte entrouverte ;
- le chemin des trois pierres ;
- la cour et le carreau réparé d'or ;
- le bol en kintsugi ;
- les quatre objets barrés ;
- la chaise vide ;
- la porte grande ouverte.

**Ce que l'épisode ne contient pas :**
- aucune photo, aucune vidéo de banque d'images, aucune image générée par IA ;
- le kintsugi est évoqué par un bol dessiné, sans reproduire aucune œuvre existante.

## Justificatifs conservés

- Le code source complet de la musique, du design sonore et des images (dépôt GitHub, dossier `motion/`).
- La présente fiche.
