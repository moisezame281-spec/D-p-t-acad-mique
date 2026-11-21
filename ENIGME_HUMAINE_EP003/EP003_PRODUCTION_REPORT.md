# EP003 : rapport de production

**L'Énigme humaine, épisode 003 : « La foi s'oppose-t-elle à la raison ? »**
Produit le 21/11/2026 avec le **modèle de série** (`series/enigme-humaine/FORMAT.md`, `motion/tools/produce.sh`), avec la **voix C** (expressive, ton « professeur qui explique sa logique à un élève », silences courts).

## 1. Livrables

| Fichier | Contenu |
|---|---|
| `EP003_MASTER_9x16.mp4` | 1080×1920, 30 i/s, H.264, AAC 48 kHz, **82,5 s**, 100 Mo |
| `EP003_TIKTOK.mp4` / `EP003_YOUTUBE_SHORTS.mp4` | Identiques au master, puisque les exigences des plateformes sont respectées |
| `EP003_PROMO_15s.mp4` | La question d'ouverture, puis la question finale et le titre |
| `EP003_COVER.png` | Couverture : l'élève dans la bibliothèque, sous la question |
| `EP003_SUBTITLES.srt` | Sous-titres minutés au mot près |
| `EP003_SCRIPT.txt` / `EP003_REFERENCES.md` / `EP003_AUDIO_LICENSES.md` | Texte et minutage, sources vérifiées, droits |
| `EP003_AUDIO.wav` | Mixage final |

## 2. Mise en scène : une leçon à travers les siècles

| # | Scène | Ce qu'on voit |
|---|---|---|
| 01 | **La question** *(nouveau décor : la bibliothèque des siècles)* | Une bibliothèque monumentale en vraie perspective : voûte à caissons, deux étages de livres, une grande fenêtre au fond. L'élève est assis dans la pénombre, la main sur le front, à la lueur d'une bougie. Sur « Élève », la lumière de la fenêtre se lève. Puis LA FOI / s'oppose-t-elle / réellement / À LA RAISON ?, suivi d'une coupure du son. |
| 02 | **La distinction** *(nouveau : le manuscrit RATIO / FIDES)* | Un grand manuscrit ouvert, avec des lettrines et une écriture gothique abstraite. Un fil d'or trace la distinction dans la pliure. **À gauche, la raison** : des fondations, une affirmation au sommet, des liens de cohérence et les notes à la plume « cohérente ? » et « sur quoi repose-t-elle ? ». **À droite, la foi** : une lumière reçue d'en haut illumine la page, ligne après ligne. |
| 03 | **Deux démarches** *(nouveau : l'arche)* | À gauche, la raison bâtit, pierre après pierre ; à droite, la foi descend en voussoirs de lumière. Sur « attention », l'arche est incomplète. Sur « ennemie », la clé de voûte, moitié pierre et moitié lumière, tombe et tout tient : DIFFÉRENTE ≠ ENNEMIE. |
| 04 | **La Bible** *(nouveau : le lutrin)* | Une Bible ouverte près d'une fenêtre, dans la lumière du matin, avec une profondeur de champ, un signet et une tranche dorée. Une loupe de lumière parcourt les lignes (« Examinez toutes choses »), puis une ligne se souligne d'or (« retenez ce qui est bon »). Source affichée : 1 Thessaloniciens 5:21, trad. Louis Segond, 1910. |
| 05 | **Le Coran** *(nouveau : la cour à arcades)* | Une cour à arcades, un bassin et un dallage géométrique. Le soleil traverse le ciel et sa lumière passe sous les arcs, puis la nuit tombe (l'**alternance du jour et de la nuit**, 3:190). Les étoiles se relient en une figure géométrique : DES SIGNES. Le bassin reflète le ciel : *raison · réflexion*. |
| 06 | **Thomas d'Aquin** *(nouveau : la chapelle)* | Le panneau de Carlo Crivelli (1476, domaine public) dans un cadre doré, entre les vitraux et les bougies. Puis le schéma à deux niveaux : un escalier que gravit la raison (« ce qu'elle peut connaître »), une limite (« ce qui dépasse ses capacités ») et une rosace d'où descend la lumière (« la révélation »). |
| 07 | **La leçon** *(décor réutilisé, version aube)* | La bibliothèque à l'aube ; l'élève relève la tête. Le chiasme s'écrit en grand : CROIRE / ne dispense pas de / RÉFLÉCHIR. Puis les deux mots **s'échangent** le long de deux arcs : RÉFLÉCHIR / ne signifie pas nécessairement cesser de / CROIRE. |
| 08 | **La question à l'élève** | Gros plan sur l'élève et la bougie, tandis que des points de lumière (ses questions) montent du livre. Sur « peur », la flamme vacille et la main revient au front ; sur « poser », l'élève relève la tête vers la lumière. La question s'écrit mot après mot, puis viennent le titre et la musique de fin. |

## 3. Voix : version C, dirigée

- **Intentions par phrase** : *intime* pour l'ouverture et la question finale, *grave* pour la question centrale, *prof* pour les explications, *récit* pour les références, *élan* pour « Mais attention » et « voici la leçon ».
- **Silences rapides** : de 0,2 à 0,8 s entre les phrases, et un temps court après « élève : » dans la question finale.
- **Nouveautés du pipeline** (reportées dans `VOICE_DESIGN.md`) :
  - **Queues parasites coupées automatiquement.** Le moteur ajoutait parfois des syllabes après le dernier mot (« … une question, six litres », « … ce qui est bon. C'est… »).
  - **« Thessaloniciens »** : la lecture complète « la première lettre aux Thessaloniciens » a été retenue après le test de quatre graphies.
  - **« versets 190 et 191 »** : une prise n'a été retenue que si **deux modèles de transcription** entendent « 191 » (la petite transcription hésitait avec 181).

## 4. Contrôles

| Vérification | Résultat |
|---|---|
| Durée | ✅ 82,5 s, dans le format de 2 min maximum |
| Décodage intégral | ✅ Sans erreur |
| Transcription du master, modèle Whisper « medium » | ✅ **3,0 % d'écart hors écriture des nombres**. Restent des homophones (« ennemie/ennemi », « aux/au », « distinguait/distinguez »), « sura » pour « sourate », et « 5 », « 21 », « 190 », « 191 » écrits en chiffres. Aucun mot couvert par la musique. |
| Transcription du master, modèle « small » (contrôle automatique du pipeline) | 15,1 % d'écart brut, surtout les nombres en chiffres et des mots composés collés (« oppostelle »). Le modèle « medium », plus fiable, sert de référence. |
| Niveaux | ✅ Parole -10,5 dBFS, musique seule -16,4 dBFS, crête -0,5 dBFS |
| Sources | ✅ 1 Th 5:21 (LSG 1910 et SG21 comparées), Coran 3:190-191 (Hamidullah et Saheeh International, nom arabe vérifié), Thomas d'Aquin (*Stanford Encyclopedia*, *ST* Iª q. 1 a. 1), portrait du domaine public vérifié via l'API Commons |
| Respect des traditions | ✅ Aucune représentation de Dieu ni du Prophète, aucun texte coranique en arabe généré ; islam représenté par l'architecture et la géométrie |
| Lisibilité | ✅ Voile sombre ajouté derrière les titres de la cour en plein jour (le contraste était insuffisant au premier rendu) |
| Typographie et couleurs de la série | ✅ Instrument Serif, Bodoni Moda, Fraunces, rose grenat ; ouverture et clôture identiques |
| Musique | ✅ Originale et synthétisée : balancier des siècles, contrepoint raison / foi, accord de la clé de voûte, clarté du matin, carillon des étoiles, chœur sans paroles, résolution, voix presque seule sur la question, thème de fin |

## 5. Limites
- Documentaire graphique stylisé, sans photoréalisme.
- Je ne peux ni écouter ni regarder le résultat en continu : **un visionnage complet avec le son reste nécessaire avant publication.**
- Voix de synthèse (licence du corpus d'entraînement du timbre de référence à confirmer pour une publicité payante, voir `EP003_AUDIO_LICENSES.md`).

## 6. Publication (proposition)

**Accroche :** LA FOI S'OPPOSE-T-ELLE RÉELLEMENT À LA RAISON ?
**Description :** Une leçon à travers les siècles. La raison examine, la foi fait confiance : deux démarches différentes, mais pas ennemies. La Bible, le Coran et Thomas d'Aquin en témoignent. Et toi : ta foi résiste-t-elle à tes questions, ou as-tu peur de les poser ?
**Mots-clés :** #philosophie #foi #raison #ThomasDAquin #bac #philo #réflexion #LÉnigmeHumaine
