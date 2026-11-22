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
- **Son (depuis le 22/11) :** **une seule musique de fond continue**, du début à la fin : nappe de cordes, basse, arpège de piano régulier et pulsation douce, avec une énergie qui suit le propos. Elle n'a ni coupure ni silence, elle reste présente sous la voix (atténuée d'environ 4 dB) et finit par le thème de fin de la série. La voix reste toujours devant.
- **Voix :** la **version C, expressive**, avec le ton d'un professeur qui explique (voir `VOICE_DESIGN.md`).

## 3. Bibliothèque de décors (déjà construits, réutilisables)

1. La chambre au miroir (lampe, rideaux, plante, tapis, horloge, post-it)
2. Le couloir d'arcades, avec deux portes (bien / mal) et un manuscrit dans un rayon de lumière
3. La salle à géométrie islamique (moucharabieh, soleil, lumière au sol)
4. L'écran partagé de la nuance
5. La bibliothèque monumentale, avec le buste et le réseau lumineux
6. La ville la nuit, avec la boucle déclencheur → habitude → automatisme
7. *(ép. 002)* La chambre d'enfant, le désert de Job, l'étang au crépuscule, la colline de Sisyphe
8. *(ép. 003)* **La bibliothèque des siècles** : vraie perspective, voûte à caissons, deux étages de livres, fenêtre au fond ; l'élève assis, la main sur le front ; versions nuit et aube
9. *(ép. 003)* Le manuscrit ouvert RATIO / FIDES (lettrines, écriture gothique abstraite, schémas à la plume)
10. *(ép. 003)* L'arche et sa clé de voûte (deux moitiés différentes qui tiennent ensemble)
11. *(ép. 003)* La Bible au lutrin : lumière naturelle, profondeur de champ, signet, tranche dorée
12. *(ép. 003)* La cour à arcades : alternance du jour et de la nuit, lumière à travers les arcs, bassin-miroir, étoiles reliées en géométrie
13. *(ép. 003)* La chapelle aux vitraux, avec un tableau du domaine public dans un cadre doré, et le schéma à deux niveaux (escalier, limite, rosace)
14. *(ép. 004)* La rue sous la pluie, la nuit, avec un passage piéton et deux passants (le personnage de la série en sweat, un second en manteau et bonnet) ; version aube
15. *(ép. 004)* L'arbre en coupe : l'acte au-dessus du sol, le « pourquoi » dans les racines ; versions jour et nuit, avec des racines profondes vers deux lumières
16. *(ép. 004)* La nef en perspective, avec deux personnes en miroir et une Bible au lutrin
17. *(ép. 004)* La forêt d'arcs bicolores (arcs outrepassés sur colonnes, arcs supérieurs), avec une ombre géométrique au sol et une balance de lumière
18. *(ép. 004)* Le cabinet du philosophe : lambris, fenêtre étoilée, portrait ovale du domaine public, boussole du devoir

## 3 bis. Transitions (révisées le 22/11 : sobres et fluides)

Les transitions sont des **fondus enchaînés en mouvement**, d'environ 1 s, pendant que la voix continue de parler. Elles n'ont ni flou, ni image fantôme, ni volet géométrique :
- `tilt` : la caméra continue de descendre ou de monter pendant le fondu ;
- `warm` : fondu à travers une lumière chaude, sans flash blanc ;
- `drift` : fondu avec un léger glissement latéral ;
- `dissolve` : fondu avec un léger travelling avant.

### Ancienne version (ép. 004 v1, abandonnée : jugée « bizarre »)

Chaque passage de la voix enchaîne sur le suivant par une **transition qui a un sens**, d'environ 1 s, posée dans le silence entre deux phrases (`KINDS` dans `scene.js`) :

| Transition | Effet | Usage |
|---|---|---|
| `descend` / `rise` | la caméra plonge sous le sol ou remonte ; une ligne de lumière fait le raccord | du concret vers le fondement, et retour |
| `light` | on traverse une source lumineuse (un fruit devient un vitrail) | vers une perspective spirituelle |
| `whip` | panoramique filé : une architecture chasse l'autre | d'une tradition à l'autre |
| `star` | une étoile géométrique s'ouvre en tournant | de la géométrie islamique vers l'objet suivant (la boussole) |
| `page` | la page tourne | du philosophe vers la synthèse |

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
