# EP008 : rapport de production

**L'Énigme humaine, épisode 008 : « Qui a choisi ce que tu désires ? »**

Produit le 23/11/2026 dans le **style validé**, avec tes deux nouvelles demandes :
- explication continue (voix C, chaque passage dit d'un seul tenant) ;
- une seule musique de fond continue ;
- fondus enchaînés en mouvement ;
- décors nouveaux ;
- **nouveau :** les questions sont aussi posées que l'ouverture ;
- **nouveau :** aucun personnage sur fond noir.

## 1. Livrables

| Fichier | Contenu |
|---|---|
| `EP008_MASTER_9x16.mp4` | 1080×1920, 30 i/s, H.264, AAC 48 kHz, **69,9 s** |
| `EP008_TIKTOK.mp4` / `EP008_YOUTUBE_SHORTS.mp4` | Identiques au master |
| `EP008_PROMO_15s.mp4` | 16 s : la question d'ouverture, puis la question finale entière et le titre |
| `EP008_COVER.png` | Couverture : la montre dans la vitrine éclairée, trois passants à contre-jour, sous le titre |
| `EP008_SUBTITLES.srt` | Sous-titres minutés au mot près |
| `EP008_SCRIPT.txt` / `EP008_REFERENCES.md` / `EP008_AUDIO_LICENSES.md` | Texte et minutage ; sources vérifiées ; droits |
| `EP008_AUDIO.wav` | Mixage final |

## 2. Tes deux demandes

### Le début et les questions, plus posés

| Passage | Débit |
|---|---|
| Question d'ouverture (« Et si certains de nos désirs… ? ») | **5,0 syllabes/s** (ralentie automatiquement de 14 %) |
| Suite de l'ouverture (« Une montre, un métier… ») | **5,1 syllabes/s** (ralentie de 6 %) |
| Explications (Girard, bouddhisme, algorithmes) | 5,4 syllabes/s (rythme habituel) |
| Question finale (« Si personne ne pouvait… ? ») | **5,1 syllabes/s** (fin ralentie de 15 %) |

**Comment c'est obtenu :**
- Chaque question est générée seule, avec un rythme plus posé.
- L'outil mesure ensuite le débit et étire légèrement le passage s'il dépasse 5 syllabes/s, sans changer la hauteur de la voix (jamais plus de 15 %).
- **La question finale** retombait quand elle était dite d'un seul souffle. Elle est maintenant dite en deux souffles enchaînés, et **« continuerions-nous à le désirer ? » monte vraiment** (+1,3 demi-ton naturel, complété de +3,2 sur « désirer »).
- La question d'ouverture monte naturellement de +9 demi-tons.

### Des personnages bien visibles

Toutes les silhouettes sont placées devant un fond clair ou à contre-jour :
- une vitrine éclairée ;
- une galerie claire ;
- un papier crème ;
- un fond safran ;
- des affiches lumineuses au crépuscule ;
- une spirale lumineuse ;
- un désert de sel blanc.

Un halo clair derrière chaque personnage et un liseré de lumière renforcent la lecture. Sur ces fonds clairs, un voile très discret derrière les sous-titres les garde lisibles. La règle est inscrite dans la charte de la série (`FORMAT.md`).

## 3. Mise en scène (tous les décors sont nouveaux)

| # | Scène | Ce qu'on voit |
|---|---|---|
| 01 | **La question** *(la vitrine éclairée)* | Une montre sur un coussin de velours, dans une vitrine très lumineuse. Trois passants la regardent, de dos, à contre-jour. La question s'écrit mot à mot. |
| 02 | **Le regard des autres** *(la galerie claire)* | Sur un piédestal blanc se succèdent une montre, une mallette (un métier), un mannequin (une silhouette) et deux alliances (une relation). Retour à la montre : « l'objet ne change pas ». Quatre visiteurs apparaissent, leurs regards en pointillés convergent, et la montre devient dorée. |
| 03 | **René Girard** *(le triangle mimétique, sur papier)* | Nom, dates et livre. Le triangle à l'encre relie SUJET, MODÈLE et OBJET, et une lumière montre que le désir passe par le modèle. Sur « rival », le lien devient rouge et les deux mains se tendent vers l'objet. La phrase de l'ARM est citée mot pour mot. |
| 04 | **La deuxième Noble Vérité** *(la main et le sable)* | Sur fond safran, un poing serré laisse filer le sable et prend racine dans une terre qui se fissure (« la soif », « l'attachement »). Sur « la manière », la main s'ouvre et le sable repose dans la paume. SN 56.11 est cité en traduction libre. |
| 05 | **Les algorithmes** *(la ville des écrans)* | Une place au crépuscule, des affiches lumineuses et des passants sur leur téléphone. Les cœurs de l'élève remontent vers les affiches, qui se mettent à montrer des modèles avec la même montre, puis se multiplient. Son doigt tape encore : c'est lui qui choisit. Les facteurs cités par TikTok sont affichés en bas. |
| 06 | **Le vertige** | Une spirale d'écrans vue d'en haut tourne et plonge vers l'élève, minuscule au centre. |
| 07 | **La question finale** *(le désert de sel)* | L'élève, seul, tient la montre. Autour de lui, les spectateurs disparaissent sur « admirer », sur « envier », puis sur « voir ». La question s'écrit mot à mot, puis viennent le titre et le thème de fin. |

## 4. Voix et musique

- **Voix C, en continu**, avec 3 à 6 prises par passage, jugées par Whisper « medium ».
- **« René Girard »** était mal prononcé (« Néjirar »). Une graphie phonétique (« René Jirar ») a été testée et validée par deux modèles de transcription. Le texte affiché reste « Girard ».
- **Musique de fond unique et continue :** nappe de cordes, basse, arpège de piano et pulsation douce, en **fa dièse mineur à 82 battements/min**. Sur les algorithmes, une pulsation légère en doubles croches évoque le défilement. Elle rejoint le thème de fin en ré majeur, sans coupure.

## 5. Contrôles

| Vérification | Résultat |
|---|---|
| Durée | ✅ 69,9 s |
| Décodage intégral | ✅ Sans erreur |
| Transcription du master, modèle « medium » | ✅ **Aucune erreur réelle** : 0,5 % d'écart, uniquement l'homophone « modèle » / « modèles » |
| Niveaux | ✅ __NIVEAUX__ |
| Sources | ✅ René Girard (site de l'Association Recherches Mimétiques : biographie, bibliographie, présentation de la théorie), SN 56.11 (SuttaCentral, Bhikkhu Bodhi et pāli), TikTok Newsroom (18 juin 2020) |
| Respect des traditions | ✅ Aucune représentation du Bouddha ni d'objet de culte ; synthèse « soif et attachement » expliquée dans les références |
| Marques | ✅ Montre, objets et affiches génériques, sans aucun logo |

## 6. Environnement
- Pour vérifier tes références, ces sites ont été ajoutés aux sites autorisés de ton environnement :
  - **rene-girard.fr** ;
  - **support.tiktok.com** et **www.tiktok.com** (la page d'aide, générée en JavaScript, est restée illisible) ;
  - **newsroom.tiktok.com** (l'explication officielle, utilisée à la place).

## 7. Limites
- Je ne peux ni écouter ni regarder le résultat en continu : **un visionnage complet avec le son reste nécessaire avant publication.**

## 8. Publication (proposition)

**Accroche :** QUI A CHOISI CE QUE TU DÉSIRES ?
**Description :** Une montre, un métier, une silhouette… et si c'était le regard des autres qui leur donnait leur valeur ? René Girard, la deuxième Noble Vérité et les algorithmes de recommandation éclairent nos désirs. Si personne ne pouvait voir ce que tu poursuis, le désirerais-tu encore ?
**Mots-clés :** #philosophie #désir #Girard #bouddhisme #algorithmes #bac #philo #LÉnigmeHumaine
