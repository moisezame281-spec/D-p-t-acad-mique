# L'Énigme humaine : format de série (modèle figé après l'épisode 001)

Ce document fixe ce qui ne change plus d'un épisode à l'autre. Une nouvelle vidéo ne demande donc que le texte, les références et les quelques décors nouveaux.

## 1. Structure de chaque épisode (2 minutes maximum)

| Bloc | Rôle | Durée indicative |
|---|---|---|
| 1. **La question** | Une situation vécue, puis la question en grand (kinetic typography) et une coupure sonore | 6–10 s |
| 2. **Perspective A** | Première tradition ou source, avec sa référence exacte à l'écran | 8–15 s |
| 3. **Perspective B** | Deuxième tradition, dans un univers visuel distinct | 8–15 s |
| 4. **La nuance** | Les deux plans séparés : « ces approches ne disent pas la même chose » | 4–6 s |
| 5. **Le philosophe** | Le concept clé, dans sa langue d'origine puis en français | 8–12 s |
| 6. **La science** | La piste scientifique, sous forme de schéma lisible sans le son et avec sa source | 8–12 s |
| 7. **La solution évoquée** | La piste concrète (« il faut aussi comprendre… »), puis la question posée au spectateur, puis le titre | 10–15 s |

Le format court fait **58 à 60 s** ; le format long peut aller **jusqu'à 2 min** si un épisode a besoin de plus de perspectives.

## 2. Identité fixe

**Couleurs**

| Rôle | Nom | Valeur |
|---|---|---|
| Fond | Noir charbon | `#111216` |
| Texte | Ivoire | `#F2EFE8` |
| Illustrations | Or patiné | `#C0A16A` |
| Accent typographique, nouveau, à la place de l'or « standard » | Rose grenat | `#E8949A` |
| Ambiance | Bordeaux profond | `#541D2A` |
| Ambiance | Bleu nuit | `#19283C` |

**Typographie** (toutes les polices sont sous licence OFL, usage commercial autorisé)

| Police | Rôle |
|---|---|
| **Instrument Serif** italique | Titre de la série (« L'Énigme humaine ») et signature finale (« Fais ta propre réflexion. ») |
| **Bodoni Moda** | Grands titres : la question, les concepts, le titre final |
| **Fraunces** | Références, sources, schémas et petits textes (en romain ou en italique, souvent en rose grenat) |
| EB Garamond / Amiri | Mots en grec ou en arabe, uniquement s'ils sont vérifiés à la source |
| Inter | Sous-titres incrustés, pour une lisibilité maximale sur mobile |

**Autres constantes**

- **Personnage :** la même silhouette dans tous les épisodes (cheveux courts, sweat à capuche, téléphone), avec un double éclairage : froid côté écran, chaud côté lampe.
- **Ouverture :** grand titre « L'Énigme humaine » en Instrument Serif rose, avec le numéro de l'épisode.
- **Clôture :** le miroir vide, la lumière qui monte, puis « L'ÉNIGME HUMAINE. » et « Fais ta propre réflexion. »
- **Son :** musique synthétisée, propre à chaque épisode, par sections ; coupure sur la question ; silence final ; la voix toujours devant.
- **Voix :** la **version C, expressive**, avec le ton d'un professeur qui explique (voir `VOICE_DESIGN.md`).

## 3. Bibliothèque de décors (déjà construits, réutilisables)

1. La chambre au miroir (lampe, rideaux, plante, tapis, horloge, post-it)
2. Le couloir d'arcades, avec deux portes (bien / mal) et un manuscrit dans un rayon de lumière
3. La salle à géométrie islamique (moucharabieh, soleil, lumière au sol)
4. L'écran partagé de la nuance
5. La bibliothèque monumentale, avec le buste et le réseau lumineux
6. La ville la nuit, avec la boucle déclencheur → habitude → automatisme

**Règle de variété :** chaque nouvel épisode réutilise au maximum 4 décors et en ajoute au moins 1 nouveau, ou une variante (saison, lumière, lieu). Deux épisodes ne se ressemblent donc jamais.

## 4. Ce que tu m'envoies pour un épisode

```
ÉPISODE N°… — TITRE :
QUESTION (accroche) :
SCRIPT DE NARRATION (texte final) :
PERSPECTIVES + RÉFÉRENCES EXACTES (avec liens) :
PISTE / SOLUTION ÉVOQUÉE :
DÉCOR NOUVEAU SOUHAITÉ (facultatif) :
DURÉE : 60 s ou 2 min
```

## 5. Ce que je fais (en une commande une fois les décors prêts)

```bash
tools/new_episode.sh enigme-ep001 enigme-ep002      # copie du modèle
# j'adapte narration.json, puis les textes et les décors de scene.js
tools/produce.sh enigme-ep002 ../ENIGME_HUMAINE_EP002 EP002
```

La commande enchaîne : voix et minutage au mot près, rendu des images, musique et mixage, master, copies TikTok et Shorts, extrait de 15 s, sous-titres, couverture, puis les contrôles (décodage, durée, transcription). Il reste ensuite à écrire les documents de références et de licences, et à mettre en ligne la page de téléchargement.
