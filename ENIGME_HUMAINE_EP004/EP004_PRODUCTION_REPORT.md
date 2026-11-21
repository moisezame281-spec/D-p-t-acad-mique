# EP004 : rapport de production

**L'Énigme humaine, épisode 004 : « Le bien a-t-il besoin de Dieu ? »**
Produit le 21/11/2026 avec le **modèle de série** et la **voix C** (expressive, ton « professeur qui explique sa logique à un élève », silences courts).
**Nouveauté demandée :** de vraies **transitions de mise en scène** entre chaque passage de la voix. Le reste du format est inchangé.

## 1. Livrables

| Fichier | Contenu |
|---|---|
| `EP004_MASTER_9x16.mp4` | 1080×1920, 30 i/s, H.264, AAC 48 kHz, **75,7 s** |
| `EP004_TIKTOK.mp4` / `EP004_YOUTUBE_SHORTS.mp4` | Identiques au master |
| `EP004_PROMO_15s.mp4` | Extrait de 19 s : la question d'ouverture, puis la question finale en entier, le débat et le titre |
| `EP004_COVER.png` | Couverture : la rue sous la pluie, sous la question |
| `EP004_SUBTITLES.srt` | Sous-titres minutés au mot près |
| `EP004_SCRIPT.txt` / `EP004_REFERENCES.md` / `EP004_AUDIO_LICENSES.md` | Texte, minutage et transitions ; sources vérifiées ; droits |
| `EP004_AUDIO.wav` | Mixage final |

## 2. Mise en scène

| # | Scène | Ce qu'on voit | Transition vers la suite |
|---|---|---|---|
| 01 | **La question** *(nouveau : la rue sous la pluie)* | La nuit, la pluie, un passage piéton et un inconnu à terre. Des phares approchent : le danger. Deux passants arrivent de chaque côté : le personnage de la série en sweat (« CROIT EN DIEU ») et un second en manteau (« NE CROIT PAS »). Tous deux s'agenouillent et tendent la main ; leurs deux gestes s'illuminent de la même lumière. Une balance d'or reste à l'équilibre : MOINS MORAL ? | **Plongée** : la caméra descend sous le trottoir et une ligne de lumière devient le sol de l'arbre. |
| 02 | **Deux choses** *(nouveau : l'arbre en coupe)* | Au-dessus du sol, le feuillage et ses fruits de lumière (ACCOMPLIR un acte juste) ; sous le sol, les racines qui poussent (EXPLIQUER pourquoi il faut être juste). | **Traversée de lumière** : on entre dans un fruit lumineux qui devient le vitrail de la nef. |
| 03 | **Matthieu 7:12** *(nouveau : la nef)* | Une nef en perspective, un grand vitrail et une Bible au lutrin. Deux personnes face à face, de part et d'autre d'une ligne de lumière : chacune tend la main et le geste répond au geste. Le verset est cité dans la Louis Segond 1910. | **Panoramique filé** : la colonnade de la nef est chassée par la forêt d'arcs. |
| 04 | **Coran 5:8** *(nouveau : la forêt d'arcs bicolores)* | Des arcs outrepassés rouges et crème sur colonnes, des puits de lumière et une ombre géométrique au sol. Une balance de lumière reste en équilibre entre deux personnes qui se tournent le dos et reçoivent la même lumière : RESTER JUSTE, même envers ceux que l'on déteste. | **Étoile** : une étoile à huit branches s'ouvre en tournant sur le cabinet de Kant. |
| 05 | **Kant** *(nouveau : le cabinet de Königsberg)* | Lambris, fenêtre étoilée et bougie ; le portrait de Becker (1768, domaine public) dans un cadre ovale doré. La caméra descend vers une boussole sur le bureau : des « intérêts » font dévier l'aiguille, qui revient vers DEVOIR. L'IMPÉRATIF CATÉGORIQUE. | **Page qui tourne.** |
| 06 | **La nuance** *(l'arbre, version nuit)* | Les deux passants agenouillés au pied de l'arbre, avec le même geste lumineux : la foi n'est pas UNE CONDITION NÉCESSAIRE pour accomplir un acte juste. Sur « fondement ultime », la caméra descend le long des racines. | **Descente continue.** |
| 07 | **La question ouverte** | Sous la terre, deux lumières de même intensité, l'une dorée (DIEU ?) et l'autre géométrique et blanche (LA RAISON ?). Les racines s'en approchent sans en toucher aucune. La question s'écrit mot après mot. | **Remontée** vers la rue à l'aube : les deux passants discutent, l'inconnu est assis. C'est là que commence LE VÉRITABLE DÉBAT. Puis le titre et la musique de fin. |

Chaque transition a son propre son (plongée, scintillement, souffle filé, carillon de l'étoile, page, remontée). Elles sont posées dans les silences courts entre deux phrases, si bien que la voix enchaîne sans attendre.

## 3. Voix : version C, contrôlée par deux modèles de transcription

- **« Kant »** était prononcé « quand » dans toutes les prises. J'ai testé trois graphies et retenu « Kante », que les modèles « small » et « medium » entendent tous deux « Kant ». Le texte affiché reste « Kant ».
- **Répétition cachée** : une prise redisait « l'autre non ». Le petit modèle ne l'entendait pas, le modèle « medium » l'a repérée. Elle est coupée grâce au nouveau réglage `trim_end`.
- **Queue parasite** coupée automatiquement après « même contre nos intérêts ».
- Une relecture complète de la voix par le modèle « medium » ne relève plus que des nombres écrits en chiffres.

## 4. Contrôles

| Vérification | Résultat |
|---|---|
| Durée | ✅ 75,7 s, dans le format de 2 min maximum |
| Décodage intégral | ✅ Sans erreur |
| Transcription du master, modèle « medium » | ✅ **1,2 % d'écart hors écriture des nombres** : uniquement « sourat » pour « sourate » et « Kant » pour la graphie « Kante ». 3,4 % d'écart brut, avec les nombres en chiffres. |
| Transcription du master, modèle « small » (contrôle automatique) | ✅ 4,6 % d'écart brut |
| Niveaux | ✅ Parole -10,4 dBFS, musique seule -16,6 dBFS, crête -0,5 dBFS |
| Sources | ✅ Mt 7:12 (LSG 1910 et SG21), Coran 5:8 (Hamidullah et Saheeh International, nom arabe vérifié), Kant (deux articles de la *Stanford Encyclopedia*), portrait du domaine public vérifié sur Commons |
| Consignes intellectuelles | ✅ Religion non présentée comme hostile aux non-croyants ; Kant non présenté comme ayant nié Dieu (il tient Dieu pour un postulat de la raison pratique) ; acte et fondement distingués ; débat laissé ouvert |
| Respect des traditions | ✅ Aucune représentation de Dieu, de Jésus ni du Prophète ; aucun texte coranique en arabe généré |
| Lisibilité | ✅ Voiles de lisibilité en dégradé, sans bande visible ; sous-titre de « L'un croit en Dieu, l'autre non » masqué, car les étiquettes au-dessus des passants disent la même chose |

## 5. Limites
- Documentaire graphique stylisé, sans photoréalisme.
- Je ne peux ni écouter ni regarder le résultat en continu : **un visionnage complet avec le son reste nécessaire avant publication.**
- Voix de synthèse (licence du corpus d'entraînement du timbre de référence à confirmer pour une publicité payante).

## 6. Publication (proposition)

**Accroche :** UNE PERSONNE QUI NE CROIT PAS EN DIEU PEUT-ELLE FAIRE LE BIEN ?
**Description :** Deux passants, un inconnu en danger : l'un croit en Dieu, l'autre non, et tous deux s'arrêtent. La Bible, le Coran et Kant éclairent la question, mais une nuance demeure : agir avec justice et fonder la justice, ce n'est pas la même chose. Le bien vient-il de Dieu, ou la raison peut-elle en reconnaître la valeur par elle-même ?
**Mots-clés :** #philosophie #morale #Kant #foi #raison #bac #philo #LÉnigmeHumaine
