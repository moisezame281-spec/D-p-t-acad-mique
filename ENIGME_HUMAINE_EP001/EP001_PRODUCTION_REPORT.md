# EP001 : rapport de production

**L'Énigme humaine, épisode pilote 001 : « Tu sais. Tu recommences. Pourquoi ? »**
Produit le 20/11/2026 · documentaire graphique cinématographique · 9:16 · français

---

## 1. Ce qui est livré

| Fichier | Contenu | Taille |
|---|---|---|
| `EP001_MASTER_9x16.mp4` | Master 1080×1920, 30 i/s, H.264 High, ~9,6 Mbit/s, AAC 48 kHz stéréo 256 kbit/s, 59,46 s | 71,4 Mo |
| `EP001_TIKTOK.mp4` | **Identique au master**, car les exigences de TikTok sont respectées | 71,4 Mo |
| `EP001_YOUTUBE_SHORTS.mp4` | **Identique au master**, car les exigences des Shorts sont respectées | 71,4 Mo |
| `EP001_PROMO_15s.mp4` | Extrait promotionnel de 15,05 s : l'accroche complète (« … Pourquoi ? »), un fondu, puis la question finale et le titre | 20,4 Mo |
| `EP001_COVER.png` | Couverture 1080×1920 : TU SAIS. / TU RECOMMENCES. / POURQUOI ? | 2,5 Mo |
| `EP001_SUBTITLES.srt` | 29 blocs, minutés au mot près, sans chevauchement | 2 Ko |
| `EP001_SCRIPT.txt` | Narration officielle intégrale, textes à l'écran et minutage par scène | 4 Ko |
| `EP001_REFERENCES.md` | Les 4 sources, vérifiées mot pour mot | 6 Ko |
| `EP001_AUDIO.wav` | Mixage final : voix, musique et effets, 48 kHz | 11,4 Mo |
| `EP001_AUDIO_LICENSES.md` | Droits de chaque élément | 3 Ko |

Les trois vidéos partagent volontairement le même rendu, comme le brief l'autorise : aucune modification artificielle n'a été faite pour multiplier les fichiers.

## 2. Comment l'épisode a été fabriqué

1. **Narration** : la voix déjà validée sur le projet (Kokoro, voix française `ff_siwis`), avec le texte officiel inchangé. Seule la graphie phonétique change, uniquement pour la synthèse : « Romains sept », « quatre-vingt-onze », et « akrasia » prononcé avec un *s* comme en grec. Un outil de transcription (faster-whisper) horodate ensuite chaque mot.
2. **Montage piloté par la voix** : chaque événement visuel est calé sur le mot exact. Par exemple :
   - « TU SAIS. » apparaît sur *savais* ;
   - la porte du bien s'allume sur *vouloir*, la porte rouge sur *mais faire* ;
   - la lumière inonde l'écran sur *purification* ;
   - ΑΚΡΑΣΙΑ apparaît sur *akrasia* ;
   - les icônes surgissent sur *lieu*, *heure* et *déclencheur* ;
   - le téléphone est posé sur *déclenche*.
3. **Images** : décors, personnage, lumières et typographie sont dessinés et animés par code, image par image (navigateur Chromium et canvas), puis encodés avec ffmpeg.
4. **Bande-son** : composition et design sonore entièrement synthétisés (`score.py`). La voix est toujours prioritaire : la musique baisse d'environ 8 dB sous la parole.

### Les scènes et leur rôle dans le récit
| # | Temps | Ce que montre l'image |
|---|---|---|
| 01 | 0:00–0:08 | Chambre de nuit, miroir, horloge à 23:47, post-it « Demain, j'arrête. » Le téléphone s'allume. Sur « le lendemain », l'horloge avance de 24 h, le ciel passe de la nuit au jour puis revient à la nuit, et l'homme réapparait, au même endroit, téléphone en main. TU SAIS. / TU RECOMMENCES. surgissent l'un après l'autre. Sur « Pourquoi ? », la lumière se coupe, le son se coupe, et POURQUOI ? apparaît seul. |
| 02 | 0:08–0:15 | La caméra plonge dans le reflet du miroir et ressort dans une enfilade d'arcades romanes. Un rayon de lumière éclaire un manuscrit (écriture abstraite, par sobriété). Le personnage s'arrête entre deux portes : le bien (ivoire), puis ce qu'il désapprouve (bordeaux), vers laquelle il repart. |
| 03 | 0:15–0:23 | Un univers différent : arc brisé, moucharabieh à étoiles à huit branches, soleil qui se lève (Ash-Shams signifie « le soleil »). Un point de lumière apparaît pour l'âme, une ligne au sol sépare l'ombre et la lumière pour le discernement, puis la lumière dorée envahit tout pour la purification. |
| 04 | 0:23–0:29 | Deux plans nettement séparés, l'un sur l'autre, divisés par une ligne lumineuse. Aucun symbole n'est fusionné. |
| 05 | 0:29–0:36 | Bibliothèque monumentale, buste stylisé portant l'inscription ΑΡΙΣΤΟΤΕΛΗΣ, travelling circulaire suggéré par la parallaxe. Les rayonnages s'effacent derrière un réseau lumineux abstrait, traversé d'impulsions chaudes sur *désir* et *émotion*. |
| 06 | 0:36–0:45 | Ville la nuit. Le même personnage, sous un lampadaire. Les déclencheurs apparaissent (lieu, heure, notification), il fait le geste, puis des répétitions fantômes du même geste. Le schéma en boucle DÉCLENCHEUR → HABITUDE → AUTOMATISME se comprend sans le son. |
| 07 | 0:45–0:59 | Retour au miroir. Il pose le téléphone, l'écran s'éteint, il quitte la pièce. Le miroir reste vide pendant que l'aube monte. Apparaissent ensuite : CE QUE TU NE COMPRENDS PAS DE TOI… (sans voix, le temps de le lire), la question finale, puis L'ÉNIGME HUMAINE. / FAIS TA PROPRE RÉFLEXION. Silence final. |

## 3. Contrôle qualité

| Vérification | Résultat |
|---|---|
| Durée entre 58 et 60 s | ✅ 59,46 s |
| Narration complète et intelligible | ✅ Transcription automatique du fichier final comparée au script : **4,3 % d'écart**, uniquement des homophones ou des graphies (« Romain/Romains », « trahi/trahis », « Aristot », « Acracia »). Aucun mot n'est couvert par la musique. |
| Synchronisation voix et images | ✅ Tous les repères visuels sont calculés à partir de l'horodatage mot à mot de la voix |
| Prononciation | ✅ Aristote, akrasia [akʁasja], « Romains sept », « quatre-vingt-onze ». « Ash-Shams » n'est pas prononcé dans le script officiel : il est affiché à l'écran. |
| Références exactes et vérifiées | ✅ Téléchargées depuis Bible Gateway (SG21), Quran.com (Hamidullah, Saheeh International), Crossref et la Stanford Encyclopedia of Philosophy. Voir `EP001_REFERENCES.md`. |
| Aucune citation inventée | ✅ |
| Cohérence entre les scènes | ✅ Palette du brief, personnage unique, transitions qui ont un sens (miroir → arcade, lumière → soleil, ligne → bibliothèque, réseau → ville, écran → miroir) |
| Personnage cohérent | ✅ Une seule définition de silhouette (proportions, coiffure, sweat, téléphone), réutilisée dans les scènes 1, 2, 3, 6 et 7 |
| Sous-titres synchronisés | ✅ Incrustés dans la vidéo **et** fournis en SRT, avec les mêmes blocs et le même minutage |
| Aucun texte coupé ou illisible | ✅ Taille ajustée automatiquement, vérifiée image par image sur le fichier final |
| Zones de sécurité mobiles | ✅ Sous-titres entre y = 1300 et 1400 px, x de 80 à 910 px (à l'écart des boutons à droite et de la légende en bas). Titres entre y = 150 et 1240 px. |
| Musique correctement licenciée | ✅ Composition originale synthétisée, sans tiers (voir licences) |
| Export vertical conforme | ✅ 1080×1920, 9:16, 30 i/s, H.264, AAC 48 kHz, MP4 avec lecture progressive (« faststart ») |
| Lecture intégrale sans erreur | ✅ Décodage complet du master avec ffmpeg sans aucune erreur |
| Niveaux sonores | Parole autour de -10,5 dBFS, musique seule autour de -17,5 dBFS, crête à -0,5 dBFS. Silence réel sur « Pourquoi ? » et sur la dernière demi-seconde. |

## 4. Écarts avec le brief et blocages (en toute transparence)

1. **Pas d'images photoréalistes.**
   - Le brief décrit un homme filmé, un buste en marbre et une ville réelle. Cette machine n'a pas de carte graphique (GPU), ce qui exclut la génération de vidéo.
   - L'installation d'un générateur d'images à licence commerciale (FLUX.1 schnell, Apache-2.0) a été **bloquée par le système de sécurité de l'environnement** (mode d'autorisation automatique), au moment de compiler l'outil.
   - Comme convenu, l'épisode est donc un **documentaire graphique stylisé** : silhouettes en contre-jour, décors dessinés, vrais mouvements de caméra, lumière, profondeur, particules et grain. Ce n'est pas de la prise de vue réelle et rien ne le prétend.
   - *Pour en profiter dans les prochains épisodes :* autoriser la compilation de l'outil (règle d'autorisation Bash dans les réglages de Claude Code), ou fournir des plans tournés ou générés ailleurs, avec des droits commerciaux.
2. **La voix « grave » demandée** : la voix validée sur le projet est une voix féminine de synthèse. Elle est calme et posée, mais pas grave. Une voix plus grave demanderait une autre voix ; la copie de ta propre voix reste possible.
3. **Pas d'écoute ni de visionnage humain pendant la production.** Le contrôle a été fait par mesures : transcription automatique, niveaux sonores, échantillonnage d'images, décodage complet. **Un visionnage complet, avec le son, est indispensable avant publication.**
4. **Licence du corpus de la voix `ff_siwis`** : à confirmer avant une campagne publicitaire payante (voir `EP001_AUDIO_LICENSES.md`).

## 5. Publication (textes du brief, prêts à copier)

**TikTok**
- Accroche : TU SAIS. TU RECOMMENCES. POURQUOI ?
- Description : Nous savons parfois ce qui est bon pour nous. Pourtant, nous faisons exactement le contraire. La Bible, le Coran, Aristote et la psychologie proposent chacun un éclairage différent sur cette contradiction humaine. Et toi, qu'est-ce qui te ramène toujours au même choix ?
- Hashtags : #LEnigmeHumaine #Philosophie #Psychologie #Spiritualité #Réflexion

**YouTube Shorts**
- Titre : Pourquoi recommençons-nous ce que nous savons mauvais ? | L'Énigme humaine #01
- Description : Pourquoi la volonté ne suffit-elle pas toujours à guider nos comportements ? Dans ce premier épisode de L'Énigme humaine, nous confrontons quatre perspectives : biblique, islamique, philosophique et psychologique. Références : Bible : Romains 7:19-21 · Coran : sourate Ash-Shams 91:7-10 · Aristote : Éthique à Nicomaque, livre VII · Verplanken et Orbell : Attitudes, Habits, and Behavior Change (2022). Une minute pour penser autrement. #Shorts #Philosophie #Psychologie #Spiritualité
- Commentaire épinglé : Quelle est, selon toi, la différence entre savoir ce qui est bon et réussir à le pratiquer ?

*Conseil :* sur TikTok, choisis `EP001_COVER.png` comme couverture. Les sous-titres étant déjà incrustés, désactive les sous-titres automatiques des plateformes pour éviter un double affichage, ou importe `EP001_SUBTITLES.srt` sur YouTube à la place.

## 6. Reproduire le rendu

```bash
cd motion && npm install
# narration + minutage (environnement Python avec kokoro-onnx et faster-whisper)
python tools/narrate.py projects/enigme-ep001/narration.json <modele-kokoro> /tmp/ep1
cp /tmp/ep1/timeline.json projects/enigme-ep001/
node tools/render.js enigme-ep001 /tmp/ep1render 4 30            # images
python3 projects/enigme-ep001/score.py /tmp/ep1render/sfx.json /tmp/ep1/voice.wav /tmp/ep1render/audio.wav
projects/enigme-ep001/export.sh /tmp/ep1render ../ENIGME_HUMAINE_EP001 /tmp/ep1/subtitles.srt   # master, copies, promo
```
