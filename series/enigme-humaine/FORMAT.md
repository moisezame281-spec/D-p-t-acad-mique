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

> **Règle du 23/11/2026 (retour sur l'ép. 007) : les personnages ne sont jamais sur fond noir.** Les silhouettes de la série sont sombres. Elles se placent donc toujours devant un fond clair (galerie, papier, ciel, désert de sel) ou à contre-jour (vitrine éclairée, affiche lumineuse), avec un halo clair derrière elles et un liseré de lumière. Sur les décors clairs, un voile discret derrière les sous-titres garde le texte lisible.

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
- **Ouverture :** épisodes 001 à 008, grand titre « L'Énigme humaine » avec le numéro de l'épisode. **À partir de l'EP009 : plus de carton-titre** ; la question dès la première image et le logo qui s'allume en haut (voir § 2 bis).
- **Clôture :** épisodes 001 à 008, « L'ÉNIGME HUMAINE. » et « Fais ta propre réflexion. ». **À partir de l'EP009 : le carton de fin avec le logo** (voir § 2 bis).
- **Son (depuis le 22/11) :** **une seule musique de fond continue**, du début à la fin : nappe de cordes, basse, arpège de piano régulier et pulsation douce, avec une énergie qui suit le propos. Elle n'a ni coupure ni silence, elle reste présente sous la voix (atténuée d'environ 4 dB) et finit par le thème de fin de la série. La voix reste toujours devant.
- **Voix :** la **version C, expressive**, avec le ton d'un professeur qui explique (voir `VOICE_DESIGN.md`).

## 2 bis. Habillage et logo (à partir de l'EP009, validé le 23/11/2026)

**Logo retenu : B, « la serrure humaine ».** Une silhouette en trou de serrure, avec une tête et des épaules, traversée par une lumière dorée, dans un anneau d'or.
- Dessin par code : `motion/lib/enigme.js` (`EH.icon`, `EH.wordmark`, `EH.bug`, `EH.endCard`).
- Fichiers prêts à l'emploi : `series/enigme-humaine/logo/` (voir son `LISEZMOI.md`).

**Pourquoi ce changement :**
- Sur TikTok, on décide en une seconde si on regarde.
- La vidéo commence donc directement par l'image et la question, sans carton-titre.
- Le nom de la série reste visible grâce au logo.

| Moment | Ce qu'on voit | Ce qu'on entend |
|---|---|---|
| **0 → 0,45 s** | L'image est là dès la première image, sans ouverture au noir. Le logo s'allume en haut à gauche : l'anneau se trace, la lumière traverse la serrure, puis un éclat. Le nom « L'Énigme humaine » glisse à côté. | **Signature sonore** : deux notes qui montent comme une question (la, puis mi) |
| **0,3 s →** | La question d'ouverture s'écrit mot à mot, **à partir de y = 290 px**, sur un voile discret | La voix commence (`"lead_in": 0.3`) |
| **3,4 s → fin** | Le nom se replie : il ne reste que le logo rond, discret, en haut à gauche | |
| **Fin de la question finale + 0,65 s** | **Carton de fin :** le fond s'assombrit, le logo s'allume au centre, puis le nom, la devise et l'appel « Suis la série / une nouvelle question chaque semaine » | La même signature, qui ouvre le thème de fin |

**Zones réservées (image 1080 × 1920) :**
- **Le logo en haut :** x 40 → 420, y 150 → 262 pendant les 3,4 premières secondes ; ensuite x 40 → 145 seulement.
  - Aucun grand titre ne commence au-dessus de y = 270, sauf s'il fait moins de 860 px de large.
  - Cette zone évite le bouton LIVE de TikTok, en haut à gauche, et les onglets centrés.
- **Les sous-titres :** y 1280 → 1430, comme avant.
- **Les boutons de TikTok :** bande de droite (x > 940) entre y 900 et 1700, et bas de l'écran (y > 1500). On n'y place rien d'important.

**Mise en œuvre dans un épisode (copie du dernier épisode, puis) :**
1. `index.html` : ajouter `<script src="/lib/enigme.js"></script>` après `cine.js`.
2. `scene.js` :
   - **Ouverture :**
     - pas de `flash` noir au début ;
     - le carton-titre de la série est supprimé ;
     - la question d'ouverture est placée à partir de y = 290 ;
     - elle est révélée avec `revealWords(tQ1, t, 0, …)`.
   - **Fin :** pas de « L'ÉNIGME HUMAINE. » ni de devise en texte DOM (le carton de fin les remplace).
   - **Dans `render(t)`, après `grain()` :**
     ```js
     EH.bug(ctx, t, { out: T.fin - .35 });
     EH.endCard(ctx, t, T.fin);
     ```
     Avec `T.fin = fin de la question finale + .65`.
   - **Signature sonore :** `sfx('signature', 0); sfx('signature', T.fin);`
   - **Couverture :** le logo en petit au-dessus du titre (`EH.icon`).
3. `narration.json` : `"lead_in": 0.3` et `"tail"` d'au moins **4,0 s**, pour que l'appel reste lisible au moins 2 s.
4. `score.py` : la signature s'ajoute **après** le mixage et avant le limiteur, pour ne pas être atténuée sous la voix.
   ```python
   sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../tools'))
   from brand_audio import signature
   SIG = signature(SR)
   for e in [e for e in ev['sfx'] if e['type'] == 'signature']: add(out, e['t'], SIG * .7)
   ```
   Le thème de fin (ré majeur) commence sur le **la** de la signature.

**Un aperçu** de cet habillage, appliqué au début et à la fin de l'épisode 008 : `series/enigme-humaine/logo/EH_habillage_apercu.mp4`.

**Avec chaque épisode, un kit de publication** : voir `KIT_PUBLICATION_modele.md`.

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
19. *(ép. 005)* La cloche de verre dans la galerie de miroirs ; les deux observateurs et la sphère de fragments ; la caverne de Platon ; les deux lumières ; le corridor d'arcs ; le filtre du biais de confirmation
20. *(ép. 006)* Le livre sans dernière page ; le grand sablier de bois ; la roue des saisons ; les ruines dans le désert ; l'atrium romain et le sablier fêlé ; l'allée du vieux cimetière ; la colline au couchant
21. *(ép. 007)* **La vieille photographie** sur la table (tirage sépia à bord dentelé, portrait d'enfant, puis le tirage de l'adulte)
22. *(ép. 007)* **Le miroir ancien** à cadre doré dans une pièce au papier peint damassé : le reflet passe de l'adulte à l'enfant
23. *(ép. 007)* **Le fil des souvenirs** : un fil de lumière tenu par l'élève, avec des souvenirs accrochés qui s'éloignent vers le passé
24. *(ép. 007)* **La mémoire en mosaïque** : un souvenir en pellicule sur un réseau de neurones ; il se défait en tuiles, puis se recompose avec des différences
25. *(ép. 007)* **Le lac à l'aube**, avec l'élève assis en tailleur sur un rocher et le mot « MOI » en pierre qui se défait en poussière
26. *(ép. 007)* **La statue dans la brume**, entre trois marcheurs aux lanternes de couleur : elle se fissure
27. *(ép. 007)* **La galerie des trois cadres** (passé, présent, avenir) éclairés tour à tour
28. *(ép. 008)* **La vitrine éclairée** et les passants à contre-jour ; **la galerie claire** et le piédestal ; **le triangle mimétique** sur papier crème ; **la main et le sable** sur fond safran ; **la ville des écrans** au crépuscule ; **la spirale** du vertige ; **le désert de sel**
29. *(ép. 009)* **Le bureau au matin** (employé assis à contre-jour devant une grande fenêtre, horloge à 8 h) et **le bureau vu de dessus** (le tampon, les dossiers et leurs portraits qui pâlissent)
30. *(ép. 009)* **Le mur blanc et les fils** : une silhouette debout, son ombre immense, des fils dorés jusqu'aux poignets
31. *(ép. 009)* **Le laboratoire des années 1960** (murs vert pâle, générateur générique à 30 interrupteurs, vitre dépolie, blouse grise)
32. *(ép. 009)* **La salle d'audience claire** et sa cage de verre vide ; **la salle blanche** où des silhouettes identiques perdent leur petite lumière, sauf une
33. *(ép. 009)* **Le livre dans le rayon de lumière** (pupitre, fenêtre haute, poussière) ; **l'arc et le moucharabieh** dont le motif d'étoiles se dessine au sol
34. *(ép. 009)* **La rangée d'interrupteurs**, de VERTU à ABDICATION DE CONSCIENCE ; **la balance** (l'intention contre les actes) ; **le grand bureau vu d'en haut** et ses « ? » dorés qui s'éteignent
35. *(ép. 010)* **Le livre dont on tourne la page** (la tache d'encre transparaît encore) ; **les deux silhouettes séparées** dans une longue pièce claire
36. *(ép. 010)* **Le vase qui se fêle** (blesse, s'excuse, recommence) ; **la porte entrouverte** (liberté ou permission, la cale) ; **la porte grande ouverte**
37. *(ép. 010)* **Le chemin des trois pierres** (reprendre, se repentir, pardonner) ; **la cour aux deux arcs et le carreau réparé d'or** ; **le bol en kintsugi**
38. *(ép. 010)* **Les quatre objets barrés** (ce que le pardon n'est pas) ; **la chaise vide** dans un rai de lumière, entourée d'ombres qui exigent

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
