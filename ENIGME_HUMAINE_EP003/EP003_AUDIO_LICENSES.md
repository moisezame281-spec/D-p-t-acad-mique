# EP003 : licences audio et éléments utilisés

**Épisode :** L'Énigme humaine, épisode 003
**Principe :** aucun élément sonore ou visuel tiers sous licence restrictive. Tout ce qui peut l'être est **créé pour l'épisode**. La seule image tierce est dans le domaine public.

## 1. Musique : composition originale

| Élément | Origine | Droits |
|---|---|---|
| Toute la musique (balancier et bourdon de la bibliothèque, contrepoint raison / foi, cordes de l'arche et accord de la clé de voûte, clarté du matin, cordes pincées et carillon des étoiles, chœur synthétique sans paroles, résolution, thème de fin de la série) | **Synthétisée note par note** par le script `motion/projects/enigme-ep003/score.py`. Aucun échantillon, aucune boucle, aucune banque de sons. | Œuvre originale du producteur. Aucun tiers à rémunérer ni à créditer. |

- Le « chœur » est une synthèse de voyelle sans aucune parole. Il n'y a **aucun chant religieux, aucune récitation et aucun appel à la prière**.
- **Diffusion couverte :** TikTok, YouTube (Shorts et vidéos), Instagram, Facebook, autres réseaux, diffusion organique **et** campagnes publicitaires.
- **Content ID / Copyright Match :** aucun risque de réclamation, puisque l'œuvre n'est déposée nulle part.

## 2. Design sonore : original

Tous les effets (bougie, pages, plume, pierres, verre, clé de voûte, oiseaux du matin, fontaine, goutte d'eau, carillons, souffles) sont **synthétisés par le même script** à partir de bruit et d'oscillateurs.

## 3. Voix off : version C de la série (expressive)

| Élément | Origine | Licence |
|---|---|---|
| Moteur expressif | **Chatterbox Multilingual** (Resemble AI) | MIT (usage commercial autorisé) |
| Référence de timbre | `series/enigme-humaine/voix_reference.flac`, générée avec **Kokoro-82M** (voix `ff_siwis`) | Apache-2.0 selon la fiche du modèle |
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
| EB Garamond | Titres latins du manuscrit (RATIO, FIDES), lettrines, chiffre du chapitre |
| Amiri | Nom de la sourate en arabe (آل عمران) |

## 5. Images

| Élément | Origine | Droits |
|---|---|---|
| Décors, personnage, schémas (bibliothèque, manuscrit, arche, Bible, cour à arcades, chapelle, escalier) | **Dessinés par code** (`motion/lib/cine.js` et `motion/projects/enigme-ep003/scene.js`) | Originaux |
| Portrait de Thomas d'Aquin | Carlo Crivelli, 1476, National Gallery de Londres ; fichier Wikimedia Commons `St-thomas-aquinas.jpg` | **Domaine public** (vérifié via l'API Commons : *Public domain*, non protégé, attribution non requise). Le crédit est affiché par courtoisie. |

Il n'y a aucune photo ou vidéo de banque d'images, aucune image générée par IA, et les références Unsplash et Pexels du brief n'ont servi que d'inspiration.

## Justificatifs conservés

- Le code source complet de la musique, du design sonore et des images (dépôt GitHub, dossier `motion/`).
- La fiche Commons du portrait (licence) et la copie utilisée : `motion/projects/enigme-ep003/assets/aquinas.jpg`.
- La présente fiche.
