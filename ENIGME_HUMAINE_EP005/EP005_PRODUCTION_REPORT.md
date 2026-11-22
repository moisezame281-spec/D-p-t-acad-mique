# EP005 : rapport de production

**L'Énigme humaine, épisode 005 : « Et si tu ne cherchais pas la vérité, mais à avoir raison ? »**
Produit le 22/11/2026 dans le **style validé à l'ép. 004 v2** :
- explication continue (voix C, chaque scène dite d'un seul tenant) ;
- questions qui montent ;
- une seule musique de fond, continue ;
- fondus enchaînés en mouvement ;
- des décors nouveaux.

## 1. Livrables

| Fichier | Contenu |
|---|---|
| `EP005_MASTER_9x16.mp4` | 1080×1920, 30 i/s, H.264, AAC 48 kHz, **69,0 s** |
| `EP005_TIKTOK.mp4` / `EP005_YOUTUBE_SHORTS.mp4` | Identiques au master |
| `EP005_PROMO_15s.mp4` | 15 s : la question d'ouverture, puis la phrase finale et le titre |
| `EP005_COVER.png` | Couverture : l'élève sous la cloche de verre, sous la question |
| `EP005_SUBTITLES.srt` | Sous-titres minutés au mot près |
| `EP005_SCRIPT.txt` / `EP005_REFERENCES.md` / `EP005_AUDIO_LICENSES.md` | Texte et minutage ; sources vérifiées ; droits |
| `EP005_AUDIO.wav` | Mixage final |

## 2. Mise en scène (tous les décors sont nouveaux)

| # | Scène | Ce qu'on voit |
|---|---|---|
| 01 | **La question** *(la cloche de verre)* | L'élève sous une cloche de verre, dans une galerie de miroirs qui lui renvoient tous sa propre silhouette. Les silhouettes approuvent en même temps, et sous la cloche le mot « raison » résonne en écho. La lumière du dehors (la vérité) glisse sur le verre sans entrer. ET SI TU NE CHERCHAIS PAS / LA VÉRITÉ, / mais à avoir raison ? |
| 02 | **L'expérience** *(les deux observateurs)* | Une sphère de fragments orange et bleus sous un projecteur, entre deux observateurs. Les fragments volent vers eux, mais chacun ne garde que ceux de « sa » couleur, et leurs deux mémoires se remplissent différemment. |
| 03 | **Platon** *(la caverne)* | La caverne dessinée selon la description de la source : des prisonniers assis et enchaînés face à la paroi, un feu derrière eux, des porteurs qui élèvent un vase, un cheval et une statuette derrière un muret, leurs ombres sur la paroi. En haut, l'ouverture vers le jour s'éclaire sur « n'ont jamais connu autre chose ». |
| 04 | **Proverbes 18:17** *(deux lumières)* | Un cylindre sur un socle. Une première lampe projette un cercle (« une première version », ✓). Une seconde personne arrive avec sa lanterne et projette un rectangle sur l'autre mur (« … examinée », ?). Le verset est cité dans la Louis Segond 1910. |
| 05 | **Coran 17:36** *(le corridor)* | Un corridor d'arcs à motifs géométriques. La lanterne n'éclaire que le chemin connu ; le marcheur s'arrête au bord de l'obscurité. NE PAS SUIVRE / ce dont on n'a aucune connaissance. |
| 06 | **La psychologie** *(le filtre)* | Un flux d'informations roses et turquoise vers un visage. Un filtre ne laisse entrer que celles qui confortent les croyances, et ces croyances grossissent. BIAIS DE CONFIRMATION (Nickerson, 1998). |
| 07 | **La distinction** | À gauche, une forteresse et un bouclier : les questions rebondissent (DÉFENDRE une idée). À droite, un chemin vers l'horizon, une lanterne et une rose des vents (RECHERCHER sa vérité). Entre les deux, ≠. |
| 08 | **La cloche se fend** | Retour sous la cloche. La main touche le verre, qui se fend puis s'ouvre en éclats ; les reflets disparaissent, la lumière entre et l'élève sort. La phrase finale s'écrit mot après mot, puis viennent le titre et le thème de fin. |

## 3. Voix et musique

- **Voix C, en continu**, avec trois prises par scène, jugées par Whisper « medium » : aucune répétition, aucun bégaiement.
- **La question d'ouverture monte naturellement de +9 demi-tons** ; aucune correction n'a été nécessaire.
- **Nouveau contrôle automatique :** une prise qui continuait 4,9 s sans parole après le dernier mot (souffle du moteur) a été coupée. Cet outil fait désormais partie du pipeline.
- **Musique de fond unique et continue :** nappe de cordes, basse, arpège de piano et pulsation douce, en la mineur à 80 battements/min. Elle s'ouvre en la majeur quand la cloche se fend, puis rejoint le thème de fin. Elle n'a aucune coupure et reste audible sous la voix.

## 4. Contrôles

| Vérification | Résultat |
|---|---|
| Durée | ✅ 69,0 s |
| Décodage intégral | ✅ Sans erreur |
| Transcription du master, modèle « medium » | ✅ **1,1 % d'écart hors écriture des nombres** : « sourat » pour « sourate » et « conforte » pour « confortent » (homophones). |
| Transcription du master, modèle « small » | ✅ 6,6 % d'écart brut (nombres en chiffres) |
| Niveaux | ✅ Parole -10,4 dBFS, musique seule -15,2 dBFS, crête -0,6 dBFS |
| Sources | ✅ Platon (trois articles de la *Stanford Encyclopedia*, description exacte de la caverne), Pr 18:17 (LSG 1910 et SG21), Coran 17:36 (Hamidullah et Saheeh International, nom arabe vérifié), Nickerson (1998), vérifié dans Crossref |
| Respect des traditions | ✅ Aucune représentation de figure sacrée ; aucun texte coranique en arabe généré |

## 5. Choix éditorial à valider
- Le **titre** (« Et si tu ne cherchais pas la vérité, mais à avoir raison ? ») est **dit en ouverture**, comme accroche, parce que la narration ne contient pas de question. Le reste du texte est conservé mot pour mot. Je peux le retirer sur simple demande.

## 6. Limites
- Je ne peux ni écouter ni regarder le résultat en continu : **un visionnage complet avec le son reste nécessaire avant publication.**

## 7. Publication (proposition)

**Accroche :** ET SI TU NE CHERCHAIS PAS LA VÉRITÉ, MAIS À AVOIR RAISON ?
**Description :** Deux personnes voient le même événement, mais chacune ne retient que ce qui la conforte. Platon, la Bible, le Coran et la psychologie décrivent le même piège : défendre une idée n'est pas chercher sa vérité. Et si la véritable intelligence commençait au moment où l'on accepte d'être remis en question ?
**Mots-clés :** #philosophie #Platon #biaisdeconfirmation #vérité #esprit_critique #bac #philo #LÉnigmeHumaine
