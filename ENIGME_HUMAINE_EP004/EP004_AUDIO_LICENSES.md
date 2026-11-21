# EP004 : licences audio et éléments utilisés

**Épisode :** L'Énigme humaine, épisode 004
**Principe :** aucun élément sonore ou visuel tiers sous licence restrictive. Tout ce qui peut l'être est **créé pour l'épisode**. La seule image tierce est dans le domaine public.

## 1. Musique : composition originale

| Élément | Origine | Droits |
|---|---|---|
| Toute la musique (pulsation de la rue, accord humain quand les passants s'arrêtent, pizzicati de l'arbre, orgue doux de la nef, cordes pincées et tambour sur cadre des arcs, clavecin et horloge du cabinet de Kant, descente vers les racines, deux carillons pour les deux lumières, aube du débat, thème de fin de la série) | **Synthétisée note par note** par le script `motion/projects/enigme-ep004/score.py`. Aucun échantillon, aucune boucle, aucune banque de sons. | Œuvre originale du producteur. Aucun tiers à rémunérer ni à créditer. |

- L'« orgue » est une synthèse additive sans mélodie liturgique. Il n'y a **aucun chant religieux, aucune récitation et aucun appel à la prière**.
- **Diffusion couverte :** TikTok, YouTube (Shorts et vidéos), Instagram, Facebook, autres réseaux, diffusion organique **et** campagnes publicitaires.
- **Content ID / Copyright Match :** aucun risque de réclamation, puisque l'œuvre n'est déposée nulle part.

## 2. Design sonore : original

Tous les effets (pluie, rumeur de la ville, pas, voiture, souffles des **six transitions** — plongée, lumière, panoramique filé, étoile, page, remontée —, racines, horloge, aiguille de la boussole, carillons) sont **synthétisés par le même script** à partir de bruit et d'oscillateurs.

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
| Amiri | Nom de la sourate en arabe (المائدة) |

## 5. Images

| Élément | Origine | Droits |
|---|---|---|
| Décors, personnages, schémas (rue sous la pluie, arbre en coupe, nef, forêt d'arcs, cabinet de Kant, boussole, balance) | **Dessinés par code** (`motion/lib/cine.js` et `motion/projects/enigme-ep004/scene.js`) | Originaux |
| Portrait de Kant | Johann Gottlieb Becker, 1768, Schiller-Nationalmuseum de Marbach ; fichier Wikimedia Commons `Immanuel Kant - Gemaelde 1.jpg` | **Domaine public** (peintre mort en 1782 ; reproduction fidèle d'une œuvre en deux dimensions, régime PD-Art, selon la page Commons). Le crédit est affiché à l'écran. |

Il n'y a aucune photo ou vidéo de banque d'images, aucune image générée par IA, et les références Infobae, Rawpixel et worldhistory.org du brief n'ont servi que d'inspiration.

## Justificatifs conservés

- Le code source complet de la musique, du design sonore et des images (dépôt GitHub, dossier `motion/`).
- La page Commons du portrait (licence) et la copie utilisée : `motion/projects/enigme-ep004/assets/kant.jpg`.
- La présente fiche.
